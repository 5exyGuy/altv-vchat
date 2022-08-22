/**
 * Processes the message to HTML.
 */
export function processMessage(message: string, removeHtml: boolean = true) {
    if (removeHtml)
        message = message
            .replace(/</g, '&lt;') // <
            .replace(/'/g, '&#39') // '
            .replace(/"/g, '&#34'); // "

    message = message
        .replace(/\*\*(.+?)\*\*/gim, '<b>$1</b>') // Bold text
        .replace(/\*(.+?)\*/gim, '<i>$1</i>') // Italic text
        .replace(/~~(.+?)~~/gim, '<del>$1</del>') // Deleted text
        .replace(/__(.+?)__/gim, '<ins>$1</ins>') // Underlined text
        .replace(/\{([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\}(.*?){\/\1}/gim, '<span style="color: #$1;">$2</span>'); // HEX color

    return message.trim(); // Using trim method to remove whitespace
}
