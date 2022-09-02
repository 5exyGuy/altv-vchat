import * as alt from 'alt-server';

export class LoggerService {
    private static readonly instance = new LoggerService();

    public static getInstance() {
        return LoggerService.instance;
    }

    private constructor() {}

    public log(message: string) {
        alt.log(`[${alt.Resource.current.name}] ${message}`);
    }

    public warn(message: string) {
        alt.logWarning(`[${alt.Resource.current.name}] ${message}`);
    }

    public error(message: string) {
        alt.logError(`[${alt.Resource.current.name}] ${message}`);
    }
}
