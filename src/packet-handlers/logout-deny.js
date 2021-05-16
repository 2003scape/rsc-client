const serverOpcodes = require('../opcodes/server');

module.exports = {
    [serverOpcodes.LOGOUT_DENY]: function () {
        this.cantLogout();
    }
};
