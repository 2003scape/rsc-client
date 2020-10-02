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
            this.client.binaryType = 'arraybuffer';

            const onError = (err) => {
                this.client.removeEventListener('error', onError);
                reject(err);
            };

            this.client.addEventListener('error', onError);

            this.client.addEventListener('close', () => {
                this.connected = false;
                this.clear();
            });

            this.client.addEventListener('message', (msg) => {
                this.buffers.push(new Int8Array(msg.data));
                this.bytesAvailable += msg.data.byteLength;
                this.refreshCurrentBuffer();
            });

            this.client.addEventListener('open', () => {
                this.connected = true;
                this.client.removeEventListener('error', onError);
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

        return new Promise((resolve, reject) => {
            let onClose, onError, onNextMessage;

            onClose = () => {
                this.client.removeEventListener('error', onError);
                this.client.removeEventListener('close', onClose);
                this.client.removeEventListener('message', onNextMessage);
                resolve(-1);
            };

            onError = (err) => {
                this.client.removeEventListener('error', onError);
                this.client.removeEventListener('close', onClose);
                this.client.removeEventListener('message', onNextMessage);
                reject(err);
            };

            onNextMessage = () => {
                this.client.removeEventListener('error', onError);
                this.client.removeEventListener('close', onClose);
                this.client.removeEventListener('message', onNextMessage);
                Promise.resolve().then(async () => {
                    resolve(await this.read());
                });
            };

            this.client.addEventListener('error', onError);
            this.client.addEventListener('close', onClose);
            this.client.addEventListener('message', onNextMessage);
        });
    }

    // read multiple bytes (specified by `len`) and put them into the `dest`
    // array at specified `off` (0 by default).
    async readBytes(dest, off = 0, len = -1) {
        if (!this.connected) {
            return -1;
        }

        len = len === -1 ? dest.length : len;

        if (this.bytesAvailable >= len) {
            while (len > 0) {
                dest[off++] = this.currentBuffer[this.offset++] & 0xff;
                this.bytesLeft -= 1;
                this.bytesAvailable -= 1;
                len -= 1;

                if (this.bytesLeft === 0) {
                    this.refreshCurrentBuffer();
                }
            }

            return;
        }

        return new Promise((resolve, reject) => {
            let onClose, onError, onNextMessage;

            onClose = () => {
                this.client.removeEventListener('error', onError);
                this.client.removeEventListener('close', onClose);
                this.client.removeEventListener('message', onNextMessage);
                resolve(-1);
            };

            onError = (err) => {
                this.client.removeEventListener('error', onError);
                this.client.removeEventListener('close', onClose);
                this.client.removeEventListener('message', onNextMessage);
                reject(err);
            };

            onNextMessage = () => {
                this.client.removeEventListener('error', onError);
                this.client.removeEventListener('close', onClose);
                this.client.removeEventListener('message', onNextMessage);
                Promise.resolve().then(async () => {
                    resolve(await this.readBytes(dest, off, len));
                });
            };

            this.client.addEventListener('error', onError);
            this.client.addEventListener('close', onClose);
            this.client.addEventListener('message', onNextMessage);
        });
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

