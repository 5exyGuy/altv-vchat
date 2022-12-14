import { emitClientRaw, offClient, on, onClient, Player } from 'alt-server';
import { singleton } from 'tsyringe';

@singleton()
export class EventService {
    public on(eventName: string, listener: (...args: any[]) => void) {
        on(eventName, listener);
    }

    public onClient(eventName: string, listener: (...args: any[]) => void) {
        onClient(eventName, listener);
    }

    public offClient(eventName: string, listener: (...args: any[]) => void) {
        offClient(eventName, listener);
    }

    public emitClient(player: Player, eventName: string, ...args: any[]) {
        emitClientRaw(player, eventName, ...args);
    }
}
