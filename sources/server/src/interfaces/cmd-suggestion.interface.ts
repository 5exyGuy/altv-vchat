export interface CommandSuggestion {
    name: string; // The name of the command.
    description?: string; // The description of the command.
    params?: Array<{ name: string; description?: string }>; // The parameters of the command.
}
