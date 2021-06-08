const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.BANK_OPEN]: function (data) {
        this.showDialogBank = true;

        let offset = 1;

        this.newBankItemCount = data[offset++] & 0xff;
        this.bankItemsMax = data[offset++] & 0xff;

        for (let i = 0; i < this.newBankItemCount; i++) {
            this.newBankItems[i] = Utility.getUnsignedShort(data, offset);
            offset += 2;

            this.newBankItemsCount[i] = Utility.getStackInt(data, offset);

            if (this.newBankItemsCount[i] >= 128) {
                offset += 4;
            } else {
                offset++;
            }
        }

        this.updateBankItems();
    },
    [serverOpcodes.BANK_CLOSE]: function () {
        this.showDialogBank = false;
    },
    [serverOpcodes.BANK_UPDATE]: function (data) {
        let offset = 1;

        const itemIndex = data[offset++] & 0xff;

        const item = Utility.getUnsignedShort(data, offset);
        offset += 2;

        const itemCount = Utility.getStackInt(data, offset);

        if (itemCount >= 128) {
            offset += 4;
        } else {
            offset++;
        }

        if (itemCount === 0) {
            this.newBankItemCount--;

            for (let i = itemIndex; i < this.newBankItemCount; i++) {
                this.newBankItems[i] = this.newBankItems[i + 1];
                this.newBankItemsCount[i] = this.newBankItemsCount[i + 1];
            }
        } else {
            this.newBankItems[itemIndex] = item;
            this.newBankItemsCount[itemIndex] = itemCount;

            if (itemIndex >= this.newBankItemCount) {
                this.newBankItemCount = itemIndex + 1;
            }
        }

        this.updateBankItems();
    }
};
