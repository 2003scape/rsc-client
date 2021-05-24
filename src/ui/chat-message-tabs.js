const Panel = require('../panel');
const colours = require('./_colours');

function createMessageTabPanel() {
    this.panelMessageTabs = new Panel(this.surface, 10);

    this.controlTextListChat = this.panelMessageTabs.addTextList(
        5,
        269,
        502,
        56,
        1,
        20,
        true
    );

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
    this.surface._drawSprite_from3(
        0,
        this.gameHeight - 4,
        this.spriteMedia + 23
    );

    let textColour = colours.chatPurple;

    if (this.messageTabSelected === 0) {
        textColour = colours.chatOrange;
    }

    if (this.messageTabFlashAll % 30 > 15) {
        textColour = colours.chatRed;
    }

    this.surface.drawStringCenter(
        'All messages',
        54,
        this.gameHeight + 6,
        0,
        textColour
    );

    textColour = colours.chatPurple;

    if (this.messageTabSelected === 1) {
        textColour = colours.chatOrange;
    }

    if (this.messageTabFlashHistory % 30 > 15) {
        textColour = colours.chatRed;
    }

    this.surface.drawStringCenter(
        'Chat history',
        155,
        this.gameHeight + 6,
        0,
        textColour
    );

    textColour = colours.chatPurple;

    if (this.messageTabSelected === 2) {
        textColour = colours.chatOrange;
    }

    if (this.messageTabFlashQuest % 30 > 15) {
        textColour = colours.chatRed;
    }

    this.surface.drawStringCenter(
        'Quest history',
        255,
        this.gameHeight + 6,
        0,
        textColour
    );

    textColour = colours.chatPurple;

    if (this.messageTabSelected === 3) {
        textColour = colours.chatOrange;
    }

    if (this.messageTabFlashPrivate % 30 > 15) {
        textColour = colours.chatRed;
    }

    this.surface.drawStringCenter(
        'Private history',
        355,
        this.gameHeight + 6,
        0,
        textColour
    );

    this.surface.drawStringCenter(
        'Report abuse',
        457,
        this.gameHeight + 6,
        0,
        colours.white
    );
}

module.exports = { createMessageTabPanel, drawChatMessageTabs };
