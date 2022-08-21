import type { Player } from 'alt-server';

export type ChatHandler = (player: Player, message: string) => void;
