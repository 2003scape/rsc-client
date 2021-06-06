const ChatMessage = require('../chat-message');
const Panel = require('../panel');
const WordFilter = require('../word-filter');
const colours = require('./_colours');

const HBAR_WIDTH = 512;

const ALL_MAX_LENGTH = 80;
const HISTORY_MAX_ENTRIES = 20;

function createMessageTabPanel() {
    this.panelMessageTabs = new Panel(this.surface, 10);

    let y = 269;

    if (this.options.mobile) {
        y = 15;
    }

    this.controlTextListAll = this.panelMessageTabs.addTextListInput(
        7,
        y + 55 + (this.options.mobile ? 12 : 0),
        498,
        14,
        1,
        ALL_MAX_LENGTH,
        false,
        true
    );

    this.controlTextListChat = this.panelMessageTabs.addTextList(
        5,
        y,
        502,
        56,
        1,
        HISTORY_MAX_ENTRIES,
        true
    );

    this.controlTextListQuest = this.panelMessageTabs.addTextList(
        5,
        y,
        502,
        56,
        1,
        HISTORY_MAX_ENTRIES,
        true
    );

    this.controlTextListPrivate = this.panelMessageTabs.addTextList(
        5,
        y,
        502,
        56,
        1,
        HISTORY_MAX_ENTRIES,
        true
    );

    if (!this.options.mobile) {
        this.panelMessageTabs.setFocus(this.controlTextListAll);
    }
}

function drawChatMessageTabs() {
    const x = (this.gameWidth / 2 - HBAR_WIDTH / 2) | 0;
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
    const x = (this.gameWidth / 2 - HBAR_WIDTH / 2) | 0;
    const mouseX = this.mouseX - x;

    if (
        (this.options.mobile && this.mouseY < 15) ||
        (!this.options.mobile && this.mouseY > this.gameHeight - 4)
    ) {
        if (mouseX > 15 && mouseX < 96 && this.lastMouseButtonDown === 1) {
            this.messageTabSelected = 0;
        }

        if (mouseX > 110 && mouseX < 194 && this.lastMouseButtonDown === 1) {
            this.messageTabSelected = 1;

            this.panelMessageTabs.controlFlashText[
                this.controlTextListChat
            ] = 999999;
        }

        if (mouseX > 215 && mouseX < 295 && this.lastMouseButtonDown === 1) {
            this.messageTabSelected = 2;

            this.panelMessageTabs.controlFlashText[
                this.controlTextListQuest
            ] = 999999;
        }

        if (mouseX > 315 && mouseX < 395 && this.lastMouseButtonDown === 1) {
            this.messageTabSelected = 3;

            this.panelMessageTabs.controlFlashText[
                this.controlTextListPrivate
            ] = 999999;
        }

        if (mouseX > 417 && mouseX < 497 && this.lastMouseButtonDown === 1) {
            this.showDialogReportAbuseStep = 1;
            this.reportAbuseOffence = 0;
            this.inputTextCurrent = '';
            this.inputTextFinal = '';
        }

        this.lastMouseButtonDown = 0;
        this.mouseButtonDown = 0;
    }

    if (!(this.options.mobile && this.mouseY >= 72)) {
        this.panelMessageTabs.handleMouse(
            this.mouseX,
            this.mouseY,
            this.lastMouseButtonDown,
            this.mouseButtonDown,
            this.mouseScrollDelta
        );
    }

    if (
        this.options.mobile &&
        this.lastMouseButtonDown
    ) {
        if (
            !this.panelMessageTabs.controlText[this.controlTextListAll].length
        ) {
            this.panelMessageTabs.focusControlIndex = -1;
        }
    }

    if (
        this.options.mobile &&
        this.lastMouseButtonDown &&
        this.showUITab < 3 &&
        this.mouseX <= 108 &&
        this.mouseY >= 72 &&
        this.mouseY <= 98
    ) {
        this.panelMessageTabs.setFocus(this.controlTextListAll);
        this.lastMouseButtonDown = 0;
    }

    // prevent scrollbar clicking from affecting game
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

        if (this.options.mobile) {
            this.panelMessageTabs.focusControlIndex = -1;
        }

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
        for (let i = 0; i < 5; i++) {
            if (this.messageHistoryTimeout[i] > 0) {
                this.messageHistoryTimeout[i]--;
            }
        }
    }
}

function drawChatMessageTabsPanel() {
    if (this.messageTabSelected === 0) {
        let y = this.gameHeight - 18;

        if (this.options.mobile) {
            y = 74;
        }

        for (let i = 0; i < 5; i++) {
            if (this.messageHistoryTimeout[i] <= 0) {
                continue;
            }

            this.surface.drawString(
                this.messageHistory[i],
                7,
                y - i * 12,
                1,
                colours.yellow
            );
        }
    }

    if (this.options.mobile && this.panelMessageTabs.focusControlIndex === -1) {
        this.surface.drawString('[Tap here to chat]', 6, 88, 2, colours.white);
    }

    this.panelMessageTabs.hide(this.controlTextListChat);
    this.panelMessageTabs.hide(this.controlTextListQuest);
    this.panelMessageTabs.hide(this.controlTextListPrivate);

    if (this.messageTabSelected === 1) {
        this.panelMessageTabs.show(this.controlTextListChat);
    } else if (this.messageTabSelected === 2) {
        this.panelMessageTabs.show(this.controlTextListQuest);
    } else if (this.messageTabSelected === 3) {
        this.panelMessageTabs.show(this.controlTextListPrivate);
    }

    Panel.textListEntryHeightMod = 2;
    this.panelMessageTabs.drawPanel();
    Panel.textListEntryHeightMod = 0;
}

module.exports = {
    createMessageTabPanel,
    drawChatMessageTabs,
    handleMesssageTabsInput,
    drawChatMessageTabsPanel
};
