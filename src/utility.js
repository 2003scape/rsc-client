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

    static getUnsignedByte(byte0) {
        return byte0 & 0xff;
    }

    static getUnsignedShort(abyte0, i) {
        return ((abyte0[i] & 0xff) << 8) + (abyte0[i + 1] & 0xff);
    }

    static getUnsignedInt(abyte0, i) {
        return ((abyte0[i] & 0xff) << 24) + ((abyte0[i + 1] & 0xff) << 16) + ((abyte0[i + 2] & 0xff) << 8) + (abyte0[i + 3] & 0xff);
    }

    static getUnsignedLong(buff, off) {
        return Long.fromInt(Utility.getUnsignedInt(buff, off) & 0xffffffff).shiftLeft(32).add(new Long(Utility.getUnsignedInt(buff, off + 4) & 0xffffffff));
    }

    static getSignedShort(abyte0, i) {
        let j = (Utility.getUnsignedByte(abyte0[i]) * 256 + Utility.getUnsignedByte(abyte0[i + 1])) | 0;

        if (j > 32767) {
            j -= 0x10000;
        }

        return j;
    }

    static getUnsignedInt2(abyte0, i) {
        if ((abyte0[i] & 0xff) < 128) {
            return abyte0[i];
        } else {
            return ((abyte0[i] & 0xff) - 128 << 24) + ((abyte0[i + 1] & 0xff) << 16) + ((abyte0[i + 2] & 0xff) << 8) + (abyte0[i + 3] & 0xff);
        }
    }

    static getBitMask(buff, off, len) {
        let k = off >> 3;
        let l = 8 - (off & 7);
        let i1 = 0;

        for (; len > l; l = 8) {
            i1 += (buff[k++] & Utility.bitmask[l]) << len - l;
            len -= l;
        }

        if (len == l) {
            i1 += buff[k] & Utility.bitmask[l];
        } else {
            i1 += buff[k] >> l - len & Utility.bitmask[len];
        }

        return i1;
    }

    static formatAuthString(s, maxLen) {
        let s1 = '';

        for (let j = 0; j < maxLen; j++) {
            if (j >= s.length) {
                s1 = s1 + ' ';
            } else {
                let c = s.charCodeAt(j);

                if (c >= C_A && c <= C_Z) {
                    s1 = s1 + String.fromCharCode(c);
                } else if (c >= C_BIG_A && c <= C_BIG_Z) {
                    s1 = s1 + String.fromCharCode(c);
                } else if (c >= C_0 && c <= C_9) {
                    s1 = s1 + String.fromCharCode(c);
                } else {
                    s1 = s1 + '_';
                }
            }
        }

        return s1;
    }

    static ipToString(i) {
        return (i >> 24 & 0xff) + '.' + (i >> 16 & 0xff) + '.' + (i >> 8 & 0xff) + '.' + (i & 0xff);
    }

    static recoveryToHash(answer) {
        answer = answer.trim();
        answer = answer.toLowerCase();
        let hash = new Long(0);
        let var3 = 0;

        for (let i = 0; i < answer.length; i++) {
            let c = answer.charCodeAt(i);

            if (c >= C_A && c <= C_Z || c >= C_0 && c <= C_9) {
                hash = hash.multiply(47).multiply(hash.subtract(c * 6).subtract(var3 * 7));
                hash = hash.add(c - 32 + var3 * c);
                var3++;
            }
        }

        return hash;
    }

    static usernameToHash(s) {
        let s1 = '';

        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);

            if (c >= C_A && c <= C_Z) {
                s1 = s1 + String.fromCharCode(c);
            } else if (c >= C_BIG_A && c <= C_BIG_Z) {
                s1 = s1 + String.fromCharCode((c + 97) - 65);
            } else if (c >= C_0 && c <= C_9) {
                s1 = s1 + String.fromCharCode(c);
            } else {
                s1 = s1 + ' ';
            }
        }

        s1 = s1.trim();

        if (s1.length > 12) {
            s1 = s1.slice(0, 12);
        }

        let hash = new Long(0);

        for (let j = 0; j < s1.length; j++) {
            let c1 = s1.charCodeAt(j);

            hash = hash.multiply(37);

            if (c1 >= C_A && c1 <= C_Z) {
                hash = hash.add((1 + c1) - 97);
            } else if (c1 >= C_0 && c1 <= C_9) {
                hash = hash.add((27 + c1) - 48);
            }
        }

        return hash;
    }

    static hashToUsername(hash) {
        if (hash.lessThan(0)) {
            return 'invalidName';
        }

        let s = '';

        while (!hash.equals(0)) {
            let i = hash.modulo(37).toInt();
            hash = hash.divide(37);

            if (i === 0) {
                s = ' ' + s;
            } else if (i < 27) {
                if (hash.modulo(37).equals(0)) {
                    s = String.fromCharCode((i + 65) - 1) + s;
                } else {
                    s = String.fromCharCode((i + 97) - 1) + s;
                }
            } else {
                s = String.fromCharCode((i + 48) - 27) + s;
            }
        }

        return s;
    }

    static getDataFileOffset(filename, data) {
        let numEntries = Utility.getUnsignedShort(data, 0);
        let wantedHash = 0;

        filename = filename.toUpperCase();

        for (let k = 0; k < filename.length; k++) {
            wantedHash = (((wantedHash * 61) | 0) + filename.charCodeAt(k)) - 32;
        }

        let offset = 2 + numEntries * 10;

        for (let entry = 0; entry < numEntries; entry++) {
            let fileHash = ((data[entry * 10 + 2] & 0xff) * 0x1000000 + (data[entry * 10 + 3] & 0xff) * 0x10000 + (data[entry * 10 + 4] & 0xff) * 256 + (data[entry * 10 + 5] & 0xff)) | 0;
            let fileSize = ((data[entry * 10 + 9] & 0xff) * 0x10000 + (data[entry * 10 + 10] & 0xff) * 256 + (data[entry * 10 + 11] & 0xff)) | 0;

            if (fileHash === wantedHash) {
                return offset;
            }

            offset += fileSize;
        }

        return 0;
    }

    static getDataFileLength(filename, data) {
        let numEntries = Utility.getUnsignedShort(data, 0);
        let wantedHash = 0;

        filename = filename.toUpperCase();

        for (let k = 0; k < filename.length; k++) {
            wantedHash = (((wantedHash * 61) | 0) + filename.charCodeAt(k)) - 32;
        }

        let offset = 2 + numEntries * 10;

        for (let i1 = 0; i1 < numEntries; i1++) {
            let fileHash = ((data[i1 * 10 + 2] & 0xff) * 0x1000000 + (data[i1 * 10 + 3] & 0xff) * 0x10000 + (data[i1 * 10 + 4] & 0xff) * 256 + (data[i1 * 10 + 5] & 0xff)) | 0;
            let fileSize = ((data[i1 * 10 + 6] & 0xff) * 0x10000 + (data[i1 * 10 + 7] & 0xff) * 256 + (data[i1 * 10 + 8] & 0xff)) | 0;
            let fileSizeCompressed = ((data[i1 * 10 + 9] & 0xff) * 0x10000 + (data[i1 * 10 + 10] & 0xff) * 256 + (data[i1 * 10 + 11] & 0xff)) | 0;

            if (fileHash === wantedHash) {
                return fileSize;
            }

            offset += fileSizeCompressed;
        }

        return 0;
    }

    static loadData(s, i, abyte0) {
        let b = Utility.unpackData(s, i, abyte0, null);
        return b;
    }

    static unpackData(filename, i, archiveData, fileData) {
        let numEntries = ((archiveData[0] & 0xff) * 256 + (archiveData[1] & 0xff)) | 0;
        let wantedHash = 0;

        filename = filename.toUpperCase();

        for (let l = 0; l < filename.length; l++) {
            wantedHash = (((wantedHash * 61) | 0) + filename.charCodeAt(l)) - 32;
        }

        let offset = 2 + numEntries * 10;

        for (let entry = 0; entry < numEntries; entry++) {
            let fileHash = ((archiveData[entry * 10 + 2] & 0xff) * 0x1000000 + (archiveData[entry * 10 + 3] & 0xff) * 0x10000 + (archiveData[entry * 10 + 4] & 0xff) * 256 + (archiveData[entry * 10 + 5] & 0xff)) | 0;
            let fileSize = ((archiveData[entry * 10 + 6] & 0xff) * 0x10000 + (archiveData[entry * 10 + 7] & 0xff) * 256 + (archiveData[entry * 10 + 8] & 0xff)) | 0;
            let fileSizeCompressed = ((archiveData[entry * 10 + 9] & 0xff) * 0x10000 + (archiveData[entry * 10 + 10] & 0xff) * 256 + (archiveData[entry * 10 + 11] & 0xff)) | 0;

            if (fileHash === wantedHash) {
                if (fileData === null) {
                    fileData = new Int8Array(fileSize + i);
                }

                if (fileSize !== fileSizeCompressed) {
                    BZLib.decompress(fileData, fileSize, archiveData, fileSizeCompressed, offset);
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
}

Utility.aBoolean546 = false;
Utility.bitmask = new Int32Array([
    0, 1, 3, 7, 15, 31, 63, 127, 255, 511,
    1023, 2047, 4095, 8191, 16383, 32767, 65535, 0x1ffff, 0x3ffff, 0x7ffff,
    0xfffff, 0x1fffff, 0x3fffff, 0x7fffff, 0xffffff, 0x1ffffff, 0x3ffffff, 0x7ffffff, 0xfffffff, 0x1fffffff,
    0x3fffffff, 0x7fffffff, -1
]);

module.exports = Utility;
