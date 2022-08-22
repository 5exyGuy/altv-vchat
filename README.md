<br />
<div align="center">
  <h3 align="center">altV-vChat</h3>

  <p align="center">
    A chat resouce for alt:V server
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT -->

## About

**altV-vChat** is a chat resource for [alt:V](https://altv.mp) server that offers more functionality than the usual
example chat resource. The resource includes full keyboard support, a default message processor, synced functions,
autocompletion of command by typing part of the command name in the input field and more.

**Features:**

-   Keyboard and mouse support
-   Command suggestions
-   Replaceable message handler
-   Default message processor
-   Synced server-side functions

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

Resource does not require any _NPM_ dependencies

### Prerequisites (Optional)

[pnpm](https://pnpm.io/) is required if you want to make changes in the project because it uses
[Workspaces](https://pnpm.io/workspaces) to manage multiple packages.

-   pnpm
    ```sh
    npm install -g pnpm
    ```

### Installation

1. Clone the repository into your server's resources folder
    ```sh
    git clone https://github.com/5exyGuy/altv-vchat.git vchat
    ```
2. Inside the resource's folder install required packages **(optional)**
    ```sh
    pnpm install
    ```
3. Change to build the preffered front-end framework in the `package.json` **(optional)**
    ```json
    "build": "turbo run build --filter=!@altv-chat/react --filter=!@altv-chat/vue",
    "dev": "turbo run dev --filter=!@altv-chat/react --filter=!@altv-chat/vue"
    ```
4. Build the project **(optional)**
    ```sh
    pnpm run build
    ```
5. Add the chat resource as a dependency in the `resource.cfg` file inside your resource folder
    ```
    deps: [vchat]
    ```
    **OR** add it into `server.cfg`
    ```
    resources: [vchat]
    ```
6. Import the chat library in your server-side code
    ```js
    import * as chat from 'vchat';
    ```
    > **_NOTE:_** If you are using C#, it is recommended to see how to insert functions in the C# environment
    > ([Resource communication in C#](https://docs.altv.mp/cs/articles/getting-started/resource-communication.html)).
7. Start the server

    _Windows_

    ```sh
    ./altv-server.exe
    ```

    _Linux_

    ```sh
    ./altv-server.sh
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

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

...

<p align="right">(<a href="#top">back to top</a>)</p>

## Usage (Developer)

### Messaging

To message

```ts
export function send(player: Player, message: string, type: MessageType = MessageType.Default): void;
```

**Example**

```js
import * as alt from 'alt-server';
import * as chat from 'vchat';

alt.on('playerConnect', (player) => {
    const name = player.name;
    const welcomeMessage = `Welcome to the server ${name}!`;
    chat.send(player, welcomeMessage, 1);
});
```

### Command Suggestions

To add command line suggestions to chat, you need to follow the specified data structure:

```ts
export interface CommandSuggestion {
    name: string; // The name of the command.
    description?: string; // The description of the command.
    params?: Array<{ name: string; description?: string }>; // The parameters of the command.
}
```

**Example**

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

### Command Registration

### Message Handler

...

### Message Processor

...

<p align="right">(<a href="#top">back to top</a>)</p>

## Exported Functions

#### Sending messages

> ```ts
> export enum MessageType {
>     Default = 0,
>     Info = 1,
>     Success = 2,
>     Warning = 3,
>     Error = 4,
> }
> ```

```ts
export function send(player: Player, message: string, type: MessageType = MessageType.Default): void;
export function broadcast(message: string, type: MessageType = MessageType.Default): void;
```

#### Registering commands

> ```ts
> export type CommandHandler = (player: Player, args: Array<string>) => void;
> ```

```ts
export function registerCmd(cmdName: string, handler: CommandHandler): void;
export function unregisterCmd(cmdName: string): void;
```

#### Adding command suggestions

> ```ts
> export interface CommandSuggestion {
>     name: string;
>     description?: string;
>     params?: Array<{ name: string; description?: string }>;
> }
> ```

```ts
export function addSuggestion(player: Player, suggestion: CommandSuggestion): void;
export function addSuggestions(player: Player, suggestions: Array<CommandSuggestion>): void;
```

#### Controlling player's chat focus

```ts
export function toggleFocusEnabled(player: Player, enabled: boolean): void;
export function focus(player: Player): void;
export function unfocus(player: Player): void;
```

#### Clearing the chat

```ts
export function clearHistory(player: Player): void;
export function clear(player: Player): void;
```

#### Muting players

```ts
export function mutePlayer(player: Player): void;
export function unmutePlayer(player: Player): void;
export function isMuted(player: Player): void;
```

#### Subscribing to player chat mounting events

> ```ts
> export type MountCallback = (player: Player, mounted: boolean) => void;
> ```

```ts
export function onMounted(fn: MountCallback): number;
export function offMounted(id: number): number;
export function isMounted(player: Player): void;
```

#### Changing the message handler

> ```ts
> export type MessageHandler = (player: Player, message: string) => void;
> ```

```ts
export function setMessageHandler(fn: MessageHandler): void;
export function removeMessageHandler(): void;
export function restoreMessageHandler(): void;
```

#### Changing the message processor

> ```ts
> export type MessageProcessor = (message: string) => void;
> ```

```ts
export function setMessageProcessor(fn: MessageProcessor): void;
export function removeMessageProcessor(): void;
export function restoreMessageProcessor(): void;
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

There's no license, so you can do whatever you want with the repository.

<p align="right">(<a href="#top">back to top</a>)</p>
