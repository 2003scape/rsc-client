const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.LOGOUT_DENY]: function () {
        this.cantLogout();
    }
};
