import { on, onServer, WebView, toggleGameControls, emitServer, LocalStorage, showCursor } from 'alt-client';
import { ESC_KEY, MAX_HISTORY_LENGTH, SHOW_CURSOR, T_KEY } from './constants';
import { MessageType } from './enums';
import type { CommandSuggestion } from './interfaces';
import type { Message } from './interfaces/message.interface';

// --------------------------------------------------------------
// Variables
// --------------------------------------------------------------

const chatWebView: WebView = new WebView('http://localhost:4000/');
const chatHistory: Array<Message> = LocalStorage.get('chatHistory') ?? [];
if (chatHistory.length > MAX_HISTORY_LENGTH) chatHistory.splice(0, chatHistory.length - MAX_HISTORY_LENGTH);

// let isChatMounted = false;

// --------------------------------------------------------------
// Functions
// --------------------------------------------------------------

function focus() {
    chatWebView.emit('vchat:focus', true);
    toggleGameControls(false);
    SHOW_CURSOR && showCursor(true);
    chatWebView.focus();
}

function unfocus() {
    chatWebView.emit('vchat:focus', false);
    toggleGameControls(true);
    SHOW_CURSOR && showCursor(false);
    chatWebView.unfocus();
}

// --------------------------------------------------------------
// Chat WebView Events
// --------------------------------------------------------------

function loadHistory() {
    chatWebView.emit('vchat:loadHistory', chatHistory);
    emitServer('vchat:mounted', true);
}

function sendMessageToServer(message: string) {
    if (message.length > 0) emitServer('vchat:message', message);
    unfocus();
}

chatWebView.on('vchat:mounted', loadHistory);
chatWebView.on('vchat:message', sendMessageToServer);

// --------------------------------------------------------------
// Server Events
// --------------------------------------------------------------

function clearHistory() {
    chatHistory.length = 0;
    LocalStorage.set('chatHistory', chatHistory);
    LocalStorage.save();
}

function clear() {
    chatWebView.emit('vchat:clear');
}

function addMessage(message: string, type: MessageType = MessageType.Default) {
    if (chatHistory.length >= MAX_HISTORY_LENGTH) chatHistory.shift();
    chatHistory.push({ content: message, type });
    LocalStorage.set('chatHistory', chatHistory);
    LocalStorage.save();
    chatWebView.emit('vchat:message', message, type);
}

function addSuggestion(suggestion: CommandSuggestion) {
    chatWebView.emit('vchat:addSuggestion', suggestion);
}

function addSuggestions(suggestions: Array<CommandSuggestion>) {
    chatWebView.emit('vchat:addSuggestions', suggestions);
}

onServer('vchat:clearHistory', clearHistory);
onServer('vchat:clear', clear);
onServer('vchat:message', addMessage);
onServer('vchat:addSuggestion', addSuggestion);
onServer('vchat:addSuggestions', addSuggestions);

// --------------------------------------------------------------
// Local Events
// --------------------------------------------------------------

function toggleChat(keyCode: number) {
    if (keyCode === ESC_KEY && chatWebView.focused) unfocus();
    else if (keyCode === T_KEY && !chatWebView.focused) focus();
}

on('keyup', toggleChat);
