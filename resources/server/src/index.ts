import { emitAllClients, on, onClient, type Player } from 'alt-server';
import type { ChatPipeline } from './chat-pipeline.type';
import { PedModel } from './ped-model.enum';

const chatPipelines: Array<ChatPipeline> = [];

onClient('vchat:message', (player: Player, message: string) => {
    for (const pipeline of chatPipelines) message = pipeline(player, message);
    emitAllClients('vchat:message', message.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
});

const models = Object.keys(PedModel);

on('playerConnect', (player: Player) => {
    player.spawn(0, 0, 72);
    player.model = models[Math.floor(Math.random() * models.length)] as string;
});

export function addPipeline(fn: ChatPipeline) {
    chatPipelines.push(fn);
}

export function removeDefaultPipeline() {
    chatPipelines.shift();
}
