const ChatMessage = require('./chat-message');
const Color = require('./lib/graphics/color');
const Font = require('./lib/graphics/font');
const GameBuffer = require('./game-buffer');
const GameCharacter = require('./game-character');
const GameConnection = require('./game-connection');
const GameData = require('./game-data');
const GameModel = require('./game-model');
const Long = require('long');
const Panel = require('./panel');
const Scene = require('./scene');
const StreamAudioPlayer = require('./stream-audio-player');
const Surface = require('./surface');
const Utility = require('./utility');
const WordFilter = require('./word-filter');
const World = require('./world');
const applyUIComponents = require('./ui');
const clientOpcodes = require('./opcodes/client');
const serverOpcodes = require('./opcodes/server');
const version = require('./version');

const ZOOM_MIN = 450;
const ZOOM_MAX = 1250;
const ZOOM_INDOORS = 550;
const ZOOM_OUTDOORS = 750;

const MENU_MAX_SIZE = 250;
const PATH_STEPS_MAX = 8000;
const PLAYERS_MAX = 500;
const NPCS_MAX = 500;
const WALL_OBJECTS_MAX = 500;
const PLAYERS_SERVER_MAX = 4000;
const GROUND_ITEMS_MAX = 5000;
const NPCS_SERVER_MAX = 5000;
const OBJECTS_MAX = 1500;
const PLAYER_STAT_COUNT = 18;
const QUEST_COUNT = 50;
const PLAYER_STAT_EQUIPMENT_COUNT = 5;

const ANIMATED_MODELS = [
    'torcha2', 'torcha3', 'torcha4', 'skulltorcha2', 'skulltorcha3',
    'skulltorcha4', 'firea2', 'firea3', 'fireplacea2', 'fireplacea3',
    'firespell2', 'firespell3', 'lightning2', 'lightning3', 'clawspell2',
    'clawspell3', 'clawspell4', 'clawspell5', 'spellcharge2', 'spellcharge3'
];

function fromCharArray(a) {
    return Array.from(a).map(c => String.fromCharCode(c)).join('');
}

class mudclient extends GameConnection {
    constructor(canvas) {
        super(canvas);

        applyUIComponents(this);

        this.localRegionX = 0;
        this.localRegionY = 0;
        this.controlTextListChat = 0;
        this.controlTextListAll = 0;
        this.controlTextListQuest = 0;
        this.controlTextListPrivate = 0;
        this.messageTabSelected = 0;
        this.mouseClickXX = 0;
        this.mouseClickXY = 0;
        this.privateMessageTarget = new Long(0);
        this.controlListQuest = 0;
        this.controlListMagic = 0;
        this.packetErrorCount = 0;
        this.mouseButtonDownTime = 0;
        this.mouseButtonItemCountIncrement = 0;
        this.animationIndex = 0;
        this.cameraRotationX = 0;
        this.tradeConfirmAccepted = false;
        this.appearanceHeadType = 0;
        this.appearanceSkinColour = 0;
        this.anInt707 = 0;
        this.deathScreenTimeout = 0;
        this.cameraRotationY = 0;
        this.welcomeUnreadMessages = 0;
        this.controlButtonAppearanceHead1 = 0;
        this.controlButtonAppearanceHead2 = 0;
        this.controlButtonAppearanceHair1 = 0;
        this.controlButtonAppearanceHair2 = 0;
        this.controlButtonAppearanceGender1 = 0;
        this.controlButtonAppearanceGender2 = 0;
        this.controlButtonAppearanceTop1 = 0;
        this.controlButtonAppearanceTop2 = 0;
        this.controlButtonAppearanceSkin1 = 0;
        this.controlButtonAppearanceSkin2 = 0;
        this.controlButtonAppearanceBottom1 = 0;
        this.controlButtonAppearanceBottom2 = 0;
        this.controlButtonAppearanceAccept = 0;
        this.logoutTimeout = 0;
        this.tradeRecipientConfirmHash = new Long(0);
        this.loginTimer = 0;
        this.npcCombatModelArray1 = new Int32Array([0, 1, 2, 1, 0, 0, 0, 0]);
        this.npcCombatModelArray2 = new Int32Array([0, 0, 0, 0, 0, 1, 2, 1]);
        this.systemUpdate = 0;
        this.graphics = null;
        this.regionX = 0;
        this.regionY = 0;
        this.welcomScreenAlreadyShown = false;
        this.mouseButtonClick = 0;
        this.healthBarCount = 0;
        this.spriteMedia = 0;
        this.spriteUtil = 0;
        this.spriteItem = 0;
        this.spriteProjectile = 0;
        this.spriteTexture = 0;
        this.spriteTextureWorld = 0;
        this.spriteLogo = 0;
        this.teleportBubbleCount = 0;
        this.mouseClickCount = 0;
        this.shopSellPriceMod = 0;
        this.shopBuyPriceMod = 0;
        this.duelOptionRetreat = 0;
        this.duelOptionMagic = 0;
        this.duelOptionPrayer = 0;
        this.duelOptionWeapons = 0;
        this.groundItemCount = 0;
        this.receivedMessagesCount = 0;
        this.messageTabFlashAll = 0;
        this.messageTabFlashHistory = 0;
        this.messageTabFlashQuest = 0;
        this.messageTabFlashPrivate = 0;
        this.bankItemCount = 0;
        this.objectAnimationNumberFireLightningSpell = 0;
        this.objectAnimationNumberTorch = 0;
        this.objectAnimationNumberClaw = 0;
        this.loggedIn = 0;
        this.npcCount = 0;
        this.npcCacheCount = 0;
        this.objectAnimationCount = 0;
        this.tradeConfirmItemsCount = 0;
        this.mouseClickXStep = 0;
        this.newBankItemCount = 0;
        // the orders of the NPC animation slots at different angles
        this.npcAnimationArray = [
            new Int32Array([11, 2, 9, 7, 1, 6, 10, 0, 5, 8, 3, 4]),
            new Int32Array([11, 2, 9, 7, 1, 6, 10, 0, 5, 8, 3, 4]),
            new Int32Array([11, 3, 2, 9, 7, 1, 6, 10, 0, 5, 8, 4]),
            new Int32Array([3, 4, 2, 9, 7, 1, 6, 10, 8, 11, 0, 5]),
            new Int32Array([3, 4, 2, 9, 7, 1, 6, 10, 8, 11, 0, 5]),
            new Int32Array([4, 3, 2, 9, 7, 1, 6, 10, 8, 11, 0, 5]),
            new Int32Array([11, 4, 2, 9, 7, 1, 6, 10, 0, 5, 8, 3]),
            new Int32Array([11, 2, 9, 7, 1, 6, 10, 0, 5, 8, 4, 3])];
        this.npcWalkModel = new Int32Array([0, 1, 2, 1]);
        this.referID = 0;
        this.controlRegisterStatus = 0;
        this.combatTimeout = 0;
        this.optionMenuCount = 0;
        this.errorLoadingCodebase = false;
        this.cameraRotationTime = 0;
        this.duelOpponentItemsCount = 0;
        this.duelItemsCount = 0;
        this.characterSkinColours = new Int32Array([
            0xecded0, 0xccb366, 0xb38c40, 0x997326, 0x906020
        ]);
        this.duelOfferOpponentItemCount = 0;
        this.characterTopBottomColours = new Int32Array([
            0xff0000, 0xff8000, 0xffe000, 0xa0e000, 0x00e000,
            0x008000, 0x00a080, 0x00b0ff, 0x0080ff, 0x0030f0,
            0xe000e0, 0x303030, 0x604000, 0x805000, 0xffffff
        ]);
        this.itemsAboveHeadCount = 0;
        this.selectedItemInventoryIndex = 0;
        this.statFatigue = 0;
        this.fatigueSleeping = 0;
        this.tradeRecipientConfirmItemsCount = 0;
        this.tradeRecipientItemsCount = 0;
        this.showDialogServerMessage = false;
        this.menuX = 0;
        this.menuY = 0;
        this.menuWidth = 0;
        this.menuHeight = 0;
        this.menuItemsCount = 0;
        this.showUiTab = 0;
        this.tradeItemsCount = 0;
        this.planeWidth = 0;
        this.planeHeight = 0;
        this.planeMultiplier = 0;
        this.playerQuestPoints = 0;
        this.characterHairColours = new Int32Array([
            0xffc030, 0xffa040, 0x805030, 0x604020, 0x303030, 0xff6020, 0xff4000, 0xffffff, 65280, 65535
        ]);
        this.bankActivePage = 0;
        this.welcomeLastLoggedInDays = 0;
        this.inventoryItemsCount = 0;
        this.duelOpponentNameHash = new Long(0);
        this.minimapRandom1 = 0;
        this.minimapRandom2 = 0;
        this.objectCount = 0;
        this.duelOfferItemCount = 0;
        this.objectCount = 0;
        this.duelOfferItemCount = 0;
        this.cameraAutoRotatePlayerX = 0;
        this.cameraAutoRotatePlayerY = 0;
        this.playerCount = 0;
        this.knownPlayerCount = 0;
        this.spriteCount = 0;
        this.wallObjectCount = 0;
        this.welcomeRecoverySetDays = 0;
        this.localLowerX = 0;
        this.localLowerY = 0;
        this.localUpperX = 0;
        this.localUpperY = 0;
        this.world = null;
        this.welcomeLastLoggedInIP = 0;
        this.sleepWordDelayTimer = 0;

        this.menuIndices = new Int32Array(MENU_MAX_SIZE);
        this.cameraAutoAngleDebug = false;
        this.wallObjectDirection = new Int32Array(WALL_OBJECTS_MAX);
        this.wallObjectId = new Int32Array(WALL_OBJECTS_MAX);
        this.cameraRotationXIncrement = 2;
        this.inventoryMaxItemCount = 30;
        this.bankItemsMax = 48;
        this.optionMenuEntry = [];
        this.optionMenuEntry.length = 5;
        this.optionMenuEntry.fill(null);
        this.newBankItems = new Int32Array(256);
        this.newBankItemsCount = new Int32Array(256);
        this.teleportBubbleTime = new Int32Array(50);
        this.tradeConfirmAccepted = false;
        this.receivedMessageX = new Int32Array(50);
        this.receivedMessageY = new Int32Array(50);
        this.receivedMessageMidPoint = new Int32Array(50);
        this.receivedMessageHeight = new Int32Array(50);
        this.localPlayer = new GameCharacter();
        this.localPlayerServerIndex = -1;
        this.menuItemX = new Int32Array(MENU_MAX_SIZE);
        this.menuItemY = new Int32Array(MENU_MAX_SIZE);
        this.bankItems = new Int32Array(256);
        this.bankItemsCount = new Int32Array(256);
        this.appearanceBodyGender = 1;
        this.appearance2Colour = 2;
        this.appearanceHairColour = 2;
        this.appearanceTopColour = 8;
        this.appearanceBottomColour = 14;
        this.appearanceHeadGender = 1;
        this.loginUser = '';
        this.loginPass = '';
        this.cameraAngle = 1;
        this.members = false;
        this.optionSoundDisabled = false;
        this.showRightClickMenu = false;
        this.cameraRotationYIncrement = 2;
        this.objectAlreadyInMenu = new Int8Array(OBJECTS_MAX);
        this.menuItemText1 = [];
        this.menuItemText1.length = MENU_MAX_SIZE;
        this.menuItemText1.fill(null);
        this.duelOpponentName = '';
        this.lastObjectAnimationNumberFireLightningSpell = -1;
        this.lastObjectAnimationNumberTorch = -1;
        this.lastObjectAnimationNumberClaw = -1;
        this.planeIndex = -1;
        this.welcomScreenAlreadyShown = false;
        this.isSleeping = false;
        this.cameraRotation = 128;
        this.teleportBubbleX = new Int32Array(50);
        this.errorLoadingData = false;
        this.playerExperience = new Int32Array(PLAYER_STAT_COUNT);
        this.tradeRecipientAccepted = false;
        this.tradeAccepted = false;
        this.mouseClickXHistory = new Int32Array(8192);
        this.mouseClickYHistory = new Int32Array(8192);
        this.playerServerIndexes = new Int32Array(PLAYERS_MAX);
        this.teleportBubbleY = new Int32Array(50);
        this.receivedMessages = [];
        this.receivedMessages.length = 50;
        this.receivedMessages.fill(null);
        this.showDialogDuelConfirm = false;
        this.duelAccepted = false;
        this.players = [];
        this.players.length = PLAYERS_MAX;
        this.players.fill(null);
        this.prayerOn = new Int8Array(50);
        this.menuIndex = new Int32Array(MENU_MAX_SIZE);
        this.menuSourceIndex = new Int32Array(MENU_MAX_SIZE);
        this.menuTargetIndex = new Int32Array(MENU_MAX_SIZE);
        this.wallObjectAlreadyInMenu = new Int8Array(WALL_OBJECTS_MAX);
        this.magicLoc = 128;
        this.errorLoadingMemory = false;
        this.fogOfWar = false;
        this.gameWidth = 512;
        this.gameHeight = 334;
        this.const_9 = 9;
        this.tradeConfirmItems = new Int32Array(14);
        this.tradeConfirmItemCount = new Int32Array(14);
        this.tradeRecipientName = '';
        this.selectedSpell = -1;
        this.showOptionMenu = false;
        this.playerStatCurrent = new Int32Array(PLAYER_STAT_COUNT);
        this.teleportBubbleType = new Int32Array(50);
        this.errorLoadingCodebase = false;
        this.showDialogShop = false;
        this.shopItem = new Int32Array(256);
        this.shopItemCount = new Int32Array(256);
        this.shopItemPrice = new Int32Array(256);
        this.duelOfferOpponentAccepted = false;
        this.duelOfferAccepted = false;
        this.gameModels = [];
        this.gameModels.length = 1000;
        this.gameModels.fill(null);
        this.showDialogDuel = false;
        this.serverMessage = '';
        this.serverMessageBoxTop = false;
        this.duelOpponentItems = new Int32Array(8);
        this.duelOpponentItemCount = new Int32Array(8);
        this.duelItems = new Int32Array(8);
        this.duelItemCount = new Int32Array(8);
        this.playerStatBase = new Int32Array(PLAYER_STAT_COUNT);
        this.npcsCache = [];
        this.npcsCache.length = NPCS_MAX;
        this.npcsCache.fill(null);
        this.groundItemX = new Int32Array(GROUND_ITEMS_MAX);
        this.groundItemY = new Int32Array(GROUND_ITEMS_MAX);
        this.groundItemId = new Int32Array(GROUND_ITEMS_MAX);
        this.groundItemZ = new Int32Array(GROUND_ITEMS_MAX);
        this.bankSelectedItemSlot = -1;
        this.bankSelectedItem = -2;
        this.duelOfferOpponentItemId = new Int32Array(8);
        this.duelOfferOpponentItemStack = new Int32Array(8);
        this.messageHistoryTimeout = new Int32Array(5);
        this.optionCameraModeAuto = true;
        this.objectX = new Int32Array(OBJECTS_MAX);
        this.objectY = new Int32Array(OBJECTS_MAX);
        this.objectId = new Int32Array(OBJECTS_MAX);
        this.objectDirection = new Int32Array(OBJECTS_MAX);
        this.selectedItemInventoryIndex = -1;
        this.selectedItemName = '';
        this.loadingArea = false;
        this.tradeRecipientConfirmItems = new Int32Array(14);
        this.tradeRecipientConfirmItemCount = new Int32Array(14);
        this.tradeRecipientItems = new Int32Array(14);
        this.tradeRecipientItemCount = new Int32Array(14);
        this.showDialogServerMessage = false;
        this.menuType = new Int32Array(MENU_MAX_SIZE);
        this.questComplete = new Int8Array(QUEST_COUNT);
        this.wallObjectModel = [];
        this.wallObjectModel.length = WALL_OBJECTS_MAX;
        this.wallObjectModel.fill(null);
        this.actionBubbleX = new Int32Array(50);
        this.actionBubbleY = new Int32Array(50);
        this.cameraZoom = ZOOM_INDOORS; // 400-1250
        this.tradeItems = new Int32Array(14);
        this.tradeItemCount = new Int32Array(14);
        this.lastHeightOffset = -1;
        this.duelSettingsRetreat = false;
        this.duelSettingsMagic = false;
        this.duelSettingsPrayer = false;
        this.duelSettingsWeapons = false;
        this.showDialogBank = false;
        this.loginUserDesc = '';
        this.loginUserDisp = '';
        this.optionMouseButtonOne = false;
        this.inventoryItemId = new Int32Array(35);
        this.inventoryItemStackCount = new Int32Array(35);
        this.inventoryEquipped = new Int32Array(35);
        this.knownPlayers = [];
        this.knownPlayers.length = PLAYERS_MAX;
        this.knownPlayers.fill(null);
        this.messageHistory = [];
        this.messageHistory.length = 5;
        this.messageHistory.fill(null);
        this.duelOfferItemId = new Int32Array(8);
        this.duelOfferItemStack = new Int32Array(8);
        this.actionBubbleScale = new Int32Array(50);
        this.actionBubbleItem = new Int32Array(50);
        this.sleepWordDelay = true;
        this.showAppearanceChange = false;
        this.shopSelectedItemIndex = -1;
        this.shopSelectedItemType = -2;
        this.projectileMaxRange = 40;
        this.npcs = [];
        this.npcs.length = NPCS_MAX;
        this.npcs.fill(null);
        this.experienceArray = new Int32Array(99);
        this.healthBarX = new Int32Array(50);
        this.healthBarY = new Int32Array(50);
        this.healthBarMissing = new Int32Array(50);
        this.playerServer = [];
        this.playerServer.length = PLAYERS_SERVER_MAX;
        this.playerServer.fill(null);
        this.walkPathX = new Int32Array(PATH_STEPS_MAX);
        this.walkPathY = new Int32Array(PATH_STEPS_MAX);
        this.wallObjectX = new Int32Array(WALL_OBJECTS_MAX);
        this.wallObjectY = new Int32Array(WALL_OBJECTS_MAX);
        this.menuItemText2 = [];
        this.menuItemText2.length = MENU_MAX_SIZE;
        this.menuItemText2.fill(null);
        this.npcsServer = [];
        this.npcsServer.length = NPCS_SERVER_MAX;
        this.npcsServer.fill(null);
        this.playerStatEquipment = new Int32Array(PLAYER_STAT_EQUIPMENT_COUNT);
        this.objectModel = [];
        this.objectModel.length = OBJECTS_MAX;
        this.objectModel.fill(null);
    }

    playSoundFile(soundName) {
        if (!this.audioPlayer || this.optionSoundDisabled) {
            return;
        }

        const fileName = `${soundName}.pcm`;
        this.audioPlayer.writeStream(this.soundData,
            Utility.getDataFileOffset(fileName, this.soundData),
            Utility.getDataFileLength(fileName, this.soundData));
    }

    _walkToActionSource_from8(startX, startY, x1, y1, x2, y2, checkObjects, walkToAction) {
        let steps = this.world.route(startX, startY, x1, y1, x2, y2, this.walkPathX, this.walkPathY, checkObjects);

        if (steps === -1) {
            if (walkToAction) {
                steps = 1;
                this.walkPathX[0] = x1;
                this.walkPathY[0] = y1;
            } else {
                return false;
            }
        }

        steps--;
        startX = this.walkPathX[steps];
        startY = this.walkPathY[steps];
        steps--;

        if (walkToAction) {
            this.packetStream.newPacket(clientOpcodes.WALK_ACTION);
        } else {
            this.packetStream.newPacket(clientOpcodes.WALK);
        }

        this.packetStream.putShort(startX + this.regionX);
        this.packetStream.putShort(startY + this.regionY);

        if (walkToAction && steps === -1 && (startX + this.regionX) % 5 === 0) {
            steps = 0;
        }

        for (let l1 = steps; l1 >= 0 && l1 > steps - 25; l1--) {
            this.packetStream.putByte(this.walkPathX[l1] - startX);
            this.packetStream.putByte(this.walkPathY[l1] - startY);
        }

        this.packetStream.sendPacket();

        this.mouseClickXStep = -24;
        this.mouseClickXX = this.mouseX;
        this.mouseClickXY = this.mouseY;

        return true;
    }

    walkTo(startX, startY, x1, y1, x2, y2, checkObjects, walkToAction) {
        let steps = this.world.route(startX, startY, x1, y1, x2, y2, this.walkPathX, this.walkPathY, checkObjects);

        if (steps === -1) {
            return false;
        }

        steps--;
        startX = this.walkPathX[steps];
        startY = this.walkPathY[steps];
        steps--;

        if (walkToAction) {
            this.packetStream.newPacket(clientOpcodes.WALK_ACTION);
        } else {
            this.packetStream.newPacket(clientOpcodes.WALK);
        }

        this.packetStream.putShort(startX + this.regionX);
        this.packetStream.putShort(startY + this.regionY);

        if (walkToAction && steps === -1 && (startX + this.regionX) % 5 === 0) {
            steps = 0;
        }

        for (let l1 = steps; l1 >= 0 && l1 > steps - 25; l1--) {
            this.packetStream.putByte(this.walkPathX[l1] - startX);
            this.packetStream.putByte(this.walkPathY[l1] - startY);
        }

        this.packetStream.sendPacket();

        this.mouseClickXStep = -24;
        this.mouseClickXX = this.mouseX;
        this.mouseClickXY = this.mouseY;

        return true;
    }

    updateBankItems() {
        this.bankItemCount = this.newBankItemCount;

        for (let i = 0; i < this.newBankItemCount; i++) {
            this.bankItems[i] = this.newBankItems[i];
            this.bankItemsCount[i] = this.newBankItemsCount[i];
        }

        for (let invIdx = 0; invIdx < this.inventoryItemsCount; invIdx++) {
            if (this.bankItemCount >= this.bankItemsMax) {
                break;
            }

            let invId = this.inventoryItemId[invIdx];
            let hasItemInInv = false;

            for (let bankidx = 0; bankidx < this.bankItemCount; bankidx++) {
                if (this.bankItems[bankidx] !== invId) {
                    continue;
                }

                hasItemInInv = true;
                break;
            }

            if (!hasItemInInv) {
                this.bankItems[this.bankItemCount] = invId;
                this.bankItemsCount[this.bankItemCount] = 0;
                this.bankItemCount++;
            }
        }
    }

    drawAboveHeadStuff() {
        for (let i = 0; i < this.receivedMessagesCount; i++) {
            let txtHeight = this.surface.textHeight(1);
            let x = this.receivedMessageX[i];
            let y = this.receivedMessageY[i];
            let mId = this.receivedMessageMidPoint[i];
            let msgHeight = this.receivedMessageHeight[i];
            let flag = true;

            while (flag) {
                flag = false;

                for (let j = 0; j < i; j++) {
                    if (y + msgHeight > this.receivedMessageY[j] - txtHeight && y - txtHeight < this.receivedMessageY[j] + this.receivedMessageHeight[j] && x - mId < this.receivedMessageX[j] + this.receivedMessageMidPoint[j] && x + mId > this.receivedMessageX[j] - this.receivedMessageMidPoint[j] && this.receivedMessageY[j] - txtHeight - msgHeight < y) {
                        y = this.receivedMessageY[j] - txtHeight - msgHeight;
                        flag = true;
                    }
                }
            }

            this.receivedMessageY[i] = y;
            this.surface.drawParagraph(this.receivedMessages[i], x, y, 1, 0xffff00, 300);
        }

        for (let i = 0; i < this.itemsAboveHeadCount; i++) {
            let x = this.actionBubbleX[i];
            let y = this.actionBubbleY[i];
            let scale = this.actionBubbleScale[i];
            let id = this.actionBubbleItem[i];
            let scaleX = ((39 * scale) / 100) | 0;
            let scaleY = ((27 * scale) / 100) | 0;

            this.surface.drawActionBubble(x - ((scaleX / 2) | 0), y - scaleY, scaleX, scaleY, this.spriteMedia + 9, 85);

            let scaleXClip = ((36 * scale) / 100) | 0;
            let scaleYClip = ((24 * scale) / 100) | 0;

            this.surface._spriteClipping_from9(x - ((scaleXClip / 2) | 0), (y - scaleY + ((scaleY / 2) | 0)) - ((scaleYClip / 2) | 0), scaleXClip, scaleYClip, GameData.itemPicture[id] + this.spriteItem, GameData.itemMask[id], 0, 0, false);
        }

        for (let i = 0; i < this.healthBarCount; i++) {
            let x = this.healthBarX[i];
            let y = this.healthBarY[i];
            let missing = this.healthBarMissing[i];

            this.surface.drawBoxAlpha(x - 15, y - 3, missing, 5, 65280, 192);
            this.surface.drawBoxAlpha((x - 15) + missing, y - 3, 30 - missing,
                5, 0xff0000, 192);
        }
    }

    _walkToActionSource_from5(sx, sy, dx, dy, action) {
        this._walkToActionSource_from8(sx, sy, dx, dy, dx, dy, false, action);
    }

    createMessageTabPanel() {
        this.panelMessageTabs = new Panel(this.surface, 10);
        this.controlTextListChat = this.panelMessageTabs.addTextList(5, 269, 502, 56, 1, 20, true);
        this.controlTextListAll = this.panelMessageTabs.addTextListInput(7, 324, 498, 14, 1, 80, false, true);
        this.controlTextListQuest = this.panelMessageTabs.addTextList(5, 269, 502, 56, 1, 20, true);
        this.controlTextListPrivate = this.panelMessageTabs.addTextList(5, 269, 502, 56, 1, 20, true);
        this.panelMessageTabs.setFocus(this.controlTextListAll);
    }

    disposeAndCollect() {
        if (this.surface !== null) {
            this.surface.clear();
            this.surface.pixels = null;
            this.surface = null;
        }

        if (this.scene !== null) {
            this.scene.dispose();
            this.scene = null;
        }

        this.gameModels = null;
        this.objectModel = null;
        this.wallObjectModel = null;
        this.playerServer = null;
        this.players = null;
        this.npcsServer = null;
        this.npcs = null;
        this.localPlayer = null;

        if (this.world !== null) {
            this.world.terrainModels = null;
            this.world.wallModels = null;
            this.world.roofModels = null;
            this.world.parentModel = null;
            this.world = null;
        }
    }

    drawUi() {
        if (this.logoutTimeout !== 0) {
            this.drawDialogLogout();
        } else if (this.showDialogWelcome) {
            this.drawDialogWelcome();
        } else if (this.showDialogServerMessage) {
            this.drawDialogServerMessage();
        } else if (this.showUiWildWarn === 1) {
            this.drawDialogWildWarn();
        } else if (this.showDialogBank && this.combatTimeout === 0) {
            this.drawDialogBank();
        } else if (this.showDialogShop && this.combatTimeout === 0) {
            this.drawDialogShop();
        } else if (this.showDialogTradeConfirm) {
            this.drawDialogTradeConfirm();
        } else if (this.showDialogTrade) {
            this.drawDialogTrade();
        } else if (this.showDialogDuelConfirm) {
            this.drawDialogDuelConfirm();
        } else if (this.showDialogDuel) {
            this.drawDialogDuel();
        } else if (this.showDialogReportAbuseStep === 1) {
            this.drawDialogReportAbuse();
        } else if (this.showDialogReportAbuseStep === 2) {
            this.drawDialogReportAbuseInput();
        } else if (this.showDialogSocialInput !== 0) {
            this.drawDialogSocialInput();
        } else {
            if (this.showOptionMenu) {
                this.drawOptionMenu();
            }

            if (this.localPlayer.animationCurrent === 8 ||
                this.localPlayer.animationCurrent === 9) {
                this.drawDialogCombatStyle();
            }

            this.setActiveUiTab();

            const noMenus = !this.showOptionMenu && !this.showRightClickMenu;

            if (noMenus) {
                this.menuItemsCount = 0;
            }

            if (this.showUiTab === 0 && noMenus) {
                this.createRightClickMenu();
            }

            if (this.showUiTab === 1) {
                this.drawUiTabInventory(noMenus);
            } else if (this.showUiTab === 2) {
                this.drawUiTabMinimap(noMenus);
            } else if (this.showUiTab === 3) {
                this.drawUiTabPlayerInfo(noMenus);
            } else if (this.showUiTab === 4) {
                this.drawUiTabMagic(noMenus);
            } else if (this.showUiTab === 5) {
                this.drawUiTabSocial(noMenus);
            } else if (this.showUiTab === 6) {
                this.drawUiTabOptions(noMenus);
            }

            if (!this.showRightClickMenu && !this.showOptionMenu) {
                this.createTopMouseMenu();
            }

            if (this.showRightClickMenu && !this.showOptionMenu) {
                this.drawRightClickMenu();
            }
        }

        this.mouseButtonClick = 0;
    }

    resetGame() {
        this.systemUpdate = 0;
        this.combatStyle = 0;
        this.logoutTimeout = 0;
        this.loginScreen = 0;
        this.loggedIn = 1;

        this.resetPMText();
        this.surface.blackScreen();
        this.surface.draw(this.graphics, 0, 0);

        for (let i = 0; i < this.objectCount; i++) {
            this.scene.removeModel(this.objectModel[i]);
            this.world.removeObject(this.objectX[i], this.objectY[i], this.objectId[i]);
        }

        for (let i = 0; i < this.wallObjectCount; i++) {
            this.scene.removeModel(this.wallObjectModel[i]);
            this.world.removeWallObject(this.wallObjectX[i], this.wallObjectY[i], this.wallObjectDirection[i], this.wallObjectId[i]);
        }

        this.objectCount = 0;
        this.wallObjectCount = 0;
        this.groundItemCount = 0;
        this.playerCount = 0;

        for (let i = 0; i < PLAYERS_SERVER_MAX; i++) {
            this.playerServer[i] = null;
        }

        for (let l = 0; l < PLAYERS_MAX; l++) {
            this.players[l] = null;
        }

        this.npcCount = 0;

        for (let i1 = 0; i1 < NPCS_SERVER_MAX; i1++) {
            this.npcsServer[i1] = null;
        }

        for (let j1 = 0; j1 < NPCS_MAX; j1++) {
            this.npcs[j1] = null;
        }

        for (let k1 = 0; k1 < 50; k1++) {
            this.prayerOn[k1] = false;
        }

        this.mouseButtonClick = 0;
        this.lastMouseButtonDown = 0;
        this.mouseButtonDown = 0;
        this.showDialogShop = false;
        this.showDialogBank = false;
        this.isSleeping = false;
        this.friendListCount = 0;
    }

    handleKeyPress(i) {
        if (this.loggedIn === 0) {
            if (this.loginScreen === 0 && this.panelLoginWelcome !== null) {
                this.panelLoginWelcome.keyPress(i);
            }

            if (this.loginScreen === 1 && this.panelLoginNewUser !== null) {
                this.panelLoginNewUser.keyPress(i);
            }

            if (this.loginScreen === 2 && this.panelLoginExistingUser !== null) {
                this.panelLoginExistingUser.keyPress(i);
            }
        }

        if (this.loggedIn === 1) {
            if (this.showAppearanceChange && this.panelAppearance !== null) {
                this.panelAppearance.keyPress(i);
                return;
            }

            if (this.showDialogSocialInput === 0 && this.showDialogReportAbuseStep === 0 && !this.isSleeping && this.panelMessageTabs !== null) {
                this.panelMessageTabs.keyPress(i);
            }
        }
    }

    sendLogout() {
        if (this.loggedIn === 0) {
            return;
        }

        if (this.combatTimeout > 450) {
            this.showMessage('@cya@You can\'t logout during combat!', 3);
            return;
        }

        if (this.combatTimeout > 0) {
            this.showMessage('@cya@You can\'t logout for 10 seconds after combat', 3);
            return;
        } else {
            this.packetStream.newPacket(clientOpcodes.LOGOUT);
            this.packetStream.sendPacket();
            this.logoutTimeout = 1000;
            return;
        }
    }

    createPlayer(serverIndex, x, y, anim) {
        if (this.playerServer[serverIndex] === null) {
            this.playerServer[serverIndex] = new GameCharacter();
            this.playerServer[serverIndex].serverIndex = serverIndex;
            this.playerServer[serverIndex].serverId = 0;
        }

        let character = this.playerServer[serverIndex];
        let flag = false;

        for (let i1 = 0; i1 < this.knownPlayerCount; i1++) {
            if (this.knownPlayers[i1].serverIndex !== serverIndex) {
                continue;
            }

            flag = true;
            break;
        }

        if (flag) {
            character.animationNext = anim;
            let j1 = character.waypointCurrent;

            if (x !== character.waypointsX[j1] || y !== character.waypointsY[j1]) {
                character.waypointCurrent = j1 = (j1 + 1) % 10;
                character.waypointsX[j1] = x;
                character.waypointsY[j1] = y;
            }
        } else {
            character.serverIndex = serverIndex;
            character.movingStep = 0;
            character.waypointCurrent = 0;
            character.waypointsX[0] = character.currentX = x;
            character.waypointsY[0] = character.currentY = y;
            character.animationNext = character.animationCurrent = anim;
            character.stepCount = 0;
        }

        this.players[this.playerCount++] = character;

        return character;
    }

    createAppearancePanel() {
        this.panelAppearance = new Panel(this.surface, 100);
        this.panelAppearance.addText(256, 10, 'Please design Your Character', 4, true);

        let x = 140;
        let y = 34;

        x += 116;
        y -= 10;

        this.panelAppearance.addText(x - 55, y + 110, 'Front', 3, true);
        this.panelAppearance.addText(x, y + 110, 'Side', 3, true);
        this.panelAppearance.addText(x + 55, y + 110, 'Back', 3, true);

        let xOff = 54;

        y += 145;

        this.panelAppearance.addBoxRounded(x - xOff, y, 53, 41);
        this.panelAppearance.addText(x - xOff, y - 8, 'Head', 1, true);
        this.panelAppearance.addText(x - xOff, y + 8, 'Type', 1, true);
        this.panelAppearance.addSprite(x - xOff - 40, y, Panel.baseSpriteStart + 7);
        this.controlButtonAppearanceHead1 = this.panelAppearance.addButton(x - xOff - 40, y, 20, 20);
        this.panelAppearance.addSprite((x - xOff) + 40, y, Panel.baseSpriteStart + 6);
        this.controlButtonAppearanceHead2 = this.panelAppearance.addButton((x - xOff) + 40, y, 20, 20);
        this.panelAppearance.addBoxRounded(x + xOff, y, 53, 41);
        this.panelAppearance.addText(x + xOff, y - 8, 'Hair', 1, true);
        this.panelAppearance.addText(x + xOff, y + 8, 'Color', 1, true);
        this.panelAppearance.addSprite((x + xOff) - 40, y, Panel.baseSpriteStart + 7);
        this.controlButtonAppearanceHair1 = this.panelAppearance.addButton((x + xOff) - 40, y, 20, 20);
        this.panelAppearance.addSprite(x + xOff + 40, y, Panel.baseSpriteStart + 6);
        this.controlButtonAppearanceHair2 = this.panelAppearance.addButton(x + xOff + 40, y, 20, 20);
        y += 50;
        this.panelAppearance.addBoxRounded(x - xOff, y, 53, 41);
        this.panelAppearance.addText(x - xOff, y, 'Gender', 1, true);
        this.panelAppearance.addSprite(x - xOff - 40, y, Panel.baseSpriteStart + 7);
        this.controlButtonAppearanceGender1 = this.panelAppearance.addButton(x - xOff - 40, y, 20, 20);
        this.panelAppearance.addSprite((x - xOff) + 40, y, Panel.baseSpriteStart + 6);
        this.controlButtonAppearanceGender2 = this.panelAppearance.addButton((x - xOff) + 40, y, 20, 20);
        this.panelAppearance.addBoxRounded(x + xOff, y, 53, 41);
        this.panelAppearance.addText(x + xOff, y - 8, 'Top', 1, true);
        this.panelAppearance.addText(x + xOff, y + 8, 'Color', 1, true);
        this.panelAppearance.addSprite((x + xOff) - 40, y, Panel.baseSpriteStart + 7);
        this.controlButtonAppearanceTop1 = this.panelAppearance.addButton((x + xOff) - 40, y, 20, 20);
        this.panelAppearance.addSprite(x + xOff + 40, y, Panel.baseSpriteStart + 6);
        this.controlButtonAppearanceTop2 = this.panelAppearance.addButton(x + xOff + 40, y, 20, 20);
        y += 50;
        this.panelAppearance.addBoxRounded(x - xOff, y, 53, 41);
        this.panelAppearance.addText(x - xOff, y - 8, 'Skin', 1, true);
        this.panelAppearance.addText(x - xOff, y + 8, 'Color', 1, true);
        this.panelAppearance.addSprite(x - xOff - 40, y, Panel.baseSpriteStart + 7);
        this.controlButtonAppearanceSkin1 = this.panelAppearance.addButton(x - xOff - 40, y, 20, 20);
        this.panelAppearance.addSprite((x - xOff) + 40, y, Panel.baseSpriteStart + 6);
        this.controlButtonAppearanceSkin2 = this.panelAppearance.addButton((x - xOff) + 40, y, 20, 20);
        this.panelAppearance.addBoxRounded(x + xOff, y, 53, 41);
        this.panelAppearance.addText(x + xOff, y - 8, 'Bottom', 1, true);
        this.panelAppearance.addText(x + xOff, y + 8, 'Color', 1, true);
        this.panelAppearance.addSprite((x + xOff) - 40, y, Panel.baseSpriteStart + 7);
        this.controlButtonAppearanceBottom1 = this.panelAppearance.addButton((x + xOff) - 40, y, 20, 20);
        this.panelAppearance.addSprite(x + xOff + 40, y, Panel.baseSpriteStart + 6);
        this.controlButtonAppearanceBottom2 = this.panelAppearance.addButton(x + xOff + 40, y, 20, 20);
        y += 82;
        y -= 35;
        this.panelAppearance.addButtonBackground(x, y, 200, 30);
        this.panelAppearance.addText(x, y, 'Accept', 4, false);
        this.controlButtonAppearanceAccept = this.panelAppearance.addButton(x, y, 200, 30);
    }

    drawAppearancePanelCharacterSprites() {
        this.surface.interlace = false;
        this.surface.blackScreen();
        this.panelAppearance.drawPanel();
        let i = 140;
        let j = 50;
        i += 116;
        j -= 25;
        this.surface._spriteClipping_from6(i - 32 - 55, j, 64, 102, GameData.animationNumber[this.appearance2Colour], this.characterTopBottomColours[this.appearanceBottomColour]);
        this.surface._spriteClipping_from9(i - 32 - 55, j, 64, 102, GameData.animationNumber[this.appearanceBodyGender], this.characterTopBottomColours[this.appearanceTopColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from9(i - 32 - 55, j, 64, 102, GameData.animationNumber[this.appearanceHeadType], this.characterHairColours[this.appearanceHairColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from6(i - 32, j, 64, 102, GameData.animationNumber[this.appearance2Colour] + 6, this.characterTopBottomColours[this.appearanceBottomColour]);
        this.surface._spriteClipping_from9(i - 32, j, 64, 102, GameData.animationNumber[this.appearanceBodyGender] + 6, this.characterTopBottomColours[this.appearanceTopColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from9(i - 32, j, 64, 102, GameData.animationNumber[this.appearanceHeadType] + 6, this.characterHairColours[this.appearanceHairColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from6((i - 32) + 55, j, 64, 102, GameData.animationNumber[this.appearance2Colour] + 12, this.characterTopBottomColours[this.appearanceBottomColour]);
        this.surface._spriteClipping_from9((i - 32) + 55, j, 64, 102, GameData.animationNumber[this.appearanceBodyGender] + 12, this.characterTopBottomColours[this.appearanceTopColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from9((i - 32) + 55, j, 64, 102, GameData.animationNumber[this.appearanceHeadType] + 12, this.characterHairColours[this.appearanceHairColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._drawSprite_from3(0, this.gameHeight, this.spriteMedia + 22);
        this.surface.draw(this.graphics, 0, 0);
    }

    drawItem(x, y, w, h, id) {
        let picture = GameData.itemPicture[id] + this.spriteItem;
        let mask = GameData.itemMask[id];
        this.surface._spriteClipping_from9(x, y, w, h, picture, mask, 0, 0,
            false);
    }

    async handleGameInput() {
        if (this.systemUpdate > 1) {
            this.systemUpdate--;
        }

        await this.checkConnection();

        if (this.logoutTimeout > 0) {
            this.logoutTimeout--;
        }

        if (this.mouseActionTimeout > 4500 && this.combatTimeout === 0 && this.logoutTimeout === 0) {
            this.mouseActionTimeout -= 500;
            this.sendLogout();
            return;
        }

        if (this.localPlayer.animationCurrent === 8 || this.localPlayer.animationCurrent === 9) {
            this.combatTimeout = 500;
        }

        if (this.combatTimeout > 0) {
            this.combatTimeout--;
        }

        if (this.showAppearanceChange) {
            this.handleAppearancePanelControls();
            return;
        }

        for (let i = 0; i < this.playerCount; i++) {
            let character = this.players[i];

            // TODO figure out why this is happening
            if (!character) {
                console.log('null character at ', i, this.playerCount);
                return;
            }

            let k = (character.waypointCurrent + 1) % 10;

            if (character.movingStep !== k) {
                let i1 = -1;
                let l2 = character.movingStep;
                let j4;

                if (l2 < k) {
                    j4 = k - l2;
                } else {
                    j4 = (10 + k) - l2;
                }

                let j5 = 4;

                if (j4 > 2) {
                    j5 = (j4 - 1) * 4;
                }

                if (character.waypointsX[l2] - character.currentX > this.magicLoc * 3 || character.waypointsY[l2] - character.currentY > this.magicLoc * 3 || character.waypointsX[l2] - character.currentX < -this.magicLoc * 3 || character.waypointsY[l2] - character.currentY < -this.magicLoc * 3 || j4 > 8) {
                    character.currentX = character.waypointsX[l2];
                    character.currentY = character.waypointsY[l2];
                } else {
                    if (character.currentX < character.waypointsX[l2]) {
                        character.currentX += j5;
                        character.stepCount++;
                        i1 = 2;
                    } else if (character.currentX > character.waypointsX[l2]) {
                        character.currentX -= j5;
                        character.stepCount++;
                        i1 = 6;
                    }

                    if (character.currentX - character.waypointsX[l2] < j5 && character.currentX - character.waypointsX[l2] > -j5) {
                        character.currentX = character.waypointsX[l2];
                    }

                    if (character.currentY < character.waypointsY[l2]) {
                        character.currentY += j5;
                        character.stepCount++;

                        if (i1 === -1) {
                            i1 = 4;
                        } else if (i1 === 2) {
                            i1 = 3;
                        } else {
                            i1 = 5;
                        }
                    } else if (character.currentY > character.waypointsY[l2]) {
                        character.currentY -= j5;
                        character.stepCount++;

                        if (i1 === -1) {
                            i1 = 0;
                        } else if (i1 === 2) {
                            i1 = 1;
                        } else {
                            i1 = 7;
                        }
                    }

                    if (character.currentY - character.waypointsY[l2] < j5 && character.currentY - character.waypointsY[l2] > -j5) {
                        character.currentY = character.waypointsY[l2];
                    }
                }

                if (i1 !== -1) {
                    character.animationCurrent = i1;
                }

                if (character.currentX === character.waypointsX[l2] && character.currentY === character.waypointsY[l2]) {
                    character.movingStep = (l2 + 1) % 10;
                }
            } else {
                character.animationCurrent = character.animationNext;
            }

            if (character.messageTimeout > 0) {
                character.messageTimeout--;
            }

            if (character.bubbleTimeout > 0) {
                character.bubbleTimeout--;
            }

            if (character.combatTimer > 0) {
                character.combatTimer--;
            }

            if (this.deathScreenTimeout > 0) {
                this.deathScreenTimeout--;

                if (this.deathScreenTimeout === 0) {
                    this.showMessage('You have been granted another life. Be more careful this time!', 3);
                }

                if (this.deathScreenTimeout === 0) {
                    this.showMessage('You retain your skills. Your objects land where you died', 3);
                }
            }
        }

        for (let j = 0; j < this.npcCount; j++) {
            let character_1 = this.npcs[j];
            let j1 = (character_1.waypointCurrent + 1) % 10;

            if (character_1.movingStep !== j1) {
                let i3 = -1;
                let k4 = character_1.movingStep;
                let k5;

                if (k4 < j1) {
                    k5 = j1 - k4;
                } else {
                    k5 = (10 + j1) - k4;
                }

                let l5 = 4;

                if (k5 > 2) {
                    l5 = (k5 - 1) * 4;
                }

                if (character_1.waypointsX[k4] - character_1.currentX > this.magicLoc * 3 || character_1.waypointsY[k4] - character_1.currentY > this.magicLoc * 3 || character_1.waypointsX[k4] - character_1.currentX < -this.magicLoc * 3 || character_1.waypointsY[k4] - character_1.currentY < -this.magicLoc * 3 || k5 > 8) {
                    character_1.currentX = character_1.waypointsX[k4];
                    character_1.currentY = character_1.waypointsY[k4];
                } else {
                    if (character_1.currentX < character_1.waypointsX[k4]) {
                        character_1.currentX += l5;
                        character_1.stepCount++;
                        i3 = 2;
                    } else if (character_1.currentX > character_1.waypointsX[k4]) {
                        character_1.currentX -= l5;
                        character_1.stepCount++;
                        i3 = 6;
                    }

                    if (character_1.currentX - character_1.waypointsX[k4] < l5 && character_1.currentX - character_1.waypointsX[k4] > -l5) {
                        character_1.currentX = character_1.waypointsX[k4];
                    }

                    if (character_1.currentY < character_1.waypointsY[k4]) {
                        character_1.currentY += l5;
                        character_1.stepCount++;

                        if (i3 === -1) {
                            i3 = 4;
                        } else if (i3 === 2) {
                            i3 = 3;
                        } else {
                            i3 = 5;
                        }
                    } else if (character_1.currentY > character_1.waypointsY[k4]) {
                        character_1.currentY -= l5;
                        character_1.stepCount++;

                        if (i3 === -1) {
                            i3 = 0;
                        } else if (i3 === 2) {
                            i3 = 1;
                        } else {
                            i3 = 7;
                        }
                    }

                    if (character_1.currentY - character_1.waypointsY[k4] < l5 && character_1.currentY - character_1.waypointsY[k4] > -l5) {
                        character_1.currentY = character_1.waypointsY[k4];
                    }
                }

                if (i3 !== -1) {
                    character_1.animationCurrent = i3;
                }

                if (character_1.currentX === character_1.waypointsX[k4] && character_1.currentY === character_1.waypointsY[k4]) {
                    character_1.movingStep = (k4 + 1) % 10;
                }
            } else {
                character_1.animationCurrent = character_1.animationNext;

                if (character_1.npcId === 43) {
                    character_1.stepCount++;
                }
            }

            if (character_1.messageTimeout > 0) {
                character_1.messageTimeout--;
            }

            if (character_1.bubbleTimeout > 0) {
                character_1.bubbleTimeout--;
            }

            if (character_1.combatTimer > 0) {
                character_1.combatTimer--;
            }
        }

        if (this.showUiTab !== 2) {
            if (Surface.anInt346 > 0) {
                this.sleepWordDelayTimer++;
            }

            if (Surface.anInt347 > 0) {
                this.sleepWordDelayTimer = 0;
            }

            Surface.anInt346 = 0;
            Surface.anInt347 = 0;
        }

        for (let l = 0; l < this.playerCount; l++) {
            let character = this.players[l];

            if (character.projectileRange > 0) {
                character.projectileRange--;
            }
        }

        if (this.cameraAutoAngleDebug) {
            if (this.cameraAutoRotatePlayerX - this.localPlayer.currentX < -500 || this.cameraAutoRotatePlayerX - this.localPlayer.currentX > 500 || this.cameraAutoRotatePlayerY - this.localPlayer.currentY < -500 || this.cameraAutoRotatePlayerY - this.localPlayer.currentY > 500) {
                this.cameraAutoRotatePlayerX = this.localPlayer.currentX;
                this.cameraAutoRotatePlayerY = this.localPlayer.currentY;
            }
        } else {
            if (this.cameraAutoRotatePlayerX - this.localPlayer.currentX < -500 || this.cameraAutoRotatePlayerX - this.localPlayer.currentX > 500 || this.cameraAutoRotatePlayerY - this.localPlayer.currentY < -500 || this.cameraAutoRotatePlayerY - this.localPlayer.currentY > 500) {
                this.cameraAutoRotatePlayerX = this.localPlayer.currentX;
                this.cameraAutoRotatePlayerY = this.localPlayer.currentY;
            }

            if (this.cameraAutoRotatePlayerX !== this.localPlayer.currentX) {
                this.cameraAutoRotatePlayerX += ((this.localPlayer.currentX - this.cameraAutoRotatePlayerX) / (16 + (((this.cameraZoom - 500) / 15) | 0))) | 0;
            }

            if (this.cameraAutoRotatePlayerY !== this.localPlayer.currentY) {
                this.cameraAutoRotatePlayerY += ((this.localPlayer.currentY - this.cameraAutoRotatePlayerY) / (16 + (((this.cameraZoom - 500) / 15) | 0))) | 0;
            }

            if (this.optionCameraModeAuto) {
                let k1 = this.cameraAngle * 32;
                let j3 = k1 - this.cameraRotation;
                let byte0 = 1;

                if (j3 !== 0) {
                    this.anInt707++;

                    if (j3 > 128) {
                        byte0 = -1;
                        j3 = 256 - j3;
                    } else if (j3 > 0)
                        byte0 = 1;
                    else if (j3 < -128) {
                        byte0 = 1;
                        j3 = 256 + j3;
                    } else if (j3 < 0) {
                        byte0 = -1;
                        j3 = -j3;
                    }

                    this.cameraRotation += (((this.anInt707 * j3 + 255) / 256) | 0) * byte0;
                    this.cameraRotation &= 0xff;
                } else {
                    this.anInt707 = 0;
                }
            }
        }

        if (this.sleepWordDelayTimer > 20) {
            this.sleepWordDelay = false;
            this.sleepWordDelayTimer = 0;
        }

        if (this.isSleeping) {
            if (this.inputTextFinal.length > 0) {
                if (/^::lostcon$/i.test(this.inputTextFinal)) {
                    this.packetStream.closeStream();
                } else if (/^::closecon$/.test(this.inputTextFinal)) {
                    this.closeConnection();
                } else {
                    this.packetStream.newPacket(clientOpcodes.SLEEP_WORD);
                    this.packetStream.putString(this.inputTextFinal);

                    if (!this.sleepWordDelay) {
                        this.packetStream.putByte(0);
                        this.sleepWordDelay = true;
                    }

                    this.packetStream.sendPacket();
                    this.inputTextCurrent = '';
                    this.inputTextFinal = '';
                    this.sleepingStatusText = 'Please wait...';
                }
            }

            if (this.lastMouseButtonDown === 1 && this.mouseY > 275 && this.mouseY < 310 && this.mouseX > 56 && this.mouseX < 456) {
                this.packetStream.newPacket(clientOpcodes.SLEEP_WORD);
                this.packetStream.putString('-null-');

                if (!this.sleepWordDelay) {
                    this.packetStream.putByte(0);
                    this.sleepWordDelay = true;
                }

                this.packetStream.sendPacket();
                this.inputTextCurrent = '';
                this.inputTextFinal = '';
                this.sleepingStatusText = 'Please wait...';
            }

            this.lastMouseButtonDown = 0;
            return;
        }

        if (this.mouseY > this.gameHeight - 4) {
            if (this.mouseX > 15 && this.mouseX < 96 && this.lastMouseButtonDown === 1) {
                this.messageTabSelected = 0;
            }

            if (this.mouseX > 110 && this.mouseX < 194 && this.lastMouseButtonDown === 1) {
                this.messageTabSelected = 1;
                this.panelMessageTabs.controlFlashText[this.controlTextListChat] = 999999;
            }

            if (this.mouseX > 215 && this.mouseX < 295 && this.lastMouseButtonDown === 1) {
                this.messageTabSelected = 2;
                this.panelMessageTabs.controlFlashText[this.controlTextListQuest] = 999999;
            }

            if (this.mouseX > 315 && this.mouseX < 395 && this.lastMouseButtonDown === 1) {
                this.messageTabSelected = 3;
                this.panelMessageTabs.controlFlashText[this.controlTextListPrivate] = 999999;
            }

            if (this.mouseX > 417 && this.mouseX < 497 && this.lastMouseButtonDown === 1) {
                this.showDialogReportAbuseStep = 1;
                this.reportAbuseOffence = 0;
                this.inputTextCurrent = '';
                this.inputTextFinal = '';
            }

            this.lastMouseButtonDown = 0;
            this.mouseButtonDown = 0;
        }

        this.panelMessageTabs.handleMouse(this.mouseX, this.mouseY, this.lastMouseButtonDown, this.mouseButtonDown, this.mouseScrollDelta);

        if (this.messageTabSelected > 0 && this.mouseX >= 494 && this.mouseY >= this.gameHeight - 66) {
            this.lastMouseButtonDown = 0;
        }

        if (this.panelMessageTabs.isClicked(this.controlTextListAll)) {
            let s = this.panelMessageTabs.getText(this.controlTextListAll);
            this.panelMessageTabs.updateText(this.controlTextListAll, '');

            if (/^::/.test(s)) {
                if (/^::closecon$/i.test(s)) {
                    this.packetStream.closeStream();
                } else if (/^::logout/i.test(s)) {
                    this.closeConnection();
                } else if (/^::lostcon$/i.test(s)) {
                    await this.lostConnection();
                } else {
                    this.sendCommandString(s.substring(2));
                }
            } else {
                let k3 = ChatMessage.scramble(s);
                this.sendChatMessage(ChatMessage.scrambledBytes, k3);
                s = ChatMessage.descramble(ChatMessage.scrambledBytes, 0, k3);
                s = WordFilter.filter(s);
                this.localPlayer.messageTimeout = 150;
                this.localPlayer.message = s;
                this.showMessage(this.localPlayer.name + ': ' + s, 2);
            }
        }

        if (this.messageTabSelected === 0) {
            for (let l1 = 0; l1 < 5; l1++) {
                if (this.messageHistoryTimeout[l1] > 0) {
                    this.messageHistoryTimeout[l1]--;
                }
            }
        }

        if (this.deathScreenTimeout !== 0) {
            this.lastMouseButtonDown = 0;
        }

        if (this.showDialogTrade || this.showDialogDuel) {
            if (this.mouseButtonDown !== 0) {
                this.mouseButtonDownTime++;
            } else {
                this.mouseButtonDownTime = 0;
            }

            if (this.mouseButtonDownTime > 600) {
                this.mouseButtonItemCountIncrement += 5000;
            } else if (this.mouseButtonDownTime > 450) {
                this.mouseButtonItemCountIncrement += 500;
            } else if (this.mouseButtonDownTime > 300) {
                this.mouseButtonItemCountIncrement += 50;
            } else if (this.mouseButtonDownTime > 150) {
                this.mouseButtonItemCountIncrement += 5;
            } else if (this.mouseButtonDownTime > 50) {
                this.mouseButtonItemCountIncrement++;
            } else if (this.mouseButtonDownTime > 20 && (this.mouseButtonDownTime & 5) === 0) {
                this.mouseButtonItemCountIncrement++;
            }
        } else {
            this.mouseButtonDownTime = 0;
            this.mouseButtonItemCountIncrement = 0;
        }

        if (this.lastMouseButtonDown === 1) {
            this.mouseButtonClick = 1;
        } else if (this.lastMouseButtonDown === 2) {
            this.mouseButtonClick = 2;
        }

        this.scene.setMouseLoc(this.mouseX, this.mouseY);
        this.lastMouseButtonDown = 0;

        if (this.optionCameraModeAuto) {
            if (this.anInt707 === 0 || this.cameraAutoAngleDebug) {
                if (this.keyLeft) {
                    this.cameraAngle = this.cameraAngle + 1 & 7;
                    this.keyLeft = false;

                    if (!this.fogOfWar) {
                        if ((this.cameraAngle & 1) === 0) {
                            this.cameraAngle = this.cameraAngle + 1 & 7;
                        }

                        for (let i2 = 0; i2 < 8; i2++) {
                            if (this.isValidCameraAngle(this.cameraAngle)) {
                                break;
                            }

                            this.cameraAngle = this.cameraAngle + 1 & 7;
                        }
                    }
                }

                if (this.keyRight) {
                    this.cameraAngle = this.cameraAngle + 7 & 7;
                    this.keyRight = false;

                    if (!this.fogOfWar) {
                        if ((this.cameraAngle & 1) === 0) {
                            this.cameraAngle = this.cameraAngle + 7 & 7;
                        }

                        for (let j2 = 0; j2 < 8; j2++) {
                            if (this.isValidCameraAngle(this.cameraAngle)) {
                                break;
                            }

                            this.cameraAngle = this.cameraAngle + 7 & 7;
                        }
                    }
                }
            }
        } else if (this.keyLeft) {
            this.cameraRotation = this.cameraRotation + 2 & 0xff;
        } else if (this.keyRight) {
            this.cameraRotation = this.cameraRotation - 2 & 0xff;
        }

        if (!this.optionCameraModeAuto && this.options.middleClickCamera && this.middleButtonDown) {
            this.cameraRotation = (this.originRotation + ((this.mouseX - this.originMouseX) / 2)) & 0xff;
        }

        if (this.options.zoomCamera) {
            this.handleCameraZoom();
        } else {
            if (this.fogOfWar && this.cameraZoom > ZOOM_INDOORS) {
                this.cameraZoom -= 4;
            } else if (!this.fogOfWar && this.cameraZoom < ZOOM_OUTDOORS) {
                this.cameraZoom += 4;
            }
        }

        if (this.mouseClickXStep > 0) {
            this.mouseClickXStep--;
        } else if (this.mouseClickXStep < 0) {
            this.mouseClickXStep++;
        }

        // 17 is fountain
        this.scene.doSOemthingWithTheFuckinFountainFuck(17);
        this.objectAnimationCount++;

        if (this.objectAnimationCount > 5) {
            this.objectAnimationCount = 0;
            this.objectAnimationNumberFireLightningSpell = (this.objectAnimationNumberFireLightningSpell + 1) % 3;
            this.objectAnimationNumberTorch = (this.objectAnimationNumberTorch + 1) % 4;
            this.objectAnimationNumberClaw = (this.objectAnimationNumberClaw + 1) % 5;
        }

        for (let k2 = 0; k2 < this.objectCount; k2++) {
            let l3 = this.objectX[k2];
            let l4 = this.objectY[k2];

            if (l3 >= 0 && l4 >= 0 && l3 < 96 && l4 < 96 && this.objectId[k2] === 74) {
                this.objectModel[k2].rotate(1, 0, 0);
            }
        }

        for (let i4 = 0; i4 < this.teleportBubbleCount; i4++) {
            this.teleportBubbleTime[i4]++;

            if (this.teleportBubbleTime[i4] > 50) {
                this.teleportBubbleCount--;

                for (let i5 = i4; i5 < this.teleportBubbleCount; i5++) {
                    this.teleportBubbleX[i5] = this.teleportBubbleX[i5 + 1];
                    this.teleportBubbleY[i5] = this.teleportBubbleY[i5 + 1];
                    this.teleportBubbleTime[i5] = this.teleportBubbleTime[i5 + 1];
                    this.teleportBubbleType[i5] = this.teleportBubbleType[i5 + 1];
                }
            }
        }
    }

    handleCameraZoom() {
        if (this.keyUp) {
            this.cameraZoom -= 16;
        } else if (this.keyDown) {
            this.cameraZoom += 16;
        } else if (this.keyHome) {
            this.cameraZoom = ZOOM_OUTDOORS;
        } else if (this.keyPgUp) {
            this.cameraZoom = ZOOM_MIN;
        } else if (this.keyPgDown) {
            this.cameraZoom = ZOOM_MAX;
        }

        if (this.mouseScrollDelta !== 0 && (this.showUiTab === 2 || this.showUiTab === 0)) {
            if (this.messageTabSelected !== 0 && this.mouseY > (this.gameHeight - 64)) {
                return;
            }

            this.cameraZoom += this.mouseScrollDelta * 24;
        }

        if (this.cameraZoom >= ZOOM_MAX) {
            this.cameraZoom = ZOOM_MAX;
        } else if (this.cameraZoom <= ZOOM_MIN) {
            this.cameraZoom = ZOOM_MIN;
        }
    }

    autoRotateCamera() {
        if ((this.cameraAngle & 1) === 1 && this.isValidCameraAngle(this.cameraAngle)) {
            return;
        }

        if ((this.cameraAngle & 1) === 0 && this.isValidCameraAngle(this.cameraAngle)) {
            if (this.isValidCameraAngle(this.cameraAngle + 1 & 7)) {
                this.cameraAngle = this.cameraAngle + 1 & 7;
                return;
            }

            if (this.isValidCameraAngle(this.cameraAngle + 7 & 7)) {
                this.cameraAngle = this.cameraAngle + 7 & 7;
            }

            return;
        }

        let ai = new Int32Array([1, -1, 2, -2, 3, -3, 4]);

        for (let i = 0; i < 7; i++) {
            if (!this.isValidCameraAngle(this.cameraAngle + ai[i] + 8 & 7)) {
                continue;
            }

            this.cameraAngle = this.cameraAngle + ai[i] + 8 & 7;
            break;
        }

        if ((this.cameraAngle & 1) === 0 && this.isValidCameraAngle(this.cameraAngle)) {
            if (this.isValidCameraAngle(this.cameraAngle + 1 & 7)) {
                this.cameraAngle = this.cameraAngle + 1 & 7;
                return;
            }

            if (this.isValidCameraAngle(this.cameraAngle + 7 & 7)) {
                this.cameraAngle = this.cameraAngle + 7 & 7;
            }
        }
    }

    drawRightClickMenu() {
        if (this.mouseButtonClick !== 0) {
            for (let i = 0; i < this.menuItemsCount; i++) {
                let k = this.menuX + 2;
                let i1 = this.menuY + 27 + i * 15;

                if (this.mouseX <= k - 2 || this.mouseY <= i1 - 12 || this.mouseY >= i1 + 4 || this.mouseX >= (k - 3) + this.menuWidth) {
                    continue;
                }

                this.menuItemClick(this.menuIndices[i]);
                break;
            }

            this.mouseButtonClick = 0;
            this.showRightClickMenu = false;
            return;
        }

        if (this.mouseX < this.menuX - 10 || this.mouseY < this.menuY - 10 || this.mouseX > this.menuX + this.menuWidth + 10 || this.mouseY > this.menuY + this.menuHeight + 10) {
            this.showRightClickMenu = false;
            return;
        }

        this.surface.drawBoxAlpha(this.menuX, this.menuY, this.menuWidth, this.menuHeight, 0xd0d0d0, 160);
        this.surface.drawString('Choose option', this.menuX + 2, this.menuY + 12, 1, 65535);

        for (let j = 0; j < this.menuItemsCount; j++) {
            let l = this.menuX + 2;
            let j1 = this.menuY + 27 + j * 15;
            let k1 = 0xffffff;

            if (this.mouseX > l - 2 && this.mouseY > j1 - 12 && this.mouseY < j1 + 4 && this.mouseX < (l - 3) + this.menuWidth) {
                k1 = 0xffff00;
            }

            this.surface.drawString(this.menuItemText1[this.menuIndices[j]] + ' ' + this.menuItemText2[this.menuIndices[j]], l, j1, 1, k1);
        }
    }

    setActiveUiTab() {
        if (this.showUiTab === 0 && this.mouseX >= this.surface.width2 - 35 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 && this.mouseY < 35) {
            this.showUiTab = 1;
        }

        if (this.showUiTab === 0 && this.mouseX >= this.surface.width2 - 35 - 33 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 33 && this.mouseY < 35) {
            this.showUiTab = 2;
            this.minimapRandom1 = ((Math.random() * 13) | 0) - 6;
            this.minimapRandom2 = ((Math.random() * 23) | 0) - 11;
        }

        if (this.showUiTab === 0 && this.mouseX >= this.surface.width2 - 35 - 66 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 66 && this.mouseY < 35) {
            this.showUiTab = 3;
        }

        if (this.showUiTab === 0 && this.mouseX >= this.surface.width2 - 35 - 99 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 99 && this.mouseY < 35) {
            this.showUiTab = 4;
        }

        if (this.showUiTab === 0 && this.mouseX >= this.surface.width2 - 35 - 132 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 132 && this.mouseY < 35) {
            this.showUiTab = 5;
        }

        if (this.showUiTab === 0 && this.mouseX >= this.surface.width2 - 35 - 165 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 165 && this.mouseY < 35) {
            this.showUiTab = 6;
        }

        if (this.showUiTab !== 0 && this.mouseX >= this.surface.width2 - 35 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 && this.mouseY < 26) {
            this.showUiTab = 1;
        }

        if (this.showUiTab !== 0 && this.showUiTab !== 2 && this.mouseX >= this.surface.width2 - 35 - 33 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 33 && this.mouseY < 26) {
            this.showUiTab = 2;
            this.minimapRandom1 = ((Math.random() * 13) | 0) - 6;
            this.minimapRandom2 = ((Math.random() * 23) | 0) - 11;
        }

        if (this.showUiTab !== 0 && this.mouseX >= this.surface.width2 - 35 - 66 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 66 && this.mouseY < 26) {
            this.showUiTab = 3;
        }

        if (this.showUiTab !== 0 && this.mouseX >= this.surface.width2 - 35 - 99 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 99 && this.mouseY < 26) {
            this.showUiTab = 4;
        }

        if (this.showUiTab !== 0 && this.mouseX >= this.surface.width2 - 35 - 132 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 132 && this.mouseY < 26) {
            this.showUiTab = 5;
        }

        if (this.showUiTab !== 0 && this.mouseX >= this.surface.width2 - 35 - 165 && this.mouseY >= 3 && this.mouseX < this.surface.width2 - 3 - 165 && this.mouseY < 26) {
            this.showUiTab = 6;
        }

        if (this.showUiTab === 1 && (this.mouseX < this.surface.width2 - 248 || this.mouseY > 36 + ((this.inventoryMaxItemCount / 5) | 0) * 34)) {
            this.showUiTab = 0;
        }

        if (this.showUiTab === 3 && (this.mouseX < this.surface.width2 - 199 || this.mouseY > 316)) {
            this.showUiTab = 0;
        }

        if ((this.showUiTab === 2 || this.showUiTab === 4 || this.showUiTab === 5) && (this.mouseX < this.surface.width2 - 199 || this.mouseY > 240)) {
            this.showUiTab = 0;
        }

        if (this.showUiTab === 6 && (this.mouseX < this.surface.width2 - 199 || this.mouseY > 311)) {
            this.showUiTab = 0;
        }
    }

    drawNpc(x, y, w, h, id, tx, ty) {
        let character = this.npcs[id];
        let l1 = character.animationCurrent + (this.cameraRotation + 16) / 32 & 7;
        let flag = false;
        let i2 = l1;

        if (i2 === 5) {
            i2 = 3;
            flag = true;
        } else if (i2 === 6) {
            i2 = 2;
            flag = true;
        } else if (i2 === 7) {
            i2 = 1;
            flag = true;
        }

        let j2 = i2 * 3 + this.npcWalkModel[((character.stepCount / GameData.npcWalkModel[character.npcId]) | 0) % 4];

        if (character.animationCurrent === 8) {
            i2 = 5;
            l1 = 2;
            flag = false;
            x -= ((GameData.npcCombatAnimation[character.npcId] * ty) / 100) | 0;
            j2 = i2 * 3 + this.npcCombatModelArray1[(((this.loginTimer / (GameData.npcCombatModel[character.npcId]) | 0) - 1)) % 8];
        } else if (character.animationCurrent === 9) {
            i2 = 5;
            l1 = 2;
            flag = true;
            x += ((GameData.npcCombatAnimation[character.npcId] * ty) / 100) | 0;
            j2 = i2 * 3 + this.npcCombatModelArray2[((this.loginTimer / GameData.npcCombatModel[character.npcId]) | 0) % 8];
        }

        for (let k2 = 0; k2 < 12; k2++) {
            let l2 = this.npcAnimationArray[l1][k2];
            let k3 = GameData.npcSprite.get(character.npcId, l2);

            if (k3 >= 0) {
                let i4 = 0;
                let j4 = 0;
                let k4 = j2;

                if (flag && i2 >= 1 && i2 <= 3 && GameData.animationHasF[k3] === 1) {
                    k4 += 15;
                }

                if (i2 !== 5 || GameData.animationHasA[k3] === 1) {
                    let l4 = k4 + GameData.animationNumber[k3];

                    i4 = ((i4 * w) / this.surface.spriteWidthFull[l4]) | 0;
                    j4 = ((j4 * h) / this.surface.spriteHeightFull[l4]) | 0;

                    let i5 = ((w * this.surface.spriteWidthFull[l4]) / this.surface.spriteWidthFull[GameData.animationNumber[k3]]) | 0;

                    i4 -= ((i5 - w) / 2) | 0;

                    let col = GameData.animationCharacterColour[k3];
                    let skincol = 0;

                    if (col === 1) {
                        col = GameData.npcColourHair[character.npcId];
                        skincol = GameData.npcColourSkin[character.npcId];
                    } else if (col === 2) {
                        col = GameData.npcColourTop[character.npcId];
                        skincol = GameData.npcColourSkin[character.npcId];
                    } else if (col === 3) {
                        col = GameData.npcColorBottom[character.npcId];
                        skincol = GameData.npcColourSkin[character.npcId];
                    }

                    this.surface._spriteClipping_from9(x + i4, y + j4, i5, h, l4, col, skincol, tx, flag);
                }
            }
        }

        if (character.messageTimeout > 0) {
            this.receivedMessageMidPoint[this.receivedMessagesCount] = (this.surface.textWidth(character.message, 1) / 2) | 0;

            if (this.receivedMessageMidPoint[this.receivedMessagesCount] > 150) {
                this.receivedMessageMidPoint[this.receivedMessagesCount] = 150;
            }

            this.receivedMessageHeight[this.receivedMessagesCount] = ((this.surface.textWidth(character.message, 1) / 300) | 0) * this.surface.textHeight(1);
            this.receivedMessageX[this.receivedMessagesCount] = x + ((w / 2) | 0);
            this.receivedMessageY[this.receivedMessagesCount] = y;
            this.receivedMessages[this.receivedMessagesCount++] = character.message;
        }

        if (character.animationCurrent === 8 || character.animationCurrent === 9 || character.combatTimer !== 0) {
            if (character.combatTimer > 0) {
                let i3 = x;

                if (character.animationCurrent === 8) {
                    i3 -= ((20 * ty) / 100) | 0;
                } else if (character.animationCurrent === 9) {
                    i3 += ((20 * ty) / 100) | 0;
                }

                let l3 = ((character.healthCurrent * 30) / character.healthMax) | 0;

                this.healthBarX[this.healthBarCount] = i3 + ((w / 2) | 0);
                this.healthBarY[this.healthBarCount] = y;
                this.healthBarMissing[this.healthBarCount++] = l3;
            }

            if (character.combatTimer > 150) {
                let j3 = x;

                if (character.animationCurrent === 8) {
                    j3 -= ((10 * ty) / 100) | 0;
                } else if (character.animationCurrent === 9) {
                    j3 += ((10 * ty) / 100) | 0;
                }

                this.surface._drawSprite_from3((j3 + ((w / 2) | 0)) - 12, (y + ((h / 2) | 0)) - 12, this.spriteMedia + 12);
                this.surface.drawStringCenter(character.damageTaken.toString(), (j3 + ((w / 2) | 0)) - 1, y + ((h / 2) | 0) + 5, 3, 0xffffff);
            }
        }
    }

    walkToWallObject(i, j, k) {
        if (k === 0) {
            this._walkToActionSource_from8(this.localRegionX, this.localRegionY, i, j - 1, i, j, false, true);
        } else if (k === 1) {
            this._walkToActionSource_from8(this.localRegionX, this.localRegionY, i - 1, j, i, j, false, true);
        } else {
            this._walkToActionSource_from8(this.localRegionX, this.localRegionY, i, j, i, j, true, true);
        }
    }

    async loadGameConfig() {
        const configJag = await this.readDataFile('config' + version.CONFIG + '.jag', 'Configuration', 10);

        if (!configJag) {
            this.errorLoadingData = true;
            return;
        }

        GameData.loadData(configJag, this.members);

        const filterJag = await this.readDataFile('filter' + version.FILTER + '.jag', 'Chat system', 15);

        if (!filterJag) {
            this.errorLoadingData = true;
        } else {
            let buffragments = Utility.loadData('fragmentsenc.txt', 0, filterJag);
            let buffbandenc = Utility.loadData('badenc.txt', 0, filterJag);
            let buffhostenc = Utility.loadData('hostenc.txt', 0, filterJag);
            let bufftldlist = Utility.loadData('tldlist.txt', 0, filterJag);

            WordFilter.loadFilters(new GameBuffer(buffragments), new GameBuffer(buffbandenc), new GameBuffer(buffhostenc), new GameBuffer(bufftldlist));
        }
    }

    addNpc(serverIndex, x, y, sprite, type) {
        if (this.npcsServer[serverIndex] === null) {
            this.npcsServer[serverIndex] = new GameCharacter();
            this.npcsServer[serverIndex].serverIndex = serverIndex;
        }

        let character = this.npcsServer[serverIndex];
        let foundNpc = false;

        for (let i = 0; i < this.npcCacheCount; i++) {
            if (this.npcsCache[i].serverIndex !== serverIndex) {
                continue;
            }

            foundNpc = true;
            break;
        }

        if (foundNpc) {
            character.npcId = type;
            character.animationNext = sprite;
            let waypointIdx = character.waypointCurrent;

            if (x !== character.waypointsX[waypointIdx] || y !== character.waypointsY[waypointIdx]) {
                character.waypointCurrent = waypointIdx = (waypointIdx + 1) % 10;
                character.waypointsX[waypointIdx] = x;
                character.waypointsY[waypointIdx] = y;
            }
        } else {
            character.serverIndex = serverIndex;
            character.movingStep = 0;
            character.waypointCurrent = 0;
            character.waypointsX[0] = character.currentX = x;
            character.waypointsY[0] = character.currentY = y;
            character.npcId = type;
            character.animationNext = character.animationCurrent = sprite;
            character.stepCount = 0;
        }

        this.npcs[this.npcCount++] = character;
        return character;
    }

    resetLoginVars() {
        this.systemUpdate = 0;
        this.loginScreen = 0;
        this.loggedIn = 0;
        this.logoutTimeout = 0;
    }

    drawDialogBank() {
        let dialogWidth = 408;
        let dialogHeight = 334;

        if (this.bankActivePage > 0 && this.bankItemCount <= 48) {
            this.bankActivePage = 0;
        }

        if (this.bankActivePage > 1 && this.bankItemCount <= 96) {
            this.bankActivePage = 1;
        }

        if (this.bankActivePage > 2 && this.bankItemCount <= 144) {
            this.bankActivePage = 2;
        }

        if (this.bankSelectedItemSlot >= this.bankItemCount || this.bankSelectedItemSlot < 0) {
            this.bankSelectedItemSlot = -1;
        }

        if (this.bankSelectedItemSlot !== -1 && this.bankItems[this.bankSelectedItemSlot] !== this.bankSelectedItem) {
            this.bankSelectedItemSlot = -1;
            this.bankSelectedItem = -2;
        }

        if (this.mouseButtonClick !== 0) {
            this.mouseButtonClick = 0;

            let mouseX = this.mouseX - (((this.gameWidth / 2) | 0) - ((dialogWidth / 2) | 0));
            let mouseY = this.mouseY - (((this.gameHeight / 2) | 0) - ((dialogHeight / 2) | 0));

            if (mouseX >= 0 && mouseY >= 12 && mouseX < 408 && mouseY < 280) {
                let i1 = this.bankActivePage * 48;

                for (let l1 = 0; l1 < 6; l1++) {
                    for (let j2 = 0; j2 < 8; j2++) {
                        let l6 = 7 + j2 * 49;
                        let j7 = 28 + l1 * 34;

                        if (mouseX > l6 && mouseX < l6 + 49 && mouseY > j7 && mouseY < j7 + 34 && i1 < this.bankItemCount && this.bankItems[i1] !== -1) {
                            this.bankSelectedItem = this.bankItems[i1];
                            this.bankSelectedItemSlot = i1;
                        }

                        i1++;
                    }
                }

                mouseX = 256 - ((dialogWidth / 2) | 0);
                mouseY = 170 - ((dialogHeight / 2) | 0);

                let slot = 0;

                if (this.bankSelectedItemSlot < 0) {
                    slot = -1;
                } else {
                    slot = this.bankItems[this.bankSelectedItemSlot];
                }

                if (slot !== -1) {
                    let j1 = this.bankItemsCount[this.bankSelectedItemSlot];

                    if (GameData.itemStackable[slot] === 1 && j1 > 1) {
                        j1 = 1;
                    }

                    if (j1 >= 1 && this.mouseX >= mouseX + 220 && this.mouseY >= mouseY + 238 && this.mouseX < mouseX + 250 && this.mouseY <= mouseY + 249) {
                        this.packetStream.newPacket(clientOpcodes.BANK_WITHDRAW);
                        this.packetStream.putShort(slot);
                        this.packetStream.putShort(1);
                        this.packetStream.putInt(0x12345678);
                        this.packetStream.sendPacket();
                    }

                    if (j1 >= 5 && this.mouseX >= mouseX + 250 && this.mouseY >= mouseY + 238 && this.mouseX < mouseX + 280 && this.mouseY <= mouseY + 249) {
                        this.packetStream.newPacket(clientOpcodes.BANK_WITHDRAW);
                        this.packetStream.putShort(slot);
                        this.packetStream.putShort(5);
                        this.packetStream.putInt(0x12345678);
                        this.packetStream.sendPacket();
                    }

                    if (j1 >= 25 && this.mouseX >= mouseX + 280 && this.mouseY >= mouseY + 238 && this.mouseX < mouseX + 305 && this.mouseY <= mouseY + 249) {
                        this.packetStream.newPacket(clientOpcodes.BANK_WITHDRAW);
                        this.packetStream.putShort(slot);
                        this.packetStream.putShort(25);
                        this.packetStream.putInt(0x12345678);
                        this.packetStream.sendPacket();
                    }

                    if (j1 >= 100 && this.mouseX >= mouseX + 305 && this.mouseY >= mouseY + 238 && this.mouseX < mouseX + 335 && this.mouseY <= mouseY + 249) {
                        this.packetStream.newPacket(clientOpcodes.BANK_WITHDRAW);
                        this.packetStream.putShort(slot);
                        this.packetStream.putShort(100);
                        this.packetStream.putInt(0x12345678);
                        this.packetStream.sendPacket();
                    }

                    if (j1 >= 500 && this.mouseX >= mouseX + 335 && this.mouseY >= mouseY + 238 && this.mouseX < mouseX + 368 && this.mouseY <= mouseY + 249) {
                        this.packetStream.newPacket(clientOpcodes.BANK_WITHDRAW);
                        this.packetStream.putShort(slot);
                        this.packetStream.putShort(500);
                        this.packetStream.putInt(0x12345678);
                        this.packetStream.sendPacket();
                    }

                    if (j1 >= 2500 && this.mouseX >= mouseX + 370 && this.mouseY >= mouseY + 238 && this.mouseX < mouseX + 400 && this.mouseY <= mouseY + 249) {
                        this.packetStream.newPacket(clientOpcodes.BANK_WITHDRAW);
                        this.packetStream.putShort(slot);
                        this.packetStream.putShort(2500);
                        this.packetStream.putInt(0x12345678);
                        this.packetStream.sendPacket();
                    }

                    if (this.getInventoryCount(slot) >= 1 && this.mouseX >= mouseX + 220 && this.mouseY >= mouseY + 263 && this.mouseX < mouseX + 250 && this.mouseY <= mouseY + 274) {
                        this.packetStream.newPacket(clientOpcodes.BANK_DEPOSIT);
                        this.packetStream.putShort(slot);
                        this.packetStream.putShort(1);
                        this.packetStream.putInt(0x87654321);
                        this.packetStream.sendPacket();
                    }

                    if (this.getInventoryCount(slot) >= 5 && this.mouseX >= mouseX + 250 && this.mouseY >= mouseY + 263 && this.mouseX < mouseX + 280 && this.mouseY <= mouseY + 274) {
                        this.packetStream.newPacket(clientOpcodes.BANK_DEPOSIT);
                        this.packetStream.putShort(slot);
                        this.packetStream.putShort(5);
                        this.packetStream.putInt(0x87654321);
                        this.packetStream.sendPacket();
                    }
                    if (this.getInventoryCount(slot) >= 25 && this.mouseX >= mouseX + 280 && this.mouseY >= mouseY + 263 && this.mouseX < mouseX + 305 && this.mouseY <= mouseY + 274) {
                        this.packetStream.newPacket(clientOpcodes.BANK_DEPOSIT);
                        this.packetStream.putShort(slot);
                        this.packetStream.putShort(25);
                        this.packetStream.putInt(0x87654321);
                        this.packetStream.sendPacket();
                    }

                    if (this.getInventoryCount(slot) >= 100 && this.mouseX >= mouseX + 305 && this.mouseY >= mouseY + 263 && this.mouseX < mouseX + 335 && this.mouseY <= mouseY + 274) {
                        this.packetStream.newPacket(clientOpcodes.BANK_DEPOSIT);
                        this.packetStream.putShort(slot);
                        this.packetStream.putShort(100);
                        this.packetStream.putInt(0x87654321);
                        this.packetStream.sendPacket();
                    }

                    if (this.getInventoryCount(slot) >= 500 && this.mouseX >= mouseX + 335 && this.mouseY >= mouseY + 263 && this.mouseX < mouseX + 368 && this.mouseY <= mouseY + 274) {
                        this.packetStream.newPacket(clientOpcodes.BANK_DEPOSIT);
                        this.packetStream.putShort(slot);
                        this.packetStream.putShort(500);
                        this.packetStream.putInt(0x87654321);
                        this.packetStream.sendPacket();
                    }

                    if (this.getInventoryCount(slot) >= 2500 && this.mouseX >= mouseX + 370 && this.mouseY >= mouseY + 263 && this.mouseX < mouseX + 400 && this.mouseY <= mouseY + 274) {
                        this.packetStream.newPacket(clientOpcodes.BANK_DEPOSIT);
                        this.packetStream.putShort(slot);
                        this.packetStream.putShort(2500);
                        this.packetStream.putInt(0x87654321);
                        this.packetStream.sendPacket();
                    }
                }
            } else if (this.bankItemCount > 48 && mouseX >= 50 && mouseX <= 115 && mouseY <= 12) {
                this.bankActivePage = 0;
            } else if (this.bankItemCount > 48 && mouseX >= 115 && mouseX <= 180 && mouseY <= 12) {
                this.bankActivePage = 1;
            } else if (this.bankItemCount > 96 && mouseX >= 180 && mouseX <= 245 && mouseY <= 12) {
                this.bankActivePage = 2;
            } else if (this.bankItemCount > 144 && mouseX >= 245 && mouseX <= 310 && mouseY <= 12) {
                this.bankActivePage = 3;
            } else {
                this.packetStream.newPacket(clientOpcodes.BANK_CLOSE);
                this.packetStream.sendPacket();
                this.showDialogBank = false;
                return;
            }
        }

        let x = ((this.gameWidth / 2) | 0) - ((dialogWidth / 2) | 0);
        let y = ((this.gameHeight / 2) | 0) - ((dialogHeight / 2) | 0);

        this.surface.drawBox(x, y, 408, 12, 192);
        this.surface.drawBoxAlpha(x, y + 12, 408, 17, 0x989898, 160);
        this.surface.drawBoxAlpha(x, y + 29, 8, 204, 0x989898, 160);
        this.surface.drawBoxAlpha(x + 399, y + 29, 9, 204, 0x989898, 160);
        this.surface.drawBoxAlpha(x, y + 233, 408, 47, 0x989898, 160);
        this.surface.drawString('Bank', x + 1, y + 10, 1, 0xffffff);

        let xOff = 50;

        if (this.bankItemCount > 48) {
            let l2 = 0xffffff;

            if (this.bankActivePage === 0) {
                l2 = 0xff0000;
            } else if (this.mouseX > x + xOff && this.mouseY >= y && this.mouseX < x + xOff + 65 && this.mouseY < y + 12) {
                l2 = 0xffff00;
            }

            this.surface.drawString('<page 1>', x + xOff, y + 10, 1, l2);
            xOff += 65;
            l2 = 0xffffff;

            if (this.bankActivePage === 1) {
                l2 = 0xff0000;
            } else if (this.mouseX > x + xOff && this.mouseY >= y && this.mouseX < x + xOff + 65 && this.mouseY < y + 12) {
                l2 = 0xffff00;
            }

            this.surface.drawString('<page 2>', x + xOff, y + 10, 1, l2);
            xOff += 65;
        }

        if (this.bankItemCount > 96) {
            let i3 = 0xffffff;
            if (this.bankActivePage === 2) {
                i3 = 0xff0000;
            } else if (this.mouseX > x + xOff && this.mouseY >= y && this.mouseX < x + xOff + 65 && this.mouseY < y + 12) {
                i3 = 0xffff00;
            }

            this.surface.drawString('<page 3>', x + xOff, y + 10, 1, i3);
            xOff += 65;
        }

        if (this.bankItemCount > 144) {
            let j3 = 0xffffff;

            if (this.bankActivePage === 3) {
                j3 = 0xff0000;
            } else if (this.mouseX > x + xOff && this.mouseY >= y && this.mouseX < x + xOff + 65 && this.mouseY < y + 12) {
                j3 = 0xffff00;
            }

            this.surface.drawString('<page 4>', x + xOff, y + 10, 1, j3);
            xOff += 65;
        }

        let colour = 0xffffff;

        if (this.mouseX > x + 320 && this.mouseY >= y && this.mouseX < x + 408 && this.mouseY < y + 12) {
            colour = 0xff0000;
        }

        this.surface.drawStringRight('Close window', x + 406, y + 10, 1, colour);
        this.surface.drawString('Number in bank in green', x + 7, y + 24, 1, 65280);
        this.surface.drawString('Number held in blue', x + 289, y + 24, 1, 65535);

        let k7 = this.bankActivePage * 48;

        for (let i8 = 0; i8 < 6; i8++) {
            for (let j8 = 0; j8 < 8; j8++) {
                let l8 = x + 7 + j8 * 49;
                let i9 = y + 28 + i8 * 34;

                if (this.bankSelectedItemSlot === k7) {
                    this.surface.drawBoxAlpha(l8, i9, 49, 34, 0xff0000, 160);
                } else {
                    this.surface.drawBoxAlpha(l8, i9, 49, 34, 0xd0d0d0, 160);
                }

                this.surface.drawBoxEdge(l8, i9, 50, 35, 0);

                if (k7 < this.bankItemCount && this.bankItems[k7] !== -1) {
                    this.surface._spriteClipping_from9(l8, i9, 48, 32, this.spriteItem + GameData.itemPicture[this.bankItems[k7]], GameData.itemMask[this.bankItems[k7]], 0, 0, false);
                    this.surface.drawString(this.bankItemsCount[k7].toString(), l8 + 1, i9 + 10, 1, 65280);
                    this.surface.drawStringRight(this.getInventoryCount(this.bankItems[k7]).toString(), l8 + 47, i9 + 29, 1, 65535);
                }

                k7++;
            }
        }

        this.surface.drawLineHoriz(x + 5, y + 256, 398, 0);

        if (this.bankSelectedItemSlot === -1) {
            this.surface.drawStringCenter('Select an object to withdraw or deposit', x + 204, y + 248, 3, 0xffff00);
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
                this.surface.drawString('Withdraw ' + GameData.itemName[itemType], x + 2, y + 248, 1, 0xffffff);
                colour = 0xffffff;

                if (this.mouseX >= x + 220 && this.mouseY >= y + 238 && this.mouseX < x + 250 && this.mouseY <= y + 249) {
                    colour = 0xff0000;
                }

                this.surface.drawString('One', x + 222, y + 248, 1, colour);

                if (itemCount >= 5) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 250 && this.mouseY >= y + 238 && this.mouseX < x + 280 && this.mouseY <= y + 249) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('Five', x + 252, y + 248, 1, colour);
                }

                if (itemCount >= 25) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 280 && this.mouseY >= y + 238 && this.mouseX < x + 305 && this.mouseY <= y + 249) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('25', x + 282, y + 248, 1, colour);
                }

                if (itemCount >= 100) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 305 && this.mouseY >= y + 238 && this.mouseX < x + 335 && this.mouseY <= y + 249) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('100', x + 307, y + 248, 1, colour);
                }

                if (itemCount >= 500) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 335 && this.mouseY >= y + 238 && this.mouseX < x + 368 && this.mouseY <= y + 249) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('500', x + 337, y + 248, 1, colour);
                }

                if (itemCount >= 2500) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 370 && this.mouseY >= y + 238 && this.mouseX < x + 400 && this.mouseY <= y + 249) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('2500', x + 370, y + 248, 1, colour);
                }
            }

            if (this.getInventoryCount(itemType) > 0) {
                this.surface.drawString('Deposit ' + GameData.itemName[itemType], x + 2, y + 273, 1, 0xffffff);
                colour = 0xffffff;

                if (this.mouseX >= x + 220 && this.mouseY >= y + 263 && this.mouseX < x + 250 && this.mouseY <= y + 274) {
                    colour = 0xff0000;
                }

                this.surface.drawString('One', x + 222, y + 273, 1, colour);

                if (this.getInventoryCount(itemType) >= 5) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 250 && this.mouseY >= y + 263 && this.mouseX < x + 280 && this.mouseY <= y + 274) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('Five', x + 252, y + 273, 1, colour);
                }

                if (this.getInventoryCount(itemType) >= 25) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 280 && this.mouseY >= y + 263 && this.mouseX < x + 305 && this.mouseY <= y + 274) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('25', x + 282, y + 273, 1, colour);
                }

                if (this.getInventoryCount(itemType) >= 100) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 305 && this.mouseY >= y + 263 && this.mouseX < x + 335 && this.mouseY <= y + 274) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('100', x + 307, y + 273, 1, colour);
                }

                if (this.getInventoryCount(itemType) >= 500) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 335 && this.mouseY >= y + 263 && this.mouseX < x + 368 && this.mouseY <= y + 274) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('500', x + 337, y + 273, 1, colour);
                }

                if (this.getInventoryCount(itemType) >= 2500) {
                    colour = 0xffffff;

                    if (this.mouseX >= x + 370 && this.mouseY >= y + 263 && this.mouseX < x + 400 && this.mouseY <= y + 274) {
                        colour = 0xff0000;
                    }

                    this.surface.drawString('2500', x + 370, y + 273, 1, colour);
                }
            }
        }
    }

    drawDialogDuel() {
        if (this.mouseButtonClick !== 0 && this.mouseButtonItemCountIncrement === 0) {
            this.mouseButtonItemCountIncrement = 1;
        }

        if (this.mouseButtonItemCountIncrement > 0) {
            let mouseX = this.mouseX - 22;
            let mouseY = this.mouseY - 36;

            if (mouseX >= 0 && mouseY >= 0 && mouseX < 468 && mouseY < 262) {
                if (mouseX > 216 && mouseY > 30 && mouseX < 462 && mouseY < 235) {
                    let slot = ((((mouseX - 217) | 0) / 49) | 0) + (((mouseY - 31) / 34) | 0) * 5;
                    if (slot >= 0 && slot < this.inventoryItemsCount) {
                        let sendUpdate = false;
                        let l1 = 0;
                        let item = this.inventoryItemId[slot];

                        for (let k3 = 0; k3 < this.duelOfferItemCount; k3++) {
                            if (this.duelOfferItemId[k3] === item) {
                                if (GameData.itemStackable[item] === 0) {
                                    for (let i4 = 0; i4 < this.mouseButtonItemCountIncrement; i4++) {
                                        if (this.duelOfferItemStack[k3] < this.inventoryItemStackCount[slot]) {
                                            this.duelOfferItemStack[k3]++;
                                        }

                                        sendUpdate = true;
                                    }
                                } else {
                                    l1++;
                                }
                            }
                        }

                        if (this.getInventoryCount(item) <= l1) {
                            sendUpdate = true;
                        }

                        if (GameData.itemSpecial[item] === 1) {
                            this.showMessage('This object cannot be added to a duel offer', 3);
                            sendUpdate = true;
                        }

                        if (!sendUpdate && this.duelOfferItemCount < 8) {
                            this.duelOfferItemId[this.duelOfferItemCount] = item;
                            this.duelOfferItemStack[this.duelOfferItemCount] = 1;
                            this.duelOfferItemCount++;
                            sendUpdate = true;
                        }

                        if (sendUpdate) {
                            this.packetStream.newPacket(clientOpcodes.DUEL_ITEM_UPDATE);
                            this.packetStream.putByte(this.duelOfferItemCount);

                            for (let j4 = 0; j4 < this.duelOfferItemCount; j4++) {
                                this.packetStream.putShort(this.duelOfferItemId[j4]);
                                this.packetStream.putInt(this.duelOfferItemStack[j4]);
                            }

                            this.packetStream.sendPacket();
                            this.duelOfferOpponentAccepted = false;
                            this.duelOfferAccepted = false;
                        }
                    }
                }

                if (mouseX > 8 && mouseY > 30 && mouseX < 205 && mouseY < 129) {
                    let slot = (((mouseX - 9) / 49) | 0) + (((mouseY - 31) / 34) | 0) * 4;

                    if (slot >= 0 && slot < this.duelOfferItemCount) {
                        let j1 = this.duelOfferItemId[slot];
                        for (let i2 = 0; i2 < this.mouseButtonItemCountIncrement; i2++) {
                            if (GameData.itemStackable[j1] === 0 && this.duelOfferItemStack[slot] > 1) {
                                this.duelOfferItemStack[slot]--;
                                continue;
                            }

                            this.duelOfferItemCount--;
                            this.mouseButtonDownTime = 0;

                            for (let l2 = slot; l2 < this.duelOfferItemCount; l2++) {
                                this.duelOfferItemId[l2] = this.duelOfferItemId[l2 + 1];
                                this.duelOfferItemStack[l2] = this.duelOfferItemStack[l2 + 1];
                            }

                            break;
                        }

                        this.packetStream.newPacket(clientOpcodes.DUEL_ITEM_UPDATE);
                        this.packetStream.putByte(this.duelOfferItemCount);

                        for (let i3 = 0; i3 < this.duelOfferItemCount; i3++) {
                            this.packetStream.putShort(this.duelOfferItemId[i3]);
                            this.packetStream.putInt(this.duelOfferItemStack[i3]);
                        }

                        this.packetStream.sendPacket();
                        this.duelOfferOpponentAccepted = false;
                        this.duelOfferAccepted = false;
                    }
                }

                let flag = false;

                if (mouseX >= 93 && mouseY >= 221 && mouseX <= 104 && mouseY <= 232) {
                    this.duelSettingsRetreat = !this.duelSettingsRetreat;
                    flag = true;
                }

                if (mouseX >= 93 && mouseY >= 240 && mouseX <= 104 && mouseY <= 251) {
                    this.duelSettingsMagic = !this.duelSettingsMagic;
                    flag = true;
                }

                if (mouseX >= 191 && mouseY >= 221 && mouseX <= 202 && mouseY <= 232) {
                    this.duelSettingsPrayer = !this.duelSettingsPrayer;
                    flag = true;
                }

                if (mouseX >= 191 && mouseY >= 240 && mouseX <= 202 && mouseY <= 251) {
                    this.duelSettingsWeapons = !this.duelSettingsWeapons;
                    flag = true;
                }

                if (flag) {
                    this.packetStream.newPacket(clientOpcodes.DUEL_SETTINGS);
                    this.packetStream.putByte(this.duelSettingsRetreat ? 1 : 0);
                    this.packetStream.putByte(this.duelSettingsMagic ? 1 : 0);
                    this.packetStream.putByte(this.duelSettingsPrayer ? 1 : 0);
                    this.packetStream.putByte(this.duelSettingsWeapons ? 1 : 0);
                    this.packetStream.sendPacket();
                    this.duelOfferOpponentAccepted = false;
                    this.duelOfferAccepted = false;
                }

                if (mouseX >= 217 && mouseY >= 238 && mouseX <= 286 && mouseY <= 259) {
                    this.duelOfferAccepted = true;
                    this.packetStream.newPacket(clientOpcodes.DUEL_ACCEPT);
                    this.packetStream.sendPacket();
                }

                if (mouseX >= 394 && mouseY >= 238 && mouseX < 463 && mouseY < 259) {
                    this.showDialogDuel = false;
                    this.packetStream.newPacket(clientOpcodes.DUEL_DECLINE);
                    this.packetStream.sendPacket();
                }
            } else if (this.mouseButtonClick !== 0) {
                this.showDialogDuel = false;
                this.packetStream.newPacket(clientOpcodes.DUEL_DECLINE);
                this.packetStream.sendPacket();
            }

            this.mouseButtonClick = 0;
            this.mouseButtonItemCountIncrement = 0;
        }

        if (!this.showDialogDuel) {
            return;
        }

        //let dialogX = this.gameWidth / 2 - 468 / 2 + 22;
        //let dialogY = this.gameHeight / 2 - 262 / 2 + 22;
        let dialogX = 22;
        let dialogY = 36;

        this.surface.drawBox(dialogX, dialogY, 468, 12, 0xc90b1d);
        this.surface.drawBoxAlpha(dialogX, dialogY + 12, 468, 18, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX, dialogY + 30, 8, 248, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 205, dialogY + 30, 11, 248, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 462, dialogY + 30, 6, 248, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 99, 197, 24, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 192, 197, 23, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 258, 197, 20, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 216, dialogY + 235, 246, 43, 0x989898, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 30, 197, 69, 0xd0d0d0, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 123, 197, 69, 0xd0d0d0, 160);
        this.surface.drawBoxAlpha(dialogX + 8, dialogY + 215, 197, 43, 0xd0d0d0, 160);
        this.surface.drawBoxAlpha(dialogX + 216, dialogY + 30, 246, 205, 0xd0d0d0, 160);

        for (let j2 = 0; j2 < 3; j2++) {
            this.surface.drawLineHoriz(dialogX + 8, dialogY + 30 + j2 * 34, 197, 0);
        }

        for (let j3 = 0; j3 < 3; j3++) {
            this.surface.drawLineHoriz(dialogX + 8, dialogY + 123 + j3 * 34, 197, 0);
        }

        for (let l3 = 0; l3 < 7; l3++) {
            this.surface.drawLineHoriz(dialogX + 216, dialogY + 30 + l3 * 34, 246, 0);
        }

        for (let k4 = 0; k4 < 6; k4++) {
            if (k4 < 5) {
                this.surface.drawLineVert(dialogX + 8 + k4 * 49, dialogY + 30, 69, 0);
            }

            if (k4 < 5) {
                this.surface.drawLineVert(dialogX + 8 + k4 * 49, dialogY + 123, 69, 0);
            }

            this.surface.drawLineVert(dialogX + 216 + k4 * 49, dialogY + 30, 205, 0);
        }

        this.surface.drawLineHoriz(dialogX + 8, dialogY + 215, 197, 0);
        this.surface.drawLineHoriz(dialogX + 8, dialogY + 257, 197, 0);
        this.surface.drawLineVert(dialogX + 8, dialogY + 215, 43, 0);
        this.surface.drawLineVert(dialogX + 204, dialogY + 215, 43, 0);
        this.surface.drawString('Preparing to duel with: ' + this.duelOpponentName, dialogX + 1, dialogY + 10, 1, 0xffffff);
        this.surface.drawString('Your Stake', dialogX + 9, dialogY + 27, 4, 0xffffff);
        this.surface.drawString('Opponent\'s Stake', dialogX + 9, dialogY + 120, 4, 0xffffff);
        this.surface.drawString('Duel Options', dialogX + 9, dialogY + 212, 4, 0xffffff);
        this.surface.drawString('Your Inventory', dialogX + 216, dialogY + 27, 4, 0xffffff);
        this.surface.drawString('No retreating', dialogX + 8 + 1, dialogY + 215 + 16, 3, 0xffff00);
        this.surface.drawString('No magic', dialogX + 8 + 1, dialogY + 215 + 35, 3, 0xffff00);
        this.surface.drawString('No prayer', dialogX + 8 + 102, dialogY + 215 + 16, 3, 0xffff00);
        this.surface.drawString('No weapons', dialogX + 8 + 102, dialogY + 215 + 35, 3, 0xffff00);
        this.surface.drawBoxEdge(dialogX + 93, dialogY + 215 + 6, 11, 11, 0xffff00);

        if (this.duelSettingsRetreat) {
            this.surface.drawBox(dialogX + 95, dialogY + 215 + 8, 7, 7, 0xffff00);
        }

        this.surface.drawBoxEdge(dialogX + 93, dialogY + 215 + 25, 11, 11, 0xffff00);

        if (this.duelSettingsMagic) {
            this.surface.drawBox(dialogX + 95, dialogY + 215 + 27, 7, 7, 0xffff00);
        }

        this.surface.drawBoxEdge(dialogX + 191, dialogY + 215 + 6, 11, 11, 0xffff00);

        if (this.duelSettingsPrayer) {
            this.surface.drawBox(dialogX + 193, dialogY + 215 + 8, 7, 7, 0xffff00);
        }

        this.surface.drawBoxEdge(dialogX + 191, dialogY + 215 + 25, 11, 11, 0xffff00);

        if (this.duelSettingsWeapons) {
            this.surface.drawBox(dialogX + 193, dialogY + 215 + 27, 7, 7, 0xffff00);
        }

        if (!this.duelOfferAccepted) {
            this.surface._drawSprite_from3(dialogX + 217, dialogY + 238, this.spriteMedia + 25);
        }

        this.surface._drawSprite_from3(dialogX + 394, dialogY + 238, this.spriteMedia + 26);

        if (this.duelOfferOpponentAccepted) {
            this.surface.drawStringCenter('Other player', dialogX + 341, dialogY + 246, 1, 0xffffff);
            this.surface.drawStringCenter('has accepted', dialogX + 341, dialogY + 256, 1, 0xffffff);
        }

        if (this.duelOfferAccepted) {
            this.surface.drawStringCenter('Waiting for', dialogX + 217 + 35, dialogY + 246, 1, 0xffffff);
            this.surface.drawStringCenter('other player', dialogX + 217 + 35, dialogY + 256, 1, 0xffffff);
        }

        for (let i = 0; i < this.inventoryItemsCount; i++) {
            let x = 217 + dialogX + (i % 5) * 49;
            let y = 31 + dialogY + ((i / 5) | 0) * 34;
            this.surface._spriteClipping_from9(x, y, 48, 32, this.spriteItem + GameData.itemPicture[this.inventoryItemId[i]], GameData.itemMask[this.inventoryItemId[i]], 0, 0, false);

            if (GameData.itemStackable[this.inventoryItemId[i]] === 0) {
                this.surface.drawString(this.inventoryItemStackCount[i].toString(), x + 1, y + 10, 1, 0xffff00);
            }
        }

        for (let i = 0; i < this.duelOfferItemCount; i++) {
            let x = 9 + dialogX + (i % 4) * 49;
            let y = 31 + dialogY + ((i / 4) | 0) * 34;

            this.surface._spriteClipping_from9(x, y, 48, 32, this.spriteItem + GameData.itemPicture[this.duelOfferItemId[i]], GameData.itemMask[this.duelOfferItemId[i]], 0, 0, false);

            if (GameData.itemStackable[this.duelOfferItemId[i]] === 0) {
                this.surface.drawString(this.duelOfferItemStack[i].toString(), x + 1, y + 10, 1, 0xffff00);
            }

            if (this.mouseX > x && this.mouseX < x + 48 && this.mouseY > y && this.mouseY < y + 32) {
                this.surface.drawString(GameData.itemName[this.duelOfferItemId[i]] + ': @whi@' + GameData.itemDescription[this.duelOfferItemId[i]], dialogX + 8, dialogY + 273, 1, 0xffff00);
            }
        }

        for (let i = 0; i < this.duelOfferOpponentItemCount; i++) {
            let x = 9 + dialogX + (i % 4) * 49;
            let y = 124 + dialogY + ((i / 4) | 0) * 34;

            this.surface._spriteClipping_from9(x, y, 48, 32, this.spriteItem + GameData.itemPicture[this.duelOfferOpponentItemId[i]], GameData.itemMask[this.duelOfferOpponentItemId[i]], 0, 0, false);

            if (GameData.itemStackable[this.duelOfferOpponentItemId[i]] === 0) {
                this.surface.drawString(this.duelOfferOpponentItemStack[i].toString(), x + 1, y + 10, 1, 0xffff00);
            }

            if (this.mouseX > x && this.mouseX < x + 48 && this.mouseY > y && this.mouseY < y + 32) {
                this.surface.drawString(GameData.itemName[this.duelOfferOpponentItemId[i]] + ': @whi@' + GameData.itemDescription[this.duelOfferOpponentItemId[i]], dialogX + 8, dialogY + 273, 1, 0xffff00);
            }
        }
    }

    loadNextRegion(lx, ly) {
        if (this.deathScreenTimeout !== 0) {
            this.world.playerAlive = false;
            return false;
        }

        this.loadingArea = false;
        lx += this.planeWidth;
        ly += this.planeHeight;

        if (this.lastHeightOffset === this.planeIndex && lx > this.localLowerX && lx < this.localUpperX && ly > this.localLowerY && ly < this.localUpperY) {
            this.world.playerAlive = true;
            return false;
        }

        this.surface.drawStringCenter('Loading... Please wait', 256, 192, 1, 0xffffff);
        this.drawChatMessageTabs();
        this.surface.draw(this.graphics, 0, 0);

        let ax = this.regionX;
        let ay = this.regionY;
        let sectionX = ((lx + 24) / 48) | 0;
        let sectionY = ((ly + 24) / 48) | 0;

        this.lastHeightOffset = this.planeIndex;
        this.regionX = sectionX * 48 - 48;
        this.regionY = sectionY * 48 - 48;
        this.localLowerX = sectionX * 48 - 32;
        this.localLowerY = sectionY * 48 - 32;
        this.localUpperX = sectionX * 48 + 32;
        this.localUpperY = sectionY * 48 + 32;

        this.world._loadSection_from3(lx, ly, this.lastHeightOffset);

        this.regionX -= this.planeWidth;
        this.regionY -= this.planeHeight;

        let offsetX = this.regionX - ax;
        let offsetY = this.regionY - ay;

        for (let objIdx = 0; objIdx < this.objectCount; objIdx++) {
            this.objectX[objIdx] -= offsetX;
            this.objectY[objIdx] -= offsetY;

            let objx = this.objectX[objIdx];
            let objy = this.objectY[objIdx];
            let objid = this.objectId[objIdx];

            let gameModel = this.objectModel[objIdx];

            try {
                let objType = this.objectDirection[objIdx];
                let objW = 0;
                let objH = 0;

                if (objType === 0 || objType === 4) {
                    objW = GameData.objectWidth[objid];
                    objH = GameData.objectHeight[objid];
                } else {
                    objH = GameData.objectWidth[objid];
                    objW = GameData.objectHeight[objid];
                }

                let j6 = (((objx + objx + objW) * this.magicLoc) / 2) | 0;
                let k6 = (((objy + objy + objH) * this.magicLoc) / 2) | 0;

                if (objx >= 0 && objy >= 0 && objx < 96 && objy < 96) {
                    this.scene.addModel(gameModel);
                    gameModel.place(j6, -this.world.getElevation(j6, k6), k6);
                    this.world.removeObject2(objx, objy, objid);

                    if (objid === 74) {
                        gameModel.translate(0, -480, 0);
                    }
                }
            } catch (e) {
                console.log('Loc Error: ' + e.message);
                console.error(e);
            }
        }

        for (let k2 = 0; k2 < this.wallObjectCount; k2++) {
            this.wallObjectX[k2] -= offsetX;
            this.wallObjectY[k2] -= offsetY;

            let i3 = this.wallObjectX[k2];
            let l3 = this.wallObjectY[k2];
            let j4 = this.wallObjectId[k2];
            let i5 = this.wallObjectDirection[k2];

            try {
                this.world._setObjectAdjacency_from4(i3, l3, i5, j4);
                let gameModel_1 = this.createModel(i3, l3, i5, j4, k2);
                this.wallObjectModel[k2] = gameModel_1;
            } catch (e) {
                console.log('Bound Error: ' + e.message);
                console.error(e);
            }
        }

        for (let j3 = 0; j3 < this.groundItemCount; j3++) {
            this.groundItemX[j3] -= offsetX;
            this.groundItemY[j3] -= offsetY;
        }

        for (let i4 = 0; i4 < this.playerCount; i4++) {
            let character = this.players[i4];

            character.currentX -= offsetX * this.magicLoc;
            character.currentY -= offsetY * this.magicLoc;

            for (let j5 = 0; j5 <= character.waypointCurrent; j5++) {
                character.waypointsX[j5] -= offsetX * this.magicLoc;
                character.waypointsY[j5] -= offsetY * this.magicLoc;
            }

        }

        for (let k4 = 0; k4 < this.npcCount; k4++) {
            let character_1 = this.npcs[k4];

            character_1.currentX -= offsetX * this.magicLoc;
            character_1.currentY -= offsetY * this.magicLoc;

            for (let l5 = 0; l5 <= character_1.waypointCurrent; l5++) {
                character_1.waypointsX[l5] -= offsetX * this.magicLoc;
                character_1.waypointsY[l5] -= offsetY * this.magicLoc;
            }
        }

        this.world.playerAlive = true;

        return true;
    }

    drawPlayer(x, y, w, h, id, tx, ty) {
        let character = this.players[id];

        // this means the character is invisible! MOD!!!
        if (character.colourBottom === 255)  {
            return;
        }

        let l1 = character.animationCurrent + (this.cameraRotation + 16) / 32 & 7;
        let flag = false;
        let i2 = l1;

        if (i2 === 5) {
            i2 = 3;
            flag = true;
        } else if (i2 === 6) {
            i2 = 2;
            flag = true;
        } else if (i2 === 7) {
            i2 = 1;
            flag = true;
        }

        let j2 = i2 * 3 + this.npcWalkModel[((character.stepCount / 6) | 0) % 4];

        if (character.animationCurrent === 8) {
            i2 = 5;
            l1 = 2;
            flag = false;
            x -= ((5 * ty) / 100) | 0;
            j2 = i2 * 3 + this.npcCombatModelArray1[((this.loginTimer / 5) | 0) % 8];
        } else if (character.animationCurrent === 9) {
            i2 = 5;
            l1 = 2;
            flag = true;
            x += ((5 * ty) / 100) | 0;
            j2 = i2 * 3 + this.npcCombatModelArray2[((this.loginTimer / 6) | 0) % 8];
        }

        for (let k2 = 0; k2 < 12; k2++) {
            let l2 = this.npcAnimationArray[l1][k2];
            let l3 = character.equippedItem[l2] - 1;

            if (l3 >= 0) {
                let k4 = 0;
                let i5 = 0;
                let j5 = j2;

                if (flag && i2 >= 1 && i2 <= 3) {
                    if (GameData.animationHasF[l3] === 1) {
                        j5 += 15;
                    } else if (l2 === 4 && i2 === 1) {
                        k4 = -22;
                        i5 = -3;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((character.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 4 && i2 === 2) {
                        k4 = 0;
                        i5 = -8;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((character.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 4 && i2 === 3) {
                        k4 = 26;
                        i5 = -5;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((character.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 3 && i2 === 1) {
                        k4 = 22;
                        i5 = 3;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((character.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 3 && i2 === 2) {
                        k4 = 0;
                        i5 = 8;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((character.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 3 && i2 === 3) {
                        k4 = -26;
                        i5 = 5;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((character.stepCount / 6) | 0)) % 4];
                    }
                }

                if (i2 !== 5 || GameData.animationHasA[l3] === 1) {
                    let k5 = j5 + GameData.animationNumber[l3];

                    k4 = ((k4 * w) / this.surface.spriteWidthFull[k5]) | 0;
                    i5 = ((i5 * h) / this.surface.spriteHeightFull[k5]) | 0;

                    let l5 = ((w * this.surface.spriteWidthFull[k5]) / this.surface.spriteWidthFull[GameData.animationNumber[l3]]) | 0;

                    k4 -= ((l5 - w) / 2) | 0;

                    let i6 = GameData.animationCharacterColour[l3];
                    const skinColour =
                        this.characterSkinColours[character.colourSkin];

                    if (i6 === 1) {
                        i6 = this.characterHairColours[character.colourHair];
                    } else if (i6 === 2) {
                        i6 = this.characterTopBottomColours[character.colourTop];
                    } else if (i6 === 3) {
                        i6 = this.characterTopBottomColours[character.colourBottom];
                    }

                    this.surface._spriteClipping_from9(x + k4, y + i5, l5, h, k5, i6, skinColour, tx, flag);
                }
            }
        }

        if (character.messageTimeout > 0) {
            this.receivedMessageMidPoint[this.receivedMessagesCount] = (this.surface.textWidth(character.message, 1) / 2) | 0;

            if (this.receivedMessageMidPoint[this.receivedMessagesCount] > 150) {
                this.receivedMessageMidPoint[this.receivedMessagesCount] = 150;
            }

            this.receivedMessageHeight[this.receivedMessagesCount] = ((this.surface.textWidth(character.message, 1) / 300) | 0) * this.surface.textHeight(1);
            this.receivedMessageX[this.receivedMessagesCount] = x + ((w / 2) | 0);
            this.receivedMessageY[this.receivedMessagesCount] = y;
            this.receivedMessages[this.receivedMessagesCount++] = character.message;
        }

        if (character.bubbleTimeout > 0) {
            this.actionBubbleX[this.itemsAboveHeadCount] = x + ((w / 2) | 0);
            this.actionBubbleY[this.itemsAboveHeadCount] = y;
            this.actionBubbleScale[this.itemsAboveHeadCount] = ty;
            this.actionBubbleItem[this.itemsAboveHeadCount++] = character.bubbleItem;
        }

        if (character.animationCurrent === 8 || character.animationCurrent === 9 || character.combatTimer !== 0) {
            if (character.combatTimer > 0) {
                let i3 = x;

                if (character.animationCurrent === 8) {
                    i3 -= ((20 * ty) / 100) | 0;
                } else if (character.animationCurrent === 9) {
                    i3 += ((20 * ty) / 100) | 0;
                }

                let i4 = ((character.healthCurrent * 30) / character.healthMax) | 0;

                this.healthBarX[this.healthBarCount] = i3 + ((w / 2) | 0);
                this.healthBarY[this.healthBarCount] = y;
                this.healthBarMissing[this.healthBarCount++] = i4;
            }

            if (character.combatTimer > 150) {
                let j3 = x;

                if (character.animationCurrent === 8) {
                    j3 -= ((10 * ty) / 100) | 0;
                } else if (character.animationCurrent === 9) {
                    j3 += ((10 * ty) / 100) | 0;
                }

                this.surface._drawSprite_from3((j3 + ((w / 2) | 0)) - 12, (y + ((h / 2) | 0)) - 12, this.spriteMedia + 11);
                this.surface.drawStringCenter(character.damageTaken.toString(), (j3 + ((w / 2) | 0)) - 1, y + ((h / 2) | 0) + 5, 3, 0xffffff);
            }
        }

        if (character.skullVisible === 1 && character.bubbleTimeout === 0) {
            let k3 = tx + x + ((w / 2) | 0);

            if (character.animationCurrent === 8) {
                k3 -= ((20 * ty) / 100) | 0;
            } else if (character.animationCurrent === 9) {
                k3 += ((20 * ty) / 100) | 0;
            }

            let j4 = ((16 * ty) / 100) | 0;
            let l4 = ((16 * ty) / 100) | 0;

            this.surface._spriteClipping_from5(k3 - ((j4 / 2) | 0), y - ((l4 / 2) | 0) - (((10 * ty) / 100) | 0), j4, l4, this.spriteMedia + 13);
        }
    }

    async loadMedia() {
        let mediaJag = await this.readDataFile('media' + version.MEDIA + '.jag', '2d graphics', 20);

        if (mediaJag === null) {
            this.errorLoadingData = true;
            return;
        }

        let indexDat = Utility.loadData('index.dat', 0, mediaJag);

        this.surface.parseSprite(this.spriteMedia, Utility.loadData('inv1.dat', 0, mediaJag), indexDat, 1);
        this.surface.parseSprite(this.spriteMedia + 1, Utility.loadData('inv2.dat', 0, mediaJag), indexDat, 6);
        this.surface.parseSprite(this.spriteMedia + 9, Utility.loadData('bubble.dat', 0, mediaJag), indexDat, 1);
        this.surface.parseSprite(this.spriteMedia + 10, Utility.loadData('runescape.dat', 0, mediaJag), indexDat, 1);
        this.surface.parseSprite(this.spriteMedia + 11, Utility.loadData('splat.dat', 0, mediaJag), indexDat, 3);
        this.surface.parseSprite(this.spriteMedia + 14, Utility.loadData('icon.dat', 0, mediaJag), indexDat, 8);
        this.surface.parseSprite(this.spriteMedia + 22, Utility.loadData('hbar.dat', 0, mediaJag), indexDat, 1);
        this.surface.parseSprite(this.spriteMedia + 23, Utility.loadData('hbar2.dat', 0, mediaJag), indexDat, 1);
        this.surface.parseSprite(this.spriteMedia + 24, Utility.loadData('compass.dat', 0, mediaJag), indexDat, 1);
        this.surface.parseSprite(this.spriteMedia + 25, Utility.loadData('buttons.dat', 0, mediaJag), indexDat, 2);
        this.surface.parseSprite(this.spriteUtil, Utility.loadData('scrollbar.dat', 0, mediaJag), indexDat, 2);
        this.surface.parseSprite(this.spriteUtil + 2, Utility.loadData('corners.dat', 0, mediaJag), indexDat, 4);
        this.surface.parseSprite(this.spriteUtil + 6, Utility.loadData('arrows.dat', 0, mediaJag), indexDat, 2);
        this.surface.parseSprite(this.spriteProjectile, Utility.loadData('projectile.dat', 0, mediaJag), indexDat, GameData.projectileSprite);

        let i = GameData.itemSpriteCount;

        for (let j = 1; i > 0; j++) {
            let k = i;
            i -= 30;

            if (k > 30) {
                k = 30;
            }

            this.surface.parseSprite(this.spriteItem + (j - 1) * 30, Utility.loadData('objects' + j + '.dat', 0, mediaJag), indexDat, k);
        }

        this.surface.loadSprite(this.spriteMedia);
        this.surface.loadSprite(this.spriteMedia + 9);

        for (let l = 11; l <= 26; l++) {
            this.surface.loadSprite(this.spriteMedia + l);
        }

        for (let i1 = 0; i1 < GameData.projectileSprite; i1++) {
            this.surface.loadSprite(this.spriteProjectile + i1);
        }

        for (let j1 = 0; j1 < GameData.itemSpriteCount; j1++) {
            this.surface.loadSprite(this.spriteItem + j1);
        }
    }

    drawChatMessageTabs() {
        this.surface._drawSprite_from3(0, this.gameHeight - 4, this.spriteMedia + 23);

        let col = Surface.rgbToLong(200, 200, 255);

        if (this.messageTabSelected === 0) {
            col = Surface.rgbToLong(255, 200, 50);
        }

        if (this.messageTabFlashAll % 30 > 15) {
            col = Surface.rgbToLong(255, 50, 50);
        }

        this.surface.drawStringCenter('All messages', 54, this.gameHeight + 6, 0, col);
        col = Surface.rgbToLong(200, 200, 255);

        if (this.messageTabSelected === 1) {
            col = Surface.rgbToLong(255, 200, 50);
        }

        if (this.messageTabFlashHistory % 30 > 15) {
            col = Surface.rgbToLong(255, 50, 50);
        }

        this.surface.drawStringCenter('Chat history', 155, this.gameHeight + 6, 0, col);
        col = Surface.rgbToLong(200, 200, 255);

        if (this.messageTabSelected === 2) {
            col = Surface.rgbToLong(255, 200, 50);
        }

        if (this.messageTabFlashQuest % 30 > 15) {
            col = Surface.rgbToLong(255, 50, 50);
        }

        this.surface.drawStringCenter('Quest history', 255, this.gameHeight + 6, 0, col);
        col = Surface.rgbToLong(200, 200, 255);

        if (this.messageTabSelected === 3) {
            col = Surface.rgbToLong(255, 200, 50);
        }

        if (this.messageTabFlashPrivate % 30 > 15) {
            col = Surface.rgbToLong(255, 50, 50);
        }

        this.surface.drawStringCenter('Private history', 355, this.gameHeight + 6, 0, col);
        this.surface.drawStringCenter('Report abuse', 457, this.gameHeight + 6, 0, 0xffffff);
    }

    async startGame() {
        this.port = this.port || 43595;
        this.maxReadTries = 1000;
        GameConnection.clientVersion = version.CLIENT;

        await this.loadGameConfig();

        if (this.errorLoadingData) {
            return;
        }

        this.spriteMedia = 2000;
        this.spriteUtil = this.spriteMedia + 100;
        this.spriteItem = this.spriteUtil + 50;
        this.spriteLogo = this.spriteItem + 1000;
        this.spriteProjectile = this.spriteLogo + 10;
        this.spriteTexture = this.spriteProjectile + 50;
        this.spriteTextureWorld = this.spriteTexture + 10;

        this.graphics = this.getGraphics();

        this.setTargetFps(50);

        this.surface = new Surface(this.gameWidth, this.gameHeight + 12, 4000,
            this);
        this.surface.mudclientref = this;
        this.surface.setBounds(0, 0, this.gameWidth, this.gameHeight + 12);

        Panel.drawBackgroundArrow = false;
        Panel.baseSpriteStart = this.spriteUtil;

        this.panelMagic = new Panel(this.surface, 5);

        let x = this.surface.width2 - 199;
        let y = 36;

        this.controlListMagic = this.panelMagic.addTextListInteractive(x, y + 24, 196, 90, 1, 500, true);
        this.panelSocialList = new Panel(this.surface, 5);
        this.controlListSocialPlayers = this.panelSocialList.addTextListInteractive(x, y + 40, 196, 126, 1, 500, true);
        this.panelQuestList = new Panel(this.surface, 5);
        this.controlListQuest = this.panelQuestList.addTextListInteractive(x, y + 24, 196, 251, 1, 500, true);

        await this.loadMedia();

        if (this.errorLoadingData) {
            return;
        }

        await this.loadEntities();

        if (this.errorLoadingData) {
            return;
        }

        this.scene = new Scene(this.surface, 15000, 15000, 1000);

        // this used to be in scene's constructor
        this.scene.view = GameModel._from2(1000 * 1000, 1000);

        this.scene.setBounds((this.gameWidth / 2) | 0, (this.gameHeight / 2) | 0, (this.gameWidth / 2) | 0, (this.gameHeight / 2) | 0, this.gameWidth, this.const_9);
        this.scene.clipFar3d = 2400;
        this.scene.clipFar2d = 2400;
        this.scene.fogZFalloff = 1;
        this.scene.fogZDistance = 2300;
        this.scene._setLight_from3(-50, -10, -50);
        this.world = new World(this.scene, this.surface);
        this.world.baseMediaSprite = this.spriteMedia;

        await this.loadTextures();

        if (this.errorLoadingData) {
            return;
        }

        await this.loadModels();

        if (this.errorLoadingData) {
            return;
        }

        await this.loadMaps();

        if (this.errorLoadingData) {
            return;
        }

        if (this.members) {
            await this.loadSounds();
        }

        if (!this.errorLoadingData) {
            this.showLoadingProgress(100, 'Starting game...');
            this.createMessageTabPanel();
            this.createLoginPanels();
            this.createAppearancePanel();
            this.resetLoginScreenVariables();
            this.renderLoginScreenViewports();
        }
    }

    hasInventoryItems(id, mincount) {
        if (id === 31 && (this.isItemEquipped(197) || this.isItemEquipped(615) || this.isItemEquipped(682))) {
            return true;
        }

        if (id === 32 && (this.isItemEquipped(102) || this.isItemEquipped(616) || this.isItemEquipped(683))) {
            return true;
        }

        if (id === 33 && (this.isItemEquipped(101) || this.isItemEquipped(617) || this.isItemEquipped(684))) {
            return true;
        }

        if (id === 34 && (this.isItemEquipped(103) || this.isItemEquipped(618) || this.isItemEquipped(685))) {
            return true;
        }

        return this.getInventoryCount(id) >= mincount;
    }

    getHostnameIP(i) {
        return Utility.ipToString(i);
    }

    cantLogout() {
        this.logoutTimeout = 0;
        this.showMessage('@cya@Sorry, you can\'t logout at the moment', 3);
    }

    drawGame() {
        if (this.deathScreenTimeout !== 0) {
            this.surface.fadeToBlack();
            this.surface.drawStringCenter('Oh dear! You are dead...', (this.gameWidth / 2) | 0, (this.gameHeight / 2) | 0, 7, 0xff0000);
            this.drawChatMessageTabs();
            this.surface.draw(this.graphics, 0, 0);

            return;
        }

        if (this.showAppearanceChange) {
            this.drawAppearancePanelCharacterSprites();
            return;
        }

        if (this.isSleeping) {
            this.surface.fadeToBlack();

            if (Math.random() < 0.14999999999999999) {
                this.surface.drawStringCenter('ZZZ', (Math.random() * 80) | 0, (Math.random() * 334) | 0, 5, (Math.random() * 16777215) | 0);
            }

            if (Math.random() < 0.14999999999999999) {
                this.surface.drawStringCenter('ZZZ', 512 - ((Math.random() * 80) | 0), (Math.random() * 334) | 0, 5, (Math.random() * 16777215) | 0);
            }

            this.surface.drawBox(((this.gameWidth / 2) | 0) - 100, 160, 200, 40, 0);
            this.surface.drawStringCenter('You are sleeping', (this.gameWidth / 2) | 0, 50, 7, 0xffff00);
            this.surface.drawStringCenter('Fatigue: ' + (((this.fatigueSleeping * 100) / 750) | 0) + '%', (this.gameWidth / 2) | 0, 90, 7, 0xffff00);
            this.surface.drawStringCenter('When you want to wake up just use your', (this.gameWidth / 2) | 0, 140, 5, 0xffffff);
            this.surface.drawStringCenter('keyboard to type the word in the box below', (this.gameWidth / 2) | 0, 160, 5, 0xffffff);
            this.surface.drawStringCenter(this.inputTextCurrent + '*', (this.gameWidth / 2) | 0, 180, 5, 65535);

            if (this.sleepingStatusText === null) {
                this.surface._drawSprite_from3(((this.gameWidth / 2) | 0) - 127, 230, this.spriteTexture + 1);
            } else {
                this.surface.drawStringCenter(this.sleepingStatusText, (this.gameWidth / 2) | 0, 260, 5, 0xff0000);
            }

            this.surface.drawBoxEdge(((this.gameWidth / 2) | 0) - 128, 229, 257, 42, 0xffffff);
            this.drawChatMessageTabs();
            this.surface.drawStringCenter('If you can\'t read the word', (this.gameWidth / 2) | 0, 290, 1, 0xffffff);
            this.surface.drawStringCenter('@yel@click here@whi@ to get a different one', (this.gameWidth / 2) | 0, 305, 1, 0xffffff);
            this.surface.draw(this.graphics, 0, 0);

            return;
        }

        if (!this.world.playerAlive) {
            return;
        }

        for (let i = 0; i < 64; i++) {
            this.scene.removeModel(this.world.roofModels[this.lastHeightOffset][i]);

            if (this.lastHeightOffset === 0) {
                this.scene.removeModel(this.world.wallModels[1][i]);
                this.scene.removeModel(this.world.roofModels[1][i]);
                this.scene.removeModel(this.world.wallModels[2][i]);
                this.scene.removeModel(this.world.roofModels[2][i]);
            }

            if (this.options.showRoofs) {
                this.fogOfWar = true;

                if (this.lastHeightOffset === 0 && (this.world.objectAdjacency.get((this.localPlayer.currentX / 128) | 0, (this.localPlayer.currentY / 128) | 0) & 128) === 0) {
                    this.scene.addModel(this.world.roofModels[this.lastHeightOffset][i]);

                    if (this.lastHeightOffset === 0) {
                        this.scene.addModel(this.world.wallModels[1][i]);
                        this.scene.addModel(this.world.roofModels[1][i]);
                        this.scene.addModel(this.world.wallModels[2][i]);
                        this.scene.addModel(this.world.roofModels[2][i]);
                    }

                    this.fogOfWar = false;
                }
            }
        }

        if (this.objectAnimationNumberFireLightningSpell !== this.lastObjectAnimationNumberFireLightningSpell) {
            this.lastObjectAnimationNumberFireLightningSpell = this.objectAnimationNumberFireLightningSpell;

            for (let j = 0; j < this.objectCount; j++) {
                if (this.objectId[j] === 97) {
                    this.updateObjectAnimation(j, 'firea' + (this.objectAnimationNumberFireLightningSpell + 1));
                }

                if (this.objectId[j] === 274) {
                    this.updateObjectAnimation(j, 'fireplacea' + (this.objectAnimationNumberFireLightningSpell + 1));
                }

                if (this.objectId[j] === 1031) {
                    this.updateObjectAnimation(j, 'lightning' + (this.objectAnimationNumberFireLightningSpell + 1));
                }

                if (this.objectId[j] === 1036) {
                    this.updateObjectAnimation(j, 'firespell' + (this.objectAnimationNumberFireLightningSpell + 1));
                }

                if (this.objectId[j] === 1147) {
                    this.updateObjectAnimation(j, 'spellcharge' + (this.objectAnimationNumberFireLightningSpell + 1));
                }
            }
        }

        if (this.objectAnimationNumberTorch !== this.lastObjectAnimationNumberTorch) {
            this.lastObjectAnimationNumberTorch = this.objectAnimationNumberTorch;

            for (let k = 0; k < this.objectCount; k++) {
                if (this.objectId[k] === 51) {
                    this.updateObjectAnimation(k, 'torcha' + (this.objectAnimationNumberTorch + 1));
                }

                if (this.objectId[k] === 143) {
                    this.updateObjectAnimation(k, 'skulltorcha' + (this.objectAnimationNumberTorch + 1));
                }
            }
        }

        if (this.objectAnimationNumberClaw !== this.lastObjectAnimationNumberClaw) {
            this.lastObjectAnimationNumberClaw = this.objectAnimationNumberClaw;

            for (let l = 0; l < this.objectCount; l++) {
                if (this.objectId[l] === 1142) {
                    this.updateObjectAnimation(l, 'clawspell' + (this.objectAnimationNumberClaw + 1));
                }
            }

        }

        this.scene.reduceSprites(this.spriteCount);
        this.spriteCount = 0;

        for (let i = 0; i < this.playerCount; i++) {
            let character = this.players[i];

            if (character.colourBottom !== 255) {
                let x = character.currentX;
                let y = character.currentY;
                let elev = -this.world.getElevation(x, y);
                let id = this.scene.addSprite(5000 + i, x, elev, y, 145, 220, i + 10000);

                this.spriteCount++;

                if (character === this.localPlayer) {
                    this.scene.setLocalPlayer(id);
                }

                if (character.animationCurrent === 8) {
                    this.scene.setSpriteTranslateX(id, -30);
                }

                if (character.animationCurrent === 9) {
                    this.scene.setSpriteTranslateX(id, 30);
                }
            }
        }

        for (let i = 0; i < this.playerCount; i++) {
            let player = this.players[i];

            if (player.projectileRange > 0) {
                let character = null;

                if (player.attackingNpcServerIndex !== -1) {
                    character = this.npcsServer[player.attackingNpcServerIndex];
                } else if (player.attackingPlayerServerIndex !== -1) {
                    character = this.playerServer[player.attackingPlayerServerIndex];
                }

                if (character !== null) {
                    let sx = player.currentX;
                    let sy = player.currentY;
                    let selev = -this.world.getElevation(sx, sy) - 110;
                    let dx = character.currentX;
                    let dy = character.currentY;
                    let delev = -((this.world.getElevation(dx, dy) - GameData.npcHeight[character.npcId] / 2) | 0);
                    let rx = ((sx * player.projectileRange + dx * (this.projectileMaxRange - player.projectileRange)) / this.projectileMaxRange) | 0;
                    let rz = ((selev * player.projectileRange + delev * (this.projectileMaxRange - player.projectileRange)) / this.projectileMaxRange) | 0;
                    let ry = ((sy * player.projectileRange + dy * (this.projectileMaxRange - player.projectileRange)) / this.projectileMaxRange) | 0;

                    this.scene.addSprite(this.spriteProjectile + player.incomingProjectileSprite, rx, rz, ry, 32, 32, 0);
                    this.spriteCount++;
                }
            }
        }

        for (let i = 0; i < this.npcCount; i++) {
            let character_3 = this.npcs[i];
            let i3 = character_3.currentX;
            let j4 = character_3.currentY;
            let i7 = -this.world.getElevation(i3, j4);
            let i9 = this.scene.addSprite(20000 + i, i3, i7, j4, GameData.npcWidth[character_3.npcId], GameData.npcHeight[character_3.npcId], i + 30000);

            this.spriteCount++;

            if (character_3.animationCurrent === 8) {
                this.scene.setSpriteTranslateX(i9, -30);
            }

            if (character_3.animationCurrent === 9) {
                this.scene.setSpriteTranslateX(i9, 30);
            }
        }

        for (let i = 0; i < this.groundItemCount; i++) {
            let x = this.groundItemX[i] * this.magicLoc + 64;
            let y = this.groundItemY[i] * this.magicLoc + 64;

            this.scene.addSprite(40000 + this.groundItemId[i], x, -this.world.getElevation(x, y) - this.groundItemZ[i], y, 96, 64, i + 20000);
            this.spriteCount++;
        }

        for (let i = 0; i < this.teleportBubbleCount; i++) {
            let l4 = this.teleportBubbleX[i] * this.magicLoc + 64;
            let j7 = this.teleportBubbleY[i] * this.magicLoc + 64;
            let j9 = this.teleportBubbleType[i];

            if (j9 === 0) {
                this.scene.addSprite(50000 + i, l4, -this.world.getElevation(l4, j7), j7, 128, 256, i + 50000);
                this.spriteCount++;
            }

            if (j9 === 1) {
                this.scene.addSprite(50000 + i, l4, -this.world.getElevation(l4, j7), j7, 128, 64, i + 50000);
                this.spriteCount++;
            }
        }

        this.surface.interlace = false;
        this.surface.blackScreen();
        this.surface.interlace = this.interlace;

        if (this.lastHeightOffset === 3) {
            let i5 = 40 + ((Math.random() * 3) | 0);
            let k7 = 40 + ((Math.random() * 7) | 0);

            this.scene._setLight_from5(i5, k7, -50, -10, -50);
        }

        this.itemsAboveHeadCount = 0;
        this.receivedMessagesCount = 0;
        this.healthBarCount = 0;

        if (this.cameraAutoAngleDebug) {
            if (this.optionCameraModeAuto && !this.fogOfWar) {
                let j5 = this.cameraAngle;

                this.autoRotateCamera();

                if (this.cameraAngle !== j5) {
                    this.cameraAutoRotatePlayerX = this.localPlayer.currentX;
                    this.cameraAutoRotatePlayerY = this.localPlayer.currentY;
                }
            }

            this.scene.clipFar3d = 3000;
            this.scene.clipFar2d = 3000;
            this.scene.fogZFalloff = 1;
            this.scene.fogZDistance = 2800;
            this.cameraRotation = this.cameraAngle * 32;

            let x = this.cameraAutoRotatePlayerX + this.cameraRotationX;
            let y = this.cameraAutoRotatePlayerY + this.cameraRotationY;

            this.scene.setCamera(x, -this.world.getElevation(x, y), y, 912, this.cameraRotation * 4, 0, 2000);
        } else {
            if (this.optionCameraModeAuto && !this.fogOfWar) {
                this.autoRotateCamera();
            }

            if (!this.interlace) {
                this.scene.clipFar3d = 2400;
                this.scene.clipFar2d = 2400;
                this.scene.fogZFalloff = 1;
                this.scene.fogZDistance = 2300;
            } else {
                this.scene.clipFar3d = 2200;
                this.scene.clipFar2d = 2200;
                this.scene.fogZFalloff = 1;
                this.scene.fogZDistance = 2100;
            }

            if (this.cameraZoom > ZOOM_OUTDOORS) {
                this.scene.clipFar3d += 1400;
                this.scene.clipFar2d += 1400;
                this.scene.fogZDistance += 1400;
            }

            let x = this.cameraAutoRotatePlayerX + this.cameraRotationX;
            let y = this.cameraAutoRotatePlayerY + this.cameraRotationY;

            this.scene.setCamera(x, -this.world.getElevation(x, y), y, 912, this.cameraRotation * 4, 0, this.cameraZoom * 2);
        }

        this.scene.render();
        this.drawAboveHeadStuff();

        if (this.mouseClickXStep > 0) {
            this.surface._drawSprite_from3(this.mouseClickXX - 8, this.mouseClickXY - 8, this.spriteMedia + 14 + (((24 - this.mouseClickXStep) / 6) | 0));
        }

        if (this.mouseClickXStep < 0) {
            this.surface._drawSprite_from3(this.mouseClickXX - 8, this.mouseClickXY - 8, this.spriteMedia + 18 + (((24 + this.mouseClickXStep) / 6) | 0));
        }

        if (this.systemUpdate !== 0) {
            let i6 = ((this.systemUpdate / 50) | 0);
            let j8 = (i6 / 60) | 0;

            i6 %= 60;

            if (i6 < 10) {
                this.surface.drawStringCenter('System update in: ' + j8 + ':0' + i6, 256, this.gameHeight - 7, 1, 0xffff00);
            } else {
                this.surface.drawStringCenter('System update in: ' + j8 + ':' + i6, 256, this.gameHeight - 7, 1, 0xffff00);
            }
        }

        if (!this.loadingArea) {
            let j6 = 2203 - (this.localRegionY + this.planeHeight + this.regionY);

            if (this.localRegionX + this.planeWidth + this.regionX >= 2640) {
                j6 = -50;
            }

            if (j6 > 0) {
                let wildlvl = 1 + ((j6 / 6) | 0);

                this.surface._drawSprite_from3(453, this.gameHeight - 56, this.spriteMedia + 13);
                this.surface.drawStringCenter('Wilderness', 465, this.gameHeight - 20, 1, 0xffff00);
                this.surface.drawStringCenter('Level: ' + wildlvl, 465, this.gameHeight - 7, 1, 0xffff00);

                if (this.showUiWildWarn === 0) {
                    this.showUiWildWarn = 2;
                }
            }

            if (this.showUiWildWarn === 0 && j6 > -10 && j6 <= 0) {
                this.showUiWildWarn = 1;
            }
        }

        if (this.messageTabSelected === 0) {
            for (let k6 = 0; k6 < 5; k6++) {
                if (this.messageHistoryTimeout[k6] > 0) {
                    let s = this.messageHistory[k6];
                    this.surface.drawString(s, 7, this.gameHeight - 18 - k6 * 12, 1, 0xffff00);
                }
            }
        }

        this.panelMessageTabs.hide(this.controlTextListChat);
        this.panelMessageTabs.hide(this.controlTextListQuest);
        this.panelMessageTabs.hide(this.controlTextListPrivate);

        if (this.messageTabSelected === 1) {
            this.panelMessageTabs.show(this.controlTextListChat);
        } else if (this.messageTabSelected === 2) {
            this.panelMessageTabs.show(this.controlTextListQuest);
        } else if (this.messageTabSelected === 3) {
            this.panelMessageTabs.show(this.controlTextListPrivate);
        }

        Panel.textListEntryHeightMod = 2;
        this.panelMessageTabs.drawPanel();
        Panel.textListEntryHeightMod = 0;
        this.surface._drawSpriteAlpha_from4(this.surface.width2 - 3 - 197, 3, this.spriteMedia, 128);
        this.drawUi();
        this.surface.loggedIn = false;
        this.drawChatMessageTabs();
        this.surface.draw(this.graphics, 0, 0);
    }

    async loadSounds() {
        try {
            this.soundData = await this.readDataFile('sounds' + version.SOUNDS + '.mem', 'Sound effects', 90);
            this.audioPlayer = new StreamAudioPlayer();
        } catch (e) {
            console.error(e);
        }
    }

    isItemEquipped(i) {
        for (let j = 0; j < this.inventoryItemsCount; j++) {
            if (this.inventoryItemId[j] === i && this.inventoryEquipped[j] === 1) {
                return true;
            }
        }

        return false;
    }

    async loadEntities() {
        let entityJag = await this.readDataFile('entity' + version.ENTITY + '.jag', 'people and monsters', 30);

        if (!entityJag) {
            this.errorLoadingData = true;
            return;
        }

        let indexDat = Utility.loadData('index.dat', 0, entityJag);

        let entityJagMem = null;
        let indexDatMem = null;

        if (this.members) {
            entityJagMem = await this.readDataFile('entity' + version.ENTITY + '.mem', 'member graphics', 45);

            if (!entityJagMem) {
                this.errorLoadingData = true;
                return;
            }

            indexDatMem = Utility.loadData('index.dat', 0, entityJagMem);
        }

        let frameCount = 0;
        this.animationIndex = 0;

        label0:
        for (let j = 0; j < GameData.animationCount; j++) {
            let animationName = GameData.animationName[j];

            for (let k = 0; k < j; k++) {
                if (GameData.animationName[k].toLowerCase() !== animationName.toLowerCase()) {
                    continue;
                }

                GameData.animationNumber[j] = GameData.animationNumber[k];
                continue label0;
            }

            let animationDat = Utility.loadData(animationName + '.dat', 0, entityJag);
            let animationIndex = indexDat;

            if (animationDat === null && this.members) {
                animationDat = Utility.loadData(animationName + '.dat', 0, entityJagMem);
                animationIndex = indexDatMem;
            }

            if (animationDat !== null) {
                this.surface.parseSprite(this.animationIndex, animationDat, animationIndex, 15);

                frameCount += 15;

                if (GameData.animationHasA[j] === 1) {
                    let aDat = Utility.loadData(animationName + 'a.dat', 0, entityJag);
                    let aIndex = indexDat;

                    if (aDat === null && this.members) {
                        aDat = Utility.loadData(animationName + 'a.dat', 0, entityJagMem);
                        aIndex = indexDatMem;
                    }

                    this.surface.parseSprite(this.animationIndex + 15, aDat, aIndex, 3);
                    frameCount += 3;
                }

                if (GameData.animationHasF[j] === 1) {
                    let fDat = Utility.loadData(animationName + 'f.dat', 0, entityJag);
                    let fIndex = indexDat;

                    if (fDat === null && this.members) {
                        fDat = Utility.loadData(animationName + 'f.dat', 0, entityJagMem);
                        fIndex = indexDatMem;
                    }

                    this.surface.parseSprite(this.animationIndex + 18, fDat, fIndex, 9);
                    frameCount += 9;
                }

                if (GameData.animationSomething[j] !== 0) {
                    for (let l = this.animationIndex; l < this.animationIndex + 27; l++) {
                        this.surface.loadSprite(l);
                    }
                }
            }

            GameData.animationNumber[j] = this.animationIndex;
            this.animationIndex += 27;
        }

        console.log('Loaded: ' + frameCount + ' frames of animation');
    }

    handleAppearancePanelControls() {
        this.panelAppearance.handleMouse(this.mouseX, this.mouseY, this.lastMouseButtonDown, this.mouseButtonDown);

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceHead1)) {
            do {
                this.appearanceHeadType = ((this.appearanceHeadType - 1) + GameData.animationCount) % GameData.animationCount;
            } while ((GameData.animationSomething[this.appearanceHeadType] & 3) !== 1 || (GameData.animationSomething[this.appearanceHeadType] & 4 * this.appearanceHeadGender) === 0);
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceHead2)) {
            do {
                this.appearanceHeadType = (this.appearanceHeadType + 1) % GameData.animationCount;
            } while ((GameData.animationSomething[this.appearanceHeadType] & 3) !== 1 || (GameData.animationSomething[this.appearanceHeadType] & 4 * this.appearanceHeadGender) === 0);
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceHair1)) {
            this.appearanceHairColour = ((this.appearanceHairColour - 1) + this.characterHairColours.length) % this.characterHairColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceHair2)) {
            this.appearanceHairColour = (this.appearanceHairColour + 1) % this.characterHairColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceGender1) || this.panelAppearance.isClicked(this.controlButtonAppearanceGender2)) {
            for (this.appearanceHeadGender = 3 - this.appearanceHeadGender; (GameData.animationSomething[this.appearanceHeadType] & 3) !== 1 || (GameData.animationSomething[this.appearanceHeadType] & 4 * this.appearanceHeadGender) === 0; this.appearanceHeadType = (this.appearanceHeadType + 1) % GameData.animationCount);
            for (; (GameData.animationSomething[this.appearanceBodyGender] & 3) !== 2 || (GameData.animationSomething[this.appearanceBodyGender] & 4 * this.appearanceHeadGender) === 0; this.appearanceBodyGender = (this.appearanceBodyGender + 1) % GameData.animationCount);
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceTop1)) {
            this.appearanceTopColour = ((this.appearanceTopColour - 1) + this.characterTopBottomColours.length) % this.characterTopBottomColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceTop2)) {
            this.appearanceTopColour = (this.appearanceTopColour + 1) % this.characterTopBottomColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceSkin1)) {
            this.appearanceSkinColour = ((this.appearanceSkinColour - 1) + this.characterSkinColours.length) % this.characterSkinColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceSkin2)) {
            this.appearanceSkinColour = (this.appearanceSkinColour + 1) % this.characterSkinColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceBottom1)) {
            this.appearanceBottomColour = ((this.appearanceBottomColour - 1) + this.characterTopBottomColours.length) % this.characterTopBottomColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceBottom2)) {
            this.appearanceBottomColour = (this.appearanceBottomColour + 1) % this.characterTopBottomColours.length;
        }

        if (this.panelAppearance.isClicked(this.controlButtonAppearanceAccept)) {
            this.packetStream.newPacket(clientOpcodes.APPEARANCE);
            this.packetStream.putByte(this.appearanceHeadGender);
            this.packetStream.putByte(this.appearanceHeadType);
            this.packetStream.putByte(this.appearanceBodyGender);
            this.packetStream.putByte(this.appearance2Colour);
            this.packetStream.putByte(this.appearanceHairColour);
            this.packetStream.putByte(this.appearanceTopColour);
            this.packetStream.putByte(this.appearanceBottomColour);
            this.packetStream.putByte(this.appearanceSkinColour);
            this.packetStream.sendPacket();
            this.surface.blackScreen();
            this.showAppearanceChange = false;
        }
    }

    draw() {
        if (this.errorLoadingData) {
            const g = this.getGraphics();

            g.setColor(Color.black);
            g.fillRect(0, 0, 512, 356);
            g.setFont(new Font('Helvetica', 1, 16));
            g.setColor(Color.yellow);

            let y = 35;

            g.drawString('Sorry, an error has occured whilst loading RuneScape', 30, y);
            y += 50;
            g.setColor(Color.white);
            g.drawString('To fix this try the following (in order):', 30, y);
            y += 50;
            g.setColor(Color.white);
            g.setFont(new Font('Helvetica', 1, 12));
            g.drawString('1: Try closing ALL open web-browser windows, and reloading', 30, y);
            y += 30;
            g.drawString('2: Try clearing your web-browsers cache from tools->internet options', 30, y);
            y += 30;
            g.drawString('3: Try using a different game-world', 30, y);
            y += 30;
            g.drawString('4: Try rebooting your computer', 30, y);
            y += 30;
            g.drawString('5: Try selecting a different version of Java from the play-game menu', 30, y);

            this.setTargetFps(1);

            return;
        }

        if (this.errorLoadingCodebase) {
            const g = this.getGraphics();

            g.setColor(Color.black);
            g.fillRect(0, 0, 512, 356);
            g.setFont(new Font('Helvetica', 1, 20));
            g.setColor(Color.white);
            g.drawString('Error - unable to load game!', 50, 50);
            g.drawString('To play RuneScape make sure you play from', 50, 100);
            g.drawString('http://www.runescape.com', 50, 150);

            this.setTargetFps(1);

            return;
        }

        if (this.errorLoadingMemory) {
            const g = this.getGraphics();

            g.setColor(Color.black);
            g.fillRect(0, 0, 512, 356);
            g.setFont(new Font('Helvetica', 1, 20));
            g.setColor(Color.white);
            g.drawString('Error - out of memory!', 50, 50);
            g.drawString('Close ALL unnecessary programs', 50, 100);
            g.drawString('and windows before loading the game', 50, 150);
            g.drawString('RuneScape needs about 48meg of spare RAM', 50, 200);

            this.setTargetFps(1);

            return;
        }

        try {
            if (this.loggedIn === 0) {
                this.surface.loggedIn = false;
                this.drawLoginScreens();
            } else if (this.loggedIn === 1) {
                this.surface.loggedIn = true;
                this.drawGame();
            }
        } catch (e) {
            // OutOfMemory
            console.error(e);
            this.disposeAndCollect();
            this.errorLoadingMemory = true;
        }
    }

    onClosing() {
        this.closeConnection();
        this.disposeAndCollect();

        if (this.audioPlayer) {
            this.audioPlayer.stopPlayer();
        }
    }

    drawDialogDuelConfirm() {
        let dialogX = 22;
        let dialogY = 36;

        this.surface.drawBox(dialogX, dialogY, 468, 16, 192);
        this.surface.drawBoxAlpha(dialogX, dialogY + 16, 468, 246, 0x989898, 160);
        this.surface.drawStringCenter('Please confirm your duel with @yel@' + Utility.hashToUsername(this.duelOpponentNameHash), dialogX + 234, dialogY + 12, 1, 0xffffff);
        this.surface.drawStringCenter('Your stake:', dialogX + 117, dialogY + 30, 1, 0xffff00);

        for (let itemIndex = 0; itemIndex < this.duelItemsCount; itemIndex++) {
            let s = GameData.itemName[this.duelItems[itemIndex]];

            if (GameData.itemStackable[this.duelItems[itemIndex]] === 0) {
                s = s + ' x ' + Utility.formatConfirmAmount(this.duelItemCount[itemIndex]);
            }

            this.surface.drawStringCenter(s, dialogX + 117, dialogY + 42 + itemIndex * 12, 1, 0xffffff);
        }

        if (this.duelItemsCount === 0) {
            this.surface.drawStringCenter('Nothing!', dialogX + 117, dialogY + 42, 1, 0xffffff);
        }

        this.surface.drawStringCenter('Your opponent\'s stake:', dialogX + 351, dialogY + 30, 1, 0xffff00);

        for (let itemIndex = 0; itemIndex < this.duelOpponentItemsCount; itemIndex++) {
            let s1 = GameData.itemName[this.duelOpponentItems[itemIndex]];

            if (GameData.itemStackable[this.duelOpponentItems[itemIndex]] === 0) {
                s1 = s1 + ' x ' + Utility.formatConfirmAmount(this.duelOpponentItemCount[itemIndex]);
            }

            this.surface.drawStringCenter(s1, dialogX + 351, dialogY + 42 + itemIndex * 12, 1, 0xffffff);
        }

        if (this.duelOpponentItemsCount === 0) {
            this.surface.drawStringCenter('Nothing!', dialogX + 351, dialogY + 42, 1, 0xffffff);
        }

        if (this.duelOptionRetreat === 0) {
            this.surface.drawStringCenter('You can retreat from this duel', dialogX + 234, dialogY + 180, 1, 65280);
        } else {
            this.surface.drawStringCenter('No retreat is possible!', dialogX + 234, dialogY + 180, 1, 0xff0000);
        }

        if (this.duelOptionMagic === 0) {
            this.surface.drawStringCenter('Magic may be used', dialogX + 234, dialogY + 192, 1, 65280);
        } else {
            this.surface.drawStringCenter('Magic cannot be used', dialogX + 234, dialogY + 192, 1, 0xff0000);
        }

        if (this.duelOptionPrayer === 0) {
            this.surface.drawStringCenter('Prayer may be used', dialogX + 234, dialogY + 204, 1, 65280);
        } else {
            this.surface.drawStringCenter('Prayer cannot be used', dialogX + 234, dialogY + 204, 1, 0xff0000);
        }

        if (this.duelOptionWeapons === 0) {
            this.surface.drawStringCenter('Weapons may be used', dialogX + 234, dialogY + 216, 1, 65280);
        } else {
            this.surface.drawStringCenter('Weapons cannot be used', dialogX + 234, dialogY + 216, 1, 0xff0000);
        }

        this.surface.drawStringCenter('If you are sure click \'Accept\' to begin the duel', dialogX + 234, dialogY + 230, 1, 0xffffff);

        if (!this.duelAccepted) {
            this.surface._drawSprite_from3((dialogX + 118) - 35, dialogY + 238, this.spriteMedia + 25);
            this.surface._drawSprite_from3((dialogX + 352) - 35, dialogY + 238, this.spriteMedia + 26);
        } else {
            this.surface.drawStringCenter('Waiting for other player...', dialogX + 234, dialogY + 250, 1, 0xffff00);
        }

        if (this.mouseButtonClick === 1) {
            if (this.mouseX < dialogX || this.mouseY < dialogY || this.mouseX > dialogX + 468 || this.mouseY > dialogY + 262) {
                this.showDialogDuelConfirm = false;
                this.packetStream.newPacket(clientOpcodes.TRADE_DECLINE);
                this.packetStream.sendPacket();
            }

            if (this.mouseX >= (dialogX + 118) - 35 && this.mouseX <= dialogX + 118 + 70 && this.mouseY >= dialogY + 238 && this.mouseY <= dialogY + 238 + 21) {
                this.duelAccepted = true;
                this.packetStream.newPacket(clientOpcodes.DUEL_CONFIRM_ACCEPT);
                this.packetStream.sendPacket();
            }

            if (this.mouseX >= (dialogX + 352) - 35 && this.mouseX <= dialogX + 353 + 70 && this.mouseY >= dialogY + 238 && this.mouseY <= dialogY + 238 + 21) {
                this.showDialogDuelConfirm = false;
                this.packetStream.newPacket(clientOpcodes.DUEL_DECLINE);
                this.packetStream.sendPacket();
            }

            this.mouseButtonClick = 0;
        }
    }

    walkToGroundItem(i, j, k, l, walkToAction) {
        if (this.walkTo(i, j, k, l, k, l, false, walkToAction)) {
            return;
        } else {
            this._walkToActionSource_from8(i, j, k, l, k, l, true, walkToAction);
            return;
        }
    }

    async loadModels() {
        for (const modelName of ANIMATED_MODELS) {
            GameData.getModelIndex(modelName);
        }

        let modelsBuffer = await this.readDataFile('models' + version.MODELS + '.jag', '3d models', 60);

        if (!modelsBuffer) {
            this.errorLoadingData = true;
            return;
        }

        for (let j = 0; j < GameData.modelCount; j++) {
            let k = Utility.getDataFileOffset(GameData.modelName[j] + '.ob3', modelsBuffer);

            if (k !== 0) {
                this.gameModels[j] = GameModel.fromBytes(modelsBuffer, k);
            } else {
                this.gameModels[j] = GameModel._from2(1, 1);
            }

            if (GameData.modelName[j].toLowerCase() === 'giantcrystal') {
                this.gameModels[j].transparent = true;
            }
        }
    }

    showMessage(message, type) {
        if (type === 2 || type === 4 || type === 6) {
            for (; message.length > 5 && message[0] === '@' && message[4] === '@'; message = message.substring(5)) ;

            let j = message.indexOf(':');

            if (j !== -1) {
                let s1 = message.substring(0, j);
                let l = Utility.usernameToHash(s1);

                for (let i1 = 0; i1 < this.ignoreListCount; i1++) {
                    if (this.ignoreList[i1].equals(l)) {
                        return;
                    }
                }
            }
        }

        if (type === 2) {
            message = '@yel@' + message;
        } else if (type === 3 || type === 4) {
            message = '@whi@' + message;
        } else if (type === 6) {
            message = '@cya@' + message;
        }

        if (this.messageTabSelected !== 0) {
            if (type === 4 || type === 3) {
                this.messageTabFlashAll = 200;
            }

            if (type === 2 && this.messageTabSelected !== 1) {
                this.messageTabFlashHistory = 200;
            }

            if (type === 5 && this.messageTabSelected !== 2) {
                this.messageTabFlashQuest = 200;
            }

            if (type === 6 && this.messageTabSelected !== 3) {
                this.messageTabFlashPrivate = 200;
            }

            if (type === 3 && this.messageTabSelected !== 0) {
                this.messageTabSelected = 0;
            }

            if (type === 6 && this.messageTabSelected !== 3 && this.messageTabSelected !== 0) {
                this.messageTabSelected = 0;
            }
        }

        for (let k = 4; k > 0; k--) {
            this.messageHistory[k] = this.messageHistory[k - 1];
            this.messageHistoryTimeout[k] = this.messageHistoryTimeout[k - 1];
        }

        this.messageHistory[0] = message;
        this.messageHistoryTimeout[0] = 300;

        if (type === 2) {
            if (this.panelMessageTabs.controlFlashText[this.controlTextListChat] === this.panelMessageTabs.controlListEntryCount[this.controlTextListChat] - 4) {
                this.panelMessageTabs.removeListEntry(this.controlTextListChat, message, true);
            } else {
                this.panelMessageTabs.removeListEntry(this.controlTextListChat, message, false);
            }
        } else if (type === 5) {
            if (this.panelMessageTabs.controlFlashText[this.controlTextListQuest] === this.panelMessageTabs.controlListEntryCount[this.controlTextListQuest] - 4) {
                this.panelMessageTabs.removeListEntry(this.controlTextListQuest, message, true);
            } else {
                this.panelMessageTabs.removeListEntry(this.controlTextListQuest, message, false);
            }
        } else if (type === 6) {
            if (this.panelMessageTabs.controlFlashText[this.controlTextListPrivate] === this.panelMessageTabs.controlListEntryCount[this.controlTextListPrivate] - 4) {
                this.panelMessageTabs.removeListEntry(this.controlTextListPrivate, message, true);
                return;
            }

            this.panelMessageTabs.removeListEntry(this.controlTextListPrivate, message, false);
        }
    }

    walkToObject(x, y, id, index) {
        let w = 0;
        let h = 0;

        if (id === 0 || id === 4) {
            w = GameData.objectWidth[index];
            h = GameData.objectHeight[index];
        } else {
            h = GameData.objectWidth[index];
            w = GameData.objectHeight[index];
        }

        if (GameData.objectType[index] === 2 || GameData.objectType[index] === 3) {
            if (id === 0) {
                x--;
                w++;
            } else if (id === 2) {
                h++;
            } else if (id === 4) {
                w++;
            } else if (id === 6) {
                y--;
                h++;
            }

            this._walkToActionSource_from8(this.localRegionX, this.localRegionY, x, y, (x + w) - 1, (y + h) - 1, false, true);
            return;
        } else {
            this._walkToActionSource_from8(this.localRegionX, this.localRegionY, x, y, (x + w) - 1, (y + h) - 1, true, true);
            return;
        }
    }

    getInventoryCount(id) {
        let count = 0;

        for (let k = 0; k < this.inventoryItemsCount; k++) {
            if (this.inventoryItemId[k] === id) {
                if (GameData.itemStackable[id] === 1) {
                    count++;
                } else {
                    count += this.inventoryItemStackCount[k];
                }
            }
        }

        return count;
    }

    async loadTextures() {
        const texturesJag = await this.readDataFile('textures' + version.TEXTURES + '.jag', 'Textures', 50);

        if (!texturesJag) {
            this.errorLoadingData = true;
            return;
        }

        const indexDat = Utility.loadData('index.dat', 0, texturesJag);
        this.scene.allocateTextures(GameData.textureCount, 7, 11);

        for (let i = 0; i < GameData.textureCount; i++) {
            let name = GameData.textureName[i];

            let buff1 = Utility.loadData(name + '.dat', 0, texturesJag);

            this.surface.parseSprite(this.spriteTexture, buff1, indexDat, 1);
            this.surface.drawBox(0, 0, 128, 128, 0xff00ff);
            this.surface._drawSprite_from3(0, 0, this.spriteTexture);

            let wh = this.surface.spriteWidthFull[this.spriteTexture];
            let nameSub = GameData.textureSubtypeName[i];

            if (nameSub !== null && nameSub.length > 0) {
                let buff2 = Utility.loadData(nameSub + '.dat', 0, texturesJag);

                this.surface.parseSprite(this.spriteTexture, buff2, indexDat, 1);
                this.surface._drawSprite_from3(0, 0, this.spriteTexture);
            }

            this.surface._drawSprite_from5(this.spriteTextureWorld + i, 0, 0, wh, wh);

            let area = wh * wh;

            for (let j = 0; j < area; j++) {
                if (this.surface.surfacePixels[this.spriteTextureWorld + i][j] === 65280) {
                    this.surface.surfacePixels[this.spriteTextureWorld + i][j] = 0xff00ff;
                }
            }

            this.surface.drawWorld(this.spriteTextureWorld + i);
            this.scene.defineTexture(i, this.surface.spriteColoursUsed[this.spriteTextureWorld + i], this.surface.spriteColourList[this.spriteTextureWorld + i], ((wh / 64) | 0) - 1);
        }
    }

    handleMouseDown(i, x, y) {
        this.mouseClickXHistory[this.mouseClickCount] = x;
        this.mouseClickYHistory[this.mouseClickCount] = y;
        this.mouseClickCount = this.mouseClickCount + 1 & 8191;

        for (let l = 10; l < 4000; l++) {
            let i1 = this.mouseClickCount - l & 8191;

            if (this.mouseClickXHistory[i1] === x && this.mouseClickYHistory[i1] === y) {
                let flag = false;

                for (let j1 = 1; j1 < l; j1++) {
                    let k1 = this.mouseClickCount - j1 & 8191;
                    let l1 = i1 - j1 & 8191;

                    if (this.mouseClickXHistory[l1] !== x || this.mouseClickYHistory[l1] !== y) {
                        flag = true;
                    }

                    if (this.mouseClickXHistory[k1] !== this.mouseClickXHistory[l1] || this.mouseClickYHistory[k1] !== this.mouseClickYHistory[l1]) {
                        break;
                    }

                    if (j1 === l - 1 && flag && this.combatTimeout === 0 && this.logoutTimeout === 0) {
                        this.sendLogout();
                        return;
                    }
                }
            }
        }
    }

    drawTeleportBubble(x, y, w, h, id) {
        let type = this.teleportBubbleType[id];
        let time = this.teleportBubbleTime[id];

        if (type === 0) {
            let j2 = 255 + time * 5 * 256;
            this.surface.drawCircle(x + ((w / 2) | 0), y + ((h / 2) | 0), 20 + time * 2, j2, 255 - time * 5);
        }

        if (type === 1) {
            let k2 = 0xff0000 + time * 5 * 256;
            this.surface.drawCircle(x + ((w / 2) | 0), y + ((h / 2) | 0), 10 + time, k2, 255 - time * 5);
        }
    }

    showServerMessage(s) {
        if (/^@bor@/.test(s)) {
            this.showMessage(s, 4);
            return;
        }

        if (/^@que@/.test(s)) {
            this.showMessage('@whi@' + s, 5);
            return;
        }

        if (/^@pri@/.test(s)) {
            this.showMessage(s, 6);
            return;
        } else {
            this.showMessage(s, 3);
            return;
        }
    }

    // looks like it just updates objects like torches etc to flip between the
    // different models and appear "animated"
    updateObjectAnimation(i, s) {
        let j = this.objectX[i];
        let k = this.objectY[i];
        let l = j - ((this.localPlayer.currentX / 128) | 0);
        let i1 = k - ((this.localPlayer.currentY / 128) | 0);
        let byte0 = 7;

        if (j >= 0 && k >= 0 && j < 96 && k < 96 && l > -byte0 && l < byte0 && i1 > -byte0 && i1 < byte0) {
            this.scene.removeModel(this.objectModel[i]);

            let j1 = GameData.getModelIndex(s);
            let gameModel = this.gameModels[j1].copy();

            this.scene.addModel(gameModel);
            gameModel._setLight_from6(true, 48, 48, -50, -10, -50);
            gameModel.copyPosition(this.objectModel[i]);
            gameModel.key = i;
            this.objectModel[i] = gameModel;
        }
    }

    createTopMouseMenu() {
        if (this.selectedSpell >= 0 || this.secledtItemInventoryIndex >= 0) {
            this.menuItemText1[this.menuItemsCount] = 'Cancel';
            this.menuItemText2[this.menuItemsCount] = '';
            this.menuType[this.menuItemsCount] = 4000;
            this.menuItemsCount++;
        }

        for (let i = 0; i < this.menuItemsCount; i++) {
            this.menuIndices[i] = i;
        }

        for (let flag = false; !flag; ) {
            flag = true;

            for (let j = 0; j < this.menuItemsCount - 1; j++) {
                let l = this.menuIndices[j];
                let j1 = this.menuIndices[j + 1];

                if (this.menuType[l] > this.menuType[j1]) {
                    this.menuIndices[j] = j1;
                    this.menuIndices[j + 1] = l;
                    flag = false;
                }
            }

        }

        if (this.menuItemsCount > 20) {
            this.menuItemsCount = 20;
        }

        if (this.menuItemsCount > 0) {
            let k = -1;

            for (let i1 = 0; i1 < this.menuItemsCount; i1++) {
                if (this.menuItemText2[this.menuIndices[i1]] === null || this.menuItemText2[this.menuIndices[i1]].length <= 0) {
                    continue;
                }

                k = i1;
                break;
            }

            let s = null;

            if ((this.secledtItemInventoryIndex >= 0 || this.selectedSpell >= 0) && this.menuItemsCount === 1) {
                s = 'Choose a target';
            } else if ((this.secledtItemInventoryIndex >= 0 || this.selectedSpell >= 0) && this.menuItemsCount > 1) {
                s = '@whi@' + this.menuItemText1[this.menuIndices[0]] + ' ' + this.menuItemText2[this.menuIndices[0]];
            } else if (k !== -1) {
                s = this.menuItemText2[this.menuIndices[k]] + ': @whi@' + this.menuItemText1[this.menuIndices[0]];
            }

            if (this.menuItemsCount === 2 && s !== null) {
                s = s + '@whi@ / 1 more option';
            }

            if (this.menuItemsCount > 2 && s !== null) {
                s = s + '@whi@ / ' + (this.menuItemsCount - 1) + ' more options';
            }

            if (s !== null) {
                this.surface.drawString(s, 6, 14, 1, 0xffff00);
            }

            if (!this.optionMouseButtonOne && this.mouseButtonClick === 1 || this.optionMouseButtonOne && this.mouseButtonClick === 1 && this.menuItemsCount === 1) {
                this.menuItemClick(this.menuIndices[0]);
                this.mouseButtonClick = 0;
                return;
            }

            if (!this.optionMouseButtonOne && this.mouseButtonClick === 2 || this.optionMouseButtonOne && this.mouseButtonClick === 1) {
                this.menuHeight = (this.menuItemsCount + 1) * 15;
                this.menuWidth = this.surface.textWidth('Choose option', 1) + 5;

                for (let k1 = 0; k1 < this.menuItemsCount; k1++) {
                    let l1 = this.surface.textWidth(this.menuItemText1[k1] + ' ' + this.menuItemText2[k1], 1) + 5;

                    if (l1 > this.menuWidth) {
                        this.menuWidth = l1;
                    }
                }

                this.menuX = this.mouseX - ((this.menuWidth / 2) | 0);
                this.menuY = this.mouseY - 7;
                this.showRightClickMenu = true;

                if (this.menuX < 0) {
                    this.menuX = 0;
                }

                if (this.menuY < 0) {
                    this.menuY = 0;
                }

                if (this.menuX + this.menuWidth > 510) {
                    this.menuX = 510 - this.menuWidth;
                }

                if (this.menuY + this.menuHeight > 315) {
                    this.menuY = 315 - this.menuHeight;
                }

                this.mouseButtonClick = 0;
            }
        }
    }

    menuItemClick(i) {
        const menuX = this.menuItemX[i];
        const menuY = this.menuItemY[i];
        const menuIndex = this.menuIndex[i];
        const menuSourceIndex = this.menuSourceIndex[i];
        const menuTargetIndex = this.menuTargetIndex[i];
        const menuType = this.menuType[i];

        switch (menuType) {
            case 200:
                this.walkToGroundItem(this.localRegionX, this.localRegionY, menuX,
                    menuY, true);
                this.packetStream.newPacket(clientOpcodes.CAST_GROUNDITEM);
                this.packetStream.putShort(menuX + this.regionX);
                this.packetStream.putShort(menuY + this.regionY);
                this.packetStream.putShort(menuIndex);
                this.packetStream.putShort(menuSourceIndex);
                this.packetStream.sendPacket();
                this.selectedSpell = -1;
                break;
            case 210:
                this.walkToGroundItem(this.localRegionX, this.localRegionY,
                    menuX, menuY, true);
                this.packetStream.newPacket(clientOpcodes.USEWITH_GROUNDITEM);
                this.packetStream.putShort(menuX + this.regionX);
                this.packetStream.putShort(menuY + this.regionY);
                this.packetStream.putShort(menuIndex);
                this.packetStream.putShort(menuSourceIndex);
                this.packetStream.sendPacket();
                this.selectedItemInventoryIndex = -1;
                break;
            case 220:
                this.walkToGroundItem(this.localRegionX, this.localRegionY, menuX,
                    menuY, true);
                this.packetStream.newPacket(clientOpcodes.GROUNDITEM_TAKE);
                this.packetStream.putShort(menuX + this.regionX);
                this.packetStream.putShort(menuY + this.regionY);
                this.packetStream.putShort(menuIndex);
                this.packetStream.putShort(menuSourceIndex);
                this.packetStream.sendPacket();
                break;
            case 3200:
                this.showMessage(GameData.itemDescription[menuIndex], 3);
                break;
            case 300:
                this.walkToWallObject(menuX, menuY, menuIndex);
                this.packetStream.newPacket(clientOpcodes.CAST_WALLOBJECT);
                this.packetStream.putShort(menuX + this.regionX);
                this.packetStream.putShort(menuY + this.regionY);
                this.packetStream.putByte(menuIndex);
                this.packetStream.putShort(menuSourceIndex);
                this.packetStream.sendPacket();
                this.selectedSpell = -1;
                break;
            case 310:
                this.walkToWallObject(menuX, menuY, menuIndex);
                this.packetStream.newPacket(clientOpcodes.USEWITH_WALLOBJECT);
                this.packetStream.putShort(menuX + this.regionX);
                this.packetStream.putShort(menuY + this.regionY);
                this.packetStream.putByte(menuIndex);
                this.packetStream.putShort(menuSourceIndex);
                this.packetStream.sendPacket();
                this.selectedItemInventoryIndex = -1;
                break;
            case 320:
                this.walkToWallObject(menuX, menuY, menuIndex);
                this.packetStream.newPacket(clientOpcodes.WALL_OBJECT_COMMAND1);
                this.packetStream.putShort(menuX + this.regionX);
                this.packetStream.putShort(menuY + this.regionY);
                this.packetStream.putByte(menuIndex);
                this.packetStream.sendPacket();
                break;
            case 2300:
                this.walkToWallObject(menuX, menuY, menuIndex);
                this.packetStream.newPacket(clientOpcodes.WALL_OBJECT_COMMAND2);
                this.packetStream.putShort(menuX + this.regionX);
                this.packetStream.putShort(menuY + this.regionY);
                this.packetStream.putByte(menuIndex);
                this.packetStream.sendPacket();
                break;
            case 3300:
                this.showMessage(GameData.wallObjectDescription[menuIndex], 3);
                break;
            case 400:
                this.walkToObject(menuX, menuY, menuIndex, menuSourceIndex);
                this.packetStream.newPacket(clientOpcodes.CAST_OBJECT);
                this.packetStream.putShort(menuX + this.regionX);
                this.packetStream.putShort(menuY + this.regionY);
                this.packetStream.putShort(menuTargetIndex);
                this.packetStream.sendPacket();
                this.selectedSpell = -1;
                break;
            case 410:
                this.walkToObject(menuX, menuY, menuIndex, menuSourceIndex);
                this.packetStream.newPacket(clientOpcodes.USEWITH_OBJECT);
                this.packetStream.putShort(menuX + this.regionX);
                this.packetStream.putShort(menuY + this.regionY);
                this.packetStream.putShort(menuTargetIndex);
                this.packetStream.sendPacket();
                this.selectedItemInventoryIndex = -1;
                break;
            case 420:
                this.walkToObject(menuX, menuY, menuIndex, menuSourceIndex);
                this.packetStream.newPacket(clientOpcodes.OBJECT_CMD1);
                this.packetStream.putShort(menuX + this.regionX);
                this.packetStream.putShort(menuY + this.regionY);
                this.packetStream.sendPacket();
                break;
            case 2400:
                this.walkToObject(menuX, menuY, menuIndex, menuSourceIndex);
                this.packetStream.newPacket(clientOpcodes.OBJECT_CMD2);
                this.packetStream.putShort(menuX + this.regionX);
                this.packetStream.putShort(menuY + this.regionY);
                this.packetStream.sendPacket();
                break;
            case 3400:
                this.showMessage(GameData.objectDescription[menuIndex], 3);
                break;
            case 600:
                this.packetStream.newPacket(clientOpcodes.CAST_INVITEM);
                this.packetStream.putShort(menuIndex);
                this.packetStream.putShort(menuSourceIndex);
                this.packetStream.sendPacket();
                this.selectedSpell = -1;
                break;
            case 610:
                this.packetStream.newPacket(clientOpcodes.USEWITH_INVITEM);
                this.packetStream.putShort(menuIndex);
                this.packetStream.putShort(menuSourceIndex);
                this.packetStream.sendPacket();
                this.selectedItemInventoryIndex = -1;
                break;
            case 620:
                this.packetStream.newPacket(clientOpcodes.INV_UNEQUIP);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                break;
            case 630:
                this.packetStream.newPacket(clientOpcodes.INV_WEAR);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                break;
            case 640:
                this.packetStream.newPacket(clientOpcodes.INV_CMD);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                break;
            case 650:
                this.selectedItemInventoryIndex = menuIndex;
                this.showUiTab = 0;
                this.selectedItemName =
                        GameData.itemName[this.inventoryItemId[
                            this.selectedItemInventoryIndex]];
                break;
            case 660:
                this.packetStream.newPacket(clientOpcodes.INV_DROP);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                this.selectedItemInventoryIndex = -1;
                this.showUiTab = 0;
                this.showMessage('Dropping ' +
                    GameData.itemName[this.inventoryItemId[menuIndex]], 4);
                break;
            case 3600:
                this.showMessage(GameData.itemDescription[menuIndex], 3);
                break;
            case 700: {
                const x = ((menuX - 64) / this.magicLoc) | 0;
                const y = ((menuY - 64) / this.magicLoc) | 0;

                this._walkToActionSource_from5(this.localRegionX, this.localRegionY,
                    x, y, true);
                this.packetStream.newPacket(clientOpcodes.CAST_NPC);
                this.packetStream.putShort(menuIndex);
                this.packetStream.putShort(menuSourceIndex);
                this.packetStream.sendPacket();
                this.selectedSpell = -1;
                break;
            }
            case 710: {
                const x = ((menuX - 64) / this.magicLoc) | 0;
                const y = ((menuY - 64) / this.magicLoc) | 0;

                this._walkToActionSource_from5(this.localRegionX, this.localRegionY,
                    x, y, true);
                this.packetStream.newPacket(clientOpcodes.USEWITH_NPC);
                this.packetStream.putShort(menuIndex);
                this.packetStream.putShort(menuSourceIndex);
                this.packetStream.sendPacket();
                this.selectedItemInventoryIndex = -1;
                break;
            }
            case 720: {
                const x = ((menuX - 64) / this.magicLoc) | 0;
                const y = ((menuY - 64) / this.magicLoc) | 0;

                this._walkToActionSource_from5(this.localRegionX, this.localRegionY,
                    x, y, true);
                this.packetStream.newPacket(clientOpcodes.NPC_TALK);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                break;
            }
            case 725: {
                const x = ((menuX - 64) / this.magicLoc) | 0;
                const y = ((menuY - 64) / this.magicLoc) | 0;

                this._walkToActionSource_from5(this.localRegionX, this.localRegionY,
                    x, y, true);
                this.packetStream.newPacket(clientOpcodes.NPC_CMD);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                break;
            }
            case 715:
            case 2715: {
                const x = ((menuX - 64) / this.magicLoc) | 0;
                const y = ((menuY - 64) / this.magicLoc) | 0;

                this._walkToActionSource_from5(this.localRegionX, this.localRegionY,
                    x, y, true);
                this.packetStream.newPacket(clientOpcodes.NPC_ATTACK);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                break;
            }
            case 3700:
                this.showMessage(GameData.npcDescription[menuIndex], 3);
                break;
            case 800: {
                const x = ((menuX - 64) / this.magicLoc) | 0;
                const y = ((menuY - 64) / this.magicLoc) | 0;

                this._walkToActionSource_from5(this.localRegionX, this.localRegionY,
                    x, y, true);
                this.packetStream.newPacket(clientOpcodes.CAST_PLAYER);
                this.packetStream.putShort(menuIndex);
                this.packetStream.putShort(menuSourceIndex);
                this.packetStream.sendPacket();
                this.selectedSpell = -1;
                break;
            }
            case 810: {
                const x = ((menuX - 64) / this.magicLoc) | 0;
                const y = ((menuY - 64) / this.magicLoc) | 0;

                this._walkToActionSource_from5(this.localRegionX, this.localRegionY,
                    x, y, true);
                this.packetStream.newPacket(clientOpcodes.USEWITH_PLAYER);
                this.packetStream.putShort(menuIndex);
                this.packetStream.putShort(menuSourceIndex);
                this.packetStream.sendPacket();
                this.selectedItemInventoryIndex = -1;
                break;
            }
            case 805:
            case 2805: {
                const x = ((menuX - 64) / this.magicLoc) | 0;
                const y = ((menuY - 64) / this.magicLoc) | 0;

                this._walkToActionSource_from5(this.localRegionX, this.localRegionY,
                    x, y, true);
                this.packetStream.newPacket(clientOpcodes.PLAYER_ATTACK);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                break;
            }
            case 2806:
                this.packetStream.newPacket(clientOpcodes.PLAYER_DUEL);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                break;
            case 2810:
                this.packetStream.newPacket(clientOpcodes.PLAYER_TRADE);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                break;
            case 2820:
                this.packetStream.newPacket(clientOpcodes.PLAYER_FOLLOW);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                break;
            case 900:
                this._walkToActionSource_from5(this.localRegionX, this.localRegionY,
                    menuX, menuY, true);
                this.packetStream.newPacket(clientOpcodes.CAST_GROUND);
                this.packetStream.putShort(menuX + this.regionX);
                this.packetStream.putShort(menuY + this.regionY);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                this.selectedSpell = -1;
                break;
            case 920:
                this._walkToActionSource_from5(this.localRegionX, this.localRegionY,
                    menuX, menuY, false);

                if (this.mouseClickXStep === -24) {
                    this.mouseClickXStep = 24;
                }
                break;
            case 1000:
                this.packetStream.newPacket(clientOpcodes.CAST_SELF);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                this.selectedSpell = -1;
                break;
            case 4000:
                this.selectedItemInventoryIndex = -1;
                this.selectedSpell = -1;
                break;
        }
    }

    showLoginScreenStatus(s, s1) {
        if (this.loginScreen === 1) {
            this.panelLoginNewUser.updateText(this.controlRegisterStatus, s + ' ' + s1);
        } else if (this.loginScreen === 2) {
            this.panelLoginExistingUser.updateText(this.controlLoginStatus, s + ' ' + s1);
        }

        this.loginUserDisp = s1;
        this.drawLoginScreens();
        this.resetTimings();
    }

    async lostConnection() {
        this.systemUpdate = 0;

        if (this.logoutTimeout !== 0) {
            this.resetLoginVars();
        } else {
            await super.lostConnection();
        }
    }

    isValidCameraAngle(i) {
        let j = (this.localPlayer.currentX / 128) | 0;
        let k = (this.localPlayer.currentY / 128) | 0;

        for (let l = 2; l >= 1; l--) {
            if (i === 1 && ((this.world.objectAdjacency.get(j, k - l) & 128) === 128 || (this.world.objectAdjacency.get(j - l, k) & 128) === 128 || (this.world.objectAdjacency.get(j - l, k - l) & 128) === 128)) {
                return false;
            }

            if (i === 3 && ((this.world.objectAdjacency.get(j, k + l) & 128) === 128 || (this.world.objectAdjacency.get(j - l, k) & 128) === 128 || (this.world.objectAdjacency.get(j - l, k + l) & 128) === 128)) {
                return false;
            }

            if (i === 5 && ((this.world.objectAdjacency.get(j, k + l) & 128) === 128 || (this.world.objectAdjacency.get(j + l, k) & 128) === 128 || (this.world.objectAdjacency.get(j + l, k + l) & 128) === 128)) {
                return false;
            }

            if (i === 7 && ((this.world.objectAdjacency.get(j, k - l) & 128) === 128 || (this.world.objectAdjacency.get(j + l, k) & 128) === 128 || (this.world.objectAdjacency.get(j + l, k - l) & 128) === 128)) {
                return false;
            }

            if (i === 0 && (this.world.objectAdjacency.get(j, k - l) & 128) === 128) {
                return false;
            }

            if (i === 2 && (this.world.objectAdjacency.get(j - l, k) & 128) === 128) {
                return false;
            }

            if (i === 4 && (this.world.objectAdjacency.get(j, k + l) & 128) === 128) {
                return false;
            }

            if (i === 6 && (this.world.objectAdjacency.get(j + l, k) & 128) === 128) {
                return false;
            }
        }

        return true;
    }

    resetLoginScreenVariables() {
        this.loggedIn = 0;
        this.loginScreen = 0;
        this.loginUser = '';
        this.loginPass = '';
        this.loginUserDesc = 'Please enter a username:';
        this.loginUserDisp = `*${this.loginUser}*`;
        this.playerCount = 0;
        this.npcCount = 0;
    }

    handleIncomingPacket(opcode, ptype, psize, pdata) {
        try {
            if (opcode === serverOpcodes.REGION_PLAYERS) {
                this.knownPlayerCount = this.playerCount;

                for (let k = 0; k < this.knownPlayerCount; k++) {
                    this.knownPlayers[k] = this.players[k];
                }

                let k7 = 8;

                this.localRegionX = Utility.getBitMask(pdata, k7, 11);
                k7 += 11;
                this.localRegionY = Utility.getBitMask(pdata, k7, 13);
                k7 += 13;

                let anim = Utility.getBitMask(pdata, k7, 4);

                k7 += 4;

                let flag1 = this.loadNextRegion(this.localRegionX, this.localRegionY);

                this.localRegionX -= this.regionX;
                this.localRegionY -= this.regionY;

                let l22 = this.localRegionX * this.magicLoc + 64;
                let l25 = this.localRegionY * this.magicLoc + 64;

                if (flag1) {
                    this.localPlayer.waypointCurrent = 0;
                    this.localPlayer.movingStep = 0;
                    this.localPlayer.currentX = this.localPlayer.waypointsX[0] = l22;
                    this.localPlayer.currentY = this.localPlayer.waypointsY[0] = l25;
                }

                this.playerCount = 0;

                this.localPlayer = this.createPlayer(this.localPlayerServerIndex, l22, l25, anim);

                let i29 = Utility.getBitMask(pdata, k7, 8);

                k7 += 8;

                for (let l33 = 0; l33 < i29; l33++) {
                    let character_3 = this.knownPlayers[l33 + 1];
                    let reqUpdate = Utility.getBitMask(pdata, k7, 1);

                    k7++;

                    if (reqUpdate !== 0) {
                        let updateType = Utility.getBitMask(pdata, k7, 1);

                        k7++;

                        if (updateType === 0) {
                            let nextAnim = Utility.getBitMask(pdata, k7, 3);

                            k7 += 3;

                            let l43 = character_3.waypointCurrent;
                            let j44 = character_3.waypointsX[l43];
                            let k44 = character_3.waypointsY[l43];

                            if (nextAnim === 2 || nextAnim === 1 || nextAnim === 3) {
                                j44 += this.magicLoc;
                            }

                            if (nextAnim === 6 || nextAnim === 5 || nextAnim === 7) {
                                j44 -= this.magicLoc;
                            }

                            if (nextAnim === 4 || nextAnim === 3 || nextAnim === 5) {
                                k44 += this.magicLoc;
                            }

                            if (nextAnim === 0 || nextAnim === 1 || nextAnim === 7) {
                                k44 -= this.magicLoc;
                            }

                            character_3.animationNext = nextAnim;
                            character_3.waypointCurrent = l43 = (l43 + 1) % 10;
                            character_3.waypointsX[l43] = j44;
                            character_3.waypointsY[l43] = k44;
                        } else {
                            let i43 = Utility.getBitMask(pdata, k7, 4);

                            if ((i43 & 12) === 12) {
                                k7 += 2;
                                continue;
                            }

                            character_3.animationNext = Utility.getBitMask(pdata, k7, 4);
                            k7 += 4;
                        }
                    }

                    this.players[this.playerCount++] = character_3;
                }

                let count = 0;

                while (k7 + 24 < psize * 8) {
                    let serverIndex = Utility.getBitMask(pdata, k7, 11);

                    k7 += 11;

                    let areaX = Utility.getBitMask(pdata, k7, 5);

                    k7 += 5;

                    if (areaX > 15) {
                        areaX -= 32;
                    }

                    let areaY = Utility.getBitMask(pdata, k7, 5);

                    k7 += 5;

                    if (areaY > 15) {
                        areaY -= 32;
                    }

                    let animation = Utility.getBitMask(pdata, k7, 4);

                    k7 += 4;
                    let i44 = Utility.getBitMask(pdata, k7, 1);

                    k7++;

                    let x = (this.localRegionX + areaX) * this.magicLoc + 64;
                    let y = (this.localRegionY + areaY) * this.magicLoc + 64;

                    this.createPlayer(serverIndex, x, y, animation);

                    if (i44 === 0) {
                        this.playerServerIndexes[count++] = serverIndex;
                    }
                }

                if (count > 0) {
                    this.packetStream.newPacket(clientOpcodes.KNOWN_PLAYERS);
                    this.packetStream.putShort(count);

                    for (let i = 0; i < count; i++) {
                        let c = this.playerServer[this.playerServerIndexes[i]];

                        this.packetStream.putShort(c.serverIndex);
                        this.packetStream.putShort(c.serverId);
                    }

                    this.packetStream.sendPacket();
                    count = 0;
                }

                return;
            }

            if (opcode === serverOpcodes.REGION_GROUND_ITEMS) {
                for (let l = 1; l < psize; )
                    if (Utility.getUnsignedByte(pdata[l]) === 255) {
                        let l7 = 0;
                        let j14 = this.localRegionX + pdata[l + 1] >> 3;
                        let i19 = this.localRegionY + pdata[l + 2] >> 3;

                        l += 3;

                        for (let j23 = 0; j23 < this.groundItemCount; j23++) {
                            let j26 = (this.groundItemX[j23] >> 3) - j14;
                            let j29 = (this.groundItemY[j23] >> 3) - i19;

                            if (j26 !== 0 || j29 !== 0) {
                                if (j23 !== l7) {
                                    this.groundItemX[l7] = this.groundItemX[j23];
                                    this.groundItemY[l7] = this.groundItemY[j23];
                                    this.groundItemId[l7] = this.groundItemId[j23];
                                    this.groundItemZ[l7] = this.groundItemZ[j23];
                                }

                                l7++;
                            }
                        }

                        this.groundItemCount = l7;
                    } else {
                        let i8 = Utility.getUnsignedShort(pdata, l);

                        l += 2;

                        let k14 = this.localRegionX + pdata[l++];
                        let j19 = this.localRegionY + pdata[l++];

                        if ((i8 & 32768) === 0) {
                            this.groundItemX[this.groundItemCount] = k14;
                            this.groundItemY[this.groundItemCount] = j19;
                            this.groundItemId[this.groundItemCount] = i8;
                            this.groundItemZ[this.groundItemCount] = 0;

                            for (let k23 = 0; k23 < this.objectCount; k23++) {
                                if (this.objectX[k23] !== k14 || this.objectY[k23] !== j19) {
                                    continue;
                                }

                                this.groundItemZ[this.groundItemCount] = GameData.objectElevation[this.objectId[k23]];
                                break;
                            }

                            this.groundItemCount++;
                        } else {
                            i8 &= 32767;

                            let l23 = 0;

                            for (let k26 = 0; k26 < this.groundItemCount; k26++) {
                                if (this.groundItemX[k26] !== k14 || this.groundItemY[k26] !== j19 || this.groundItemId[k26] !== i8) {
                                    if (k26 !== l23) {
                                        this.groundItemX[l23] = this.groundItemX[k26];
                                        this.groundItemY[l23] = this.groundItemY[k26];
                                        this.groundItemId[l23] = this.groundItemId[k26];
                                        this.groundItemZ[l23] = this.groundItemZ[k26];
                                    }

                                    l23++;
                                } else {
                                    i8 = -123;
                                }
                            }

                            this.groundItemCount = l23;
                        }
                    }

                return;
            }

            if (opcode === serverOpcodes.REGION_OBJECTS) {
                for (let i1 = 1; i1 < psize; ) {
                    if (Utility.getUnsignedByte(pdata[i1]) === 255) {
                        let j8 = 0;
                        let l14 = this.localRegionX + pdata[i1 + 1] >> 3;
                        let k19 = this.localRegionY + pdata[i1 + 2] >> 3;

                        i1 += 3;

                        for (let i24 = 0; i24 < this.objectCount; i24++) {
                            let l26 = (this.objectX[i24] >> 3) - l14;
                            let k29 = (this.objectY[i24] >> 3) - k19;

                            if (l26 !== 0 || k29 !== 0) {
                                if (i24 !== j8) {
                                    this.objectModel[j8] = this.objectModel[i24];
                                    this.objectModel[j8].key = j8;
                                    this.objectX[j8] = this.objectX[i24];
                                    this.objectY[j8] = this.objectY[i24];
                                    this.objectId[j8] = this.objectId[i24];
                                    this.objectDirection[j8] = this.objectDirection[i24];
                                }

                                j8++;
                            } else {
                                this.scene.removeModel(this.objectModel[i24]);
                                this.world.removeObject(this.objectX[i24], this.objectY[i24], this.objectId[i24]);
                            }
                        }

                        this.objectCount = j8;
                    } else {
                        let id = Utility.getUnsignedShort(pdata, i1);

                        i1 += 2;

                        let lX = this.localRegionX + pdata[i1++];
                        let lY = this.localRegionY + pdata[i1++];
                        let j24 = 0;

                        for (let i27 = 0; i27 < this.objectCount; i27++) {
                            if (this.objectX[i27] !== lX || this.objectY[i27] !== lY) {
                                if (i27 !== j24) {
                                    this.objectModel[j24] = this.objectModel[i27];
                                    this.objectModel[j24].key = j24;
                                    this.objectX[j24] = this.objectX[i27];
                                    this.objectY[j24] = this.objectY[i27];
                                    this.objectId[j24] = this.objectId[i27];
                                    this.objectDirection[j24] = this.objectDirection[i27];
                                }

                                j24++;
                            } else {
                                this.scene.removeModel(this.objectModel[i27]);
                                this.world.removeObject(this.objectX[i27], this.objectY[i27], this.objectId[i27]);
                            }
                        }

                        this.objectCount = j24;

                        if (id !== 60000) {
                            let direction = this.world.getTileDirection(lX, lY);
                            let width = 0;
                            let height = 0;

                            if (direction === 0 || direction === 4) {
                                width = GameData.objectWidth[id];
                                height = GameData.objectHeight[id];
                            } else {
                                height = GameData.objectWidth[id];
                                width = GameData.objectHeight[id];
                            }

                            let mX = (((lX + lX + width) * this.magicLoc) / 2) | 0;
                            let mY = (((lY + lY + height) * this.magicLoc) / 2) | 0;
                            let modelIdx = GameData.objectModelIndex[id];
                            let model = this.gameModels[modelIdx].copy();

                            this.scene.addModel(model);

                            model.key = this.objectCount;
                            model.rotate(0, direction * 32, 0);
                            model.translate(mX, -this.world.getElevation(mX, mY), mY);
                            model._setLight_from6(true, 48, 48, -50, -10, -50);

                            this.world.removeObject2(lX, lY, id);

                            if (id === 74) {
                                model.translate(0, -480, 0);
                            }

                            this.objectX[this.objectCount] = lX;
                            this.objectY[this.objectCount] = lY;
                            this.objectId[this.objectCount] = id;
                            this.objectDirection[this.objectCount] = direction;
                            this.objectModel[this.objectCount++] = model;
                        }
                    }
                }

                return;
            }

            if (opcode === serverOpcodes.INVENTORY_ITEMS) {
                let offset = 1;

                this.inventoryItemsCount = pdata[offset++] & 0xff;

                for (let i = 0; i < this.inventoryItemsCount; i++) {
                    let idEquip = Utility.getUnsignedShort(pdata, offset);

                    offset += 2;
                    this.inventoryItemId[i] = idEquip & 32767;
                    this.inventoryEquipped[i] = (idEquip / 32768) | 0;

                    if (GameData.itemStackable[idEquip & 32767] === 0) {
                        this.inventoryItemStackCount[i] = Utility.getUnsignedInt2(pdata, offset);

                        if (this.inventoryItemStackCount[i] >= 128) {
                            offset += 4;
                        } else {
                            offset++;
                        }
                    } else {
                        this.inventoryItemStackCount[i] = 1;
                    }
                }

                return;
            }

            if (opcode === serverOpcodes.REGION_PLAYER_UPDATE) {
                let k1 = Utility.getUnsignedShort(pdata, 1);
                let offset = 3;

                for (let k15 = 0; k15 < k1; k15++) {
                    let playerId = Utility.getUnsignedShort(pdata, offset);

                    offset += 2;

                    let character = this.playerServer[playerId];
                    let updateType = pdata[offset];

                    offset++;

                    // speech bubble with an item in it
                    if (updateType === 0) {
                        let id = Utility.getUnsignedShort(pdata, offset);
                        offset += 2;

                        if (character !== null) {
                            character.bubbleTimeout = 150;
                            character.bubbleItem = id;
                        }
                    } else if (updateType === 1) { // chat
                        let messageLength = pdata[offset];
                        offset++;

                        if (character !== null) {
                            let filtered = WordFilter.filter(ChatMessage.descramble(pdata, offset, messageLength));

                            let ignored = false;

                            for (let i = 0; i < this.ignoreListCount; i++) {
                                if (this.ignoreList[i] === character.hash) {
                                    ignored = true;
                                    break;
                                }
                            }

                            if (!ignored) {
                                character.messageTimeout = 150;
                                character.message = filtered;
                                this.showMessage(character.name + ': ' + character.message, 2);
                            }
                        }

                        offset += messageLength;
                    } else if (updateType === 2) { // combat damage and hp
                        let damage = Utility.getUnsignedByte(pdata[offset]);

                        offset++;

                        let current = Utility.getUnsignedByte(pdata[offset]);

                        offset++;

                        let max = Utility.getUnsignedByte(pdata[offset]);

                        offset++;

                        if (character !== null) {
                            character.damageTaken = damage;
                            character.healthCurrent = current;
                            character.healthMax = max;
                            character.combatTimer = 200;

                            if (character === this.localPlayer) {
                                this.playerStatCurrent[3] = current;
                                this.playerStatBase[3] = max;
                                this.showDialogWelcome = false;
                                this.showDialogServerMessage = false;
                            }
                        }
                    } else if (updateType === 3) { // new incoming projectile from npc?
                        let projectileSprite = Utility.getUnsignedShort(pdata, offset);

                        offset += 2;

                        let npcIdx = Utility.getUnsignedShort(pdata, offset);

                        offset += 2;

                        if (character !== null) {
                            character.incomingProjectileSprite = projectileSprite;
                            character.attackingNpcServerIndex = npcIdx;
                            character.attackingPlayerServerIndex = -1;
                            character.projectileRange = this.projectileMaxRange;
                        }
                    } else if (updateType === 4) { // new incoming projectile from player
                        let projectileSprite = Utility.getUnsignedShort(pdata, offset);

                        offset += 2;

                        let playerIdx = Utility.getUnsignedShort(pdata, offset);

                        offset += 2;

                        if (character !== null) {
                            character.incomingProjectileSprite = projectileSprite;
                            character.attackingPlayerServerIndex = playerIdx;
                            character.attackingNpcServerIndex = -1;
                            character.projectileRange = this.projectileMaxRange;
                        }
                    } else if (updateType === 5) {
                        if (character !== null) {
                            character.serverId = Utility.getUnsignedShort(pdata, offset);
                            offset += 2;
                            character.hash = Utility.getUnsignedLong(pdata, offset);
                            offset += 8;
                            character.name = Utility.hashToUsername(character.hash);

                            let equippedCount = Utility.getUnsignedByte(pdata[offset]);

                            offset++;

                            for (let i = 0; i < equippedCount; i++) {
                                character.equippedItem[i] = Utility.getUnsignedByte(pdata[offset]);
                                offset++;
                            }

                            for (let i = equippedCount; i < 12; i++) {
                                character.equippedItem[i] = 0;
                            }

                            character.colourHair = pdata[offset++] & 0xff;
                            character.colourTop = pdata[offset++] & 0xff;
                            character.colourBottom = pdata[offset++] & 0xff;
                            character.colourSkin = pdata[offset++] & 0xff;
                            character.level = pdata[offset++] & 0xff;
                            character.skullVisible = pdata[offset++] & 0xff;
                        } else {
                            offset += 14;

                            let unused = Utility.getUnsignedByte(pdata[offset]);

                            offset += unused + 1;
                        }
                    } else if (updateType === 6) {
                        let mLen = pdata[offset];

                        offset++;

                        if (character !== null) {
                            let msg = ChatMessage.descramble(pdata, offset, mLen);

                            character.messageTimeout = 150;
                            character.message = msg;

                            if (character === this.localPlayer) {
                                this.showMessage(character.name + ': ' + character.message, 5);
                            }
                        }

                        offset += mLen;
                    }
                }

                return;
            }

            if (opcode === serverOpcodes.REGION_WALL_OBJECTS) {
                for (let offset = 1; offset < psize; )
                    if (Utility.getUnsignedByte(pdata[offset]) === 255) {
                        let count = 0;
                        let lX = this.localRegionX + pdata[offset + 1] >> 3;
                        let lY = this.localRegionY + pdata[offset + 2] >> 3;

                        offset += 3;

                        for (let i = 0; i < this.wallObjectCount; i++) {
                            let sX = (this.wallObjectX[i] >> 3) - lX;
                            let sY = (this.wallObjectY[i] >> 3) - lY;

                            if (sX !== 0 || sY !== 0) {
                                if (i !== count) {
                                    this.wallObjectModel[count] = this.wallObjectModel[i];
                                    this.wallObjectModel[count].key = count + 10000;
                                    this.wallObjectX[count] = this.wallObjectX[i];
                                    this.wallObjectY[count] = this.wallObjectY[i];
                                    this.wallObjectDirection[count] = this.wallObjectDirection[i];
                                    this.wallObjectId[count] = this.wallObjectId[i];
                                }

                                count++;
                            } else {
                                this.scene.removeModel(this.wallObjectModel[i]);
                                this.world.removeWallObject(this.wallObjectX[i], this.wallObjectY[i], this.wallObjectDirection[i], this.wallObjectId[i]);
                            }
                        }

                        this.wallObjectCount = count;
                    } else {
                        let id = Utility.getUnsignedShort(pdata, offset);

                        offset += 2;

                        let lX = this.localRegionX + pdata[offset++];
                        let lY = this.localRegionY + pdata[offset++];
                        let direction = pdata[offset++];
                        let count = 0;

                        for (let i = 0; i < this.wallObjectCount; i++) {
                            if (this.wallObjectX[i] !== lX || this.wallObjectY[i] !== lY || this.wallObjectDirection[i] !== direction) {
                                if (i !== count) {
                                    this.wallObjectModel[count] = this.wallObjectModel[i];
                                    this.wallObjectModel[count].key = count + 10000;
                                    this.wallObjectX[count] = this.wallObjectX[i];
                                    this.wallObjectY[count] = this.wallObjectY[i];
                                    this.wallObjectDirection[count] = this.wallObjectDirection[i];
                                    this.wallObjectId[count] = this.wallObjectId[i];
                                }

                                count++;
                            } else {
                                this.scene.removeModel(this.wallObjectModel[i]);
                                this.world.removeWallObject(this.wallObjectX[i], this.wallObjectY[i], this.wallObjectDirection[i], this.wallObjectId[i]);
                            }
                        }

                        this.wallObjectCount = count;

                        if (id !== 65535) {
                            this.world._setObjectAdjacency_from4(lX, lY, direction, id);
                            let model = this.createModel(lX, lY, direction, id, this.wallObjectCount);
                            this.wallObjectModel[this.wallObjectCount] = model;
                            this.wallObjectX[this.wallObjectCount] = lX;
                            this.wallObjectY[this.wallObjectCount] = lY;
                            this.wallObjectId[this.wallObjectCount] = id;
                            this.wallObjectDirection[this.wallObjectCount++] = direction;
                        }
                    }

                return;
            }

            if (opcode === serverOpcodes.REGION_NPCS) {
                this.npcCacheCount = this.npcCount;
                this.npcCount = 0;

                for (let i2 = 0; i2 < this.npcCacheCount; i2++) {
                    this.npcsCache[i2] = this.npcs[i2];
                }

                let offset = 8;
                let j16 = Utility.getBitMask(pdata, offset, 8);

                offset += 8;

                for (let l20 = 0; l20 < j16; l20++) {
                    let character_1 = this.npcsCache[l20];
                    let l27 = Utility.getBitMask(pdata, offset, 1);

                    offset++;

                    if (l27 !== 0) {
                        let i32 = Utility.getBitMask(pdata, offset, 1);

                        offset++;

                        if (i32 === 0) {
                            let j35 = Utility.getBitMask(pdata, offset, 3);

                            offset += 3;

                            let i38 = character_1.waypointCurrent;
                            let l40 = character_1.waypointsX[i38];
                            let j42 = character_1.waypointsY[i38];

                            if (j35 === 2 || j35 === 1 || j35 === 3) {
                                l40 += this.magicLoc;
                            }

                            if (j35 === 6 || j35 === 5 || j35 === 7) {
                                l40 -= this.magicLoc;
                            }

                            if (j35 === 4 || j35 === 3 || j35 === 5) {
                                j42 += this.magicLoc;
                            }

                            if (j35 === 0 || j35 === 1 || j35 === 7) {
                                j42 -= this.magicLoc;
                            }

                            character_1.animationNext = j35;
                            character_1.waypointCurrent = i38 = (i38 + 1) % 10;
                            character_1.waypointsX[i38] = l40;
                            character_1.waypointsY[i38] = j42;
                        } else {
                            let k35 = Utility.getBitMask(pdata, offset, 4);

                            if ((k35 & 12) === 12) {
                                offset += 2;
                                continue;
                            }

                            character_1.animationNext = Utility.getBitMask(pdata, offset, 4);
                            offset += 4;
                        }
                    }

                    this.npcs[this.npcCount++] = character_1;
                }

                while (offset + 34 < psize * 8) {
                    let serverIndex = Utility.getBitMask(pdata, offset, 12);

                    offset += 12;

                    let areaX = Utility.getBitMask(pdata, offset, 5);

                    offset += 5;

                    if (areaX > 15) {
                        areaX -= 32;
                    }

                    let areaY = Utility.getBitMask(pdata, offset, 5);

                    offset += 5;

                    if (areaY > 15) {
                        areaY -= 32;
                    }

                    let sprite = Utility.getBitMask(pdata, offset, 4);

                    offset += 4;

                    let x = (this.localRegionX + areaX) * this.magicLoc + 64;
                    let y = (this.localRegionY + areaY) * this.magicLoc + 64;
                    let type = Utility.getBitMask(pdata, offset, 10);

                    offset += 10;

                    if (type >= GameData.npcCount) {
                        type = 24;
                    }

                    this.addNpc(serverIndex, x, y, sprite, type);
                }

                return;
            }

            if (opcode === serverOpcodes.REGION_NPC_UPDATE) {
                let j2 = Utility.getUnsignedShort(pdata, 1);
                let i10 = 3;

                for (let k16 = 0; k16 < j2; k16++) {
                    let i21 = Utility.getUnsignedShort(pdata, i10);

                    i10 += 2;

                    let character = this.npcsServer[i21];
                    let j28 = Utility.getUnsignedByte(pdata[i10]);

                    i10++;

                    if (j28 === 1) {
                        let target = Utility.getUnsignedShort(pdata, i10);

                        i10 += 2;

                        let byte9 = pdata[i10];

                        i10++;

                        if (character !== null) {
                            let s4 = ChatMessage.descramble(pdata, i10, byte9);

                            character.messageTimeout = 150;
                            character.message = s4;

                            if (target === this.localPlayer.serverIndex) {
                                this.showMessage('@yel@' + GameData.npcName[character.npcId] + ': ' + character.message, 5);
                            }
                        }

                        i10 += byte9;
                    } else if (j28 === 2) {
                        let l32 = Utility.getUnsignedByte(pdata[i10]);

                        i10++;

                        let i36 = Utility.getUnsignedByte(pdata[i10]);

                        i10++;

                        let k38 = Utility.getUnsignedByte(pdata[i10]);

                        i10++;

                        if (character !== null) {
                            character.damageTaken = l32;
                            character.healthCurrent = i36;
                            character.healthMax = k38;
                            character.combatTimer = 200;
                        }
                    }
                }

                return;
            }

            if (opcode === serverOpcodes.OPTION_LIST) {
                this.showOptionMenu = true;

                let count = Utility.getUnsignedByte(pdata[1]);

                this.optionMenuCount = count;

                let offset = 2;

                for (let i = 0; i < count; i++) {
                    let length = Utility.getUnsignedByte(pdata[offset]);

                    offset++;
                    this.optionMenuEntry[i] = fromCharArray(pdata.slice(offset, offset + length));
                    offset += length;
                }

                return;
            }

            if (opcode === serverOpcodes.OPTION_LIST_CLOSE) {
                this.showOptionMenu = false;
                return;
            }

            if (opcode === serverOpcodes.WORLD_INFO) {
                this.loadingArea = true;
                this.localPlayerServerIndex = Utility.getUnsignedShort(pdata, 1);
                this.planeWidth = Utility.getUnsignedShort(pdata, 3);
                this.planeHeight = Utility.getUnsignedShort(pdata, 5);
                this.planeIndex = Utility.getUnsignedShort(pdata, 7);
                this.planeMultiplier = Utility.getUnsignedShort(pdata, 9);
                this.planeHeight -= this.planeIndex * this.planeMultiplier;

                return;
            }

            if (opcode === serverOpcodes.PLAYER_STAT_LIST) {
                let offset = 1;

                for (let i = 0; i < PLAYER_STAT_COUNT; i++) {
                    this.playerStatCurrent[i] = Utility.getUnsignedByte(pdata[offset++]);
                }

                for (let i = 0; i < PLAYER_STAT_COUNT; i++) {
                    this.playerStatBase[i] = Utility.getUnsignedByte(pdata[offset++]);
                }

                for (let i = 0; i < PLAYER_STAT_COUNT; i++) {
                    this.playerExperience[i] = Utility.getUnsignedInt(pdata, offset);
                    offset += 4;
                }

                this.playerQuestPoints = Utility.getUnsignedByte(pdata[offset++]);
                return;
            }

            if (opcode === serverOpcodes.PLAYER_STAT_EQUIPMENT_BONUS) {
                for (let i3 = 0; i3 < PLAYER_STAT_EQUIPMENT_COUNT; i3++) {
                    this.playerStatEquipment[i3] = Utility.getUnsignedByte(pdata[1 + i3]);
                }

                return;
            }

            if (opcode === serverOpcodes.PLAYER_DIED) {
                this.deathScreenTimeout = 250;
                return;
            }

            if (opcode === serverOpcodes.REGION_ENTITY_UPDATE) {
                let j3 = ((psize - 1) / 4) | 0;

                for (let l10 = 0; l10 < j3; l10++) {
                    let j17 = this.localRegionX + Utility.getSignedShort(pdata, 1 + l10 * 4) >> 3;
                    let l21 = this.localRegionY + Utility.getSignedShort(pdata, 3 + l10 * 4) >> 3;
                    let i25 = 0;

                    for (let k28 = 0; k28 < this.groundItemCount; k28++) {
                        let i33 = (this.groundItemX[k28] >> 3) - j17;
                        let j36 = (this.groundItemY[k28] >> 3) - l21;

                        if (i33 !== 0 || j36 !== 0) {
                            if (k28 !== i25) {
                                this.groundItemX[i25] = this.groundItemX[k28];
                                this.groundItemY[i25] = this.groundItemY[k28];
                                this.groundItemId[i25] = this.groundItemId[k28];
                                this.groundItemZ[i25] = this.groundItemZ[k28];
                            }

                            i25++;
                        }
                    }

                    this.groundItemCount = i25;
                    i25 = 0;

                    for (let j33 = 0; j33 < this.objectCount; j33++) {
                        let k36 = (this.objectX[j33] >> 3) - j17;
                        let l38 = (this.objectY[j33] >> 3) - l21;

                        if (k36 !== 0 || l38 !== 0) {
                            if (j33 !== i25) {
                                this.objectModel[i25] = this.objectModel[j33];
                                this.objectModel[i25].key = i25;
                                this.objectX[i25] = this.objectX[j33];
                                this.objectY[i25] = this.objectY[j33];
                                this.objectId[i25] = this.objectId[j33];
                                this.objectDirection[i25] = this.objectDirection[j33];
                            }

                            i25++;
                        } else {
                            this.scene.removeModel(this.objectModel[j33]);
                            this.world.removeObject(this.objectX[j33], this.objectY[j33], this.objectId[j33]);
                        }
                    }

                    this.objectCount = i25;
                    i25 = 0;

                    for (let l36 = 0; l36 < this.wallObjectCount; l36++) {
                        let i39 = (this.wallObjectX[l36] >> 3) - j17;
                        let j41 = (this.wallObjectY[l36] >> 3) - l21;

                        if (i39 !== 0 || j41 !== 0) {
                            if (l36 !== i25) {
                                this.wallObjectModel[i25] = this.wallObjectModel[l36];
                                this.wallObjectModel[i25].key = i25 + 10000;
                                this.wallObjectX[i25] = this.wallObjectX[l36];
                                this.wallObjectY[i25] = this.wallObjectY[l36];
                                this.wallObjectDirection[i25] = this.wallObjectDirection[l36];
                                this.wallObjectId[i25] = this.wallObjectId[l36];
                            }

                            i25++;
                        } else {
                            this.scene.removeModel(this.wallObjectModel[l36]);
                            this.world.removeWallObject(this.wallObjectX[l36], this.wallObjectY[l36], this.wallObjectDirection[l36], this.wallObjectId[l36]);
                        }
                    }

                    this.wallObjectCount = i25;
                }

                return;
            }

            if (opcode === serverOpcodes.APPEARANCE) {
                this.showAppearanceChange = true;
                return;
            }

            if (opcode === serverOpcodes.TRADE_OPEN) {
                let k3 = Utility.getUnsignedShort(pdata, 1);

                if (this.playerServer[k3] !== null) {
                    this.tradeRecipientName = this.playerServer[k3].name;
                }

                this.showDialogTrade = true;
                this.tradeRecipientAccepted = false;
                this.tradeAccepted = false;
                this.tradeItemsCount = 0;
                this.tradeRecipientItemsCount = 0;
                return;
            }

            if (opcode === serverOpcodes.TRADE_CLOSE) {
                this.showDialogTrade = false;
                this.showDialogTradeConfirm = false;

                return;
            }

            if (opcode === serverOpcodes.TRADE_ITEMS) {
                this.tradeRecipientItemsCount = pdata[1] & 0xff;

                let l3 = 2;

                for (let i11 = 0; i11 < this.tradeRecipientItemsCount; i11++) {
                    this.tradeRecipientItems[i11] = Utility.getUnsignedShort(pdata, l3);
                    l3 += 2;
                    this.tradeRecipientItemCount[i11] = Utility.getUnsignedInt(pdata, l3);
                    l3 += 4;
                }

                this.tradeRecipientAccepted = false;
                this.tradeAccepted = false;

                return;
            }

            if (opcode === serverOpcodes.TRADE_RECIPIENT_STATUS) {
                let byte0 = pdata[1];

                if (byte0 === 1) {
                    this.tradeRecipientAccepted = true;
                    return;
                } else {
                    this.tradeRecipientAccepted = false;
                    return;
                }
            }

            if (opcode === serverOpcodes.SHOP_OPEN) {
                this.showDialogShop = true;

                let off = 1;
                let newItemCount = pdata[off++] & 0xff;
                let shopType = pdata[off++];

                this.shopSellPriceMod = pdata[off++] & 0xff;
                this.shopBuyPriceMod = pdata[off++] & 0xff;

                for (let itemIndex = 0; itemIndex < 40; itemIndex++) {
                    this.shopItem[itemIndex] = -1;
                }

                for (let itemIndex = 0; itemIndex < newItemCount; itemIndex++) {
                    this.shopItem[itemIndex] = Utility.getUnsignedShort(pdata, off);
                    off += 2;
                    this.shopItemCount[itemIndex] = Utility.getUnsignedShort(pdata, off);
                    off += 2;
                    this.shopItemPrice[itemIndex] = pdata[off++];
                }

                // shopType === 1 -> is a general shop
                if (shopType === 1) {
                    let l28 = 39;

                    for (let k33 = 0; k33 < this.inventoryItemsCount; k33++) {
                        if (l28 < newItemCount) {
                            break;
                        }

                        let flag2 = false;

                        for (let j39 = 0; j39 < 40; j39++) {
                            if (this.shopItem[j39] !== this.inventoryItemId[k33]) {
                                continue;
                            }

                            flag2 = true;
                            break;
                        }

                        if (this.inventoryItemId[k33] === 10) {
                            flag2 = true;
                        }

                        if (!flag2) {
                            this.shopItem[l28] = this.inventoryItemId[k33] & 32767;
                            this.shopItemCount[l28] = 0;
                            this.shopItemPrice[l28] = 0;
                            l28--;
                        }
                    }

                }

                if (this.shopSelectedItemIndex >= 0 && this.shopSelectedItemIndex < 40 && this.shopItem[this.shopSelectedItemIndex] !== this.shopSelectedItemType) {
                    this.shopSelectedItemIndex = -1;
                    this.shopSelectedItemType = -2;
                }

                return;
            }

            if (opcode === serverOpcodes.SHOP_CLOSE) {
                this.showDialogShop = false;
                return;
            }

            if (opcode === serverOpcodes.TRADE_STATUS) {
                let byte1 = pdata[1];

                if (byte1 === 1) {
                    this.tradeAccepted = true;
                    return;
                } else {
                    this.tradeAccepted = false;
                    return;
                }
            }

            if (opcode === serverOpcodes.GAME_SETTINGS) {
                this.optionCameraModeAuto = Utility.getUnsignedByte(pdata[1]) === 1;
                this.optionMouseButtonOne = Utility.getUnsignedByte(pdata[2]) === 1;
                this.optionSoundDisabled = Utility.getUnsignedByte(pdata[3]) === 1;

                return;
            }

            if (opcode === serverOpcodes.PRAYER_STATUS) {
                for (let j4 = 0; j4 < psize - 1; j4++) {
                    let on = pdata[j4 + 1] === 1;

                    if (!this.prayerOn[j4] && on) {
                        this.playSoundFile('prayeron');
                    }

                    if (this.prayerOn[j4] && !on) {
                        this.playSoundFile('prayeroff');
                    }

                    this.prayerOn[j4] = on;
                }

                return;
            }

            if (opcode === serverOpcodes.PLAYER_QUEST_LIST) {
                for (let k4 = 0; k4 < QUEST_COUNT; k4++) {
                    this.questComplete[k4] = pdata[k4 + 1] === 1;
                }

                return;
            }

            if (opcode === serverOpcodes.BANK_OPEN) {
                this.showDialogBank = true;

                let l4 = 1;

                this.newBankItemCount = pdata[l4++] & 0xff;
                this.bankItemsMax = pdata[l4++] & 0xff;

                for (let k11 = 0; k11 < this.newBankItemCount; k11++) {
                    this.newBankItems[k11] = Utility.getUnsignedShort(pdata, l4);
                    l4 += 2;
                    this.newBankItemsCount[k11] = Utility.getUnsignedInt2(pdata, l4);

                    if (this.newBankItemsCount[k11] >= 128) {
                        l4 += 4;
                    } else {
                        l4++;
                    }
                }

                this.updateBankItems();
                return;
            }

            if (opcode === serverOpcodes.BANK_CLOSE) {
                this.showDialogBank = false;
                return;
            }

            if (opcode === serverOpcodes.PLAYER_STAT_EXPERIENCE_UPDATE) {
                let i5 = pdata[1] & 0xff;
                this.playerExperience[i5] = Utility.getUnsignedInt(pdata, 2);
                return;
            }

            if (opcode === serverOpcodes.DUEL_OPEN) {
                let j5 = Utility.getUnsignedShort(pdata, 1);

                if (this.playerServer[j5] !== null) {
                    this.duelOpponentName = this.playerServer[j5].name;
                }

                this.showDialogDuel = true;
                this.duelOfferItemCount = 0;
                this.duelOfferOpponentItemCount = 0;
                this.duelOfferOpponentAccepted = false;
                this.duelOfferAccepted = false;
                this.duelSettingsRetreat = false;
                this.duelSettingsMagic = false;
                this.duelSettingsPrayer = false;
                this.duelSettingsWeapons = false;

                return;
            }

            if (opcode === serverOpcodes.DUEL_CLOSE) {
                this.showDialogDuel = false;
                this.showDialogDuelConfirm = false;
                return;
            }

            if (opcode === serverOpcodes.TRADE_CONFIRM_OPEN) {
                this.showDialogTradeConfirm = true;
                this.tradeConfirmAccepted = false;
                this.showDialogTrade = false;

                let k5 = 1;

                this.tradeRecipientConfirmHash = Utility.getUnsignedLong(pdata, k5);
                k5 += 8;
                this.tradeRecipientConfirmItemsCount = pdata[k5++] & 0xff;

                for (let l11 = 0; l11 < this.tradeRecipientConfirmItemsCount; l11++) {
                    this.tradeRecipientConfirmItems[l11] = Utility.getUnsignedShort(pdata, k5);
                    k5 += 2;
                    this.tradeRecipientConfirmItemCount[l11] = Utility.getUnsignedInt(pdata, k5);
                    k5 += 4;
                }

                this.tradeConfirmItemsCount = pdata[k5++] & 0xff;

                for (let k17 = 0; k17 < this.tradeConfirmItemsCount; k17++) {
                    this.tradeConfirmItems[k17] = Utility.getUnsignedShort(pdata, k5);
                    k5 += 2;
                    this.tradeConfirmItemCount[k17] = Utility.getUnsignedInt(pdata, k5);
                    k5 += 4;
                }

                return;
            }

            if (opcode === serverOpcodes.DUEL_UPDATE) {
                this.duelOfferOpponentItemCount = pdata[1] & 0xff;

                let l5 = 2;

                for (let i12 = 0; i12 < this.duelOfferOpponentItemCount; i12++) {
                    this.duelOfferOpponentItemId[i12] = Utility.getUnsignedShort(pdata, l5);
                    l5 += 2;
                    this.duelOfferOpponentItemStack[i12] = Utility.getUnsignedInt(pdata, l5);
                    l5 += 4;
                }

                this.duelOfferOpponentAccepted = false;
                this.duelOfferAccepted = false;

                return;
            }

            if (opcode === serverOpcodes.DUEL_SETTINGS) {
                if (pdata[1] === 1) {
                    this.duelSettingsRetreat = true;
                } else {
                    this.duelSettingsRetreat = false;
                }

                if (pdata[2] === 1) {
                    this.duelSettingsMagic = true;
                } else {
                    this.duelSettingsMagic = false;
                }

                if (pdata[3] === 1) {
                    this.duelSettingsPrayer = true;
                } else {
                    this.duelSettingsPrayer = false;
                }

                if (pdata[4] === 1) {
                    this.duelSettingsWeapons = true;
                } else {
                    this.duelSettingsWeapons = false;
                }

                this.duelOfferOpponentAccepted = false;
                this.duelOfferAccepted = false;

                return;
            }

            if (opcode === serverOpcodes.BANK_UPDATE) {
                let i6 = 1;
                let itemsCountOld = pdata[i6++] & 0xff;
                let item = Utility.getUnsignedShort(pdata, i6);

                i6 += 2;

                let itemCount = Utility.getUnsignedInt2(pdata, i6);

                if (itemCount >= 128) {
                    i6 += 4;
                } else {
                    i6++;
                }

                if (itemCount === 0) {
                    this.newBankItemCount--;

                    for (let k25 = itemsCountOld; k25 < this.newBankItemCount; k25++) {
                        this.newBankItems[k25] = this.newBankItems[k25 + 1];
                        this.newBankItemsCount[k25] = this.newBankItemsCount[k25 + 1];
                    }
                } else {
                    this.newBankItems[itemsCountOld] = item;
                    this.newBankItemsCount[itemsCountOld] = itemCount;

                    if (itemsCountOld >= this.newBankItemCount) {
                        this.newBankItemCount = itemsCountOld + 1;
                    }
                }

                this.updateBankItems();
                return;
            }

            if (opcode === serverOpcodes.INVENTORY_ITEM_UPDATE) {
                let offset = 1;
                let stack = 1;
                let index = pdata[offset++] & 0xff;
                let id = Utility.getUnsignedShort(pdata, offset);

                offset += 2;

                if (GameData.itemStackable[id & 32767] === 0) {
                    stack = Utility.getUnsignedInt2(pdata, offset);

                    if (stack >= 128) {
                        offset += 4;
                    } else {
                        offset++;
                    }
                }

                this.inventoryItemId[index] = id & 32767;
                this.inventoryEquipped[index] = (id / 32768) | 0;
                this.inventoryItemStackCount[index] = stack;

                if (index >= this.inventoryItemsCount) {
                    this.inventoryItemsCount = index + 1;
                }

                return;
            }

            if (opcode === serverOpcodes.INVENTORY_ITEM_REMOVE) {
                let index = pdata[1] & 0xff;

                this.inventoryItemsCount--;

                for (let l12 = index; l12 < this.inventoryItemsCount; l12++) {
                    this.inventoryItemId[l12] = this.inventoryItemId[l12 + 1];
                    this.inventoryItemStackCount[l12] = this.inventoryItemStackCount[l12 + 1];
                    this.inventoryEquipped[l12] = this.inventoryEquipped[l12 + 1];
                }

                return;
            }

            if (opcode === serverOpcodes.PLAYER_STAT_UPDATE) {
                let l6 = 1;
                let i13 = pdata[l6++] & 0xff;

                this.playerStatCurrent[i13] = Utility.getUnsignedByte(pdata[l6++]);
                this.playerStatBase[i13] = Utility.getUnsignedByte(pdata[l6++]);
                this.playerExperience[i13] = Utility.getUnsignedInt(pdata, l6);
                l6 += 4;

                return;
            }

            if (opcode === serverOpcodes.DUEL_OPPONENT_ACCEPTED) {
                let byte2 = pdata[1];

                if (byte2 === 1) {
                    this.duelOfferOpponentAccepted = true;
                    return;
                } else {
                    this.duelOfferOpponentAccepted = false;
                    return;
                }
            }

            if (opcode === serverOpcodes.DUEL_ACCEPTED) {
                let byte3 = pdata[1];

                if (byte3 === 1) {
                    this.duelOfferAccepted = true;
                    return;
                } else {
                    this.duelOfferAccepted = false;
                    return;
                }
            }

            if (opcode === serverOpcodes.DUEL_CONFIRM_OPEN) {
                this.showDialogDuelConfirm = true;
                this.duelAccepted = false;
                this.showDialogDuel = false;

                let off = 1;

                this.duelOpponentNameHash = Utility.getUnsignedLong(pdata, off);
                off += 8;
                this.duelOpponentItemsCount = pdata[off++] & 0xff;

                for (let j13 = 0; j13 < this.duelOpponentItemsCount; j13++) {
                    this.duelOpponentItems[j13] = Utility.getUnsignedShort(pdata, off);
                    off += 2;
                    this.duelOpponentItemCount[j13] = Utility.getUnsignedInt(pdata, off);
                    off += 4;
                }

                this.duelItemsCount = pdata[off++] & 0xff;

                for (let j18 = 0; j18 < this.duelItemsCount; j18++) {
                    this.duelItems[j18] = Utility.getUnsignedShort(pdata, off);
                    off += 2;
                    this.duelItemCount[j18] = Utility.getUnsignedInt(pdata, off);
                    off += 4;
                }

                this.duelOptionRetreat = pdata[off++] & 0xff;
                this.duelOptionMagic = pdata[off++] & 0xff;
                this.duelOptionPrayer = pdata[off++] & 0xff;
                this.duelOptionWeapons = pdata[off++] & 0xff;

                return;
            }

            if (opcode === serverOpcodes.SOUND) {
                let s = fromCharArray(pdata.slice(1, psize));
                this.playSoundFile(s);
                return;
            }

            if (opcode === serverOpcodes.TELEPORT_BUBBLE) {
                if (this.teleportBubbleCount < 50) {
                    let type = pdata[1] & 0xff;
                    let x = pdata[2] + this.localRegionX;
                    let y = pdata[3] + this.localRegionY;
                    this.teleportBubbleType[this.teleportBubbleCount] = type;
                    this.teleportBubbleTime[this.teleportBubbleCount] = 0;
                    this.teleportBubbleX[this.teleportBubbleCount] = x;
                    this.teleportBubbleY[this.teleportBubbleCount] = y;
                    this.teleportBubbleCount++;
                }

                return;
            }

            if (opcode === serverOpcodes.WELCOME) {
                if (!this.welcomScreenAlreadyShown) {
                    this.welcomeLastLoggedInIP = Utility.getUnsignedInt(pdata, 1);
                    this.welcomeLastLoggedInDays = Utility.getUnsignedShort(pdata, 5);
                    this.welcomeRecoverySetDays = pdata[7] & 0xff;
                    this.welcomeUnreadMessages = Utility.getUnsignedShort(pdata, 8);
                    this.showDialogWelcome = true;
                    this.welcomScreenAlreadyShown = true;
                    this.welcomeLastLoggedInHost = null;
                }

                return;
            }

            if (opcode === serverOpcodes.SERVER_MESSAGE) {
                this.serverMessage = fromCharArray(pdata.slice(1, psize));
                this.showDialogServerMessage = true;
                this.serverMessageBoxTop = false;

                return;
            }

            if (opcode === serverOpcodes.SERVER_MESSAGE_ONTOP) {
                this.serverMessage = fromCharArray(pdata.slice(1, psize));
                this.showDialogServerMessage = true;
                this.serverMessageBoxTop = true;

                return;
            }

            if (opcode === serverOpcodes.PLAYER_STAT_FATIGUE) {
                this.statFatigue = Utility.getUnsignedShort(pdata, 1);
                return;
            }

            if (opcode === serverOpcodes.SLEEP_OPEN) {
                if (!this.isSleeping) {
                    this.fatigueSleeping = this.statFatigue;
                }

                this.isSleeping = true;
                this.inputTextCurrent = '';
                this.inputTextFinal = '';
                this.surface.readSleepWord(this.spriteTexture + 1, pdata);
                this.sleepingStatusText = null;

                return;
            }

            if (opcode === serverOpcodes.PLAYER_STAT_FATIGUE_ASLEEP) {
                this.fatigueSleeping = Utility.getUnsignedShort(pdata, 1);
                return;
            }

            if (opcode === serverOpcodes.SLEEP_CLOSE) {
                this.isSleeping = false;
                return;
            }

            if (opcode === serverOpcodes.SLEEP_INCORRECT) {
                this.sleepingStatusText = 'Incorrect - Please wait...';
                return;
            }

            if (opcode === serverOpcodes.SYSTEM_UPDATE) {
                this.systemUpdate = Utility.getUnsignedShort(pdata, 1) * 32;
                return;
            }
        } catch (e) {
            console.error(e);

            if (this.packetErrorCount < 3) {
                let s1 = e.stack;
                let slen = s1.length;

                this.packetStream.newPacket(clientOpcodes.PACKET_EXCEPTION);
                this.packetStream.putShort(slen);
                this.packetStream.putString(s1);
                this.packetStream.putShort(slen = (s1 = 'p-type: ' + opcode + '(' + ptype + ') p-size:' + psize).length);
                this.packetStream.putString(s1);
                this.packetStream.putShort(slen = (s1 = 'rx:' + this.localRegionX + ' ry:' + this.localRegionY + ' num3l:' + this.objectCount).length);
                this.packetStream.putString(s1);

                s1 = '';

                for (let l18 = 0; l18 < 80 && l18 < psize; l18++) {
                    s1 = s1 + pdata[l18] + ' ';
                }

                this.packetStream.putShort(s1.length);
                this.packetStream.putString(s1);
                this.packetStream.sendPacket();
                this.packetErrorCount++;
            }

            this.packetStream.closeStream();
            this.resetLoginVars();
        }
    }

    createRightClickMenu() {
        let i = 2203 - (this.localRegionY + this.planeHeight + this.regionY);

        if (this.localRegionX + this.planeWidth + this.regionX >= 2640) {
            i = -50;
        }

        let j = -1;

        for (let k = 0; k < this.objectCount; k++) {
            this.objectAlreadyInMenu[k] = false;
        }

        for (let l = 0; l < this.wallObjectCount; l++) {
            this.wallObjectAlreadyInMenu[l] = false;
        }

        let i1 = this.scene.getMousePickedCount();
        let objs = this.scene.getMousePickedModels();
        let plyrs = this.scene.getMousePickedFaces();

        for (let menuIdx = 0; menuIdx < i1; menuIdx++) {
            if (this.menuItemsCount > 200) {
                break;
            }

            let pid = plyrs[menuIdx];
            let gameModel = objs[menuIdx];

            if (gameModel.faceTag[pid] <= 65535 || gameModel.faceTag[pid] >= 200000 && gameModel.faceTag[pid] <= 300000)  {
                if (gameModel === this.scene.view) {
                    let idx = gameModel.faceTag[pid] % 10000;
                    let type = (gameModel.faceTag[pid] / 10000) | 0;

                    if (type === 1) {
                        let menuText = '';
                        let k3 = 0;

                        if (this.localPlayer.level > 0 && this.players[idx].level > 0) {
                            k3 = this.localPlayer.level - this.players[idx].level;
                        }

                        if (k3 < 0) {
                            menuText = '@or1@';
                        }

                        if (k3 < -3) {
                            menuText = '@or2@';
                        }

                        if (k3 < -6) {
                            menuText = '@or3@';
                        }

                        if (k3 < -9) {
                            menuText = '@red@';
                        }

                        if (k3 > 0) {
                            menuText = '@gr1@';
                        }

                        if (k3 > 3) {
                            menuText = '@gr2@';
                        }

                        if (k3 > 6) {
                            menuText = '@gr3@';
                        }

                        if (k3 > 9) {
                            menuText = '@gre@';
                        }

                        menuText = ' ' + menuText + '(level-' + this.players[idx].level + ')';

                        if (this.selectedSpell >= 0) {
                            if (GameData.spellType[this.selectedSpell] === 1 || GameData.spellType[this.selectedSpell] === 2) {
                                this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                                this.menuItemText2[this.menuItemsCount] = '@whi@' + this.players[idx].name + menuText;
                                this.menuType[this.menuItemsCount] = 800;
                                this.menuItemX[this.menuItemsCount] = this.players[idx].currentX;
                                this.menuItemY[this.menuItemsCount] = this.players[idx].currentY;
                                this.menuIndex[this.menuItemsCount] = this.players[idx].serverIndex;
                                this.menuSourceIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@whi@' + this.players[idx].name + menuText;
                            this.menuType[this.menuItemsCount] = 810;
                            this.menuItemX[this.menuItemsCount] = this.players[idx].currentX;
                            this.menuItemY[this.menuItemsCount] = this.players[idx].currentY;
                            this.menuIndex[this.menuItemsCount] = this.players[idx].serverIndex;
                            this.menuSourceIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            if (i > 0 && (((this.players[idx].currentY - 64) / this.magicLoc + this.planeHeight + this.regionY) | 0) < 2203) {
                                this.menuItemText1[this.menuItemsCount] = 'Attack';
                                this.menuItemText2[this.menuItemsCount] = '@whi@' + this.players[idx].name + menuText;

                                if (k3 >= 0 && k3 < 5) {
                                    this.menuType[this.menuItemsCount] = 805;
                                } else {
                                    this.menuType[this.menuItemsCount] = 2805;
                                }

                                this.menuItemX[this.menuItemsCount] = this.players[idx].currentX;
                                this.menuItemY[this.menuItemsCount] = this.players[idx].currentY;
                                this.menuIndex[this.menuItemsCount] = this.players[idx].serverIndex;
                                this.menuItemsCount++;
                            } else if (this.members) {
                                this.menuItemText1[this.menuItemsCount] = 'Duel with';
                                this.menuItemText2[this.menuItemsCount] = '@whi@' + this.players[idx].name + menuText;
                                this.menuItemX[this.menuItemsCount] = this.players[idx].currentX;
                                this.menuItemY[this.menuItemsCount] = this.players[idx].currentY;
                                this.menuType[this.menuItemsCount] = 2806;
                                this.menuIndex[this.menuItemsCount] = this.players[idx].serverIndex;
                                this.menuItemsCount++;
                            }

                            this.menuItemText1[this.menuItemsCount] = 'Trade with';
                            this.menuItemText2[this.menuItemsCount] = '@whi@' + this.players[idx].name + menuText;
                            this.menuType[this.menuItemsCount] = 2810;
                            this.menuIndex[this.menuItemsCount] = this.players[idx].serverIndex;
                            this.menuItemsCount++;
                            this.menuItemText1[this.menuItemsCount] = 'Follow';
                            this.menuItemText2[this.menuItemsCount] = '@whi@' + this.players[idx].name + menuText;
                            this.menuType[this.menuItemsCount] = 2820;
                            this.menuIndex[this.menuItemsCount] = this.players[idx].serverIndex;
                            this.menuItemsCount++;
                        }
                    } else if (type === 2) {
                        if (this.selectedSpell >= 0) {
                            if (GameData.spellType[this.selectedSpell] === 3) {
                                this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                                this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[this.groundItemId[idx]];
                                this.menuType[this.menuItemsCount] = 200;
                                this.menuItemX[this.menuItemsCount] = this.groundItemX[idx];
                                this.menuItemY[this.menuItemsCount] = this.groundItemY[idx];
                                this.menuIndex[this.menuItemsCount] = this.groundItemId[idx];
                                this.menuSourceIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[this.groundItemId[idx]];
                            this.menuType[this.menuItemsCount] = 210;
                            this.menuItemX[this.menuItemsCount] = this.groundItemX[idx];
                            this.menuItemY[this.menuItemsCount] = this.groundItemY[idx];
                            this.menuIndex[this.menuItemsCount] = this.groundItemId[idx];
                            this.menuSourceIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            this.menuItemText1[this.menuItemsCount] = 'Take';
                            this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[this.groundItemId[idx]];
                            this.menuType[this.menuItemsCount] = 220;
                            this.menuItemX[this.menuItemsCount] = this.groundItemX[idx];
                            this.menuItemY[this.menuItemsCount] = this.groundItemY[idx];
                            this.menuIndex[this.menuItemsCount] = this.groundItemId[idx];
                            this.menuItemsCount++;
                            this.menuItemText1[this.menuItemsCount] = 'Examine';
                            this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[this.groundItemId[idx]];
                            this.menuType[this.menuItemsCount] = 3200;
                            this.menuIndex[this.menuItemsCount] = this.groundItemId[idx];
                            this.menuItemsCount++;
                        }
                    } else if (type === 3) {
                        let menuText = '';
                        let levelDiff = -1;
                        let id = this.npcs[idx].npcId;

                        if (GameData.npcAttackable[id] > 0) {
                            let npcLevel = ((GameData.npcAttack[id] + GameData.npcDefense[id] + GameData.npcStrength[id] + GameData.npcHits[id]) / 4) | 0;
                            let playerLevel = ((this.playerStatBase[0] + this.playerStatBase[1] + this.playerStatBase[2] + this.playerStatBase[3] + 27) / 4) | 0;

                            levelDiff = playerLevel - npcLevel;
                            menuText = '@yel@';

                            if (levelDiff < 0) {
                                menuText = '@or1@';
                            }

                            if (levelDiff < -3) {
                                menuText = '@or2@';
                            }

                            if (levelDiff < -6) {
                                menuText = '@or3@';
                            }

                            if (levelDiff < -9) {
                                menuText = '@red@';
                            }

                            if (levelDiff > 0) {
                                menuText = '@gr1@';
                            }

                            if (levelDiff > 3) {
                                menuText = '@gr2@';
                            }

                            if (levelDiff > 6) {
                                menuText = '@gr3@';
                            }

                            if (levelDiff > 9) {
                                menuText = '@gre@';
                            }

                            menuText = ' ' + menuText + '(level-' + npcLevel + ')';
                        }

                        if (this.selectedSpell >= 0) {
                            if (GameData.spellType[this.selectedSpell] === 2) {
                                this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                                this.menuItemText2[this.menuItemsCount] = '@yel@' + GameData.npcName[this.npcs[idx].npcId];
                                this.menuType[this.menuItemsCount] = 700;
                                this.menuItemX[this.menuItemsCount] = this.npcs[idx].currentX;
                                this.menuItemY[this.menuItemsCount] = this.npcs[idx].currentY;
                                this.menuIndex[this.menuItemsCount] = this.npcs[idx].serverIndex;
                                this.menuSourceIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@yel@' + GameData.npcName[this.npcs[idx].npcId];
                            this.menuType[this.menuItemsCount] = 710;
                            this.menuItemX[this.menuItemsCount] = this.npcs[idx].currentX;
                            this.menuItemY[this.menuItemsCount] = this.npcs[idx].currentY;
                            this.menuIndex[this.menuItemsCount] = this.npcs[idx].serverIndex;
                            this.menuSourceIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            if (GameData.npcAttackable[id] > 0) {
                                this.menuItemText1[this.menuItemsCount] = 'Attack';
                                this.menuItemText2[this.menuItemsCount] = '@yel@' + GameData.npcName[this.npcs[idx].npcId] + menuText;

                                if (levelDiff >= 0) {
                                    this.menuType[this.menuItemsCount] = 715;
                                } else {
                                    this.menuType[this.menuItemsCount] = 2715;
                                }

                                this.menuItemX[this.menuItemsCount] = this.npcs[idx].currentX;
                                this.menuItemY[this.menuItemsCount] = this.npcs[idx].currentY;
                                this.menuIndex[this.menuItemsCount] = this.npcs[idx].serverIndex;
                                this.menuItemsCount++;
                            }

                            this.menuItemText1[this.menuItemsCount] = 'Talk-to';
                            this.menuItemText2[this.menuItemsCount] = '@yel@' + GameData.npcName[this.npcs[idx].npcId];
                            this.menuType[this.menuItemsCount] = 720;
                            this.menuItemX[this.menuItemsCount] = this.npcs[idx].currentX;
                            this.menuItemY[this.menuItemsCount] = this.npcs[idx].currentY;
                            this.menuIndex[this.menuItemsCount] = this.npcs[idx].serverIndex;
                            this.menuItemsCount++;

                            if (GameData.npcCommand[id] !== '') {
                                this.menuItemText1[this.menuItemsCount] = GameData.npcCommand[id];
                                this.menuItemText2[this.menuItemsCount] = '@yel@' + GameData.npcName[this.npcs[idx].npcId];
                                this.menuType[this.menuItemsCount] = 725;
                                this.menuItemX[this.menuItemsCount] = this.npcs[idx].currentX;
                                this.menuItemY[this.menuItemsCount] = this.npcs[idx].currentY;
                                this.menuIndex[this.menuItemsCount] = this.npcs[idx].serverIndex;
                                this.menuItemsCount++;
                            }

                            this.menuItemText1[this.menuItemsCount] = 'Examine';
                            this.menuItemText2[this.menuItemsCount] = '@yel@' + GameData.npcName[this.npcs[idx].npcId];
                            this.menuType[this.menuItemsCount] = 3700;
                            this.menuIndex[this.menuItemsCount] = this.npcs[idx].npcId;
                            this.menuItemsCount++;
                        }
                    }
                } else if (gameModel !== null && gameModel.key >= 10000) {
                    let idx = gameModel.key - 10000;
                    let id = this.wallObjectId[idx];

                    if (!this.wallObjectAlreadyInMenu[idx]) {
                        if (this.selectedSpell >= 0) {
                            if (GameData.spellType[this.selectedSpell] === 4) {
                                this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                                this.menuType[this.menuItemsCount] = 300;
                                this.menuItemX[this.menuItemsCount] = this.wallObjectX[idx];
                                this.menuItemY[this.menuItemsCount] = this.wallObjectY[idx];
                                this.menuIndex[this.menuItemsCount] = this.wallObjectDirection[idx];
                                this.menuSourceIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                            this.menuType[this.menuItemsCount] = 310;
                            this.menuItemX[this.menuItemsCount] = this.wallObjectX[idx];
                            this.menuItemY[this.menuItemsCount] = this.wallObjectY[idx];
                            this.menuIndex[this.menuItemsCount] = this.wallObjectDirection[idx];
                            this.menuSourceIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            if (!/^WalkTo$/i.test(GameData.wallObjectCommand1[id])) {
                                this.menuItemText1[this.menuItemsCount] = GameData.wallObjectCommand1[id];
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                                this.menuType[this.menuItemsCount] = 320;
                                this.menuItemX[this.menuItemsCount] = this.wallObjectX[idx];
                                this.menuItemY[this.menuItemsCount] = this.wallObjectY[idx];
                                this.menuIndex[this.menuItemsCount] = this.wallObjectDirection[idx];
                                this.menuItemsCount++;
                            }

                            if (!/^Examine$/i.test(GameData.wallObjectCommand2[id])) {
                                this.menuItemText1[this.menuItemsCount] = GameData.wallObjectCommand2[id];
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                                this.menuType[this.menuItemsCount] = 2300;
                                this.menuItemX[this.menuItemsCount] = this.wallObjectX[idx];
                                this.menuItemY[this.menuItemsCount] = this.wallObjectY[idx];
                                this.menuIndex[this.menuItemsCount] = this.wallObjectDirection[idx];
                                this.menuItemsCount++;
                            }

                            this.menuItemText1[this.menuItemsCount] = 'Examine';
                            this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                            this.menuType[this.menuItemsCount] = 3300;
                            this.menuIndex[this.menuItemsCount] = id;
                            this.menuItemsCount++;
                        }

                        this.wallObjectAlreadyInMenu[idx] = true;
                    }
                } else if (gameModel !== null && gameModel.key >= 0) {
                    let idx = gameModel.key;
                    let id = this.objectId[idx];

                    if (!this.objectAlreadyInMenu[idx]) {
                        if (this.selectedSpell >= 0) {
                            if (GameData.spellType[this.selectedSpell] === 5) {
                                this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                                this.menuType[this.menuItemsCount] = 400;
                                this.menuItemX[this.menuItemsCount] = this.objectX[idx];
                                this.menuItemY[this.menuItemsCount] = this.objectY[idx];
                                this.menuIndex[this.menuItemsCount] = this.objectDirection[idx];
                                this.menuSourceIndex[this.menuItemsCount] = this.objectId[idx];
                                this.menuTargetIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                            this.menuType[this.menuItemsCount] = 410;
                            this.menuItemX[this.menuItemsCount] = this.objectX[idx];
                            this.menuItemY[this.menuItemsCount] = this.objectY[idx];
                            this.menuIndex[this.menuItemsCount] = this.objectDirection[idx];
                            this.menuSourceIndex[this.menuItemsCount] = this.objectId[idx];
                            this.menuTargetIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            if (!/^WalkTo$/i.test(GameData.objectCommand1[id])) {
                                this.menuItemText1[this.menuItemsCount] = GameData.objectCommand1[id];
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                                this.menuType[this.menuItemsCount] = 420;
                                this.menuItemX[this.menuItemsCount] = this.objectX[idx];
                                this.menuItemY[this.menuItemsCount] = this.objectY[idx];
                                this.menuIndex[this.menuItemsCount] = this.objectDirection[idx];
                                this.menuSourceIndex[this.menuItemsCount] = this.objectId[idx];
                                this.menuItemsCount++;
                            }

                            if (!/^Examine$/i.test(GameData.objectCommand2[id])) {
                                this.menuItemText1[this.menuItemsCount] = GameData.objectCommand2[id];
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                                this.menuType[this.menuItemsCount] = 2400;
                                this.menuItemX[this.menuItemsCount] = this.objectX[idx];
                                this.menuItemY[this.menuItemsCount] = this.objectY[idx];
                                this.menuIndex[this.menuItemsCount] = this.objectDirection[idx];
                                this.menuSourceIndex[this.menuItemsCount] = this.objectId[idx];
                                this.menuItemsCount++;
                            }

                            this.menuItemText1[this.menuItemsCount] = 'Examine';
                            this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                            this.menuType[this.menuItemsCount] = 3400;
                            this.menuIndex[this.menuItemsCount] = id;
                            this.menuItemsCount++;
                        }

                        this.objectAlreadyInMenu[idx] = true;
                    }
                } else {
                    if (pid >= 0) {
                        pid = gameModel.faceTag[pid] - 200000;
                    }

                    if (pid >= 0) {
                        j = pid;
                    }
                }
            }
        }

        if (this.selectedSpell >= 0 && GameData.spellType[this.selectedSpell] <= 1) {
            this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on self';
            this.menuItemText2[this.menuItemsCount] = '';
            this.menuType[this.menuItemsCount] = 1000;
            this.menuIndex[this.menuItemsCount] = this.selectedSpell;
            this.menuItemsCount++;
        }

        if (j !== -1) {
            if (this.selectedSpell >= 0) {
                if (GameData.spellType[this.selectedSpell] === 6) {
                    this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on ground';
                    this.menuItemText2[this.menuItemsCount] = '';
                    this.menuType[this.menuItemsCount] = 900;
                    this.menuItemX[this.menuItemsCount] = this.world.localX[j];
                    this.menuItemY[this.menuItemsCount] = this.world.localY[j];
                    this.menuIndex[this.menuItemsCount] = this.selectedSpell;
                    this.menuItemsCount++;

                    return;
                }
            } else if (this.selectedItemInventoryIndex < 0) {
                this.menuItemText1[this.menuItemsCount] = 'Walk here';
                this.menuItemText2[this.menuItemsCount] = '';
                this.menuType[this.menuItemsCount] = 920;
                this.menuItemX[this.menuItemsCount] = this.world.localX[j];
                this.menuItemY[this.menuItemsCount] = this.world.localY[j];
                this.menuItemsCount++;
            }
        }
    }

    async handleInputs() {
        if (this.errorLoadingCodebase || this.errorLoadingMemory ||
            this.errorLoadingData) {
            return;
        }

        try {
            this.loginTimer++;

            if (this.loggedIn === 0) {
                this.mouseActionTimeout = 0;
                await this.handleLoginScreenInput();
            } else if (this.loggedIn === 1) {
                this.mouseActionTimeout++;
                await this.handleGameInput();
            }

            this.lastMouseButtonDown = 0;
            this.cameraRotationTime++;

            if (this.cameraRotationTime > 500) {
                this.cameraRotationTime = 0;

                let i = (Math.random() * 4) | 0;

                if ((i & 1) === 1) {
                    this.cameraRotationX += this.cameraRotationXIncrement;
                }

                if ((i & 2) === 2) {
                    this.cameraRotationY += this.cameraRotationYIncrement;
                }
            }

            if (this.cameraRotationX < -50) {
                this.cameraRotationXIncrement = 2;
            } else if (this.cameraRotationX > 50) {
                this.cameraRotationXIncrement = -2;
            }

            if (this.cameraRotationY < -50) {
                this.cameraRotationYIncrement = 2;
            } else if (this.cameraRotationY > 50) {
                this.cameraRotationYIncrement = -2;
            }

            if (this.messageTabFlashAll > 0) {
                this.messageTabFlashAll--;
            }

            if (this.messageTabFlashHistory > 0) {
                this.messageTabFlashHistory--;
            }

            if (this.messageTabFlashQuest > 0) {
                this.messageTabFlashQuest--;
            }

            if (this.messageTabFlashPrivate > 0) {
                this.messageTabFlashPrivate--;
                return;
            }
        } catch (e) {
            // OutOfMemory
            console.error(e);
            this.disposeAndCollect();
            this.errorLoadingMemory = true;
        }
    }

    async loadMaps() {
        this.world.mapPack = await this.readDataFile('maps' + version.MAPS + '.jag', 'map', 70);

        if (this.members) {
            this.world.memberMapPack = await this.readDataFile('maps' + version.MAPS + '.mem', 'members map', 75);
        }

        this.world.landscapePack = await this.readDataFile('land' + version.MAPS + '.jag', 'landscape', 80);

        if (this.members) {
            this.world.memberLandscapePack = await this.readDataFile('land' + version.MAPS + '.mem', 'members landscape', 85);
        }
    }

    createModel(x, y, direction, id, count) {
        let x1 = x;
        let y1 = y;
        let x2 = x;
        let y2 = y;
        let j2 = GameData.wallObjectTextureFront[id];
        let k2 = GameData.wallObjectTextureBack[id];
        let l2 = GameData.wallObjectHeight[id];
        let gameModel = GameModel._from2(4, 1);

        if (direction === 0) {
            x2 = x + 1;
        } else if (direction === 1) {
            y2 = y + 1;
        } else if (direction === 2) {
            x1 = x + 1;
            y2 = y + 1;
        } else if (direction === 3) {
            x2 = x + 1;
            y2 = y + 1;
        }

        x1 *= this.magicLoc;
        y1 *= this.magicLoc;
        x2 *= this.magicLoc;
        y2 *= this.magicLoc;

        let i3 = gameModel.vertexAt(x1, -this.world.getElevation(x1, y1), y1);
        let j3 = gameModel.vertexAt(x1, -this.world.getElevation(x1, y1) - l2, y1);
        let k3 = gameModel.vertexAt(x2, -this.world.getElevation(x2, y2) - l2, y2);
        let l3 = gameModel.vertexAt(x2, -this.world.getElevation(x2, y2), y2);
        let ai = new Int32Array([i3, j3, k3, l3]);

        gameModel.createFace(4, ai, j2, k2);
        gameModel._setLight_from6(false, 60, 24, -50, -10, -50);

        if (x >= 0 && y >= 0 && x < 96 && y < 96) {
            this.scene.addModel(gameModel);
        }

        gameModel.key = count + 10000;

        return gameModel;
    }
}

module.exports = mudclient;
