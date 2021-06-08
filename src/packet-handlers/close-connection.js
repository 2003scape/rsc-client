const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.CLOSE_CONNECTION]: function () {
        this.closeConnection();
    }
};
