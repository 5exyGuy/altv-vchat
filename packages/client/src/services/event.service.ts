import { emitServerRaw, on, onServer } from 'alt-client';

export class EventService {
    private static readonly instance = new EventService();

    public static getInstance() {
        return EventService.instance;
    }

    private constructor() {}

    public emitServer(event: string, ...args: any[]) {
        emitServerRaw(event, ...args);
    }

    public onServer(event: string, listener: (...args: any[]) => void) {
        onServer(event, listener);
    }

    public on(event: string, listener: (...args: any[]) => void) {
        on(event, listener);
    }
}
