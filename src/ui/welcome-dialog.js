const ORANGE = 0xff8000;
const RED = 0xff0000;
const WHITE = 0xffffff;
const YELLOW = 0xffff00;

const WIDTH = 400;

function drawDialogWelcome() {
    let height = 65;

    if (this.welcomeRecoverySetDays !== 201) {
        height += 60;
    }

    if (this.welcomeUnreadMessages > 0) {
        height += 60;
    }

    if (this.welcomeLastLoggedInIP !== 0) {
        height += 45;
    }

    let y = 167 - ((height / 2) | 0);

    this.surface.drawBox(56, 167 - ((height / 2) | 0), WIDTH, height, 0);
    this.surface.drawBoxEdge(
        56,
        167 - ((height / 2) | 0),
        WIDTH,
        height,
        WHITE
    );

    y += 20;

    this.surface.drawStringCenter(
        'Welcome to RuneScape ' + this.loginUser,
        256,
        y,
        4,
        YELLOW
    );

    y += 30;

    let daysAgo = null;

    if (this.welcomeLastLoggedInDays === 0) {
        daysAgo = 'earlier today';
    } else if (this.welcomeLastLoggedInDays === 1) {
        daysAgo = 'yesterday';
    } else {
        daysAgo = `${this.welcomeLastLoggedInDays} days ago`;
    }

    if (this.welcomeLastLoggedInIP !== 0) {
        this.surface.drawStringCenter(
            `You last logged in ${daysAgo}`,
            256,
            y,
            1,
            WHITE
        );

        y += 15;

        if (this.welcomeLastLoggedInHost === null) {
            this.welcomeLastLoggedInHost = this.getHostnameIP(
                this.welcomeLastLoggedInIP
            );
        }

        this.surface.drawStringCenter(
            'from: ' + this.welcomeLastLoggedInHost,
            256,
            y,
            1,
            WHITE
        );

        y += 15;
        y += 15;
    }

    if (this.welcomeUnreadMessages > 0) {
        let textColour = WHITE;

        this.surface.drawStringCenter(
            'Jagex staff will NEVER email you. We use the',
            256,
            y,
            1,
            textColour
        );

        y += 15;

        this.surface.drawStringCenter(
            'message-centre on this website instead.',
            256,
            y,
            1,
            textColour
        );

        y += 15;

        if (this.welcomeUnreadMessages === 1) {
            this.surface.drawStringCenter(
                'You have @yel@0@whi@ unread messages in your message-centre',
                256,
                y,
                1,
                WHITE
            );
        } else {
            this.surface.drawStringCenter(
                'You have @gre@' +
                    (this.welcomeUnreadMessages - 1) +
                    ' unread messages @whi@in your message-centre',
                256,
                y,
                1,
                WHITE
            );
        }

        y += 15;
        y += 15;
    }

    if (this.welcomeRecoverySetDays !== 201) {
        if (this.welcomeRecoverySetDays === 200) {
            this.surface.drawStringCenter(
                'You have not yet set any password recovery questions.',
                256,
                y,
                1,
                ORANGE
            );

            y += 15;

            this.surface.drawStringCenter(
                'We strongly recommend you do so now to secure your account.',
                256,
                y,
                1,
                ORANGE
            );

            y += 15;

            this.surface.drawStringCenter(
                "Do this from the 'account management' area on our front " +
                    'webpage',
                256,
                y,
                1,
                ORANGE
            );

            y += 15;
        } else {
            let daysAgo = null;

            if (this.welcomeRecoverySetDays === 0) {
                daysAgo = 'Earlier today';
            } else if (this.welcomeRecoverySetDays === 1) {
                daysAgo = 'Yesterday';
            } else {
                daysAgo = `${this.welcomeRecoverySetDays} days ago`;
            }

            this.surface.drawStringCenter(
                `${daysAgo} you changed your recovery questions`,
                256,
                y,
                1,
                ORANGE
            );

            y += 15;

            this.surface.drawStringCenter(
                'If you do not remember making this change then cancel it ' +
                    'immediately',
                256,
                y,
                1,
                ORANGE
            );

            y += 15;

            this.surface.drawStringCenter(
                "Do this from the 'account management' area on our front " +
                    'webpage',
                256,
                y,
                1,
                ORANGE
            );

            y += 15;
        }

        y += 15;
    }

    let textColour = WHITE;

    if (
        this.mouseY > y - 12 &&
        this.mouseY <= y &&
        this.mouseX > 106 &&
        this.mouseX < 406
    ) {
        textColour = RED;
    }

    this.surface.drawStringCenter(
        'Click here to close window',
        256,
        y,
        1,
        textColour
    );

    if (this.mouseButtonClick === 1) {
        if (textColour === RED) {
            this.showDialogWelcome = false;
        }

        if (
            (this.mouseX < 86 || this.mouseX > 426) &&
            (this.mouseY < 167 - ((height / 2) | 0) ||
                this.mouseY > 167 + ((height / 2) | 0))
        ) {
            this.showDialogWelcome = false;
        }
    }

    this.mouseButtonClick = 0;
}

module.exports = {
    drawDialogWelcome,
    showDialogWelcome: false
};
