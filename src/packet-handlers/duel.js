const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.DUEL_OPEN]: function (data) {
        const playerIndex = Utility.getUnsignedShort(data, 1);

        if (this.playerServer[playerIndex]) {
            this.duelOpponentName = this.playerServer[playerIndex].name;
        }

        this.showDialogDuel = true;
        this.duelOfferItemCount = 0;
        this.duelOfferOpponentItemCount = 0;
        this.duelOfferOpponentAccepted = false;
        this.duelOfferAccepted = false;
        this.duelSettingsRetreat = false;
        this.duelSettingsMagic = false;
        this.duelSettingsPrayer = false;
        this.duelSettingsWeapons = false;
    },
    [serverOpcodes.DUEL_CLOSE]: function () {
        this.showDialogDuel = false;
        this.showDialogDuelConfirm = false;
    },
    [serverOpcodes.DUEL_UPDATE]: function (data) {
        this.duelOfferOpponentItemCount = data[1] & 0xff;

        let offset = 2;

        for (let i = 0; i < this.duelOfferOpponentItemCount; i++) {
            this.duelOfferOpponentItemId[i] = Utility.getUnsignedShort(
                data,
                offset
            );

            offset += 2;

            this.duelOfferOpponentItemStack[i] = Utility.getUnsignedInt(
                data,
                offset
            );

            offset += 4;
        }

        this.duelOfferOpponentAccepted = false;
        this.duelOfferAccepted = false;
    },
    [serverOpcodes.DUEL_SETTINGS]: function (data) {
        this.duelSettingsRetreat = !!data[1];
        this.duelSettingsMagic = !!data[2];
        this.duelSettingsPrayer = !!data[3];
        this.duelSettingsWeapons = !!data[4];
        this.duelOfferOpponentAccepted = false;
        this.duelOfferAccepted = false;
    },
    [serverOpcodes.DUEL_OPPONENT_ACCEPTED]: function (data) {
        this.duelOfferOpponentAccepted = !!data[1];
    },
    [serverOpcodes.DUEL_ACCEPTED]: function (data) {
        this.duelOfferAccepted = !!data[1];
    },
    [serverOpcodes.DUEL_CONFIRM_OPEN]: function (data) {
        this.showDialogDuelConfirm = true;
        this.duelAccepted = false;
        this.showDialogDuel = false;

        let offset = 1;

        this.duelOpponentNameHash = Utility.getUnsignedLong(data, offset);
        offset += 8;

        this.duelOpponentItemsCount = data[offset++] & 0xff;

        for (let i = 0; i < this.duelOpponentItemsCount; i++) {
            this.duelOpponentItems[i] = Utility.getUnsignedShort(data, offset);
            offset += 2;

            this.duelOpponentItemCount[i] = Utility.getUnsignedInt(
                data,
                offset
            );

            offset += 4;
        }

        this.duelItemsCount = data[offset++] & 0xff;

        for (let i = 0; i < this.duelItemsCount; i++) {
            this.duelItems[i] = Utility.getUnsignedShort(data, offset);
            offset += 2;

            this.duelItemCount[i] = Utility.getUnsignedInt(data, offset);
            offset += 4;
        }

        this.duelOptionRetreat = data[offset++] & 0xff;
        this.duelOptionMagic = data[offset++] & 0xff;
        this.duelOptionPrayer = data[offset++] & 0xff;
        this.duelOptionWeapons = data[offset++] & 0xff;
    }
};
