import { logError } from 'alt-server';
import { MessageType } from '../enums';

export function validateMessage(message: string, type: MessageType) {
    if (typeof message !== 'string') {
        logError(`[vchat:send] Message is not a string: ${message}`);
        return false;
    }
    if (!MessageType.hasOwnProperty(type)) {
        logError(`[vchat:send] Unknown message type: ${type}`);
        return false;
    }

    return true;
}
