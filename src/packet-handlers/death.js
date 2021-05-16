const serverOpcodes = require('../opcodes/server');

module.exports = {
    [serverOpcodes.PLAYER_DIED]: function () {
        this.deathScreenTimeout = 250;
    }
};
