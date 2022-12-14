import { container } from 'tsyringe';
import { Chat } from '../chat';
import type { MessageProcessor } from '../types';

/**
 * Sets the message processor.
 */
export function setMessageProcessor(fn: MessageProcessor) {
    container.resolve(Chat).setMessageProcessor(fn);
}

/**
 * Removes the message processor.
 */
export function removeMessageProcessor() {
    container.resolve(Chat).setMessageProcessor(undefined);
}

/**
 * Sets the message processor to the default.
 */
export function restoreMessageProcessor() {
    container.resolve(Chat).restoreMessageProcessor();
}

/**
 * Processes the message.
 */
export function processMessage(message: string) {
    container.resolve(Chat).processMessage(message);
}
