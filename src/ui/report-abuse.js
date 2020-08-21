const ORANGE = 0xff8000;
const WHITE = 0xffffff;
const YELLOW = 0xffff00;

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

        if (this.mouseX < 56 || this.mouseY < 35 || this.mouseX > 456 ||
            this.mouseY > 325) {
            this.showDialogReportAbuseStep = 0;
            return;
        }

        if (this.mouseX > 66 && this.mouseX < 446 && this.mouseY >= y - 15 &&
            this.mouseY < y + 5) {
            this.showDialogReportAbuseStep = 0;
            return;
        }
    }

    this.surface.drawBox(56, 35, 400, 290, 0);
    this.surface.drawBoxEdge(56, 35, 400, 290, WHITE);

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

module.exports.drawDialogReportAbuse = drawDialogReportAbuse;
module.exports.reportAbuseMute = false;
module.exports.reportAbuseOffence = 0;
module.exports.showDialogReportAbuseStep = 0;
