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
    const rightY = this.gameHeight / 2 - 49;

    this.graphics.ctx.globalAlpha = 0.5;

    let offsetY = rightY;

    for (let i = 0; i < 3; i += 1) {
        const isSelected = this.showUiTab === i + 1;

        if (isSelected) {
            this.graphics.ctx.globalAlpha = 1;
        }

        this.graphics.ctx.fillStyle = isSelected ? '#000083' : '#b5b5b4';
        this.graphics.ctx.fillRect(rightX, offsetY, BUTTON_SIZE, BUTTON_SIZE);

        if (isSelected) {
            this.graphics.ctx.drawImage(
                mobileSprites.uiRight,
                0,
                i * (BUTTON_SIZE + 1),
                BUTTON_SIZE,
                BUTTON_SIZE,
                rightX,
                offsetY,
                BUTTON_SIZE,
                BUTTON_SIZE
            );

            this.graphics.ctx.globalAlpha = 0.5;
        }

        offsetY += BUTTON_SIZE + 1;
    }

    this.graphics.ctx.drawImage(mobileSprites.uiRight, rightX, rightY);

    this.graphics.ctx.globalAlpha = 1;
}

module.exports = { drawMobileUI };
