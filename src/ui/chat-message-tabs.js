const ChatMessage = require('../chat-message');
const Panel = require('../panel');
const WordFilter = require('../word-filter');
const colours = require('./_colours');

const HBAR_WIDTH = 512;

function createMessageTabPanel() {
    this.panelMessageTabs = new Panel(this.surface, 10);

    this.controlTextListAll = this.panelMessageTabs.addTextListInput(
        7,
        324,
        498,
        14,
        1,
        80,
        false,
        true
    );

    this.controlTextListChat = this.panelMessageTabs.addTextList(
        5,
        269,
        502,
        56,
        1,
        20,
        true
    );

    this.controlTextListQuest = this.panelMessageTabs.addTextList(
        5,
        269,
        502,
        56,
        1,
        20,
        true
    );

    this.controlTextListPrivate = this.panelMessageTabs.addTextList(
        5,
        269,
        502,
        56,
        1,
        20,
        true
    );

    if (!this.options.mobile) {
        this.panelMessageTabs.setFocus(this.controlTextListAll);
    }
}

function drawChatMessageTabs() {
    let x = (this.gameWidth / 2 - HBAR_WIDTH / 2) | 0;
    let y = this.gameHeight - 4;

    if (this.options.mobile) {
        y = 8;

        this.surface.drawMinimapSprite(
            x + HBAR_WIDTH / 2 - 103,
            y,
            this.spriteMedia + 23,
            128,
            128
        );

        this.surface.drawMinimapSprite(
            x + HBAR_WIDTH / 2 + (404 | 0),
            y,
            this.spriteMedia + 23,
            128,
            128
        );

        y = 10;
    } else {
        this.surface._drawSprite_from3(x, y, this.spriteMedia + 23);

        y = this.gameHeight + 6;
    }

    let textColour = colours.chatPurple;

    if (this.messageTabSelected === 0) {
        textColour = colours.chatOrange;
    }

    if (this.messageTabFlashAll % 30 > 15) {
        textColour = colours.chatRed;
    }

    this.surface.drawStringCenter('All messages', x + 54, y, 0, textColour);

    textColour = colours.chatPurple;

    if (this.messageTabSelected === 1) {
        textColour = colours.chatOrange;
    }

    if (this.messageTabFlashHistory % 30 > 15) {
        textColour = colours.chatRed;
    }

    this.surface.drawStringCenter('Chat history', x + 155, y, 0, textColour);

    textColour = colours.chatPurple;

    if (this.messageTabSelected === 2) {
        textColour = colours.chatOrange;
    }

    if (this.messageTabFlashQuest % 30 > 15) {
        textColour = colours.chatRed;
    }

    this.surface.drawStringCenter('Quest history', x + 255, y, 0, textColour);

    textColour = colours.chatPurple;

    if (this.messageTabSelected === 3) {
        textColour = colours.chatOrange;
    }

    if (this.messageTabFlashPrivate % 30 > 15) {
        textColour = colours.chatRed;
    }

    this.surface.drawStringCenter('Private history', x + 355, y, 0, textColour);

    this.surface.drawStringCenter('Report abuse', x + 457, y, 0, colours.white);
}

async function handleMesssageTabsInput() {
    if (this.mouseY > this.gameHeight - 4) {
        if (
            this.mouseX > 15 &&
            this.mouseX < 96 &&
            this.lastMouseButtonDown === 1
        ) {
            this.messageTabSelected = 0;
        }

        if (
            this.mouseX > 110 &&
            this.mouseX < 194 &&
            this.lastMouseButtonDown === 1
        ) {
            this.messageTabSelected = 1;
            this.panelMessageTabs.controlFlashText[
                this.controlTextListChat
            ] = 999999;
        }

        if (
            this.mouseX > 215 &&
            this.mouseX < 295 &&
            this.lastMouseButtonDown === 1
        ) {
            this.messageTabSelected = 2;
            this.panelMessageTabs.controlFlashText[
                this.controlTextListQuest
            ] = 999999;
        }

        if (
            this.mouseX > 315 &&
            this.mouseX < 395 &&
            this.lastMouseButtonDown === 1
        ) {
            this.messageTabSelected = 3;
            this.panelMessageTabs.controlFlashText[
                this.controlTextListPrivate
            ] = 999999;
        }

        if (
            this.mouseX > 417 &&
            this.mouseX < 497 &&
            this.lastMouseButtonDown === 1
        ) {
            this.showDialogReportAbuseStep = 1;
            this.reportAbuseOffence = 0;
            this.inputTextCurrent = '';
            this.inputTextFinal = '';
        }

        this.lastMouseButtonDown = 0;
        this.mouseButtonDown = 0;
    }

    this.panelMessageTabs.handleMouse(
        this.mouseX,
        this.mouseY,
        this.lastMouseButtonDown,
        this.mouseButtonDown,
        this.mouseScrollDelta
    );

    if (
        this.messageTabSelected > 0 &&
        this.mouseX >= 494 &&
        this.mouseY >= this.gameHeight - 66
    ) {
        this.lastMouseButtonDown = 0;
    }

    if (this.panelMessageTabs.isClicked(this.controlTextListAll)) {
        let message = this.panelMessageTabs.getText(this.controlTextListAll);

        this.panelMessageTabs.updateText(this.controlTextListAll, '');

        if (/^::/.test(message)) {
            if (/^::closecon$/i.test(message)) {
                this.packetStream.closeStream();
            } else if (/^::logout/i.test(message)) {
                this.closeConnection();
            } else if (/^::lostcon$/i.test(message)) {
                await this.lostConnection();
            } else {
                this.sendCommandString(message.substring(2));
            }
        } else {
            const encodedMessage = ChatMessage.scramble(message);

            this.sendChatMessage(ChatMessage.scrambledBytes, encodedMessage);

            message = ChatMessage.descramble(
                ChatMessage.scrambledBytes,
                0,
                encodedMessage
            );

            if (this.options.wordFilter) {
                message = WordFilter.filter(message);
            }

            this.localPlayer.messageTimeout = 150;
            this.localPlayer.message = message;

            this.showMessage(`${this.localPlayer.name}: ${message}`, 2);
        }
    }

    if (this.messageTabSelected === 0) {
        for (let l1 = 0; l1 < 5; l1++) {
            if (this.messageHistoryTimeout[l1] > 0) {
                this.messageHistoryTimeout[l1]--;
            }
        }
    }
}

module.exports = {
    createMessageTabPanel,
    drawChatMessageTabs,
    handleMesssageTabsInput
};
