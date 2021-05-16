const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server');

module.exports = {
    [serverOpcodes.WORLD_INFO]: function (data) {
        this.loadingArea = true;
        this.localPlayerServerIndex = Utility.getUnsignedShort(data, 1);
        this.planeWidth = Utility.getUnsignedShort(data, 3);
        this.planeHeight = Utility.getUnsignedShort(data, 5);
        this.planeIndex = Utility.getUnsignedShort(data, 7);
        this.planeMultiplier = Utility.getUnsignedShort(data, 9);
        this.planeHeight -= this.planeIndex * this.planeMultiplier;
    }
};
