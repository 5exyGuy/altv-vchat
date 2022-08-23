import type { Player } from 'alt-server';

export type CommandHandler = (player: Player, args: Array<string>) => void;
