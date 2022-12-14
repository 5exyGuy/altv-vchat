import { emitServerRaw, on, onServer } from 'alt-client';
import { singleton } from 'tsyringe';

@singleton()
export class EventService {
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
