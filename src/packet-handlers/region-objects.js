const Utility = require('../utility');
const GameData = require('../game-data');
const serverOpcodes = require('../opcodes/server');

const handlers = {
    [serverOpcodes.REGION_OBJECTS]: function (data, size) {
        for (let offset = 1; offset < size; ) {
            if (Utility.getUnsignedByte(data[offset]) === 255) {
                let objectIndex = 0;
                const l14 = (this.localRegionX + data[offset + 1]) >> 3;
                const k19 = (this.localRegionY + data[offset + 2]) >> 3;

                offset += 3;

                for (let i = 0; i < this.objectCount; i++) {
                    const l26 = (this.objectX[i] >> 3) - l14;
                    const k29 = (this.objectY[i] >> 3) - k19;

                    if (l26 !== 0 || k29 !== 0) {
                        if (i !== objectIndex) {
                            this.objectModel[objectIndex] = this.objectModel[i];
                            this.objectModel[objectIndex].key = objectIndex;
                            this.objectX[objectIndex] = this.objectX[i];
                            this.objectY[objectIndex] = this.objectY[i];
                            this.objectId[objectIndex] = this.objectId[i];

                            this.objectDirection[
                                objectIndex
                            ] = this.objectDirection[i];
                        }

                        objectIndex++;
                    } else {
                        this.scene.removeModel(this.objectModel[i]);

                        this.world.removeObject(
                            this.objectX[i],
                            this.objectY[i],
                            this.objectId[i]
                        );
                    }
                }

                this.objectCount = objectIndex;
            } else {
                const objectID = Utility.getUnsignedShort(data, offset);
                offset += 2;

                const areaX = this.localRegionX + data[offset++];
                const areaY = this.localRegionY + data[offset++];
                let objectIndex = 0;

                for (let i = 0; i < this.objectCount; i++) {
                    if (
                        this.objectX[i] !== areaX ||
                        this.objectY[i] !== areaY
                    ) {
                        if (i !== objectIndex) {
                            this.objectModel[objectIndex] = this.objectModel[i];
                            this.objectModel[objectIndex].key = objectIndex;
                            this.objectX[objectIndex] = this.objectX[i];
                            this.objectY[objectIndex] = this.objectY[i];
                            this.objectId[objectIndex] = this.objectId[i];

                            this.objectDirection[
                                objectIndex
                            ] = this.objectDirection[i];
                        }

                        objectIndex++;
                    } else {
                        this.scene.removeModel(this.objectModel[i]);
                        this.world.removeObject(
                            this.objectX[i],
                            this.objectY[i],
                            this.objectId[i]
                        );
                    }
                }

                this.objectCount = objectIndex;

                if (objectID !== 60000) {
                    const direction = this.world.getTileDirection(areaX, areaY);
                    let width = 0;
                    let height = 0;

                    if (direction === 0 || direction === 4) {
                        width = GameData.objectWidth[objectID];
                        height = GameData.objectHeight[objectID];
                    } else {
                        height = GameData.objectWidth[objectID];
                        width = GameData.objectHeight[objectID];
                    }

                    const modelX =
                        (((areaX + areaX + width) * this.magicLoc) / 2) | 0;

                    const modelY =
                        (((areaY + areaY + height) * this.magicLoc) / 2) | 0;

                    const modelIndex = GameData.objectModelIndex[objectID];
                    const model = this.gameModels[modelIndex].copy();

                    this.scene.addModel(model);

                    model.key = this.objectCount;
                    model.rotate(0, direction * 32, 0);

                    model.translate(
                        modelX,
                        -this.world.getElevation(modelX, modelY),
                        modelY
                    );

                    model._setLight_from6(true, 48, 48, -50, -10, -50);

                    this.world.removeObject2(areaX, areaY, objectID);

                    if (objectID === 74) {
                        model.translate(0, -480, 0);
                    }

                    this.objectX[this.objectCount] = areaX;
                    this.objectY[this.objectCount] = areaY;
                    this.objectId[this.objectCount] = objectID;
                    this.objectDirection[this.objectCount] = direction;
                    this.objectModel[this.objectCount++] = model;
                }
            }
        }
    }
};

module.exports = handlers;
