const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server');

module.exports = {
    [serverOpcodes.TRADE_OPEN]: function (data) {
        const playerIndex = Utility.getUnsignedShort(data, 1);

        if (this.playerServer[playerIndex] !== null) {
            this.tradeRecipientName = this.playerServer[playerIndex].name;
        }

        this.showDialogTrade = true;
        this.tradeRecipientAccepted = false;
        this.tradeAccepted = false;
        this.tradeItemsCount = 0;
        this.tradeRecipientItemsCount = 0;
    },
    [serverOpcodes.TRADE_CLOSE]: function () {
        this.showDialogTrade = false;
        this.showDialogTradeConfirm = false;
    },
    [serverOpcodes.TRADE_ITEMS]: function (data) {
        this.tradeRecipientItemsCount = data[1] & 0xff;

        let offset = 2;

        for (let i = 0; i < this.tradeRecipientItemsCount; i++) {
            this.tradeRecipientItems[i] = Utility.getUnsignedShort(
                data,
                offset
            );

            offset += 2;

            this.tradeRecipientItemCount[i] = Utility.getUnsignedInt(
                data,
                offset
            );

            offset += 4;
        }

        this.tradeRecipientAccepted = false;
        this.tradeAccepted = false;
    },
    [serverOpcodes.TRADE_RECIPIENT_STATUS]: function (data) {
        this.tradeRecipientAccepted = !!data[1];
    },
    [serverOpcodes.TRADE_STATUS]: function (data) {
        this.tradeAccepted = !!data[1];
    },
    [serverOpcodes.TRADE_CONFIRM_OPEN]: function (data) {
        this.showDialogTradeConfirm = true;
        this.tradeConfirmAccepted = false;
        this.showDialogTrade = false;

        let offset = 1;

        this.tradeRecipientConfirmHash = Utility.getUnsignedLong(data, offset);
        offset += 8;

        this.tradeRecipientConfirmItemsCount = data[offset++] & 0xff;

        for (let i = 0; i < this.tradeRecipientConfirmItemsCount; i++) {
            this.tradeRecipientConfirmItems[i] = Utility.getUnsignedShort(
                data,
                offset
            );

            offset += 2;

            this.tradeRecipientConfirmItemCount[i] = Utility.getUnsignedInt(
                data,
                offset
            );

            offset += 4;
        }

        this.tradeConfirmItemsCount = data[offset++] & 0xff;

        for (let i = 0; i < this.tradeConfirmItemsCount; i++) {
            this.tradeConfirmItems[i] = Utility.getUnsignedShort(data, offset);
            offset += 2;

            this.tradeConfirmItemCount[i] = Utility.getUnsignedInt(
                data,
                offset
            );
            offset += 4;
        }
    }
};
