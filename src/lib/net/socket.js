// a shim for java.net.Socket
// https://docs.oracle.com/javase/7/docs/api/java/net/Socket.html

const CLOSE_TIMEOUT = 5000;

class Socket {
    constructor(host, port) {
        this.host = host;
        this.port = port;

        this.client = null;
        this.connected = false;

        // amount of bytes are left to read since last read call (in total)
        this.bytesAvailable = 0;

        // the message buffers that arrive from the websocket
        this.buffers = [];

        // the current buffer we're reading
        this.currentBuffer = null;

        // amount of bytes we read in current buffer
        this.offset = 0;

        // amount of bytes left in current buffer
        this.bytesLeft = 0;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.client = new WebSocket(
                `ws://${this.host}:${this.port}`,
                'binary'
            );

            const closeTimeout = setTimeout(() => {
                if (!this.connected) {
                    this.client.close();
                    reject(new Error('websocket connect timeout'));
                }
            }, CLOSE_TIMEOUT);

            this.client.binaryType = 'arraybuffer';

            const onError = (err) => {
                if (this.onError) {
                    this.onError(err);
                    this.onError = undefined;
                }

                reject(err);
            };

            this.client.addEventListener('error', onError);

            this.client.addEventListener('close', () => {
                if (this.onClose) {
                    this.onClose(-1);
                    this.onClose = undefined;
                }

                this.connected = false;
                this.clear();
            });

            this.client.addEventListener('message', (msg) => {
                this.buffers.push(new Int8Array(msg.data));
                this.bytesAvailable += msg.data.byteLength;
                this.refreshCurrentBuffer();

                if (this.onNextMessage) {
                    this.onNextMessage(msg.data.byteLength);
                    this.onNextMessage = undefined;
                }
            });

            this.client.addEventListener('open', () => {
                this.connected = true;
                clearTimeout(closeTimeout);
                resolve();
            });
        });
    }

    write(bytes, off = 0, len = -1) {
        if (!this.connected) {
            throw new Error('attempting to write to closed socket');
        }

        len = len === -1 ? bytes.length : len;
        this.client.send(bytes.slice(off, off + len));
    }

    refreshCurrentBuffer() {
        if (this.bytesLeft === 0 && this.bytesAvailable > 0) {
            this.currentBuffer = this.buffers.shift();
            this.offset = 0;

            if (this.currentBuffer && this.currentBuffer.length) {
                this.bytesLeft = this.currentBuffer.length;
            } else {
                this.bytesLeft = 0;
            }
        }
    }

    // read the first byte available in the buffer, or wait for one to be sent
    // if none are available.
    async read() {
        if (!this.connected) {
            return -1;
        }

        if (this.bytesLeft > 0) {
            this.bytesLeft--;
            this.bytesAvailable--;

            return this.currentBuffer[this.offset++] & 0xff;
        }

        const bytesRead = await new Promise((resolve, reject) => {
            this.onClose = resolve;
            this.onError = reject;
            this.onNextMessage = resolve;
        });

        if (bytesRead === -1) {
            return -1;
        }

        return await this.read();
    }

    // read multiple bytes (specified by `length`) and put them into the
    // `destination` array at specified `offset` (0 by default).
    async readBytes(destination, offset = 0, length = -1) {
        if (!this.connected) {
            return -1;
        }

        length = length === -1 ? destination.length : length;

        if (this.bytesAvailable >= length) {
            while (length > 0) {
                destination[offset++] =
                    this.currentBuffer[this.offset++] & 0xff;

                this.bytesLeft -= 1;
                this.bytesAvailable -= 1;
                length -= 1;

                if (this.bytesLeft === 0) {
                    this.refreshCurrentBuffer();
                }
            }

            return;
        }

        const bytesRead = await new Promise((resolve, reject) => {
            this.onClose = resolve;
            this.onError = reject;
            this.onNextMessage = resolve;
        });

        if (bytesRead === -1) {
            return -1;
        }

        return await this.readBytes(destination, offset, length);
    }

    close() {
        if (!this.connected) {
            return;
        }

        this.client.close();
    }

    available() {
        return this.bytesAvailable;
    }

    clear() {
        if (this.connected) {
            this.client.close();
        }

        this.currentBuffer = null;
        this.buffers.length = 0;
        this.bytesLeft = 0;
    }
}

module.exports = Socket;
