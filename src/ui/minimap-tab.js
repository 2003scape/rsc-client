const Scene = require('../scene');
const colours = require('./_colours');

const MENU_WIDTH = 245;

const HEIGHT = 152;
const WIDTH = 156;

const HALF_HEIGHT = (HEIGHT / 2) | 0;
const HALF_WIDTH = (WIDTH / 2) | 0;

function drawMinimapEntity(x, y, colour) {
    this.surface.setPixel(x, y, colour);
    this.surface.setPixel(x - 1, y, colour);
    this.surface.setPixel(x + 1, y, colour);
    this.surface.setPixel(x, y - 1, colour);
    this.surface.setPixel(x, y + 1, colour);
}

function drawUiTabMinimap(noMenus) {
    let uiX = this.gameWidth - WIDTH - 3;
    let uiY = 36;

    if (this.options.mobile) {
        uiX -= 32;
        uiY = this.gameHeight / 2 - HEIGHT / 2;
    } else {
        this.surface._drawSprite_from3(
            this.gameWidth - MENU_WIDTH - 3,
            3,
            this.spriteMedia + 2
        );
    }

    this.uiOpenX = uiX;
    this.uiOpenY = uiY;
    this.uiOpenWidth = WIDTH;
    this.uiOpenHeight = HEIGHT;

    this.surface.drawBox(uiX, uiY, WIDTH, HEIGHT, 0);
    this.surface.setBounds(uiX, uiY, uiX + WIDTH, uiY + HEIGHT);

    const scale = 192 + this.minimapRandom2;
    const rotation = (this.cameraRotation + this.minimapRandom1) & 0xff;

    let playerX = (((this.localPlayer.currentX - 6040) * 3 * scale) / 2048) | 0;
    let playerY = (((this.localPlayer.currentY - 6040) * 3 * scale) / 2048) | 0;

    const sin = Scene.sinCosCache[(1024 - rotation * 4) & 0x3ff];
    const cos = Scene.sinCosCache[((1024 - rotation * 4) & 0x3ff) + 1024];
    const tempX = (playerY * sin + playerX * cos) >> 18;

    playerY = (playerY * cos - playerX * sin) >> 18;
    playerX = tempX;

    this.surface.drawMinimapSprite(
        uiX + HALF_WIDTH - playerX,
        uiY + HALF_HEIGHT + playerY,
        this.spriteMedia - 1,
        (rotation + 64) & 255,
        scale
    );

    for (let i = 0; i < this.objectCount; i++) {
        let objectX =
            (((this.objectX[i] * this.magicLoc +
                64 -
                this.localPlayer.currentX) *
                3 *
                scale) /
                2048) |
            0;

        let objectY =
            (((this.objectY[i] * this.magicLoc +
                64 -
                this.localPlayer.currentY) *
                3 *
                scale) /
                2048) |
            0;

        const tempX = (objectY * sin + objectX * cos) >> 18;

        objectY = (objectY * cos - objectX * sin) >> 18;
        objectX = tempX;

        this.drawMinimapEntity(
            uiX + HALF_WIDTH + objectX,
            uiY + HALF_HEIGHT - objectY,
            colours.cyan
        );
    }

    for (let i = 0; i < this.groundItemCount; i++) {
        let itemX =
            (((this.groundItemX[i] * this.magicLoc +
                64 -
                this.localPlayer.currentX) *
                3 *
                scale) /
                2048) |
            0;

        let itemY =
            (((this.groundItemY[i] * this.magicLoc +
                64 -
                this.localPlayer.currentY) *
                3 *
                scale) /
                2048) |
            0;

        const tempX = (itemY * sin + itemX * cos) >> 18;

        itemY = (itemY * cos - itemX * sin) >> 18;
        itemX = tempX;

        this.drawMinimapEntity(
            uiX + HALF_WIDTH + itemX,
            uiY + HALF_HEIGHT - itemY,
            colours.red
        );
    }

    for (let i = 0; i < this.npcCount; i++) {
        const npc = this.npcs[i];

        let npcX =
            (((npc.currentX - this.localPlayer.currentX) * 3 * scale) / 2048) |
            0;

        let npcY =
            (((npc.currentY - this.localPlayer.currentY) * 3 * scale) / 2048) |
            0;

        const tempX = (npcY * sin + npcX * cos) >> 18;

        npcY = (npcY * cos - npcX * sin) >> 18;
        npcX = tempX;

        this.drawMinimapEntity(
            uiX + HALF_WIDTH + npcX,
            uiY + HALF_HEIGHT - npcY,
            colours.yellow
        );
    }

    for (let i = 0; i < this.playerCount; i++) {
        const player = this.players[i];

        let otherPlayerX =
            (((player.currentX - this.localPlayer.currentX) * 3 * scale) /
                2048) |
            0;

        let otherPlayerY =
            (((player.currentY - this.localPlayer.currentY) * 3 * scale) /
                2048) |
            0;

        const tempX = (otherPlayerY * sin + otherPlayerX * cos) >> 18;

        otherPlayerY = (otherPlayerY * cos - otherPlayerX * sin) >> 18;
        otherPlayerX = tempX;

        let playerColour = colours.white;

        for (let j = 0; j < this.friendListCount; j++) {
            if (
                !player.hash.equals(this.friendListHashes[j]) ||
                this.friendListOnline[j] !== 255
            ) {
                continue;
            }

            playerColour = colours.green;
            break;
        }

        this.drawMinimapEntity(
            uiX + HALF_WIDTH + otherPlayerX,
            uiY + HALF_HEIGHT - otherPlayerY,
            playerColour
        );
    }

    this.surface.drawCircle(
        uiX + HALF_WIDTH,
        uiY + HALF_HEIGHT,
        2,
        colours.white,
        255
    );

    // compass
    this.surface.drawMinimapSprite(
        uiX + 19,
        uiY + 19,
        this.spriteMedia + 24,
        (this.cameraRotation + 128) & 255,
        128
    );

    this.surface.setBounds(0, 0, this.gameWidth, this.gameHeight + 12);

    if (!noMenus) {
        return;
    }

    const mouseX = this.mouseX - uiX;
    const mouseY = this.mouseY - uiY;

    if (
        this.options.resetCompass &&
        this.mouseButtonClick === 1 &&
        mouseX > 0 &&
        mouseX <= 32 &&
        mouseY > 0 &&
        mouseY <= 32
    ) {
        this.cameraRotation = 128;
        this.mouseButtonClick = 0;
        return;
    }

    if (mouseX >= 0 && mouseY >= 0 && mouseX < WIDTH + 40 && mouseY < HEIGHT) {
        let deltaY =
            (((this.mouseX - (uiX + HALF_WIDTH)) * 16384) / (3 * scale)) | 0;

        let deltaX =
            (((this.mouseY - (uiY + HALF_HEIGHT)) * 16384) / (3 * scale)) | 0;

        const tempX = (deltaX * sin + deltaY * cos) >> 15;

        deltaX = (deltaX * cos - deltaY * sin) >> 15;
        deltaY = tempX;
        deltaY += this.localPlayer.currentX;
        deltaX = this.localPlayer.currentY - deltaX;

        if (this.mouseButtonClick === 1) {
            this._walkToActionSource_from5(
                this.localRegionX,
                this.localRegionY,
                (deltaY / 128) | 0,
                (deltaX / 128) | 0,
                false
            );

            this.mouseButtonClick = 0;
        }
    }
}

module.exports = {
    drawMinimapEntity,
    drawUiTabMinimap
};
