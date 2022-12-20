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
        return {
            prefix: this.options.prefix,
            maxCommandSuggestions: this.options.maxCommandSuggestions,
            maxMessageBufferLength: this.options.maxMessageBufferLength,
            maxMessageLength: this.options.maxMessageLength,
            maxMessages: this.options.maxMessages,
            placeholder: this.options.placeholder,
            scrollStep: this.options.scrollStep,
        } as WindowOptions;
    }
}
