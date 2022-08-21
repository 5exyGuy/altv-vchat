import type { CommandParameter } from './cmd-parameter.interface';

export interface Command {
    name: string;
    description?: string;
    parameters?: Array<CommandParameter>;
}
