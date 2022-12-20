import type { Player } from 'alt-server';
import { singleton } from 'tsyringe';
import type { MountCallback } from '../types';

@singleton()
export class MountService {
    private readonly listeners = new Map<number, MountCallback>();
    private readonly players = new Set<Player>();
    private readonly freeIds = [] as Array<number>;
    private readonly waiters = new Map<Player, Array<Function>>();

    private currentId = -1;

    public onMounted(fn: MountCallback) {
        const id = this.freeIds.pop() ?? ++this.currentId;
        this.listeners.set(id, fn);
        return id;
    }

    public offMounted(id: number) {
        const removed = this.listeners.delete(id);
        removed && this.freeIds.push(id);
        return removed;
    }

    public markAsMounted(player: Player) {
        this.players.add(player);
        this.waiters.get(player)?.forEach((fn) => fn());
        this.listeners.forEach((fn) => fn(player, true));
    }

    public markAsUnmounted(player: Player) {
        this.players.delete(player);
        this.waiters.delete(player);
        this.listeners.forEach((fn) => fn(player, false));
    }

    public isMounted(player: Player) {
        return this.players.has(player);
    }

    public waitForMount(player: Player, fn: Function | undefined) {
        if (!fn) return;

        if (this.isMounted(player)) {
            fn();
            return;
        }

        const waiters = this.waiters.get(player) ?? [];
        waiters.push(fn);
        this.waiters.set(player, waiters);
    }
}
