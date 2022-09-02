import { Chat } from '../chat';
import type { MessageHandler } from '../types';

/**
 * Sets the message handler.
 */
export function setMessageHandler(fn: MessageHandler) {
    Chat.getInstance().setMessageHandler(fn);
}

/**
 * Removes the message handler.
 */
export function removeMessageHandler() {
    Chat.getInstance().setMessageHandler(undefined);
}

/**
 * Sets the message handler to the default.
 */
export function restoreMessageHandler() {
    Chat.getInstance().restoreMessageHandler();
}
