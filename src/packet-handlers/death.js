const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.PLAYER_DIED]: function () {
        this.deathScreenTimeout = 250;
    }
};
