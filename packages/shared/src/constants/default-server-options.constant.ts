import type { ServerOptions } from '../interfaces';

export const DefaultServerOptions: ServerOptions = {
    emojiCDN: 'http://resource/emojis/{0}.{1}',
    enableDefaultMessageFormatter: true,
    enableHTMLInjections: false,
    logPlayerCommands: false,
    logPlayerMessages: false,
    muteMessage: 'You are muted.',
    prefix: '/',
    unknownCommandMessage: 'Unknown command: {0}',
};
