const GameData = require('../game-data');
const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.REGION_GROUND_ITEMS]: function (data, size) {
        for (let offset = 1; offset < size; ) {
            if (Utility.getUnsignedByte(data[offset]) === 255) {
                let index = 0;
                const j14 = (this.localRegionX + data[offset + 1]) >> 3;
                const i19 = (this.localRegionY + data[offset + 2]) >> 3;

                offset += 3;

                for (let i = 0; i < this.groundItemCount; i++) {
                    const j26 = (this.groundItemX[i] >> 3) - j14;
                    const j29 = (this.groundItemY[i] >> 3) - i19;

                    if (j26 !== 0 || j29 !== 0) {
                        if (i !== index) {
                            this.groundItemX[index] = this.groundItemX[i];
                            this.groundItemY[index] = this.groundItemY[i];
                            this.groundItemID[index] = this.groundItemID[i];
                            this.groundItemZ[index] = this.groundItemZ[i];
                        }

                        index++;
                    }
                }

                this.groundItemCount = index;
            } else {
                let itemID = Utility.getUnsignedShort(data, offset);
                offset += 2;

                const areaX = this.localRegionX + data[offset++];
                const areaY = this.localRegionY + data[offset++];

                if ((itemID & 32768) === 0) {
                    this.groundItemX[this.groundItemCount] = areaX;
                    this.groundItemY[this.groundItemCount] = areaY;
                    this.groundItemID[this.groundItemCount] = itemID;
                    this.groundItemZ[this.groundItemCount] = 0;

                    for (let i = 0; i < this.objectCount; i++) {
                        if (
                            this.objectX[i] !== areaX ||
                            this.objectY[i] !== areaY
                        ) {
                            continue;
                        }

                        this.groundItemZ[this.groundItemCount] =
                            GameData.objectElevation[this.objectId[i]];

                        break;
                    }

                    this.groundItemCount++;
                } else {
                    itemID &= 32767;

                    let itemIndex = 0;

                    for (let i = 0; i < this.groundItemCount; i++) {
                        if (
                            this.groundItemX[i] !== areaX ||
                            this.groundItemY[i] !== areaY ||
                            this.groundItemID[i] !== itemID
                        ) {
                            if (i !== itemIndex) {
                                this.groundItemX[itemIndex] = this.groundItemX[
                                    i
                                ];

                                this.groundItemY[itemIndex] = this.groundItemY[
                                    i
                                ];

                                this.groundItemID[
                                    itemIndex
                                ] = this.groundItemID[i];

                                this.groundItemZ[itemIndex] = this.groundItemZ[
                                    i
                                ];
                            }

                            itemIndex++;
                        } else {
                            itemID = -123;
                        }
                    }

                    this.groundItemCount = itemIndex;
                }
            }
        }
    }
};
