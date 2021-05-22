const BUTTON_SIZE = 32;

function setActiveUITab() {
    if (
        this.showUITab === 0 &&
        this.mouseX >= this.gameWidth - 35 &&
        this.mouseY >= 3 &&
        this.mouseX < this.gameWidth - 3 &&
        this.mouseY < 35
    ) {
        this.showUITab = 1;
    }

    if (
        this.showUITab === 0 &&
        this.mouseX >= this.gameWidth - 35 - 33 &&
        this.mouseY >= 3 &&
        this.mouseX < this.gameWidth - 3 - 33 &&
        this.mouseY < 35
    ) {
        this.showUITab = 2;
        this.minimapRandom1 = ((Math.random() * 13) | 0) - 6;
        this.minimapRandom2 = ((Math.random() * 23) | 0) - 11;
    }

    if (
        this.showUITab === 0 &&
        this.mouseX >= this.gameWidth - 35 - 66 &&
        this.mouseY >= 3 &&
        this.mouseX < this.gameWidth - 3 - 66 &&
        this.mouseY < 35
    ) {
        this.showUITab = 3;
    }

    if (
        this.showUITab === 0 &&
        this.mouseX >= this.gameWidth - 35 - 99 &&
        this.mouseY >= 3 &&
        this.mouseX < this.gameWidth - 3 - 99 &&
        this.mouseY < 35
    ) {
        this.showUITab = 4;
    }

    if (
        this.showUITab === 0 &&
        this.mouseX >= this.gameWidth - 35 - 132 &&
        this.mouseY >= 3 &&
        this.mouseX < this.gameWidth - 3 - 132 &&
        this.mouseY < 35
    ) {
        this.showUITab = 5;
    }

    if (
        this.showUITab === 0 &&
        this.mouseX >= this.gameWidth - 35 - 165 &&
        this.mouseY >= 3 &&
        this.mouseX < this.gameWidth - 3 - 165 &&
        this.mouseY < 35
    ) {
        this.showUITab = 6;
    }

    if (
        this.showUITab !== 0 &&
        this.mouseX >= this.gameWidth - 35 &&
        this.mouseY >= 3 &&
        this.mouseX < this.gameWidth - 3 &&
        this.mouseY < 26
    ) {
        this.showUITab = 1;
    }

    if (
        this.showUITab !== 0 &&
        this.showUITab !== 2 &&
        this.mouseX >= this.gameWidth - 35 - 33 &&
        this.mouseY >= 3 &&
        this.mouseX < this.gameWidth - 3 - 33 &&
        this.mouseY < 26
    ) {
        this.showUITab = 2;
        this.minimapRandom1 = ((Math.random() * 13) | 0) - 6;
        this.minimapRandom2 = ((Math.random() * 23) | 0) - 11;
    }

    if (
        this.showUITab !== 0 &&
        this.mouseX >= this.gameWidth - 35 - 66 &&
        this.mouseY >= 3 &&
        this.mouseX < this.gameWidth - 3 - 66 &&
        this.mouseY < 26
    ) {
        this.showUITab = 3;
    }

    if (
        this.showUITab !== 0 &&
        this.mouseX >= this.gameWidth - 35 - 99 &&
        this.mouseY >= 3 &&
        this.mouseX < this.gameWidth - 3 - 99 &&
        this.mouseY < 26
    ) {
        this.showUITab = 4;
    }

    if (
        this.showUITab !== 0 &&
        this.mouseX >= this.gameWidth - 35 - 132 &&
        this.mouseY >= 3 &&
        this.mouseX < this.gameWidth - 3 - 132 &&
        this.mouseY < 26
    ) {
        this.showUITab = 5;
    }

    if (
        this.showUITab !== 0 &&
        this.mouseX >= this.gameWidth - 35 - 165 &&
        this.mouseY >= 3 &&
        this.mouseX < this.gameWidth - 3 - 165 &&
        this.mouseY < 26
    ) {
        this.showUITab = 6;
    }

    if (
        this.showUITab === 1 &&
        (this.mouseX < this.gameWidth - 248 ||
            this.mouseY > 36 + ((this.inventoryMaxItemCount / 5) | 0) * 34)
    ) {
        this.showUITab = 0;
    }

    if (
        this.showUITab === 3 &&
        (this.mouseX < this.gameWidth - 199 || this.mouseY > 316)
    ) {
        this.showUITab = 0;
    }

    if (
        (this.showUITab === 2 ||
            this.showUITab === 4 ||
            this.showUITab === 5) &&
        (this.mouseX < this.gameWidth - 199 || this.mouseY > 240)
    ) {
        this.showUITab = 0;
    }

    if (
        this.showUITab === 6 &&
        (this.mouseX < this.gameWidth - 199 || this.mouseY > 311)
    ) {
        this.showUITab = 0;
    }
}

function setActiveMobileUITab() {
    const rightX = this.gameWidth - BUTTON_SIZE - 3;
    const rightY = this.gameHeight / 2 - 49;

    if (this.showUITab === 0 && this.mouseX < rightX) {
        return;
    }

    let offsetY = rightY;

    for (let i = 0; i < 3; i += 1) {
        if (this.mouseY >= offsetY && this.mouseY <= offsetY + BUTTON_SIZE) {
            if (this.showUITab === 0) {
                this.showUITab = i + 1;
                return;
            } else if (this.showUITab === i + 1) {
                return;
            }
        }

        offsetY += BUTTON_SIZE + 1;
    }

    if (
        this.showUITab !== 0 &&
        (this.mouseX < this.uiOpenX ||
            this.mouseX > this.uiOpenX + this.uiOpenWidth ||
            this.mouseY < this.uiOpenY ||
            this.mouseY > this.uiOpenY + this.uiOpenHeight)
    ) {
        this.showUITab = 0;
    }
}

module.exports = { setActiveUITab, setActiveMobileUITab };
