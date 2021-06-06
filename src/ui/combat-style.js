const clientOpcodes = require('../opcodes/client');
const colours = require('./_colours');

const GREY = 0xbebebe;

const BUTTON_HEIGHT = 20;
const WIDTH = 175;

const COMBAT_STYLES = [
    'Controlled (+1 of each)',
    'Aggressive (+3 strength)',
    'Accurate (+3 attack)',
    'Defensive (+3 defense)'
];

const HEIGHT = BUTTON_HEIGHT * (COMBAT_STYLES.length + 1);

function drawDialogCombatStyle() {
    let uiX = 7;
    let uiY = 15;

    if (this.options.mobile) {
        uiX = 48;
        uiY = (this.gameHeight / 2 - HEIGHT / 2) | 0;
    }

    if (this.mouseButtonClick !== 0) {
        for (let i = 0; i < COMBAT_STYLES.length + 1; i++) {
            if (
                i <= 0 ||
                this.mouseX <= uiX ||
                this.mouseX >= uiX + WIDTH ||
                this.mouseY <= uiY + i * BUTTON_HEIGHT ||
                this.mouseY >= uiY + i * BUTTON_HEIGHT + BUTTON_HEIGHT
            ) {
                continue;
            }

            this.combatStyle = i - 1;
            this.mouseButtonClick = 0;

            this.packetStream.newPacket(clientOpcodes.COMBAT_STYLE);
            this.packetStream.putByte(this.combatStyle);
            this.packetStream.sendPacket();
            break;
        }
    }

    for (let i = 0; i < COMBAT_STYLES.length + 1; i++) {
        const boxColour = i === this.combatStyle + 1 ? colours.red : GREY;

        this.surface.drawBoxAlpha(
            uiX,
            uiY + i * BUTTON_HEIGHT,
            WIDTH,
            BUTTON_HEIGHT,
            boxColour,
            128
        );

        this.surface.drawLineHoriz(
            uiX,
            uiY + i * BUTTON_HEIGHT,
            WIDTH,
            colours.black
        );

        this.surface.drawLineHoriz(
            uiX,
            uiY + i * BUTTON_HEIGHT + BUTTON_HEIGHT,
            WIDTH,
            colours.black
        );
    }

    let y = 16;

    this.surface.drawStringCenter(
        'Select combat style',
        uiX + ((WIDTH / 2) | 0),
        uiY + y,
        3,
        colours.white
    );

    y += BUTTON_HEIGHT;

    for (const combatStyle of COMBAT_STYLES) {
        this.surface.drawStringCenter(
            combatStyle,
            uiX + ((WIDTH / 2) | 0),
            uiY + y,
            3,
            colours.black
        );

        y += BUTTON_HEIGHT;
    }
}

module.exports = {
    combatStyle: 0,
    drawDialogCombatStyle
};
