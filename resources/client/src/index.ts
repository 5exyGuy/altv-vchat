import { emitServer, on, onServer, WebView } from 'alt-client';

const chatWebView = new WebView('http://localhost:5173/', false);

chatWebView.on('vchat:ready', () => {});
chatWebView.on('vchat:send:message:to:client', (message: string) => {
    emitServer('vchat:send:message:to:server', message);
});

onServer('vchat:send:message:to:client', (message: string) => {
    chatWebView.emit('vchat:send:message:to:webview', message);
});

on('keyup', (keyCode) => {
    switch (keyCode) {
        case 84:
            chatWebView.emit('vchat:open:chat');
            break;
    }
});
