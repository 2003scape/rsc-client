const GameData = require('../game-data');
const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server');

const handlers = {
    [serverOpcodes.INVENTORY_ITEMS]: function (data) {
        let offset = 1;

        this.inventoryItemsCount = data[offset++] & 0xff;

        for (let i = 0; i < this.inventoryItemsCount; i++) {
            const idEquip = Utility.getUnsignedShort(data, offset);
            offset += 2;

            this.inventoryItemId[i] = idEquip & 32767;
            this.inventoryEquipped[i] = (idEquip / 32768) | 0;

            if (GameData.itemStackable[idEquip & 32767] === 0) {
                this.inventoryItemStackCount[i] = Utility.getStackInt(
                    data,
                    offset
                );

                if (this.inventoryItemStackCount[i] >= 128) {
                    offset += 4;
                } else {
                    offset++;
                }
            } else {
                this.inventoryItemStackCount[i] = 1;
            }
        }
    },
    [serverOpcodes.INVENTORY_ITEM_UPDATE]: function (data) {
        let offset = 1;
        let stack = 1;

        const index = data[offset++] & 0xff;

        const id = Utility.getUnsignedShort(data, offset);
        offset += 2;

        if (GameData.itemStackable[id & 32767] === 0) {
            stack = Utility.getStackInt(data, offset);

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
    },
    [serverOpcodes.INVENTORY_ITEM_REMOVE]: function (data) {
        const index = data[1] & 0xff;

        this.inventoryItemsCount--;

        for (let i = index; i < this.inventoryItemsCount; i++) {
            this.inventoryItemId[i] = this.inventoryItemId[i + 1];

            this.inventoryItemStackCount[i] = this.inventoryItemStackCount[
                i + 1
            ];

            this.inventoryEquipped[i] = this.inventoryEquipped[i + 1];
        }
    }
};

module.exports = handlers;
