const ChatMessage = require('./chat-message');
const Color = require('./lib/graphics/color');
const Font = require('./lib/graphics/font');
const GameShell = require('./game-shell');
const Long = require('long');
const PacketStream = require('./packet-stream');
const Utility = require('./utility');
const WordFilter = require('./word-filter');
const clientOpcodes = require('./opcodes/client');
const serverOpcodes = require('./opcodes/server');
const sleep = require('sleep-promise');

function fromCharArray(a) {
    return Array.from(a)
        .map((c) => String.fromCharCode(c))
        .join('');
}

class GameConnection extends GameShell {
    constructor(canvas) {
        super(canvas);

        this.packetStream = null;
        this.friendListCount = 0;
        this.ignoreListCount = 0;
        this.settingsBlockChat = 0;
        this.settingsBlockPrivate = 0;
        this.settingsBlockTrade = 0;
        this.settingsBlockDuel = 0;
        this.sessionID = new Long(0);
        this.worldFullTimeout = 0;
        this.moderatorLevel = 0;
        this.autoLoginTImeout = 0;
        this.packetLastRead = 0;
        this.messageIndex = 0;

        this.server = '127.0.0.1';
        this.port = 43594;
        this.username = '';
        this.password = '';
        this.incomingPacket = new Int8Array(5000);
        this.incomingPacket = new Int8Array(5000);

        this.friendListHashes = [];

        for (let i = 0; i < 200; i += 1) {
            this.friendListHashes.push(new Long(0));
        }

        this.friendListOnline = new Int32Array(200);
        this.ignoreList = [];

        for (let i = 0; i < GameConnection.maxSocialListSize; i += 1) {
            this.ignoreList.push(new Long(0));
        }

        this.messageTokens = new Int32Array(GameConnection.maxSocialListSize);
    }

    async register(username, password) {
        if (this.worldFullTimeout > 0) {
            this.showLoginScreenStatus(
                'Please wait...',
                'Connecting to server'
            );

            await sleep(2000);

            this.showLoginScreenStatus(
                'Sorry! The server is currently full.',
                'Please try again later'
            );

            return;
        }

        try {
            username = Utility.formatAuthString(username, 20);
            password = Utility.formatAuthString(password, 20);

            this.showLoginScreenStatus(
                'Please wait...',
                'Connecting to server'
            );

            this.packetStream = new PacketStream(
                await this.createSocket(this.server, this.port),
                this
            );

            const encodedUsername = Utility.usernameToHash(username);
            this.packetStream.newPacket(clientOpcodes.SESSION);
            this.packetStream.putByte(
                encodedUsername.shiftRight(16).and(31).toInt()
            );
            this.packetStream.flushPacket();

            const sessionID = await this.packetStream.getLong();
            this.sessionID = sessionID;

            if (sessionID.equals(0)) {
                this.showLoginScreenStatus(
                    'Login server offline.',
                    'Please try again in a few mins'
                );
                return;
            }

            console.log('Verb: Session id: ' + sessionID);

            this.packetStream.newPacket(clientOpcodes.REGISTER);
            this.packetStream.putShort(GameConnection.clientVersion);
            this.packetStream.putString(username);
            this.packetStream.putString(password);
            this.packetStream.flushPacket();

            const response = await this.packetStream.readStream();

            this.packetStream.closeStream();

            console.log('Newplayer response: ' + response);

            switch (response) {
                case 2: // success
                    this.resetLoginVars();
                    return;
                case 13: // username taken
                case 3:
                    this.showLoginScreenStatus(
                        'Username already taken.',
                        'Please choose another username'
                    );
                    return;
                case 4: // username in use. distinction??
                    this.showLoginScreenStatus(
                        'That username is already in use.',
                        'Wait 60 seconds then retry'
                    );
                    return;
                case 5: // client has been updated
                    this.showLoginScreenStatus(
                        'The client has been updated.',
                        'Please reload this page'
                    );
                    return;
                case 6: // IP in use
                    this.showLoginScreenStatus(
                        'You may only use 1 character at once.',
                        'Your ip-address is already in use'
                    );
                    return;
                case 7: // spam throttle was hit
                    this.showLoginScreenStatus(
                        'Login attempts exceeded!',
                        'Please try again in 5 minutes'
                    );
                    return;
                case 11: // temporary ban
                    this.showLoginScreenStatus(
                        'Account has been temporarily disabled',
                        'for cheating or abuse'
                    );
                    return;
                case 12: // permanent ban
                    this.showLoginScreenStatus(
                        'Account has been permanently disabled',
                        'for cheating or abuse'
                    );
                    return;
                case 14: // server full
                    this.showLoginScreenStatus(
                        'Sorry! The server is currently full.',
                        'Please try again later'
                    );
                    this.worldFullTimeout = 1500;
                    return;
                case 15: // members account needed
                    this.showLoginScreenStatus(
                        'You need a members account',
                        'to login to this server'
                    );
                    return;
                case 16: // switch to members server
                    this.showLoginScreenStatus(
                        'Please login to a members server',
                        'to access member-only features'
                    );
                    return;
                default:
                    this.showLoginScreenStatus(
                        'Error unable to create username.',
                        'Unrecognised response code'
                    );
                    return;
            }
        } catch (e) {
            console.error(e);

            this.showLoginScreenStatus(
                'Error unable to create user.',
                'Unrecognised response code'
            );
        }
    }

    async login(username, password, reconnecting) {
        if (this.worldFullTimeout > 0) {
            this.showLoginScreenStatus(
                'Please wait...',
                'Connecting to server'
            );

            await sleep(2000);

            this.showLoginScreenStatus(
                'Sorry! The server is currently full.',
                'Please try again later'
            );
            return;
        }

        try {
            this.username = username;
            username = Utility.formatAuthString(username, 20);

            this.password = password;
            password = Utility.formatAuthString(password, 20);

            if (username.trim().length === 0) {
                this.showLoginScreenStatus(
                    'You must enter both a username',
                    'and a password - Please try again'
                );
                return;
            }

            if (reconnecting) {
                this.drawTextBox(
                    'Connection lost! Please wait...',
                    'Attempting to re-establish'
                );
            } else {
                this.showLoginScreenStatus(
                    'Please wait...',
                    'Connecting to server'
                );
            }

            this.packetStream = new PacketStream(
                await this.createSocket(this.server, this.port),
                this
            );
            this.packetStream.maxReadTries = GameConnection.maxReadTries;

            const encodedUsername = Utility.usernameToHash(username);
            this.packetStream.newPacket(clientOpcodes.SESSION);
            this.packetStream.putByte(
                encodedUsername.shiftRight(16).and(31).toInt()
            );
            this.packetStream.flushPacket();

            const sessionID = await this.packetStream.getLong();
            this.sessionID = sessionID;

            if (sessionID.equals(0)) {
                this.showLoginScreenStatus(
                    'Login server offline.',
                    'Please try again in a few mins'
                );
                return;
            }

            console.log('Verb: Session id: ' + sessionID);

            const keys = new Int32Array(4);
            keys[0] = (Math.random() * 99999999) | 0;
            keys[1] = (Math.random() * 99999999) | 0;
            keys[2] = sessionID.shiftRight(32).toInt();
            keys[3] = sessionID.toInt();

            this.packetStream.newPacket(clientOpcodes.LOGIN);

            this.packetStream.putByte(+reconnecting);
            this.packetStream.putShort(GameConnection.clientVersion);
            this.packetStream.putByte(0); // limit30

            this.packetStream.putByte(10);
            this.packetStream.putInt(keys[0]);
            this.packetStream.putInt(keys[1]);
            this.packetStream.putInt(keys[2]);
            this.packetStream.putInt(keys[3]);
            this.packetStream.putInt(0); // uuid
            this.packetStream.putString(username);
            this.packetStream.putString(password);

            this.packetStream.flushPacket();
            //this.packetStream.seedIsaac(ai);

            const response = await this.packetStream.readStream();
            console.log('login response:' + response);

            if (response === 25) {
                this.moderatorLevel = 1;
                this.autoLoginTimeout = 0;
                this.resetGame();
                return;
            } else if (response === 0) {
                this.moderatorLevel = 0;
                this.autoLoginTimeout = 0;
                this.resetGame();
                return;
            } else if (response === 1) {
                this.autoLoginTimeout = 0;
                return;
            }

            if (reconnecting) {
                username = '';
                password = '';
                this.resetLoginVars();
                return;
            }

            switch (response) {
                case -1:
                    this.showLoginScreenStatus(
                        'Error unable to login.',
                        'Server timed out'
                    );
                    return;
                case 3:
                    this.showLoginScreenStatus(
                        'Invalid username or password.',
                        'Try again, or create a new account'
                    );
                    return;
                case 4:
                    this.showLoginScreenStatus(
                        'That username is already logged in.',
                        'Wait 60 seconds then retry'
                    );
                    return;
                case 5:
                    this.showLoginScreenStatus(
                        'The client has been updated.',
                        'Please reload this page'
                    );
                    return;
                case 6:
                    this.showLoginScreenStatus(
                        'You may only use 1 character at once.',
                        'Your ip-address is already in use'
                    );
                    return;
                case 7:
                    this.showLoginScreenStatus(
                        'Login attempts exceeded!',
                        'Please try again in 5 minutes'
                    );
                    return;
                case 8:
                    this.showLoginScreenStatus(
                        'Error unable to login.',
                        'Server rejected session'
                    );
                    return;
                case 9:
                    this.showLoginScreenStatus(
                        'Error unable to login.',
                        'Loginserver rejected session'
                    );
                    return;
                case 10:
                    this.showLoginScreenStatus(
                        'That username is already in use.',
                        'Wait 60 seconds then retry'
                    );
                    return;
                case 11:
                    this.showLoginScreenStatus(
                        'Account temporarily disabled.',
                        'Check your message inbox for details'
                    );
                    return;
                case 12:
                    this.showLoginScreenStatus(
                        'Account permanently disabled.',
                        'Check your message inbox for details'
                    );
                    return;
                case 14:
                    this.showLoginScreenStatus(
                        'Sorry! This world is currently full.',
                        'Please try a different world'
                    );
                    this.worldFullTimeout = 1500;
                    return;
                case 15:
                    this.showLoginScreenStatus(
                        'You need a members account',
                        'to login to this world'
                    );
                    return;
                case 16:
                    this.showLoginScreenStatus(
                        'Error - no reply from loginserver.',
                        'Please try again'
                    );
                    return;
                case 17:
                    this.showLoginScreenStatus(
                        'Error - failed to decode profile.',
                        'Contact customer support'
                    );
                    return;
                case 18:
                    this.showLoginScreenStatus(
                        'Account suspected stolen.',
                        "Press 'recover a locked account' on front page."
                    );
                    return;
                case 20:
                    this.showLoginScreenStatus(
                        'Error - loginserver mismatch',
                        'Please try a different world'
                    );
                    return;
                case 21:
                    this.showLoginScreenStatus(
                        'Unable to login.',
                        'That is not an RS-Classic account'
                    );
                    return;
                case 22:
                    this.showLoginScreenStatus(
                        'Password suspected stolen.',
                        "Press 'change your password' on front page."
                    );
                    return;
                default:
                    this.showLoginScreenStatus(
                        'Error unable to login.',
                        'Unrecognised response code'
                    );
                    return;
            }
        } catch (e) {
            console.error(e);
        }

        if (this.autoLoginTimeout > 0) {
            await sleep(5000);
            this.autoLoginTimeout--;
            await this.login(this.username, this.password, reconnecting);
        }

        if (reconnecting) {
            this.username = '';
            this.password = '';
            this.resetLoginVars();
        } else {
            this.showLoginScreenStatus(
                'Sorry! Unable to connect.',
                'Check internet settings or try another world'
            );
        }
    }

    async recoverAttempt(username) {
        this.showLoginScreenStatus('Please wait...', 'Connecting to server');

        try {
            this.packetStream = new PacketStream(
                await this.createSocket(this.server, this.port),
                this
            );
            this.packetStream.maxReadTries = this.maxReadTries;
            this.packetStream.newPacket();
            this.packetStream.putLong(Utility.usernameToHash(username));
            this.packetStream.flushPacket();

            const response = await this.packetStream.readStream();
            console.log('Getpq response: ' + response);

            if (response === 0) {
                this.showLoginScreenStatus(
                    'Sorry, the recovery questions for this user have not ' +
                        'been set',
                    ''
                );
                return;
            }

            for (let i = 0; i < 5; i++) {
                const length = await this.packetStream.readStream();

                if (length < 0) {
                    throw new Error('invalid recovery question length');
                }

                const buffer = new Int8Array(length);
                await this.packetStream.readBytes(length, buffer);
                const question = fromCharArray(buffer.slice(0, length));

                this.panelRecoverUser.updateText(
                    this.controlRecoverQuestions[i],
                    question
                );
            }

            if (this.recentRecoverFail) {
                this.showLoginScreenStatus(
                    'Sorry, you have already attempted 1 recovery, try again ' +
                        'later',
                    ''
                );
                return;
            }

            this.loginScreen = 3;
            this.panelRecoverUser.updateText(
                this.controlRecoverInfo1,
                '@yel@To prove this is your account please provide the ' +
                    'answers to'
            );
            this.panelRecoverUser.updateText(
                this.controlRecoverInfo2,
                '@yel@your security questions. You will then be able to ' +
                    'reset your password'
            );

            for (let i = 0; i < 5; i++) {
                this.panelRecoverUser.updateText(
                    this.controlRecoverAnswers[i],
                    ''
                );
            }

            this.panelRecoverUser.updateText(
                this.controlRecoverOldPassword,
                ''
            );
            this.panelRecoverUser.updateText(
                this.controlRecoverNewPassword,
                ''
            );
            this.panelRecoverUser.updateText(
                this.controlRecoverConfirmPassword,
                ''
            );
        } catch (e) {
            console.error(e);
            this.showLoginScreenStatus(
                'Sorry! Unable to connect.',
                'Check leternet settings or try another world'
            );
            return;
        }
    }

    closeConnection() {
        if (this.packetStream !== null) {
            try {
                this.packetStream.newPacket(clientOpcodes.CLOSE_CONNECTION);
                this.packetStream.flushPacket();
            } catch (e) {
                console.error(e);
            }
        }

        this.username = '';
        this.password = '';

        this.resetLoginVars();
    }

    async lostConnection() {
        try {
            throw new Error('');
        } catch (e) {
            console.error(e);
        }

        this.autoLoginTimeout = 10;
        await this.login(this.username, this.password, true);
    }

    drawTextBox(s, s1) {
        const graphics = this.getGraphics();
        const font = new Font('Helvetica', 1, 15);
        const width = 512;
        const height = 344;

        graphics.setColor(Color.black);
        graphics.fillRect(
            ((width / 2) | 0) - 140,
            ((height / 2) | 0) - 25,
            280,
            50
        );
        graphics.setColor(Color.white);
        graphics.drawRect(
            ((width / 2) | 0) - 140,
            ((height / 2) | 0) - 25,
            280,
            50
        );

        this.drawString(
            graphics,
            s,
            font,
            (width / 2) | 0,
            ((height / 2) | 0) - 10
        );
        this.drawString(
            graphics,
            s1,
            font,
            (width / 2) | 0,
            ((height / 2) | 0) + 10
        );
    }

    async checkConnection() {
        const timestamp = Date.now();

        if (this.packetStream.hasPacket()) {
            this.packetLastRead = timestamp;
        }

        if (timestamp - this.packetLastRead > 5000) {
            this.packetLastRead = timestamp;
            this.packetStream.newPacket(clientOpcodes.PING);
            this.packetStream.sendPacket();
        }

        try {
            this.packetStream.writePacket(20);
        } catch (e) {
            await this.lostConnection();
            return;
        }

        const length = await this.packetStream.readPacket(this.incomingPacket);

        if (length > 0) {
            const type = this.packetStream.isaacCommand(
                this.incomingPacket[0] & 0xff
            );

            this.handlePacket(type, type, length);
        }
    }

    handlePacket(opcode, ptype, psize) {
        console.log('opcode:' + opcode + ' psize:' + psize);

        if (opcode === serverOpcodes.MESSAGE) {
            const message = fromCharArray(this.incomingPacket.slice(1, psize));
            this.showServerMessage(message);
        }

        if (opcode === serverOpcodes.CLOSE_CONNECTION) {
            this.closeConnection();
        }

        if (opcode === serverOpcodes.LOGOUT_DENY) {
            this.cantLogout();
            return;
        }

        if (opcode === serverOpcodes.FRIEND_LIST) {
            this.friendListCount = Utility.getUnsignedByte(
                this.incomingPacket[1]
            );

            for (let i = 0; i < this.friendListCount; i++) {
                this.friendListHashes[i] = Utility.getUnsignedLong(
                    this.incomingPacket,
                    2 + i * 9
                );
                this.friendListOnline[i] = Utility.getUnsignedByte(
                    this.incomingPacket[10 + i * 9]
                );
            }

            this.sortFriendsList();

            return;
        }

        if (opcode === serverOpcodes.FRIEND_STATUS_CHANGE) {
            const encodedUsername = Utility.getUnsignedLong(
                this.incomingPacket,
                1
            );
            const world = this.incomingPacket[9] & 0xff;

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
                    psize = 0; // not sure what this is for
                    this.sortFriendsList();
                    return;
                }
            }

            this.friendListHashes[this.friendListCount] = encodedUsername;
            this.friendListOnline[this.friendListCount] = world;
            this.friendListCount++;
            this.sortFriendsList();

            return;
        }

        if (opcode === serverOpcodes.IGNORE_LIST) {
            this.ignoreListCount = Utility.getUnsignedByte(
                this.incomingPacket[1]
            );

            for (let i1 = 0; i1 < this.ignoreListCount; i1++) {
                this.ignoreList[i1] = Utility.getUnsignedLong(
                    this.incomingPacket,
                    2 + i1 * 8
                );
            }

            return;
        }

        if (opcode === serverOpcodes.PRIVACY_SETTINGS) {
            this.settingsBlockChat = this.incomingPacket[1];
            this.settingsBlockPrivate = this.incomingPacket[2];
            this.settingsBlockTrade = this.incomingPacket[3];
            this.settingsBlockDuel = this.incomingPacket[4];

            return;
        }

        if (opcode === serverOpcodes.FRIEND_MESSAGE) {
            const from = Utility.getUnsignedLong(this.incomingPacket, 1);
            const token = Utility.getUnsignedInt(this.incomingPacket, 9);

            for (let i = 0; i < this.maxSocialListSize; i++) {
                if (this.messageTokens[i] === token) {
                    return;
                }
            }

            this.messageTokens[this.messageIndex] = token;
            this.messageIndex =
                (this.messageIndex + 1) % GameConnection.maxSocialListSize;

            let message = ChatMessage.descramble(
                this.incomingPacket,
                13,
                psize - 13
            );

            if (this.options.wordFilter) {
                message = WordFilter.filter(message);
            }

            this.showServerMessage(
                `@pri@${Utility.hashToUsername(from)}: tells you ${message}`
            );

            return;
        } else {
            this.handleIncomingPacket(
                opcode,
                ptype,
                psize,
                this.incomingPacket
            );
            return;
        }
    }

    sortFriendsList() {
        let flag = true;

        while (flag) {
            flag = false;

            for (let i = 0; i < this.friendListCount - 1; i++) {
                if (
                    (this.friendListOnline[i] !== 255 &&
                        this.friendListOnline[i + 1] === 255) ||
                    (this.friendListOnline[i] === 0 &&
                        this.friendListOnline[i + 1] !== 0)
                ) {
                    const onlineStatus = this.friendListOnline[i];
                    this.friendListOnline[i] = this.friendListOnline[i + 1];
                    this.friendListOnline[i + 1] = onlineStatus;

                    const encodedUsername = this.friendListHashes[i];
                    this.friendListHashes[i] = this.friendListHashes[i + 1];
                    this.friendListHashes[i + 1] = encodedUsername;

                    flag = true;
                }
            }
        }
    }

    sendPrivacySettings(chat, privateChat, trade, duel) {
        this.packetStream.newPacket(clientOpcodes.SETTINGS_PRIVACY);
        this.packetStream.putByte(chat);
        this.packetStream.putByte(privateChat);
        this.packetStream.putByte(trade);
        this.packetStream.putByte(duel);
        this.packetStream.sendPacket();
    }

    ignoreAdd(username) {
        const encodedUsername = Utility.usernameToHash(username);

        this.packetStream.newPacket(clientOpcodes.IGNORE_ADD);
        this.packetStream.putLong(encodedUsername);
        this.packetStream.sendPacket();

        for (let i = 0; i < this.ignoreListCount; i++) {
            if (this.ignoreList[i].equals(encodedUsername)) {
                return;
            }
        }

        if (this.ignoreListCount >= GameConnection.maxSocialListSize) {
            return;
        } else {
            this.ignoreList[this.ignoreListCount++] = encodedUsername;
            return;
        }
    }

    ignoreRemove(encodedUsername) {
        this.packetStream.newPacket(clientOpcodes.IGNORE_REMOVE);
        this.packetStream.putLong(encodedUsername);
        this.packetStream.sendPacket();

        for (let i = 0; i < this.ignoreListCount; i++) {
            if (this.ignoreList[i].equals(encodedUsername)) {
                this.ignoreListCount--;

                for (let j = i; j < this.ignoreListCount; j++) {
                    this.ignoreList[j] = this.ignoreList[j + 1];
                }

                return;
            }
        }
    }

    friendAdd(username) {
        this.packetStream.newPacket(clientOpcodes.FRIEND_ADD);
        this.packetStream.putLong(Utility.usernameToHash(username));
        this.packetStream.sendPacket();

        const encodedUsername = Utility.usernameToHash(username);

        for (let i = 0; i < this.friendListCount; i++) {
            if (this.friendListHashes[i].equals(encodedUsername)) {
                return;
            }
        }

        if (this.friendListCount >= GameConnection.maxSocialListSize) {
            return;
        } else {
            this.friendListHashes[this.friendListCount] = encodedUsername;
            this.friendListOnline[this.friendListCount] = 0;
            this.friendListCount++;
            return;
        }
    }

    friendRemove(encodedUsername) {
        this.packetStream.newPacket(clientOpcodes.FRIEND_REMOVE);
        this.packetStream.putLong(encodedUsername);
        this.packetStream.sendPacket();

        for (let i = 0; i < this.friendListCount; i++) {
            if (!this.friendListHashes[i].equals(encodedUsername)) {
                continue;
            }

            this.friendListCount--;

            for (let j = i; j < this.friendListCount; j++) {
                this.friendListHashes[j] = this.friendListHashes[j + 1];
                this.friendListOnline[j] = this.friendListOnline[j + 1];
            }

            break;
        }

        this.showServerMessage(
            `@pri@${Utility.hashToUsername(encodedUsername)} has been ` +
                'removed from your friends list'
        );
    }

    sendPrivateMessage(username, message, length) {
        this.packetStream.newPacket(clientOpcodes.PM);
        this.packetStream.putLong(username);
        this.packetStream.putBytes(message, 0, length);
        this.packetStream.sendPacket();
    }

    sendChatMessage(message, length) {
        this.packetStream.newPacket(clientOpcodes.CHAT);
        this.packetStream.putBytes(message, 0, length);
        this.packetStream.sendPacket();
    }

    sendCommandString(command) {
        this.packetStream.newPacket(clientOpcodes.COMMAND);
        this.packetStream.putString(command);
        this.packetStream.sendPacket();
    }
}

GameConnection.clientVersion = 1;
GameConnection.maxReadTries = 0;
GameConnection.maxSocialListSize = 100;

module.exports = GameConnection;
