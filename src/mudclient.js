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
const getPacketHandlers = require('./packet-handlers');
const keycodes = require('./lib/keycodes');
const clientOpcodes = require('./opcodes/client');
const version = require('./version');

const ZOOM_MIN = 450;
const ZOOM_MAX = 1250;
const ZOOM_INDOORS = 550;
const ZOOM_OUTDOORS = 750;

const MENU_MAX = 250;
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

class mudclient extends GameConnection {
    constructor(canvas) {
        super(canvas);

        // attach methods and properties from files in ./ui/
        applyUIComponents(this);

        // { opcode: function handler (data) { } }
        this.packetHandlers = getPacketHandlers(this);

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
        this.combatTimeout = 0;
        this.optionMenuCount = 0;
        this.errorLoadingCodebase = false;
        this.cameraRotationTime = 0;
        this.duelOpponentItemsCount = 0;
        this.duelItemsCount = 0;
        this.duelOfferOpponentItemCount = 0;

        this.characterHairColours = new Int32Array([
            0xffc030, 0xffa040, 0x805030, 0x604020, 0x303030, 0xff6020, 0xff4000, 0xffffff, 65280, 65535
        ]);

        this.characterTopBottomColours = new Int32Array([
            0xff0000, 0xff8000, 0xffe000, 0xa0e000, 0x00e000,
            0x008000, 0x00a080, 0x00b0ff, 0x0080ff, 0x0030f0,
            0xe000e0, 0x303030, 0x604000, 0x805000, 0xffffff
        ]);

        this.characterSkinColours = new Int32Array([
            0xecded0, 0xccb366, 0xb38c40, 0x997326, 0x906020
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
        this.showUITab = 0;
        this.tradeItemsCount = 0;
        this.planeWidth = 0;
        this.planeHeight = 0;
        this.planeMultiplier = 0;
        this.playerQuestPoints = 0;
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

        this.menuIndices = new Int32Array(MENU_MAX);
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
        this.menuItemX = new Int32Array(MENU_MAX);
        this.menuItemY = new Int32Array(MENU_MAX);
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
        this.menuItemText1.length = MENU_MAX;
        this.menuItemText1.fill(null);
        this.duelOpponentName = '';
        this.lastObjectAnimationNumberFireLightningSpell = -1;
        this.lastObjectAnimationNumberTorch = -1;
        this.lastObjectAnimationNumberClaw = -1;
        this.planeIndex = -1;
        this.welcomScreenAlreadyShown = false;
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
        this.menuIndex = new Int32Array(MENU_MAX);
        this.menuSourceIndex = new Int32Array(MENU_MAX);
        this.menuTargetIndex = new Int32Array(MENU_MAX);
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
        this.groundItemID = new Int32Array(GROUND_ITEMS_MAX);
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
        this.menuType = new Int32Array(MENU_MAX);
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
        this.menuItemText2.length = MENU_MAX;
        this.menuItemText2.fill(null);
        this.npcsServer = [];
        this.npcsServer.length = NPCS_SERVER_MAX;
        this.npcsServer.fill(null);
        this.playerStatEquipment = new Int32Array(PLAYER_STAT_EQUIPMENT_COUNT);
        this.objectModel = [];
        this.objectModel.length = OBJECTS_MAX;
        this.objectModel.fill(null);

        // message scrollback
        this.playerMsgHistory = [];
        this.playerMsgPtr = 0;

        this.recoveryQuestions = [
            'Where were you born?',
            'What was your first teachers name?',
            'What is your fathers middle name?',
            'Who was your first best friend?',
            'What is your favourite vacation spot?',
            'What is your mothers middle name?',
            'What was your first pets name?',
            'What was the name of your first school?',
            'What is your mothers maiden name?',
            'Who was your first boyfriend/girlfriend?',
            'What was the first computer game you purchased?',
            'Who is your favourite actor/actress?',
            'Who is your favourite author?',
            'Who is your favourite musician?',
            'Who is your favourite cartoon character?',
            'What is your favourite book?',
            'What is your favourite food?',
            'What is your favourite movie?'
        ];

        this.showRecoverChange = false;
        this.recoverCustomQuestionIndex = -1;
        this.showChangePasswordStep = 0;
        this.changePasswordOld = '';
        this.changePasswordNew = '';
        this.welcomeTipDay = 0;
    }

    playSoundFile(soundName) {
        if (!this.audioPlayer || this.optionSoundDisabled) {
            return;
        }

        const filename = `${soundName}.pcm`;

        this.audioPlayer.writeStream(
            this.soundData,
            Utility.getDataFileOffset(filename, this.soundData),
            Utility.getDataFileLength(filename, this.soundData)
        );
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

        for (let i = steps; i >= 0 && i > steps - 25; i--) {
            this.packetStream.putByte(this.walkPathX[i] - startX);
            this.packetStream.putByte(this.walkPathY[i] - startY);
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

        for (let i = steps; i >= 0 && i > steps - 25; i--) {
            this.packetStream.putByte(this.walkPathX[i] - startX);
            this.packetStream.putByte(this.walkPathY[i] - startY);
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

            const inventoryID = this.inventoryItemId[invIdx];
            let hasItemInInventory = false;

            for (let i = 0; i < this.bankItemCount; i++) {
                if (this.bankItems[i] === inventoryID) {
                    hasItemInInventory = true;
                    break;
                }
            }

            if (!hasItemInInventory) {
                this.bankItems[this.bankItemCount] = inventoryID;
                this.bankItemsCount[this.bankItemCount] = 0;
                this.bankItemCount++;
            }
        }
    }

    drawAboveHeadStuff() {
        for (let i = 0; i < this.receivedMessagesCount; i++) {
            const textHeight = this.surface.textHeight(1);
            const x = this.receivedMessageX[i];
            let y = this.receivedMessageY[i];
            const messageMid = this.receivedMessageMidPoint[i];
            const messageHeight = this.receivedMessageHeight[i];
            let flag = true;

            while (flag) {
                flag = false;

                for (let j = 0; j < i; j++) {
                    if (y + messageHeight > this.receivedMessageY[j] - textHeight && y - textHeight < this.receivedMessageY[j] + this.receivedMessageHeight[j] && x - messageMid < this.receivedMessageX[j] + this.receivedMessageMidPoint[j] && x + messageMid > this.receivedMessageX[j] - this.receivedMessageMidPoint[j] && this.receivedMessageY[j] - textHeight - messageHeight < y) {
                        y = this.receivedMessageY[j] - textHeight - messageHeight;
                        flag = true;
                    }
                }
            }

            this.receivedMessageY[i] = y;
            this.surface.drawParagraph(this.receivedMessages[i], x, y, 1, 0xffff00, 300);
        }

        for (let i = 0; i < this.itemsAboveHeadCount; i++) {
            const x = this.actionBubbleX[i];
            const y = this.actionBubbleY[i];
            const scale = this.actionBubbleScale[i];
            const id = this.actionBubbleItem[i];
            const scaleX = ((39 * scale) / 100) | 0;
            const scaleY = ((27 * scale) / 100) | 0;

            this.surface.drawActionBubble(x - ((scaleX / 2) | 0), y - scaleY, scaleX, scaleY, this.spriteMedia + 9, 85);

            const scaleXClip = ((36 * scale) / 100) | 0;
            const scaleYClip = ((24 * scale) / 100) | 0;

            this.surface._spriteClipping_from9(x - ((scaleXClip / 2) | 0), (y - scaleY + ((scaleY / 2) | 0)) - ((scaleYClip / 2) | 0), scaleXClip, scaleYClip, GameData.itemPicture[id] + this.spriteItem, GameData.itemMask[id], 0, 0, false);
        }

        for (let i = 0; i < this.healthBarCount; i++) {
            const x = this.healthBarX[i];
            const y = this.healthBarY[i];
            const missing = this.healthBarMissing[i];

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

        if (!this.options.mobile) {
            this.panelMessageTabs.setFocus(this.controlTextListAll);
        }
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

    drawUI() {
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
        } else if (this.showChangePasswordStep !== 0) {
            this.drawDialogChangePassword();
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

            if (this.options.mobile) {
                this.setActiveMobileUITab();
            } else {
                this.setActiveUITab();
            }

            const noMenus = !this.showOptionMenu && !this.showRightClickMenu;

            if (noMenus) {
                this.menuItemsCount = 0;
            }

            if (this.showUITab === 0 && noMenus) {
                this.createRightClickMenu();
            }

            if (this.showUITab === 1) {
                this.drawUiTabInventory(noMenus);
            } else if (this.showUITab === 2) {
                this.drawUiTabMinimap(noMenus);
            } else if (this.showUITab === 3) {
                this.drawUiTabPlayerInfo(noMenus);
            } else if (this.showUITab === 4) {
                this.drawUiTabMagic(noMenus);
            } else if (this.showUITab === 5) {
                this.drawUiTabSocial(noMenus);
            } else if (this.showUITab === 6) {
                this.drawUiTabOptions(noMenus);
            }

            if (!this.showOptionMenu) {
                if (!this.showRightClickMenu) {
                    this.createTopMouseMenu();
                } else {
                    this.drawRightClickMenu();
                }
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

        for (let i = 0; i < PLAYERS_MAX; i++) {
            this.players[i] = null;
        }

        this.npcCount = 0;

        for (let i = 0; i < NPCS_SERVER_MAX; i++) {
            this.npcsServer[i] = null;
        }

        for (let i = 0; i < NPCS_MAX; i++) {
            this.npcs[i] = null;
        }

        for (let i = 0; i < this.prayerOn.length; i++) {
            this.prayerOn[i] = false;
        }

        this.mouseButtonClick = 0;
        this.lastMouseButtonDown = 0;
        this.mouseButtonDown = 0;
        this.showDialogShop = false;
        this.showDialogBank = false;
        this.isSleeping = false;
        this.friendListCount = 0;
    }

    handleKeyPress(keyCode) {
        if (this.loggedIn === 0) {
            if (this.loginScreen === 0 && this.panelLoginWelcome) {
                this.panelLoginWelcome.keyPress(keyCode);
            }

            if (this.loginScreen === 1 && this.panelLoginNewUser) {
                this.panelLoginNewUser.keyPress(keyCode);
            }

            if (this.loginScreen === 2 && this.panelLoginExistingUser) {
                this.panelLoginExistingUser.keyPress(keyCode);
            }

            if (this.loginScreen === 3 && this.panelRecoverUser) {
                this.panelRecoverUser.keyPress(keyCode);
            }
        }

        if (this.loggedIn === 1) {
            if (this.showAppearanceChange && this.panelAppearance !== null) {
                this.panelAppearance.keyPress(keyCode);
                return;
            }

            if (
                this.showChangePasswordStep === 0 &&
                this.showDialogSocialInput === 0 &&
                this.showDialogReportAbuseStep === 0 &&
                !this.isSleeping &&
                this.panelMessageTabs !== null
            ) {
                // for scrolling through messages the player previously sent
                if (this.options.messageScrollBack) {
                    if (
                        this.ctrl &&
                        [keycodes.UP_ARROW, keycodes.DOWN_ARROW].includes(keyCode)
                    ) {
                        if (keyCode === keycodes.UP_ARROW) {
                            if (this.playerMsgPtr >= this.playerMsgHistory.length) {
                                return;
                            }

                            this.playerMsgPtr += 1;
                        } else if (keyCode === keycodes.DOWN_ARROW) {
                            if (this.playerMsgPtr <= 1) {
                                this.panelMessageTabs.controlText[1] = "";
                                this.playerMsgPtr = 0;
                                return;
                            }

                            this.playerMsgPtr -= 1;
                        }

                        const newPlayerMsg = this.playerMsgHistory[
                            this.playerMsgHistory.length - this.playerMsgPtr
                        ];

                        if (newPlayerMsg) {
                            this.panelMessageTabs.controlText[1] = newPlayerMsg;
                        }

                        return;
                    }

                    if (keyCode === keycodes.ENTER) {
                        const chatMessage = this.panelMessageTabs.controlText[1];

                        if (chatMessage) {
                            const lastChatMessage = this.playerMsgHistory[
                                this.playerMsgHistory.length - 1
                            ];

                            if (chatMessage !== lastChatMessage) {
                                this.playerMsgHistory.push(chatMessage);
                            }

                            this.playerMsgPtr = 0;
                        }
                    }
                }

                this.panelMessageTabs.keyPress(keyCode);
            }

            if (
                this.showChangePasswordStep === 3 ||
                this.showChangePasswordStep === 4
            ) {
                this.showChangePasswordStep = 0;
            }
        }
    }

    sendLogout() {
        if (this.loggedIn === 0) {
            return;
        }

        if (this.combatTimeout > 450) {
            this.showMessage(
                "@cya@You can't logout during combat!",
                3
            );

            return;
        }

        if (this.combatTimeout > 0) {
            this.showMessage(
                "@cya@You can't logout for 10 seconds after combat",
                3
            );

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

        const player = this.playerServer[serverIndex];
        let flag = false;

        for (let i = 0; i < this.knownPlayerCount; i++) {
            if (this.knownPlayers[i].serverIndex !== serverIndex) {
                continue;
            }

            flag = true;
            break;
        }

        if (flag) {
            player.animationNext = anim;
            let j1 = player.waypointCurrent;

            if (x !== player.waypointsX[j1] || y !== player.waypointsY[j1]) {
                player.waypointCurrent = j1 = (j1 + 1) % 10;
                player.waypointsX[j1] = x;
                player.waypointsY[j1] = y;
            }
        } else {
            player.serverIndex = serverIndex;
            player.movingStep = 0;
            player.waypointCurrent = 0;
            player.waypointsX[0] = player.currentX = x;
            player.waypointsY[0] = player.currentY = y;
            player.animationNext = player.animationCurrent = anim;
            player.stepCount = 0;
        }

        this.players[this.playerCount++] = player;

        return player;
    }

    drawAppearancePanelCharacterSprites() {
        this.surface.interlace = false;
        this.surface.blackScreen();
        this.panelAppearance.drawPanel();
        let x = 140;
        let y = 50;
        x += 116;
        y -= 25;
        this.surface._spriteClipping_from6(x - 32 - 55, y, 64, 102, GameData.animationNumber[this.appearance2Colour], this.characterTopBottomColours[this.appearanceBottomColour]);
        this.surface._spriteClipping_from9(x - 32 - 55, y, 64, 102, GameData.animationNumber[this.appearanceBodyGender], this.characterTopBottomColours[this.appearanceTopColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from9(x - 32 - 55, y, 64, 102, GameData.animationNumber[this.appearanceHeadType], this.characterHairColours[this.appearanceHairColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from6(x - 32, y, 64, 102, GameData.animationNumber[this.appearance2Colour] + 6, this.characterTopBottomColours[this.appearanceBottomColour]);
        this.surface._spriteClipping_from9(x - 32, y, 64, 102, GameData.animationNumber[this.appearanceBodyGender] + 6, this.characterTopBottomColours[this.appearanceTopColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from9(x - 32, y, 64, 102, GameData.animationNumber[this.appearanceHeadType] + 6, this.characterHairColours[this.appearanceHairColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from6((x - 32) + 55, y, 64, 102, GameData.animationNumber[this.appearance2Colour] + 12, this.characterTopBottomColours[this.appearanceBottomColour]);
        this.surface._spriteClipping_from9((x - 32) + 55, y, 64, 102, GameData.animationNumber[this.appearanceBodyGender] + 12, this.characterTopBottomColours[this.appearanceTopColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._spriteClipping_from9((x - 32) + 55, y, 64, 102, GameData.animationNumber[this.appearanceHeadType] + 12, this.characterHairColours[this.appearanceHairColour], this.characterSkinColours[this.appearanceSkinColour], 0, false);
        this.surface._drawSprite_from3(0, this.gameHeight, this.spriteMedia + 22);
        this.surface.draw(this.graphics, 0, 0);
    }

    drawItem(x, y, w, h, id) {
        const picture = GameData.itemPicture[id] + this.spriteItem;
        const mask = GameData.itemMask[id];
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
            this.handleAppearancePanelInput();
            return;
        }

        for (let i = 0; i < this.playerCount; i++) {
            const player = this.players[i];

            // TODO figure out why this is happening
            if (!player) {
                console.log('null character at ', i, this.playerCount);
                return;
            }

            let k = (player.waypointCurrent + 1) % 10;

            if (player.movingStep !== k) {
                let i1 = -1;
                let l2 = player.movingStep;
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

                if (player.waypointsX[l2] - player.currentX > this.magicLoc * 3 || player.waypointsY[l2] - player.currentY > this.magicLoc * 3 || player.waypointsX[l2] - player.currentX < -this.magicLoc * 3 || player.waypointsY[l2] - player.currentY < -this.magicLoc * 3 || j4 > 8) {
                    player.currentX = player.waypointsX[l2];
                    player.currentY = player.waypointsY[l2];
                } else {
                    if (player.currentX < player.waypointsX[l2]) {
                        player.currentX += j5;
                        player.stepCount++;
                        i1 = 2;
                    } else if (player.currentX > player.waypointsX[l2]) {
                        player.currentX -= j5;
                        player.stepCount++;
                        i1 = 6;
                    }

                    if (player.currentX - player.waypointsX[l2] < j5 && player.currentX - player.waypointsX[l2] > -j5) {
                        player.currentX = player.waypointsX[l2];
                    }

                    if (player.currentY < player.waypointsY[l2]) {
                        player.currentY += j5;
                        player.stepCount++;

                        if (i1 === -1) {
                            i1 = 4;
                        } else if (i1 === 2) {
                            i1 = 3;
                        } else {
                            i1 = 5;
                        }
                    } else if (player.currentY > player.waypointsY[l2]) {
                        player.currentY -= j5;
                        player.stepCount++;

                        if (i1 === -1) {
                            i1 = 0;
                        } else if (i1 === 2) {
                            i1 = 1;
                        } else {
                            i1 = 7;
                        }
                    }

                    if (player.currentY - player.waypointsY[l2] < j5 && player.currentY - player.waypointsY[l2] > -j5) {
                        player.currentY = player.waypointsY[l2];
                    }
                }

                if (i1 !== -1) {
                    player.animationCurrent = i1;
                }

                if (player.currentX === player.waypointsX[l2] && player.currentY === player.waypointsY[l2]) {
                    player.movingStep = (l2 + 1) % 10;
                }
            } else {
                player.animationCurrent = player.animationNext;
            }

            if (player.messageTimeout > 0) {
                player.messageTimeout--;
            }

            if (player.bubbleTimeout > 0) {
                player.bubbleTimeout--;
            }

            if (player.combatTimer > 0) {
                player.combatTimer--;
            }

            if (this.deathScreenTimeout > 0) {
                this.deathScreenTimeout--;

                if (this.deathScreenTimeout === 0) {
                    this.showMessage('You have been granted another life. Be more careful this time!', 3);
                    this.showMessage('You retain your skills. Your objects land where you died', 3);
                }
            }
        }

        for (let i = 0; i < this.npcCount; i++) {
            const npc = this.npcs[i];
            let j1 = (npc.waypointCurrent + 1) % 10;

            if (npc.movingStep !== j1) {
                let i3 = -1;
                let k4 = npc.movingStep;
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

                if (npc.waypointsX[k4] - npc.currentX > this.magicLoc * 3 || npc.waypointsY[k4] - npc.currentY > this.magicLoc * 3 || npc.waypointsX[k4] - npc.currentX < -this.magicLoc * 3 || npc.waypointsY[k4] - npc.currentY < -this.magicLoc * 3 || k5 > 8) {
                    npc.currentX = npc.waypointsX[k4];
                    npc.currentY = npc.waypointsY[k4];
                } else {
                    if (npc.currentX < npc.waypointsX[k4]) {
                        npc.currentX += l5;
                        npc.stepCount++;
                        i3 = 2;
                    } else if (npc.currentX > npc.waypointsX[k4]) {
                        npc.currentX -= l5;
                        npc.stepCount++;
                        i3 = 6;
                    }

                    if (npc.currentX - npc.waypointsX[k4] < l5 && npc.currentX - npc.waypointsX[k4] > -l5) {
                        npc.currentX = npc.waypointsX[k4];
                    }

                    if (npc.currentY < npc.waypointsY[k4]) {
                        npc.currentY += l5;
                        npc.stepCount++;

                        if (i3 === -1) {
                            i3 = 4;
                        } else if (i3 === 2) {
                            i3 = 3;
                        } else {
                            i3 = 5;
                        }
                    } else if (npc.currentY > npc.waypointsY[k4]) {
                        npc.currentY -= l5;
                        npc.stepCount++;

                        if (i3 === -1) {
                            i3 = 0;
                        } else if (i3 === 2) {
                            i3 = 1;
                        } else {
                            i3 = 7;
                        }
                    }

                    if (npc.currentY - npc.waypointsY[k4] < l5 && npc.currentY - npc.waypointsY[k4] > -l5) {
                        npc.currentY = npc.waypointsY[k4];
                    }
                }

                if (i3 !== -1) {
                    npc.animationCurrent = i3;
                }

                if (npc.currentX === npc.waypointsX[k4] && npc.currentY === npc.waypointsY[k4]) {
                    npc.movingStep = (k4 + 1) % 10;
                }
            } else {
                npc.animationCurrent = npc.animationNext;

                if (npc.npcId === 43) {
                    npc.stepCount++;
                }
            }

            if (npc.messageTimeout > 0) {
                npc.messageTimeout--;
            }

            if (npc.bubbleTimeout > 0) {
                npc.bubbleTimeout--;
            }

            if (npc.combatTimer > 0) {
                npc.combatTimer--;
            }
        }

        if (this.showUITab !== 2) {
            if (Surface.anInt346 > 0) {
                this.sleepWordDelayTimer++;
            }

            if (Surface.anInt347 > 0) {
                this.sleepWordDelayTimer = 0;
            }

            Surface.anInt346 = 0;
            Surface.anInt347 = 0;
        }

        for (let i = 0; i < this.playerCount; i++) {
            const player = this.players[i];

            if (player.projectileRange > 0) {
                player.projectileRange--;
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
            this.handleSleepInput();
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
            let message = this.panelMessageTabs.getText(this.controlTextListAll);
            this.panelMessageTabs.updateText(this.controlTextListAll, '');

            if (/^::/.test(message)) {
                if (/^::closecon$/i.test(message)) {
                    this.packetStream.closeStream();
                } else if (/^::logout/i.test(message)) {
                    this.closeConnection();
                } else if (/^::lostcon$/i.test(message)) {
                    await this.lostConnection();
                } else {
                    this.sendCommandString(message.substring(2));
                }
            } else {
                const encodedMessage = ChatMessage.scramble(message);
                this.sendChatMessage(ChatMessage.scrambledBytes, encodedMessage);
                message = ChatMessage.descramble(ChatMessage.scrambledBytes, 0, encodedMessage);

                if (this.options.wordFilter) {
                    message = WordFilter.filter(message);
                }

                this.localPlayer.messageTimeout = 150;
                this.localPlayer.message = message;
                this.showMessage(`${this.localPlayer.name}: ${message}`, 2);
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

        this.scene.doSOemthingWithTheFuckinFountainFuck(17);
        this.objectAnimationCount++;

        if (this.objectAnimationCount > 5) {
            this.objectAnimationCount = 0;
            this.objectAnimationNumberFireLightningSpell = (this.objectAnimationNumberFireLightningSpell + 1) % 3;
            this.objectAnimationNumberTorch = (this.objectAnimationNumberTorch + 1) % 4;
            this.objectAnimationNumberClaw = (this.objectAnimationNumberClaw + 1) % 5;
        }

        for (let i = 0; i < this.objectCount; i++) {
            const x = this.objectX[i];
            const y = this.objectY[i];

            if (x >= 0 && y >= 0 && x < 96 && y < 96 && this.objectId[i] === 74) {
                this.objectModel[i].rotate(1, 0, 0);
            }
        }

        for (let i = 0; i < this.teleportBubbleCount; i++) {
            this.teleportBubbleTime[i]++;

            if (this.teleportBubbleTime[i] > 50) {
                this.teleportBubbleCount--;

                for (let j = i; j < this.teleportBubbleCount; j++) {
                    this.teleportBubbleX[j] = this.teleportBubbleX[j + 1];
                    this.teleportBubbleY[j] = this.teleportBubbleY[j + 1];
                    this.teleportBubbleTime[j] = this.teleportBubbleTime[j + 1];
                    this.teleportBubbleType[j] = this.teleportBubbleType[j + 1];
                }
            }
        }
    }

    handleCameraZoom() {
        if (this.keyUp && !this.ctrl) {
            this.cameraZoom -= 16;
        } else if (this.keyDown && !this.ctrl) {
            this.cameraZoom += 16;
        } else if (this.keyHome) {
            this.cameraZoom = ZOOM_OUTDOORS;
        } else if (this.keyPgUp) {
            this.cameraZoom = ZOOM_MIN;
        } else if (this.keyPgDown) {
            this.cameraZoom = ZOOM_MAX;
        }

        if (this.mouseScrollDelta !== 0 && (this.showUITab === 2 || this.showUITab === 0)) {
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
                const entryX = this.menuX + 2;
                const entryY = this.menuY + 27 + i * 15;

                if (
                    this.mouseX <= entryX - 2 ||
                    this.mouseY <= entryY - 12 ||
                    this.mouseY >= entryY + 4 ||
                    this.mouseX >= (entryX - 3) + this.menuWidth
                ) {
                    continue;
                }

                this.menuItemClick(this.menuIndices[i]);
                break;
            }

            this.mouseButtonClick = 0;
            this.showRightClickMenu = false;
            return;
        }

        if (
            this.mouseX < this.menuX - 10 ||
            this.mouseY < this.menuY - 10 ||
            this.mouseX > this.menuX + this.menuWidth + 10 ||
            this.mouseY > this.menuY + this.menuHeight + 10
        ) {
            this.showRightClickMenu = false;
            return;
        }

        this.surface.drawBoxAlpha(
            this.menuX,
            this.menuY,
            this.menuWidth,
            this.menuHeight,
            0xd0d0d0,
            160
        );

        this.surface.drawString(
            'Choose option',
            this.menuX + 2,
            this.menuY + 12,
            1,
            0x00ffff
        );

        for (let i = 0; i < this.menuItemsCount; i++) {
            const entryX = this.menuX + 2;
            const entryY = this.menuY + 27 + i * 15;
            let textColour = 0xffffff;

            if (
                this.mouseX > entryX - 2 &&
                this.mouseY > entryY - 12 &&
                this.mouseY < entryY + 4 &&
                this.mouseX < (entryX - 3) + this.menuWidth
            ) {
                textColour = 0xffff00;
            }

            this.surface.drawString(
                this.menuItemText1[this.menuIndices[i]] + ' ' +
                    this.menuItemText2[this.menuIndices[i]],
                entryX,
                entryY,
                1,
                textColour
            );
        }
    }

    drawNpc(x, y, w, h, id, tx, ty) {
        const npc = this.npcs[id];
        let l1 = npc.animationCurrent + (this.cameraRotation + 16) / 32 & 7;
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

        let j2 = i2 * 3 + this.npcWalkModel[((npc.stepCount / GameData.npcWalkModel[npc.npcId]) | 0) % 4];

        if (npc.animationCurrent === 8) {
            i2 = 5;
            l1 = 2;
            flag = false;
            x -= ((GameData.npcCombatAnimation[npc.npcId] * ty) / 100) | 0;
            j2 = i2 * 3 + this.npcCombatModelArray1[(((this.loginTimer / (GameData.npcCombatModel[npc.npcId]) | 0) - 1)) % 8];
        } else if (npc.animationCurrent === 9) {
            i2 = 5;
            l1 = 2;
            flag = true;
            x += ((GameData.npcCombatAnimation[npc.npcId] * ty) / 100) | 0;
            j2 = i2 * 3 + this.npcCombatModelArray2[((this.loginTimer / GameData.npcCombatModel[npc.npcId]) | 0) % 8];
        }

        for (let k2 = 0; k2 < 12; k2++) {
            let l2 = this.npcAnimationArray[l1][k2];
            let k3 = GameData.npcSprite.get(npc.npcId, l2);

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
                        col = GameData.npcColourHair[npc.npcId];
                        skincol = GameData.npcColourSkin[npc.npcId];
                    } else if (col === 2) {
                        col = GameData.npcColourTop[npc.npcId];
                        skincol = GameData.npcColourSkin[npc.npcId];
                    } else if (col === 3) {
                        col = GameData.npcColorBottom[npc.npcId];
                        skincol = GameData.npcColourSkin[npc.npcId];
                    }

                    this.surface._spriteClipping_from9(x + i4, y + j4, i5, h, l4, col, skincol, tx, flag);
                }
            }
        }

        if (npc.messageTimeout > 0) {
            this.receivedMessageMidPoint[this.receivedMessagesCount] = (this.surface.textWidth(npc.message, 1) / 2) | 0;

            if (this.receivedMessageMidPoint[this.receivedMessagesCount] > 150) {
                this.receivedMessageMidPoint[this.receivedMessagesCount] = 150;
            }

            this.receivedMessageHeight[this.receivedMessagesCount] = ((this.surface.textWidth(npc.message, 1) / 300) | 0) * this.surface.textHeight(1);
            this.receivedMessageX[this.receivedMessagesCount] = x + ((w / 2) | 0);
            this.receivedMessageY[this.receivedMessagesCount] = y;
            this.receivedMessages[this.receivedMessagesCount++] = npc.message;
        }

        if (npc.animationCurrent === 8 || npc.animationCurrent === 9 || npc.combatTimer !== 0) {
            if (npc.combatTimer > 0) {
                let i3 = x;

                if (npc.animationCurrent === 8) {
                    i3 -= ((20 * ty) / 100) | 0;
                } else if (npc.animationCurrent === 9) {
                    i3 += ((20 * ty) / 100) | 0;
                }

                let l3 = ((npc.healthCurrent * 30) / npc.healthMax) | 0;

                this.healthBarX[this.healthBarCount] = i3 + ((w / 2) | 0);
                this.healthBarY[this.healthBarCount] = y;
                this.healthBarMissing[this.healthBarCount++] = l3;
            }

            if (npc.combatTimer > 150) {
                let j3 = x;

                if (npc.animationCurrent === 8) {
                    j3 -= ((10 * ty) / 100) | 0;
                } else if (npc.animationCurrent === 9) {
                    j3 += ((10 * ty) / 100) | 0;
                }

                this.surface._drawSprite_from3((j3 + ((w / 2) | 0)) - 12, (y + ((h / 2) | 0)) - 12, this.spriteMedia + 12);
                this.surface.drawStringCenter(npc.damageTaken.toString(), (j3 + ((w / 2) | 0)) - 1, y + ((h / 2) | 0) + 5, 3, 0xffffff);
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
        const configJag = await this.readDataFile(
            `config${version.CONFIG}.jag`,
            'Configuration',
            10
        );

        if (!configJag) {
            this.errorLoadingData = true;
            return;
        }

        GameData.loadData(configJag, this.members);

        const filterJag = await this.readDataFile(
            `filter${version.FILTER}.jag`,
            'Chat system',
            15
        );

        if (!filterJag) {
            this.errorLoadingData = true;
            return;
        }

        const fragments = new GameBuffer(
            Utility.loadData('fragmentsenc.txt', 0, filterJag)
        );

        const badWords = new GameBuffer(
            Utility.loadData('badenc.txt', 0, filterJag)
        );

        const hosts = new GameBuffer(
            Utility.loadData('hostenc.txt', 0, filterJag)
        );

        const tlds = new GameBuffer(
            Utility.loadData('tldlist.txt', 0, filterJag)
        );

        WordFilter.loadFilters(fragments, badWords, hosts, tlds);
    }

    addNpc(serverIndex, x, y, sprite, type) {
        if (this.npcsServer[serverIndex] === null) {
            this.npcsServer[serverIndex] = new GameCharacter();
            this.npcsServer[serverIndex].serverIndex = serverIndex;
        }

        const npc = this.npcsServer[serverIndex];
        let foundNPC = false;

        for (let i = 0; i < this.npcCacheCount; i++) {
            if (this.npcsCache[i].serverIndex !== serverIndex) {
                continue;
            }

            foundNPC = true;
            break;
        }

        if (foundNPC) {
            npc.npcId = type;
            npc.animationNext = sprite;
            let waypointIdx = npc.waypointCurrent;

            if (x !== npc.waypointsX[waypointIdx] || y !== npc.waypointsY[waypointIdx]) {
                npc.waypointCurrent = waypointIdx = (waypointIdx + 1) % 10;
                npc.waypointsX[waypointIdx] = x;
                npc.waypointsY[waypointIdx] = y;
            }
        } else {
            npc.serverIndex = serverIndex;
            npc.movingStep = 0;
            npc.waypointCurrent = 0;
            npc.waypointsX[0] = npc.currentX = x;
            npc.waypointsY[0] = npc.currentY = y;
            npc.npcId = type;
            npc.animationNext = npc.animationCurrent = sprite;
            npc.stepCount = 0;
        }

        this.npcs[this.npcCount++] = npc;
        return npc;
    }

    resetLoginVars() {
        this.systemUpdate = 0;
        this.loginScreen = 0;
        this.loggedIn = 0;
        this.logoutTimeout = 0;
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
        const player = this.players[id];

        // this means the character is invisible! MOD!!!
        if (player.colourBottom === 255)  {
            return;
        }

        let l1 = player.animationCurrent + (this.cameraRotation + 16) / 32 & 7;
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

        let j2 = i2 * 3 + this.npcWalkModel[((player.stepCount / 6) | 0) % 4];

        if (player.animationCurrent === 8) {
            i2 = 5;
            l1 = 2;
            flag = false;
            x -= ((5 * ty) / 100) | 0;
            j2 = i2 * 3 + this.npcCombatModelArray1[((this.loginTimer / 5) | 0) % 8];
        } else if (player.animationCurrent === 9) {
            i2 = 5;
            l1 = 2;
            flag = true;
            x += ((5 * ty) / 100) | 0;
            j2 = i2 * 3 + this.npcCombatModelArray2[((this.loginTimer / 6) | 0) % 8];
        }

        for (let k2 = 0; k2 < 12; k2++) {
            let l2 = this.npcAnimationArray[l1][k2];
            let l3 = player.equippedItem[l2] - 1;

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
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((player.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 4 && i2 === 2) {
                        k4 = 0;
                        i5 = -8;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((player.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 4 && i2 === 3) {
                        k4 = 26;
                        i5 = -5;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((player.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 3 && i2 === 1) {
                        k4 = 22;
                        i5 = 3;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((player.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 3 && i2 === 2) {
                        k4 = 0;
                        i5 = 8;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((player.stepCount / 6) | 0)) % 4];
                    } else if (l2 === 3 && i2 === 3) {
                        k4 = -26;
                        i5 = 5;
                        j5 = i2 * 3 + this.npcWalkModel[(2 + ((player.stepCount / 6) | 0)) % 4];
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
                        this.characterSkinColours[player.colourSkin];

                    if (i6 === 1) {
                        i6 = this.characterHairColours[player.colourHair];
                    } else if (i6 === 2) {
                        i6 = this.characterTopBottomColours[player.colourTop];
                    } else if (i6 === 3) {
                        i6 = this.characterTopBottomColours[player.colourBottom];
                    }

                    this.surface._spriteClipping_from9(x + k4, y + i5, l5, h, k5, i6, skinColour, tx, flag);
                }
            }
        }

        if (player.messageTimeout > 0) {
            this.receivedMessageMidPoint[this.receivedMessagesCount] = (this.surface.textWidth(player.message, 1) / 2) | 0;

            if (this.receivedMessageMidPoint[this.receivedMessagesCount] > 150) {
                this.receivedMessageMidPoint[this.receivedMessagesCount] = 150;
            }

            this.receivedMessageHeight[this.receivedMessagesCount] = ((this.surface.textWidth(player.message, 1) / 300) | 0) * this.surface.textHeight(1);
            this.receivedMessageX[this.receivedMessagesCount] = x + ((w / 2) | 0);
            this.receivedMessageY[this.receivedMessagesCount] = y;
            this.receivedMessages[this.receivedMessagesCount++] = player.message;
        }

        if (player.bubbleTimeout > 0) {
            this.actionBubbleX[this.itemsAboveHeadCount] = x + ((w / 2) | 0);
            this.actionBubbleY[this.itemsAboveHeadCount] = y;
            this.actionBubbleScale[this.itemsAboveHeadCount] = ty;
            this.actionBubbleItem[this.itemsAboveHeadCount++] = player.bubbleItem;
        }

        if (player.animationCurrent === 8 || player.animationCurrent === 9 || player.combatTimer !== 0) {
            if (player.combatTimer > 0) {
                let i3 = x;

                if (player.animationCurrent === 8) {
                    i3 -= ((20 * ty) / 100) | 0;
                } else if (player.animationCurrent === 9) {
                    i3 += ((20 * ty) / 100) | 0;
                }

                let i4 = ((player.healthCurrent * 30) / player.healthMax) | 0;

                this.healthBarX[this.healthBarCount] = i3 + ((w / 2) | 0);
                this.healthBarY[this.healthBarCount] = y;
                this.healthBarMissing[this.healthBarCount++] = i4;
            }

            if (player.combatTimer > 150) {
                let j3 = x;

                if (player.animationCurrent === 8) {
                    j3 -= ((10 * ty) / 100) | 0;
                } else if (player.animationCurrent === 9) {
                    j3 += ((10 * ty) / 100) | 0;
                }

                this.surface._drawSprite_from3((j3 + ((w / 2) | 0)) - 12, (y + ((h / 2) | 0)) - 12, this.spriteMedia + 11);
                this.surface.drawStringCenter(player.damageTaken.toString(), (j3 + ((w / 2) | 0)) - 1, y + ((h / 2) | 0) + 5, 3, 0xffffff);
            }
        }

        if (player.skullVisible === 1 && player.bubbleTimeout === 0) {
            let k3 = tx + x + ((w / 2) | 0);

            if (player.animationCurrent === 8) {
                k3 -= ((20 * ty) / 100) | 0;
            } else if (player.animationCurrent === 9) {
                k3 += ((20 * ty) / 100) | 0;
            }

            let j4 = ((16 * ty) / 100) | 0;
            let l4 = ((16 * ty) / 100) | 0;

            this.surface._spriteClipping_from5(k3 - ((j4 / 2) | 0), y - ((l4 / 2) | 0) - (((10 * ty) / 100) | 0), j4, l4, this.spriteMedia + 13);
        }
    }

    async loadMedia() {
        const mediaJag = await this.readDataFile(
            `media${version.MEDIA}.jag`,
            '2d graphics',
            20
        );

        if (mediaJag === null) {
            this.errorLoadingData = true;
            return;
        }

        const indexDat = Utility.loadData('index.dat', 0, mediaJag);

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

        let spriteCount = GameData.itemSpriteCount;

        for (let i = 1; spriteCount > 0; i++) {
            let currentSpriteCount = spriteCount;
            spriteCount -= 30;

            if (currentSpriteCount > 30) {
                currentSpriteCount = 30;
            }

            this.surface.parseSprite(
                this.spriteItem + (i - 1) * 30,
                Utility.loadData(`objects${i}.dat`, 0, mediaJag),
                indexDat,
                currentSpriteCount
            );
        }

        this.surface.loadSprite(this.spriteMedia);
        this.surface.loadSprite(this.spriteMedia + 9);

        for (let i = 11; i <= 26; i++) {
            this.surface.loadSprite(this.spriteMedia + i);
        }

        for (let i = 0; i < GameData.projectileSprite; i++) {
            this.surface.loadSprite(this.spriteProjectile + i);
        }

        for (let i = 0; i < GameData.itemSpriteCount; i++) {
            this.surface.loadSprite(this.spriteItem + i);
        }
    }

    drawChatMessageTabs() {
        this.surface._drawSprite_from3(0, this.gameHeight - 4, this.spriteMedia + 23);

        let colour = Surface.rgbToInt(200, 200, 255);

        if (this.messageTabSelected === 0) {
            colour = Surface.rgbToInt(255, 200, 50);
        }

        if (this.messageTabFlashAll % 30 > 15) {
            colour = Surface.rgbToInt(255, 50, 50);
        }

        this.surface.drawStringCenter('All messages', 54, this.gameHeight + 6, 0, colour);
        colour = Surface.rgbToInt(200, 200, 255);

        if (this.messageTabSelected === 1) {
            colour = Surface.rgbToInt(255, 200, 50);
        }

        if (this.messageTabFlashHistory % 30 > 15) {
            colour = Surface.rgbToInt(255, 50, 50);
        }

        this.surface.drawStringCenter('Chat history', 155, this.gameHeight + 6, 0, colour);
        colour = Surface.rgbToInt(200, 200, 255);

        if (this.messageTabSelected === 2) {
            colour = Surface.rgbToInt(255, 200, 50);
        }

        if (this.messageTabFlashQuest % 30 > 15) {
            colour = Surface.rgbToInt(255, 50, 50);
        }

        this.surface.drawStringCenter('Quest history', 255, this.gameHeight + 6, 0, colour);
        colour = Surface.rgbToInt(200, 200, 255);

        if (this.messageTabSelected === 3) {
            colour = Surface.rgbToInt(255, 200, 50);
        }

        if (this.messageTabFlashPrivate % 30 > 15) {
            colour = Surface.rgbToInt(255, 50, 50);
        }

        this.surface.drawStringCenter('Private history', 355, this.gameHeight + 6, 0, colour);
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

        this.surface = new Surface(
            this.gameWidth,
            this.gameHeight + 12,
            4000,
            this
        );

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

        if (this.options.mobile) {
            x -= 32;
            y = (this.gameHeight / 2 - 275 / 2) | 0;
        }

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
            this.drawSleep();
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

            for (let i = 0; i < this.objectCount; i++) {
                if (this.objectId[i] === 97) {
                    this.updateObjectAnimation(i, 'firea' + (this.objectAnimationNumberFireLightningSpell + 1));
                }

                if (this.objectId[i] === 274) {
                    this.updateObjectAnimation(i, 'fireplacea' + (this.objectAnimationNumberFireLightningSpell + 1));
                }

                if (this.objectId[i] === 1031) {
                    this.updateObjectAnimation(i, 'lightning' + (this.objectAnimationNumberFireLightningSpell + 1));
                }

                if (this.objectId[i] === 1036) {
                    this.updateObjectAnimation(i, 'firespell' + (this.objectAnimationNumberFireLightningSpell + 1));
                }

                if (this.objectId[i] === 1147) {
                    this.updateObjectAnimation(i, 'spellcharge' + (this.objectAnimationNumberFireLightningSpell + 1));
                }
            }
        }

        if (this.objectAnimationNumberTorch !== this.lastObjectAnimationNumberTorch) {
            this.lastObjectAnimationNumberTorch = this.objectAnimationNumberTorch;

            for (let i = 0; i < this.objectCount; i++) {
                if (this.objectId[i] === 51) {
                    this.updateObjectAnimation(i, 'torcha' + (this.objectAnimationNumberTorch + 1));
                }

                if (this.objectId[i] === 143) {
                    this.updateObjectAnimation(i, 'skulltorcha' + (this.objectAnimationNumberTorch + 1));
                }
            }
        }

        if (this.objectAnimationNumberClaw !== this.lastObjectAnimationNumberClaw) {
            this.lastObjectAnimationNumberClaw = this.objectAnimationNumberClaw;

            for (let i = 0; i < this.objectCount; i++) {
                if (this.objectId[i] === 1142) {
                    this.updateObjectAnimation(i, 'clawspell' + (this.objectAnimationNumberClaw + 1));
                }
            }

        }

        this.scene.reduceSprites(this.spriteCount);
        this.spriteCount = 0;

        for (let i = 0; i < this.playerCount; i++) {
            const player = this.players[i];

            if (player.colourBottom !== 255) {
                const x = player.currentX;
                const y = player.currentY;
                const elevation = -this.world.getElevation(x, y);
                const id = this.scene.addSprite(5000 + i, x, elevation, y, 145, 220, i + 10000);

                this.spriteCount++;

                if (player === this.localPlayer) {
                    this.scene.setLocalPlayer(id);
                }

                if (player.animationCurrent === 8) {
                    this.scene.setSpriteTranslateX(id, -30);
                }

                if (player.animationCurrent === 9) {
                    this.scene.setSpriteTranslateX(id, 30);
                }
            }
        }

        for (let i = 0; i < this.playerCount; i++) {
            const player = this.players[i];

            if (player.projectileRange > 0) {
                let character = null;

                if (player.attackingNpcServerIndex !== -1) {
                    character = this.npcsServer[player.attackingNpcServerIndex];
                } else if (player.attackingPlayerServerIndex !== -1) {
                    character = this.playerServer[player.attackingPlayerServerIndex];
                }

                if (character !== null) {
                    const sx = player.currentX;
                    const sy = player.currentY;
                    const selev = -this.world.getElevation(sx, sy) - 110;
                    const dx = character.currentX;
                    const dy = character.currentY;
                    const delev = -((this.world.getElevation(dx, dy) - GameData.npcHeight[character.npcId] / 2) | 0);
                    const rx = ((sx * player.projectileRange + dx * (this.projectileMaxRange - player.projectileRange)) / this.projectileMaxRange) | 0;
                    const rz = ((selev * player.projectileRange + delev * (this.projectileMaxRange - player.projectileRange)) / this.projectileMaxRange) | 0;
                    const ry = ((sy * player.projectileRange + dy * (this.projectileMaxRange - player.projectileRange)) / this.projectileMaxRange) | 0;

                    this.scene.addSprite(this.spriteProjectile + player.incomingProjectileSprite, rx, rz, ry, 32, 32, 0);
                    this.spriteCount++;
                }
            }
        }

        for (let i = 0; i < this.npcCount; i++) {
            const npc = this.npcs[i];
            const i3 = npc.currentX;
            const j4 = npc.currentY;
            const i7 = -this.world.getElevation(i3, j4);
            const i9 = this.scene.addSprite(20000 + i, i3, i7, j4, GameData.npcWidth[npc.npcId], GameData.npcHeight[npc.npcId], i + 30000);

            this.spriteCount++;

            if (npc.animationCurrent === 8) {
                this.scene.setSpriteTranslateX(i9, -30);
            }

            if (npc.animationCurrent === 9) {
                this.scene.setSpriteTranslateX(i9, 30);
            }
        }

        for (let i = 0; i < this.groundItemCount; i++) {
            const x = this.groundItemX[i] * this.magicLoc + 64;
            const y = this.groundItemY[i] * this.magicLoc + 64;

            this.scene.addSprite(40000 + this.groundItemID[i], x, -this.world.getElevation(x, y) - this.groundItemZ[i], y, 96, 64, i + 20000);
            this.spriteCount++;
        }

        for (let i = 0; i < this.teleportBubbleCount; i++) {
            const x = this.teleportBubbleX[i] * this.magicLoc + 64;
            const y = this.teleportBubbleY[i] * this.magicLoc + 64;
            const type = this.teleportBubbleType[i];

            if (type === 0) {
                this.scene.addSprite(50000 + i, x, -this.world.getElevation(x, y), y, 128, 256, i + 50000);
                this.spriteCount++;
            }

            if (type === 1) {
                this.scene.addSprite(50000 + i, x, -this.world.getElevation(x, y), y, 128, 64, i + 50000);
                this.spriteCount++;
            }
        }

        this.surface.interlace = false;
        this.surface.blackScreen();
        this.surface.interlace = this.interlace;

        if (this.lastHeightOffset === 3) {
            const i5 = 40 + ((Math.random() * 3) | 0);
            const k7 = 40 + ((Math.random() * 7) | 0);

            this.scene._setLight_from5(i5, k7, -50, -10, -50);
        }

        this.itemsAboveHeadCount = 0;
        this.receivedMessagesCount = 0;
        this.healthBarCount = 0;

        if (this.cameraAutoAngleDebug) {
            if (this.optionCameraModeAuto && !this.fogOfWar) {
                const oldAngle = this.cameraAngle;

                this.autoRotateCamera();

                if (this.cameraAngle !== oldAngle) {
                    this.cameraAutoRotatePlayerX = this.localPlayer.currentX;
                    this.cameraAutoRotatePlayerY = this.localPlayer.currentY;
                }
            }

            this.scene.clipFar3d = 3000;
            this.scene.clipFar2d = 3000;
            this.scene.fogZFalloff = 1;
            this.scene.fogZDistance = 2800;
            this.cameraRotation = this.cameraAngle * 32;

            const x = this.cameraAutoRotatePlayerX + this.cameraRotationX;
            const y = this.cameraAutoRotatePlayerY + this.cameraRotationY;

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

        // retro fps counter
        if (this.options.retroFPSCounter) {
            // how much the wilderness skull needs to move for the fps counter
            const offset = this.isInWild ? 70 : 0;

            this.surface.drawString(
                'Fps: ' + (this.fps | 0),
                this.gameWidth - 62 - offset,
                this.gameHeight - 10,
                1,
                0xffff00
            );
        }

        if (this.systemUpdate !== 0) {
            let seconds = ((this.systemUpdate / 50) | 0);
            const minutes = (seconds / 60) | 0;

            seconds %= 60;

            if (seconds < 10) {
                this.surface.drawStringCenter('System update in: ' + minutes + ':0' + seconds, 256, this.gameHeight - 7, 1, 0xffff00);
            } else {
                this.surface.drawStringCenter('System update in: ' + minutes + ':' + seconds, 256, this.gameHeight - 7, 1, 0xffff00);
            }
        }

        if (!this.loadingArea) {
            let j6 = 2203 - (this.localRegionY + this.planeHeight + this.regionY);

            if (this.localRegionX + this.planeWidth + this.regionX >= 2640) {
                j6 = -50;
            }

            this.isInWild = j6 > 0;

            if (this.isInWild) {
                let wildlvl = 1 + ((j6 / 6) | 0);

                // wilderness skull placement made independent of gameWidth
                this.surface._drawSprite_from3(this.gameWidth - 59, this.gameHeight - 56, this.spriteMedia + 13);
                this.surface.drawStringCenter('Wilderness', this.gameWidth - 47, this.gameHeight - 20, 1, 0xffff00);
                this.surface.drawStringCenter('Level: ' + wildlvl, this.gameWidth - 47, this.gameHeight - 7, 1, 0xffff00);

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

        if (!this.options.mobile) {
            this.surface._drawSpriteAlpha_from4(
                this.surface.width2 - 3 - 197, 3,
                this.spriteMedia,
                128
            );
        }

        this.drawUI();
        this.surface.loggedIn = false;
        this.drawChatMessageTabs();
        this.surface.draw(this.graphics, 0, 0);

        if (this.options.mobile) {
            this.drawMobileUI();
        }
    }

    async loadSounds() {
        try {
            this.soundData = await this.readDataFile(
                `sounds${version.SOUNDS}.mem`,
                'Sound effects',
                90
            );

            this.audioPlayer = new StreamAudioPlayer();
        } catch (e) {
            console.error(e);
        }
    }

    isItemEquipped(id) {
        for (let i = 0; i < this.inventoryItemsCount; i++) {
            if (
                this.inventoryItemId[i] === id &&
                this.inventoryEquipped[i] === 1
            ) {
                return true;
            }
        }

        return false;
    }

    async loadEntities() {
        const entityJag = await this.readDataFile(
            `entity${version.ENTITY}.jag`,
            'people and monsters',
            30
        );

        if (!entityJag) {
            this.errorLoadingData = true;
            return;
        }

        const indexDat = Utility.loadData('index.dat', 0, entityJag);

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

                if (GameData.animationGender[j] !== 0) {
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

    walkToGroundItem(startX, startY, k, l, walkToAction) {
        if (this.walkTo(startX, startY, k, l, k, l, false, walkToAction)) {
            return;
        } else {
            this._walkToActionSource_from8(startX, startY, k, l, k, l, true, walkToAction);
            return;
        }
    }

    async loadModels() {
        for (const modelName of ANIMATED_MODELS) {
            GameData.getModelIndex(modelName);
        }

        const modelsJag = await this.readDataFile(
            `models${version.MODELS}.jag`,
            '3d models',
            60
        );

        if (!modelsJag) {
            this.errorLoadingData = true;
            return;
        }

        for (let i = 0; i < GameData.modelCount; i++) {
            const offset = Utility.getDataFileOffset(
                `${GameData.modelName[i]}.ob3`,
                modelsJag
            );

            if (offset !== 0) {
                this.gameModels[i] = GameModel.fromBytes(modelsJag, offset);
            } else {
                this.gameModels[i] = GameModel._from2(1, 1);
            }

            if (GameData.modelName[i].toLowerCase() === 'giantcrystal') {
                this.gameModels[i].transparent = true;
            }
        }
    }

    showMessage(message, type) {
        if (type === 2 || type === 4 || type === 6) {
            for (; message.length > 5 && message[0] === '@' && message[4] === '@'; message = message.substring(5)) ;

            const colonIndex = message.indexOf(':');

            if (colonIndex !== -1) {
                const username = message.substring(0, colonIndex);
                const encodedUsername = Utility.usernameToHash(username);

                for (let i1 = 0; i1 < this.ignoreListCount; i1++) {
                    if (this.ignoreList[i1].equals(encodedUsername)) {
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

        for (let i = 4; i > 0; i--) {
            this.messageHistory[i] = this.messageHistory[i - 1];
            this.messageHistoryTimeout[i] = this.messageHistoryTimeout[i - 1];
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
        let width = 0;
        let height = 0;

        if (id === 0 || id === 4) {
            width = GameData.objectWidth[index];
            height = GameData.objectHeight[index];
        } else {
            height = GameData.objectWidth[index];
            width = GameData.objectHeight[index];
        }

        if (GameData.objectType[index] === 2 || GameData.objectType[index] === 3) {
            if (id === 0) {
                x--;
                width++;
            } else if (id === 2) {
                height++;
            } else if (id === 4) {
                width++;
            } else if (id === 6) {
                y--;
                height++;
            }

            this._walkToActionSource_from8(this.localRegionX, this.localRegionY, x, y, (x + width) - 1, (y + height) - 1, false, true);
        } else {
            this._walkToActionSource_from8(this.localRegionX, this.localRegionY, x, y, (x + width) - 1, (y + height) - 1, true, true);
        }
    }

    getInventoryCount(id) {
        let count = 0;

        for (let i = 0; i < this.inventoryItemsCount; i++) {
            if (this.inventoryItemId[i] === id) {
                if (GameData.itemStackable[id] === 1) {
                    count++;
                } else {
                    count += this.inventoryItemStackCount[i];
                }
            }
        }

        return count;
    }

    async loadTextures() {
        const texturesJag = await this.readDataFile(
            `textures${version.TEXTURES}.jag`,
            'Textures',
            50
        );

        if (!texturesJag) {
            this.errorLoadingData = true;
            return;
        }

        const indexDat = Utility.loadData('index.dat', 0, texturesJag);

        this.scene.allocateTextures(GameData.textureCount, 7, 11);

        for (let i = 0; i < GameData.textureCount; i++) {
            const name = GameData.textureName[i];

            let buff1 = Utility.loadData(`${name}.dat`, 0, texturesJag);

            this.surface.parseSprite(this.spriteTexture, buff1, indexDat, 1);
            this.surface.drawBox(0, 0, 128, 128, 0xff00ff);
            this.surface._drawSprite_from3(0, 0, this.spriteTexture);

            let wh = this.surface.spriteWidthFull[this.spriteTexture];
            let nameSub = GameData.textureSubtypeName[i];

            if (nameSub !== null && nameSub.length > 0) {
                let buff2 = Utility.loadData(`${nameSub}.dat`, 0, texturesJag);

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

    handleMouseDown(_, x, y) {
        this.mouseClickXHistory[this.mouseClickCount] = x;
        this.mouseClickYHistory[this.mouseClickCount] = y;
        this.mouseClickCount = this.mouseClickCount + 1 & 8191;

        for (let i = 10; i < 4000; i++) {
            let i1 = this.mouseClickCount - i & 8191;

            if (this.mouseClickXHistory[i1] === x && this.mouseClickYHistory[i1] === y) {
                let flag = false;

                for (let j1 = 1; j1 < i; j1++) {
                    let k1 = this.mouseClickCount - j1 & 8191;
                    let l1 = i1 - j1 & 8191;

                    if (this.mouseClickXHistory[l1] !== x || this.mouseClickYHistory[l1] !== y) {
                        flag = true;
                    }

                    if (this.mouseClickXHistory[k1] !== this.mouseClickXHistory[l1] || this.mouseClickYHistory[k1] !== this.mouseClickYHistory[l1]) {
                        break;
                    }

                    if (j1 === i - 1 && flag && this.combatTimeout === 0 && this.logoutTimeout === 0) {
                        this.sendLogout();
                        return;
                    }
                }
            }
        }
    }

    drawTeleportBubble(x, y, width, height, id) {
        const type = this.teleportBubbleType[id];
        const time = this.teleportBubbleTime[id];

        if (type === 0) {
            // blue bubble used for teleports
            const colour = 255 + time * 5 * 256;
            this.surface.drawCircle(x + ((width / 2) | 0), y + ((height / 2) | 0), 20 + time * 2, colour, 255 - time * 5);
        } else if (type === 1) {
            // red bubble used for telegrab
            const colour = 0xff0000 + time * 5 * 256;
            this.surface.drawCircle(x + ((width / 2) | 0), y + ((height / 2) | 0), 10 + time, colour, 255 - time * 5);
        }
    }

    showServerMessage(message) {
        if (/^@bor@/.test(message)) {
            this.showMessage(message, 4);
        } else if (/^@que@/.test(message)) {
            this.showMessage(`@whi@${message}`, 5);
        } else if (/^@pri@/.test(message)) {
            this.showMessage(message, 6);
        } else {
            this.showMessage(message, 3);
        }
    }

    // looks like it just updates objects like torches etc to flip between the
    // different models and appear "animated"
    updateObjectAnimation(objectIndex, modelName) {
        const objectX = this.objectX[objectIndex];
        const objectY = this.objectY[objectIndex];
        const distanceX = objectX - ((this.localPlayer.currentX / 128) | 0);
        const distanceY = objectY - ((this.localPlayer.currentY / 128) | 0);
        const maxDistance = 7;

        if (objectX >= 0 && objectY >= 0 && objectX < 96 && objectY < 96 && distanceX > -maxDistance && distanceX < maxDistance && distanceY > -maxDistance && distanceY < maxDistance) {
            this.scene.removeModel(this.objectModel[objectIndex]);

            const modelIndex = GameData.getModelIndex(modelName);
            const gameModel = this.gameModels[modelIndex].copy();

            this.scene.addModel(gameModel);
            gameModel._setLight_from6(true, 48, 48, -50, -10, -50);
            gameModel.copyPosition(this.objectModel[objectIndex]);
            gameModel.key = objectIndex;
            this.objectModel[objectIndex] = gameModel;
        }
    }

    createTopMouseMenu() {
        if (this.selectedSpell >= 0 || this.selectedItemInventoryIndex >= 0) {
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

            if ((this.selectedItemInventoryIndex >= 0 || this.selectedSpell >= 0) && this.menuItemsCount === 1) {
                s = 'Choose a target';
            } else if ((this.selectedItemInventoryIndex >= 0 || this.selectedSpell >= 0) && this.menuItemsCount > 1) {
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
                this.showUITab = 0;

                this.selectedItemName =
                        GameData.itemName[this.inventoryItemId[
                            this.selectedItemInventoryIndex]];
                break;
            case 660:
                this.packetStream.newPacket(clientOpcodes.INV_DROP);
                this.packetStream.putShort(menuIndex);
                this.packetStream.sendPacket();
                this.selectedItemInventoryIndex = -1;
                this.showUITab = 0;

                this.showMessage(
                    'Dropping ' +
                        GameData.itemName[this.inventoryItemId[menuIndex]],
                    4
                );
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

    isValidCameraAngle(angle) {
        const x = (this.localPlayer.currentX / 128) | 0;
        const y = (this.localPlayer.currentY / 128) | 0;

        for (let l = 2; l >= 1; l--) {
            if (angle === 1 && ((this.world.objectAdjacency.get(x, y - l) & 128) === 128 || (this.world.objectAdjacency.get(x - l, y) & 128) === 128 || (this.world.objectAdjacency.get(x - l, y - l) & 128) === 128)) {
                return false;
            }

            if (angle === 3 && ((this.world.objectAdjacency.get(x, y + l) & 128) === 128 || (this.world.objectAdjacency.get(x - l, y) & 128) === 128 || (this.world.objectAdjacency.get(x - l, y + l) & 128) === 128)) {
                return false;
            }

            if (angle === 5 && ((this.world.objectAdjacency.get(x, y + l) & 128) === 128 || (this.world.objectAdjacency.get(x + l, y) & 128) === 128 || (this.world.objectAdjacency.get(x + l, y + l) & 128) === 128)) {
                return false;
            }

            if (angle === 7 && ((this.world.objectAdjacency.get(x, y - l) & 128) === 128 || (this.world.objectAdjacency.get(x + l, y) & 128) === 128 || (this.world.objectAdjacency.get(x + l, y - l) & 128) === 128)) {
                return false;
            }

            if (angle === 0 && (this.world.objectAdjacency.get(x, y - l) & 128) === 128) {
                return false;
            }

            if (angle === 2 && (this.world.objectAdjacency.get(x - l, y) & 128) === 128) {
                return false;
            }

            if (angle === 4 && (this.world.objectAdjacency.get(x, y + l) & 128) === 128) {
                return false;
            }

            if (angle === 6 && (this.world.objectAdjacency.get(x + l, y) & 128) === 128) {
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

    handleIncomingPacket(opcode, size, data) {
        try {
            const handler = this.packetHandlers[opcode];

            if (handler) {
                handler(data, size);
            } else {
                throw new Error(`unhandled packet opcode ${opcode}`);
            }
        } catch (e) {
            console.error(e);

            if (this.packetErrorCount < 3) {
                let errorMessage = e.stack;
                let messageLength = errorMessage.length;

                this.packetStream.newPacket(clientOpcodes.PACKET_EXCEPTION);
                this.packetStream.putShort(messageLength);
                this.packetStream.putString(errorMessage);
                this.packetStream.putShort(messageLength = (errorMessage = 'p-type: ' + opcode + ' p-size:' + size).length);
                this.packetStream.putString(errorMessage);
                this.packetStream.putShort(messageLength = (errorMessage = 'rx:' + this.localRegionX + ' ry:' + this.localRegionY + ' num3l:' + this.objectCount).length);
                this.packetStream.putString(errorMessage);

                errorMessage = '';

                for (let i = 0; i < 80 && i < size; i++) {
                    errorMessage = errorMessage + data[i] + ' ';
                }

                this.packetStream.putShort(errorMessage.length);
                this.packetStream.putString(errorMessage);
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
                    const type = (gameModel.faceTag[pid] / 10000) | 0;

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
                                this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[this.groundItemID[idx]];
                                this.menuType[this.menuItemsCount] = 200;
                                this.menuItemX[this.menuItemsCount] = this.groundItemX[idx];
                                this.menuItemY[this.menuItemsCount] = this.groundItemY[idx];
                                this.menuIndex[this.menuItemsCount] = this.groundItemID[idx];
                                this.menuSourceIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[this.groundItemID[idx]];
                            this.menuType[this.menuItemsCount] = 210;
                            this.menuItemX[this.menuItemsCount] = this.groundItemX[idx];
                            this.menuItemY[this.menuItemsCount] = this.groundItemY[idx];
                            this.menuIndex[this.menuItemsCount] = this.groundItemID[idx];
                            this.menuSourceIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            this.menuItemText1[this.menuItemsCount] = 'Take';
                            this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[this.groundItemID[idx]];
                            this.menuType[this.menuItemsCount] = 220;
                            this.menuItemX[this.menuItemsCount] = this.groundItemX[idx];
                            this.menuItemY[this.menuItemsCount] = this.groundItemY[idx];
                            this.menuIndex[this.menuItemsCount] = this.groundItemID[idx];
                            this.menuItemsCount++;
                            this.menuItemText1[this.menuItemsCount] = 'Examine';
                            this.menuItemText2[this.menuItemsCount] = '@lre@' + GameData.itemName[this.groundItemID[idx]];
                            this.menuType[this.menuItemsCount] = 3200;
                            this.menuIndex[this.menuItemsCount] = this.groundItemID[idx];
                            this.menuItemsCount++;
                        }
                    } else if (type === 3) {
                        let menuText = '';
                        let levelDiff = -1;
                        const id = this.npcs[idx].npcId;

                        if (GameData.npcAttackable[id] > 0) {
                            const npcLevel = ((GameData.npcAttack[id] + GameData.npcDefense[id] + GameData.npcStrength[id] + GameData.npcHits[id]) / 4) | 0;
                            const playerLevel = ((this.playerStatBase[0] + this.playerStatBase[1] + this.playerStatBase[2] + this.playerStatBase[3] + 27) / 4) | 0;

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
                    const index = gameModel.key - 10000;
                    const id = this.wallObjectId[index];

                    if (!this.wallObjectAlreadyInMenu[index]) {
                        if (this.selectedSpell >= 0) {
                            if (GameData.spellType[this.selectedSpell] === 4) {
                                this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                                this.menuType[this.menuItemsCount] = 300;
                                this.menuItemX[this.menuItemsCount] = this.wallObjectX[index];
                                this.menuItemY[this.menuItemsCount] = this.wallObjectY[index];
                                this.menuIndex[this.menuItemsCount] = this.wallObjectDirection[index];
                                this.menuSourceIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                            this.menuType[this.menuItemsCount] = 310;
                            this.menuItemX[this.menuItemsCount] = this.wallObjectX[index];
                            this.menuItemY[this.menuItemsCount] = this.wallObjectY[index];
                            this.menuIndex[this.menuItemsCount] = this.wallObjectDirection[index];
                            this.menuSourceIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            if (!/^WalkTo$/i.test(GameData.wallObjectCommand1[id])) {
                                this.menuItemText1[this.menuItemsCount] = GameData.wallObjectCommand1[id];
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                                this.menuType[this.menuItemsCount] = 320;
                                this.menuItemX[this.menuItemsCount] = this.wallObjectX[index];
                                this.menuItemY[this.menuItemsCount] = this.wallObjectY[index];
                                this.menuIndex[this.menuItemsCount] = this.wallObjectDirection[index];
                                this.menuItemsCount++;
                            }

                            if (!/^Examine$/i.test(GameData.wallObjectCommand2[id])) {
                                this.menuItemText1[this.menuItemsCount] = GameData.wallObjectCommand2[id];
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                                this.menuType[this.menuItemsCount] = 2300;
                                this.menuItemX[this.menuItemsCount] = this.wallObjectX[index];
                                this.menuItemY[this.menuItemsCount] = this.wallObjectY[index];
                                this.menuIndex[this.menuItemsCount] = this.wallObjectDirection[index];
                                this.menuItemsCount++;
                            }

                            this.menuItemText1[this.menuItemsCount] = 'Examine';
                            this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.wallObjectName[id];
                            this.menuType[this.menuItemsCount] = 3300;
                            this.menuIndex[this.menuItemsCount] = id;
                            this.menuItemsCount++;
                        }

                        this.wallObjectAlreadyInMenu[index] = true;
                    }
                } else if (gameModel !== null && gameModel.key >= 0) {
                    const index = gameModel.key;
                    const id = this.objectId[index];

                    if (!this.objectAlreadyInMenu[index]) {
                        if (this.selectedSpell >= 0) {
                            if (GameData.spellType[this.selectedSpell] === 5) {
                                this.menuItemText1[this.menuItemsCount] = 'Cast ' + GameData.spellName[this.selectedSpell] + ' on';
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                                this.menuType[this.menuItemsCount] = 400;
                                this.menuItemX[this.menuItemsCount] = this.objectX[index];
                                this.menuItemY[this.menuItemsCount] = this.objectY[index];
                                this.menuIndex[this.menuItemsCount] = this.objectDirection[index];
                                this.menuSourceIndex[this.menuItemsCount] = this.objectId[index];
                                this.menuTargetIndex[this.menuItemsCount] = this.selectedSpell;
                                this.menuItemsCount++;
                            }
                        } else if (this.selectedItemInventoryIndex >= 0) {
                            this.menuItemText1[this.menuItemsCount] = 'Use ' + this.selectedItemName + ' with';
                            this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                            this.menuType[this.menuItemsCount] = 410;
                            this.menuItemX[this.menuItemsCount] = this.objectX[index];
                            this.menuItemY[this.menuItemsCount] = this.objectY[index];
                            this.menuIndex[this.menuItemsCount] = this.objectDirection[index];
                            this.menuSourceIndex[this.menuItemsCount] = this.objectId[index];
                            this.menuTargetIndex[this.menuItemsCount] = this.selectedItemInventoryIndex;
                            this.menuItemsCount++;
                        } else {
                            if (!/^WalkTo$/i.test(GameData.objectCommand1[id])) {
                                this.menuItemText1[this.menuItemsCount] = GameData.objectCommand1[id];
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                                this.menuType[this.menuItemsCount] = 420;
                                this.menuItemX[this.menuItemsCount] = this.objectX[index];
                                this.menuItemY[this.menuItemsCount] = this.objectY[index];
                                this.menuIndex[this.menuItemsCount] = this.objectDirection[index];
                                this.menuSourceIndex[this.menuItemsCount] = this.objectId[index];
                                this.menuItemsCount++;
                            }

                            if (!/^Examine$/i.test(GameData.objectCommand2[id])) {
                                this.menuItemText1[this.menuItemsCount] = GameData.objectCommand2[id];
                                this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                                this.menuType[this.menuItemsCount] = 2400;
                                this.menuItemX[this.menuItemsCount] = this.objectX[index];
                                this.menuItemY[this.menuItemsCount] = this.objectY[index];
                                this.menuIndex[this.menuItemsCount] = this.objectDirection[index];
                                this.menuSourceIndex[this.menuItemsCount] = this.objectId[index];
                                this.menuItemsCount++;
                            }

                            this.menuItemText1[this.menuItemsCount] = 'Examine';
                            this.menuItemText2[this.menuItemsCount] = '@cya@' + GameData.objectName[id];
                            this.menuType[this.menuItemsCount] = 3400;
                            this.menuIndex[this.menuItemsCount] = id;
                            this.menuItemsCount++;
                        }

                        this.objectAlreadyInMenu[index] = true;
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

                const roll = (Math.random() * 4) | 0;

                if ((roll & 1) === 1) {
                    this.cameraRotationX += this.cameraRotationXIncrement;
                }

                if ((roll & 2) === 2) {
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
        this.world.mapPack = await this.readDataFile(
            `maps${version.MAPS}.jag`,
            'map',
            70
        );

        if (this.members) {
            this.world.memberMapPack = await this.readDataFile(
                `maps${version.MAPS}.mem`,
                'members map',
                75
            );
        }

        this.world.landscapePack = await this.readDataFile(
            `land${version.MAPS}.jag`,
            'landscape',
            80
        );

        if (this.members) {
            this.world.memberLandscapePack = await this.readDataFile(
                `land${version.MAPS}.mem`,
                'members landscape',
                85
            );
        }
    }

    createModel(x, y, direction, id, count) {
        let x1 = x;
        let y1 = y;
        let x2 = x;
        let y2 = y;

        const frontTexture = GameData.wallObjectTextureFront[id];
        const backTexture = GameData.wallObjectTextureBack[id];
        const height = GameData.wallObjectHeight[id];
        const gameModel = GameModel._from2(4, 1);

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

        const vertices = new Int32Array([
            gameModel.vertexAt(x1, -this.world.getElevation(x1, y1), y1),
            gameModel.vertexAt(x1, -this.world.getElevation(x1, y1) - height, y1),
            gameModel.vertexAt(x2, -this.world.getElevation(x2, y2) - height, y2),
            gameModel.vertexAt(x2, -this.world.getElevation(x2, y2), y2)
        ]);

        gameModel.createFace(4, vertices, frontTexture, backTexture);
        gameModel._setLight_from6(false, 60, 24, -50, -10, -50);

        if (x >= 0 && y >= 0 && x < 96 && y < 96) {
            this.scene.addModel(gameModel);
        }

        gameModel.key = count + 10000;

        return gameModel;
    }
}

module.exports = mudclient;
