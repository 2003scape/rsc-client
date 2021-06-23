const GameData = require('../game-data');
const clientOpcodes = require('../opcodes/client');
const colours = require('./_colours');

const WIDTH = 408;
const HEIGHT = 334;

const ITEMS_PER_PAGE = 48;
const MAGIC_DEPOSIT = 0x87654321;
const MAGIC_WITHDRAW = 0x12345678;

function drawDialogBank() {
    if (this.bankActivePage > 0 && this.bankItemCount <= ITEMS_PER_PAGE) {
        this.bankActivePage = 0;
    }

    if (this.bankActivePage > 1 && this.bankItemCount <= 96) {
        this.bankActivePage = 1;
    }

    if (this.bankActivePage > 2 && this.bankItemCount <= 144) {
        this.bankActivePage = 2;
    }

    if (
        this.bankSelectedItemSlot >= this.bankItemCount ||
        this.bankSelectedItemSlot < 0
    ) {
        this.bankSelectedItemSlot = -1;
    }

    if (
        this.bankSelectedItemSlot !== -1 &&
        this.bankItems[this.bankSelectedItemSlot] !== this.bankSelectedItem
    ) {
        this.bankSelectedItemSlot = -1;
        this.bankSelectedItem = -2;
    }

    if (this.mouseButtonClick !== 0) {
        this.mouseButtonClick = 0;

        let mouseX =
            this.mouseX - (((this.gameWidth / 2) | 0) - ((WIDTH / 2) | 0));

        let mouseY =
            this.mouseY - (((this.gameHeight / 2) | 0) - ((HEIGHT / 2) | 0));

        if (mouseX >= 0 && mouseY >= 12 && mouseX < 408 && mouseY < 280) {
            let slotIndex = this.bankActivePage * ITEMS_PER_PAGE;

            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 8; col++) {
                    const slotX = 7 + col * 49;
                    const slotY = 28 + row * 34;

                    if (
                        mouseX > slotX &&
                        mouseX < slotX + 49 &&
                        mouseY > slotY &&
                        mouseY < slotY + 34 &&
                        slotIndex < this.bankItemCount &&
                        this.bankItems[slotIndex] !== -1
                    ) {
                        this.bankSelectedItem = this.bankItems[slotIndex];
                        this.bankSelectedItemSlot = slotIndex;
                    }

                    slotIndex++;
                }
            }

            mouseX = 256 - ((WIDTH / 2) | 0);
            mouseY = 170 - ((HEIGHT / 2) | 0);

            let slot = 0;

            if (this.bankSelectedItemSlot < 0) {
                slot = -1;
            } else {
                slot = this.bankItems[this.bankSelectedItemSlot];
            }

            if (slot !== -1) {
                let itemAmount = this.bankItemsCount[this.bankSelectedItemSlot];

                if (GameData.itemStackable[slot] === 1 && itemAmount > 1) {
                    itemAmount = 1;
                }

                if (
                    itemAmount >= 1 &&
                    this.mouseX >= mouseX + 220 &&
                    this.mouseY >= mouseY + 238 &&
                    this.mouseX < mouseX + 250 &&
                    this.mouseY <= mouseY + 249
                ) {
                    this.packetStream.newPacket(clientOpcodes.BANK_WITHDRAW);
                    this.packetStream.putShort(slot);
                    this.packetStream.putShort(1);
                    this.packetStream.putInt(MAGIC_WITHDRAW);
                    this.packetStream.sendPacket();
                }

                if (
                    itemAmount >= 5 &&
                    this.mouseX >= mouseX + 250 &&
                    this.mouseY >= mouseY + 238 &&
                    this.mouseX < mouseX + 280 &&
                    this.mouseY <= mouseY + 249
                ) {
                    this.packetStream.newPacket(clientOpcodes.BANK_WITHDRAW);
                    this.packetStream.putShort(slot);
                    this.packetStream.putShort(5);
                    this.packetStream.putInt(MAGIC_WITHDRAW);
                    this.packetStream.sendPacket();
                }

                if (
                    itemAmount >= 25 &&
                    this.mouseX >= mouseX + 280 &&
                    this.mouseY >= mouseY + 238 &&
                    this.mouseX < mouseX + 305 &&
                    this.mouseY <= mouseY + 249
                ) {
                    this.packetStream.newPacket(clientOpcodes.BANK_WITHDRAW);
                    this.packetStream.putShort(slot);
                    this.packetStream.putShort(25);
                    this.packetStream.putInt(MAGIC_WITHDRAW);
                    this.packetStream.sendPacket();
                }

                if (
                    itemAmount >= 100 &&
                    this.mouseX >= mouseX + 305 &&
                    this.mouseY >= mouseY + 238 &&
                    this.mouseX < mouseX + 335 &&
                    this.mouseY <= mouseY + 249
                ) {
                    this.packetStream.newPacket(clientOpcodes.BANK_WITHDRAW);
                    this.packetStream.putShort(slot);
                    this.packetStream.putShort(100);
                    this.packetStream.putInt(MAGIC_WITHDRAW);
                    this.packetStream.sendPacket();
                }

                if (
                    itemAmount >= 500 &&
                    this.mouseX >= mouseX + 335 &&
                    this.mouseY >= mouseY + 238 &&
                    this.mouseX < mouseX + 368 &&
                    this.mouseY <= mouseY + 249
                ) {
                    this.packetStream.newPacket(clientOpcodes.BANK_WITHDRAW);
                    this.packetStream.putShort(slot);
                    this.packetStream.putShort(500);
                    this.packetStream.putInt(MAGIC_WITHDRAW);
                    this.packetStream.sendPacket();
                }

                if (
                    itemAmount >= 2500 &&
                    this.mouseX >= mouseX + 370 &&
                    this.mouseY >= mouseY + 238 &&
                    this.mouseX < mouseX + 400 &&
                    this.mouseY <= mouseY + 249
                ) {
                    this.packetStream.newPacket(clientOpcodes.BANK_WITHDRAW);
                    this.packetStream.putShort(slot);
                    this.packetStream.putShort(2500);
                    this.packetStream.putInt(MAGIC_WITHDRAW);
                    this.packetStream.sendPacket();
                }

                if (
                    this.getInventoryCount(slot) >= 1 &&
                    this.mouseX >= mouseX + 220 &&
                    this.mouseY >= mouseY + 263 &&
                    this.mouseX < mouseX + 250 &&
                    this.mouseY <= mouseY + 274
                ) {
                    this.packetStream.newPacket(clientOpcodes.BANK_DEPOSIT);
                    this.packetStream.putShort(slot);
                    this.packetStream.putShort(1);
                    this.packetStream.putInt(MAGIC_DEPOSIT);
                    this.packetStream.sendPacket();
                }

                if (
                    this.getInventoryCount(slot) >= 5 &&
                    this.mouseX >= mouseX + 250 &&
                    this.mouseY >= mouseY + 263 &&
                    this.mouseX < mouseX + 280 &&
                    this.mouseY <= mouseY + 274
                ) {
                    this.packetStream.newPacket(clientOpcodes.BANK_DEPOSIT);
                    this.packetStream.putShort(slot);
                    this.packetStream.putShort(5);
                    this.packetStream.putInt(MAGIC_DEPOSIT);
                    this.packetStream.sendPacket();
                }
                if (
                    this.getInventoryCount(slot) >= 25 &&
                    this.mouseX >= mouseX + 280 &&
                    this.mouseY >= mouseY + 263 &&
                    this.mouseX < mouseX + 305 &&
                    this.mouseY <= mouseY + 274
                ) {
                    this.packetStream.newPacket(clientOpcodes.BANK_DEPOSIT);
                    this.packetStream.putShort(slot);
                    this.packetStream.putShort(25);
                    this.packetStream.putInt(MAGIC_DEPOSIT);
                    this.packetStream.sendPacket();
                }

                if (
                    this.getInventoryCount(slot) >= 100 &&
                    this.mouseX >= mouseX + 305 &&
                    this.mouseY >= mouseY + 263 &&
                    this.mouseX < mouseX + 335 &&
                    this.mouseY <= mouseY + 274
                ) {
                    this.packetStream.newPacket(clientOpcodes.BANK_DEPOSIT);
                    this.packetStream.putShort(slot);
                    this.packetStream.putShort(100);
                    this.packetStream.putInt(MAGIC_DEPOSIT);
                    this.packetStream.sendPacket();
                }

                if (
                    this.getInventoryCount(slot) >= 500 &&
                    this.mouseX >= mouseX + 335 &&
                    this.mouseY >= mouseY + 263 &&
                    this.mouseX < mouseX + 368 &&
                    this.mouseY <= mouseY + 274
                ) {
                    this.packetStream.newPacket(clientOpcodes.BANK_DEPOSIT);
                    this.packetStream.putShort(slot);
                    this.packetStream.putShort(500);
                    this.packetStream.putInt(MAGIC_DEPOSIT);
                    this.packetStream.sendPacket();
                }

                if (
                    this.getInventoryCount(slot) >= 2500 &&
                    this.mouseX >= mouseX + 370 &&
                    this.mouseY >= mouseY + 263 &&
                    this.mouseX < mouseX + 400 &&
                    this.mouseY <= mouseY + 274
                ) {
                    this.packetStream.newPacket(clientOpcodes.BANK_DEPOSIT);
                    this.packetStream.putShort(slot);
                    this.packetStream.putShort(2500);
                    this.packetStream.putInt(MAGIC_DEPOSIT);
                    this.packetStream.sendPacket();
                }
            }
        } else if (
            this.bankItemCount > ITEMS_PER_PAGE &&
            mouseX >= 50 &&
            mouseX <= 115 &&
            mouseY <= 12
        ) {
            this.bankActivePage = 0;
        } else if (
            this.bankItemCount > ITEMS_PER_PAGE &&
            mouseX >= 115 &&
            mouseX <= 180 &&
            mouseY <= 12
        ) {
            this.bankActivePage = 1;
        } else if (
            this.bankItemCount > ITEMS_PER_PAGE * 2 &&
            mouseX >= 180 &&
            mouseX <= 245 &&
            mouseY <= 12
        ) {
            this.bankActivePage = 2;
        } else if (
            this.bankItemCount > ITEMS_PER_PAGE * 3 &&
            mouseX >= 245 &&
            mouseX <= 310 &&
            mouseY <= 12
        ) {
            this.bankActivePage = 3;
        } else {
            this.packetStream.newPacket(clientOpcodes.BANK_CLOSE);
            this.packetStream.sendPacket();
            this.showDialogBank = false;
            return;
        }
    }

    const x = ((this.gameWidth / 2) | 0) - ((WIDTH / 2) | 0);
    const y = ((this.gameHeight / 2) | 0) - ((HEIGHT / 2) | 0);

    this.surface.drawBox(x, y, 408, 12, 192);
    this.surface.drawBoxAlpha(x, y + 12, 408, 17, colours.grey, 160);
    this.surface.drawBoxAlpha(x, y + 29, 8, 204, colours.grey, 160);
    this.surface.drawBoxAlpha(x + 399, y + 29, 9, 204, colours.grey, 160);
    this.surface.drawBoxAlpha(x, y + 233, 408, 47, colours.grey, 160);
    this.surface.drawString('Bank', x + 1, y + 10, 1, colours.white);

    // TODO drawPages

    let offsetX = 50;

    if (this.bankItemCount > ITEMS_PER_PAGE) {
        let textColour = colours.white;

        if (this.bankActivePage === 0) {
            textColour = colours.red;
        } else if (
            this.mouseX > x + offsetX &&
            this.mouseY >= y &&
            this.mouseX < x + offsetX + 65 &&
            this.mouseY < y + 12
        ) {
            textColour = colours.yellow;
        }

        this.surface.drawString('<page 1>', x + offsetX, y + 10, 1, textColour);

        offsetX += 65;
        textColour = colours.white;

        if (this.bankActivePage === 1) {
            textColour = colours.red;
        } else if (
            this.mouseX > x + offsetX &&
            this.mouseY >= y &&
            this.mouseX < x + offsetX + 65 &&
            this.mouseY < y + 12
        ) {
            textColour = colours.yellow;
        }

        this.surface.drawString('<page 2>', x + offsetX, y + 10, 1, textColour);
        offsetX += 65;
    }

    if (this.bankItemCount > ITEMS_PER_PAGE * 2) {
        let textColour = colours.white;

        if (this.bankActivePage === 2) {
            textColour = colours.red;
        } else if (
            this.mouseX > x + offsetX &&
            this.mouseY >= y &&
            this.mouseX < x + offsetX + 65 &&
            this.mouseY < y + 12
        ) {
            textColour = colours.yellow;
        }

        this.surface.drawString('<page 3>', x + offsetX, y + 10, 1, textColour);
        offsetX += 65;
    }

    if (this.bankItemCount > ITEMS_PER_PAGE * 3) {
        let textColour = colours.white;

        if (this.bankActivePage === 3) {
            textColour = colours.red;
        } else if (
            this.mouseX > x + offsetX &&
            this.mouseY >= y &&
            this.mouseX < x + offsetX + 65 &&
            this.mouseY < y + 12
        ) {
            textColour = colours.yellow;
        }

        this.surface.drawString('<page 4>', x + offsetX, y + 10, 1, textColour);
        offsetX += 65;
    }

    let textColour = colours.white;

    if (
        this.mouseX > x + 320 &&
        this.mouseY >= y &&
        this.mouseX < x + 408 &&
        this.mouseY < y + 12
    ) {
        textColour = colours.red;
    }

    this.surface.drawStringRight(
        'Close window',
        x + 406,
        y + 10,
        1,
        textColour
    );

    this.surface.drawString(
        'Number in bank in green',
        x + 7,
        y + 24,
        1,
        colours.green
    );

    this.surface.drawString(
        'Number held in blue',
        x + 289,
        y + 24,
        1,
        colours.cyan
    );

    let selectedIndex = this.bankActivePage * ITEMS_PER_PAGE;

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 8; col++) {
            const slotX = x + 7 + col * 49;
            const slotY = y + 28 + row * 34;

            if (this.bankSelectedItemSlot === selectedIndex) {
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

            if (
                selectedIndex < this.bankItemCount &&
                this.bankItems[selectedIndex] !== -1
            ) {
                this.surface._spriteClipping_from9(
                    slotX,
                    slotY,
                    48,
                    32,
                    this.spriteItem +
                        GameData.itemPicture[this.bankItems[selectedIndex]],
                    GameData.itemMask[this.bankItems[selectedIndex]],
                    0,
                    0,
                    false
                );

                this.surface.drawString(
                    this.bankItemsCount[selectedIndex].toString(),
                    slotX + 1,
                    slotY + 10,
                    1,
                    colours.green
                );

                this.surface.drawStringRight(
                    this.getInventoryCount(
                        this.bankItems[selectedIndex]
                    ).toString(),
                    slotX + 47,
                    slotY + 29,
                    1,
                    colours.cyan
                );
            }

            selectedIndex++;
        }
    }

    this.surface.drawLineHoriz(x + 5, y + 256, 398, 0);

    if (this.bankSelectedItemSlot === -1) {
        this.surface.drawStringCenter(
            'Select an object to withdraw or deposit',
            x + 204,
            y + 248,
            3,
            colours.yellow
        );

        return;
    }

    let itemType = 0;

    if (this.bankSelectedItemSlot < 0) {
        itemType = -1;
    } else {
        itemType = this.bankItems[this.bankSelectedItemSlot];
    }

    if (itemType !== -1) {
        let itemCount = this.bankItemsCount[this.bankSelectedItemSlot];

        if (GameData.itemStackable[itemType] === 1 && itemCount > 1) {
            itemCount = 1;
        }

        if (itemCount > 0) {
            this.surface.drawString(
                `Withdraw ${GameData.itemName[itemType]}`,
                x + 2,
                y + 248,
                1,
                colours.white
            );

            textColour = colours.white;

            if (
                this.mouseX >= x + 220 &&
                this.mouseY >= y + 238 &&
                this.mouseX < x + 250 &&
                this.mouseY <= y + 249
            ) {
                textColour = colours.red;
            }

            this.surface.drawString('One', x + 222, y + 248, 1, textColour);

            if (itemCount >= 5) {
                textColour = colours.white;

                if (
                    this.mouseX >= x + 250 &&
                    this.mouseY >= y + 238 &&
                    this.mouseX < x + 280 &&
                    this.mouseY <= y + 249
                ) {
                    textColour = colours.red;
                }

                this.surface.drawString(
                    'Five',
                    x + 252,
                    y + 248,
                    1,
                    textColour
                );
            }

            if (itemCount >= 25) {
                textColour = colours.white;

                if (
                    this.mouseX >= x + 280 &&
                    this.mouseY >= y + 238 &&
                    this.mouseX < x + 305 &&
                    this.mouseY <= y + 249
                ) {
                    textColour = colours.red;
                }

                this.surface.drawString('25', x + 282, y + 248, 1, textColour);
            }

            if (itemCount >= 100) {
                textColour = colours.white;

                if (
                    this.mouseX >= x + 305 &&
                    this.mouseY >= y + 238 &&
                    this.mouseX < x + 335 &&
                    this.mouseY <= y + 249
                ) {
                    textColour = colours.red;
                }

                this.surface.drawString('100', x + 307, y + 248, 1, textColour);
            }

            if (itemCount >= 500) {
                textColour = colours.white;

                if (
                    this.mouseX >= x + 335 &&
                    this.mouseY >= y + 238 &&
                    this.mouseX < x + 368 &&
                    this.mouseY <= y + 249
                ) {
                    textColour = colours.red;
                }

                this.surface.drawString('500', x + 337, y + 248, 1, textColour);
            }

            if (itemCount >= 2500) {
                textColour = colours.white;

                if (
                    this.mouseX >= x + 370 &&
                    this.mouseY >= y + 238 &&
                    this.mouseX < x + 400 &&
                    this.mouseY <= y + 249
                ) {
                    textColour = colours.red;
                }

                this.surface.drawString(
                    '2500',
                    x + 370,
                    y + 248,
                    1,
                    textColour
                );
            }
        }

        if (this.getInventoryCount(itemType) > 0) {
            this.surface.drawString(
                `Deposit ${GameData.itemName[itemType]}`,
                x + 2,
                y + 273,
                1,
                colours.white
            );

            textColour = colours.white;

            if (
                this.mouseX >= x + 220 &&
                this.mouseY >= y + 263 &&
                this.mouseX < x + 250 &&
                this.mouseY <= y + 274
            ) {
                textColour = colours.red;
            }

            this.surface.drawString('One', x + 222, y + 273, 1, textColour);

            if (this.getInventoryCount(itemType) >= 5) {
                textColour = colours.white;

                if (
                    this.mouseX >= x + 250 &&
                    this.mouseY >= y + 263 &&
                    this.mouseX < x + 280 &&
                    this.mouseY <= y + 274
                ) {
                    textColour = colours.red;
                }

                this.surface.drawString(
                    'Five',
                    x + 252,
                    y + 273,
                    1,
                    textColour
                );
            }

            if (this.getInventoryCount(itemType) >= 25) {
                textColour = colours.white;

                if (
                    this.mouseX >= x + 280 &&
                    this.mouseY >= y + 263 &&
                    this.mouseX < x + 305 &&
                    this.mouseY <= y + 274
                ) {
                    textColour = colours.red;
                }

                this.surface.drawString('25', x + 282, y + 273, 1, textColour);
            }

            if (this.getInventoryCount(itemType) >= 100) {
                textColour = colours.white;

                if (
                    this.mouseX >= x + 305 &&
                    this.mouseY >= y + 263 &&
                    this.mouseX < x + 335 &&
                    this.mouseY <= y + 274
                ) {
                    textColour = colours.red;
                }

                this.surface.drawString('100', x + 307, y + 273, 1, textColour);
            }

            if (this.getInventoryCount(itemType) >= 500) {
                textColour = colours.white;

                if (
                    this.mouseX >= x + 335 &&
                    this.mouseY >= y + 263 &&
                    this.mouseX < x + 368 &&
                    this.mouseY <= y + 274
                ) {
                    textColour = colours.red;
                }

                this.surface.drawString('500', x + 337, y + 273, 1, textColour);
            }

            if (this.getInventoryCount(itemType) >= 2500) {
                textColour = colours.white;

                if (
                    this.mouseX >= x + 370 &&
                    this.mouseY >= y + 263 &&
                    this.mouseX < x + 400 &&
                    this.mouseY <= y + 274
                ) {
                    textColour = colours.red;
                }

                this.surface.drawString(
                    '2500',
                    x + 370,
                    y + 273,
                    1,
                    textColour
                );
            }
        }
    }
}

module.exports = {
    bankActivePage: 0,
    drawDialogBank
};
