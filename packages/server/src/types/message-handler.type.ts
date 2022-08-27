import type { Player } from 'alt-server';

export type MessageHandler = (player: Player, message: string) => void;
