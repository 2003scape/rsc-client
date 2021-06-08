const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.SHOP_OPEN]: function (data) {
        this.showDialogShop = true;

        let offset = 1;

        const newItemCount = data[offset++] & 0xff;
        const isGeneral = data[offset++];

        this.shopSellPriceMod = data[offset++] & 0xff;
        this.shopBuyPriceMod = data[offset++] & 0xff;

        for (let itemIndex = 0; itemIndex < 40; itemIndex++) {
            this.shopItem[itemIndex] = -1;
        }

        for (let itemIndex = 0; itemIndex < newItemCount; itemIndex++) {
            this.shopItem[itemIndex] = Utility.getUnsignedShort(data, offset);
            offset += 2;

            this.shopItemCount[itemIndex] = Utility.getUnsignedShort(
                data,
                offset
            );

            offset += 2;

            this.shopItemPrice[itemIndex] = data[offset++];
        }

        if (isGeneral === 1) {
            let shopIndex = 39;

            for (let i = 0; i < this.inventoryItemsCount; i++) {
                if (shopIndex < newItemCount) {
                    break;
                }

                let unsellable = false;

                for (let j = 0; j < 40; j++) {
                    if (this.shopItem[j] !== this.inventoryItemId[i]) {
                        continue;
                    }

                    unsellable = true;
                    break;
                }

                if (this.inventoryItemId[i] === 10) {
                    unsellable = true;
                }

                if (!unsellable) {
                    this.shopItem[shopIndex] = this.inventoryItemId[i] & 32767;
                    this.shopItemCount[shopIndex] = 0;
                    this.shopItemPrice[shopIndex] = 0;
                    shopIndex--;
                }
            }
        }

        if (
            this.shopSelectedItemIndex >= 0 &&
            this.shopSelectedItemIndex < 40 &&
            this.shopItem[this.shopSelectedItemIndex] !==
                this.shopSelectedItemType
        ) {
            this.shopSelectedItemIndex = -1;
            this.shopSelectedItemType = -2;
        }
    },
    [serverOpcodes.SHOP_CLOSE]: function () {
        this.showDialogShop = false;
    }
};
