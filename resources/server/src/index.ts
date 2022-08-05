import { onClient, type Player } from 'alt-server';
import type { ChatPipeline } from './chat-pipeline.type';

const chatPipelines: Array<ChatPipeline> = [];

onClient('vchat:message', (player: Player, message: string) => {
    for (const pipeline of chatPipelines) message = pipeline(player, message);
});

export function addPipeline(fn: ChatPipeline) {
    chatPipelines.push(fn);
}

export function removeDefaultPipeline() {
    chatPipelines.shift();
}
