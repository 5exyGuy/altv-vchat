import type { CommandParameter } from './command-parameter.interface';

export interface Command {
    name: string;
    description?: string;
    parameters?: Array<CommandParameter>;
}
