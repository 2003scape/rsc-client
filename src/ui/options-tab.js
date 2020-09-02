const clientOpcodes = require('../opcodes/client');

const BLACK = 0;
const DARK_GREY = 0xb5b5b5;
const LIGHT_GREY = 0xc9c9c9;
const WHITE = 0xffffff;
const YELLOW = 0xffff00;

const UI_X = 313;
const UI_Y = 36;
const WIDTH = 196;
const LINE_BREAK = 15;

function drawUiTabOptions(noMenus) {
    this.surface._drawSprite_from3(UI_X - 49, 3, this.spriteMedia + 6);

    this.surface.drawBoxAlpha(UI_X, 36, WIDTH, 65, DARK_GREY, 160);
    this.surface.drawBoxAlpha(UI_X, 101, WIDTH, 65, LIGHT_GREY, 160);
    this.surface.drawBoxAlpha(UI_X, 166, WIDTH, 95, DARK_GREY, 160);
    this.surface.drawBoxAlpha(UI_X, 261, WIDTH, 40, LIGHT_GREY, 160);

    let x = UI_X + 3;
    let y = UI_Y + LINE_BREAK;

    this.surface.drawString('Game options - click to toggle', x, y, 1, BLACK);

    y += LINE_BREAK;

    this.surface.drawString(
        'Camera angle mode - ' +
            (this.optionCameraModeAuto ? '@gre@Auto' : '@red@Manual'),
        x,
        y,
        1,
        WHITE
    );

    y += LINE_BREAK;

    this.surface.drawString(
        'Mouse buttons - ' +
            (this.optionMouseButtonOne ? '@red@One' : '@gre@Two'),
        x,
        y,
        1,
        WHITE
    );

    y += LINE_BREAK;

    if (this.members) {
        this.surface.drawString(
            'Sound effects - ' +
                (this.optionSoundDisabled ? '@red@off' : '@gre@on'),
            x,
            y,
            1,
            WHITE
        );
    }

    y += LINE_BREAK;

    this.surface.drawString('To change your contact details,', x, y, 0, WHITE);

    y += LINE_BREAK;

    this.surface.drawString(
        'password, recovery questions, etc..',
        x,
        y,
        0,
        WHITE
    );

    y += LINE_BREAK;

    this.surface.drawString(
        "please select 'account management'",
        x,
        y,
        0,
        WHITE
    );

    y += LINE_BREAK;

    if (this.referID === 0) {
        this.surface.drawString(
            'from the runescape.com front page',
            x,
            y,
            0,
            WHITE
        );
    } else if (this.referID === 1) {
        this.surface.drawString(
            'from the link below the gamewindow',
            x,
            y,
            0,
            WHITE
        );
    } else {
        this.surface.drawString(
            'from the runescape front webpage',
            x,
            y,
            0,
            WHITE
        );
    }

    y += LINE_BREAK + 5;

    this.surface.drawString(
        'Privacy settings. Will be applied to',
        UI_X + 3,
        y,
        1,
        BLACK
    );

    y += LINE_BREAK;

    this.surface.drawString(
        'all people not on your friends list',
        UI_X + 3,
        y,
        1,
        BLACK
    );

    y += LINE_BREAK;

    this.surface.drawString(
        'Block chat messages: ' +
            (!this.settingsBlockChat ? '@red@<off>' : '@gre@<on>'),
        UI_X + 3,
        y,
        1,
        WHITE
    );

    y += LINE_BREAK;

    this.surface.drawString(
        'Block private messages: ' +
            (!this.settingsBlockPrivate ? '@red@<off>' : '@gre@<on>'),
        UI_X + 3,
        y,
        1,
        WHITE
    );

    y += LINE_BREAK;

    this.surface.drawString(
        'Block trade requests: ' +
            (!this.settingsBlockTrade ? '@red@<off>' : '@gre@<on>'),
        UI_X + 3,
        y,
        1,
        WHITE
    );

    y += LINE_BREAK;

    if (this.members) {
        this.surface.drawString(
            'Block duel requests: ' +
                (!this.settingsBlockDuel ? '@red@<off>' : '@gre@<on>'),
            UI_X + 3,
            y,
            1,
            WHITE
        );
    }

    y += LINE_BREAK + 5;

    this.surface.drawString('Always logout when you finish', x, y, 1, BLACK);

    y += LINE_BREAK;

    let textColour = WHITE;

    if (
        this.mouseX > x &&
        this.mouseX < x + WIDTH &&
        this.mouseY > y - 12 &&
        this.mouseY < y + 4
    ) {
        textColour = YELLOW;
    }

    this.surface.drawString('Click here to logout', UI_X + 3, y, 1, textColour);

    if (!noMenus) {
        return;
    }

    const mouseX = this.mouseX - (this.surface.width2 - 199);
    const mouseY = this.mouseY - 36;

    if (mouseX >= 0 && mouseY >= 0 && mouseX < 196 && mouseY < 265) {
        let x = UI_X + 3;
        let y = UI_Y + 30;

        if (
            this.mouseX > x &&
            this.mouseX < x + WIDTH &&
            this.mouseY > y - 12 &&
            this.mouseY < y + 4 &&
            this.mouseButtonClick === 1
        ) {
            this.optionCameraModeAuto = !this.optionCameraModeAuto;
            this.packetStream.newPacket(clientOpcodes.SETTINGS_GAME);
            this.packetStream.putByte(0);
            this.packetStream.putByte(this.optionCameraModeAuto ? 1 : 0);
            this.packetStream.sendPacket();
        }

        y += LINE_BREAK;

        if (
            this.mouseX > x &&
            this.mouseX < x + WIDTH &&
            this.mouseY > y - 12 &&
            this.mouseY < y + 4 &&
            this.mouseButtonClick === 1
        ) {
            this.optionMouseButtonOne = !this.optionMouseButtonOne;
            this.packetStream.newPacket(clientOpcodes.SETTINGS_GAME);
            this.packetStream.putByte(2);
            this.packetStream.putByte(this.optionMouseButtonOne ? 1 : 0);
            this.packetStream.sendPacket();
        }

        y += LINE_BREAK;

        if (
            this.members &&
            this.mouseX > x &&
            this.mouseX < x + WIDTH &&
            this.mouseY > y - 12 &&
            this.mouseY < y + 4 &&
            this.mouseButtonClick === 1
        ) {
            this.optionSoundDisabled = !this.optionSoundDisabled;
            this.packetStream.newPacket(clientOpcodes.SETTINGS_GAME);
            this.packetStream.putByte(3);
            this.packetStream.putByte(this.optionSoundDisabled ? 1 : 0);
            this.packetStream.sendPacket();
        }

        for (let i = 0; i < 5; i += 1) {
            y += LINE_BREAK;
        }

        let hasChangedSetting = false;

        y += 35;

        if (
            this.mouseX > x &&
            this.mouseX < x + WIDTH &&
            this.mouseY > y - 12 &&
            this.mouseY < y + 4 &&
            this.mouseButtonClick === 1
        ) {
            this.settingsBlockChat = 1 - this.settingsBlockChat;
            hasChangedSetting = true;
        }

        y += LINE_BREAK;

        if (
            this.mouseX > x &&
            this.mouseX < x + WIDTH &&
            this.mouseY > y - 12 &&
            this.mouseY < y + 4 &&
            this.mouseButtonClick === 1
        ) {
            this.settingsBlockPrivate = 1 - this.settingsBlockPrivate;
            hasChangedSetting = true;
        }

        y += LINE_BREAK;

        if (
            this.mouseX > x &&
            this.mouseX < x + WIDTH &&
            this.mouseY > y - 12 &&
            this.mouseY < y + 4 &&
            this.mouseButtonClick === 1
        ) {
            this.settingsBlockTrade = 1 - this.settingsBlockTrade;
            hasChangedSetting = true;
        }

        y += LINE_BREAK;

        if (
            this.members &&
            this.mouseX > x &&
            this.mouseX < x + WIDTH &&
            this.mouseY > y - 12 &&
            this.mouseY < y + 4 &&
            this.mouseButtonClick === 1
        ) {
            this.settingsBlockDuel = 1 - this.settingsBlockDuel;
            hasChangedSetting = true;
        }

        y += LINE_BREAK;

        if (hasChangedSetting) {
            this.sendPrivacySettings(
                this.settingsBlockChat,
                this.settingsBlockPrivate,
                this.settingsBlockTrade,
                this.settingsBlockDuel
            );
        }

        y += 20;

        if (
            this.mouseX > x &&
            this.mouseX < x + WIDTH &&
            this.mouseY > y - 12 &&
            this.mouseY < y + 4 &&
            this.mouseButtonClick === 1
        ) {
            this.sendLogout();
        }

        this.mouseButtonClick = 0;
    }
}

module.exports = { drawUiTabOptions };
