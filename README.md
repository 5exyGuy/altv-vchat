<br />
<div align="center">
  <h3 align="center">altV-vChat</h3>

  <p align="center">
    A chat resouce for alt:V server
  </p>
</div>

<!-- ABOUT -->

## About

**altV-vChat** is a chat resource for [alt:V](https://altv.mp) server that offers more functionality than the usual
example chat resource. The resource includes full keyboard support, a default message processor, more functions,
autocompletion of command by typing part of the command name in the input field and more.

**Features:**

-   Keyboard and mouse support
-   Command suggestions
-   Replaceable message handler
-   Replaceable message processor
-   More sever-side functions

It is also included in the project together with other examples of front-end framework implementations, if you want to
get some ideas for your own project.

**`WebView` examples:**

-   [x] [Svelte](https://github.com/5exyGuy/altv-vchat/tree/master/views/svelte)
-   [ ] React
-   [ ] Vue.js
-   [ ] SolidJS

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

> **_NOTE:_** Before starting to use a chat resource make sure that _ESMAScript_ modules are enabled in your server
> project or else the resource won't start.

### Prerequisites (Optional)

[pnpm](https://pnpm.io/) is required if you want to make changes in the project because it uses
[Workspaces](https://pnpm.io/workspaces) to manage multiple packages. To make changes, follow the
[installation instructions](https://pnpm.io/installation).

### Installation

1. Download [the latest version]() of the resource **OR** clone the repository into your server's resources folder
    ```sh
    git clone https://github.com/5exyGuy/altv-vchat.git vchat
    ```
2. If you have cloned the repository, follow these steps

    2.1. Inside the resource's folder install required packages

    ```sh
    pnpm install
    ```

    2.2. Change to your preferred implementation of the front-end framework example by adding `filter` flag in the
    `package.json` **(optional)**

    > **_NOTE:_** Make sure to remove the ones you don't need, because if you don't put the flags the right way, you may
    > end up with building multiple examples in one folder.

    ```json
    "build": "turbo run build --filter=!@altv-chat/react --filter=!@altv-chat/vue",
    "dev": "turbo run dev --filter=!@altv-chat/react --filter=!@altv-chat/vue"
    ```

    2.3. Build the project

    ```sh
    pnpm run build
    ```

3. Add the chat resource as a dependency in the `resource.cfg` file inside your resource folder
    > **_NOTE:_** Make sure that the name you insert matches the name of the resource folder.
    ```
    deps: [vchat]
    ```
    **OR** add it into `server.cfg`
    ```
    resources: [vchat]
    ```
4. Import the chat library in your server-side code
    > **_NOTE:_** Make sure that the name of the library you insert matches the name of the resource folder.
    ```js
    import * as chat from 'vchat';
    ```
    > **_NOTE:_** If you are using C#, it is recommended to see how to insert functions in the C# environment
    > ([Resource communication in C#](https://docs.altv.mp/cs/articles/getting-started/resource-communication.html)).
5. Start the server.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES FOR PLAYER -->

## Usage (Player)

### Keyboard and Mouse Support

Chat has keyboard support, which allows you to control the chat. Also, the input field is always in focus, so you can
make mouse clicks in any position. There is a prevention for the input field from losing it's focus.

| Key                                          | Description                                                                                                       |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| <kbd>T</kbd>                                 | Opens the chat                                                                                                    |
| <kbd>ESC</kbd>                               | Closes the chat                                                                                                   |
| <kbd>PageUp</kbd></br><kbd>WheelUp</kbd>     | Scrolls up                                                                                                        |
| <kbd>PageDown</kbd></br><kbd>WheelDown</kbd> | Scrolls down                                                                                                      |
| <kbd>Home</kbd>                              | Scrolls to the top (the oldest message)                                                                           |
| <kbd>End</kbd>                               | Scrolls to the end (the lastest message)                                                                          |
| <kbd>↑</kbd>                                 | Selects command suggestion (if there are any) **OR**</br> Selects a previously entered message (if there are any) |
| <kbd>↓</kbd>                                 | Selects command suggestion (if there are any) **OR**</br>Selects a previously entered message (if there are any)  |

> **_NOTE:_** Only right mouse button and mouse wheel is supported to avoid unnecessary actions.

### Chat Formatting (Default Message Processor)

> **_NOTE:_** By default the chat resource uses it's own message processor. To use your own processor you have to
> overwrite the current chat handler.

#### Bold text

`**Lorem Ipsum is simply dummy text of the printing and typesetting industry**`

**Lorem Ipsum is simply dummy text of the printing and typesetting industry**

#### Italic text

`*Lorem Ipsum is simply dummy text of the printing and typesetting industry*`

_Lorem Ipsum is simply dummy text of the printing and typesetting industry_

#### Deleted text

`~~Lorem Ipsum is simply dummy text of the printing and typesetting industry~~`

~~Lorem Ipsum is simply dummy text of the printing and typesetting industry~~

#### Underlined text

`__Lorem Ipsum is simply dummy text of the printing and typesetting industry__`

<u>Lorem Ipsum is simply dummy text of the printing and typesetting industry</u>

#### Colors

`{b82a42}Lorem Ipsum is simply{/b82a42} dummy text of the {716dbf}printing{/716dbf} and typesetting industry`

<span style="color: #b82a42;">Lorem Ipsum is simply</span> dummy text of the
<span style="color: #716dbf;">printing</span> and typesetting industry`

### Command Suggestions

The default command prefix is `/`.

To get command suggestions, you need to enter the prefix as the first character in the input field and at least one
character after the prefix.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES FOR DEVELOPER -->

## Usage (Developer)

### Messaging

Before sending messages, you should first familiarise yourself with types of messages. There are 6 message types, which
decide how the message will appear in the chat window.

```ts
export enum MessageType {
    Default = 0, // With padding
    Empty = 1, // Without any padding
    Info = 2, // With padding and blue background
    Success = 3, // With padding and green background
    Warning = 4, // With padding and orange background
    Error = 5, // With padding and red background
}
```

There are two ways of sending a message. One way is to use the `send` function, which requires you to specify a specific
player to whom the message will be sent

```ts
export function send(player: Player, message: string, type: MessageType = MessageType.Default): void;
```

**OR** use the `broadcast` function to send a single message to all players

```ts
export function broadcast(message: string, type: MessageType = MessageType.Default): void;
```

---

#### Example

```js
import * as alt from 'alt-server';
import * as chat from 'vchat';

alt.on('playerConnect', (player) => {
    // Sends a message to the logged-in player
    chat.send(player, `Welcome to the server ${player.name}`, 1);
    // Sends a message to all players as well as the one who joined
    chat.broadcast(`Player ${player.name} has joined the server`, 1);
});
```

---

### Command Suggestions

> **_NOTE:_** I recommend inserting some of the commands statically in one of the `WebView` examples to avoid
> unnecessary event dispatches. Each `WebView` example has a `commands.json` file where you can insert your own
> commands.

To add command line suggestions to chat, you need to follow the specified data structure

```ts
export interface CommandSuggestion {
    name: string; // The name of the command.
    description?: string; // The description of the command.
    params?: Array<{ name: string; description?: string }>; // The parameters of the command.
}
```

Adding command suggestions is quite simple, just specify the player and the command suggestion(s)

```ts
export function addSuggestion(player: Player, suggestion: CommandSuggestion | Array<CommandSuggestion>): void;
```

It is also possible to add offers to all players currently connected to the server

```ts
export function addSuggestionAll(suggestion: CommandSuggestion | Array<CommandSuggestion>): void;
```

---

#### Example

```js
import * as alt from 'alt-server';
import * as chat from 'vchat';

const suggestion = {
    name: 'spawn',
    description: 'Teleport a player to the spawnpoint or to the specified coordinates.',
    params: [{ name: 'x' }, { name: 'y' }, { name: 'z' }],
};

alt.on('playerConnect', (player) => {
    chat.addSuggestion(player, suggestion);
});
```

---

### Command Registration

To register a command, you must follow the structure of the function

```ts
export type CommandHandler = (player: Player, args: Array<string>) => void;
```

Each command name is unique, so there can only be one command handler/callback for a particular command name. The
registration includes the name of the team and its handler

```ts
export function registerCmd(cmdName: string, handler: CommandHandler): void;
```

To remove a command, all you need to specify is the command name

```ts
export function unregisterCmd(cmdName: string): void;
```

---

#### Example

```js
import * as alt from 'alt-server';
import * as chat from 'vchat';

chat.registerCmd('spawn', (player, args) => {
    if (args.length === 0) player.spawn(0, 0, 72);
    else if (args.length === 3) {
        const [x, y, z] = args;
        player.spawn(parseFloat(x), parseFloat(y), parseFloat(z));
    }
});
```

---

### Muting Players

> **_NOTE:_** If the default message handler is used, a muted player trying to send a message will receive an `Error`
> message that he is muted.

To check if a player is silenced, use the `isMuted` function

```ts
export function isMuted(player: Player): void;
```

---

#### Mute

Use the `mutePlayer` function to mute the player

```ts
export function mutePlayer(player: Player): void;
```

**OR** mute all connected players

```ts
export function muteAllPlayers(): void;
```

---

#### Unmute

To unmute a player, use the `unmutePlayer` function

```ts
export function unmutePlayer(player: Player): void;
```

**OR** unmute all connected players

```ts
export function muteAllPlayers(): void;
```

---

### Controlling Player's Chat Focus

---

#### Focus Activation

The resource also allows you to control the opening of a player's chat window. To prevent the player from opening the
chat window, use the `toggleFocusEnabled` function

```ts
export function toggleFocusEnabled(player: Player, enabled: boolean): void;
```

**OR** use the `toggleFocusEnabledAll` to toggle every player's chat focus activation

```ts
export function toggleFocusEnabledAll(eanbled: boolean): void;
```

---

#### Focus

Use the `focus` function to focus the chat window of the desired player (focus will work even if player focus is
disabled with `toggleFocusEnabled`)

```ts
export function focus(player: Player): void;
```

**OR** or use `focusAll` to focus all players' chat windows

```ts
export function focusAll(): void;
```

---

#### Unfocus

Use the `unfocus` function to unfocus the desired player's chat window (unfocus will work even if player focus is
disabled with `toggleFocusEnabled`)

```ts
export function unfocus(player: Player): void;
```

**OR** or use `unfocusAll` to unfocus all players' chat windows

```ts
export function unfocusAll(): void;
```

---

### Player Chat Mount Events

> **_NOTE:_** If the `mounted` variable is false, it may mean that the player has disconnected or failed to mount.

```ts
export type MountCallback = (player: Player, mounted: boolean) => void;
```

To know when a player's chat window has been mounted, you can use the `onMounted` function, which will return an `id`
that can later be used in the `offMounted` function

```ts
export function onMounted(fn: MountCallback): number;
```

To remove a particular callback, you need its `id` that `onMounted` returns

```ts
export function offMounted(id: number): number;
```

To check if a player's chat window has been loaded, use the `isMounted` function

```ts
export function isMounted(player: Player): void;
```

#### Example

```js
import * as alt from 'alt-server';
import * as chat from 'vchat';

const id = chat.onMounted((player, mounted) => {
    alt.log(`${player.name}'s chat just mounted`);
});

chat.offMounted(id);

alt.on('playerConnect', (player) => {
    if (!chat.isMounted(player)) return;
    alt.log(`${player.name}'s chat is mounted`);
});
```

### Message Handler

If you're not happy with the default message handling, you can set it to your own. Since the default message handler
manages commands and player correspondence, you will need to set up your own command registration and player
communication.

```ts
export type MessageHandler = (player: Player, message: string) => void;
```

To set the handler to your own, use the `setMessageHandler` function

```ts
export function setMessageHandler(fn: MessageHandler): void;
```

To remove the current handler, use the `removeMessageHandler` function

```ts
export function removeMessageHandler(): void;
```

To restore the handler to its default, use the `restoreMessageHandler` function

```ts
export function restoreMessageHandler(): void;
```

### Message Processor

If there is a need to change the message processor in the default message handler, this is quite simple. And if you
don't need it, you can simply remove it.

```ts
export type MessageProcessor = (message: string) => void;
```

To change the message processor in the default widget, use `setMessageProcessor` function

```ts
export function setMessageProcessor(fn: MessageProcessor): void;
```

To remove the message processor, use the `removeMessageProcessor` function

```ts
export function removeMessageProcessor(): void;
```

To restore the message processor to the default, use the `restoreMessageProcessor` function

```ts
export function restoreMessageProcessor(): void;
```

You can also use the internally used message processor as required (this is the default message processor)

```ts
export function processMessage(message: string): string;
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- EXPORTED FUNCTIONS -->

## Exported Functions

### Interfaces, Enumerators and Types

```ts
// Iterfaces
export interface CommandSuggestion {
    name: string;
    description?: string;
    params?: Array<{ name: string; description?: string }>;
}
// Enums
export enum MessageType {
    Default = 0,
    Empty = 1,
    Info = 2,
    Success = 3,
    Warning = 4,
    Error = 5,
}
// Types
export type CommandHandler = (player: Player, args: Array<string>) => void;
export type MountCallback = (player: Player, mounted: boolean) => void;
export type MessageHandler = (player: Player, message: string) => void;
export type MessageProcessor = (message: string) => void;
```

### Funcions

```ts
export function send(player: Player, message: string, type: MessageType = MessageType.Default): void;
export function broadcast(message: string, type: MessageType = MessageType.Default): void;
export function registerCmd(cmdName: string, handler: CommandHandler): void;
export function unregisterCmd(cmdName: string): void;
export function addSuggestion(player: Player, suggestion: CommandSuggestion | Array<CommandSuggestion>): void;
export function addSuggestionAll(suggestion: CommandSuggestion | Array<CommandSuggestion>): void;
export function toggleFocusEnabled(player: Player, enabled: boolean): void;
export function toggleFocusEnabledAll(enabled: boolean): void;
export function focus(player: Player): void;
export function focusAll(): void;
export function unfocus(player: Player): void;
export function unfocusAll(): void;
export function clearHistory(player: Player): void;
export function clearHistoryAll(): void;
export function clear(player: Player): void;
export function clearAll(): void;
export function mutePlayer(player: Player): void;
export function muteAllPlayers(): void;
export function unmutePlayer(player: Player): void;
export function unmuteAllPlayer(player: Player): void;
export function isMuted(player: Player): void;
export function onMounted(fn: MountCallback): number;
export function offMounted(id: number): number;
export function isMounted(player: Player): void;
export function setMessageHandler(fn: MessageHandler): void;
export function removeMessageHandler(): void;
export function restoreMessageHandler(): void;
export function setMessageProcessor(fn: MessageProcessor): void;
export function removeMessageProcessor(): void;
export function restoreMessageProcessor(): void;
export function processMessage(message: string): string;
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any
contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also
simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

There's no license, so you can do whatever you want with the source code.

<p align="right">(<a href="#top">back to top</a>)</p>
