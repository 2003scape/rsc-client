const GameData = require('../game-data');
const clientOpcodes = require('../opcodes/client');
const colours = require('./_colours');

const DIALOG_X = 22;
const DIALOG_Y = 36;

function drawDialogTrade() {
    if (
        this.mouseButtonClick !== 0 &&
        this.mouseButtonItemCountIncrement === 0
    ) {
        this.mouseButtonItemCountIncrement = 1;
    }

    if (this.mouseButtonItemCountIncrement > 0) {
        const mouseX = this.mouseX - 22;
        const mouseY = this.mouseY - 36;

        if (mouseX >= 0 && mouseY >= 0 && mouseX < 468 && mouseY < 262) {
            if (mouseX > 216 && mouseY > 30 && mouseX < 462 && mouseY < 235) {
                const slot =
                    (((mouseX - 217) / 49) | 0) +
                    (((mouseY - 31) / 34) | 0) * 5;

                if (slot >= 0 && slot < this.inventoryItemsCount) {
                    let sendUpdate = false;
                    let itemCountAdd = 0;

                    const itemType = this.inventoryItemId[slot];

                    for (let i = 0; i < this.tradeItemsCount; i++) {
                        if (this.tradeItems[i] === itemType) {
                            if (GameData.itemStackable[itemType] === 0) {
                                for (
                                    let j = 0;
                                    j < this.mouseButtonItemCountIncrement;
                                    j++
                                ) {
                                    if (
                                        this.tradeItemCount[i] <
                                        this.inventoryItemStackCount[slot]
                                    ) {
                                        this.tradeItemCount[i]++;
                                    }

                                    sendUpdate = true;
                                }
                            } else {
                                itemCountAdd++;
                            }
                        }
                    }

                    if (this.getInventoryCount(itemType) <= itemCountAdd) {
                        sendUpdate = true;
                    }

                    if (GameData.itemSpecial[itemType] === 1) {
                        this.showMessage(
                            'This object cannot be traded with other players',
                            3
                        );
                        sendUpdate = true;
                    }

                    if (!sendUpdate && this.tradeItemsCount < 12) {
                        this.tradeItems[this.tradeItemsCount] = itemType;
                        this.tradeItemCount[this.tradeItemsCount] = 1;
                        this.tradeItemsCount++;
                        sendUpdate = true;
                    }

                    if (sendUpdate) {
                        this.packetStream.newPacket(
                            clientOpcodes.TRADE_ITEM_UPDATE
                        );
                        this.packetStream.putByte(this.tradeItemsCount);

                        for (let j = 0; j < this.tradeItemsCount; j++) {
                            this.packetStream.putShort(this.tradeItems[j]);
                            this.packetStream.putInt(this.tradeItemCount[j]);
                        }

                        this.packetStream.sendPacket();
                        this.tradeRecipientAccepted = false;
                        this.tradeAccepted = false;
                    }
                }
            }

            if (mouseX > 8 && mouseY > 30 && mouseX < 205 && mouseY < 133) {
                const itemIndex =
                    (((mouseX - 9) / 49) | 0) + (((mouseY - 31) / 34) | 0) * 4;

                if (itemIndex >= 0 && itemIndex < this.tradeItemsCount) {
                    const itemType = this.tradeItems[itemIndex];

                    for (
                        let i = 0;
                        i < this.mouseButtonItemCountIncrement;
                        i++
                    ) {
                        if (
                            GameData.itemStackable[itemType] === 0 &&
                            this.tradeItemCount[itemIndex] > 1
                        ) {
                            this.tradeItemCount[itemIndex]--;
                            continue;
                        }
                        this.tradeItemsCount--;
                        this.mouseButtonDownTime = 0;

                        for (let j = itemIndex; j < this.tradeItemsCount; j++) {
                            this.tradeItems[j] = this.tradeItems[j + 1];
                            this.tradeItemCount[j] = this.tradeItemCount[j + 1];
                        }

                        break;
                    }

                    this.packetStream.newPacket(
                        clientOpcodes.TRADE_ITEM_UPDATE
                    );
                    this.packetStream.putByte(this.tradeItemsCount);

                    for (let i = 0; i < this.tradeItemsCount; i++) {
                        this.packetStream.putShort(this.tradeItems[i]);
                        this.packetStream.putInt(this.tradeItemCount[i]);
                    }

                    this.packetStream.sendPacket();
                    this.tradeRecipientAccepted = false;
                    this.tradeAccepted = false;
                }
            }

            if (
                mouseX >= 217 &&
                mouseY >= 238 &&
                mouseX <= 286 &&
                mouseY <= 259
            ) {
                this.tradeAccepted = true;
                this.packetStream.newPacket(clientOpcodes.TRADE_ACCEPT);
                this.packetStream.sendPacket();
            }

            if (
                mouseX >= 394 &&
                mouseY >= 238 &&
                mouseX < 463 &&
                mouseY < 259
            ) {
                this.showDialogTrade = false;
                this.packetStream.newPacket(clientOpcodes.TRADE_DECLINE);
                this.packetStream.sendPacket();
            }
        } else if (this.mouseButtonClick !== 0) {
            this.showDialogTrade = false;
            this.packetStream.newPacket(clientOpcodes.TRADE_DECLINE);
            this.packetStream.sendPacket();
        }

        this.mouseButtonClick = 0;
        this.mouseButtonItemCountIncrement = 0;
    }

    if (!this.showDialogTrade) {
        return;
    }

    this.surface.drawBox(DIALOG_X, DIALOG_Y, 468, 12, 192);

    this.surface.drawBoxAlpha(
        DIALOG_X,
        DIALOG_Y + 12,
        468,
        18,
        colours.grey,
        160
    );

    this.surface.drawBoxAlpha(
        DIALOG_X,
        DIALOG_Y + 30,
        8,
        248,
        colours.grey,
        160
    );

    this.surface.drawBoxAlpha(
        DIALOG_X + 205,
        DIALOG_Y + 30,
        11,
        248,
        colours.grey,
        160
    );

    this.surface.drawBoxAlpha(
        DIALOG_X + 462,
        DIALOG_Y + 30,
        6,
        248,
        colours.grey,
        160
    );

    this.surface.drawBoxAlpha(
        DIALOG_X + 8,
        DIALOG_Y + 133,
        197,
        22,
        colours.grey,
        160
    );

    this.surface.drawBoxAlpha(
        DIALOG_X + 8,
        DIALOG_Y + 258,
        197,
        20,
        colours.grey,
        160
    );

    this.surface.drawBoxAlpha(
        DIALOG_X + 216,
        DIALOG_Y + 235,
        246,
        43,
        colours.grey,
        160
    );

    this.surface.drawBoxAlpha(
        DIALOG_X + 8,
        DIALOG_Y + 30,
        197,
        103,
        colours.lightGrey2,
        160
    );

    this.surface.drawBoxAlpha(
        DIALOG_X + 8,
        DIALOG_Y + 155,
        197,
        103,
        colours.lightGrey2,
        160
    );

    this.surface.drawBoxAlpha(
        DIALOG_X + 216,
        DIALOG_Y + 30,
        246,
        205,
        colours.lightGrey2,
        160
    );

    for (let i = 0; i < 4; i++) {
        this.surface.drawLineHoriz(
            DIALOG_X + 8,
            DIALOG_Y + 30 + i * 34,
            197,
            colours.black
        );
    }

    for (let i = 0; i < 4; i++) {
        this.surface.drawLineHoriz(
            DIALOG_X + 8,
            DIALOG_Y + 155 + i * 34,
            197,
            colours.black
        );
    }

    for (let i = 0; i < 7; i++) {
        this.surface.drawLineHoriz(
            DIALOG_X + 216,
            DIALOG_Y + 30 + i * 34,
            246,
            colours.black
        );
    }

    for (let i = 0; i < 6; i++) {
        if (i < 5) {
            this.surface.drawLineVert(
                DIALOG_X + 8 + i * 49,
                DIALOG_Y + 30,
                103,
                colours.black
            );
            this.surface.drawLineVert(
                DIALOG_X + 8 + i * 49,
                DIALOG_Y + 155,
                103,
                colours.black
            );
        }

        this.surface.drawLineVert(
            DIALOG_X + 216 + i * 49,
            DIALOG_Y + 30,
            205,
            colours.black
        );
    }

    this.surface.drawString(
        'Trading with: ' + this.tradeRecipientName,
        DIALOG_X + 1,
        DIALOG_Y + 10,
        1,
        colours.white
    );

    this.surface.drawString(
        'Your Offer',
        DIALOG_X + 9,
        DIALOG_Y + 27,
        4,
        colours.white
    );

    this.surface.drawString(
        "Opponent's Offer",
        DIALOG_X + 9,
        DIALOG_Y + 152,
        4,
        colours.white
    );

    this.surface.drawString(
        'Your Inventory',
        DIALOG_X + 216,
        DIALOG_Y + 27,
        4,
        colours.white
    );

    if (!this.tradeAccepted) {
        this.surface._drawSprite_from3(
            DIALOG_X + 217,
            DIALOG_Y + 238,
            this.spriteMedia + 25
        );
    }

    this.surface._drawSprite_from3(
        DIALOG_X + 394,
        DIALOG_Y + 238,
        this.spriteMedia + 26
    );

    if (this.tradeRecipientAccepted) {
        this.surface.drawStringCenter(
            'Other player',
            DIALOG_X + 341,
            DIALOG_Y + 246,
            1,
            colours.white
        );

        this.surface.drawStringCenter(
            'has accepted',
            DIALOG_X + 341,
            DIALOG_Y + 256,
            1,
            colours.white
        );
    }

    if (this.tradeAccepted) {
        this.surface.drawStringCenter(
            'Waiting for',
            DIALOG_X + 217 + 35,
            DIALOG_Y + 246,
            1,
            colours.white
        );

        this.surface.drawStringCenter(
            'other player',
            DIALOG_X + 217 + 35,
            DIALOG_Y + 256,
            1,
            colours.white
        );
    }

    for (let i = 0; i < this.inventoryItemsCount; i++) {
        const slotX = 217 + DIALOG_X + (i % 5) * 49;
        const slotY = 31 + DIALOG_Y + ((i / 5) | 0) * 34;

        this.surface._spriteClipping_from9(
            slotX,
            slotY,
            48,
            32,
            this.spriteItem + GameData.itemPicture[this.inventoryItemId[i]],
            GameData.itemMask[this.inventoryItemId[i]],
            0,
            0,
            false
        );

        if (GameData.itemStackable[this.inventoryItemId[i]] === 0) {
            this.surface.drawString(
                this.inventoryItemStackCount[i].toString(),
                slotX + 1,
                slotY + 10,
                1,
                colours.yellow
            );
        }
    }

    for (let i = 0; i < this.tradeItemsCount; i++) {
        const slotX = 9 + DIALOG_X + (i % 4) * 49;
        const slotY = 31 + DIALOG_Y + ((i / 4) | 0) * 34;

        this.surface._spriteClipping_from9(
            slotX,
            slotY,
            48,
            32,
            this.spriteItem + GameData.itemPicture[this.tradeItems[i]],
            GameData.itemMask[this.tradeItems[i]],
            0,
            0,
            false
        );

        if (GameData.itemStackable[this.tradeItems[i]] === 0) {
            this.surface.drawString(
                this.tradeItemCount[i].toString(),
                slotX + 1,
                slotY + 10,
                1,
                colours.yellow
            );
        }

        if (
            this.mouseX > slotX &&
            this.mouseX < slotX + 48 &&
            this.mouseY > slotY &&
            this.mouseY < slotY + 32
        ) {
            this.surface.drawString(
                `${GameData.itemName[this.tradeItems[i]]}: @whi@` +
                    GameData.itemDescription[this.tradeItems[i]],
                DIALOG_X + 8,
                DIALOG_Y + 273,
                1,
                colours.yellow
            );
        }
    }

    for (let i = 0; i < this.tradeRecipientItemsCount; i++) {
        const slotX = 9 + DIALOG_X + (i % 4) * 49;
        const slotY = 156 + DIALOG_Y + ((i / 4) | 0) * 34;

        this.surface._spriteClipping_from9(
            slotX,
            slotY,
            48,
            32,
            this.spriteItem + GameData.itemPicture[this.tradeRecipientItems[i]],
            GameData.itemMask[this.tradeRecipientItems[i]],
            0,
            0,
            false
        );

        if (GameData.itemStackable[this.tradeRecipientItems[i]] === 0) {
            this.surface.drawString(
                this.tradeRecipientItemCount[i].toString(),
                slotX + 1,
                slotY + 10,
                1,
                colours.yellow
            );
        }

        if (
            this.mouseX > slotX &&
            this.mouseX < slotX + 48 &&
            this.mouseY > slotY &&
            this.mouseY < slotY + 32
        ) {
            this.surface.drawString(
                GameData.itemName[this.tradeRecipientItems[i]] +
                    ': @whi@' +
                    GameData.itemDescription[this.tradeRecipientItems[i]],
                DIALOG_X + 8,
                DIALOG_Y + 273,
                1,
                colours.yellow
            );
        }
    }
}

module.exports = {
    drawDialogTrade,
    showDialogTrade: false
};
