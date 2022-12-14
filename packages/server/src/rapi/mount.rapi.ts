import type { Player } from 'alt-server';
import { container } from 'tsyringe';
import { MountService } from '../services/mount.service';
import type { MountCallback } from '../types';

/**
 * Subscribes to mount event and returns the id of the subscription.
 */
export function onMounted(fn: MountCallback) {
    return container.resolve(MountService).onMounted(fn);
}

/**
 * Unsubscribes from mount event with the specified id.
 */
export function offMounted(id: number) {
    return container.resolve(MountService).offMounted(id);
}

/**
 * Checks if the player's chat is mounted.
 */
export function isMounted(player: Player) {
    return container.resolve(MountService).isMounted(player);
}
