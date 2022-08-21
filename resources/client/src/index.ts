import { on, onServer, WebView, toggleGameControls, emitServer, LocalStorage, showCursor } from 'alt-client';
import { ESC_KEY, MAX_HISTORY_LENGTH, SHOW_CURSOR, T_KEY } from './constants';

const chatWebView: WebView = new WebView('http://localhost:4000/');
const chatHistory: Array<string> = LocalStorage.get('chatHistory') ?? [];
if (chatHistory.length > MAX_HISTORY_LENGTH) chatHistory.splice(0, chatHistory.length - MAX_HISTORY_LENGTH);

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
    emitServer('chat:mounted', true);
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

function addMessage(message: string) {
    if (chatHistory.length >= MAX_HISTORY_LENGTH) chatHistory.shift();
    chatHistory.push(message);
    LocalStorage.set('chatHistory', chatHistory);
    LocalStorage.save();
    chatWebView.emit('vchat:message', message);
}

function addSuggestion(cmdName: string) {
    chatWebView.emit('vchat:suggestion', cmdName);
}

onServer('vchat:message', addMessage);
onServer('vchat:addSuggestion', addSuggestion);

// --------------------------------------------------------------
// Local Events
// --------------------------------------------------------------

function toggleChat(keyCode: number) {
    if (keyCode === ESC_KEY && chatWebView.focused) unfocus();
    else if (keyCode === T_KEY && !chatWebView.focused) focus();
}

on('keyup', toggleChat);
