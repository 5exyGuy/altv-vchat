/**
 * Processes the message to HTML.
 */
export const DEFAULT_MESSAGE_PROCESSOR = (message: string) => {
    message = message
        .replace(/\*\*(.+?)\*\*/gim, '<b>$1</b>') // Bold text
        .replace(/\*(.+?)\*/gim, '<i>$1</i>') // Italic text
        .replace(/~~(.+?)~~/gim, '<del>$1</del>') // Deleted text
        .replace(/__(.+?)__/gim, '<ins>$1</ins>'); // Underlined text

    const hexMatches = [...message.matchAll(/{([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\}/gim)];

    message = hexMatches.reduce(
        (prevValue, match, index) =>
            (prevValue +=
                `<span style="color: #${match[1]}">` +
                message.substring(
                    (match.index as number) + match[0]!.length,
                    hexMatches.length > index + 1 ? hexMatches[index + 1]!.index : message.length,
                ) +
                '</span>'),
        hexMatches.length > 0 && hexMatches[0]!.index === 0
            ? ''
            : hexMatches.length > 0
            ? message.slice(0, hexMatches[0]!.index)
            : message,
    );

    return message.trim(); // Using trim method to remove whitespace
};
