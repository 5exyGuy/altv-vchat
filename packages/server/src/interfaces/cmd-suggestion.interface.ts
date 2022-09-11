export interface CommandSuggestion {
    description?: string; // The description of the command.
    name: string; // The name of the command.
    params?: Array<{ name: string; description?: string }>; // The parameters of the command.
}
