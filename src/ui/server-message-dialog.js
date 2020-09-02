const BLACK = 0;
const RED = 0xff0000;
const WHITE = 0xffffff;

function drawDialogServerMessage() {
    let width = 400;
    let height = 100;

    if (this.serverMessageBoxTop) {
        height = 450;
        height = 300;
    }

    this.surface.drawBox(
        256 - ((width / 2) | 0),
        167 - ((height / 2) | 0),
        width,
        height,
        BLACK
    );
    this.surface.drawBoxEdge(
        256 - ((width / 2) | 0),
        167 - ((height / 2) | 0),
        width,
        height,
        WHITE
    );
    this.surface.drawParagraph(
        this.serverMessage,
        256,
        167 - ((height / 2) | 0) + 20,
        1,
        WHITE,
        width - 40
    );

    let i = 157 + ((height / 2) | 0);
    let textColour = WHITE;

    if (
        this.mouseY > i - 12 &&
        this.mouseY <= i &&
        this.mouseX > 106 &&
        this.mouseX < 406
    ) {
        textColour = RED;
    }

    this.surface.drawStringCenter(
        'Click here to close window',
        256,
        i,
        1,
        textColour
    );

    if (this.mouseButtonClick === 1) {
        if (textColour === RED) {
            this.showDialogServerMessage = false;
        }

        if (
            (this.mouseX < 256 - ((width / 2) | 0) ||
                this.mouseX > 256 + ((width / 2) | 0)) &&
            (this.mouseY < 167 - ((height / 2) | 0) ||
                this.mouseY > 167 + ((height / 2) | 0))
        ) {
            this.showDialogServerMessage = false;
        }
    }

    this.mouseButtonClick = 0;
}

module.exports = { drawDialogServerMessage };
