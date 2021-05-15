const Utility = require('../utility');
const GameData = require('../game-data');
const serverOpcodes = require('../opcodes/server');

const handlers = {
    [serverOpcodes.REGION_NPCS]: function (data, size) {
        this.npcCacheCount = this.npcCount;
        this.npcCount = 0;

        for (let i = 0; i < this.npcCacheCount; i++) {
            this.npcsCache[i] = this.npcs[i];
        }

        let offset = 8;

        const length = Utility.getBitMask(data, offset, 8);
        offset += 8;

        for (let i = 0; i < length; i++) {
            const npc = this.npcsCache[i];
            const hasUpdated = Utility.getBitMask(data, offset, 1);
            offset++;

            if (hasUpdated !== 0) {
                const hasMoved = Utility.getBitMask(data, offset, 1);
                offset++;

                if (hasMoved === 0) {
                    const sprite = Utility.getBitMask(data, offset, 3);
                    offset += 3;

                    let waypointCurrent = npc.waypointCurrent;
                    let npcX = npc.waypointsX[waypointCurrent];
                    let npcY = npc.waypointsY[waypointCurrent];

                    if (sprite === 2 || sprite === 1 || sprite === 3) {
                        npcX += this.magicLoc;
                    }

                    if (sprite === 6 || sprite === 5 || sprite === 7) {
                        npcX -= this.magicLoc;
                    }

                    if (sprite === 4 || sprite === 3 || sprite === 5) {
                        npcY += this.magicLoc;
                    }

                    if (sprite === 0 || sprite === 1 || sprite === 7) {
                        npcY -= this.magicLoc;
                    }

                    npc.animationNext = sprite;

                    npc.waypointCurrent = waypointCurrent =
                        (waypointCurrent + 1) % 10;

                    npc.waypointsX[waypointCurrent] = npcX;
                    npc.waypointsY[waypointCurrent] = npcY;
                } else {
                    const sprite = Utility.getBitMask(data, offset, 4);

                    if ((sprite & 12) === 12) {
                        offset += 2;
                        continue;
                    }

                    npc.animationNext = Utility.getBitMask(data, offset, 4);
                    offset += 4;
                }
            }

            this.npcs[this.npcCount++] = npc;
        }

        while (offset + 34 < size * 8) {
            const serverIndex = Utility.getBitMask(data, offset, 12);
            offset += 12;

            let areaX = Utility.getBitMask(data, offset, 5);
            offset += 5;

            if (areaX > 15) {
                areaX -= 32;
            }

            let areaY = Utility.getBitMask(data, offset, 5);
            offset += 5;

            if (areaY > 15) {
                areaY -= 32;
            }

            const sprite = Utility.getBitMask(data, offset, 4);
            offset += 4;

            const x = (this.localRegionX + areaX) * this.magicLoc + 64;
            const y = (this.localRegionY + areaY) * this.magicLoc + 64;

            let npcID = Utility.getBitMask(data, offset, 10);
            offset += 10;

            if (npcID >= GameData.npcCount) {
                npcID = 24;
            }

            this.addNpc(serverIndex, x, y, sprite, npcID);
        }
    }
};

module.exports = handlers;
