import {
    emitAllClients,
    emitClient,
    log,
    logError,
    offClient,
    on,
    onClient,
    Vector3,
    Vehicle,
    type Player,
} from 'alt-server';
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
    else send(player, `Unknown command ${PREFIX}${cmdName}`, MessageType.Error);
}

// --------------------------------------------------------------
// Client Events
// --------------------------------------------------------------

let chatHandler: ChatHandler = (player: Player, message: string) => {
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

function mount(player: Player, mounted: boolean) {
    if (mounted && !mountedPlayers.has(player)) return;
    mountedPlayers.add(player);
}

onClient('vchat:message', (player: Player, message: string) => chatHandler(player, message));
onClient('vchat:mounted', mount);

// --------------------------------------------------------------
// Exported Functions
// --------------------------------------------------------------

export function clearHistory(player: Player) {
    emitClient(player, 'vchat:clearHistory');
}

export function clear(player: Player) {
    emitClient(player, 'vchat:clear');
}

export function addSuggestion(player: Player, suggestion: CommandSuggestion) {
    emitClient(player, 'vchat:addSuggestion', suggestion);
}

export function addSuggestions(player: Player, suggestions: Array<CommandSuggestion>) {
    emitClient(player, 'vchat:addSuggestions', suggestions);
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
    emitClient(player, 'vchat:message', message, type);
}

export function broadcast(message: string, type: MessageType = MessageType.Default) {
    emitAllClients('vchat:message', message, type);
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
    if (args.length < 1) return;
    if (!args[0]) return;

    new Vehicle(args[0], player.pos, Vector3.zero);
});

registerCmd('info', (player: Player) => {
    console.log('info');
    send(player, 'This is a test', MessageType.Info);
});

registerCmd('success', (player: Player) => {
    console.log('success');
    send(player, 'This is a test', MessageType.Success);
});

registerCmd('warning', (player: Player) => {
    console.log('warning');
    send(player, 'This is a test', MessageType.Warning);
});

registerCmd('error', (player: Player) => {
    console.log('error');
    send(player, 'This is a test', MessageType.Error);
});

onMounted((player: Player, _mounted: boolean) => {
    addSuggestions(player, [
        { name: 'help', description: 'Show this help !' },
        {
            name: 'help',
            description: 'Show this help #',
            parameters: [{ name: 'page', description: 'Help page' }],
        },
        {
            name: 'ban',
            description: 'Ban a player',
            parameters: [
                { name: 'player', description: "Player's name" },
                { name: 'reason', description: 'Reason' },
            ],
        },
        {
            name: 'heal',
            description: 'Heal a player',
            parameters: [{ name: 'player', description: "Player's name" }],
        },
    ]);
});
