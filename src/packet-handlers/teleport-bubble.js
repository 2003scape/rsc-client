const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.TELEPORT_BUBBLE]: function (data) {
        if (this.teleportBubbleCount < 50) {
            const type = data[1] & 0xff;
            const x = data[2] + this.localRegionX;
            const y = data[3] + this.localRegionY;

            this.teleportBubbleType[this.teleportBubbleCount] = type;
            this.teleportBubbleTime[this.teleportBubbleCount] = 0;
            this.teleportBubbleX[this.teleportBubbleCount] = x;
            this.teleportBubbleY[this.teleportBubbleCount] = y;

            this.teleportBubbleCount++;
        }
    }
};
