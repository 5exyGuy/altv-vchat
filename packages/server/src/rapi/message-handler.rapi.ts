import { container } from 'tsyringe';
import { Chat } from '../chat';
import type { MessageHandler } from '../types';

/**
 * Sets the message handler.
 */
export function setMessageHandler(fn: MessageHandler) {
    container.resolve(Chat).setMessageHandler(fn);
}

/**
 * Removes the message handler.
 */
export function removeMessageHandler() {
    container.resolve(Chat).setMessageHandler(undefined);
}

/**
 * Sets the message handler to the default.
 */
export function restoreMessageHandler() {
    container.resolve(Chat).restoreMessageHandler();
}
