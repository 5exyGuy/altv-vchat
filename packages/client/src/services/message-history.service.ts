import { LocalStorage } from 'alt-client';
import type { Message } from '../interfaces';

export class MessageHistoryService {
    private static readonly instance = new MessageHistoryService();

    public static getInstance() {
        return MessageHistoryService.instance;
    }

    private readonly messages: Array<Message> = LocalStorage.get('chatHistory') ?? [];

    private constructor() {}

    public add(message: Message) {
        this.messages.push(message);
        this.save();
    }

    public clear() {
        this.messages.length = 0;
        this.save();
    }

    private save() {
        LocalStorage.set('chatHistory', this.messages);
        LocalStorage.save();
    }

    public get() {
        return this.messages;
    }
}
