const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server.json');

function fromCharArray(a) {
    return Array.from(a)
        .map((c) => String.fromCharCode(c))
        .join('');
}

module.exports = {
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
    },
    [serverOpcodes.WELCOME]: function (data) {
        if (this.welcomScreenAlreadyShown) {
            return;
        }

        this.welcomeLastLoggedInIP = Utility.getUnsignedInt(data, 1);
        this.welcomeLastLoggedInDays = Utility.getUnsignedShort(data, 5);
        this.welcomeRecoverySetDays = data[7] & 0xff;
        this.welcomeUnreadMessages = Utility.getUnsignedShort(data, 8);
        this.showDialogWelcome = true;
        this.welcomScreenAlreadyShown = true;
        this.welcomeLastLoggedInHost = null;
    },
    [serverOpcodes.SYSTEM_UPDATE]: function (data) {
        this.systemUpdate = Utility.getUnsignedShort(data, 1) * 32;
    }
};
