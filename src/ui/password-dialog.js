const BLACK = 0;
const WHITE = 0xffffff;

const DIALOG_X = 106;
const DIALOG_Y = 150;

const WIDTH = 300;
const HEIGHT = 60;

function drawDialogChangePassword() {
    if (this.mouseButtonClick !== 0) {
        this.mouseButtonClick = 0;

        if (
            this.mouseX < DIALOG_X ||
            this.mouseY < DIALOG_Y ||
            this.mouseX > WIDTH + DIALOG_X  ||
            this.mouseY > HEIGHT + DIALOG_Y
        ) {
            this.showChangePasswordStep = 0;
            return;
        }
    }

    this.surface.drawBox(DIALOG_X, DIALOG_Y, WIDTH, HEIGHT, BLACK);
    this.surface.drawBoxEdge(DIALOG_X, DIALOG_Y, WIDTH, HEIGHT, WHITE);

    let y = DIALOG_Y + 22;
    let passwordInput = '';

    if (this.showChangePasswordStep === 6) {
        this.surface.drawStringCenter(
            'Please enter your current password',
            256,
            y,
            4,
            WHITE
        );

        y += 25;

        passwordInput = '*';

        for (let i = 0; i < this.inputTextCurrent.length; i++) {
            passwordInput = 'X' + passwordInput;
        }

        this.surface.drawStringCenter(passwordInput, 256, y, 4, WHITE);

        if (this.inputTextFinal.length > 0) {
            this.changePasswordOld = this.inputTextFinal;
            this.inputTextCurrent = '';
            this.inputTextFinal = '';
            this.showChangePasswordStep = 1;
            return;
        }
    } else if (this.showChangePasswordStep === 1) {
        this.surface.drawStringCenter(
            'Please enter your new password',
            256,
            y,
            4,
            WHITE
        );

        y += 25;

        passwordInput = '*';

        for (let i = 0; i < this.inputTextCurrent.length; i++) {
            passwordInput = 'X' + passwordInput;
        }

        this.surface.drawStringCenter(passwordInput, 256, y, 4, WHITE);

        if (this.inputTextFinal.length > 0) {
            this.changePasswordNew = this.inputTextFinal;
            this.inputTextCurrent = '';
            this.inputTextFinal = '';

            if (this.changePasswordNew.length >= 5) {
                this.showChangePasswordStep = 2;
                return;
            }

            this.showChangePasswordStep = 5;
            return;
        }
    } else if (this.showChangePasswordStep == 2) {
        this.surface.drawStringCenter(
            'Enter password again to confirm',
            256,
            y,
            4,
            WHITE
        );

        y += 25;

        passwordInput = '*';

        for (let i = 0; i < this.inputTextCurrent.length; ++i) {
            passwordInput = 'X' + passwordInput;
        }

        this.surface.drawStringCenter(passwordInput, 256, y, 4, WHITE);

        if (this.inputTextFinal.length > 0) {
            if (
                this.inputTextFinal.toLowerCase() ===
                this.changePasswordNew.toLowerCase()
            ) {
                this.showChangePasswordStep = 4;
                this.changePassword(
                    this.changePasswordOld,
                    this.changePasswordNew
                );
                return;
            }

            this.showChangePasswordStep = 3;
            return;
        }
    } else {
        if (this.showChangePasswordStep === 3) {
            this.surface.drawStringCenter(
                'Passwords do not match!',
                256,
                y,
                4,
                WHITE
            );

            y += 25;

            this.surface.drawStringCenter(
                'Press any key to close',
                256,
                y,
                4,
                WHITE
            );

            return;
        }

        if (this.showChangePasswordStep === 4) {
            this.surface.drawStringCenter(
                'Ok, your request has been sent',
                256,
                y,
                4,
                WHITE
            );

            y += 25;

            this.surface.drawStringCenter(
                'Press any key to close',
                256,
                y,
                4,
                WHITE
            );

            return;
        }

        if (this.showChangePasswordStep === 5) {
            this.surface.drawStringCenter(
                'Password must be at',
                256,
                y,
                4,
                WHITE
            );
            y += 25;
            this.surface.drawStringCenter(
                'least 5 letters long',
                256,
                y,
                4,
                WHITE
            );
        }
    }
}

module.exports = {
    drawDialogChangePassword,
    showChangePasswordStep: 0
};
