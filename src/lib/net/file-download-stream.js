// a quick shim for downloading files

const sleep = require('sleep-promise');

class FileDownloadStream {
    constructor(file) {
        this.url = file;

        this.xhr = new XMLHttpRequest();
        this.xhr.responseType = 'arraybuffer';
        this.xhr.open('GET', file, true);

        this.buffer = null;
        this.pos = 0;
    }

    async _loadResBytes() {
        return new Promise((resolve, reject) => {
            this.xhr.onerror = e => reject(e);

            this.xhr.onload = () => {
                if (!/^2/.test(this.xhr.status)) {
                    reject(new Error(`unable to download ${this.url}. status code = ${this.xhr.status}`));
                } else {
                    resolve(new Int8Array(this.xhr.response));
                }
            };

            this.xhr.send();
        });
    }

    async readFully(dest, off = 0, len) {
        if (typeof len === 'undefined') {
            len = dest.length;
        }

        if (!this.buffer) {
            this.buffer = await this._loadResBytes();
        } else {
            //await sleep(5);
        }

        dest.set(this.buffer.slice(this.pos, this.pos + len), off);
        this.pos += len;
    }
}

module.exports = FileDownloadStream;
