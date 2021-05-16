const ChatMessage = require('../chat-message');
const GameConnection = require('../game-connection');
const Utility = require('../utility');
const WordFilter = require('../word-filter');
const serverOpcodes = require('../opcodes/server');

module.exports = {
    [serverOpcodes.FRIEND_LIST]: function (data) {
        this.friendListCount = Utility.getUnsignedByte(data[1]);

        for (let i = 0; i < this.friendListCount; i++) {
            this.friendListHashes[i] = Utility.getUnsignedLong(data, 2 + i * 9);

            this.friendListOnline[i] = Utility.getUnsignedByte(
                data[10 + i * 9]
            );
        }

        this.sortFriendsList();
    },
    [serverOpcodes.FRIEND_STATUS_CHANGE]: function (data) {
        const encodedUsername = Utility.getUnsignedLong(data, 1);
        const world = data[9] & 0xff;

        for (let i = 0; i < this.friendListCount; i++) {
            if (this.friendListHashes[i].equals(encodedUsername)) {
                if (this.friendListOnline[i] === 0 && world !== 0) {
                    this.showServerMessage(
                        `@pri@${Utility.hashToUsername(encodedUsername)} ` +
                            'has logged in'
                    );
                }

                if (this.friendListOnline[i] !== 0 && world === 0) {
                    this.showServerMessage(
                        `@pri@${Utility.hashToUsername(encodedUsername)} ` +
                            'has logged out'
                    );
                }

                this.friendListOnline[i] = world;
                this.sortFriendsList();

                return;
            }
        }

        this.friendListHashes[this.friendListCount] = encodedUsername;
        this.friendListOnline[this.friendListCount] = world;

        this.friendListCount++;

        this.sortFriendsList();
    },
    [serverOpcodes.FRIEND_MESSAGE]: function (data, size) {
        const from = Utility.getUnsignedLong(data, 1);
        const token = Utility.getUnsignedInt(data, 9);

        for (let i = 0; i < this.maxSocialListSize; i++) {
            if (this.messageTokens[i] === token) {
                return;
            }
        }

        this.messageTokens[this.messageIndex] = token;

        this.messageIndex =
            (this.messageIndex + 1) % GameConnection.maxSocialListSize;

        let message = ChatMessage.descramble(data, 13, size - 13);

        if (this.options.wordFilter) {
            message = WordFilter.filter(message);
        }

        this.showServerMessage(
            `@pri@${Utility.hashToUsername(from)}: tells you ${message}`
        );
    },
    [serverOpcodes.IGNORE_LIST]: function (data) {
        this.ignoreListCount = Utility.getUnsignedByte(data[1]);

        for (let i = 0; i < this.ignoreListCount; i++) {
            this.ignoreList[i] = Utility.getUnsignedLong(data, 2 + i * 8);
        }
    }
};
