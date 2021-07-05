const { uid } = require('rand-token');

class WorkerSocket {
    constructor(worker) {
        this.worker = worker;
        this.id = uid(64);

        this.worker.onmessage = (e) => {
            if (e.data.id !== this.id) {
                return;
            }

            if (e.data.type === 'data') {
                this.dispatchEvent('message', e.data);
            } else if (e.data.type === 'disconnect') {
                this.dispatchEvent('close');
            }
        };

        this.handlers = {};

        setTimeout(() => {
            this.worker.postMessage({ id: this.id, type: 'connect' });
            this.dispatchEvent('open');
        }, 1);
    }

    send(data) {
        this.worker.postMessage({
            id: this.id,
            type: 'data',
            data
        });
    }

    dispatchEvent(name, args) {
        const cb = this.handlers[name];

        if (cb) {
            cb(args);
        }
    }

    addEventListener(name, cb) {
        this.handlers[name] = cb;
    }

    close() {
        postMessage({
            id: this.id,
            type: 'disconnect'
        });

        this.dispatchEvent('close');
    }
}

module.exports = WorkerSocket;
