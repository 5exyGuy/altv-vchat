import type { MessageType } from '@altv-vchat/shared';

export interface Message {
    content: string; // The content of the message.
    type: MessageType; // The type of the message.
}
