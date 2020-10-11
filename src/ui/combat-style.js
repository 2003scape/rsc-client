const clientOpcodes = require('../opcodes/client');

const BLACK = 0;
const GREY = 0xbebebe;
const RED = 0xff0000;
const WHITE = 0xffffff;

const BUTTON_HEIGHT = 20;
const UI_X = 7;
const UI_Y = 15;
const WIDTH = 175;

const COMBAT_STYLES = [
    'Controlled (+1 of each)',
    'Aggressive (+3 strength)',
    'Accurate (+3 attack)',
    'Defensive (+3 defense)'
];

function drawDialogCombatStyle() {
    if (this.mouseButtonClick !== 0) {
        for (let i = 0; i < COMBAT_STYLES.length + 1; i++) {
            if (
                i <= 0 ||
                this.mouseX <= UI_X ||
                this.mouseX >= UI_X + WIDTH ||
                this.mouseY <= UI_Y + i * BUTTON_HEIGHT ||
                this.mouseY >= UI_Y + i * BUTTON_HEIGHT + BUTTON_HEIGHT
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
        const boxColour = i === this.combatStyle + 1 ? RED : GREY;

        this.surface.drawBoxAlpha(
            UI_X,
            UI_Y + i * BUTTON_HEIGHT,
            WIDTH,
            BUTTON_HEIGHT,
            boxColour,
            128
        );
        this.surface.drawLineHoriz(
            UI_X,
            UI_Y + i * BUTTON_HEIGHT,
            WIDTH,
            BLACK
        );
        this.surface.drawLineHoriz(
            UI_X,
            UI_Y + i * BUTTON_HEIGHT + BUTTON_HEIGHT,
            WIDTH,
            BLACK
        );
    }

    let y = 16;

    this.surface.drawStringCenter(
        'Select combat style',
        UI_X + ((WIDTH / 2) | 0),
        UI_Y + y,
        3,
        WHITE
    );

    y += BUTTON_HEIGHT;

    for (const combatStyle of COMBAT_STYLES) {
        this.surface.drawStringCenter(
            combatStyle,
            UI_X + ((WIDTH / 2) | 0),
            UI_Y + y,
            3,
            BLACK
        );

        y += BUTTON_HEIGHT;
    }
}

module.exports = {
    combatStyle: 0,
    drawDialogCombatStyle
};
