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
    return Array.from(a).map(c => String.fromCharCode(c)).join('');
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
        this.anInt630 = 0;

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

        this.anIntArray629 = new Int32Array(GameConnection.maxSocialListSize);
    }

    async login(u, p, reconnecting) {
        if (this.worldFullTimeout > 0) {
            this.showLoginScreenStatus('Please wait...', 'Connecting to server');
            await sleep(2000);
            this.showLoginScreenStatus('Sorry! The server is currently full.', 'Please try again later');
            return;
        }

        try {
            this.username = u;
            u = Utility.formatAuthString(u, 20);

            this.password = p;
            p = Utility.formatAuthString(p, 20);

            if (u.trim().length === 0) {
                this.showLoginScreenStatus('You must enter both a username', 'and a password - Please try again');
                return;
            }

            if (reconnecting) {
                this.drawTextBox('Connection lost! Please wait...', 'Attempting to re-establish');
            } else {
                this.showLoginScreenStatus('Please wait...', 'Connecting to server');
            }

            this.packetStream = new PacketStream(await this.createSocket(this.server, this.port), this);
            this.packetStream.maxReadTries = GameConnection.maxReadTries;

            let l = Utility.usernameToHash(u);

            this.packetStream.newPacket(clientOpcodes.SESSION);
            this.packetStream.putByte(l.shiftRight(16).and(31).toInt());
            this.packetStream.flushPacket();

            let sessId = await this.packetStream.getLong();
            this.sessionID = sessId;

            if (sessId.equals(0)) {
                this.showLoginScreenStatus('Login server offline.', 'Please try again in a few mins');
                return;
            }

            console.log('Verb: Session id: ' + sessId);

            let ai = new Int32Array(4);
            ai[0] = (Math.random() * 99999999) | 0;
            ai[1] = (Math.random() * 99999999) | 0;
            ai[2] = sessId.shiftRight(32).toInt();
            ai[3] = sessId.toInt();

            this.packetStream.newPacket(clientOpcodes.LOGIN);

            if (reconnecting) {
                this.packetStream.putByte(1);
            } else {
                this.packetStream.putByte(0);
            }

            this.packetStream.putShort(GameConnection.clientVersion);
            this.packetStream.putByte(0); // limit30

            this.packetStream.putByte(10);
            this.packetStream.putInt(ai[0]);
            this.packetStream.putInt(ai[1]);
            this.packetStream.putInt(ai[2]);
            this.packetStream.putInt(ai[3]);
            this.packetStream.putInt(0); // uuid
            this.packetStream.putString(u);
            this.packetStream.putString(p);

            this.packetStream.flushPacket();
            //this.packetStream.seedIsaac(ai);

            let resp = await this.packetStream.readStream();
            console.log('login response:' + resp);

            if (resp === 25) {
                this.moderatorLevel = 1;
                this.autoLoginTimeout = 0;
                this.resetGame();
                return;
            }

            if (resp === 0) {
                this.moderatorLevel = 0;
                this.autoLoginTimeout = 0;
                this.resetGame();
                return;
            }

            if (resp === 1) {
                this.autoLoginTimeout = 0;
                return;
            }

            if (reconnecting) {
                u = '';
                p = '';
                this.resetLoginVars();
                return;
            }

            if (resp === -1) {
                this.showLoginScreenStatus('Error unable to login.', 'Server timed out');
                return;
            }

            if (resp === 3) {
                this.showLoginScreenStatus('Invalid username or password.', 'Try again, or create a new account');
                return;
            }

            if (resp === 4) {
                this.showLoginScreenStatus('That username is already logged in.', 'Wait 60 seconds then retry');
                return;
            }

            if (resp === 5) {
                this.showLoginScreenStatus('The client has been updated.', 'Please reload this page');
                return;
            }

            if (resp === 6) {
                this.showLoginScreenStatus('You may only use 1 character at once.', 'Your ip-address is already in use');
                return;
            }

            if (resp === 7) {
                this.showLoginScreenStatus('Login attempts exceeded!', 'Please try again in 5 minutes');
                return;
            }

            if (resp === 8) {
                this.showLoginScreenStatus('Error unable to login.', 'Server rejected session');
                return;
            }

            if (resp === 9) {
                this.showLoginScreenStatus('Error unable to login.', 'Loginserver rejected session');
                return;
            }

            if (resp === 10) {
                this.showLoginScreenStatus('That username is already in use.', 'Wait 60 seconds then retry');
                return;
            }

            if (resp === 11) {
                this.showLoginScreenStatus('Account temporarily disabled.', 'Check your message inbox for details');
                return;
            }

            if (resp === 12) {
                this.showLoginScreenStatus('Account permanently disabled.', 'Check your message inbox for details');
                return;
            }

            if (resp === 14) {
                this.showLoginScreenStatus('Sorry! This world is currently full.', 'Please try a different world');
                this.worldFullTimeout = 1500;
                return;
            }

            if (resp === 15) {
                this.showLoginScreenStatus('You need a members account', 'to login to this world');
                return;
            }

            if (resp === 16) {
                this.showLoginScreenStatus('Error - no reply from loginserver.', 'Please try again');
                return;
            }

            if (resp === 17) {
                this.showLoginScreenStatus('Error - failed to decode profile.', 'Contact customer support');
                return;
            }

            if (resp === 18) {
                this.showLoginScreenStatus('Account suspected stolen.', 'Press \'recover a locked account\' on front page.');
                return;
            }

            if (resp === 20) {
                this.showLoginScreenStatus('Error - loginserver mismatch', 'Please try a different world');
                return;
            }

            if (resp === 21) {
                this.showLoginScreenStatus('Unable to login.', 'That is not an RS-Classic account');
                return;
            }

            if (resp === 22) {
                this.showLoginScreenStatus('Password suspected stolen.', 'Press \'change your password\' on front page.');
                return;
            } else {
                this.showLoginScreenStatus('Error unable to login.', 'Unrecognised response code');
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
            this.showLoginScreenStatus('Sorry! Unable to connect.', 'Check internet settings or try another world');
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
            console.log('loast connection: ');
            console.error(e);
        }

        console.log('Lost connection');
        this.autoLoginTimeout = 10;
        await this.login(this.username, this.password, true);
    }

    drawTextBox(s, s1) {
        let g = this.getGraphics();
        let font = new Font('Helvetica', 1, 15);
        let w = 512;
        let h = 344;
        g.setColor(Color.black);
        g.fillRect(((w / 2) | 0) - 140, ((h / 2) | 0) - 25, 280, 50);
        g.setColor(Color.white);
        g.drawRect(((w / 2) | 0) - 140, ((h / 2) | 0) - 25, 280, 50);
        this.drawString(g, s, font, (w / 2) | 0, ((h / 2) | 0) - 10);
        this.drawString(g, s1, font, (w / 2) | 0, ((h / 2) | 0) + 10);
    }

    async checkConnection() {
        let l = Date.now();

        if (this.packetStream.hasPacket()) {
            this.packetLastRead = l;
        }

        if (l - this.packetLastRead > 5000) {
            this.packetLastRead = l;
            this.packetStream.newPacket(clientOpcodes.PING);
            this.packetStream.sendPacket();
        }

        try {
            this.packetStream.writePacket(20);
        } catch (e) {
            await this.lostConnection();
            return;
        }

        let psize = await this.packetStream.readPacket(this.incomingPacket);

        if (psize > 0) {
            let ptype = this.packetStream.isaacCommand(this.incomingPacket[0] & 0xff);
            this.handlePacket(ptype, ptype, psize);
        }
    }

    handlePacket(opcode, ptype, psize) {
        console.log('opcode:' + opcode + ' psize:' + psize);

        if (opcode === serverOpcodes.MESSAGE) {
            let s = fromCharArray(this.incomingPacket.slice(1, psize));
            this.showServerMessage(s);
        }

        if (opcode === serverOpcodes.CLOSE_CONNECTION) {
            this.closeConnection();
        }

        if (opcode === serverOpcodes.LOGOUT_DENY) {
            this.cantLogout();
            return;
        }

        if (opcode === serverOpcodes.FRIEND_LIST) {
            this.friendListCount = Utility.getUnsignedByte(this.incomingPacket[1]);

            for (let k = 0; k < this.friendListCount; k++) {
                this.friendListHashes[k] = Utility.getUnsignedLong(this.incomingPacket, 2 + k * 9);
                this.friendListOnline[k] = Utility.getUnsignedByte(this.incomingPacket[10 + k * 9]);
            }

            this.sortFriendsList();
            return;
        }

        if (opcode === serverOpcodes.FRIEND_STATUS_CHANGE) {
            let hash = Utility.getUnsignedLong(this.incomingPacket, 1);
            let online = this.incomingPacket[9] & 0xff;

            for (let i2 = 0; i2 < this.friendListCount; i2++) {
                if (this.friendListHashes[i2].equals(hash)) {
                    if (this.friendListOnline[i2] === 0 && online !== 0) {
                        this.showServerMessage('@pri@' + Utility.hashToUsername(hash) + ' has logged in');
                    }

                    if (this.friendListOnline[i2] !== 0 && online === 0) {
                        this.showServerMessage('@pri@' + Utility.hashToUsername(hash) + ' has logged out');
                    }

                    this.friendListOnline[i2] = online;
                    psize = 0; // not sure what this is for
                    this.sortFriendsList();
                    return;
                }
            }

            this.friendListHashes[this.friendListCount] = hash;
            this.friendListOnline[this.friendListCount] = online;
            this.friendListCount++;
            this.sortFriendsList();
            return;
        }

        if (opcode === serverOpcodes.IGNORE_LIST) {
            this.ignoreListCount = Utility.getUnsignedByte(this.incomingPacket[1]);

            for (let i1 = 0; i1 < this.ignoreListCount; i1++) {
                this.ignoreList[i1] = Utility.getUnsignedLong(this.incomingPacket, 2 + i1 * 8);
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
            let from = Utility.getUnsignedLong(this.incomingPacket, 1);
            let k1 = Utility.getUnsignedInt(this.incomingPacket, 9); // is this some sort of message id ?

            for (let j2 = 0; j2 < this.maxSocialListSize; j2++) {
                if (this.anIntArray629[j2] === k1) {
                    return;
                }
            }

            this.anIntArray629[this.anInt630] = k1;
            this.anInt630 = (this.anInt630 + 1) % GameConnection.maxSocialListSize;
            let msg = WordFilter.filter(ChatMessage.descramble(this.incomingPacket, 13, psize - 13));
            this.showServerMessage('@pri@' + Utility.hashToUsername(from) + ': tells you ' + msg);
            return;
        } else {
            this.handleIncomingPacket(opcode, ptype, psize, this.incomingPacket);
            return;
        }
    }

    sortFriendsList() {
        let flag = true;

        while (flag) {
            flag = false;

            for (let i = 0; i < this.friendListCount - 1; i++) {
                if (this.friendListOnline[i] !== 255 && this.friendListOnline[i + 1] === 255 || this.friendListOnline[i] === 0 && this.friendListOnline[i + 1] !== 0) {
                    let j = this.friendListOnline[i];
                    this.friendListOnline[i] = this.friendListOnline[i + 1];
                    this.friendListOnline[i + 1] = j;

                    let l = this.friendListHashes[i];
                    this.friendListHashes[i] = this.friendListHashes[i + 1];
                    this.friendListHashes[i + 1] = l;

                    flag = true;
                }
            }
        }
    }

    sendPrivacySettings(chat, priv, trade, duel) {
        this.packetStream.newPacket(clientOpcodes.SETTINGS_PRIVACY);
        this.packetStream.putByte(chat);
        this.packetStream.putByte(priv);
        this.packetStream.putByte(trade);
        this.packetStream.putByte(duel);
        this.packetStream.sendPacket();
    }

    ignoreAdd(s) {
        let l = Utility.usernameToHash(s);

        this.packetStream.newPacket(clientOpcodes.IGNORE_ADD);
        this.packetStream.putLong(l);
        this.packetStream.sendPacket();

        for (let i = 0; i < this.ignoreListCount; i++) {
            if (this.ignoreList[i].equals(l)) {
                return;
            }
        }

        if (this.ignoreListCount >= GameConnection.maxSocialListSize) {
            return;
        } else {
            this.ignoreList[this.ignoreListCount++] = l;
            return;
        }
    }

    ignoreRemove(l) {
        this.packetStream.newPacket(clientOpcodes.IGNORE_REMOVE);
        this.packetStream.putLong(l);
        this.packetStream.sendPacket();

        for (let i = 0; i < this.ignoreListCount; i++) {
            if (this.ignoreList[i].equals(l)) {
                this.ignoreListCount--;

                for (let j = i; j < this.ignoreListCount; j++) {
                    this.ignoreList[j] = this.ignoreList[j + 1];
                }

                return;
            }
        }
    }

    friendAdd(s) {
        this.packetStream.newPacket(clientOpcodes.FRIEND_ADD);
        this.packetStream.putLong(Utility.usernameToHash(s));
        this.packetStream.sendPacket();

        let l = Utility.usernameToHash(s);

        for (let i = 0; i < this.friendListCount; i++) {
            if (this.friendListHashes[i].equals(l)) {
                return;
            }
        }

        if (this.friendListCount >= GameConnection.maxSocialListSize) {
            return;
        } else {
            this.friendListHashes[this.friendListCount] = l;
            this.friendListOnline[this.friendListCount] = 0;
            this.friendListCount++;
            return;
        }
    }

    friendRemove(l) {
        this.packetStream.newPacket(clientOpcodes.FRIEND_REMOVE);
        this.packetStream.putLong(l);
        this.packetStream.sendPacket();

        for (let i = 0; i < this.friendListCount; i++) {
            if (!this.friendListHashes[i].equals(l)) {
                continue;
            }

            this.friendListCount--;

            for (let j = i; j < this.friendListCount; j++) {
                this.friendListHashes[j] = this.friendListHashes[j + 1];
                this.friendListOnline[j] = this.friendListOnline[j + 1];
            }

            break;
        }

        this.showServerMessage('@pri@' + Utility.hashToUsername(l) + ' has been removed from your friends list');
    }

    sendPrivateMessage(u, buff, len) {
        this.packetStream.newPacket(clientOpcodes.PM);
        this.packetStream.putLong(u);
        this.packetStream.putBytes(buff, 0, len);
        this.packetStream.sendPacket();
    }

    sendChatMessage(buff, len) {
        this.packetStream.newPacket(clientOpcodes.CHAT);
        this.packetStream.putBytes(buff, 0, len);
        this.packetStream.sendPacket();
    }

    sendCommandString(s) {
        this.packetStream.newPacket(clientOpcodes.COMMAND);
        this.packetStream.putString(s);
        this.packetStream.sendPacket();
    }
}

GameConnection.clientVersion = 1;
GameConnection.maxReadTries = 0;
GameConnection.maxSocialListSize = 100;

module.exports = GameConnection;
