const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server');

function fromCharArray(a) {
    return Array.from(a).map(c => String.fromCharCode(c)).join('');
}

module.exports = {
    [serverOpcodes.OPTION_LIST]: function (data) {
        this.showOptionMenu = true;

        const count = Utility.getUnsignedByte(data[1]);
        this.optionMenuCount = count;

        let offset = 2;

        for (let i = 0; i < count; i++) {
            const entryLength = Utility.getUnsignedByte(data[offset++]);

            this.optionMenuEntry[i] = fromCharArray(
                data.slice(offset, offset + entryLength)
            );

            offset += entryLength;
        }
    },
    [serverOpcodes.OPTION_LIST_CLOSE]: function () {
        this.showOptionMenu = false;
    }
};
