import { emitServerRaw, on, onServer } from 'alt-client';
import { WindowService } from './window.service';

export class EventService {
    private static readonly instance = new EventService();

    public static getInstance() {
        return EventService.instance;
    }

    private constructor(private readonly windowService = WindowService.getInstance()) {}

    public emitServer(event: string, ...args: any[]) {
        emitServerRaw(event, ...args);
    }

    public onServer(event: string, listener: (...args: any[]) => void) {
        onServer(event, listener);
    }

    public on(event: string, listener: (...args: any[]) => void) {
        on(event, listener);
    }

    public onWindow(event: string, listener: (...args: any[]) => void) {
        this.windowService.on(event, listener);
    }
}
