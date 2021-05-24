const Utility = require('../utility');
const colours = require('./_colours');

const MENU_WIDTH = 245;

const HEIGHT = 182;
const WIDTH = 196;
const HALF_WIDTH = (WIDTH / 2) | 0;

const TABS = ['Friends', 'Ignore'];
const TAB_HEIGHT = 24;

function drawUiTabSocial(noMenus) {
    let uiX = this.gameWidth - WIDTH - 3;
    let uiY = 36;

    if (this.options.mobile) {
        uiX = 35;
        uiY = this.gameHeight / 2 - HEIGHT / 2;
    } else {
        this.surface._drawSprite_from3(
            this.gameWidth - MENU_WIDTH - 3,
            3,
            this.spriteMedia + 5
        );
    }

    this.uiOpenX = uiX;
    this.uiOpenY = uiY;
    this.uiOpenWidth = WIDTH;
    this.uiOpenHeight = HEIGHT;

    this.surface.drawBoxAlpha(
        uiX,
        uiY + TAB_HEIGHT,
        WIDTH,
        HEIGHT - TAB_HEIGHT,
        colours.lightGrey,
        128
    );

    this.surface.drawLineHoriz(uiX, uiY + HEIGHT - 16, WIDTH, colours.black);

    this.surface.drawTabs(
        uiX,
        uiY,
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
                `${colour}${Utility.hashToUsername(this.friendListHashes[i])}` +
                    `~${uiX + 126}~@whi@Remove`
            );
        }
    } else if (this.uiTabSocialSubTab === 1) {
        for (let i = 0; i < this.ignoreListCount; i++) {
            this.panelSocialList.addListEntry(
                this.controlListSocialPlayers,
                i,
                `@yel@${Utility.hashToUsername(this.ignoreList[i])}` +
                    `~${uiX + 126}~@whi@Remove`
            );
        }
    }

    this.panelSocialList.drawPanel();

    const click = this.options.mobile ? 'Tap' : 'Click';

    if (this.uiTabSocialSubTab === 0) {
        const friendIndex = this.panelSocialList.getListEntryIndex(
            this.controlListSocialPlayers
        );

        if (friendIndex >= 0 && this.mouseX < uiX + 176) {
            const username = Utility.hashToUsername(
                this.friendListHashes[friendIndex]
            );

            if (this.mouseX > uiX + 116) {
                this.surface.drawStringCenter(
                    `${click} to remove ${username}`,
                    uiX + HALF_WIDTH,
                    uiY + 35,
                    1,
                    colours.white
                );
            } else if (this.friendListOnline[friendIndex] === 255) {
                this.surface.drawStringCenter(
                    `${click} to message ${username}`,
                    uiX + HALF_WIDTH,
                    uiY + 35,
                    1,
                    colours.white
                );
            } else if (this.friendListOnline[friendIndex] > 0) {
                if (this.friendListOnline[friendIndex] < 200) {
                    this.surface.drawStringCenter(
                        `${username} is on world ` +
                            (this.friendListOnline[friendIndex] - 9),
                        uiX + HALF_WIDTH,
                        uiY + 35,
                        1,
                        colours.white
                    );
                } else {
                    this.surface.drawStringCenter(
                        `${username} is on classic ` +
                            (this.friendListOnline[friendIndex] - 219),
                        uiX + HALF_WIDTH,
                        uiY + 35,
                        1,
                        colours.white
                    );
                }
            } else {
                this.surface.drawStringCenter(
                    `${username} is offline`,
                    uiX + HALF_WIDTH,
                    uiY + 35,
                    1,
                    colours.white
                );
            }
        } else {
            this.surface.drawStringCenter(
                `${click} a name to send a message`,
                uiX + HALF_WIDTH,
                uiY + 35,
                1,
                colours.white
            );
        }

        let textColour = colours.black;

        if (
            this.mouseX > uiX &&
            this.mouseX < uiX + WIDTH &&
            this.mouseY > uiY + HEIGHT - 16 &&
            this.mouseY < uiY + HEIGHT
        ) {
            textColour = colours.yellow;
        } else {
            textColour = colours.white;
        }

        this.surface.drawStringCenter(
            `${click} here to add a friend`,
            uiX + HALF_WIDTH,
            uiY + HEIGHT - 3,
            1,
            textColour
        );
    } else if (this.uiTabSocialSubTab === 1) {
        const ignoreIndex = this.panelSocialList.getListEntryIndex(
            this.controlListSocialPlayers
        );

        if (
            ignoreIndex >= 0 &&
            this.mouseX < uiX + 176 &&
            this.mouseX > uiX + 116
        ) {
            if (this.mouseX > uiX + 116) {
                this.surface.drawStringCenter(
                    `${click} to remove ` +
                        Utility.hashToUsername(this.ignoreList[ignoreIndex]),
                    uiX + HALF_WIDTH,
                    uiY + 35,
                    1,
                    colours.white
                );
            }
        } else {
            this.surface.drawStringCenter(
                'Blocking messages from:',
                uiX + HALF_WIDTH,
                uiY + 35,
                1,
                colours.white
            );
        }

        let textColour = colours.black;

        if (
            this.mouseX > uiX &&
            this.mouseX < uiX + WIDTH &&
            this.mouseY > uiY + HEIGHT - 16 &&
            this.mouseY < uiY + HEIGHT
        ) {
            textColour = colours.yellow;
        } else {
            textColour = colours.white;
        }

        this.surface.drawStringCenter(
            `${click} here to add a name`,
            uiX + HALF_WIDTH,
            uiY + HEIGHT - 3,
            1,
            textColour
        );
    }

    if (!noMenus) {
        return;
    }

    const mouseX = this.mouseX - uiX;
    const mouseY = this.mouseY - uiY;

    if (mouseX >= 0 && mouseY >= 0 && mouseX < WIDTH && mouseY < 182) {
        this.panelSocialList.handleMouse(
            mouseX + uiX,
            mouseY + uiY,
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

            if (friendIndex >= 0 && mouseX < 176) {
                if (mouseX > 116) {
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

            if (ignoreIndex >= 0 && mouseX < 176 && mouseX > 116) {
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
