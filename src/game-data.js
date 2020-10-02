const Utility = require('./utility');
const ndarray = require('ndarray');

class GameData {
    static getModelIndex(s) {
        if (/^na$/i.test(s)) {
            return 0;
        }

        for (let i = 0; i < GameData.modelCount; i++) {
            if (GameData.modelName[i].toLowerCase() === s.toLowerCase()) {
                return i;
            }
        }

        GameData.modelName[GameData.modelCount++] = s;

        return GameData.modelCount - 1;
    }

    static getUnsignedByte() {
        let i = GameData.dataInteger[GameData.offset] & 0xff;
        GameData.offset++;

        return i;
    }

    static getUnsignedShort() {
        let i = Utility.getUnsignedShort(GameData.dataInteger, GameData.offset);
        GameData.offset += 2;

        return i;
    }

    static getUnsignedInt() {
        let i = Utility.getUnsignedInt(GameData.dataInteger, GameData.offset);
        GameData.offset += 4;

        if (i > 99999999) {
            i = 99999999 - i;
        }

        return i;
    }

    static getString() {
        let s = '';
        for (
            s = '';
            GameData.dataString[GameData.stringOffset] !== 0;
            s =
                s +
                String.fromCharCode(
                    GameData.dataString[GameData.stringOffset++]
                )
        );
        GameData.stringOffset++;

        return s;
    }

    static loadData(buffer, isMembers) {
        GameData.dataString = Utility.loadData('string.dat', 0, buffer);
        GameData.stringOffset = 0;
        GameData.dataInteger = Utility.loadData('integer.dat', 0, buffer);
        GameData.offset = 0;

        let i = 0;

        GameData.itemCount = GameData.getUnsignedShort();
        GameData.itemName = [];
        GameData.itemDescription = [];
        GameData.itemCommand = [];
        GameData.itemPicture = new Int32Array(GameData.itemCount);
        GameData.itemBasePrice = new Int32Array(GameData.itemCount);
        GameData.itemStackable = new Int32Array(GameData.itemCount);
        GameData.itemUnused = new Int32Array(GameData.itemCount);
        GameData.itemWearable = new Int32Array(GameData.itemCount);
        GameData.itemMask = new Int32Array(GameData.itemCount);
        GameData.itemSpecial = new Int32Array(GameData.itemCount);
        GameData.itemMembers = new Int32Array(GameData.itemCount);

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemName.push(GameData.getString());
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemDescription.push(GameData.getString());
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemCommand.push(GameData.getString());
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemPicture[i] = GameData.getUnsignedShort();

            if (GameData.itemPicture[i] + 1 > GameData.itemSpriteCount) {
                GameData.itemSpriteCount = GameData.itemPicture[i] + 1;
            }
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemBasePrice[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemStackable[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemUnused[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemWearable[i] = GameData.getUnsignedShort();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemMask[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemSpecial[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            GameData.itemMembers[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.itemCount; i++) {
            if (!isMembers && GameData.itemMembers[i] === 1) {
                GameData.itemName[i] = 'Members object';
                GameData.itemDescription[i] =
                    'You need to be a member to use this object';
                GameData.itemBasePrice[i] = 0;
                GameData.itemCommand[i] = '';
                GameData.itemUnused[0] = 0;
                GameData.itemWearable[i] = 0;
                GameData.itemSpecial[i] = 1;
            }
        }

        GameData.npcCount = GameData.getUnsignedShort();
        GameData.npcName = [];
        GameData.npcDescription = [];
        GameData.npcCommand = [];
        GameData.npcAttack = new Int32Array(GameData.npcCount);
        GameData.npcStrength = new Int32Array(GameData.npcCount);
        GameData.npcHits = new Int32Array(GameData.npcCount);
        GameData.npcDefense = new Int32Array(GameData.npcCount);
        GameData.npcAttackable = new Int32Array(GameData.npcCount);
        GameData.npcSprite = ndarray(new Int32Array(GameData.npcCount * 12), [
            GameData.npcCount,
            12
        ]);
        GameData.npcColourHair = new Int32Array(GameData.npcCount);
        GameData.npcColourTop = new Int32Array(GameData.npcCount);
        GameData.npcColorBottom = new Int32Array(GameData.npcCount);
        GameData.npcColourSkin = new Int32Array(GameData.npcCount);
        GameData.npcWidth = new Int32Array(GameData.npcCount);
        GameData.npcHeight = new Int32Array(GameData.npcCount);
        GameData.npcWalkModel = new Int32Array(GameData.npcCount);
        GameData.npcCombatModel = new Int32Array(GameData.npcCount);
        GameData.npcCombatAnimation = new Int32Array(GameData.npcCount);

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcName.push(GameData.getString());
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcDescription.push(GameData.getString());
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcAttack[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcStrength[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcHits[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcDefense[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcAttackable[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            for (let i5 = 0; i5 < 12; i5++) {
                GameData.npcSprite.set(i, i5, GameData.getUnsignedByte());

                if (GameData.npcSprite.get(i, i5) === 255) {
                    GameData.npcSprite.set(i, i5, -1);
                }
            }
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcColourHair[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcColourTop[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcColorBottom[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcColourSkin[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcWidth[i] = GameData.getUnsignedShort();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcHeight[i] = GameData.getUnsignedShort();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcWalkModel[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcCombatModel[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcCombatAnimation[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.npcCount; i++) {
            GameData.npcCommand[i] = GameData.getString();
        }

        GameData.textureCount = GameData.getUnsignedShort();
        GameData.textureName = [];
        GameData.textureSubtypeName = [];

        for (i = 0; i < GameData.textureCount; i++) {
            GameData.textureName.push(GameData.getString());
        }

        for (i = 0; i < GameData.textureCount; i++) {
            GameData.textureSubtypeName.push(GameData.getString());
        }

        GameData.animationCount = GameData.getUnsignedShort();
        GameData.animationName = [];
        GameData.animationCharacterColour = new Int32Array(
            GameData.animationCount
        );
        GameData.animationSomething = new Int32Array(GameData.animationCount);
        GameData.animationHasA = new Int32Array(GameData.animationCount);
        GameData.animationHasF = new Int32Array(GameData.animationCount);
        GameData.animationNumber = new Int32Array(GameData.animationCount);

        for (i = 0; i < GameData.animationCount; i++) {
            GameData.animationName.push(GameData.getString());
        }

        for (i = 0; i < GameData.animationCount; i++) {
            GameData.animationCharacterColour[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.animationCount; i++) {
            GameData.animationSomething[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.animationCount; i++) {
            GameData.animationHasA[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.animationCount; i++) {
            GameData.animationHasF[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.animationCount; i++) {
            GameData.animationNumber[i] = GameData.getUnsignedByte();
        }

        GameData.objectCount = GameData.getUnsignedShort();
        GameData.objectName = [];
        GameData.objectDescription = [];
        GameData.objectCommand1 = [];
        GameData.objectCommand2 = [];
        GameData.objectModelIndex = new Int32Array(GameData.objectCount);
        GameData.objectWidth = new Int32Array(GameData.objectCount);
        GameData.objectHeight = new Int32Array(GameData.objectCount);
        GameData.objectType = new Int32Array(GameData.objectCount);
        GameData.objectElevation = new Int32Array(GameData.objectCount);

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectName.push(GameData.getString());
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectDescription.push(GameData.getString());
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectCommand1.push(GameData.getString());
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectCommand2.push(GameData.getString());
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectModelIndex[i] = GameData.getModelIndex(
                GameData.getString()
            );
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectWidth[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectHeight[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectType[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.objectCount; i++) {
            GameData.objectElevation[i] = GameData.getUnsignedByte();
        }

        GameData.wallObjectCount = GameData.getUnsignedShort();
        GameData.wallObjectName = [];
        GameData.wallObjectDescription = [];
        GameData.wallObjectCommand1 = [];
        GameData.wallObjectCommand2 = [];
        GameData.wallObjectHeight = new Int32Array(GameData.wallObjectCount);
        GameData.wallObjectTextureFront = new Int32Array(
            GameData.wallObjectCount
        );
        GameData.wallObjectTextureBack = new Int32Array(
            GameData.wallObjectCount
        );
        GameData.wallObjectAdjacent = new Int32Array(GameData.wallObjectCount);
        GameData.wallObjectInvisible = new Int32Array(GameData.wallObjectCount);

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectName.push(GameData.getString());
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectDescription.push(GameData.getString());
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectCommand1.push(GameData.getString());
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectCommand2.push(GameData.getString());
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectHeight[i] = GameData.getUnsignedShort();
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectTextureFront[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            GameData.wallObjectTextureBack[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            // what's this?
            GameData.wallObjectAdjacent[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.wallObjectCount; i++) {
            // value is 0 if visible
            GameData.wallObjectInvisible[i] = GameData.getUnsignedByte();
        }

        // the World class does something with these
        GameData.roofCount = GameData.getUnsignedShort();
        GameData.roofHeight = new Int32Array(GameData.roofCount);
        GameData.roofNumVertices = new Int32Array(GameData.roofCount);

        for (i = 0; i < GameData.roofCount; i++) {
            GameData.roofHeight[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.roofCount; i++) {
            GameData.roofNumVertices[i] = GameData.getUnsignedByte();
        }

        GameData.tileCount = GameData.getUnsignedShort(); // and these
        GameData.tileDecoration = new Int32Array(GameData.tileCount);
        GameData.tileType = new Int32Array(GameData.tileCount);
        GameData.tileAdjacent = new Int32Array(GameData.tileCount);

        for (i = 0; i < GameData.tileCount; i++) {
            GameData.tileDecoration[i] = GameData.getUnsignedInt();
        }

        for (i = 0; i < GameData.tileCount; i++) {
            GameData.tileType[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.tileCount; i++) {
            GameData.tileAdjacent[i] = GameData.getUnsignedByte();
        }

        GameData.projectileSprite = GameData.getUnsignedShort();
        GameData.spellCount = GameData.getUnsignedShort();
        GameData.spellName = [];
        GameData.spellDescription = [];
        GameData.spellLevel = new Int32Array(GameData.spellCount);
        GameData.spellRunesRequired = new Int32Array(GameData.spellCount);
        GameData.spellType = new Int32Array(GameData.spellCount);
        GameData.spellRunesId = [];
        GameData.spellRunesCount = [];

        for (i = 0; i < GameData.spellCount; i++) {
            GameData.spellName.push(GameData.getString());
        }

        for (i = 0; i < GameData.spellCount; i++) {
            GameData.spellDescription.push(GameData.getString());
        }

        for (i = 0; i < GameData.spellCount; i++) {
            GameData.spellLevel[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.spellCount; i++) {
            GameData.spellRunesRequired[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.spellCount; i++) {
            GameData.spellType[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.spellCount; i++) {
            let j = GameData.getUnsignedByte();
            GameData.spellRunesId.push(new Int32Array(j));

            for (let k = 0; k < j; k++) {
                GameData.spellRunesId[i][k] = GameData.getUnsignedShort();
            }
        }

        for (i = 0; i < GameData.spellCount; i++) {
            let j = GameData.getUnsignedByte();
            GameData.spellRunesCount.push(new Int32Array(j));

            for (let k = 0; k < j; k++) {
                GameData.spellRunesCount[i][k] = GameData.getUnsignedByte();
            }
        }

        GameData.prayerCount = GameData.getUnsignedShort();
        GameData.prayerName = [];
        GameData.prayerDescription = [];
        GameData.prayerLevel = new Int32Array(GameData.prayerCount);
        GameData.prayerDrain = new Int32Array(GameData.prayerCount);

        for (i = 0; i < GameData.prayerCount; i++) {
            GameData.prayerName.push(GameData.getString());
        }

        for (i = 0; i < GameData.prayerCount; i++) {
            GameData.prayerDescription.push(GameData.getString());
        }

        for (i = 0; i < GameData.prayerCount; i++) {
            GameData.prayerLevel[i] = GameData.getUnsignedByte();
        }

        for (i = 0; i < GameData.prayerCount; i++) {
            GameData.prayerDrain[i] = GameData.getUnsignedByte();
        }

        GameData.dataString = null;
        GameData.dataInteger = null;
    }
}

GameData.modelName = [];
GameData.modelName.length = 5000;
GameData.modelName.fill(null);
GameData.textureName = null;
GameData.textureSubtypeName = null;
GameData.objectModelIndex = null;
GameData.objectWidth = null;
GameData.objectHeight = null;
GameData.objectType = null;
GameData.objectElevation = null;
GameData.spellCount = 0;
GameData.npcWidth = null;
GameData.npcHeight = null;
GameData.npcSprite = null;
GameData.npcAttack = null;
GameData.npcStrength = null;
GameData.npcHits = null;
GameData.npcDefense = null;
GameData.npcAttackable = null;
GameData.spellLevel = null;
GameData.spellRunesRequired = null;
GameData.spellType = null;
GameData.spellRunesId = null;
GameData.spellRunesCount = null;
GameData.itemCount = 0;
GameData.itemSpriteCount = 0;
GameData.npcColourHair = null;
GameData.npcColourTop = null;
GameData.npcColorBottom = null;
GameData.npcColourSkin = null;
GameData.wallObjectHeight = null;
GameData.wallObjectTextureFront = null;
GameData.wallObjectTextureBack = null;
GameData.wallObjectAdjacent = null;
GameData.wallObjectInvisible = null;
GameData.tileCount = 0;
GameData.animationCharacterColour = null;
GameData.animationSomething = null;
GameData.animationHasA = null;
GameData.animationHasF = null;
GameData.animationNumber = null;
GameData.wallObjectCount = 0;
GameData.prayerLevel = null;
GameData.prayerDrain = null;
GameData.tileDecoration = null;
GameData.tileType = null;
GameData.tileAdjacent = null;
GameData.modelCount = 0;
GameData.roofHeight = null;
GameData.roofNumVertices = null;
GameData.prayerCount = 0;
GameData.itemName = null;
GameData.itemDescription = null;
GameData.itemCommand = null;
GameData.projectileSprite = 0;
GameData.npcCount = 0;
GameData.spellName = null;
GameData.spellDescription = null;
GameData.textureCount = 0;
GameData.wallObjectName = null;
GameData.wallObjectDescription = null;
GameData.wallObjectCommand1 = null;
GameData.wallObjectCommand2 = null;
GameData.roofCount = 0;
GameData.objectCount = 0;
GameData.npcName = null;
GameData.npcDescription = null;
GameData.npcCommand = null;
GameData.animationName = null;
GameData.itemPicture = null;
GameData.itemBasePrice = null;
GameData.itemStackable = null;
GameData.itemUnused = null;
GameData.itemWearable = null;
GameData.itemMask = null;
GameData.itemSpecial = null;
GameData.itemMembers = null;
GameData.animationCount = 0;
GameData.prayerName = null;
GameData.prayerDescription = null;
GameData.objectName = null;
GameData.objectDescription = null;
GameData.objectCommand1 = null;
GameData.objectCommand2 = null;
GameData.npcWalkModel = null;
GameData.npcCombatModel = null;
GameData.npcCombatAnimation = null;
GameData.dataString = null;
GameData.dataInteger = null;
GameData.stringOffset = 0;
GameData.offset = 0;

module.exports = GameData;
