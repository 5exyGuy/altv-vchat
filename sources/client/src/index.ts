import { on, onServer, WebView, toggleGameControls, emitServerRaw, LocalStorage, showCursor } from 'alt-client';
import { ESC_KEY, MAX_HISTORY_LENGTH, SHOW_CURSOR, T_KEY } from './constants';
import { MessageType } from './enums';
import type { CommandSuggestion } from './interfaces';
import type { Message } from './interfaces/message.interface';

// --------------------------------------------------------------
// Variables
// --------------------------------------------------------------

const chatWebView: WebView = new WebView('http://resource/client/view/index.html'); // The webview that contains the chat.
const chatHistory: Array<Message> = LocalStorage.get('chatHistory') ?? []; // The chat history.
if (chatHistory.length > MAX_HISTORY_LENGTH) chatHistory.splice(0, chatHistory.length - MAX_HISTORY_LENGTH);
let focusEnabled: boolean = true; // Whether the chat can be focused.

// --------------------------------------------------------------
// Functions
// --------------------------------------------------------------

/**
 * Focuses the chat.
 */
function focus() {
    chatWebView.emit('vchat:focus', true); // Sends an event to the webview to focus the chat.
    toggleGameControls(false); // Disables the game controls.
    SHOW_CURSOR && showCursor(true); // Shows the cursor if enabled.
    chatWebView.focus(); // Focuses the webview.
}

/**
 * Unfocuses the chat.
 */

function unfocus() {
    chatWebView.emit('vchat:focus', false); // Sends an event to the webview to unfocus the chat.
    toggleGameControls(true); // Enables the game controls.
    SHOW_CURSOR && showCursor(false); // Hides the cursor if enabled.
    chatWebView.unfocus(); // Unfocuses the webview.
}

// --------------------------------------------------------------
// Chat WebView Events
// --------------------------------------------------------------

/**
 * Loads the chat history into the webview and sends an event to the server that the chat is mounted.
 */
function loadHistory() {
    chatWebView.emit('vchat:loadHistory', chatHistory); // Sends an event to the webview to load the chat history.
    emitServerRaw('vchat:mounted', true); // Sends an event to the server to indicate that the chat is mounted.
}

/**
 * Sends a message to the server.
 */
function sendMessageToServer(message: string) {
    if (message.length > 0) emitServerRaw('vchat:message', message); // Sends the message to the server if it's not empty.
    unfocus(); // Unfocuses the chat.
}

chatWebView.on('vchat:mounted', loadHistory);
chatWebView.on('vchat:message', sendMessageToServer);

// --------------------------------------------------------------
// Server Events
// --------------------------------------------------------------

/**
 * Toggles the chat's visibility.
 */
function toggleChat(_focus: boolean) {
    _focus ? focus() : unfocus();
}

/**
 * Clears the chat history from the local storage.
 */
function clearHistory() {
    chatHistory.length = 0; // Clears the chat history.
    LocalStorage.set('chatHistory', chatHistory); // Sets the chat history in the local storage.
    LocalStorage.save(); // Saves the local storage.
}

/**
 * Clears the chat in the webview.
 */
function clear() {
    chatWebView.emit('vchat:clear'); // Sends an event to the webview to clear the chat.
}

/**
 * Adds a message to the chat history and the webview.
 */
function addMessage(message: string, type: MessageType = MessageType.Default) {
    if (chatHistory.length >= MAX_HISTORY_LENGTH) chatHistory.shift(); // Removes the first message if the chat history is full.

    chatHistory.push({ content: message, type }); // Adds the message to the chat history.
    LocalStorage.set('chatHistory', chatHistory); // Sets the chat history in the local storage.
    LocalStorage.save(); // Saves the local storage.
    chatWebView.emit('vchat:message', message, type); // Sends an event to the webview to add the message.
}

/**
 * Adds a command suggestion.
 */
function addSuggestion(suggestion: CommandSuggestion | Array<CommandSuggestion>) {
    chatWebView.emit('vchat:addSuggestion', suggestion); // Sends an event to the webview to add the command suggestion.
}

/**
 * Toggles the focus enabled state.
 */
function toggleFocusEnabled(enabled: boolean) {
    focusEnabled = enabled;
    if (!enabled) unfocus();
}

onServer('vchat:focus', toggleChat);
onServer('vchat:clearHistory', clearHistory);
onServer('vchat:clear', clear);
onServer('vchat:message', addMessage);
onServer('vchat:addSuggestion', addSuggestion);
onServer('vchat:focusEnabled', toggleFocusEnabled);

// --------------------------------------------------------------
// Local Events
// --------------------------------------------------------------

/**
 * Handles the keyboard event.
 */
function toggleChatWithKey(keyCode: number) {
    if (keyCode === ESC_KEY && chatWebView.focused)
        unfocus(); // Unfocuses the chat if the ESCAPE key is pressed and the chat is focused.
    else if (keyCode === T_KEY && !chatWebView.focused && focusEnabled) focus(); // Focuses the chat if the T key is pressed and the chat is not focused.
}

on('keyup', toggleChatWithKey);
