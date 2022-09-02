import { logError } from 'alt-server';

export function validateCommandName(cmdName: string, prefix: string) {
    if (typeof cmdName !== 'string') {
        logError(`[vchat:registerCommand] Command name is not a string: ${cmdName}`);
        return false;
    }
    if (cmdName.length === 0) {
        logError(`[vchat:registerCommand] Command name is empty`);
        return false;
    }
    if (cmdName.startsWith(prefix)) {
        logError(`[vchat:registerCommand] Command name cannot start with ${prefix}`);
        return false;
    }

    return true;
}
