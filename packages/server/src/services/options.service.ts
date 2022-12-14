import { Resource } from 'alt-server';
import fs from 'fs';
import path from 'path';
import { LoggerService } from './logger.service';
import type { Emoji } from '../interfaces/emoji.interface';
import {
    ClientOptions,
    CommandSuggestion,
    DefaultClientOptions,
    DefaultServerOptions,
    DefaultWindowOptions,
    ServerOptions,
    WindowOptions,
} from '@altv-vchat/shared';
import { singleton } from 'tsyringe';

@singleton()
export class OptionsService {
    private readonly defaultOptions = {
        ...DefaultClientOptions,
        ...DefaultServerOptions,
        ...DefaultWindowOptions,
    } as ClientOptions & ServerOptions & WindowOptions;
    private options = {
        ...DefaultClientOptions,
        ...DefaultServerOptions,
        ...DefaultWindowOptions,
    } as ClientOptions & ServerOptions & WindowOptions;
    private commandSuggestions = [] as Array<CommandSuggestion>;
    private emojis = [] as Array<Emoji>;

    public constructor(private readonly loggerService: LoggerService) {
        this.readOptions();
        this.readCommandSuggestions();
        this.readEmojis();
    }

    private readOptions() {
        const optionsPath = path.join(process.cwd(), 'resources', Resource.current.name, 'options.json');
        if (!fs.existsSync(optionsPath)) return;
        this.options = JSON.parse(fs.readFileSync(optionsPath, 'utf8'));
        this.loggerService.log(`Loaded options from ${optionsPath}`);
    }

    private readCommandSuggestions() {
        const commandSuggestionsPath = path.join(process.cwd(), 'resources', Resource.current.name, 'commands.json');
        if (!fs.existsSync(commandSuggestionsPath)) return;
        this.commandSuggestions = JSON.parse(fs.readFileSync(commandSuggestionsPath, 'utf8'));
        this.loggerService.log(`Loaded command suggestions from ${commandSuggestionsPath}`);
    }

    private readEmojis() {
        const emojisPath = path.join(process.cwd(), 'resources', Resource.current.name, 'emojis.json');
        if (!fs.existsSync(emojisPath)) return;
        this.emojis = JSON.parse(fs.readFileSync(emojisPath, 'utf8'));
        this.loggerService.log(`Loaded emojis from ${emojisPath}`);
    }

    public getOption<T extends keyof (ClientOptions & ServerOptions & WindowOptions)>(key: T) {
        if (!this.options[key] || typeof this.options[key] !== typeof this.defaultOptions[key])
            return this.defaultOptions[key];
        return this.options[key];
    }

    public getClientOptions() {
        const {
            enableHTMLInjections,
            enableDefaultMessageFormatter,
            logPlayerMessages,
            logPlayerCommands,
            ...clientOptions
        } = this.options;
        return clientOptions as ClientOptions;
    }

    public getCommandSuggestions() {
        return this.commandSuggestions;
    }

    public getEmojis() {
        return this.emojis;
    }
}
