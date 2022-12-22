/// <reference types="@altv/types-server"/>

/**
 * @module vchat
 */
declare module 'vchat' {
    import { Player } from 'alt-server';

    export type CommandHandler = (player: Player, args: Array<string>) => void;
    export type MessageFormatter = (message: string) => string;
    export type MountCallback = (player: Player, mounted: boolean) => void;
    export interface ClientOptions {
        focusKey: number;
        hideOnConnect: boolean;
        maxMessageHistory: number;
        unfocusKey: number;
    }
    export interface WindowOptions {
        maxCommandSuggestions: number;
        maxMessageBufferLength: number;
        maxMessageLength: number;
        maxMessages: number;
        placeholder: string;
        prefix: string;
        scrollStep: number;
    }
    export interface CommandSuggestion {
        description?: string;
        name: string;
        parameters?: Array<{
            name: string;
            description?: string;
        }>;
    }

    enum MessageType {
        Default = 0,
        Empty = 1,
        Info = 2,
        Success = 3,
        Warning = 4,
        Error = 5,
    }

    /**
     * Clears the player's chat history from the local storage.
     */
    export function clearMessageHistory(player: Player): void;
    /**
     * Clears all players' chat history from the local storage.
     */
    export function clearMessageHistoryAll(): void;
    /**
     * Clears the player's chat in the webview.
     */
    export function clearMessages(player: Player): void;
    /**
     * Clears all players' chat in the webview.
     */
    export function clearMessagesAll(): void;
    /**
     * Registers a command handler to the specified command.
     */
    export function registerCmd(cmdName: string, handler: CommandHandler): void;
    /**
     * Unregisters a command handler from the specified command.
     */
    export function unregisterCmd(cmdName: string): boolean;
    /**
     * Toggles the player's chat focus activation.
     */
    export function toggleFocusEnabled(player: Player, enabled: boolean): void;
    /**
     * Toggles all players' chat focus activation.
     */
    export function toggleFocusEnabledAll(enabled: boolean): void;
    /**
     * Focuses the player's chat.
     */
    export function focus(player: Player): void;
    /**
     * Focus all players' chat.
     */
    export function focusAll(): void;
    /**
     * Unfocuses the player's chat.
     */
    export function unfocus(player: Player): void;
    /**
     * Unfocuses all players' chat.
     */
    export function unfocusAll(): void;
    /**
     * Sets the message processor.
     */
    export function setMessageFormatter(fn: MessageFormatter): void;
    /**
     * Removes the message processor.
     */
    export function removeMessageFormatter(): void;
    /**
     * Sets the message processor to the default.
     */
    export function restoreMessageFormatter(): void;
    /**
     * Processes the message.
     */
    export function useDefaultMessageFormatter(message: string): void;
    /**
     * Subscribes to mount event and returns the id of the subscription.
     */
    export function onMounted(fn: MountCallback): number;
    /**
     * Unsubscribes from mount event with the specified id.
     */
    export function offMounted(id: number): boolean;
    /**
     * Checks if the player's chat is mounted.
     */
    export function isMounted(player: Player): boolean;
    /**
     * Mutes the player from sending messages.
     */
    export function mutePlayer(player: Player): void;
    /**
     * Mutes all players from sending messages.
     */
    export function muteAllPlayers(): void;
    /**
     * Unmutes the player from sending messages.
     */
    export function unmutePlayer(player: Player): void;
    /**
     * Unmutes all players from sending messages.
     */
    export function unmuteAllPlayers(): void;
    /**
     * Checks if the player is muted.
     */
    export function isMuted(player: Player): boolean;
    /**
     * Updates the specified option for the specified player.
     */
    export function updateOption(
        player: Player,
        key: keyof (ClientOptions & WindowOptions),
        value: (ClientOptions & WindowOptions)[keyof (ClientOptions & WindowOptions)],
    ): void;
    /**
     * Updates the specified options for all players.
     */
    export function updateOptionAll(
        key: keyof (ClientOptions & WindowOptions),
        value: (ClientOptions & WindowOptions)[keyof (ClientOptions & WindowOptions)],
    ): void;
    /**
     * Updates the specified options for the specified player.
     */
    export function updateOptions(player: Player, options: Partial<ClientOptions & WindowOptions>): void;
    /**
     * Updates the specified options for all players.
     */
    export function updateOptionsAll(options: Partial<ClientOptions & WindowOptions>): void;
    /**
     * Sends a message to the player.
     */
    export function send(player: Player, message: string, type?: MessageType): void;
    /**
     * Sends a message to all players.
     */
    export function broadcast(message: string, type?: MessageType): void;
    /**
     * Adds a command suggestion to the player's chat webview.
     */
    export function addSuggestion(player: Player, suggestion: CommandSuggestion | Array<CommandSuggestion>): void;
    /**
     * Adds a command suggestion to all players' chat webview.
     */
    export function addSuggetionAll(suggestion: CommandSuggestion | Array<CommandSuggestion>): void;
    /**
     * Removes all command suggestions from the player's chat webview.
     */
    export function removeSuggestions(player: Player): void;
    /**
     * Removes all command suggestions from all players' chat webview.
     */
    export function removeSuggestionsAll(): void;
    /**
     * Shows the chat window for the given player.
     */
    export function show(player: Player): void;
    /**
     * Shows the chat window for all players.
     */
    export function showAll(): void;
    /**
     * Hides the chat window for the given player.
     */
    export function hide(player: Player): void;
    /**
     * Hides the chat window for all players.
     */
    export function hideAll(): void;
}
