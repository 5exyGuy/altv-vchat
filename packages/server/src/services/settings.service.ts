import { DEFAULT_SETTINGS } from '../consts';
import * as alt from 'alt-server';
import fs from 'fs';
import path from 'path';
import { LoggerService } from './logger.service';

export class SettingsService {
    private static readonly instance = new SettingsService();

    public static getInstance() {
        return SettingsService.instance;
    }

    private readonly settings = DEFAULT_SETTINGS;

    private constructor(private readonly loggerService: LoggerService = LoggerService.getInstance()) {
        const settingsPath = path.join(process.cwd(), 'resources', alt.Resource.current.name, 'settings.json');
        if (!fs.existsSync(settingsPath)) return;
        this.settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        this.loggerService.log(`Loaded settings from ${settingsPath}`);
    }

    public get<T extends keyof typeof DEFAULT_SETTINGS>(key: T): typeof DEFAULT_SETTINGS[T] {
        if (!this.settings[key] || typeof this.settings[key] !== typeof DEFAULT_SETTINGS[key])
            return DEFAULT_SETTINGS[key];
        return this.settings[key];
    }

    public getClient() {
        const {
            enableHTMLInjections,
            enableDefaultMessageProcessor,
            logPlayerMessages,
            logPlayerCommands,
            ...clientSettings
        } = this.settings;
        return clientSettings;
    }
}
