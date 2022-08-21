import { emitAllClients, emitClient, log, logError, on, onClient, type Player } from 'alt-server';
import type { ChatHandler, CommandHandler } from './types';
import { PedModel } from './ped-model.enum';
import { processMessage } from './message-processor';

const cmdHandlers: Map<string, CommandHandler> = new Map();
const mutedPlayers: Set<Player> = new Set();

// --------------------------------------------------------------
// Client Events
// --------------------------------------------------------------

function invokeCommand(player: Player, cmdName: string, args: Array<string>) {
    cmdName = cmdName.toLowerCase();
    const callback = cmdHandlers.get(cmdName);

    if (callback) callback(player, args);
    else send(player, `Unknown command /${cmdName}`);
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

onClient('vchat:message', (player: Player, message: string) => chatHandler(player, message));

// --------------------------------------------------------------
// Exported Functions
// --------------------------------------------------------------

export function mute(player: Player) {
    mutedPlayers.add(player);
}

export function send(player: Player, message: string) {
    message = processMessage(message);
    emitClient(player, 'vchat:message', message);
}

export function broadcast(message: string) {
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

// export function setup(player: Player) {}

// --------------------------------------------------------------

const models = Object.keys(PedModel);

on('playerConnect', (player: Player) => {
    player.spawn(0, 0, 72);
    player.model = models[Math.floor(Math.random() * models.length)] as string;
});
