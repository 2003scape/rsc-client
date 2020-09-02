const C_0 = '0'.charCodeAt(0);
const C_9 = '9'.charCodeAt(0);
const C_A = 'a'.charCodeAt(0);
const C_ASTERISK = '*'.charCodeAt(0);
const C_BACKSLASH = '\\'.charCodeAt(0);
const C_BIG_A = 'A'.charCodeAt(0);
const C_BIG_Z = 'Z'.charCodeAt(0);
const C_COMMA = ','.charCodeAt(0);
const C_DOT = '.'.charCodeAt(0);
const C_J = 'j'.charCodeAt(0);
const C_Q = 'q'.charCodeAt(0);
const C_SINGLE_QUOTE = "'".charCodeAt(0);
const C_SLASH = '/'.charCodeAt(0);
const C_SPACE = ' '.charCodeAt(0);
const C_V = 'v'.charCodeAt(0);
const C_X = 'x'.charCodeAt(0);
const C_Z = 'z'.charCodeAt(0);

function toCharArray(s) {
    let a = new Uint16Array(s.length);

    for (let i = 0; i < s.length; i += 1) {
        a[i] = s.charCodeAt(i);
    }

    return a;
}

function fromCharArray(a) {
    return Array.from(a)
        .map((c) => String.fromCharCode(c))
        .join('');
}

class WordFilter {
    static loadFilters(fragments, bad, host, tld) {
        WordFilter.loadBad(bad);
        WordFilter.loadHost(host);
        WordFilter.loadFragments(fragments);
        WordFilter.loadTld(tld);
    }

    static loadTld(buffer) {
        let wordCount = buffer.getUnsignedInt();

        WordFilter.tldList = [];
        WordFilter.tldType = new Int32Array(wordCount);

        for (let i = 0; i < wordCount; i++) {
            WordFilter.tldType[i] = buffer.getUnsignedByte();

            let ac = new Uint16Array(buffer.getUnsignedByte());

            for (let j = 0; j < ac.length; j++) {
                ac[j] = buffer.getUnsignedByte();
            }

            WordFilter.tldList.push(ac);
        }
    }

    static loadBad(buffer) {
        let wordCount = buffer.getUnsignedInt();

        WordFilter.badList = [];
        WordFilter.badList.length = wordCount;
        WordFilter.badList.fill(null);
        WordFilter.badCharIds = [];
        WordFilter.badCharIds.length = wordCount;
        WordFilter.badCharIds.fill(null);

        WordFilter.readBuffer(
            buffer,
            WordFilter.badList,
            WordFilter.badCharIds
        );
    }

    static loadHost(buffer) {
        let wordCount = buffer.getUnsignedInt();

        WordFilter.hostList = [];
        WordFilter.hostList.length = wordCount;
        WordFilter.hostList.fill(null);
        WordFilter.hostCharIds = [];
        WordFilter.hostCharIds.length = wordCount;
        WordFilter.hostCharIds.fill(null);

        WordFilter.readBuffer(
            buffer,
            WordFilter.hostList,
            WordFilter.hostCharIds
        );
    }

    static loadFragments(buffer) {
        WordFilter.hashFragments = new Int32Array(buffer.getUnsignedInt());

        for (let i = 0; i < WordFilter.hashFragments.length; i++) {
            WordFilter.hashFragments[i] = buffer.getUnsignedShort();
        }
    }

    static readBuffer(buffer, wordList, charIds) {
        for (let i = 0; i < wordList.length; i++) {
            let currentWord = new Uint16Array(buffer.getUnsignedByte());

            for (let j = 0; j < currentWord.length; j++) {
                currentWord[j] = buffer.getUnsignedByte();
            }

            wordList[i] = currentWord;

            let ids = [];
            ids.length = buffer.getUnsignedInt();

            for (let j = 0; j < ids.length; j++) {
                ids[j] = [
                    buffer.getUnsignedByte() & 0xff,
                    buffer.getUnsignedByte() & 0xff
                ];
            }

            if (ids.length > 0) {
                charIds[i] = ids;
            }
        }
    }

    static filter(input) {
        let inputChars = toCharArray(input.toLowerCase());

        WordFilter.applyDotSlashFilter(inputChars);
        WordFilter.applyBadwordFilter(inputChars);
        WordFilter.applyHostFilter(inputChars);
        WordFilter.heywhathteufck(inputChars);

        for (
            let ignoreIdx = 0;
            ignoreIdx < WordFilter.ignoreList.length;
            ignoreIdx++
        ) {
            for (
                let inputIgnoreIdx = -1;
                (inputIgnoreIdx = input.indexOf(
                    WordFilter.ignoreList[ignoreIdx],
                    inputIgnoreIdx + 1
                )) !== -1;

            ) {
                let ignoreWordChars = toCharArray(
                    WordFilter.ignoreList[ignoreIdx]
                );

                for (
                    let ignorewordIdx = 0;
                    ignorewordIdx < ignoreWordChars.length;
                    ignorewordIdx++
                ) {
                    inputChars[ignorewordIdx + inputIgnoreIdx] =
                        ignoreWordChars[ignorewordIdx];
                }
            }
        }

        if (WordFilter.forceLowerCase) {
            WordFilter.stripLowerCase(toCharArray(input), inputChars);
            WordFilter.toLowerCase(inputChars);
        }

        return fromCharArray(inputChars);
    }

    static stripLowerCase(input, output) {
        for (let i = 0; i < input.length; i++) {
            if (output[i] !== C_ASTERISK && WordFilter.isUpperCase(input[i])) {
                output[i] = input[i];
            }
        }
    }

    static toLowerCase(input) {
        let isUpperCase = true;

        for (let i = 0; i < input.length; i++) {
            let current = input[i];

            if (WordFilter.isLetter(current)) {
                if (isUpperCase) {
                    if (WordFilter.isLowerCase(current)) {
                        isUpperCase = false;
                    }
                } else if (WordFilter.isUpperCase(current)) {
                    input[i] = current + 97 - 65;
                }
            } else {
                isUpperCase = true;
            }
        }
    }

    static applyBadwordFilter(input) {
        for (let i = 0; i < 2; i++) {
            for (let j = WordFilter.badList.length - 1; j >= 0; j--) {
                WordFilter.applyWordFilter(
                    input,
                    WordFilter.badList[j],
                    WordFilter.badCharIds[j]
                );
            }
        }
    }

    static applyHostFilter(input) {
        for (let i = WordFilter.hostList.length - 1; i >= 0; i--) {
            WordFilter.applyWordFilter(
                input,
                WordFilter.hostList[i],
                WordFilter.hostCharIds[i]
            );
        }
    }

    static applyDotSlashFilter(input) {
        let input1 = input.slice();
        let dot = toCharArray('dot');
        WordFilter.applyWordFilter(input1, dot, null);

        let input2 = input.slice();
        let slash = toCharArray('slash');
        WordFilter.applyWordFilter(input2, slash, null);

        for (let i = 0; i < WordFilter.tldList.length; i++) {
            WordFilter.applyTldFilter(
                input,
                input1,
                input2,
                WordFilter.tldList[i],
                WordFilter.tldType[i]
            );
        }
    }

    static applyTldFilter(input, input1, input2, tld, type) {
        if (tld.length > input.length) {
            return;
        }

        for (
            let charIndex = 0;
            charIndex <= input.length - tld.length;
            charIndex++
        ) {
            let inputCharCount = charIndex;
            let l = 0;

            while (inputCharCount < input.length) {
                let i1 = 0;
                let current = input[inputCharCount];
                let next = 0;

                if (inputCharCount + 1 < input.length) {
                    next = input[inputCharCount + 1];
                }

                if (
                    l < tld.length &&
                    (i1 = WordFilter.compareLettersNumbers(
                        tld[l],
                        current,
                        next
                    )) > 0
                ) {
                    inputCharCount += i1;
                    l++;
                    continue;
                }

                if (l === 0) {
                    break;
                }

                if (
                    (i1 = WordFilter.compareLettersNumbers(
                        tld[l - 1],
                        current,
                        next
                    )) > 0
                ) {
                    inputCharCount += i1;
                    continue;
                }

                if (l >= tld.length || !WordFilter.isSpecial(current)) {
                    break;
                }

                inputCharCount++;
            }

            if (l >= tld.length) {
                let flag = false;
                let startMatch = WordFilter.getAsteriskCount(
                    input,
                    input1,
                    charIndex
                );
                let endMatch = WordFilter.getAsteriskCount2(
                    input,
                    input2,
                    inputCharCount - 1
                );

                if (WordFilter.DEBUGTLD) {
                    console.log(
                        `Potential tld: ${tld} at char ${charIndex} ` +
                            `(type="${type}, startmatch="${startMatch}, ` +
                            `endmatch=${endMatch})`
                    );
                }

                if (type === 1 && startMatch > 0 && endMatch > 0) {
                    flag = true;
                }

                if (
                    type === 2 &&
                    ((startMatch > 2 && endMatch > 0) ||
                        (startMatch > 0 && endMatch > 2))
                ) {
                    flag = true;
                }

                if (type === 3 && startMatch > 0 && endMatch > 2) {
                    flag = true;
                }

                if (flag) {
                    if (WordFilter.DEBUGTLD) {
                        console.log(
                            `Filtered tld: ${tld} at char ${charIndex}`
                        );
                    }

                    let l1 = charIndex;
                    let i2 = inputCharCount - 1;

                    if (startMatch > 2) {
                        if (startMatch === 4) {
                            let flag1 = false;

                            for (let k2 = l1 - 1; k2 >= 0; k2--) {
                                if (flag1) {
                                    if (input1[k2] !== C_ASTERISK) {
                                        break;
                                    }

                                    l1 = k2;
                                } else if (input1[k2] === C_ASTERISK) {
                                    l1 = k2;
                                    flag1 = true;
                                }
                            }
                        }

                        let flag2 = false;

                        for (let l2 = l1 - 1; l2 >= 0; l2--) {
                            if (flag2) {
                                if (WordFilter.isSpecial(input[l2])) {
                                    break;
                                }

                                l1 = l2;
                            } else if (!WordFilter.isSpecial(input[l2])) {
                                flag2 = true;
                                l1 = l2;
                            }
                        }
                    }

                    if (endMatch > 2) {
                        if (endMatch === 4) {
                            let flag3 = false;

                            for (let i3 = i2 + 1; i3 < input.length; i3++) {
                                if (flag3) {
                                    if (input2[i3] !== C_ASTERISK) {
                                        break;
                                    }

                                    i2 = i3;
                                } else if (input2[i3] === C_ASTERISK) {
                                    i2 = i3;
                                    flag3 = true;
                                }
                            }
                        }

                        let flag4 = false;

                        for (let j3 = i2 + 1; j3 < input.length; j3++) {
                            if (flag4) {
                                if (WordFilter.isSpecial(input[j3])) {
                                    break;
                                }

                                i2 = j3;
                            } else if (!WordFilter.isSpecial(input[j3])) {
                                flag4 = true;
                                i2 = j3;
                            }
                        }
                    }

                    for (let j2 = l1; j2 <= i2; j2++) {
                        input[j2] = C_ASTERISK;
                    }
                }
            }
        }
    }

    static getAsteriskCount(input, input1, len) {
        if (len === 0) {
            return 2;
        }

        for (let j = len - 1; j >= 0; j--) {
            if (!WordFilter.isSpecial(input[j])) {
                break;
            }

            if (input[j] === C_COMMA || input[j] === C_DOT) {
                return 3;
            }
        }

        let filtered = 0;

        for (let l = len - 1; l >= 0; l--) {
            if (!WordFilter.isSpecial(input1[l])) {
                break;
            }

            if (input1[l] === C_ASTERISK) {
                filtered++;
            }
        }

        if (filtered >= 3) {
            return 4;
        }

        return WordFilter.isSpecial(input[len - 1]) ? 1 : 0;
    }

    static getAsteriskCount2(input, input1, len) {
        if (len + 1 === input.length) {
            return 2;
        }

        for (let j = len + 1; j < input.length; j++) {
            if (!WordFilter.isSpecial(input[j])) {
                break;
            }

            if (input[j] === C_BACKSLASH || input[j] === C_SLASH) {
                return 3;
            }
        }

        let filtered = 0;

        for (let l = len + 1; l < input.length; l++) {
            if (!WordFilter.isSpecial(input1[l])) {
                break;
            }

            if (input1[l] === C_ASTERISK) {
                filtered++;
            }
        }

        if (filtered >= 5) {
            return 4;
        }

        return WordFilter.isSpecial(input[len + 1]) ? 1 : 0;
    }

    static applyWordFilter(input, wordList, charIds) {
        if (wordList.length > input.length) {
            return;
        }

        for (
            let charIndex = 0;
            charIndex <= input.length - wordList.length;
            charIndex++
        ) {
            let inputCharCount = charIndex;
            let k = 0;
            let specialChar = false;

            while (inputCharCount < input.length) {
                let l = 0;
                let inputChar = input[inputCharCount];
                let nextChar = 0;

                if (inputCharCount + 1 < input.length) {
                    nextChar = input[inputCharCount + 1];
                }

                if (
                    k < wordList.length &&
                    (l = WordFilter.compareLettersSymbols(
                        wordList[k],
                        inputChar,
                        nextChar
                    )) > 0
                ) {
                    inputCharCount += l;
                    k++;
                    continue;
                }

                if (k === 0) {
                    break;
                }

                if (
                    (l = WordFilter.compareLettersSymbols(
                        wordList[k - 1],
                        inputChar,
                        nextChar
                    )) > 0
                ) {
                    inputCharCount += l;
                    continue;
                }

                if (
                    k >= wordList.length ||
                    !WordFilter.isNotLowerCase(inputChar)
                ) {
                    break;
                }

                if (
                    WordFilter.isSpecial(inputChar) &&
                    inputChar !== C_SINGLE_QUOTE
                ) {
                    specialChar = true;
                }

                inputCharCount++;
            }

            if (k >= wordList.length) {
                let filter = true;

                if (WordFilter.DEBUGTLD) {
                    console.log(
                        `Potential word: ${wordList} at char ${charIndex}`
                    );
                }

                if (!specialChar) {
                    let prevChar = C_SPACE;

                    if (charIndex - 1 >= 0) {
                        prevChar = input[charIndex - 1];
                    }

                    let curChar = C_SPACE;

                    if (inputCharCount < input.length) {
                        curChar = input[inputCharCount];
                    }

                    let prevId = WordFilter.getCharId(prevChar);
                    let curId = WordFilter.getCharId(curChar);

                    if (
                        charIds &&
                        WordFilter.compareCharIds(charIds, prevId, curId)
                    ) {
                        filter = false;
                    }
                } else {
                    let flag2 = false;
                    let flag3 = false;

                    if (
                        charIndex - 1 < 0 ||
                        (WordFilter.isSpecial(input[charIndex - 1]) &&
                            input[charIndex - 1] !== C_SINGLE_QUOTE)
                    ) {
                        flag2 = true;
                    }

                    if (
                        inputCharCount >= input.length ||
                        (WordFilter.isSpecial(input[inputCharCount]) &&
                            input[inputCharCount] !== C_SINGLE_QUOTE)
                    ) {
                        flag3 = true;
                    }

                    if (!flag2 || !flag3) {
                        let flag4 = false;
                        let j1 = charIndex - 2;

                        if (flag2) {
                            j1 = charIndex;
                        }

                        for (; !flag4 && j1 < inputCharCount; j1++) {
                            if (
                                j1 >= 0 &&
                                (!WordFilter.isSpecial(input[j1]) ||
                                    input[j1] === C_SINGLE_QUOTE)
                            ) {
                                let ac2 = new Uint16Array(3);
                                let k1;

                                for (k1 = 0; k1 < 3; k1++) {
                                    if (
                                        j1 + k1 >= input.length ||
                                        (WordFilter.isSpecial(input[j1 + k1]) &&
                                            input[j1 + k1] !== C_SINGLE_QUOTE)
                                    ) {
                                        break;
                                    }

                                    ac2[k1] = input[j1 + k1];
                                }

                                let flag5 = true;

                                if (k1 === 0) {
                                    flag5 = false;
                                }

                                if (
                                    k1 < 3 &&
                                    j1 - 1 >= 0 &&
                                    (!WordFilter.isSpecial(input[j1 - 1]) ||
                                        input[j1 - 1] === C_SINGLE_QUOTE)
                                ) {
                                    flag5 = false;
                                }

                                if (
                                    flag5 &&
                                    !WordFilter.containsFragmentHashes(ac2)
                                ) {
                                    flag4 = true;
                                }
                            }
                        }

                        if (!flag4) {
                            filter = false;
                        }
                    }
                }

                if (filter) {
                    if (WordFilter.DEBUGWORD) {
                        console.log(
                            `Filtered word: ${wordList} at char ${charIndex}`
                        );
                    }

                    for (let i1 = charIndex; i1 < inputCharCount; i1++) {
                        input[i1] = C_ASTERISK;
                    }
                }
            }
        }
    }

    static compareCharIds(charIdData, prevCharId, curCharId) {
        let first = 0;

        if (
            charIdData[first][0] === prevCharId &&
            charIdData[first][1] === curCharId
        ) {
            return true;
        }

        let last = charIdData.length - 1;

        if (
            charIdData[last][0] === prevCharId &&
            charIdData[last][1] === curCharId
        ) {
            return true;
        }

        while (first !== last && first + 1 !== last) {
            let middle = ((first + last) / 2) | 0;

            if (
                charIdData[middle][0] === prevCharId &&
                charIdData[middle][1] === curCharId
            ) {
                return true;
            }

            if (
                prevCharId < charIdData[middle][0] ||
                (prevCharId === charIdData[middle][0] &&
                    curCharId < charIdData[middle][1])
            ) {
                last = middle;
            } else {
                first = middle;
            }
        }

        return false;
    }

    static compareLettersNumbers(filterChar, currentChar, nextChar) {
        filterChar = String.fromCharCode(filterChar);
        currentChar = String.fromCharCode(currentChar);
        nextChar = String.fromCharCode(nextChar);

        if (filterChar === currentChar) {
            return 1;
        }

        if (filterChar === 'e' && currentChar === '3') {
            return 1;
        }

        if (
            filterChar === 't' &&
            (currentChar === '7' || currentChar === '+')
        ) {
            return 1;
        }

        if (
            filterChar === 'a' &&
            (currentChar === '4' || currentChar === '@')
        ) {
            return 1;
        }

        if (filterChar === 'o' && currentChar === '0') {
            return 1;
        }

        if (filterChar === 'i' && currentChar === '1') {
            return 1;
        }

        if (filterChar === 's' && currentChar === '5') {
            return 1;
        }

        if (filterChar === 'f' && currentChar === 'p' && nextChar === 'h') {
            return 2;
        }

        return filterChar === 'g' && currentChar === '9' ? 1 : 0;
    }

    static compareLettersSymbols(filterChar, currentChar, nextChar) {
        filterChar = String.fromCharCode(filterChar);
        currentChar = String.fromCharCode(currentChar);
        nextChar = String.fromCharCode(nextChar);

        if (filterChar === '*') {
            return 0;
        }

        if (filterChar === currentChar) {
            return 1;
        }

        if (filterChar >= 'a' && filterChar <= 'z') {
            if (filterChar === 'e') {
                return currentChar === '3' ? 1 : 0;
            }

            if (filterChar === 't') {
                return currentChar === '7' ? 1 : 0;
            }

            if (filterChar === 'a') {
                return currentChar === '4' || currentChar === '@' ? 1 : 0;
            }

            if (filterChar === 'o') {
                if (currentChar === '0' || currentChar === '*') {
                    return 1;
                }

                return currentChar === '(' && nextChar === ')' ? 2 : 0;
            }

            if (filterChar === 'i') {
                return currentChar === 'y' ||
                    currentChar === 'l' ||
                    currentChar === 'j' ||
                    currentChar === 'l' ||
                    currentChar === '!' ||
                    currentChar === ':' ||
                    currentChar === ';'
                    ? 1
                    : 0;
            }

            if (filterChar === 'n') {
                return 0;
            }

            if (filterChar === 's') {
                return currentChar === '5' ||
                    currentChar === 'z' ||
                    currentChar === '$'
                    ? 1
                    : 0;
            }

            if (filterChar === 'r') {
                return 0;
            }

            if (filterChar === 'h') {
                return 0;
            }

            if (filterChar === 'l') {
                return currentChar === '1' ? 1 : 0;
            }

            if (filterChar === 'd') {
                return 0;
            }

            if (filterChar === 'c') {
                return currentChar === '(' ? 1 : 0;
            }

            if (filterChar === 'u') {
                return currentChar === 'v' ? 1 : 0;
            }

            if (filterChar === 'm') {
                return 0;
            }

            if (filterChar === 'f') {
                return currentChar === 'p' && nextChar === 'h' ? 2 : 0;
            }

            if (filterChar === 'p') {
                return 0;
            }

            if (filterChar === 'g') {
                return currentChar === '9' || currentChar === '6' ? 1 : 0;
            }

            if (filterChar === 'w') {
                return currentChar === 'v' && nextChar === 'v' ? 2 : 0;
            }

            if (filterChar === 'y') {
                return 0;
            }

            if (filterChar === 'b') {
                return currentChar === '1' && nextChar === '3' ? 2 : 0;
            }

            if (filterChar === 'v') {
                return 0;
            }

            if (filterChar === 'k') {
                return 0;
            }

            if (filterChar === 'x') {
                return currentChar === ')' && nextChar === '(' ? 2 : 0;
            }

            if (filterChar === 'j') {
                return 0;
            }

            if (filterChar === 'q') {
                return 0;
            }

            if (filterChar === 'z') {
                return 0;
            }
        }

        if (filterChar >= '0' && filterChar <= '9') {
            if (filterChar === '0') {
                if (currentChar === 'o' || currentChar === 'O') {
                    return 1;
                }

                return currentChar === '(' && nextChar === ')' ? 2 : 0;
            }
            if (filterChar === '1') {
                return currentChar !== 'l' ? 0 : 1;
            }

            if (filterChar === '2') {
                return 0;
            }

            if (filterChar === '3') {
                return 0;
            }

            if (filterChar === '4') {
                return 0;
            }

            if (filterChar === '5') {
                return 0;
            }

            if (filterChar === '6') {
                return 0;
            }

            if (filterChar === '7') {
                return 0;
            }

            if (filterChar === '8') {
                return 0;
            }

            if (filterChar === '9') {
                return 0;
            }
        }

        if (filterChar === '-') {
            return 0;
        }

        if (filterChar === ',') {
            return currentChar === '.' ? 1 : 0;
        }

        if (filterChar === '.') {
            return currentChar === ',' ? 1 : 0;
        }

        if (filterChar === '(') {
            return 0;
        }

        if (filterChar === ')') {
            return 0;
        }

        if (filterChar === '!') {
            return currentChar === 'i' ? 1 : 0;
        }

        if (filterChar === "'") {
            return 0;
        }

        if (WordFilter.DEBUGWORD) {
            console.log(`Letter=${filterChar} not matched`);
        }

        return 0;
    }

    static getCharId(c) {
        if (c >= C_A && c <= C_Z) {
            return c - 97 + 1;
        }

        if (c === C_SINGLE_QUOTE) {
            return 28;
        }

        if (c >= C_0 && c <= C_9) {
            return c - 48 + 29;
        }

        return 27;
    }

    static heywhathteufck(input) {
        let digitIndex = 0;
        let fromIndex = 0;
        let k = 0;
        let l = 0;

        while ((digitIndex = WordFilter.indexOfDigit(input, fromIndex)) != -1) {
            let flag = false;

            for (let i = fromIndex; i >= 0 && i < digitIndex && !flag; i++) {
                if (
                    !WordFilter.isSpecial(input[i]) &&
                    !WordFilter.isNotLowerCase(input[i])
                ) {
                    flag = true;
                }
            }

            if (flag) {
                k = 0;
            }

            if (k === 0) {
                l = digitIndex;
            }

            fromIndex = WordFilter.indexOfNonDigit(input, digitIndex);

            let j1 = 0;

            for (let k1 = digitIndex; k1 < fromIndex; k1++) {
                j1 = j1 * 10 + input[k1] - 48;
            }

            if (j1 > 255 || fromIndex - digitIndex > 8) {
                k = 0;
            } else {
                k++;
            }

            if (k === 4) {
                for (let i = l; i < fromIndex; i++) {
                    input[i] = C_ASTERISK;
                }

                k = 0;
            }
        }
    }

    static indexOfDigit(input, fromIndex) {
        for (let i = fromIndex; i < input.length && i >= 0; i++) {
            if (input[i] >= C_0 && input[i] <= C_9) {
                return i;
            }
        }

        return -1;
    }

    static indexOfNonDigit(input, fromIndex) {
        for (let i = fromIndex; i < input.length && i >= 0; i++) {
            if (input[i] < C_0 || input[i] > C_9) {
                return i;
            }
        }

        return input.length;
    }

    static isSpecial(c) {
        return !WordFilter.isLetter(c) && !WordFilter.isDigit(c);
    }

    static isNotLowerCase(c) {
        if (c < C_A || c > C_Z) {
            return true;
        }

        return c === C_V || c === C_X || c === C_J || c === C_Q || c === C_Z;
    }

    static isLetter(c) {
        return (c >= C_A && c <= C_Z) || (c >= C_BIG_A && c <= C_BIG_Z);
    }

    static isDigit(c) {
        return c >= C_0 && c <= C_9;
    }

    static isLowerCase(c) {
        return c >= C_A && c <= C_Z;
    }

    static isUpperCase(c) {
        return c >= C_BIG_A && c <= C_BIG_Z;
    }

    static containsFragmentHashes(input) {
        let notNum = true;

        for (let i = 0; i < input.length; i++) {
            if (!WordFilter.isDigit(input[i]) && input[i] !== 0) {
                notNum = false;
            }
        }

        if (notNum) {
            return true;
        }

        let inputHash = WordFilter.wordToHash(input);
        let first = 0;
        let last = WordFilter.hashFragments.length - 1;

        if (
            inputHash === WordFilter.hashFragments[first] ||
            inputHash === WordFilter.hashFragments[last]
        ) {
            return true;
        }

        while (first != last && first + 1 != last) {
            let middle = ((first + last) / 2) | 0;

            if (inputHash === WordFilter.hashFragments[middle]) {
                return true;
            }

            if (inputHash < WordFilter.hashFragments[middle]) {
                last = middle;
            } else {
                first = middle;
            }
        }

        return false;
    }

    static wordToHash(word) {
        if (word.length > 6) {
            return 0;
        }

        let hash = 0;

        for (let i = 0; i < word.length; i++) {
            let c = word[word.length - i - 1];

            if (c >= C_A && c <= C_Z) {
                hash = (hash * 38 + c - 97 + 1) | 0;
            } else if (c === C_SINGLE_QUOTE) {
                hash = (hash * 38 + 27) | 0;
            } else if (c >= C_0 && c <= C_9) {
                hash = (hash * 38 + c - 48 + 28) | 0;
            } else if (c !== 0) {
                if (WordFilter.DEBUGWORD) {
                    console.log(`wordToHash failed on ${fromCharArray(word)}`);
                }

                return 0;
            }
        }

        return hash;
    }
}

WordFilter.DEBUGTLD = false;
WordFilter.DEBUGWORD = false;
WordFilter.forceLowerCase = true;
WordFilter.ignoreList = ['cook', "cook's", 'cooks', 'seeks', 'sheet'];

module.exports = WordFilter;

