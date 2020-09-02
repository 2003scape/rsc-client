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
    static descramble(buff, off, len) {
        try {
            let newLen = 0;
            let l = -1;

            for (let idx = 0; idx < len; idx++) {
                let current = buff[off++] & 0xff;
                let k1 = (current >> 4) & 0xf;

                if (l === -1) {
                    if (k1 < 13) {
                        ChatMessage.chars[newLen++] = ChatMessage.charMap[k1];
                    } else {
                        l = k1;
                    }
                } else {
                    ChatMessage.chars[newLen++] =
                        ChatMessage.charMap[(l << 4) + k1 - 195];
                    l = -1;
                }

                k1 = current & 0xf;

                if (l === -1) {
                    if (k1 < 13) {
                        ChatMessage.chars[newLen++] = ChatMessage.charMap[k1];
                    } else {
                        l = k1;
                    }
                } else {
                    ChatMessage.chars[newLen++] =
                        ChatMessage.charMap[(l << 4) + k1 - 195];
                    l = -1;
                }
            }

            let flag = true;

            for (let l1 = 0; l1 < newLen; l1++) {
                let c = ChatMessage.chars[l1];

                if (l1 > 4 && c === C_AT) {
                    ChatMessage.chars[l1] = C_SPACE;
                }

                if (c === C_PRCNT) {
                    ChatMessage.chars[l1] = C_SPACE;
                }

                if (flag && c >= C_A && c <= C_Z) {
                    ChatMessage.chars[l1] += C_CENT;
                    flag = false;
                }

                if (c === C_DOT || c === C_EXCLM) {
                    flag = true;
                }
            }

            return fromCharArray(ChatMessage.chars.slice(0, newLen));
        } catch (e) {
            return '.';
        }
    }

    static scramble(s) {
        if (s.length > 80) {
            s = s.slice(0, 80);
        }

        s = s.toLowerCase();

        let off = 0;
        let lshift = -1;

        for (let k = 0; k < s.length; k++) {
            let currentChar = s.charCodeAt(k);
            let foundCharMapIdx = 0;

            for (let n = 0; n < ChatMessage.charMap.length; n++) {
                if (currentChar !== ChatMessage.charMap[n]) {
                    continue;
                }

                foundCharMapIdx = n;
                break;
            }

            if (foundCharMapIdx > 12) {
                foundCharMapIdx += 195;
            }

            if (lshift === -1) {
                if (foundCharMapIdx < 13) {
                    lshift = foundCharMapIdx;
                } else {
                    ChatMessage.scrambledBytes[off++] = foundCharMapIdx & 0xff;
                }
            } else if (foundCharMapIdx < 13) {
                ChatMessage.scrambledBytes[off++] =
                    ((lshift << 4) + foundCharMapIdx) & 0xff;
                lshift = -1;
            } else {
                ChatMessage.scrambledBytes[off++] =
                    ((lshift << 4) + (foundCharMapIdx >> 4)) & 0xff;
                lshift = foundCharMapIdx & 0xf;
            }
        }

        if (lshift !== -1) {
            ChatMessage.scrambledBytes[off++] = (lshift << 4) & 0xff;
        }

        return off;
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
