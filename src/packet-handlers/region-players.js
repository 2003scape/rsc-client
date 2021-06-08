const Utility = require('../utility');
const clientOpcodes = require('../opcodes/client.json');
const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.REGION_PLAYERS]: function (data, size) {
        this.knownPlayerCount = this.playerCount;

        for (let i = 0; i < this.knownPlayerCount; i++) {
            this.knownPlayers[i] = this.players[i];
        }

        let offset = 8;

        this.localRegionX = Utility.getBitMask(data, offset, 11);
        offset += 11;

        this.localRegionY = Utility.getBitMask(data, offset, 13);
        offset += 13;

        const sprite = Utility.getBitMask(data, offset, 4);
        offset += 4;

        const hasLoadedRegion = this.loadNextRegion(
            this.localRegionX,
            this.localRegionY
        );

        this.localRegionX -= this.regionX;
        this.localRegionY -= this.regionY;

        const playerX = this.localRegionX * this.magicLoc + 64;
        const playerY = this.localRegionY * this.magicLoc + 64;

        if (hasLoadedRegion) {
            this.localPlayer.waypointCurrent = 0;
            this.localPlayer.movingStep = 0;
            this.localPlayer.currentX = this.localPlayer.waypointsX[0] = playerX;
            this.localPlayer.currentY = this.localPlayer.waypointsY[0] = playerY;
        }

        this.playerCount = 0;

        this.localPlayer = this.createPlayer(
            this.localPlayerServerIndex,
            playerX,
            playerY,
            sprite
        );

        const length = Utility.getBitMask(data, offset, 8);
        offset += 8;

        for (let i = 0; i < length; i++) {
            const player = this.knownPlayers[i + 1];
            const hasUpdated = Utility.getBitMask(data, offset, 1);

            offset++;

            if (hasUpdated !== 0) {
                const updateType = Utility.getBitMask(data, offset, 1);
                offset++;

                if (updateType === 0) {
                    const sprite = Utility.getBitMask(data, offset, 3);
                    offset += 3;

                    let waypointCurrent = player.waypointCurrent;
                    let playerX = player.waypointsX[waypointCurrent];
                    let playerY = player.waypointsY[waypointCurrent];

                    if (sprite === 2 || sprite === 1 || sprite === 3) {
                        playerX += this.magicLoc;
                    }

                    if (sprite === 6 || sprite === 5 || sprite === 7) {
                        playerX -= this.magicLoc;
                    }

                    if (sprite === 4 || sprite === 3 || sprite === 5) {
                        playerY += this.magicLoc;
                    }

                    if (sprite === 0 || sprite === 1 || sprite === 7) {
                        playerY -= this.magicLoc;
                    }

                    player.animationNext = sprite;

                    player.waypointCurrent = waypointCurrent =
                        (waypointCurrent + 1) % 10;

                    player.waypointsX[waypointCurrent] = playerX;
                    player.waypointsY[waypointCurrent] = playerY;
                } else {
                    const sprite = Utility.getBitMask(data, offset, 4);

                    if ((sprite & 12) === 12) {
                        offset += 2;
                        continue;
                    }

                    player.animationNext = Utility.getBitMask(data, offset, 4);
                    offset += 4;
                }
            }

            this.players[this.playerCount++] = player;
        }

        let playerCount = 0;

        while (offset + 24 < size * 8) {
            const serverIndex = Utility.getBitMask(data, offset, 11);
            offset += 11;

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

            const isPlayerKnown = Utility.getBitMask(data, offset, 1);
            offset++;

            const x = (this.localRegionX + areaX) * this.magicLoc + 64;
            const y = (this.localRegionY + areaY) * this.magicLoc + 64;

            this.createPlayer(serverIndex, x, y, sprite);

            if (isPlayerKnown === 0) {
                this.playerServerIndexes[playerCount++] = serverIndex;
            }
        }

        if (playerCount > 0) {
            this.packetStream.newPacket(clientOpcodes.KNOWN_PLAYERS);
            this.packetStream.putShort(playerCount);

            for (let i = 0; i < playerCount; i++) {
                const player = this.playerServer[this.playerServerIndexes[i]];

                this.packetStream.putShort(player.serverIndex);
                this.packetStream.putShort(player.serverId);
            }

            this.packetStream.sendPacket();
            playerCount = 0;
        }
    }
};
