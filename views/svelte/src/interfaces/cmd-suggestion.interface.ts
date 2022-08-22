export interface CommandSuggestion {
    name: string;
    description?: string;
    params?: Array<{
        name: string;
        description?: string;
    }>;
}
