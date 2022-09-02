import { emitClientRaw, Player } from 'alt-server';
import type { CommandSuggestion } from '../interfaces';
import type { CommandHandler } from '../types';
import { validateCommandName, validateCommandSuggestion } from '../validators';
import { MountService } from './mount.service';
import { SettingsService } from './settings.service';

export class CommandService {
    private static readonly instance = new CommandService();

    public static getInstance() {
        return CommandService.instance;
    }

    private handlers = new Map<string, CommandHandler>();

    private constructor(
        private readonly mountService: MountService = MountService.getInstance(),
        private readonly settingsService: SettingsService = SettingsService.getInstance(),
    ) {}

    public register(command: string, handler: CommandHandler) {
        if (!validateCommandName(command, this.settingsService.get('prefix'))) return;
        this.handlers.set(command, handler);
    }

    public unregister(command: string) {
        return this.handlers.delete(command);
    }

    public invoke(player: Player, command: string, args: string[]) {
        command = command.toLowerCase();
        const handler = this.handlers.get(command);
        if (!handler) return false;
        handler(player, args);
        return true;
    }

    public addSuggestion(player: Player, suggestion: CommandSuggestion | Array<CommandSuggestion>) {
        if (!Array.isArray(suggestion)) suggestion = [suggestion];
        const result = suggestion.some((s) => validateCommandSuggestion(s));
        if (!result) return;
        this.mountService.waitForMount(player, () => emitClientRaw(player, 'vchat:addSuggestion', suggestion));
    }
}
