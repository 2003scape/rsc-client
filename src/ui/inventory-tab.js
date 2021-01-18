const GameData = require('../game-data');
const colours = require('./_colours');

const UI_X = 512 - 248;
const UI_Y = 36;

function drawUiTabInventory(noMenus) {
    this.surface._drawSprite_from3(UI_X, 3, this.spriteMedia + 1);

    for (let i = 0; i < this.inventoryMaxItemCount; i++) {
        const slotX = UI_X + (i % 5) * 49;
        const slotY = 36 + ((i / 5) | 0) * 34;

        if (i < this.inventoryItemsCount && this.inventoryEquipped[i] === 1) {
            this.surface.drawBoxAlpha(slotX, slotY, 49, 34, colours.red, 128);
        } else {
            this.surface.drawBoxAlpha(
                slotX,
                slotY,
                49,
                34,
                colours.darkGrey,
                128
            );
        }

        if (i < this.inventoryItemsCount) {
            const spriteId =
                this.spriteItem + GameData.itemPicture[this.inventoryItemId[i]];
            const spriteMask = GameData.itemMask[this.inventoryItemId[i]];

            this.surface._spriteClipping_from9(
                slotX,
                slotY,
                48,
                32,
                spriteId,
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

    // rows and columns
    for (let i = 1; i <= 4; i++) {
        this.surface.drawLineVert(
            UI_X + i * 49,
            36,
            ((this.inventoryMaxItemCount / 5) | 0) * 34,
            colours.black
        );
    }

    for (let i = 1; i <= ((this.inventoryMaxItemCount / 5) | 0) - 1; i++) {
        this.surface.drawLineHoriz(UI_X, 36 + i * 34, 245, colours.black);
    }

    if (!noMenus) {
        return;
    }

    const mouseX = this.mouseX - UI_X;
    const mouseY = this.mouseY - UI_Y;

    if (
        mouseX >= 0 &&
        mouseY >= 0 &&
        mouseX < 248 &&
        mouseY < ((this.inventoryMaxItemCount / 5) | 0) * 34
    ) {
        const itemIndex = ((mouseX / 49) | 0) + ((mouseY / 34) | 0) * 5;

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
