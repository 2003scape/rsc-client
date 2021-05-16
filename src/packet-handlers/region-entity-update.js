const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server');

module.exports = {
    [serverOpcodes.REGION_ENTITY_UPDATE]: function (data, size) {
        const length = ((size - 1) / 4) | 0;

        for (let i = 0; i < length; i++) {
            const deltaX =
                (this.localRegionX + Utility.getSignedShort(data, 1 + i * 4)) >>
                3;

            const deltaY =
                (this.localRegionY + Utility.getSignedShort(data, 3 + i * 4)) >>
                3;

            let entityCount = 0;

            for (let j = 0; j < this.groundItemCount; j++) {
                const x = (this.groundItemX[j] >> 3) - deltaX;
                const y = (this.groundItemY[j] >> 3) - deltaY;

                if (x !== 0 || y !== 0) {
                    if (j !== entityCount) {
                        this.groundItemX[entityCount] = this.groundItemX[j];
                        this.groundItemY[entityCount] = this.groundItemY[j];
                        this.groundItemID[entityCount] = this.groundItemID[j];
                        this.groundItemZ[entityCount] = this.groundItemZ[j];
                    }

                    entityCount++;
                }
            }

            this.groundItemCount = entityCount;
            entityCount = 0;

            for (let j = 0; j < this.objectCount; j++) {
                const x = (this.objectX[j] >> 3) - deltaX;
                const y = (this.objectY[j] >> 3) - deltaY;

                if (x !== 0 || y !== 0) {
                    if (j !== entityCount) {
                        this.objectModel[entityCount] = this.objectModel[j];
                        this.objectModel[entityCount].key = entityCount;
                        this.objectX[entityCount] = this.objectX[j];
                        this.objectY[entityCount] = this.objectY[j];
                        this.objectId[entityCount] = this.objectId[j];

                        this.objectDirection[
                            entityCount
                        ] = this.objectDirection[j];
                    }

                    entityCount++;
                } else {
                    this.scene.removeModel(this.objectModel[j]);

                    this.world.removeObject(
                        this.objectX[j],
                        this.objectY[j],
                        this.objectId[j]
                    );
                }
            }

            this.objectCount = entityCount;
            entityCount = 0;

            for (let j = 0; j < this.wallObjectCount; j++) {
                const x = (this.wallObjectX[j] >> 3) - deltaX;
                const y = (this.wallObjectY[j] >> 3) - deltaY;

                if (x !== 0 || y !== 0) {
                    if (j !== entityCount) {
                        this.wallObjectModel[
                            entityCount
                        ] = this.wallObjectModel[j];

                        this.wallObjectModel[entityCount].key =
                            entityCount + 10000;

                        this.wallObjectX[entityCount] = this.wallObjectX[j];
                        this.wallObjectY[entityCount] = this.wallObjectY[j];

                        this.wallObjectDirection[
                            entityCount
                        ] = this.wallObjectDirection[j];

                        this.wallObjectId[entityCount] = this.wallObjectId[j];
                    }

                    entityCount++;
                } else {
                    this.scene.removeModel(this.wallObjectModel[j]);

                    this.world.removeWallObject(
                        this.wallObjectX[j],
                        this.wallObjectY[j],
                        this.wallObjectDirection[j],
                        this.wallObjectId[j]
                    );
                }
            }

            this.wallObjectCount = entityCount;
        }

        return;
    }
};
