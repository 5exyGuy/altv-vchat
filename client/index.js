import { WebView, LocalStorage, onServer, on, emitServer, toggleGameControls } from 'alt-client';

const ESC_KEY = 27;
const T_KEY = 84;
const MAX_HISTORY_LENGTH = 100;

const chatWebView = new WebView("http://localhost:4000/");
const chatHistory = LocalStorage.get("chatHistory") ?? [];
if (chatHistory.length > MAX_HISTORY_LENGTH)
  chatHistory.splice(0, chatHistory.length - MAX_HISTORY_LENGTH);
function focus() {
  chatWebView.emit("vchat:focus", true);
  toggleGameControls(false);
  chatWebView.focus();
}
function unfocus() {
  chatWebView.emit("vchat:focus", false);
  toggleGameControls(true);
  chatWebView.unfocus();
}
function loadHistory() {
  chatWebView.emit("vchat:loadHistory", chatHistory);
}
function sendMessageToServer(message) {
  if (message.length > 0)
    emitServer("vchat:message", message);
  unfocus();
}
chatWebView.on("vchat:mounted", loadHistory);
chatWebView.on("vchat:message", sendMessageToServer);
function addMessage(message) {
  if (chatHistory.length >= MAX_HISTORY_LENGTH)
    chatHistory.shift();
  chatHistory.push(message);
  LocalStorage.set("chatHistory", chatHistory);
  LocalStorage.save();
  chatWebView.emit("vchat:message", message);
}
onServer("vchat:message", addMessage);
function toggleChat(keyCode) {
  if (keyCode === ESC_KEY && chatWebView.focused)
    unfocus();
  else if (keyCode === T_KEY && !chatWebView.focused)
    focus();
}
on("keyup", toggleChat);
