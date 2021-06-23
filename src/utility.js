const BZLib = require('./bzlib');
const FileDownloadStream = require('./lib/net/file-download-stream');
const Long = require('long');

const C_0 = '0'.charCodeAt(0);
const C_9 = '9'.charCodeAt(0);
const C_A = 'a'.charCodeAt(0);
const C_BIG_A = 'A'.charCodeAt(0);
const C_BIG_Z = 'Z'.charCodeAt(0);
const C_Z = 'z'.charCodeAt(0);

class Utility {
    static openFile(s) {
        return new FileDownloadStream(s);
    }

    static getUnsignedByte(i) {
        return i & 0xff;
    }

    static getUnsignedShort(buffer, offset) {
        return ((buffer[offset] & 0xff) << 8) + (buffer[offset + 1] & 0xff);
    }

    static getUnsignedInt(buffer, offset) {
        return (
            ((buffer[offset] & 0xff) << 24) +
            ((buffer[offset + 1] & 0xff) << 16) +
            ((buffer[offset + 2] & 0xff) << 8) +
            (buffer[offset + 3] & 0xff)
        );
    }

    static getUnsignedLong(buffer, offset) {
        return Long.fromInt(Utility.getUnsignedInt(buffer, offset) & 0xffffffff)
            .shiftLeft(32)
            .add(
                new Long(
                    Utility.getUnsignedInt(buffer, offset + 4) & 0xffffffff
                )
            );
    }

    static getSignedShort(buffer, offset) {
        let i =
            (Utility.getUnsignedByte(buffer[offset]) * 256 +
                Utility.getUnsignedByte(buffer[offset + 1])) |
            0;

        if (i > 32767) {
            i -= 0x10000;
        }

        return i;
    }

    static getStackInt(buffer, offset) {
        if ((buffer[offset] & 0xff) < 128) {
            return buffer[offset];
        } else {
            return (
                (((buffer[offset] & 0xff) - 128) << 24) +
                ((buffer[offset + 1] & 0xff) << 16) +
                ((buffer[offset + 2] & 0xff) << 8) +
                (buffer[offset + 3] & 0xff)
            );
        }
    }

    static getBitMask(buffer, start, length) {
        let byteOffset = start >> 3;
        let bitOffset = 8 - (start & 7);
        let bits = 0;

        for (; length > bitOffset; bitOffset = 8) {
            bits +=
                (buffer[byteOffset++] & Utility.bitmask[bitOffset]) <<
                (length - bitOffset);

            length -= bitOffset;
        }

        if (length === bitOffset) {
            bits += buffer[byteOffset] & Utility.bitmask[bitOffset];
        } else {
            bits +=
                (buffer[byteOffset] >> (bitOffset - length)) &
                Utility.bitmask[length];
        }

        return bits;
    }

    static formatAuthString(raw, maxLength) {
        let formatted = '';

        for (let i = 0; i < maxLength; i++) {
            if (i >= raw.length) {
                formatted = formatted + ' ';
            } else {
                let charCode = raw.charCodeAt(i);

                if (charCode >= C_A && charCode <= C_Z) {
                    formatted = formatted + String.fromCharCode(charCode);
                } else if (charCode >= C_BIG_A && charCode <= C_BIG_Z) {
                    formatted = formatted + String.fromCharCode(charCode);
                } else if (charCode >= C_0 && charCode <= C_9) {
                    formatted = formatted + String.fromCharCode(charCode);
                } else {
                    formatted = formatted + '_';
                }
            }
        }

        return formatted;
    }

    static ipToString(ip) {
        return (
            ((ip >> 24) & 0xff) +
            '.' +
            ((ip >> 16) & 0xff) +
            '.' +
            ((ip >> 8) & 0xff) +
            '.' +
            (ip & 0xff)
        );
    }

    static usernameToHash(username) {
        let cleaned = '';

        for (let i = 0; i < username.length; i++) {
            let c = username.charCodeAt(i);

            if (c >= C_A && c <= C_Z) {
                cleaned = cleaned + String.fromCharCode(c);
            } else if (c >= C_BIG_A && c <= C_BIG_Z) {
                cleaned = cleaned + String.fromCharCode(c + 97 - 65);
            } else if (c >= C_0 && c <= C_9) {
                cleaned = cleaned + String.fromCharCode(c);
            } else {
                cleaned = cleaned + ' ';
            }
        }

        cleaned = cleaned.trim();

        if (cleaned.length > 12) {
            cleaned = cleaned.slice(0, 12);
        }

        let hash = new Long(0);

        for (let i = 0; i < cleaned.length; i++) {
            let charCode = cleaned.charCodeAt(i);

            hash = hash.multiply(37);

            if (charCode >= C_A && charCode <= C_Z) {
                hash = hash.add(1 + charCode - 97);
            } else if (charCode >= C_0 && charCode <= C_9) {
                hash = hash.add(27 + charCode - 48);
            }
        }

        return hash;
    }

    static hashToUsername(hash) {
        if (hash.lessThan(0)) {
            return 'invalidName';
        }

        let username = '';

        while (!hash.equals(0)) {
            let charCode = hash.modulo(37).toInt();
            hash = hash.divide(37);

            if (charCode === 0) {
                username = ' ' + username;
            } else if (charCode < 27) {
                if (hash.modulo(37).equals(0)) {
                    username =
                        String.fromCharCode(charCode + 65 - 1) + username;
                } else {
                    username =
                        String.fromCharCode(charCode + 97 - 1) + username;
                }
            } else {
                username = String.fromCharCode(charCode + 48 - 27) + username;
            }
        }

        return username;
    }

    static getDataFileOffset(fileName, buffer) {
        let numEntries = Utility.getUnsignedShort(buffer, 0);
        let wantedHash = 0;

        fileName = fileName.toUpperCase();

        for (let k = 0; k < fileName.length; k++) {
            wantedHash = ((wantedHash * 61) | 0) + fileName.charCodeAt(k) - 32;
        }

        let offset = 2 + numEntries * 10;

        for (let entry = 0; entry < numEntries; entry++) {
            let fileHash =
                ((buffer[entry * 10 + 2] & 0xff) * 0x1000000 +
                    (buffer[entry * 10 + 3] & 0xff) * 0x10000 +
                    (buffer[entry * 10 + 4] & 0xff) * 256 +
                    (buffer[entry * 10 + 5] & 0xff)) |
                0;

            let fileSize =
                ((buffer[entry * 10 + 9] & 0xff) * 0x10000 +
                    (buffer[entry * 10 + 10] & 0xff) * 256 +
                    (buffer[entry * 10 + 11] & 0xff)) |
                0;

            if (fileHash === wantedHash) {
                return offset;
            }

            offset += fileSize;
        }

        return 0;
    }

    static getDataFileLength(fileName, buffer) {
        const numEntries = Utility.getUnsignedShort(buffer, 0);
        let wantedHash = 0;

        fileName = fileName.toUpperCase();

        for (let i = 0; i < fileName.length; i++) {
            wantedHash = ((wantedHash * 61) | 0) + fileName.charCodeAt(i) - 32;
        }

        for (let i = 0; i < numEntries; i++) {
            let fileHash =
                ((buffer[i * 10 + 2] & 0xff) * 0x1000000 +
                    (buffer[i * 10 + 3] & 0xff) * 0x10000 +
                    (buffer[i * 10 + 4] & 0xff) * 256 +
                    (buffer[i * 10 + 5] & 0xff)) |
                0;

            let fileSize =
                ((buffer[i * 10 + 6] & 0xff) * 0x10000 +
                    (buffer[i * 10 + 7] & 0xff) * 256 +
                    (buffer[i * 10 + 8] & 0xff)) |
                0;

            if (fileHash === wantedHash) {
                return fileSize;
            }
        }

        return 0;
    }

    static loadData(fileName, extraSize, archiveData) {
        return Utility.unpackData(fileName, extraSize, archiveData, null);
    }

    static unpackData(fileName, extraSize, archiveData, fileData) {
        const numEntries =
            ((archiveData[0] & 0xff) * 256 + (archiveData[1] & 0xff)) | 0;

        let wantedHash = 0;

        fileName = fileName.toUpperCase();

        for (let i = 0; i < fileName.length; i++) {
            wantedHash = ((wantedHash * 61) | 0) + fileName.charCodeAt(i) - 32;
        }

        let offset = 2 + numEntries * 10;

        for (let entry = 0; entry < numEntries; entry++) {
            const fileHash =
                ((archiveData[entry * 10 + 2] & 0xff) * 0x1000000 +
                    (archiveData[entry * 10 + 3] & 0xff) * 0x10000 +
                    (archiveData[entry * 10 + 4] & 0xff) * 256 +
                    (archiveData[entry * 10 + 5] & 0xff)) |
                0;

            const fileSize =
                ((archiveData[entry * 10 + 6] & 0xff) * 0x10000 +
                    (archiveData[entry * 10 + 7] & 0xff) * 256 +
                    (archiveData[entry * 10 + 8] & 0xff)) |
                0;

            const fileSizeCompressed =
                ((archiveData[entry * 10 + 9] & 0xff) * 0x10000 +
                    (archiveData[entry * 10 + 10] & 0xff) * 256 +
                    (archiveData[entry * 10 + 11] & 0xff)) |
                0;

            if (fileHash === wantedHash) {
                if (fileData === null) {
                    fileData = new Int8Array(fileSize + extraSize);
                }

                if (fileSize !== fileSizeCompressed) {
                    BZLib.decompress(
                        fileData,
                        fileSize,
                        archiveData,
                        fileSizeCompressed,
                        offset
                    );
                } else {
                    for (let j = 0; j < fileSize; j++) {
                        fileData[j] = archiveData[offset + j];
                    }
                }

                return fileData;
            }

            offset += fileSizeCompressed;
        }

        return null;
    }

    static formatConfirmAmount(amount) {
        let formatted = amount.toString();

        for (let i = formatted.length - 3; i > 0; i -= 3) {
            formatted =
                formatted.substring(0, i) + ',' + formatted.substring(i);
        }

        if (formatted.length > 8) {
            formatted =
                `@gre@${formatted.substring(0, formatted.length - 8)}` +
                ` million @whi@(${formatted})`;
        } else if (formatted.length > 4) {
            formatted =
                `@cya@${formatted.substring(0, formatted.length - 4)}` +
                `K @whi@(${formatted})`;
        }

        return formatted;
    }
}

Utility.bitmask = new Int32Array([
    0,
    1,
    3,
    7,
    15,
    31,
    63,
    127,
    255,
    511,
    1023,
    2047,
    4095,
    8191,
    16383,
    32767,
    65535,
    0x1ffff,
    0x3ffff,
    0x7ffff,
    0xfffff,
    0x1fffff,
    0x3fffff,
    0x7fffff,
    0xffffff,
    0x1ffffff,
    0x3ffffff,
    0x7ffffff,
    0xfffffff,
    0x1fffffff,
    0x3fffffff,
    0x7fffffff,
    -1
]);

module.exports = Utility;
