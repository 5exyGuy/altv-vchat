import { DEFAULT_OPTIONS } from '../consts';
import * as alt from 'alt-server';
import fs from 'fs';
import path from 'path';
import type { CommandSuggestion } from '../interfaces';
import { LoggerService } from './logger.service';
import type { Emoji } from '../interfaces/emoji.interface';

export class SettingsService {
    private static readonly instance = new SettingsService();

    public static getInstance() {
        return SettingsService.instance;
    }

    private options = DEFAULT_OPTIONS;
    private commandSuggestions = [] as Array<CommandSuggestion>;
    private emojis = [] as Array<Emoji>;

    private constructor(private readonly loggerService: LoggerService = LoggerService.getInstance()) {
        this.readOptions();
        this.readCommandSuggestions();
        this.readEmojis();
    }

    private readOptions() {
        const optionsPath = path.join(process.cwd(), 'resources', alt.Resource.current.name, 'options.json');
        if (!fs.existsSync(optionsPath)) return;
        this.options = JSON.parse(fs.readFileSync(optionsPath, 'utf8'));
        this.loggerService.log(`Loaded options from ${optionsPath}`);
    }

    private readCommandSuggestions() {
        const commandSuggestionsPath = path.join(
            process.cwd(),
            'resources',
            alt.Resource.current.name,
            'commands.json',
        );
        if (!fs.existsSync(commandSuggestionsPath)) return;
        this.commandSuggestions = JSON.parse(fs.readFileSync(commandSuggestionsPath, 'utf8'));
        this.loggerService.log(`Loaded command suggestions from ${commandSuggestionsPath}`);
    }

    private readEmojis() {
        const emojisPath = path.join(process.cwd(), 'resources', alt.Resource.current.name, 'emojis.json');
        if (!fs.existsSync(emojisPath)) return;
        this.emojis = JSON.parse(fs.readFileSync(emojisPath, 'utf8'));
        this.loggerService.log(`Loaded emojis from ${emojisPath}`);
    }

    public getOption<T extends keyof typeof DEFAULT_OPTIONS>(key: T) {
        if (!this.options[key] || typeof this.options[key] !== typeof DEFAULT_OPTIONS[key]) return DEFAULT_OPTIONS[key];
        return this.options[key];
    }

    public getClientOptions() {
        const {
            enableHTMLInjections,
            enableDefaultMessageProcessor,
            logPlayerMessages,
            logPlayerCommands,
            ...clientOptions
        } = this.options;
        return clientOptions;
    }

    public getCommandSuggestions() {
        return this.commandSuggestions;
    }

    public getEmojis() {
        return this.emojis;
    }
}
