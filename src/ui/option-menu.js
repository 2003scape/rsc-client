const clientOpcodes = require('../opcodes/client.json');
const colours = require('./_colours');

function drawOptionMenu() {
    const fontSize = this.options.mobile ? 5 : 5;
    const fontHeight = this.options.mobile ? 14 : 18;
    const maxHeight = fontHeight * 5;

    const uiX = this.options.mobile ? 48 : 6;
    const uiY = this.options.mobile
        ? (this.gameHeight / 2 - maxHeight / 2) | 0
        : 0;

    if (this.mouseButtonClick !== 0) {
        for (let i = 0; i < this.optionMenuCount; i++) {
            if (
                this.mouseX < uiX - 6 ||
                this.mouseX >=
                    uiX -
                        6 +
                        this.surface.textWidth(
                            this.optionMenuEntry[i],
                            fontSize
                        ) ||
                this.mouseY <= uiY + i * fontHeight ||
                this.mouseY >= uiY + (fontHeight + i * fontHeight)
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
        let textColour = colours.cyan;

        if (
            !this.options.mobile &&
            this.mouseX > uiX - 6 &&
            this.mouseX <
                uiX -
                    6 +
                    this.surface.textWidth(this.optionMenuEntry[i], fontSize) &&
            this.mouseY > uiY + i * fontHeight &&
            this.mouseY < uiY + (i * fontHeight + fontHeight)
        ) {
            textColour = colours.red;
        }

        this.surface.drawString(
            this.optionMenuEntry[i],
            uiX,
            uiY + (fontHeight + i * fontHeight),
            fontSize,
            textColour
        );
    }
}

module.exports = { drawOptionMenu };
