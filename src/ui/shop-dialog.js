const GameData = require('../game-data');
const clientOpcodes = require('../opcodes/client');
const colours = require('./_colours');

const COINS_ID = 10;

function drawDialogShop() {
    if (this.mouseButtonClick !== 0) {
        this.mouseButtonClick = 0;

        const mouseX = this.mouseX - 52;
        const mouseY = this.mouseY - 44;

        if (mouseX >= 0 && mouseY >= 12 && mouseX < 408 && mouseY < 246) {
            let itemIndex = 0;

            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 8; col++) {
                    const slotX = 7 + col * 49;
                    const slotY = 28 + row * 34;

                    if (
                        mouseX > slotX &&
                        mouseX < slotX + 49 &&
                        mouseY > slotY &&
                        mouseY < slotY + 34 &&
                        this.shopItem[itemIndex] !== -1
                    ) {
                        this.shopSelectedItemIndex = itemIndex;
                        this.shopSelectedItemType = this.shopItem[itemIndex];
                    }

                    itemIndex++;
                }
            }

            if (this.shopSelectedItemIndex >= 0) {
                const itemID = this.shopItem[this.shopSelectedItemIndex];

                if (itemID !== -1) {
                    if (
                        this.shopItemCount[this.shopSelectedItemIndex] > 0 &&
                        mouseX > 298 &&
                        mouseY >= 204 &&
                        mouseX < 408 &&
                        mouseY <= 215
                    ) {
                        let priceMod =
                            this.shopBuyPriceMod +
                            this.shopItemPrice[this.shopSelectedItemIndex];

                        if (priceMod < 10) {
                            priceMod = 10;
                        }

                        const itemPrice =
                            ((priceMod * GameData.itemBasePrice[itemID]) /
                                100) |
                            0;

                        this.packetStream.newPacket(clientOpcodes.SHOP_BUY);

                        this.packetStream.putShort(
                            this.shopItem[this.shopSelectedItemIndex]
                        );

                        this.packetStream.putInt(itemPrice);
                        this.packetStream.sendPacket();
                    }

                    if (
                        this.getInventoryCount(itemID) > 0 &&
                        mouseX > 2 &&
                        mouseY >= 229 &&
                        mouseX < 112 &&
                        mouseY <= 240
                    ) {
                        let priceMod =
                            this.shopSellPriceMod +
                            this.shopItemPrice[this.shopSelectedItemIndex];

                        if (priceMod < 10) {
                            priceMod = 10;
                        }

                        const itemPrice =
                            ((priceMod * GameData.itemBasePrice[itemID]) /
                                100) |
                            0;

                        this.packetStream.newPacket(clientOpcodes.SHOP_SELL);

                        this.packetStream.putShort(
                            this.shopItem[this.shopSelectedItemIndex]
                        );

                        this.packetStream.putInt(itemPrice);
                        this.packetStream.sendPacket();
                    }
                }
            }
        } else {
            this.packetStream.newPacket(clientOpcodes.SHOP_CLOSE);
            this.packetStream.sendPacket();
            this.showDialogShop = false;
            return;
        }
    }

    const dialogX = 52;
    const dialogY = 44;

    this.surface.drawBox(dialogX, dialogY, 408, 12, 192);

    this.surface.drawBoxAlpha(
        dialogX,
        dialogY + 12,
        408,
        17,
        colours.grey,
        160
    );

    this.surface.drawBoxAlpha(dialogX, dialogY + 29, 8, 170, colours.grey, 160);

    this.surface.drawBoxAlpha(
        dialogX + 399,
        dialogY + 29,
        9,
        170,
        colours.grey,
        160
    );

    this.surface.drawBoxAlpha(
        dialogX,
        dialogY + 199,
        408,
        47,
        colours.grey,
        160
    );

    this.surface.drawString(
        'Buying and selling items',
        dialogX + 1,
        dialogY + 10,
        1,
        colours.white
    );

    let textColour = colours.white;

    if (
        this.mouseX > dialogX + 320 &&
        this.mouseY >= dialogY &&
        this.mouseX < dialogX + 408 &&
        this.mouseY < dialogY + 12
    ) {
        textColour = colours.red;
    }

    this.surface.drawStringRight(
        'Close window',
        dialogX + 406,
        dialogY + 10,
        1,
        textColour
    );

    this.surface.drawString(
        'Shops stock in green',
        dialogX + 2,
        dialogY + 24,
        1,
        colours.green
    );

    this.surface.drawString(
        'Number you own in blue',
        dialogX + 135,
        dialogY + 24,
        1,
        colours.cyan
    );

    this.surface.drawString(
        `Your money: ${this.getInventoryCount(COINS_ID)}gp`,
        dialogX + 280,
        dialogY + 24,
        1,
        colours.yellow
    );

    let itemIndex = 0;

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 8; col++) {
            const slotX = dialogX + 7 + col * 49;
            const slotY = dialogY + 28 + row * 34;

            if (this.shopSelectedItemIndex === itemIndex) {
                this.surface.drawBoxAlpha(
                    slotX,
                    slotY,
                    49,
                    34,
                    colours.red,
                    160
                );
            } else {
                this.surface.drawBoxAlpha(
                    slotX,
                    slotY,
                    49,
                    34,
                    colours.lightGrey2,
                    160
                );
            }

            this.surface.drawBoxEdge(slotX, slotY, 50, 35, 0);

            if (this.shopItem[itemIndex] !== -1) {
                this.surface._spriteClipping_from9(
                    slotX,
                    slotY,
                    48,
                    32,
                    this.spriteItem +
                        GameData.itemPicture[this.shopItem[itemIndex]],
                    GameData.itemMask[this.shopItem[itemIndex]],
                    0,
                    0,
                    false
                );

                this.surface.drawString(
                    this.shopItemCount[itemIndex].toString(),
                    slotX + 1,
                    slotY + 10,
                    1,
                    colours.green
                );

                this.surface.drawStringRight(
                    this.getInventoryCount(this.shopItem[itemIndex]).toString(),
                    slotX + 47,
                    slotY + 10,
                    1,
                    colours.cyan
                );
            }

            itemIndex++;
        }
    }

    this.surface.drawLineHoriz(dialogX + 5, dialogY + 222, 398, 0);

    if (this.shopSelectedItemIndex === -1) {
        this.surface.drawStringCenter(
            'Select an object to buy or sell',
            dialogX + 204,
            dialogY + 214,
            3,
            colours.yellow
        );

        return;
    }

    const selectedItemID = this.shopItem[this.shopSelectedItemIndex];

    if (selectedItemID !== -1) {
        if (this.shopItemCount[this.shopSelectedItemIndex] > 0) {
            let priceMod =
                this.shopBuyPriceMod +
                this.shopItemPrice[this.shopSelectedItemIndex];

            if (priceMod < 10) {
                priceMod = 10;
            }

            const itemPrice =
                ((priceMod * GameData.itemBasePrice[selectedItemID]) / 100) | 0;

            this.surface.drawString(
                `Buy a new ${GameData.itemName[selectedItemID]} for ` +
                    `${itemPrice}gp`,
                dialogX + 2,
                dialogY + 214,
                1,
                colours.yellow
            );

            textColour = colours.white;

            if (
                this.mouseX > dialogX + 298 &&
                this.mouseY >= dialogY + 204 &&
                this.mouseX < dialogX + 408 &&
                this.mouseY <= dialogY + 215
            ) {
                textColour = colours.red;
            }

            this.surface.drawStringRight(
                'Click here to buy',
                dialogX + 405,
                dialogY + 214,
                3,
                textColour
            );
        } else {
            this.surface.drawStringCenter(
                'This item is not currently available to buy',
                dialogX + 204,
                dialogY + 214,
                3,
                colours.yellow
            );
        }

        if (this.getInventoryCount(selectedItemID) > 0) {
            let priceMod =
                this.shopSellPriceMod +
                this.shopItemPrice[this.shopSelectedItemIndex];

            if (priceMod < 10) {
                priceMod = 10;
            }

            const itemPrice =
                ((priceMod * GameData.itemBasePrice[selectedItemID]) / 100) | 0;

            this.surface.drawStringRight(
                `Sell your ${GameData.itemName[selectedItemID]} for ` +
                    `${itemPrice}gp`,
                dialogX + 405,
                dialogY + 239,
                1,
                colours.yellow
            );

            textColour = colours.white;

            if (
                this.mouseX > dialogX + 2 &&
                this.mouseY >= dialogY + 229 &&
                this.mouseX < dialogX + 112 &&
                this.mouseY <= dialogY + 240
            ) {
                textColour = colours.red;
            }

            this.surface.drawString(
                'Click here to sell',
                dialogX + 2,
                dialogY + 239,
                3,
                textColour
            );

            return;
        }

        this.surface.drawStringCenter(
            'You do not have any of this item to sell',
            dialogX + 204,
            dialogY + 239,
            3,
            colours.yellow
        );
    }
}

module.exports = { drawDialogShop };
