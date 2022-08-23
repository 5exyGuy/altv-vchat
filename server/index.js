import { on, onClient, emitClientRaw, log, Player, logError, emitAllClients } from 'alt-server';

function processMessage(message) {
  message = message.replace(/\*\*(.+?)\*\*/gim, "<b>$1</b>").replace(/\*(.+?)\*/gim, "<i>$1</i>").replace(/~~(.+?)~~/gim, "<del>$1</del>").replace(/__(.+?)__/gim, "<ins>$1</ins>").replace(/\{([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\}(.*?){\/\1}/gim, '<span style="color: #$1;">$2</span>');
  return message.trim();
}

const PREFIX = "/";
const WAIT_FOR_MOUNT_TIMEOUT = 1e4;

var MessageType = /* @__PURE__ */ ((MessageType2) => {
  MessageType2[MessageType2["Default"] = 0] = "Default";
  MessageType2[MessageType2["Info"] = 1] = "Info";
  MessageType2[MessageType2["Success"] = 2] = "Success";
  MessageType2[MessageType2["Warning"] = 3] = "Warning";
  MessageType2[MessageType2["Error"] = 4] = "Error";
  return MessageType2;
})(MessageType || {});

const cmdHandlers = /* @__PURE__ */ new Map();
const mutedPlayers = /* @__PURE__ */ new Set();
const mountedListeners = /* @__PURE__ */ new Map();
const mountedPlayers = /* @__PURE__ */ new Set();
const mountedFreeIds = [];
let currentMountedId = -1;
function invokeCommand(player, cmdName, args) {
  cmdName = cmdName.toLowerCase();
  const callback = cmdHandlers.get(cmdName);
  callback ? callback(player, args) : send(player, `Unknown command ${PREFIX}${cmdName}`, MessageType.Error);
}
function validateMessage(message, type) {
  if (typeof message !== "string") {
    logError(`[vchat:send] Message is not a string: ${message}`);
    return false;
  }
  if (!MessageType.hasOwnProperty(type)) {
    logError(`[vchat:send] Unknown message type: ${type}`);
    return false;
  }
  return true;
}
function validateCommandName(cmdName) {
  if (typeof cmdName !== "string") {
    logError(`[vchat:registerCommand] Command name is not a string: ${cmdName}`);
    return false;
  }
  if (cmdName.length === 0) {
    logError(`[vchat:registerCommand] Command name is empty`);
    return false;
  }
  if (cmdName.startsWith(PREFIX)) {
    logError(`[vchat:registerCommand] Command name cannot start with ${PREFIX}`);
    return false;
  }
  return true;
}
function validateSuggestion(suggestion) {
  if (typeof suggestion !== "object")
    return false;
  if (!suggestion.name || typeof suggestion.name !== "string")
    return false;
  if (suggestion.description && typeof suggestion.description !== "string")
    return false;
  if (suggestion.params && !Array.isArray(suggestion.params))
    return false;
  if (suggestion.params) {
    for (const param of suggestion.params) {
      if (!param.name || typeof param.name !== "string")
        return false;
      if (param.description && typeof param.description !== "string")
        return false;
    }
  }
  return true;
}
async function waitForMount(player) {
  if (mountedPlayers.has(player))
    return;
  return new Promise((resolve, reject) => {
    const deadline = new Date().getTime() + WAIT_FOR_MOUNT_TIMEOUT;
    const id = setInterval(() => {
      if (mountedPlayers.has(player)) {
        clearInterval(id);
        resolve();
      } else if (deadline < new Date().getTime()) {
        clearInterval(id);
        reject();
      }
    }, 10);
  });
}
on("playerDisconnect", (player) => {
  if (mountedPlayers.has(player)) {
    mountedPlayers.delete(player);
    mountedListeners.forEach((listener) => listener(player, false));
  }
});
let messageProcessor = processMessage;
const DEFAULT_CHAT_HANDLER = (player, message) => {
  if (typeof message !== "string")
    return;
  if (message.startsWith("/")) {
    const words = message.trim().slice(1);
    if (words.length > 0) {
      log(`[vchat:command] ${player.name}: ${PREFIX}${words}`);
      let args = words.split(" ");
      let cmdName = args.shift() ?? "";
      invokeCommand(player, cmdName, args);
    }
  } else {
    if (mutedPlayers.has(player)) {
      send(player, "You are currently muted.", MessageType.Error);
      return;
    }
    message = message.trim();
    if (message.length > 0) {
      log(`[vchat:message] ${player.name}: ${message}`);
      message = message.replace(/</g, "&lt;").replace(/'/g, "&#39").replace(/"/g, "&#34");
      if (messageProcessor)
        message = messageProcessor(`<b>${player.name}:</b> ${message}`);
      emitAllClients("vchat:message", message);
    }
  }
};
let messageHandler = DEFAULT_CHAT_HANDLER;
function mount(player, mounted) {
  if (!mounted && !mountedPlayers.has(player))
    return;
  mountedPlayers.add(player);
  mountedListeners.forEach((listener) => listener(player, mounted));
}
onClient("vchat:message", (player, message) => messageHandler && messageHandler(player, message));
onClient("vchat:mounted", mount);
function send(player, message, type = MessageType.Default) {
  if (!validateMessage(message, type))
    return;
  waitForMount(player).then(() => emitClientRaw(player, "vchat:message", message, type)).catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}
function broadcast(message, type = MessageType.Default) {
  if (!validateMessage(message, type))
    return;
  Player.all.forEach((player) => send(player, message, type));
}
function addSuggestion(player, suggestion) {
  if (!Array.isArray(suggestion) && !validateSuggestion(suggestion)) {
    log(`[vchat:addSuggestions] Invalid suggestion`);
    return;
  } else if (Array.isArray(suggestion)) {
    for (const cmd of suggestion) {
      if (validateSuggestion(cmd))
        continue;
      log(`[vchat:addSuggestions] Invalid suggestion`);
      return;
    }
  }
  waitForMount(player).then(() => emitClientRaw(player, "vchat:addSuggestion", suggestion)).catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}
function toggleFocusEnabled(player, enabled) {
  waitForMount(player).then(() => emitClientRaw(player, "vchat:focusEnabled", enabled)).catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}
function focus(player) {
  waitForMount(player).then(() => emitClientRaw(player, "vchat:focus", true)).catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}
function unfocus(player) {
  waitForMount(player).then(() => emitClientRaw(player, "vchat:focus", false)).catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}
function clearHistory(player) {
  emitClientRaw(player, "vchat:clearHistory");
}
function clear(player) {
  waitForMount(player).then(() => emitClientRaw(player, "vchat:clear")).catch(() => log(`[vchat:addSuggestion] Timeout: Player ${player.name} is not mounted`));
}
function onMounted(fn) {
  mountedFreeIds.length > 0 ? currentMountedId = mountedFreeIds.pop() : currentMountedId++;
  mountedListeners.set(currentMountedId, fn);
  return currentMountedId;
}
function offMounted(id) {
  if (id === -1)
    return id;
  if (mountedListeners.delete(id)) {
    mountedFreeIds.push(id);
    return -1;
  }
  log(`[vchat:offMounted] No mount event with id ${id} found`);
  return -1;
}
function isMounted(player) {
  return mountedPlayers.has(player);
}
function mutePlayer(player) {
  mutedPlayers.add(player);
}
function unmutePlayer(player) {
  mutedPlayers.delete(player);
}
function isMuted(player) {
  return mutedPlayers.has(player);
}
function registerCmd(cmdName, handler) {
  if (!validateCommandName(cmdName))
    return;
  cmdName = cmdName.toLocaleLowerCase();
  cmdHandlers.has(cmdName) ? logError(`Failed to register command ${PREFIX}${cmdName}, already registered`) : cmdHandlers.set(cmdName, handler);
}
function unregisterCmd(cmdName) {
  if (!validateCommandName(cmdName))
    return;
  cmdName = cmdName.toLocaleLowerCase();
  !cmdHandlers.has(cmdName) ? logError(`Failed to unregister command /${cmdName}, not registered`) : cmdHandlers.delete(cmdName);
}
function setMessageHandler(fn) {
  messageHandler = fn;
}
function removeMessageHandler() {
  messageHandler = void 0;
}
function restoreMessageHandler() {
  messageHandler = DEFAULT_CHAT_HANDLER;
}
function setMessageProcessor(fn) {
  messageProcessor = fn;
}
function removeMessageProcessor() {
  messageProcessor = void 0;
}
function restoreMessageProcessor() {
  messageProcessor = processMessage;
}

export { addSuggestion, broadcast, clear, clearHistory, focus, isMounted, isMuted, mutePlayer, offMounted, onMounted, processMessage, registerCmd, removeMessageHandler, removeMessageProcessor, restoreMessageHandler, restoreMessageProcessor, send, setMessageHandler, setMessageProcessor, toggleFocusEnabled, unfocus, unmutePlayer, unregisterCmd };
