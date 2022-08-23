import { emitAllClients, emitClientRaw, log, logError, on, onClient, Player } from 'alt-server';
import type { ChatHandler, CommandHandler, MountCallback } from './types';
import { processMessage } from './message-processor';
import { PREFIX, WAIT_FOR_MOUNT_TIMEOUT } from './constants';
import { MessageType } from './enums';
import type { CommandSuggestion } from './interfaces';

// --------------------------------------------------------------
// Variables
// --------------------------------------------------------------

// Commands
const cmdHandlers: Map<string, CommandHandler> = new Map(); // The command handlerss
// Muted players
const mutedPlayers: Set<Player> = new Set(); // The players that are muted.
// Mounted players
const mountedListeners: Map<number, MountCallback> = new Map();
const mountedPlayers: Set<Player> = new Set(); // The players that have chat mounted.
const mountedFreeIds: Array<number> = []; // The free ids.
let currentMountedId: number = -1;

// --------------------------------------------------------------
// Functions
// --------------------------------------------------------------

/**
 * Invokes the command handler for the specified command.
 */
function invokeCommand(player: Player, cmdName: string, args: Array<string>) {
    cmdName = cmdName.toLowerCase();
    const callback = cmdHandlers.get(cmdName);
    callback ? callback(player, args) : send(player, `Unknown command ${PREFIX}${cmdName}`, MessageType.Error);
}

/**
 * Validates the specified message.
 */
function validateMessage(message: string, type: MessageType) {
    if (typeof message !== 'string') {
        logError(`[vchat:send] Message is not a string: ${message}`);
        return false;
    }
    if (!MessageType.hasOwnProperty(type)) {
        logError(`[vchat:send] Unknown message type: ${type}`);
        return false;
    }

    return true;
}

/**
 * Validates the command name.
 */
function validateCommandName(cmdName: string) {
    if (typeof cmdName !== 'string') {
        logError(`[vchat:registerCommand] Command name is not a string: ${cmdName}`);
        return false;
    }
    if (cmdName.length === 0) {
        logError(`[vchat:registerCommand] Command name is empty`);
        return false;
    }
    if (cmdName.startsWith(PREFIX)) {
        logError(`[vchat:registerCommand] Command name cannot start with ${PREFIX}`);
        return false;
    }

    return true;
}

/**
 * Validates a command suggestion.
 */
function validateSuggestion(suggestion: CommandSuggestion) {
    if (typeof suggestion !== 'object') return false;
    if (!suggestion.name || typeof suggestion.name !== 'string') return false;
    if (suggestion.description && typeof suggestion.description !== 'string') return false;
    if (suggestion.params && !Array.isArray(suggestion.params)) return false;

    if (suggestion.params) {
        for (const param of suggestion.params) {
            if (!param.name || typeof param.name !== 'string') return false;
            if (param.description && typeof param.description !== 'string') return false;
        }
    }

    return true;
}

/**
 * Waits for the player's chat to be mounted.
 */
async function waitForMount(player: Player) {
    if (mountedPlayers.has(player)) return true;
    return new Promise((resolve, reject) => {
        let id = onMounted((_player: Player, mounted: boolean) => {
            if (player === _player && mounted) {
                resolve();
                id = offMounted(id);
            }
        });
        setTimeout(() => {
            offMounted(id);
            reject();
        }, WAIT_FOR_MOUNT_TIMEOUT);
    }) as Promise<void>;
}

// --------------------------------------------------------------
// Local Events
// --------------------------------------------------------------

on('playerDisconnect', (player: Player) => {
    if (mountedPlayers.has(player)) {
        mountedPlayers.delete(player);
        mountedListeners.forEach((listener) => (listener as MountCallback)(player, false));
    }
});

// --------------------------------------------------------------
// Client Events
// --------------------------------------------------------------

const DEFAULT_CHAT_HANDLER: ChatHandler = (player: Player, message: string) => {
    if (typeof message !== 'string') return;

    if (message.startsWith('/')) {
        const words = message.trim().slice(1);

        if (words.length > 0) {
            log(`[vchat:command] ${player.name}: ${PREFIX}${words}`);

            let args = words.split(' ');
            let cmdName = args.shift() ?? '';

            invokeCommand(player, cmdName, args);
        }
    } else {
        if (mutedPlayers.has(player)) {
            send(player, 'You are currently muted.', MessageType.Error);
            return;
        }

        message = message.trim();

        if (message.length > 0) {
            log(`[vchat:message] ${player.name}: ${message}`);
            message = processMessage(`**${player.name}:** ${message}`);
            emitAllClients('vchat:message', message);
        }
    }
};
let chatHandler: ChatHandler | undefined | null = DEFAULT_CHAT_HANDLER;

/**
 * Marks the player's chat as mounted.
 */
function mount(player: Player, mounted: boolean) {
    if (!mounted && !mountedPlayers.has(player)) return;
    mountedPlayers.add(player);
    mountedListeners.forEach((listener) => (listener as MountCallback)(player, mounted));
}

onClient('vchat:message', (player: Player, message: string) => chatHandler && chatHandler(player, message));
onClient('vchat:mounted', mount);

// --------------------------------------------------------------
// Exported Functions
// --------------------------------------------------------------

/**
 * Sends a message to the player.
 */
export function send(player: Player, message: string, type: MessageType = MessageType.Default) {
    if (!validateMessage(message, type)) return;
    waitForMount(player)
        .then(() => emitClientRaw(player, 'vchat:message', message, type))
        .catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}

/**
 * Sends a message to all players.
 */
export function broadcast(message: string, type: MessageType = MessageType.Default) {
    if (!validateMessage(message, type)) return;
    Player.all.forEach((player) => send(player, message, type));
}

/**
 * Adds a command suggestion to the player's chat webview.
 */
export function addSuggestion(player: Player, suggestion: CommandSuggestion) {
    if (!validateSuggestion(suggestion)) {
        log(`[vchat:addSuggestion] Invalid suggestion`);
        return;
    }
    waitForMount(player)
        .then(() => emitClientRaw(player, 'vchat:addSuggestion', suggestion))
        .catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}

/**
 * Adds command suggestions to the player's chat webview.
 */
export function addSuggestions(player: Player, suggestions: Array<CommandSuggestion>) {
    if (!Array.isArray(suggestions)) {
        log(`[vchat:addSuggestions] Invalid suggestions`);
        return;
    } else {
        for (const suggestion of suggestions) {
            if (validateSuggestion(suggestion)) continue;
            log(`[vchat:addSuggestions] Invalid suggestion`);
            return;
        }
    }
    waitForMount(player)
        .then(() => emitClientRaw(player, 'vchat:addSuggestions', suggestions))
        .catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}

/**
 * Toggles the player's chat focus activation.
 */
export function toggleFocusEnabled(player: Player, enabled: boolean) {
    waitForMount(player)
        .then(() => emitClientRaw(player, 'vchat:focusEnabled', enabled))
        .catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}

/**
 * Focuses the player's chat.
 */
export function focus(player: Player) {
    waitForMount(player)
        .then(() => emitClientRaw(player, 'vchat:focus', true))
        .catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}

/**
 * Unfocuses the player's chat.
 */
export function unfocus(player: Player) {
    waitForMount(player)
        .then(() => emitClientRaw(player, 'vchat:focus', false))
        .catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}

/**
 * Clears the player's chat history from the local storage.
 */
export function clearHistory(player: Player) {
    emitClientRaw(player, 'vchat:clearHistory');
}

/**
 * Clears the player's chat in the webview.
 */
export function clear(player: Player) {
    waitForMount(player)
        .then(() => emitClientRaw(player, 'vchat:clear'))
        .catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}

/**
 * Subscribes to mount event and returns the id of the subscription.
 */
export function onMounted(fn: MountCallback) {
    mountedFreeIds.length > 0 ? (currentMountedId = mountedFreeIds.pop() as number) : currentMountedId++;
    mountedListeners.set(currentMountedId, fn);
    return currentMountedId;
}

/**
 * Unsubscribes from mount event with the specified id.
 */
export function offMounted(id: number) {
    if (id === -1) return id;
    if (mountedListeners.delete(id)) {
        mountedFreeIds.push(id);
        return -1;
    }
    log(`[vchat:offMounted] No mount event with id ${id} found`);
    return -1;
}

/**
 * Checks if the player's chat is mounted.
 */
export function isMounted(player: Player) {
    return mountedPlayers.has(player);
}

/**
 * Mutes the player from sending messages.
 */
export function mutePlayer(player: Player) {
    mutedPlayers.add(player);
}

/**
 * Unmutes the player from sending messages.
 */
export function unmutePlayer(player: Player) {
    mutedPlayers.delete(player);
}

/**
 * Checks if the player is muted.
 */
export function isMuted(player: Player) {
    return mutedPlayers.has(player);
}

/**
 * Registers a command handler to the specified command.
 */
export function registerCmd(cmdName: string, handler: CommandHandler) {
    if (!validateCommandName(cmdName)) return;
    cmdName = cmdName.toLocaleLowerCase();
    cmdHandlers.has(cmdName)
        ? logError(`Failed to register command ${PREFIX}${cmdName}, already registered`)
        : cmdHandlers.set(cmdName, handler);
}

/**
 * Unregisters a command handler from the specified command.
 */
export function unregisterCmd(cmdName: string) {
    if (!validateCommandName(cmdName)) return;
    cmdName = cmdName.toLocaleLowerCase();
    !cmdHandlers.has(cmdName)
        ? logError(`Failed to unregister command /${cmdName}, not registered`)
        : cmdHandlers.delete(cmdName);
}

/**
 * Sets the chat handler.
 */
export function setMessageHandler(fn: ChatHandler) {
    chatHandler = fn;
}

/**
 * Removes the chat handler.
 */
export function removeMessageHandler() {
    chatHandler = undefined;
}

/**
 * Sets the chat handler to the default handler.
 */
export function restoreMessageHandler() {
    chatHandler = DEFAULT_CHAT_HANDLER;
}

export { processMessage };
