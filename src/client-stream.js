const Packet = require('./packet');

class ClientStream extends Packet {
    constructor(socket) {
        super();
        this.closing = false;
        this.closed = false;
        this.socket = socket;
    }

    closeStream() {
        this.closing = true;
        this.socket.close();
        this.closed = true;
    }

    async readStream() {
        if (this.closing) {
            return 0;
        }

        return await this.socket.read();
    } 

    availableStream() {
        if (this.closing) {
            return 0;
        }

        return this.socket.available();
    }

    async readStreamBytes(len, off, buff) {
        if (this.closing) {
            return;
        }

        await this.socket.readBytes(buff, off, len);
    }

    writeStreamBytes(buff, off, len) {
        if (this.closing) {
            return;
        }

        this.socket.write(buff, off, len);
    }
}

module.exports = ClientStream;