const serverOpcodes = require('../opcodes/server');

module.exports = {
    [serverOpcodes.APPEARANCE]: function () {
        this.showAppearanceChange = true;
    }
};
