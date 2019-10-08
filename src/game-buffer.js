class GameBuffer {
    // buffer is an Int8Array
    constructor(buffer) {
        this.buffer = buffer;
        this.offset = 0;
    }

    putByte(i) {
        this.buffer[this.offset++] = i;
    }

    putInt(i) {
        this.buffer[this.offset++] = (i >> 24);
        this.buffer[this.offset++] = (i >> 16);
        this.buffer[this.offset++] = (i >> 8);
        this.buffer[this.offset++] = i;
    }

    putString(s) {
        for (let i = 0; i < s.length; i++) {
            this.buffer[this.offset++] = s.charCodeAt(i);
        }
        
        // null terminate
        this.buffer[this.offset++] = 10;
    }

    putBytes(src, srcPos, len) {
        for (let i = srcPos; i < len; i++) {
            this.buffer[this.offset++] = src[i];
        }
    }

    getUnsignedByte() {
        return this.buffer[this.offset++] & 0xff;
    }

    getUnsignedShort() {
        this.offset += 2;

        return ((this.buffer[this.offset - 2] & 0xff) << 8) + 
            (this.buffer[this.offset - 1] & 0xff);
    }

    getUnsignedInt() {
        this.offset +=4;

        return ((this.buffer[this.offset - 4] & 0xff) << 24) + 
            ((this.buffer[this.offset - 3] & 0xff) << 16) + 
            ((this.buffer[this.offset - 2] & 0xff) << 8) + 
            (this.buffer[this.offset - 1] & 0xff);
    }

    getBytes(dest, destPos, len) {
        for (let i = destPos; i < len; i++) {
            dest[destPos + i] = this.buffer[this.offset++];
        }
    }
}

module.exports = GameBuffer;