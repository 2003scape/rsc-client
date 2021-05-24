const BUTTON_SIZE = 32;

const mobileSprites = {
    uiLeft: './ui-left.png',
    uiRight: './ui-right.png'
};

for (const spriteName of Object.keys(mobileSprites)) {
    const image = new Image();
    image.src = mobileSprites[spriteName];
    mobileSprites[spriteName] = image;
}

function drawMobileUI() {
    const rightX = this.gameWidth - BUTTON_SIZE - 3;
    const leftX = 3;
    const uiY = this.gameHeight / 2 - 49;

    this.graphics.ctx.globalAlpha = 0.5;

    let offsetY = uiY;

    for (let i = 0; i < 6; i += 1) {
        const isSelected = this.showUITab === i + 1;
        const buttonX = i > 2 ? leftX : rightX;

        if (isSelected) {
            this.graphics.ctx.globalAlpha = 1;
        }

        this.graphics.ctx.fillStyle = isSelected ? '#000083' : '#b5b5b4';
        this.graphics.ctx.fillRect(buttonX, offsetY, BUTTON_SIZE, BUTTON_SIZE);

        if (isSelected) {
            this.graphics.ctx.drawImage(
                i > 2 ? mobileSprites.uiLeft : mobileSprites.uiRight,
                0,
                i > 2 ? (i - 3) * (BUTTON_SIZE + 1) : i * (BUTTON_SIZE + 1),
                BUTTON_SIZE,
                BUTTON_SIZE,
                buttonX,
                offsetY,
                BUTTON_SIZE,
                BUTTON_SIZE
            );

            this.graphics.ctx.globalAlpha = 0.5;
        }

        if (i === 2) {
            offsetY = uiY;
        } else {
            offsetY += BUTTON_SIZE + 1;
        }
    }

    this.graphics.ctx.drawImage(mobileSprites.uiRight, rightX, uiY);
    this.graphics.ctx.drawImage(mobileSprites.uiLeft, leftX, uiY);

    this.graphics.ctx.globalAlpha = 1;
}

module.exports = { drawMobileUI };
