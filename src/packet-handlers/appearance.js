const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.APPEARANCE]: function () {
        this.showAppearanceChange = true;
    }
};
