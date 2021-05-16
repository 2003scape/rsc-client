const serverOpcodes = require('../opcodes/server');

module.exports = {
    [serverOpcodes.CLOSE_CONNECTION]: function () {
        this.closeConnection();
    }
};
