const GameData = require('../game-data');
const Panel = require('../panel');
const clientOpcodes = require('../opcodes/client');

// size of the -> sprite
const ARROW_SIZE = 20;

// box around the type text
const BOX_WIDTH = 53;
const BOX_HEIGHT = 41;

// the width of each option column including the arrows
const COLUMN_WIDTH = 54;

// size of the accept button
const ACCEPT_WIDTH = 200;
const ACCEPT_HEIGHT = 30;

// draw a box with two arrows
function drawOptionBox(panel, type, x, y) {
    panel.addBoxRounded(x, y, BOX_WIDTH, BOX_HEIGHT);

    const typeSplit = type.split('\n');

    if (typeSplit.length === 1) {
        panel.addTextCentre(x, y, type, 1, true);
    } else {
        panel.addTextCentre(x, y - 8, typeSplit[0], 1, true);
        panel.addTextCentre(x, y + 8, typeSplit[1], 1, true);
    }

    const leftButton = panel.addButton(x - 40, y, ARROW_SIZE, ARROW_SIZE);
    panel.addSprite(x - 40, y, Panel.baseSpriteStart + 7);

    const rightButton = panel.addButton(x + 40, y, ARROW_SIZE, ARROW_SIZE);
    panel.addSprite(x + 40, y, Panel.baseSpriteStart + 6);

    return { leftButton, rightButton };
}

function createAppearancePanel() {
    this.panelAppearance = new Panel(this.surface, 100);

    const x = 256;

    this.panelAppearance.addTextCentre(
        x,
        10,
        'Please design Your Character',
        4,
        true
    );

    let y = 24;

    this.panelAppearance.addTextCentre(x - 55, y + 110, 'Front', 3, true);
    this.panelAppearance.addTextCentre(x, y + 110, 'Side', 3, true);
    this.panelAppearance.addTextCentre(x + 55, y + 110, 'Back', 3, true);

    y += 145;

    const { leftButton: headLeft, rightButton: headRight } = drawOptionBox(
        this.panelAppearance,
        'Head\nType',
        x - COLUMN_WIDTH,
        y
    );

    this.controlButtonAppearanceHeadLeft = headLeft;
    this.controlButtonAppearanceHeadRight = headRight;

    const { leftButton: hairLeft, rightButton: hairRight } = drawOptionBox(
        this.panelAppearance,
        'Hair\nColor',
        x + COLUMN_WIDTH,
        y
    );

    this.controlButtonAppearanceHairLeft = hairLeft;
    this.controlButtonAppearanceHairRight = hairRight;

    y += 50;

    const { leftButton: genderLeft, rightButton: genderRight } = drawOptionBox(
        this.panelAppearance,
        'Gender',
        x - COLUMN_WIDTH,
        y
    );

    this.controlButtonAppearanceGenderLeft = genderLeft;
    this.controlButtonAppearanceGenderRight = genderRight;

    const { leftButton: topLeft, rightButton: topRight } = drawOptionBox(
        this.panelAppearance,
        'Top\nColor',
        x + COLUMN_WIDTH,
        y
    );

    this.controlButtonAppearanceTopLeft = topLeft;
    this.controlButtonAppearanceTopRight = topRight;

    y += 50;

    const { leftButton: skinLeft, rightButton: skinRight } = drawOptionBox(
        this.panelAppearance,
        'Skin\nColor',
        x - COLUMN_WIDTH,
        y
    );

    this.controlButtonAppearanceSkinLeft = skinLeft;
    this.controlButtonAppearanceSkinRight = skinRight;

    const { leftButton: bottomLeft, rightButton: bottomRight } = drawOptionBox(
        this.panelAppearance,
        'Bottom\nColor',
        x + COLUMN_WIDTH,
        y
    );

    this.controlButtonAppearanceBottomLeft = bottomLeft;
    this.controlButtonAppearanceBottomRight = bottomRight;

    y += 47;

    this.panelAppearance.addButtonBackground(x, y, ACCEPT_WIDTH, ACCEPT_HEIGHT);
    this.panelAppearance.addTextCentre(x, y, 'Accept', 4, false);

    this.controlButtonAppearanceAccept = this.panelAppearance.addButton(
        x,
        y,
        ACCEPT_WIDTH,
        ACCEPT_HEIGHT
    );
}

function handleAppearancePanelInput() {
    this.panelAppearance.handleMouse(
        this.mouseX,
        this.mouseY,
        this.lastMouseButtonDown,
        this.mouseButtonDown
    );

    if (this.panelAppearance.isClicked(this.controlButtonAppearanceHeadLeft)) {
        do {
            this.appearanceHeadType =
                (this.appearanceHeadType - 1 + GameData.animationCount) %
                GameData.animationCount;
        } while (
            (GameData.animationGender[this.appearanceHeadType] & 3) !== 1 ||
            (GameData.animationGender[this.appearanceHeadType] &
                (4 * this.appearanceHeadGender)) ===
                0
        );
    }

    if (this.panelAppearance.isClicked(this.controlButtonAppearanceHeadRight)) {
        do {
            this.appearanceHeadType =
                (this.appearanceHeadType + 1) % GameData.animationCount;
        } while (
            (GameData.animationGender[this.appearanceHeadType] & 3) !== 1 ||
            (GameData.animationGender[this.appearanceHeadType] &
                (4 * this.appearanceHeadGender)) ===
                0
        );
    }

    if (this.panelAppearance.isClicked(this.controlButtonAppearanceHairLeft)) {
        this.appearanceHairColour =
            (this.appearanceHairColour - 1 + this.characterHairColours.length) %
            this.characterHairColours.length;
    }

    if (this.panelAppearance.isClicked(this.controlButtonAppearanceHairRight)) {
        this.appearanceHairColour =
            (this.appearanceHairColour + 1) % this.characterHairColours.length;
    }

    if (
        this.panelAppearance.isClicked(
            this.controlButtonAppearanceGenderLeft
        ) ||
        this.panelAppearance.isClicked(this.controlButtonAppearanceGenderRight)
    ) {
        for (
            this.appearanceHeadGender = 3 - this.appearanceHeadGender;
            (GameData.animationGender[this.appearanceHeadType] & 3) !== 1 ||
            (GameData.animationGender[this.appearanceHeadType] &
                (4 * this.appearanceHeadGender)) ===
                0;
            this.appearanceHeadType =
                (this.appearanceHeadType + 1) % GameData.animationCount
        );

        for (
            ;
            (GameData.animationGender[this.appearanceBodyGender] & 3) !==
                2 ||
            (GameData.animationGender[this.appearanceBodyGender] &
                (4 * this.appearanceHeadGender)) ===
                0;
            this.appearanceBodyGender =
                (this.appearanceBodyGender + 1) % GameData.animationCount
        );
    }

    if (this.panelAppearance.isClicked(this.controlButtonAppearanceTopLeft)) {
        this.appearanceTopColour =
            (this.appearanceTopColour -
                1 +
                this.characterTopBottomColours.length) %
            this.characterTopBottomColours.length;
    }

    if (this.panelAppearance.isClicked(this.controlButtonAppearanceTopRight)) {
        this.appearanceTopColour =
            (this.appearanceTopColour + 1) %
            this.characterTopBottomColours.length;
    }

    if (this.panelAppearance.isClicked(this.controlButtonAppearanceSkinLeft)) {
        this.appearanceSkinColour =
            (this.appearanceSkinColour - 1 + this.characterSkinColours.length) %
            this.characterSkinColours.length;
    }

    if (this.panelAppearance.isClicked(this.controlButtonAppearanceSkinRight)) {
        this.appearanceSkinColour =
            (this.appearanceSkinColour + 1) % this.characterSkinColours.length;
    }

    if (
        this.panelAppearance.isClicked(this.controlButtonAppearanceBottomLeft)
    ) {
        this.appearanceBottomColour =
            (this.appearanceBottomColour -
                1 +
                this.characterTopBottomColours.length) %
            this.characterTopBottomColours.length;
    }

    if (
        this.panelAppearance.isClicked(this.controlButtonAppearanceBottomRight)
    ) {
        this.appearanceBottomColour =
            (this.appearanceBottomColour + 1) %
            this.characterTopBottomColours.length;
    }

    if (this.panelAppearance.isClicked(this.controlButtonAppearanceAccept)) {
        this.packetStream.newPacket(clientOpcodes.APPEARANCE);
        this.packetStream.putByte(this.appearanceHeadGender);
        this.packetStream.putByte(this.appearanceHeadType);
        this.packetStream.putByte(this.appearanceBodyGender);
        this.packetStream.putByte(this.appearance2Colour);
        this.packetStream.putByte(this.appearanceHairColour);
        this.packetStream.putByte(this.appearanceTopColour);
        this.packetStream.putByte(this.appearanceBottomColour);
        this.packetStream.putByte(this.appearanceSkinColour);
        this.packetStream.sendPacket();

        this.surface.blackScreen();
        this.showAppearanceChange = false;
    }
}

module.exports = {
    createAppearancePanel,
    handleAppearancePanelInput
};
