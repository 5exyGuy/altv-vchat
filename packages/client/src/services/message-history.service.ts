import { LocalStorage } from 'alt-client';
import { singleton } from 'tsyringe';
import type { Message } from '../interfaces';

@singleton()
export class MessageHistoryService {
    private readonly messages = (LocalStorage.get('chatHistory') as Array<Message>) ?? ([] as Array<Message>);

    public add(message: Message) {
        this.messages.push(message);
        this.save();
    }

    public removeFirst() {
        this.messages.shift();
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

    public getLength() {
        return this.messages.length;
    }
}
