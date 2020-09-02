const GameData = require('../game-data');
const clientOpcodes = require('../opcodes/client');

const BLACK = 0;
const LIGHT_GREY = 0xdcdcdc;
const WHITE = 0xffffff;
const YELLOW = 0xffff00;

const HEIGHT = 182;
const UI_X = 313;
const UI_Y = 36;
const WIDTH = 196;
const HALF_WIDTH = (WIDTH / 2) | 0;

const TABS = ['Magic', 'Prayers'];
const TAB_HEIGHT = 24;

function drawUiTabMagic(noMenus) {
    this.surface._drawSprite_from3(UI_X - 49, 3, this.spriteMedia + 4);

    this.surface.drawBoxAlpha(
        UI_X,
        UI_Y + TAB_HEIGHT,
        WIDTH,
        HEIGHT - TAB_HEIGHT,
        LIGHT_GREY,
        128
    );
    this.surface.drawLineHoriz(UI_X, UI_Y + 113, WIDTH, BLACK);
    this.surface.drawTabs(
        UI_X,
        UI_Y,
        WIDTH,
        TAB_HEIGHT,
        TABS,
        this.uiTabMagicSubTab
    );

    if (this.uiTabMagicSubTab === 0) {
        this.panelMagic.clearList(this.controlListMagic);

        const magicLevel = this.playerStatCurrent[6];

        for (let i = 0; i < GameData.spellCount; i++) {
            let colourPrefix = '@yel@';

            for (let j = 0; j < GameData.spellRunesRequired[i]; j++) {
                const runeId = GameData.spellRunesId[i][j];
                const runeAmount = GameData.spellRunesCount[i][j];

                if (this.hasInventoryItems(runeId, runeAmount)) {
                    continue;
                }

                colourPrefix = '@whi@';
                break;
            }

            if (GameData.spellLevel[i] > magicLevel) {
                colourPrefix = '@bla@';
            }

            this.panelMagic.addListEntry(
                this.controlListMagic,
                i,
                `${colourPrefix}Level ${GameData.spellLevel[i]}: ` +
                    GameData.spellName[i]
            );
        }

        this.panelMagic.drawPanel();

        const spellIndex = this.panelMagic.getListEntryIndex(
            this.controlListMagic
        );

        if (spellIndex !== -1) {
            this.surface.drawString(
                `Level ${GameData.spellLevel[spellIndex]}` +
                    `: ${GameData.spellName[spellIndex]}`,
                UI_X + 2,
                UI_Y + 124,
                1,
                YELLOW
            );
            this.surface.drawString(
                GameData.spellDescription[spellIndex],
                UI_X + 2,
                UI_Y + 136,
                0,
                WHITE
            );

            for (let i = 0; i < GameData.spellRunesRequired[spellIndex]; i++) {
                const runeId = GameData.spellRunesId[spellIndex][i];
                const inventoryRuneCount = this.getInventoryCount(runeId);
                const runeCount = GameData.spellRunesCount[spellIndex][i];
                let colourPrefix = '@red@';

                if (this.hasInventoryItems(runeId, runeCount)) {
                    colourPrefix = '@gre@';
                }

                this.surface._drawSprite_from3(
                    UI_X + 2 + i * 44,
                    UI_Y + 150,
                    this.spriteItem + GameData.itemPicture[runeId]
                );
                this.surface.drawString(
                    `${colourPrefix}${inventoryRuneCount}/${runeCount}`,
                    UI_X + 2 + i * 44,
                    UI_Y + 150,
                    1,
                    WHITE
                );
            }
        } else {
            this.surface.drawString(
                'Point at a spell for a description',
                UI_X + 2,
                UI_Y + 124,
                1,
                BLACK
            );
        }
    } else if (this.uiTabMagicSubTab === 1) {
        this.panelMagic.clearList(this.controlListMagic);

        for (let i = 0; i < GameData.prayerCount; i++) {
            let colourPrefix = '@whi@';

            if (GameData.prayerLevel[i] > this.playerStatBase[5]) {
                colourPrefix = '@bla@';
            }

            if (this.prayerOn[i]) {
                colourPrefix = '@gre@';
            }

            this.panelMagic.addListEntry(
                this.controlListMagic,
                i,
                `${colourPrefix}Level ${GameData.prayerLevel[i]}: ` +
                    GameData.prayerName[i]
            );
        }

        this.panelMagic.drawPanel();

        const prayerIndex = this.panelMagic.getListEntryIndex(
            this.controlListMagic
        );

        if (prayerIndex !== -1) {
            this.surface.drawStringCenter(
                `Level ${GameData.prayerLevel[prayerIndex]}: ` +
                    GameData.prayerName[prayerIndex],
                UI_X + HALF_WIDTH,
                UI_Y + 130,
                1,
                YELLOW
            );
            this.surface.drawStringCenter(
                GameData.prayerDescription[prayerIndex],
                UI_X + HALF_WIDTH,
                UI_Y + 145,
                0,
                WHITE
            );
            this.surface.drawStringCenter(
                'Drain rate: ' + GameData.prayerDrain[prayerIndex],
                UI_X + HALF_WIDTH,
                UI_Y + 160,
                1,
                BLACK
            );
        } else {
            this.surface.drawString(
                'Point at a prayer for a description',
                UI_X + 2,
                UI_Y + 124,
                1,
                BLACK
            );
        }
    }

    if (!noMenus) {
        return;
    }

    const mouseX = this.mouseX - UI_X;
    const mouseY = this.mouseY - UI_Y;

    if (mouseX >= 0 && mouseY >= 0 && mouseX < 196 && mouseY < 182) {
        this.panelMagic.handleMouse(
            mouseX + UI_X,
            mouseY + UI_Y,
            this.lastMouseButtonDown,
            this.mouseButtonDown,
            this.mouseScrollDelta
        );

        if (mouseY <= TAB_HEIGHT && this.mouseButtonClick === 1) {
            if (mouseX < HALF_WIDTH && this.uiTabMagicSubTab === 1) {
                this.uiTabMagicSubTab = 0;
                this.panelMagic.resetListProps(this.controlListMagic);
            } else if (mouseX > HALF_WIDTH && this.uiTabMagicSubTab === 0) {
                this.uiTabMagicSubTab = 1;
                this.panelMagic.resetListProps(this.controlListMagic);
            }
        }

        if (this.mouseButtonClick === 1 && this.uiTabMagicSubTab === 0) {
            const spellIndex = this.panelMagic.getListEntryIndex(
                this.controlListMagic
            );

            if (spellIndex !== -1) {
                const magicLevel = this.playerStatCurrent[6];

                if (GameData.spellLevel[spellIndex] > magicLevel) {
                    this.showMessage(
                        'Your magic ability is not high enough for this spell',
                        3
                    );
                } else {
                    let i = 0;

                    for (
                        i = 0;
                        i < GameData.spellRunesRequired[spellIndex];
                        i++
                    ) {
                        const reagantId = GameData.spellRunesId[spellIndex][i];

                        if (
                            this.hasInventoryItems(
                                reagantId,
                                GameData.spellRunesCount[spellIndex][i]
                            )
                        ) {
                            continue;
                        }

                        this.showMessage(
                            "You don't have all the reagents you need for " +
                                'this spell',
                            3
                        );
                        i = -1;
                        break;
                    }

                    if (i === GameData.spellRunesRequired[spellIndex]) {
                        this.selectedSpell = spellIndex;
                        this.selectedItemInventoryIndex = -1;
                    }
                }
            }
        }

        if (this.mouseButtonClick === 1 && this.uiTabMagicSubTab === 1) {
            const prayerIndex = this.panelMagic.getListEntryIndex(
                this.controlListMagic
            );

            if (prayerIndex !== -1) {
                const prayerLevel = this.playerStatBase[5];

                if (GameData.prayerLevel[prayerIndex] > prayerLevel) {
                    this.showMessage(
                        'Your prayer ability is not high enough for this ' +
                            'prayer',
                        3
                    );
                } else if (this.playerStatCurrent[5] === 0) {
                    this.showMessage(
                        'You have run out of prayer points. Return to a ' +
                            'church to recharge',
                        3
                    );
                } else if (this.prayerOn[prayerIndex]) {
                    this.packetStream.newPacket(clientOpcodes.PRAYER_OFF);
                    this.packetStream.putByte(prayerIndex);
                    this.packetStream.sendPacket();
                    this.prayerOn[prayerIndex] = false;
                    this.playSoundFile('prayeroff');
                } else {
                    this.packetStream.newPacket(clientOpcodes.PRAYER_ON);
                    this.packetStream.putByte(prayerIndex);
                    this.packetStream.sendPacket();
                    this.prayerOn[prayerIndex] = true;
                    this.playSoundFile('prayeron');
                }
            }
        }

        this.mouseButtonClick = 0;
    }
}

module.exports = {
    drawUiTabMagic,
    uiTabMagicSubTab: 0
};
