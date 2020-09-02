const ChatMessage = require('../chat-message');
const Utility = require('../utility');
const WordFilter = require('../word-filter');

const WHITE = 0xffffff;
const YELLOW = 0xffff00;

function drawDialogSocialInput() {
    if (this.mouseButtonClick !== 0) {
        this.mouseButtonClick = 0;

        if (
            this.showDialogSocialInput === 1 &&
            (this.mouseX < 106 ||
                this.mouseY < 145 ||
                this.mouseX > 406 ||
                this.mouseY > 215)
        ) {
            this.showDialogSocialInput = 0;
            return;
        }

        if (
            this.showDialogSocialInput === 2 &&
            (this.mouseX < 6 ||
                this.mouseY < 145 ||
                this.mouseX > 506 ||
                this.mouseY > 215)
        ) {
            this.showDialogSocialInput = 0;
            return;
        }

        if (
            this.showDialogSocialInput === 3 &&
            (this.mouseX < 106 ||
                this.mouseY < 145 ||
                this.mouseX > 406 ||
                this.mouseY > 215)
        ) {
            this.showDialogSocialInput = 0;
            return;
        }

        if (
            this.mouseX > 236 &&
            this.mouseX < 276 &&
            this.mouseY > 193 &&
            this.mouseY < 213
        ) {
            this.showDialogSocialInput = 0;
            return;
        }
    }

    let y = 145;

    if (this.showDialogSocialInput === 1) {
        this.surface.drawBox(106, y, 300, 70, 0);
        this.surface.drawBoxEdge(106, y, 300, 70, WHITE);
        y += 20;
        this.surface.drawStringCenter(
            'Enter name to add to friends list',
            256,
            y,
            4,
            WHITE
        );
        y += 20;
        this.surface.drawStringCenter(
            `${this.inputTextCurrent}*`,
            256,
            y,
            4,
            WHITE
        );

        if (this.inputTextFinal.length > 0) {
            const username = this.inputTextFinal.trim();
            const encodedUsername = Utility.usernameToHash(username);

            this.inputTextCurrent = '';
            this.inputTextFinal = '';
            this.showDialogSocialInput = 0;

            if (
                username.length > 0 &&
                !encodedUsername.equals(this.localPlayer.hash)
            ) {
                this.friendAdd(username);
            }
        }
    } else if (this.showDialogSocialInput === 2) {
        this.surface.drawBox(6, y, 500, 70, 0);
        this.surface.drawBoxEdge(6, y, 500, 70, WHITE);
        y += 20;
        this.surface.drawStringCenter(
            'Enter message to send to ' +
                Utility.hashToUsername(this.privateMessageTarget),
            256,
            y,
            4,
            WHITE
        );
        y += 20;
        this.surface.drawStringCenter(
            this.inputPMCurrent + '*',
            256,
            y,
            4,
            WHITE
        );

        if (this.inputPMFinal.length > 0) {
            let message = this.inputPMFinal;
            this.inputPMCurrent = '';
            this.inputPMFinal = '';
            this.showDialogSocialInput = 0;

            let scrambledMessage = ChatMessage.scramble(message);
            this.sendPrivateMessage(
                this.privateMessageTarget,
                ChatMessage.scrambledBytes,
                scrambledMessage
            );
            message = ChatMessage.descramble(
                ChatMessage.scrambledBytes,
                0,
                scrambledMessage
            );

            if (this.options.wordFilter) {
                message = WordFilter.filter(message);
            }

            this.showServerMessage(
                '@pri@You tell ' +
                    `${Utility.hashToUsername(this.privateMessageTarget)}: ` +
                    message
            );
        }
    } else if (this.showDialogSocialInput === 3) {
        this.surface.drawBox(106, y, 300, 70, 0);
        this.surface.drawBoxEdge(106, y, 300, 70, WHITE);
        y += 20;
        this.surface.drawStringCenter(
            'Enter name to add to ignore list',
            256,
            y,
            4,
            WHITE
        );
        y += 20;
        this.surface.drawStringCenter(
            `${this.inputTextCurrent}*`,
            256,
            y,
            4,
            WHITE
        );

        if (this.inputTextFinal.length > 0) {
            const username = this.inputTextFinal.trim();
            const encodedUsername = Utility.usernameToHash(username);

            this.inputTextCurrent = '';
            this.inputTextFinal = '';
            this.showDialogSocialInput = 0;

            if (
                username.length > 0 &&
                !encodedUsername.equals(this.localPlayer.hash)
            ) {
                this.ignoreAdd(username);
            }
        }
    }

    let textColour = WHITE;

    if (
        this.mouseX > 236 &&
        this.mouseX < 276 &&
        this.mouseY > 193 &&
        this.mouseY < 213
    ) {
        textColour = YELLOW;
    }

    this.surface.drawStringCenter('Cancel', 256, 208, 1, textColour);
}

function resetPMText() {
    this.inputPMCurrent = '';
    this.inputPMFinal = '';
}

module.exports = {
    drawDialogSocialInput,
    resetPMText,
    showDialogSocialInput: 0
};
