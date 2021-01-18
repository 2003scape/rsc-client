const GameData = require('../game-data');
const Utility = require('../utility');
const clientOpcodes = require('../opcodes/client');
const colours = require('./_colours');

const DIALOG_X = 22;
const DIALOG_Y = 36;

function drawDialogTradeConfirm() {
    this.surface.drawBox(DIALOG_X, DIALOG_Y, 468, 16, 192);

    this.surface.drawBoxAlpha(
        DIALOG_X,
        DIALOG_Y + 16,
        468,
        246,
        colours.grey,
        160
    );

    this.surface.drawStringCenter(
        'Please confirm your trade with @yel@' +
            Utility.hashToUsername(this.tradeRecipientConfirmHash),
        DIALOG_X + 234,
        DIALOG_Y + 12,
        1,
        colours.white
    );

    this.surface.drawStringCenter(
        'You are about to give:',
        DIALOG_X + 117,
        DIALOG_Y + 30,
        1,
        colours.yellow
    );

    for (let i = 0; i < this.tradeConfirmItemsCount; i++) {
        let itemLine = GameData.itemName[this.tradeConfirmItems[i]];

        if (GameData.itemStackable[this.tradeConfirmItems[i]] === 0) {
            itemLine +=
                ' x ' +
                Utility.formatConfirmAmount(this.tradeConfirmItemCount[i]);
        }

        this.surface.drawStringCenter(
            itemLine,
            DIALOG_X + 117,
            DIALOG_Y + 42 + i * 12,
            1,
            colours.white
        );
    }

    if (this.tradeConfirmItemsCount === 0) {
        this.surface.drawStringCenter(
            'Nothing!',
            DIALOG_X + 117,
            DIALOG_Y + 42,
            1,
            colours.white
        );
    }

    this.surface.drawStringCenter(
        'In return you will receive:',
        DIALOG_X + 351,
        DIALOG_Y + 30,
        1,
        colours.yellow
    );

    for (let i = 0; i < this.tradeRecipientConfirmItemsCount; i++) {
        let itemLine = GameData.itemName[this.tradeRecipientConfirmItems[i]];

        if (GameData.itemStackable[this.tradeRecipientConfirmItems[i]] === 0) {
            itemLine +=
                ' x ' +
                Utility.formatConfirmAmount(
                    this.tradeRecipientConfirmItemCount[i]
                );
        }

        this.surface.drawStringCenter(
            itemLine,
            DIALOG_X + 351,
            DIALOG_Y + 42 + i * 12,
            1,
            colours.white
        );
    }

    if (this.tradeRecipientConfirmItemsCount === 0) {
        this.surface.drawStringCenter(
            'Nothing!',
            DIALOG_X + 351,
            DIALOG_Y + 42,
            1,
            colours.white
        );
    }

    this.surface.drawStringCenter(
        'Are you sure you want to do this?',
        DIALOG_X + 234,
        DIALOG_Y + 200,
        4,
        colours.cyan
    );

    this.surface.drawStringCenter(
        'There is NO WAY to reverse a trade if you change your mind.',
        DIALOG_X + 234,
        DIALOG_Y + 215,
        1,
        colours.white
    );

    this.surface.drawStringCenter(
        'Remember that not all players are trustworthy',
        DIALOG_X + 234,
        DIALOG_Y + 230,
        1,
        colours.white
    );

    if (!this.tradeConfirmAccepted) {
        this.surface._drawSprite_from3(
            DIALOG_X + 118 - 35,
            DIALOG_Y + 238,
            this.spriteMedia + 25
        );

        this.surface._drawSprite_from3(
            DIALOG_X + 352 - 35,
            DIALOG_Y + 238,
            this.spriteMedia + 26
        );
    } else {
        this.surface.drawStringCenter(
            'Waiting for other player...',
            DIALOG_X + 234,
            DIALOG_Y + 250,
            1,
            colours.yellow
        );
    }

    if (this.mouseButtonClick === 1) {
        if (
            this.mouseX < DIALOG_X ||
            this.mouseY < DIALOG_Y ||
            this.mouseX > DIALOG_X + 468 ||
            this.mouseY > DIALOG_Y + 262
        ) {
            this.showDialogTradeConfirm = false;
            this.packetStream.newPacket(clientOpcodes.TRADE_DECLINE);
            this.packetStream.sendPacket();
        }

        if (
            this.mouseX >= DIALOG_X + 118 - 35 &&
            this.mouseX <= DIALOG_X + 118 + 70 &&
            this.mouseY >= DIALOG_Y + 238 &&
            this.mouseY <= DIALOG_Y + 238 + 21
        ) {
            this.tradeConfirmAccepted = true;
            this.packetStream.newPacket(clientOpcodes.TRADE_CONFIRM_ACCEPT);
            this.packetStream.sendPacket();
        }

        if (
            this.mouseX >= DIALOG_X + 352 - 35 &&
            this.mouseX <= DIALOG_X + 353 + 70 &&
            this.mouseY >= DIALOG_Y + 238 &&
            this.mouseY <= DIALOG_Y + 238 + 21
        ) {
            this.showDialogTradeConfirm = false;
            this.packetStream.newPacket(clientOpcodes.TRADE_DECLINE);
            this.packetStream.sendPacket();
        }

        this.mouseButtonClick = 0;
    }
}

module.exports = {
    drawDialogTradeConfirm,
    showDialogTradeConfirm: false
};
