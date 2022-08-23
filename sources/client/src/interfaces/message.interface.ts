import type { MessageType } from '../enums';

export interface Message {
    content: string; // The content of the message.
    type: MessageType; // The type of the message.
}
