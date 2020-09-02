const clientOpcodes = require('../opcodes/client');

const CYAN = 0x00ffff;
const RED = 0xff0000;

function drawOptionMenu() {
    if (this.mouseButtonClick !== 0) {
        for (let i = 0; i < this.optionMenuCount; i++) {
            if (
                this.mouseX >=
                    this.surface.textWidth(this.optionMenuEntry[i], 1) ||
                this.mouseY <= i * 12 ||
                this.mouseY >= 12 + i * 12
            ) {
                continue;
            }

            this.packetStream.newPacket(clientOpcodes.CHOOSE_OPTION);
            this.packetStream.putByte(i);
            this.packetStream.sendPacket();
            break;
        }

        this.mouseButtonClick = 0;
        this.showOptionMenu = false;
        return;
    }

    for (let i = 0; i < this.optionMenuCount; i++) {
        let textColour = CYAN;

        if (
            this.mouseX < this.surface.textWidth(this.optionMenuEntry[i], 1) &&
            this.mouseY > i * 12 &&
            this.mouseY < 12 + i * 12
        ) {
            textColour = RED;
        }

        this.surface.drawString(
            this.optionMenuEntry[i],
            6,
            12 + i * 12,
            1,
            textColour
        );
    }
}

module.exports = { drawOptionMenu };
