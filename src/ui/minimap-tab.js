const Scene = require('../scene');

const CYAN = 0x00ffff;
const GREEN = 0x00ff00;
const RED = 0xff0000;
const WHITE = 0xffffff;
const YELLOW = 0xffff00;

const HEIGHT = 152;
const UI_X = 313;
const UI_Y = 36;
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
    this.surface._drawSprite_from3(UI_X - 49, 3, this.spriteMedia + 2);

    const x = UI_X + 40;

    this.surface.drawBox(x, UI_Y, WIDTH, HEIGHT, 0);
    this.surface.setBounds(x, UI_Y, x + WIDTH, UI_Y + HEIGHT);

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
        x + HALF_WIDTH - playerX,
        UI_Y + HALF_HEIGHT + playerY,
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
            x + HALF_WIDTH + objectX,
            UI_Y + HALF_HEIGHT - objectY,
            CYAN
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
            x + HALF_WIDTH + itemX,
            UI_Y + HALF_HEIGHT - itemY,
            RED
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
            x + HALF_WIDTH + npcX,
            UI_Y + HALF_HEIGHT - npcY,
            YELLOW
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

        let playerColour = WHITE;

        for (let j = 0; j < this.friendListCount; j++) {
            if (
                !player.hash.equals(this.friendListHashes[j]) ||
                this.friendListOnline[j] !== 255
            ) {
                continue;
            }

            playerColour = GREEN;
            break;
        }

        this.drawMinimapEntity(
            x + HALF_WIDTH + otherPlayerX,
            UI_Y + HALF_HEIGHT - otherPlayerY,
            playerColour
        );
    }

    this.surface.drawCircle(x + HALF_WIDTH, UI_Y + HALF_HEIGHT, 2, WHITE, 255);

    // compass
    this.surface.drawMinimapSprite(
        x + 19,
        55,
        this.spriteMedia + 24,
        (this.cameraRotation + 128) & 255,
        128
    );
    this.surface.setBounds(0, 0, this.gameWidth, this.gameHeight + 12);

    if (!noMenus) {
        return;
    }

    const mouseX = this.mouseX - UI_X;
    const mouseY = this.mouseY - UI_Y;

    if (
        this.options.resetCompass &&
        this.mouseButtonClick === 1 &&
        mouseX > 42 &&
        mouseX < 75 &&
        mouseY > 3 &&
        mouseY < UI_Y
    ) {
        this.cameraRotation = 128;
        this.mouseButtonClick = 0;
        return;
    }

    if (mouseX >= 40 && mouseY >= 0 && mouseX < 196 && mouseY < 152) {
        let dX = (((this.mouseX - (x + HALF_WIDTH)) * 16384) / (3 * scale)) | 0;
        let dY =
            (((this.mouseY - (UI_Y + HALF_HEIGHT)) * 16384) / (3 * scale)) | 0;
        const tempX = (dY * sin + dX * cos) >> 15;

        dY = (dY * cos - dX * sin) >> 15;
        dX = tempX;
        dX += this.localPlayer.currentX;
        dY = this.localPlayer.currentY - dY;

        if (this.mouseButtonClick === 1) {
            this._walkToActionSource_from5(
                this.localRegionX,
                this.localRegionY,
                (dX / 128) | 0,
                (dY / 128) | 0,
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
