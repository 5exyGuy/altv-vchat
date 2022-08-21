export interface CommandSuggestion {
    name: string;
    description?: string;
    parameters?: Array<{ name: string; description?: string }>;
}
