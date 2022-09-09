import { DEFAULT_SETTINGS } from '../consts';
import type { ClientOptions, WindowOptions } from '../interfaces';

export class OptionsService {
    private static readonly instance = new OptionsService();

    public static getInstance() {
        return OptionsService.instance;
    }

    private options = DEFAULT_SETTINGS;

    public update(options: ClientOptions & WindowOptions) {
        Object.keys(options).forEach((key) =>
            this.set(
                key as keyof (ClientOptions & WindowOptions),
                options[key as keyof (ClientOptions & WindowOptions)],
            ),
        );
    }

    public get<T extends keyof (ClientOptions & WindowOptions)>(key: T) {
        if (!this.options[key] || typeof this.options[key] !== typeof DEFAULT_SETTINGS[key])
            return DEFAULT_SETTINGS[key];
        return this.options[key];
    }

    public set<T extends keyof (ClientOptions & WindowOptions)>(key: T, value: (ClientOptions & WindowOptions)[T]) {
        if (!this.options[key] || typeof this.options[key] !== typeof DEFAULT_SETTINGS[key]) return;
        this.options[key] = value;
    }

    public getWindowOptions() {
        const {
            prefix,
            maxCommandSuggestions,
            maxMessageBufferLength,
            maxMessageLength,
            maxMessages,
            placeholder,
            scrollStep,
        } = this.options;
        return {
            prefix,
            maxCommandSuggestions,
            maxMessageBufferLength,
            maxMessageLength,
            maxMessages,
            placeholder,
            scrollStep,
        };
    }
}
