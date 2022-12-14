import { log, logWarning, logError, Resource } from 'alt-server';
import { singleton } from 'tsyringe';

@singleton()
export class LoggerService {
    public log(message: string) {
        log(`[${Resource.current.name}] ${message}`);
    }

    public warn(message: string) {
        logWarning(`[${Resource.current.name}] ${message}`);
    }

    public error(message: string) {
        logError(`[${Resource.current.name}] ${message}`);
    }
}
