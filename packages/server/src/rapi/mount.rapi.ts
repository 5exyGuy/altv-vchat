import type { Player } from 'alt-server';
import { MountService } from '../services/mount.service';
import type { MountCallback } from '../types';

/**
 * Subscribes to mount event and returns the id of the subscription.
 */
export function onMounted(fn: MountCallback) {
    return MountService.getInstance().onMounted(fn);
}

/**
 * Unsubscribes from mount event with the specified id.
 */
export function offMounted(id: number) {
    return MountService.getInstance().offMounted(id);
}

/**
 * Checks if the player's chat is mounted.
 */
export function isMounted(player: Player) {
    return MountService.getInstance().isMounted(player);
}
