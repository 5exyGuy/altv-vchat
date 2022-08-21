import type { MessageType } from '../enums';

export interface Message {
    content: string;
    type: MessageType;
}
