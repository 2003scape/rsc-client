const Utility = require('../utility');
const colours = require('./_colours');

const HEIGHT = 182;
const UI_X = 313;
const UI_Y = 36;
const WIDTH = 196;
const HALF_WIDTH = (WIDTH / 2) | 0;

const TABS = ['Friends', 'Ignore'];
const TAB_HEIGHT = 24;

function drawUiTabSocial(noMenus) {
    this.surface._drawSprite_from3(UI_X - 49, 3, this.spriteMedia + 5);

    this.surface.drawBoxAlpha(
        UI_X,
        UI_Y + TAB_HEIGHT,
        WIDTH,
        HEIGHT - TAB_HEIGHT,
        colours.lightGrey,
        128
    );
    this.surface.drawLineHoriz(UI_X, UI_Y + HEIGHT - 16, WIDTH, colours.black);
    this.surface.drawTabs(
        UI_X,
        UI_Y,
        WIDTH,
        TAB_HEIGHT,
        TABS,
        this.uiTabSocialSubTab
    );

    this.panelSocialList.clearList(this.controlListSocialPlayers);

    if (this.uiTabSocialSubTab === 0) {
        for (let i = 0; i < this.friendListCount; i++) {
            let colour = null;

            if (this.friendListOnline[i] === 255) {
                colour = '@gre@';
            } else if (this.friendListOnline[i] > 0) {
                colour = '@yel@';
            } else {
                colour = '@red@';
            }

            this.panelSocialList.addListEntry(
                this.controlListSocialPlayers,
                i,
                colour +
                    Utility.hashToUsername(this.friendListHashes[i]) +
                    '~439~@whi@Remove         WWWWWWWWWW'
            );
        }
    } else if (this.uiTabSocialSubTab === 1) {
        for (let i = 0; i < this.ignoreListCount; i++) {
            this.panelSocialList.addListEntry(
                this.controlListSocialPlayers,
                i,
                '@yel@' +
                    Utility.hashToUsername(this.ignoreList[i]) +
                    '~439~@whi@Remove         WWWWWWWWWW'
            );
        }
    }

    this.panelSocialList.drawPanel();

    if (this.uiTabSocialSubTab === 0) {
        const friendIndex = this.panelSocialList.getListEntryIndex(
            this.controlListSocialPlayers
        );

        if (friendIndex >= 0 && this.mouseX < 489) {
            const username = Utility.hashToUsername(
                this.friendListHashes[friendIndex]
            );

            if (this.mouseX > 429) {
                this.surface.drawStringCenter(
                    `Click to remove ${username}`,
                    UI_X + HALF_WIDTH,
                    UI_Y + 35,
                    1,
                    colours.white
                );
            } else if (this.friendListOnline[friendIndex] === 255) {
                this.surface.drawStringCenter(
                    `Click to message ${username}`,
                    UI_X + HALF_WIDTH,
                    UI_Y + 35,
                    1,
                    colours.white
                );
            } else if (this.friendListOnline[friendIndex] > 0) {
                if (this.friendListOnline[friendIndex] < 200) {
                    this.surface.drawStringCenter(
                        `${username} is on world ` +
                            (this.friendListOnline[friendIndex] - 9),
                        UI_X + HALF_WIDTH,
                        UI_Y + 35,
                        1,
                        colours.white
                    );
                } else {
                    this.surface.drawStringCenter(
                        `${username} is on classic ` +
                            (this.friendListOnline[friendIndex] - 219),
                        UI_X + HALF_WIDTH,
                        UI_Y + 35,
                        1,
                        colours.white
                    );
                }
            } else {
                this.surface.drawStringCenter(
                    `${username} is offline`,
                    UI_X + HALF_WIDTH,
                    UI_Y + 35,
                    1,
                    colours.white
                );
            }
        } else {
            this.surface.drawStringCenter(
                'Click a name to send a message',
                UI_X + HALF_WIDTH,
                UI_Y + 35,
                1,
                colours.white
            );
        }

        let textColour = colours.black;

        if (
            this.mouseX > UI_X &&
            this.mouseX < UI_X + WIDTH &&
            this.mouseY > UI_Y + HEIGHT - 16 &&
            this.mouseY < UI_Y + HEIGHT
        ) {
            textColour = colours.yellow;
        } else {
            textColour = colours.white;
        }

        this.surface.drawStringCenter(
            'Click here to add a friend',
            UI_X + HALF_WIDTH,
            UI_Y + HEIGHT - 3,
            1,
            textColour
        );
    } else if (this.uiTabSocialSubTab === 1) {
        const ignoreIndex = this.panelSocialList.getListEntryIndex(
            this.controlListSocialPlayers
        );

        if (ignoreIndex >= 0 && this.mouseX < 489 && this.mouseX > 429) {
            if (this.mouseX > 429) {
                this.surface.drawStringCenter(
                    'Click to remove ' +
                        Utility.hashToUsername(this.ignoreList[ignoreIndex]),
                    UI_X + HALF_WIDTH,
                    UI_Y + 35,
                    1,
                    colours.white
                );
            }
        } else {
            this.surface.drawStringCenter(
                'Blocking messages from:',
                UI_X + HALF_WIDTH,
                UI_Y + 35,
                1,
                colours.white
            );
        }

        let textColour = colours.black;

        if (
            this.mouseX > UI_X &&
            this.mouseX < UI_X + WIDTH &&
            this.mouseY > UI_Y + HEIGHT - 16 &&
            this.mouseY < UI_Y + HEIGHT
        ) {
            textColour = colours.yellow;
        } else {
            textColour = colours.white;
        }

        this.surface.drawStringCenter(
            'Click here to add a name',
            UI_X + HALF_WIDTH,
            UI_Y + HEIGHT - 3,
            1,
            textColour
        );
    }

    if (!noMenus) {
        return;
    }

    const mouseX = this.mouseX - UI_X;
    const mouseY = this.mouseY - UI_Y;

    if (mouseX >= 0 && mouseY >= 0 && mouseX < WIDTH && mouseY < 182) {
        this.panelSocialList.handleMouse(
            mouseX + UI_X,
            mouseY + UI_Y,
            this.lastMouseButtonDown,
            this.mouseButtonDown,
            this.mouseScrollDelta
        );

        if (mouseY <= TAB_HEIGHT && this.mouseButtonClick === 1) {
            if (mouseX < HALF_WIDTH && this.uiTabSocialSubTab === 1) {
                this.uiTabSocialSubTab = 0;
                this.panelSocialList.resetListProps(
                    this.controlListSocialPlayers
                );
            } else if (mouseX > HALF_WIDTH && this.uiTabSocialSubTab === 0) {
                this.uiTabSocialSubTab = 1;
                this.panelSocialList.resetListProps(
                    this.controlListSocialPlayers
                );
            }
        }

        if (this.mouseButtonClick === 1 && this.uiTabSocialSubTab === 0) {
            const friendIndex = this.panelSocialList.getListEntryIndex(
                this.controlListSocialPlayers
            );

            if (friendIndex >= 0 && this.mouseX < 489) {
                if (this.mouseX > 429) {
                    this.friendRemove(this.friendListHashes[friendIndex]);
                } else if (this.friendListOnline[friendIndex] !== 0) {
                    this.showDialogSocialInput = 2;
                    this.privateMessageTarget = this.friendListHashes[
                        friendIndex
                    ];
                    this.inputPMCurrent = '';
                    this.inputPMFinal = '';
                }
            }
        }

        if (this.mouseButtonClick === 1 && this.uiTabSocialSubTab === 1) {
            const ignoreIndex = this.panelSocialList.getListEntryIndex(
                this.controlListSocialPlayers
            );

            if (ignoreIndex >= 0 && this.mouseX < 489 && this.mouseX > 429) {
                this.ignoreRemove(this.ignoreList[ignoreIndex]);
            }
        }

        if (mouseY > 166 && this.mouseButtonClick === 1) {
            this.inputTextCurrent = '';
            this.inputTextFinal = '';

            if (this.uiTabSocialSubTab === 0) {
                this.showDialogSocialInput = 1;
            } else if (this.uiTabSocialSubTab === 1) {
                this.showDialogSocialInput = 3;
            }
        }

        this.mouseButtonClick = 0;
    }
}

module.exports = {
    drawUiTabSocial,
    uiTabSocialSubTab: 0
};
