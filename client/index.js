import { WebView, LocalStorage, onServer, on, emitServerRaw, toggleGameControls } from 'alt-client';

const ESC_KEY = 27;
const T_KEY = 84;
const MAX_HISTORY_LENGTH = 100;

var MessageType = /* @__PURE__ */ ((MessageType2) => {
  MessageType2[MessageType2["Default"] = 0] = "Default";
  MessageType2[MessageType2["Info"] = 1] = "Info";
  MessageType2[MessageType2["Success"] = 2] = "Success";
  MessageType2[MessageType2["Warning"] = 3] = "Warning";
  MessageType2[MessageType2["Error"] = 4] = "Error";
  return MessageType2;
})(MessageType || {});

const chatWebView = new WebView("http://localhost:4000/");
const chatHistory = LocalStorage.get("chatHistory") ?? [];
if (chatHistory.length > MAX_HISTORY_LENGTH)
  chatHistory.splice(0, chatHistory.length - MAX_HISTORY_LENGTH);
let focusEnabled = true;
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
  emitServerRaw("vchat:mounted", true);
}
function sendMessageToServer(message) {
  if (message.length > 0)
    emitServerRaw("vchat:message", message);
  unfocus();
}
chatWebView.on("vchat:mounted", loadHistory);
chatWebView.on("vchat:message", sendMessageToServer);
function toggleChat(_focus) {
  _focus ? focus() : unfocus();
}
function clearHistory() {
  chatHistory.length = 0;
  LocalStorage.set("chatHistory", chatHistory);
  LocalStorage.save();
}
function clear() {
  chatWebView.emit("vchat:clear");
}
function addMessage(message, type = MessageType.Default) {
  if (chatHistory.length >= MAX_HISTORY_LENGTH)
    chatHistory.shift();
  chatHistory.push({ content: message, type });
  LocalStorage.set("chatHistory", chatHistory);
  LocalStorage.save();
  chatWebView.emit("vchat:message", message, type);
}
function addSuggestion(suggestion) {
  chatWebView.emit("vchat:addSuggestion", suggestion);
}
function addSuggestions(suggestions) {
  chatWebView.emit("vchat:addSuggestions", suggestions);
}
function toggleFocusEnabled(enabled) {
  focusEnabled = enabled;
  if (!enabled)
    unfocus();
}
onServer("vchat:focus", toggleChat);
onServer("vchat:clearHistory", clearHistory);
onServer("vchat:clear", clear);
onServer("vchat:message", addMessage);
onServer("vchat:addSuggestion", addSuggestion);
onServer("vchat:addSuggestions", addSuggestions);
onServer("vchat:focusEnabled", toggleFocusEnabled);
function toggleChatWithKey(keyCode) {
  if (keyCode === ESC_KEY && chatWebView.focused)
    unfocus();
  else if (keyCode === T_KEY && !chatWebView.focused && focusEnabled)
    focus();
}
on("keyup", toggleChatWithKey);
