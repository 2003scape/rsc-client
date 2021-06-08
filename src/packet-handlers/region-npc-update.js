const ChatMessage = require('../chat-message');
const GameData = require('../game-data');
const Utility = require('../utility');
const serverOpcodes = require('../opcodes/server.json');

module.exports = {
    [serverOpcodes.REGION_NPC_UPDATE]: function (data) {
        const length = Utility.getUnsignedShort(data, 1);

        let offset = 3;

        for (let i = 0; i < length; i++) {
            const serverIndex = Utility.getUnsignedShort(data, offset);
            offset += 2;

            const npc = this.npcsServer[serverIndex];
            const updateType = Utility.getUnsignedByte(data[offset++]);

            if (updateType === 1) {
                // chat message
                const targetIndex = Utility.getUnsignedShort(data, offset);
                offset += 2;

                const encodedLength = data[offset++];

                if (npc !== null) {
                    const message = ChatMessage.descramble(
                        data,
                        offset,
                        encodedLength
                    );

                    npc.messageTimeout = 150;
                    npc.message = message;

                    if (targetIndex === this.localPlayer.serverIndex) {
                        this.showMessage(
                            `@yel@${GameData.npcName[npc.npcId]}: ` +
                                npc.message,
                            5
                        );
                    }
                }

                offset += encodedLength;
            } else if (updateType === 2) {
                // damage
                const damageTaken = Utility.getUnsignedByte(data[offset++]);
                const currentHealth = Utility.getUnsignedByte(data[offset++]);
                const maxHealth = Utility.getUnsignedByte(data[offset++]);

                if (npc !== null) {
                    npc.damageTaken = damageTaken;
                    npc.healthCurrent = currentHealth;
                    npc.healthMax = maxHealth;
                    npc.combatTimer = 200;
                }
            }
        }
    }
};
