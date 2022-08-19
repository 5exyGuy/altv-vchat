import { on, onServer, WebView, toggleGameControls, emitServer, LocalStorage } from 'alt-client';

const ESC_KEY: number = 27;
const T_KEY: number = 84;
const chatWebView: WebView = new WebView('http://localhost:4000/');
const chatHistory: Array<string> = LocalStorage.get('chatHistory') ?? [];

function addToHistory(message: string) {
    chatHistory.push(message);
    LocalStorage.set('chatHistory', chatHistory);
    LocalStorage.save();
}

function focus() {
    chatWebView.emit('vchat:focus', true);
    toggleGameControls(false);
    chatWebView.focus();
}

function unfocus() {
    chatWebView.emit('vchat:focus', false);
    toggleGameControls(true);
    chatWebView.unfocus();
}

chatWebView.on('vchat:ready', () => {});
chatWebView.on('vchat:message', (message: string) => {
    if (message.length > 0) emitServer('vchat:message', message);
    unfocus();
});

onServer('vchat:message', (message: string) => {
    addToHistory(message);
    chatWebView.emit('vchat:message', message);
});

on('keyup', (keyCode) => {
    if (keyCode === ESC_KEY && chatWebView.focused) unfocus();
    else if (keyCode === T_KEY && !chatWebView.focused) focus();
});
