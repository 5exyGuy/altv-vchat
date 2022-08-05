import type { Player } from 'alt-server';

export type ChatPipeline = (player: Player, message: string) => string;
