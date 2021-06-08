const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.SLEEP_OPEN]: function (data) {
        if (!this.isSleeping) {
            this.fatigueSleeping = this.statFatigue;
        }

        this.isSleeping = true;
        this.inputTextCurrent = '';
        this.inputTextFinal = '';
        this.surface.readSleepWord(this.spriteTexture + 1, data);
        this.sleepingStatusText = null;
    },
    [serverOpcodes.SLEEP_CLOSE]: function () {
        this.isSleeping = false;
    },
    [serverOpcodes.SLEEP_INCORRECT]: function () {
        this.sleepingStatusText = 'Incorrect - Please wait...';
    },
    [serverOpcodes.PLAYER_STAT_FATIGUE_ASLEEP]: function (data) {
        this.fatigueSleeping = Utility.getUnsignedShort(data, 1);
    }
};
