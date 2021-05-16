const C_A = 'a'.charCodeAt(0);
const C_AT = '@'.charCodeAt(0);
const C_DOT = '.'.charCodeAt(0);
const C_EXCLM = '!'.charCodeAt(0);
const C_PRCNT = '%'.charCodeAt(0);
const C_SPACE = ' '.charCodeAt(0);
const C_Z = 'z'.charCodeAt(0);
const C_CENT = '\uFFE0'.charCodeAt(0);

function fromCharArray(a) {
    return Array.from(a)
        .map((c) => String.fromCharCode(c))
        .join('');
}

class ChatMessage {
    static descramble(buffer, offset, length) {
        try {
            let newLength = 0;
            let leftShift = -1;

            for (let i = 0; i < length; i++) {
                const current = buffer[offset++] & 0xff;
                let charMapIndex = (current >> 4) & 0xf;

                if (leftShift === -1) {
                    if (charMapIndex < 13) {
                        ChatMessage.chars[newLength++] =
                            ChatMessage.charMap[charMapIndex];
                    } else {
                        leftShift = charMapIndex;
                    }
                } else {
                    ChatMessage.chars[newLength++] =
                        ChatMessage.charMap[
                            (leftShift << 4) + charMapIndex - 195
                        ];

                    leftShift = -1;
                }

                charMapIndex = current & 0xf;

                if (leftShift === -1) {
                    if (charMapIndex < 13) {
                        ChatMessage.chars[newLength++] =
                            ChatMessage.charMap[charMapIndex];
                    } else {
                        leftShift = charMapIndex;
                    }
                } else {
                    ChatMessage.chars[newLength++] =
                        ChatMessage.charMap[
                            (leftShift << 4) + charMapIndex - 195
                        ];

                    leftShift = -1;
                }
            }

            let flag = true;

            for (let i = 0; i < newLength; i++) {
                const currentChar = ChatMessage.chars[i];

                if (i > 4 && currentChar === C_AT) {
                    ChatMessage.chars[i] = C_SPACE;
                }

                if (currentChar === C_PRCNT) {
                    ChatMessage.chars[i] = C_SPACE;
                }

                if (flag && currentChar >= C_A && currentChar <= C_Z) {
                    ChatMessage.chars[i] += C_CENT;
                    flag = false;
                }

                if (currentChar === C_DOT || currentChar === C_EXCLM) {
                    flag = true;
                }
            }

            return fromCharArray(ChatMessage.chars.slice(0, newLength));
        } catch (e) {
            return '.';
        }
    }

    static scramble(message) {
        if (message.length > 80) {
            message = message.slice(0, 80);
        }

        message = message.toLowerCase();

        let offset = 0;
        let leftShift = -1;

        for (let i = 0; i < message.length; i++) {
            const currentChar = message.charCodeAt(i);
            let charMapIndex = 0;

            for (let j = 0; j < ChatMessage.charMap.length; j++) {
                if (currentChar === ChatMessage.charMap[j]) {
                    charMapIndex = j;
                    break;
                }
            }

            if (charMapIndex > 12) {
                charMapIndex += 195;
            }

            if (leftShift === -1) {
                if (charMapIndex < 13) {
                    leftShift = charMapIndex;
                } else {
                    ChatMessage.scrambledBytes[offset++] =
                        charMapIndex & 0xff;
                }
            } else if (charMapIndex < 13) {
                ChatMessage.scrambledBytes[offset++] =
                    ((leftShift << 4) + charMapIndex) & 0xff;

                leftShift = -1;
            } else {
                ChatMessage.scrambledBytes[offset++] =
                    ((leftShift << 4) + (charMapIndex >> 4)) & 0xff;

                leftShift = charMapIndex & 0xf;
            }
        }

        if (leftShift !== -1) {
            ChatMessage.scrambledBytes[offset++] = (leftShift << 4) & 0xff;
        }

        return offset;
    }
}

ChatMessage.scrambledBytes = new Int8Array(100);
ChatMessage.chars = new Uint16Array(100);
ChatMessage.charMap = new Uint16Array(
    [
        ' ',
        'e',
        't',
        'a',
        'o',
        'i',
        'h',
        'n',
        's',
        'r',
        'd',
        'l',
        'u',
        'm',
        'w',
        'c',
        'y',
        'f',
        'g',
        'p',
        'b',
        'v',
        'k',
        'x',
        'j',
        'q',
        'z',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        ' ',
        '!',
        '?',
        '.',
        ',',
        ':',
        ';',
        '(',
        ')',
        '-',
        '&',
        '*',
        '\\',
        "'",
        '@',
        '#',
        '+',
        '=',
        '\243',
        '$',
        '%',
        '"',
        '[',
        ']'
    ].map((c) => c.charCodeAt(0))
);

module.exports = ChatMessage;
