import { Chat } from '../chat';
import type { MessageProcessor } from '../types';

/**
 * Sets the message processor.
 */
export function setMessageProcessor(fn: MessageProcessor) {
    Chat.getInstance().setMessageProcessor(fn);
}

/**
 * Removes the message processor.
 */
export function removeMessageProcessor() {
    Chat.getInstance().setMessageProcessor(undefined);
}

/**
 * Sets the message processor to the default.
 */
export function restoreMessageProcessor() {
    Chat.getInstance().restoreMessageProcessor();
}

/**
 * Processes the message.
 */
export function processMessage(message: string) {
    Chat.getInstance().processMessage(message);
}
