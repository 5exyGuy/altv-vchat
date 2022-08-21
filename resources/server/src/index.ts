import { emitAllClients, emitClient, log, logError, offClient, on, onClient, type Player } from 'alt-server';
import type { ChatHandler, CommandHandler, MountCallback } from './types';
import { PedModel } from './ped-model.enum';
import { processMessage } from './message-processor';
import { PREFIX } from './constants';
import { MessageType } from './enums';
import type { CommandSuggestion } from './interfaces';

// --------------------------------------------------------------
// Variables
// --------------------------------------------------------------

const cmdHandlers: Map<string, CommandHandler> = new Map();
const mutedPlayers: Set<Player> = new Set();
const mountedPlayers: Set<Player> = new Set();

// --------------------------------------------------------------
// Functions
// --------------------------------------------------------------

function invokeCommand(player: Player, cmdName: string, args: Array<string>) {
    cmdName = cmdName.toLowerCase();
    const callback = cmdHandlers.get(cmdName);

    if (callback) callback(player, args);
    else send(player, `Unknown command ${PREFIX}${cmdName}`);
}

// --------------------------------------------------------------
// Client Events
// --------------------------------------------------------------

let chatHandler: ChatHandler = (player: Player, message: string) => {
    if (typeof message !== 'string') return;

    if (message.startsWith('/')) {
        const words = message.trim().slice(1);

        if (words.length > 0) {
            log('[vchat:command] ' + player.name + ': /' + words);

            let args = words.split(' ');
            let cmdName = args.shift() ?? '';

            invokeCommand(player, cmdName, args);
        }
    } else {
        if (mutedPlayers.has(player)) {
            send(player, 'You are currently muted.');
            return;
        }

        message = message.trim();

        if (message.length > 0) {
            log('[vchat:message] ' + player.name + ': ' + message);
            message = processMessage(`**${player.name}:** ${message}`);
            emitAllClients('vchat:message', message);
        }
    }
};

function mount(player: Player, mounted: boolean) {
    if (mounted && !mountedPlayers.has(player)) return;
    mountedPlayers.add(player);
}

onClient('vchat:message', (player: Player, message: string) => chatHandler(player, message));
onClient('vchat:mounted', mount);

// --------------------------------------------------------------
// Exported Functions
// --------------------------------------------------------------

export function addSuggestion(player: Player, suggestion: CommandSuggestion) {
    emitClient(player, 'vchat:addSuggestion', suggestion);
}

export function addSuggestions(suggestions: Array<CommandSuggestion>) {
    emitAllClients('vchat:addSuggestions', suggestions);
}

export function onMounted(fn: MountCallback) {
    onClient('vchat:mounted', fn);
}

export function offMounted(fn: MountCallback) {
    offClient('vchat:mounted', fn);
}

export function isMounted(player: Player) {
    return mountedPlayers.has(player);
}

export function mutePlayer(player: Player) {
    mutedPlayers.add(player);
}

export function unmutePlayer(player: Player) {
    mutedPlayers.delete(player);
}

export function send(player: Player, message: string, type: MessageType = MessageType.Default) {
    emitClient(player, 'vchat:message', message);
}

export function broadcast(message: string, type: MessageType = MessageType.Default) {
    emitAllClients('vchat:message', message);
}

export function registerCmd(cmdName: string, handler: CommandHandler) {
    cmdName = cmdName.toLocaleLowerCase();

    if (cmdHandlers.has(cmdName)) logError(`Failed to register command /${cmdName}, already registered`);
    else cmdHandlers.set(cmdName, handler);
}

export function setHandler(fn: ChatHandler) {
    chatHandler = fn;
}

export function setup(player: Player) {}

export { processMessage };

// --------------------------------------------------------------

const models = Object.keys(PedModel);

on('playerConnect', (player: Player) => {
    player.spawn(0, 0, 72);
    player.model = models[Math.floor(Math.random() * models.length)] as string;
});

registerCmd('spawn', (player: Player, args: Array<string>) => {
    player.spawn(0, 0, 72);
    console.log(args);
});
