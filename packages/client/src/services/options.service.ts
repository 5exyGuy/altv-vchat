import { ClientOptions, DefaultClientOptions, DefaultWindowOptions, WindowOptions } from '@altv-vchat/shared';
import { singleton } from 'tsyringe';

@singleton()
export class OptionsService {
    private readonly defaultOptions = { ...DefaultClientOptions, ...DefaultWindowOptions } as ClientOptions &
        WindowOptions;
    private readonly options = { ...DefaultClientOptions, ...DefaultWindowOptions } as ClientOptions & WindowOptions;

    public update(options: Partial<ClientOptions & WindowOptions>) {
        Object.keys(options).forEach((key) =>
            this.set(
                key as keyof (ClientOptions & WindowOptions),
                (options as ClientOptions & WindowOptions)[key as keyof (ClientOptions & WindowOptions)],
            ),
        );
    }

    public get<T extends keyof (ClientOptions & WindowOptions)>(key: T) {
        if (!this.options[key] || typeof this.options[key] !== typeof this.defaultOptions[key])
            return this.defaultOptions[key];
        return this.options[key];
    }

    public set<T extends keyof (ClientOptions & WindowOptions)>(key: T, value: (ClientOptions & WindowOptions)[T]) {
        if (!this.options[key] || typeof this.options[key] !== typeof this.defaultOptions[key]) return;
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
