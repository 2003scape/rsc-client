const Buffer = require('buffer/').Buffer;
const { Bzip2 } = require('@ledgerhq/compressjs');

// BZ is a magic symbol, h is for huffman and 1 is the level of compression (
// from 1-9)
const BZIP_HEADER = Buffer.from('BZh1'.split('').map((c) => c.charCodeAt(0)));

function decompress(
    fileData,
    _,
    archiveData,
    fileSizeCompressed,
    offset
) {
    const compressed = Buffer.from(
        archiveData.slice(offset, fileSizeCompressed + offset)
    );

    const decompressed = Bzip2.decompressFile(
        Buffer.concat([BZIP_HEADER, compressed])
    );

    fileData.set(decompressed);
}

module.exports.decompress = decompress;
