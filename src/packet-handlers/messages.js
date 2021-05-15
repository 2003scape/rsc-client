const serverOpcodes = require('../opcodes/server');

function fromCharArray(a) {
    return Array.from(a)
        .map((c) => String.fromCharCode(c))
        .join('');
}

const handlers = {
    [serverOpcodes.MESSAGE]: function (data, size) {
        const message = fromCharArray(data.slice(1, size));
        this.showServerMessage(message);
    },
    [serverOpcodes.SERVER_MESSAGE]: function (data, size) {
        this.serverMessage = fromCharArray(data.slice(1, size));
        this.showDialogServerMessage = true;
        this.serverMessageBoxTop = false;
    },
    [serverOpcodes.SERVER_MESSAGE_ONTOP]: function (data, size) {
        this.serverMessage = fromCharArray(data.slice(1, size));
        this.showDialogServerMessage = true;
        this.serverMessageBoxTop = true;
    }
};

module.exports = handlers;
