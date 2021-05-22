const GameData = require('../game-data');
const colours = require('./_colours');

const MENU_WIDTH = 245;

const SLOT_WIDTH = 49;
const SLOT_HEIGHT = 34;

const WIDTH = SLOT_WIDTH * 5;
const HEIGHT = SLOT_HEIGHT * 6;

function drawUiTabInventory(noMenus) {
    let uiX = this.gameWidth - WIDTH - 3;
    let uiY = 36;

    if (this.options.mobile) {
        uiX -= 32;
        uiY = this.gameHeight / 2 - HEIGHT / 2;
    } else {
        this.surface._drawSprite_from3(
            this.gameWidth - MENU_WIDTH - 3,
            3,
            this.spriteMedia + 1
        );
    }

    this.uiOpenX = uiX;
    this.uiOpenY = uiY;
    this.uiOpenWidth = WIDTH;
    this.uiOpenHeight = HEIGHT;

    for (let i = 0; i < this.inventoryMaxItemCount; i++) {
        const slotX = uiX + (i % 5) * SLOT_WIDTH;
        const slotY = uiY + ((i / 5) | 0) * SLOT_HEIGHT;

        if (i < this.inventoryItemsCount && this.inventoryEquipped[i] === 1) {
            this.surface.drawBoxAlpha(
                slotX,
                slotY,
                SLOT_WIDTH,
                SLOT_HEIGHT,
                colours.red,
                128
            );
        } else {
            this.surface.drawBoxAlpha(
                slotX,
                slotY,
                SLOT_WIDTH,
                SLOT_HEIGHT,
                colours.darkGrey,
                128
            );
        }

        if (i < this.inventoryItemsCount) {
            const spriteID =
                this.spriteItem + GameData.itemPicture[this.inventoryItemId[i]];

            const spriteMask = GameData.itemMask[this.inventoryItemId[i]];

            this.surface._spriteClipping_from9(
                slotX,
                slotY,
                SLOT_WIDTH,
                SLOT_HEIGHT - 2,
                spriteID,
                spriteMask,
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
    }

    // row and column lines
    for (let i = 1; i <= 4; i++) {
        this.surface.drawLineVert(
            uiX + i * SLOT_WIDTH,
            uiY,
            ((this.inventoryMaxItemCount / 5) | 0) * SLOT_HEIGHT,
            colours.black
        );
    }

    for (let i = 1; i <= ((this.inventoryMaxItemCount / 5) | 0) - 1; i++) {
        this.surface.drawLineHoriz(
            uiX,
            uiY + i * SLOT_HEIGHT,
            245,
            colours.black
        );
    }

    if (!noMenus) {
        return;
    }

    const mouseX = this.mouseX - uiX;
    const mouseY = this.mouseY - uiY;

    if (
        mouseX >= 0 &&
        mouseY >= 0 &&
        mouseX < WIDTH &&
        mouseY < ((this.inventoryMaxItemCount / 5) | 0) * SLOT_HEIGHT
    ) {
        const itemIndex =
            ((mouseX / SLOT_WIDTH) | 0) + ((mouseY / SLOT_HEIGHT) | 0) * 5;

        if (itemIndex < this.inventoryItemsCount) {
            const itemID = this.inventoryItemId[itemIndex];
            const itemName = `@lre@${GameData.itemName[itemID]}`;

            if (this.selectedSpell >= 0) {
                if (GameData.spellType[this.selectedSpell] === 3) {
                    this.menuItemText1[this.menuItemsCount] = `Cast ${
                        GameData.spellName[this.selectedSpell]
                    } on`;

                    this.menuItemText2[this.menuItemsCount] = itemName;
                    this.menuType[this.menuItemsCount] = 600;
                    this.menuIndex[this.menuItemsCount] = itemIndex;

                    this.menuSourceIndex[
                        this.menuItemsCount
                    ] = this.selectedSpell;
                    this.menuItemsCount++;

                    return;
                }
            } else {
                if (this.selectedItemInventoryIndex >= 0) {
                    this.menuItemText1[
                        this.menuItemsCount
                    ] = `Use ${this.selectedItemName} with:`;

                    this.menuItemText2[this.menuItemsCount] = itemName;
                    this.menuType[this.menuItemsCount] = 610;
                    this.menuIndex[this.menuItemsCount] = itemIndex;

                    this.menuSourceIndex[
                        this.menuItemsCount
                    ] = this.selectedItemInventoryIndex;
                    this.menuItemsCount++;

                    return;
                }

                if (this.inventoryEquipped[itemIndex] === 1) {
                    this.menuItemText1[this.menuItemsCount] = 'Remove';
                    this.menuItemText2[this.menuItemsCount] = itemName;
                    this.menuType[this.menuItemsCount] = 620;
                    this.menuIndex[this.menuItemsCount] = itemIndex;
                    this.menuItemsCount++;
                } else if (GameData.itemWearable[itemID] !== 0) {
                    if ((GameData.itemWearable[itemID] & 24) !== 0) {
                        this.menuItemText1[this.menuItemsCount] = 'Wield';
                    } else {
                        this.menuItemText1[this.menuItemsCount] = 'Wear';
                    }

                    this.menuItemText2[this.menuItemsCount] = itemName;
                    this.menuType[this.menuItemsCount] = 630;
                    this.menuIndex[this.menuItemsCount] = itemIndex;
                    this.menuItemsCount++;
                }

                if (GameData.itemCommand[itemID] !== '') {
                    this.menuItemText1[this.menuItemsCount] =
                        GameData.itemCommand[itemID];

                    this.menuItemText2[this.menuItemsCount] = itemName;
                    this.menuType[this.menuItemsCount] = 640;
                    this.menuIndex[this.menuItemsCount] = itemIndex;
                    this.menuItemsCount++;
                }

                this.menuItemText1[this.menuItemsCount] = 'Use';
                this.menuItemText2[this.menuItemsCount] = itemName;
                this.menuType[this.menuItemsCount] = 650;
                this.menuIndex[this.menuItemsCount] = itemIndex;
                this.menuItemsCount++;

                this.menuItemText1[this.menuItemsCount] = 'Drop';
                this.menuItemText2[this.menuItemsCount] = itemName;
                this.menuType[this.menuItemsCount] = 660;
                this.menuIndex[this.menuItemsCount] = itemIndex;
                this.menuItemsCount++;

                this.menuItemText1[this.menuItemsCount] = 'Examine';
                this.menuItemText2[this.menuItemsCount] = itemName;
                this.menuType[this.menuItemsCount] = 3600;
                this.menuIndex[this.menuItemsCount] = itemID;
                this.menuItemsCount++;
            }
        }
    }
}

module.exports = { drawUiTabInventory };
