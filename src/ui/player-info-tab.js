const colours = require('./_colours');

const HEIGHT = 275;
const UI_X = 313;
const UI_Y = 36;
const WIDTH = 196;

const HALF_WIDTH = (WIDTH / 2) | 0;
const TABS = ['Stats', 'Quests'];
const TAB_HEIGHT = 24;

const SHORT_SKILL_NAMES = [
    'Attack',
    'Defense',
    'Strength',
    'Hits',
    'Ranged',
    'Prayer',
    'Magic',
    'Cooking',
    'Woodcut',
    'Fletching',
    'Fishing',
    'Firemaking',
    'Crafting',
    'Smithing',
    'Mining',
    'Herblaw',
    'Agility',
    'Thieving'
];

const SKILL_NAMES = [
    'Attack',
    'Defense',
    'Strength',
    'Hits',
    'Ranged',
    'Prayer',
    'Magic',
    'Cooking',
    'Woodcutting',
    'Fletching',
    'Fishing',
    'Firemaking',
    'Crafting',
    'Smithing',
    'Mining',
    'Herblaw',
    'Agility',
    'Thieving'
];

const EQUIPMENT_STAT_NAMES = [
    'Armour',
    'WeaponAim',
    'WeaponPower',
    'Magic',
    'Prayer'
];

const EXPERIENCE_ARRAY = [];

let totalExp = 0;

for (let i = 0; i < 99; i++) {
    const level = i + 1;
    const exp = (level + 300 * Math.pow(2, level / 7)) | 0;
    totalExp += exp;
    EXPERIENCE_ARRAY[i] = totalExp & 0xffffffc;
}

const FREE_QUESTS = [
    "Black knight's fortress",
    "Cook's assistant",
    'Demon slayer',
    "Doric's quest",
    'The restless ghost',
    'Goblin diplomacy',
    'Ernest the chicken',
    'Imp catcher',
    "Pirate's treasure",
    'Prince Ali rescue',
    'Romeo & Juliet',
    'Sheep shearer',
    'Shield of Arrav',
    "The knight's sword",
    'Vampire slayer',
    "Witch's potion",
    'Dragon slayer'
];

const MEMBERS_QUESTS = [
    "Witch's house",
    'Lost city',
    "Hero's quest",
    'Druidic ritual',
    "Merlin's crystal",
    'Scorpion catcher',
    'Family crest',
    'Tribal totem',
    'Fishing contest',
    "Monk's friend",
    'Temple of Ikov',
    'Clock tower',
    'The Holy Grail',
    'Fight Arena',
    'Tree Gnome Village',
    'The Hazeel Cult',
    'Sheep Herder',
    'Plague City',
    'Sea Slug',
    'Waterfall quest',
    'Biohazard',
    'Jungle potion',
    'Grand tree',
    'Shilo village',
    'Underground pass',
    'Observatory quest',
    'Tourist trap',
    'Watchtower',
    'Dwarf Cannon',
    'Murder Mystery',
    'Digsite',
    "Gertrude's Cat",
    "Legend's Quest"
].map((questName) => `${questName} (members)`);

const QUEST_NAMES = FREE_QUESTS.concat(MEMBERS_QUESTS);

function drawUiTabPlayerInfo(noMenus) {
    this.surface._drawSprite_from3(UI_X - 49, 3, this.spriteMedia + 3);

    this.surface.drawBoxAlpha(
        UI_X,
        UI_Y + TAB_HEIGHT,
        WIDTH,
        HEIGHT - TAB_HEIGHT,
        colours.lightGrey,
        128
    );
    this.surface.drawLineHoriz(UI_X, UI_Y + TAB_HEIGHT, WIDTH, colours.black);
    this.surface.drawTabs(
        UI_X,
        UI_Y,
        WIDTH,
        TAB_HEIGHT,
        TABS,
        this.uiTabPlayerInfoSubTab
    );

    // the handler for the Stats tab
    if (this.uiTabPlayerInfoSubTab === 0) {
        let y = 72;
        let selectedSkill = -1;

        this.surface.drawString('Skills', UI_X + 5, y, 3, colours.yellow);

        y += 13;

        // draw two columns with each skill name and current/base levels
        for (let i = 0; i < 9; i++) {
            // left column
            let textColour = colours.white;

            if (
                this.mouseX > UI_X + 3 &&
                this.mouseY >= y - 11 &&
                this.mouseY < y + 2 &&
                this.mouseX < UI_X + 90
            ) {
                textColour = colours.red;
                selectedSkill = i;
            }

            this.surface.drawString(
                `${SHORT_SKILL_NAMES[i]}:@yel@${this.playerStatCurrent[i]}/` +
                    this.playerStatBase[i],
                UI_X + 5,
                y,
                1,
                textColour
            );

            // right column
            textColour = colours.white;

            if (
                this.mouseX >= UI_X + 90 &&
                this.mouseY >= y - 13 - 11 &&
                this.mouseY < y - 13 + 2 &&
                this.mouseX < UI_X + 196
            ) {
                textColour = colours.red;
                selectedSkill = i + 9;
            }

            this.surface.drawString(
                `${SHORT_SKILL_NAMES[i + 9]}:@yel@` +
                    `${this.playerStatCurrent[i + 9]}/` +
                    this.playerStatBase[i + 9],
                UI_X + HALF_WIDTH - 5,
                y - 13,
                1,
                textColour
            );

            y += 13;
        }

        this.surface.drawString(
            `Quest Points:@yel@${this.playerQuestPoints}`,
            UI_X + HALF_WIDTH - 5,
            y - 13,
            1,
            colours.white
        );

        y += 12;

        this.surface.drawString(
            `Fatigue: @yel@${((this.statFatigue * 100) / 750) | 0}%`,
            UI_X + 5,
            y - 13,
            1,
            colours.white
        );

        y += 8;

        this.surface.drawString(
            'Equipment Status',
            UI_X + 5,
            y,
            3,
            colours.yellow
        );

        y += 12;

        for (let i = 0; i < 3; i++) {
            this.surface.drawString(
                `${EQUIPMENT_STAT_NAMES[i]}:@yel@` +
                    this.playerStatEquipment[i],
                UI_X + 5,
                y,
                1,
                colours.white
            );

            if (i < 2) {
                this.surface.drawString(
                    `${EQUIPMENT_STAT_NAMES[i + 3]}:@yel@` +
                        this.playerStatEquipment[i + 3],
                    UI_X + HALF_WIDTH + 25,
                    y,
                    1,
                    colours.white
                );
            }

            y += 13;
        }

        y += 6;

        this.surface.drawLineHoriz(UI_X, y - 15, WIDTH, colours.black);

        if (selectedSkill !== -1) {
            this.surface.drawString(
                `${SKILL_NAMES[selectedSkill]} skill`,
                UI_X + 5,
                y,
                1,
                colours.yellow
            );

            y += 12;

            let nextLevelAt = EXPERIENCE_ARRAY[0];

            for (let i = 0; i < 98; i++) {
                if (
                    this.playerExperience[selectedSkill] >= EXPERIENCE_ARRAY[i]
                ) {
                    nextLevelAt = EXPERIENCE_ARRAY[i + 1];
                }
            }

            this.surface.drawString(
                'Total xp: ' + ((this.playerExperience[selectedSkill] / 4) | 0),
                UI_X + 5,
                y,
                1,
                colours.white
            );
            y += 12;
            this.surface.drawString(
                'Next level at: ' + ((nextLevelAt / 4) | 0),
                UI_X + 5,
                y,
                1,
                colours.white
            );
        } else {
            this.surface.drawString(
                'Overall levels',
                UI_X + 5,
                y,
                1,
                colours.yellow
            );
            y += 12;

            let totalLevel = 0;

            for (let i = 0; i < SKILL_NAMES.length; i++) {
                totalLevel += this.playerStatBase[i];
            }

            this.surface.drawString(
                `Skill total: ${totalLevel}`,
                UI_X + 5,
                y,
                1,
                colours.white
            );

            y += 12;

            this.surface.drawString(
                `Combat level: ${this.localPlayer.level}`,
                UI_X + 5,
                y,
                1,
                colours.white
            );

            y += 12;
        }
    } else if (this.uiTabPlayerInfoSubTab === 1) {
        // the handler for the Quests tab
        this.panelQuestList.clearList(this.controlListQuest);
        this.panelQuestList.addListEntry(
            this.controlListQuest,
            0,
            '@whi@Quest-list (green=completed)'
        );

        for (let i = 0; i < QUEST_NAMES.length; i++) {
            this.panelQuestList.addListEntry(
                this.controlListQuest,
                i + 1,
                (this.questComplete[i] ? '@gre@' : '@red@') + QUEST_NAMES[i]
            );
        }

        this.panelQuestList.drawPanel();
    }

    if (!noMenus) {
        return;
    }

    const mouseX = this.mouseX - UI_X;
    const mouseY = this.mouseY - UI_Y;

    // handle clicking of Stats and Quest tab, and the scroll wheel for the
    // quest list
    if (mouseX >= 0 && mouseY >= 0 && mouseX < WIDTH && mouseY < HEIGHT) {
        if (this.uiTabPlayerInfoSubTab === 1) {
            this.panelQuestList.handleMouse(
                mouseX + UI_X,
                mouseY + UI_Y,
                this.lastMouseButtonDown,
                this.mouseButtonDown,
                this.mouseScrollDelta
            );
        }

        if (mouseY <= TAB_HEIGHT && this.mouseButtonClick === 1) {
            if (mouseX < HALF_WIDTH) {
                this.uiTabPlayerInfoSubTab = 0;
            } else if (mouseX > HALF_WIDTH) {
                this.uiTabPlayerInfoSubTab = 1;
            }
        }
    }
}

module.exports = {
    drawUiTabPlayerInfo,
    uiTabPlayerInfoSubTab: 0
};
