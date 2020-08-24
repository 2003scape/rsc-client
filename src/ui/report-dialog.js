const Utility = require('../utility');
const clientOpcodes = require('../opcodes/client');

const BLACK = 0;
const ORANGE = 0xff8000;
const WHITE = 0xffffff;
const YELLOW = 0xffff00;

const DIALOG_X = 56;
const DIALOG_Y = 35;
const WIDTH = 400;
const HEIGHT = 290;

const INPUT_DIALOG_Y = DIALOG_Y + 95;
const INPUT_HEIGHT = 100;

const RULES = [
    'Offensive language',
    'Item scamming',
    'Password scamming',
    'Bug abuse',
    'Jagex Staff impersonation',
    'Account sharing/trading',
    'Macroing',
    'Mutiple logging in',
    'Encouraging others to break rules',
    'Misuse of customer support',
    'Advertising / website',
    'Real world item trading'
];

function drawDialogReportAbuse() {
    this.reportAbuseOffence = 0;
    let y = 135;

    for (let i = 0; i < 12; i++) {
        if (this.mouseX > 66 && this.mouseX < 446 && this.mouseY >= y - 12 &&
            this.mouseY < y + 3) {
            this.reportAbuseOffence = i + 1;
        }

        y += 14;
    }

    if (this.mouseButtonClick !== 0 && this.reportAbuseOffence !== 0) {
        this.mouseButtonClick = 0;
        this.showDialogReportAbuseStep = 2;
        this.inputTextCurrent = '';
        this.inputTextFinal = '';
        return;
    }

    y += 15;

    if (this.mouseButtonClick !== 0) {
        this.mouseButtonClick = 0;

        if (this.mouseX < DIALOG_X || this.mouseY < DIALOG_Y ||
            this.mouseX > 456 || this.mouseY > 325) {
            this.showDialogReportAbuseStep = 0;
            return;
        }

        if (this.mouseX > 66 && this.mouseX < 446 && this.mouseY >= y - 15 &&
            this.mouseY < y + 5) {
            this.showDialogReportAbuseStep = 0;
            return;
        }
    }

    this.surface.drawBox(DIALOG_X, DIALOG_Y, WIDTH, HEIGHT, BLACK);
    this.surface.drawBoxEdge(DIALOG_X, DIALOG_Y, WIDTH, HEIGHT, WHITE);

    y = 50;

    this.surface.drawStringCenter('This form is for reporting players ' +
        'who are breaking our rules', 256, y, 1, WHITE);
    y += 15;
    this.surface.drawStringCenter('Using it sends a snapshot of the last 60 ' +
        'secs of activity to us' , 256, y, 1, WHITE);
    y += 15;
    this.surface.drawStringCenter('If you misuse this form you will be banned',
        256, y, 1, ORANGE);
    y += 25;
    this.surface.drawStringCenter('First indicate which of our 12 rules is ' +
        'being broken. For a detailed', 256, y, 1, YELLOW);
    y += 15;
    this.surface.drawStringCenter('explanation of each rule please read the ' +
        'manual on our website.', 256, y, 1, YELLOW);
    y += 15;

    for (let i = 1; i < RULES.length + 1; i += 1) {
        let textColour = 0;

        // draw the box that highlights the string
        if (this.reportAbuseOffence === i) {
            this.surface.drawBoxEdge(66, y - 12, 380, 15, WHITE);
            textColour = ORANGE;
        } else {
            textColour = WHITE;
        }

        const rule = RULES[i - 1];
        this.surface.drawStringCenter(`${i}: ${rule}`, 256, y, 1, textColour);
        y += 14;
    }

    y += 15;

    let textColour = WHITE;

    if (this.mouseX > 196 && this.mouseX < 316 && this.mouseY > y - 15 &&
        this.mouseY < y + 5) {
        textColour = YELLOW;
    }

    this.surface.drawStringCenter('Click here to cancel', 256, y, 1,
        textColour);
}

function drawDialogReportAbuseInput() {
    if (this.inputTextFinal.length > 0) {
        const username = this.inputTextFinal.trim();

        this.inputTextCurrent = '';
        this.inputTextFinal = '';

        if (username.length > 0) {
            const encodedUsername = Utility.usernameToHash(username);

            this.packetStream.newPacket(clientOpcodes.REPORT_ABUSE);
            this.packetStream.putLong(encodedUsername);
            this.packetStream.putByte(this.reportAbuseOffence);
            this.packetStream.putByte(this.reportAbuseMute ? 1 : 0);
            this.packetStream.sendPacket();
        }

        this.showDialogReportAbuseStep = 0;
        return;
    }

    this.surface.drawBox(DIALOG_X, INPUT_DIALOG_Y, WIDTH, INPUT_HEIGHT, BLACK);
    this.surface.drawBoxEdge(DIALOG_X, INPUT_DIALOG_Y, WIDTH, INPUT_HEIGHT,
        WHITE);

    let y = INPUT_DIALOG_Y + 30;

    this.surface.drawStringCenter('Now type the name of the offending ' +
        'player, and press enter', 256, y, 1, YELLOW);
    y += 18;
    this.surface.drawStringCenter(`Name: ${this.inputTextCurrent}*`,
        256, y, 4, WHITE);

    if (this.moderatorLevel > 0) {
        y = INPUT_DIALOG_Y + 77;

        let textColour = WHITE;
        let toggleText = 'OFF';

        if (this.reportAbuseMute) {
            textColour = ORANGE;
            toggleText = 'ON';
        }

        this.surface.drawStringCenter('Moderator option: Mute player for 48 ' +
            `hours: <${toggleText}>`, 256, y, 1, textColour);

        if (this.mouseX > 106 && this.mouseX < 406 && this.mouseY > y - 13
            && this.mouseY < y + 2 && this.mouseButtonClick === 1) {
            this.mouseButtonClick = 0;
            this.reportAbuseMute = !this.reportAbuseMute;
        }
    }

    y = 222;

    let textColour = WHITE;

    if (this.mouseX > 196 && this.mouseX < 316 && this.mouseY > y - 13 &&
        this.mouseY < y + 2) {
        textColour = YELLOW;

        if (this.mouseButtonClick === 1) {
            this.mouseButtonClick = 0;
            this.showDialogReportAbuseStep = 0;
        }
    }

    this.surface.drawStringCenter('Click here to cancel', 256, y, 1,
        textColour);

    if (this.mouseButtonClick === 1 && (this.mouseX < DIALOG_X ||
        this.mouseX > 456 || this.mouseY < 130 || this.mouseY > 230)) {
        this.mouseButtonClick = 0;
        this.showDialogReportAbuseStep = 0;
    }
}

module.exports.drawDialogReportAbuse = drawDialogReportAbuse;
module.exports.drawDialogReportAbuseInput = drawDialogReportAbuseInput;
module.exports.reportAbuseMute = false;
module.exports.reportAbuseOffence = 0;
module.exports.showDialogReportAbuseStep = 0;
