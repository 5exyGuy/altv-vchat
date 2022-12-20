import { container } from 'tsyringe';
import { Chat } from '../chat';
import { DEFAULT_MESSAGE_PROCESSOR } from '../consts';
import type { MessageFormatter } from '../types';

/**
 * Sets the message formatter.
 */
export function setMessageFormatter(fn: MessageFormatter) {
    container.resolve(Chat).setMessageFormatter(fn);
}

/**
 * Removes the message formatter.
 */
export function removeMessageFormatter() {
    container.resolve(Chat).setMessageFormatter(undefined);
}

/**
 * Processes the message.
 */
export function useDefaultMessageFormatter(message: string) {
    return DEFAULT_MESSAGE_PROCESSOR(message);
}
