import * as alt from 'alt-server';

export class EventService {
    private static readonly instance = new EventService();

    public static getInstance() {
        return EventService.instance;
    }

    private constructor() {}

    public on(eventName: string, listener: (...args: any[]) => void) {
        alt.on(eventName, listener);
    }

    public onClient(eventName: string, listener: (...args: any[]) => void) {
        alt.onClient(eventName, listener);
    }

    public offClient(eventName: string, listener: (...args: any[]) => void) {
        alt.offClient(eventName, listener);
    }

    public emitClient(player: alt.Player, eventName: string, ...args: any[]) {
        alt.emitClientRaw(player, eventName, ...args);
    }
}
