const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.REGION_WALL_OBJECTS]: function (data, size) {
        for (let offset = 1; offset < size; ) {
            if (Utility.getUnsignedByte(data[offset]) === 255) {
                let index = 0;
                const lX = (this.localRegionX + data[offset + 1]) >> 3;
                const lY = (this.localRegionY + data[offset + 2]) >> 3;

                offset += 3;

                for (let i = 0; i < this.wallObjectCount; i++) {
                    const sX = (this.wallObjectX[i] >> 3) - lX;
                    const sY = (this.wallObjectY[i] >> 3) - lY;

                    if (sX !== 0 || sY !== 0) {
                        if (i !== index) {
                            this.wallObjectModel[index] = this.wallObjectModel[
                                i
                            ];

                            this.wallObjectModel[index].key = index + 10000;
                            this.wallObjectX[index] = this.wallObjectX[i];
                            this.wallObjectY[index] = this.wallObjectY[i];

                            this.wallObjectDirection[
                                index
                            ] = this.wallObjectDirection[i];

                            this.wallObjectId[index] = this.wallObjectId[i];
                        }

                        index++;
                    } else {
                        this.scene.removeModel(this.wallObjectModel[i]);

                        this.world.removeWallObject(
                            this.wallObjectX[i],
                            this.wallObjectY[i],
                            this.wallObjectDirection[i],
                            this.wallObjectId[i]
                        );
                    }
                }

                this.wallObjectCount = index;
            } else {
                const id = Utility.getUnsignedShort(data, offset);
                offset += 2;

                const lX = this.localRegionX + data[offset++];
                const lY = this.localRegionY + data[offset++];
                const direction = data[offset++];
                let count = 0;

                for (let i = 0; i < this.wallObjectCount; i++) {
                    if (
                        this.wallObjectX[i] !== lX ||
                        this.wallObjectY[i] !== lY ||
                        this.wallObjectDirection[i] !== direction
                    ) {
                        if (i !== count) {
                            this.wallObjectModel[count] = this.wallObjectModel[
                                i
                            ];
                            this.wallObjectModel[count].key = count + 10000;
                            this.wallObjectX[count] = this.wallObjectX[i];
                            this.wallObjectY[count] = this.wallObjectY[i];
                            this.wallObjectDirection[
                                count
                            ] = this.wallObjectDirection[i];
                            this.wallObjectId[count] = this.wallObjectId[i];
                        }

                        count++;
                    } else {
                        this.scene.removeModel(this.wallObjectModel[i]);
                        this.world.removeWallObject(
                            this.wallObjectX[i],
                            this.wallObjectY[i],
                            this.wallObjectDirection[i],
                            this.wallObjectId[i]
                        );
                    }
                }

                this.wallObjectCount = count;

                if (id !== 65535) {
                    this.world._setObjectAdjacency_from4(lX, lY, direction, id);

                    const model = this.createModel(
                        lX,
                        lY,
                        direction,
                        id,
                        this.wallObjectCount
                    );

                    this.wallObjectModel[this.wallObjectCount] = model;
                    this.wallObjectX[this.wallObjectCount] = lX;
                    this.wallObjectY[this.wallObjectCount] = lY;
                    this.wallObjectId[this.wallObjectCount] = id;

                    this.wallObjectDirection[
                        this.wallObjectCount++
                    ] = direction;
                }
            }
        }
    }
};
