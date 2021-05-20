const Panel = require('../panel');

function createLoginPanels() {
    this.panelLoginWelcome = new Panel(this.surface, 50);

    const x = (this.gameWidth / 2) | 0;
    let y = 40;
    const click = this.options.mobile ? 'Tap' : 'Click';

    if (!this.members) {
        this.panelLoginWelcome.addTextCentre(
            x,
            200 + y,
            `${click} on an option`,
            5,
            true
        );

        this.panelLoginWelcome.addButtonBackground(x - 100, 240 + y, 120, 35);

        this.panelLoginWelcome.addTextCentre(
            x - 100,
            240 + y,
            'New User',
            5,
            false
        );

        this.controlWelcomeNewUser = this.panelLoginWelcome.addButton(
            x - 100,
            240 + y,
            120,
            35
        );

        this.panelLoginWelcome.addButtonBackground(x + 100, 240 + y, 120, 35);

        this.panelLoginWelcome.addTextCentre(
            x + 100,
            240 + y,
            'Existing User',
            5,
            false
        );

        this.controlWelcomeExistingUser = this.panelLoginWelcome.addButton(
            x + 100,
            240 + y,
            120,
            35
        );
    } else {
        this.panelLoginWelcome.addTextCentre(
            x,
            200 + y,
            'Welcome to RuneScape',
            4,
            true
        );

        this.panelLoginWelcome.addTextCentre(
            x,
            215 + y,
            'You need a members account to use this server',
            4,
            true
        );

        this.panelLoginWelcome.addButtonBackground(x, 250 + y, 200, 35);

        this.panelLoginWelcome.addTextCentre(
            x,
            250 + y,
            `${click} here to login`,
            5,
            false
        );

        this.controlWelcomeExistingUser = this.panelLoginWelcome.addButton(
            x,
            250 + y,
            200,
            35
        );
    }

    this.panelLoginNewUser = new Panel(this.surface, 50);

    if (!this.options.accountManagement) {
        y = 230;

        if (this.referID === 0) {
            this.panelLoginNewUser.addTextCentre(
                x,
                y + 8,
                'To create an account please go back to the',
                4,
                true
            );

            y += 20;

            this.panelLoginNewUser.addTextCentre(
                x,
                y + 8,
                "www.runescape.com front page, and choose 'create account'",
                4,
                true
            );
        } else if (this.referID === 1) {
            this.panelLoginNewUser.addTextCentre(
                x,
                y + 8,
                'To create an account please click on the',
                4,
                true
            );

            y += 20;

            this.panelLoginNewUser.addTextCentre(
                x,
                y + 8,
                "'create account' link below the game window",
                4,
                true
            );
        } else {
            this.panelLoginNewUser.addTextCentre(
                x,
                y + 8,
                'To create an account please go back to the',
                4,
                true
            );

            y += 20;

            this.panelLoginNewUser.addTextCentre(
                x,
                y + 8,
                "runescape front webpage and choose 'create account'",
                4,
                true
            );
        }

        y += 30;

        this.panelLoginNewUser.addButtonBackground(x, y + 17, 150, 34);
        this.panelLoginNewUser.addTextCentre(x, y + 17, 'Ok', 5, false);

        this.controlLoginNewOK = this.panelLoginNewUser.addButton(
            x,
            y + 17,
            150,
            34
        );
    } else {
        y = 70;

        this.controlRegisterStatus = this.panelLoginNewUser.addTextCentre(
            x,
            y + 8,
            'To create an account please enter all the requested details',
            4,
            true
        );

        let offsetY = y + 25;

        this.panelLoginNewUser.addButtonBackground(x, offsetY + 17, 250, 34);

        this.panelLoginNewUser.addTextCentre(
            x,
            offsetY + 8,
            'Choose a Username',
            4,
            false
        );

        this.controlRegisterUser = this.panelLoginNewUser.addTextInput(
            x,
            offsetY + 25,
            200,
            40,
            4,
            12,
            false,
            false
        );

        //this.panelLoginNewUser.setFocus(this.controlRegisterUser);

        offsetY += 40;

        this.panelLoginNewUser.addButtonBackground(
            x - 115,
            offsetY + 17,
            220,
            34
        );

        this.panelLoginNewUser.addTextCentre(
            x - 115,
            offsetY + 8,
            'Choose a Password',
            4,
            false
        );

        this.controlRegisterPassword = this.panelLoginNewUser.addTextInput(
            x - 115,
            offsetY + 25,
            220,
            40,
            4,
            20,
            true,
            false
        );

        this.panelLoginNewUser.addButtonBackground(
            x + 115,
            offsetY + 17,
            220,
            34
        );

        this.panelLoginNewUser.addTextCentre(
            x + 115,
            offsetY + 8,
            'Confirm Password',
            4,
            false
        );

        this.controlRegisterConfirmPassword = this.panelLoginNewUser.addTextInput(
            x + 115,
            offsetY + 25,
            220,
            40,
            4,
            20,
            true,
            false
        );

        offsetY += 60;

        this.controlRegisterCheckbox = this.panelLoginNewUser.addCheckbox(
            x - 196 - 7,
            offsetY - 7,
            14,
            14
        );

        this.panelLoginNewUser.addText(
            x - 181,
            offsetY,
            'I have read and agreed to the terms and conditions',
            4,
            true
        );

        offsetY += 15;

        this.panelLoginNewUser.addTextCentre(
            x,
            offsetY,
            '(to view these click the relevant link below this game window)',
            4,
            true
        );

        offsetY += 20;

        this.panelLoginNewUser.addButtonBackground(
            x - 100,
            offsetY + 17,
            150,
            34
        );

        this.panelLoginNewUser.addTextCentre(
            x - 100,
            offsetY + 17,
            'Submit',
            5,
            false
        );

        this.controlRegisterSubmit = this.panelLoginNewUser.addButton(
            x - 100,
            offsetY + 17,
            150,
            34
        );

        this.panelLoginNewUser.addButtonBackground(
            x + 100,
            offsetY + 17,
            150,
            34
        );

        this.panelLoginNewUser.addTextCentre(
            x + 100,
            offsetY + 17,
            'Cancel',
            5,
            false
        );

        this.controlRegisterCancel = this.panelLoginNewUser.addButton(
            x + 100,
            offsetY + 17,
            150,
            34
        );
    }

    this.panelLoginExistingUser = new Panel(this.surface, 50);

    y = 230;

    this.controlLoginStatus = this.panelLoginExistingUser.addTextCentre(
        x,
        y - 10,
        'Please enter your username and password',
        4,
        true
    );

    y += 28;

    this.panelLoginExistingUser.addButtonBackground(x - 116, y, 200, 40);

    this.panelLoginExistingUser.addTextCentre(
        x - 116,
        y - 10,
        'Username:',
        4,
        false
    );

    this.controlLoginUser = this.panelLoginExistingUser.addTextInput(
        x - 116,
        y + 10,
        200,
        40,
        4,
        12,
        false,
        false
    );

    y += 47;

    this.panelLoginExistingUser.addButtonBackground(x - 66, y, 200, 40);

    this.panelLoginExistingUser.addTextCentre(
        x - 66,
        y - 10,
        'Password:',
        4,
        false
    );

    this.controlLoginPassword = this.panelLoginExistingUser.addTextInput(
        x - 66,
        y + 10,
        200,
        40,
        4,
        20,
        true,
        false
    );

    y -= 55;

    this.panelLoginExistingUser.addButtonBackground(x + 154, y, 120, 25);
    this.panelLoginExistingUser.addTextCentre(x + 154, y, 'Ok', 4, false);

    this.controlLoginOk = this.panelLoginExistingUser.addButton(
        x + 154,
        y,
        120,
        25
    );

    y += 30;

    this.panelLoginExistingUser.addButtonBackground(x + 154, y, 120, 25);
    this.panelLoginExistingUser.addTextCentre(x + 154, y, 'Cancel', 4, false);

    this.controlLoginCancel = this.panelLoginExistingUser.addButton(
        x + 154,
        y,
        120,
        25
    );

    if (this.options.accountManagement) {
        y += 30;

        this.panelLoginExistingUser.addButtonBackground(x + 154, y, 160, 25);

        this.panelLoginExistingUser.addTextCentre(
            x + 154,
            y,
            "I've lost my password",
            4,
            false
        );

        this.controlLoginRecover = this.panelLoginExistingUser.addButton(
            x + 154,
            y,
            160,
            25
        );
    }

    //this.panelLoginExistingUser.setFocus(this.controlLoginUser);
}

function renderLoginScreenViewports() {
    const plane = 0;
    const regionX = 50; //49;
    const regionY = 50; //47;

    this.world._loadSection_from3(regionX * 48 + 23, regionY * 48 + 23, plane);
    this.world.addModels(this.gameModels);

    let x = 9728;
    let y = 6400;
    let zoom = 1100;
    let rotation = 888;

    this.scene.clipFar3d = 4100;
    this.scene.clipFar2d = 4100;
    this.scene.fogZFalloff = 1;
    this.scene.fogZDistance = 4000;

    this.surface.blackScreen();

    this.scene.setCamera(
        x,
        -this.world.getElevation(x, y),
        y,
        912,
        rotation,
        0,
        zoom * 2
    );

    this.scene.render();

    this.surface.fadeToBlack();
    this.surface.fadeToBlack();

    this.surface.drawBox(0, 0, this.gameWidth, 6, 0);

    for (let i = 6; i >= 1; i--) {
        this.surface.drawLineAlpha(0, i, 0, i, this.gameWidth, 8);
    }

    this.surface.drawBox(0, 194, 512, 20, 0);

    for (let i = 6; i >= 1; i--) {
        this.surface.drawLineAlpha(0, i, 0, 194 - i, this.gameWidth, 8);
    }

    // runescape logo
    this.surface._drawSprite_from3(
        ((this.gameWidth / 2) | 0) -
            ((this.surface.spriteWidth[this.spriteMedia + 10] / 2) | 0),
        15,
        this.spriteMedia + 10
    );

    this.surface._drawSprite_from5(this.spriteLogo, 0, 0, this.gameWidth, 200);

    this.surface.drawWorld(this.spriteLogo);

    x = 9216;
    y = 9216;
    zoom = 1100;
    rotation = 888;

    this.scene.clipFar3d = 4100;
    this.scene.clipFar2d = 4100;
    this.scene.fogZFalloff = 1;
    this.scene.fogZDistance = 4000;

    this.surface.blackScreen();

    this.scene.setCamera(
        x,
        -this.world.getElevation(x, y),
        y,
        912,
        rotation,
        0,
        zoom * 2
    );

    this.scene.render();

    this.surface.fadeToBlack();
    this.surface.fadeToBlack();
    this.surface.drawBox(0, 0, this.gameWidth, 6, 0);

    for (let i = 6; i >= 1; i--) {
        this.surface.drawLineAlpha(0, i, 0, i, this.gameWidth, 8);
    }

    this.surface.drawBox(0, 194, this.gameWidth, 20, 0);

    for (let i = 6; i >= 1; i--) {
        this.surface.drawLineAlpha(0, i, 0, 194 - i, this.gameWidth, 8);
    }

    this.surface._drawSprite_from3(
        ((this.gameWidth / 2) | 0) -
            ((this.surface.spriteWidth[this.spriteMedia + 10] / 2) | 0),
        15,
        this.spriteMedia + 10
    );

    this.surface._drawSprite_from5(
        this.spriteLogo + 1,
        0,
        0,
        this.gameWidth,
        200
    );

    this.surface.drawWorld(this.spriteLogo + 1);

    for (let i = 0; i < 64; i++) {
        this.scene.removeModel(this.world.roofModels[0][i]);
        this.scene.removeModel(this.world.wallModels[1][i]);
        this.scene.removeModel(this.world.roofModels[1][i]);
        this.scene.removeModel(this.world.wallModels[2][i]);
        this.scene.removeModel(this.world.roofModels[2][i]);
    }

    x = 11136;
    y = 10368;
    zoom = 500;
    rotation = 376;

    this.scene.clipFar3d = 4100;
    this.scene.clipFar2d = 4100;
    this.scene.fogZFalloff = 1;
    this.scene.fogZDistance = 4000;

    this.surface.blackScreen();

    this.scene.setCamera(
        x,
        -this.world.getElevation(x, y),
        y,
        912,
        rotation,
        0,
        zoom * 2
    );

    this.scene.render();

    this.surface.fadeToBlack();
    this.surface.fadeToBlack();
    this.surface.drawBox(0, 0, this.gameWidth, 6, 0);

    for (let i = 6; i >= 1; i--) {
        this.surface.drawLineAlpha(0, i, 0, i, this.gameWidth, 8);
    }

    this.surface.drawBox(0, 194, this.gameWidth, 20, 0);

    for (let i = 6; i >= 1; i--) {
        this.surface.drawLineAlpha(0, i, 0, 194, this.gameWidth, 8);
    }

    this.surface._drawSprite_from3(
        ((this.gameWidth / 2) | 0) -
            ((this.surface.spriteWidth[this.spriteMedia + 10] / 2) | 0),
        15,
        this.spriteMedia + 10
    );

    this.surface._drawSprite_from5(
        this.spriteMedia + 10,
        0,
        0,
        this.gameWidth,
        200
    );

    this.surface.drawWorld(this.spriteMedia + 10);
}

function drawLoginScreens() {
    this.welcomScreenAlreadyShown = false;
    this.surface.interlace = false;

    this.surface.blackScreen();

    let showBackground;

    if (this.options.accountManagement) {
        showBackground = this.loginScreen === 0 || this.loginScreen === 2;
    } else {
        showBackground = this.loginScreen >= 0 && this.loginScreen <= 3;
    }

    if (showBackground) {
        const cycle = (this.loginTimer * 2) % 3072;

        if (cycle < 1024) {
            this.surface._drawSprite_from3(0, 10, this.spriteLogo);

            if (cycle > 768) {
                this.surface._drawSpriteAlpha_from4(
                    0,
                    10,
                    this.spriteLogo + 1,
                    cycle - 768
                );
            }
        } else if (cycle < 2048) {
            this.surface._drawSprite_from3(0, 10, this.spriteLogo + 1);

            if (cycle > 1792) {
                this.surface._drawSpriteAlpha_from4(
                    0,
                    10,
                    this.spriteMedia + 10,
                    cycle - 1792
                );
            }
        } else {
            this.surface._drawSprite_from3(0, 10, this.spriteMedia + 10);

            if (cycle > 2816) {
                this.surface._drawSpriteAlpha_from4(
                    0,
                    10,
                    this.spriteLogo,
                    cycle - 2816
                );
            }
        }
    }

    if (this.loginScreen === 0) {
        this.panelLoginWelcome.drawPanel();
    } else if (this.loginScreen === 1) {
        this.panelLoginNewUser.drawPanel();
    } else if (this.loginScreen === 2) {
        this.panelLoginExistingUser.drawPanel();
    }

    // blue bar
    this.surface._drawSprite_from3(
        0,
        this.gameHeight - 4,
        this.spriteMedia + 22
    );

    this.surface.draw(this.graphics, 0, 0);
}

async function handleLoginScreenInput() {
    if (this.worldFullTimeout > 0) {
        this.worldFullTimeout--;
    }

    if (this.loginScreen === 0) {
        this.panelLoginWelcome.handleMouse(
            this.mouseX,
            this.mouseY,
            this.lastMouseButtonDown,
            this.mouseButtonDown
        );

        if (this.panelLoginWelcome.isClicked(this.controlWelcomeNewUser)) {
            this.loginScreen = 1;

            if (this.options.accountManagement) {
                this.panelLoginNewUser.updateText(this.controlRegisterUser, '');

                this.panelLoginNewUser.updateText(
                    this.controlRegisterPassword,
                    ''
                );

                this.panelLoginNewUser.updateText(
                    this.controlRegisterConfirmPassword,
                    ''
                );

                this.panelLoginNewUser.setFocus(this.controlRegisterUser);

                this.panelLoginNewUser.toggleCheckbox(
                    this.controlRegisterCheckbox,
                    false
                );

                this.panelLoginNewUser.updateText(
                    this.controlRegisterStatus,
                    'To create an account please enter all the requested ' +
                        'details'
                );
            }
        }

        if (this.panelLoginWelcome.isClicked(this.controlWelcomeExistingUser)) {
            this.loginScreen = 2;

            this.panelLoginExistingUser.updateText(
                this.controlLoginStatus,
                'Please enter your username and password'
            );

            this.panelLoginExistingUser.updateText(this.controlLoginUser, '');

            this.panelLoginExistingUser.updateText(
                this.controlLoginPassword,
                ''
            );

            this.panelLoginExistingUser.setFocus(this.controlLoginUser);

            return;
        }
    } else if (this.loginScreen === 1) {
        this.panelLoginNewUser.handleMouse(
            this.mouseX,
            this.mouseY,
            this.lastMouseButtonDown,
            this.mouseButtonDown
        );

        if (this.options.accountManagement) {
            // allow mobile to click the entire text to agree to ToS
            if (
                this.options.mobile &&
                this.lastMouseButtonDown === 1 &&
                this.mouseX >= 74 &&
                this.mouseX <= 474 &&
                this.mouseY >= 188 &&
                this.mouseY <= 216
            ) {
                this.panelLoginNewUser.toggleCheckbox(
                    this.controlRegisterCheckbox,
                    !this.panelLoginNewUser.isActivated(
                        this.controlRegisterCheckbox
                    )
                );

                this.lastMouseButtonDown = 0;

                return;
            }

            if (this.panelLoginNewUser.isClicked(this.controlRegisterCancel)) {
                this.loginScreen = 0;
                return;
            }

            if (this.panelLoginNewUser.isClicked(this.controlRegisterUser)) {
                this.panelLoginNewUser.setFocus(this.controlRegisterPassword);
                return;
            }

            if (
                this.panelLoginNewUser.isClicked(this.controlRegisterPassword)
            ) {
                this.panelLoginNewUser.setFocus(
                    this.controlRegisterConfirmPassword
                );

                return;
            }

            if (
                this.panelLoginNewUser.isClicked(
                    this.controlRegisterConfirmPassword
                ) ||
                this.panelLoginNewUser.isClicked(this.controlRegisterSubmit)
            ) {
                const username = this.panelLoginNewUser.getText(
                    this.controlRegisterUser
                );

                const password = this.panelLoginNewUser.getText(
                    this.controlRegisterPassword
                );

                const confirmPassword = this.panelLoginNewUser.getText(
                    this.controlRegisterConfirmPassword
                );

                if (
                    !username ||
                    username.length === 0 ||
                    !password ||
                    password.length === 0 ||
                    !confirmPassword ||
                    confirmPassword.length === 0
                ) {
                    this.panelLoginNewUser.updateText(
                        this.controlRegisterStatus,
                        '@yel@Please fill in ALL requested information to ' +
                            'continue!'
                    );

                    return;
                }

                if (password !== confirmPassword) {
                    this.panelLoginNewUser.updateText(
                        this.controlRegisterStatus,
                        '@yel@The two passwords entered are not the same as ' +
                            'each other!'
                    );

                    return;
                }

                if (password.length < 5) {
                    this.panelLoginNewUser.updateText(
                        this.controlRegisterStatus,
                        '@yel@Your password must be at least 5 letters long'
                    );

                    return;
                }

                if (
                    !this.panelLoginNewUser.isActivated(
                        this.controlRegisterCheckbox
                    )
                ) {
                    this.panelLoginNewUser.updateText(
                        this.controlRegisterStatus,
                        '@yel@You must agree to the terms+conditions to ' +
                            'continue'
                    );

                    return;
                }

                this.panelLoginNewUser.updateText(
                    this.controlRegisterStatus,
                    'Please wait... Creating new account'
                );

                this.drawLoginScreens();
                this.resetTimings();

                this.registerUser = this.panelLoginNewUser.getText(
                    this.controlRegisterUser
                );

                this.registerPassword = this.panelLoginNewUser.getText(
                    this.controlRegisterPassword
                );

                await this.register(this.registerUser, this.registerPassword);
            }
        } else {
            if (this.panelLoginNewUser.isClicked(this.controlLoginNewOk)) {
                this.loginScreen = 0;
            }
        }
    } else if (this.loginScreen === 2) {
        this.panelLoginExistingUser.handleMouse(
            this.mouseX,
            this.mouseY,
            this.lastMouseButtonDown,
            this.mouseButtonDown
        );

        if (this.panelLoginExistingUser.isClicked(this.controlLoginCancel)) {
            this.loginScreen = 0;
        } else if (
            this.panelLoginExistingUser.isClicked(this.controlLoginUser)
        ) {
            this.panelLoginExistingUser.setFocus(this.controlLoginPassword);
        } else if (
            this.panelLoginExistingUser.isClicked(this.controlLoginPassword) ||
            this.panelLoginExistingUser.isClicked(this.controlLoginOk)
        ) {
            this.loginUser = this.panelLoginExistingUser.getText(
                this.controlLoginUser
            );

            this.loginPass = this.panelLoginExistingUser.getText(
                this.controlLoginPassword
            );

            await this.login(this.loginUser, this.loginPass, false);
        } else if (
            this.panelLoginExistingUser.isClicked(this.controlLoginRecover)
        ) {
            this.loginUser = this.panelLoginExistingUser.getText(
                this.controlLoginUser
            );

            if (this.loginUser.trim().length === 0) {
                this.showLoginScreenStatus(
                    'You must enter your username to recover your password',
                    ''
                );

                return;
            }

            await this.recoverAttempt(this.loginUser);
        }
    }
}

module.exports = {
    controlRecoverQuestions: new Int32Array(5),
    controlRecoverAnswers: new Int32Array(5),
    loginScreen: 0,
    createLoginPanels,
    drawLoginScreens,
    handleLoginScreenInput,
    renderLoginScreenViewports
};
