import { DEFAULT_SETTINGS } from '../consts';

export class SettingsService {
    private static readonly instance = new SettingsService();

    public static getInstance() {
        return SettingsService.instance;
    }

    private settings = DEFAULT_SETTINGS;

    public update(settings: typeof DEFAULT_SETTINGS) {
        this.settings = settings;
    }

    public get<T extends keyof typeof DEFAULT_SETTINGS>(key: T): typeof DEFAULT_SETTINGS[T] {
        if (!this.settings[key] || typeof this.settings[key] !== typeof DEFAULT_SETTINGS[key])
            return DEFAULT_SETTINGS[key];
        return this.settings[key];
    }
}
