const BZLib = require('./bzlib');
const Color = require('./lib/graphics/color');
const Font = require('./lib/graphics/font');
const Graphics = require('./lib/graphics/graphics');
const Socket = require('./lib/net/socket');
const Surface = require('./surface');
const TGA = require('tga-js');
const Utility = require('./utility');
const keycodes = require('./lib/keycodes');
const version = require('./version');
const sleep = require('sleep-promise');

const CHAR_MAP =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"\243$%^&' +
    "*()-_=+[{]};:'@#~,<.>/?\\| ";

const FONTS = [
    'h11p.jf',
    'h12b.jf',
    'h12p.jf',
    'h13b.jf',
    'h14b.jf',
    'h16b.jf',
    'h20b.jf',
    'h24b.jf'
];

// using width: 0 bugs out on chrome
const INPUT_STYLES = {
    position: 'absolute',
    display: 'none',
    padding: 0,
    border: 0,
    outline: 0,
    opacity: 0,
    textAlign: 'center',
    fontFamily: 'sans',
    fontSize: '14px'
};

class GameShell {
    constructor(canvas) {
        this._canvas = canvas;
        this._graphics = new Graphics(this._canvas);

        this.options = {
            middleClickCamera: false,
            mouseWheel: false,
            resetCompass: false,
            zoomCamera: false,
            showRoofs: true,
            remainingExperience: false,
            totalExperience: false,
            wordFilter: true,
            accountManagement: true,
            messageScrollBack: true,
            retroFPSCounter: false,
            retryLoginOnDisconnect: true,
            mobile: true
        };

        this.middleButtonDown = false;
        this.mouseScrollDelta = 0;

        this.mouseActionTimeout = 0;
        this.loadingStep = 0;
        this.logoHeaderText = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseButtonDown = 0;
        this.lastMouseButtonDown = 0;
        this.timings = [];
        this.resetTimings();
        this.stopTimeout = 0;
        this.interlaceTimer = 0;
        this.loadingProgressPercent = 0;
        this.imageLogo = null;
        this.graphics = null;

        this.appletWidth = 512;
        this.appletHeight = 346;
        this.targetFps = 20;
        this.maxDrawTime = 1000;
        this.timings = [];
        this.loadingStep = 1;
        this.hasRefererLogoNotUsed = false;
        this.loadingProgessText = 'Loading';
        this.fontTimesRoman15 = new Font('TimesRoman', 0, 15);
        this.fontHelvetica13b = new Font('Helvetica', Font.BOLD, 13);
        this.fontHelvetica12 = new Font('Helvetica', 0, 12);
        this.keyLeft = false;
        this.keyRight = false;
        this.keyUp = false;
        this.keyDown = false;
        this.keySpace = false;
        this.keyHome = false;
        this.keyPgUp = false;
        this.keyPgDown = false;
        this.ctrl = false;
        this.threadSleep = 1;
        this.interlace = false;
        this.inputTextCurrent = '';
        this.inputTextFinal = '';
        this.inputPMCurrent = '';
        this.inputPMFinal = '';
    }

    async startApplication(width, height, title) {
        window.document.title = title;

        this._canvas.tabIndex = 0;
        this._canvas.width = width;
        this._canvas.height = height;

        console.log('Started application');

        this.appletWidth = width;
        this.appletHeight = height;

        this._canvas.addEventListener(
            'mousedown',
            this.mousePressed.bind(this)
        );

        this._canvas.addEventListener('mousemove', this.mouseMoved.bind(this));
        this._canvas.addEventListener('mouseup', this.mouseReleased.bind(this));
        this._canvas.addEventListener('mouseout', this.mouseOut.bind(this));
        this._canvas.addEventListener('wheel', this.mouseWheel.bind(this));

        // prevent right clicks
        this._canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });

        this._canvas.addEventListener('keydown', this.keyPressed.bind(this));
        this._canvas.addEventListener('keyup', this.keyReleased.bind(this));

        window.addEventListener('beforeunload', () => this.onClosing());

        if (this.options.mobile) {
            this.toggleKeyboard = false;

            // we can't re-use the mobileInput for passwords since browsers
            // turn off autocomplete once it's switched back to text
            this.mobileInput = document.createElement('input');
            Object.assign(this.mobileInput.style, INPUT_STYLES);

            this.mobilePassword = document.createElement('input');
            this.mobilePassword.type = 'password';
            Object.assign(this.mobilePassword.style, INPUT_STYLES);

            this.mobileInput.addEventListener(
                'keydown',
                this.mobileKeyDown.bind(this)
            );

            this.mobilePassword.addEventListener(
                'keydown',
                this.mobileKeyDown.bind(this)
            );

            this.mobileInput.addEventListener(
                'blur',
                this.closeKeyboard.bind(this)
            );

            this.mobilePassword.addEventListener(
                'blur',
                this.closeKeyboard.bind(this)
            );

            document.body.appendChild(this.mobileInput);
            document.body.appendChild(this.mobilePassword);
        }

        this.loadingStep = 1;

        await this.run();
    }

    closeKeyboard() {
        clearInterval(this.keyboardUpdateInterval);
        this.mobileInputEl.style.display = 'none';
        this._canvas.focus();
    }

    openKeyboard(
        type = 'text',
        text,
        maxLength,
        x = 0,
        y = 0,
        width = 100,
        height = 20
    ) {
        this.mobileInputCaret = -1;
        this.lastMobileInput = text;
        this.toggleKeyboard = true;

        this.mobileInputEl =
            type === 'password' ? this.mobilePassword : this.mobileInput;

        this.mobileInputEl.value = text;
        this.mobileInputEl.maxLength = maxLength;

        this.mobileInputEl.style.display = 'block';

        this.mobileInputEl.style.top = `${y - Math.floor(height / 2)}px`;
        this.mobileInputEl.style.left = `${x - Math.floor(width / 2)}px`;
        this.mobileInputEl.style.width = `${width}px`;
        this.mobileInputEl.style.height = `${height}px`;

        this.keyboardUpdateInterval = setInterval(() => {
            this.mobileKeyboardUpdate();
        }, 125);
    }

    mobileKeyDown(e) {
        if (e.keyCode === keycodes.ENTER) {
            this.closeKeyboard();
            this.keyPressed(e);
        }
    }

    mobileKeyboardUpdate() {
        this.mobileInputCaret = this.mobileInputEl.selectionStart;

        const newInput = this.mobileInputEl.value;

        if (newInput === this.lastMobileInput) {
            return;
        }

        for (let i = 0; i < this.lastMobileInput.length; i += 1) {
            this.keyPressed({ keyCode: keycodes.BACKSPACE });
        }

        for (let i = 0; i < newInput.length; i += 1) {
            this.keyPressed({ key: newInput[i] });
        }

        this.lastMobileInput = newInput;
    }

    keyPressed(e) {
        const code = e.keyCode;

        let charCode =
            e.key && e.key.length === 1 ? e.key.charCodeAt(0) : 65535;

        if (e.preventDefault) {
            e.preventDefault();
        }

        if (
            [8, 10, 13, 9].includes(code) ||
            (this.options.messageScrollBack &&
                [keycodes.UP_ARROW, keycodes.DOWN_ARROW].includes(code) &&
                this.ctrl)
        ) {
            charCode = code;
        }

        this.handleKeyPress(charCode);

        if (code === keycodes.LEFT_ARROW) {
            this.keyLeft = true;
        } else if (code === keycodes.RIGHT_ARROW) {
            this.keyRight = true;
        } else if (code === keycodes.UP_ARROW) {
            this.keyUp = true;
        } else if (code === keycodes.DOWN_ARROW) {
            this.keyDown = true;
        } else if (code === keycodes.SPACE) {
            this.keySpace = true;
        } else if (code === keycodes.F1) {
            this.interlace = !this.interlace;
        } else if (code === keycodes.HOME) {
            this.keyHome = true;
        } else if (code === keycodes.PAGE_UP) {
            this.keyPgUp = true;
        } else if (code === keycodes.PAGE_DOWN) {
            this.keyPgDown = true;
        } else if (code === keycodes.CTRL) {
            this.ctrl = true;
        }

        let foundText = false;

        for (let i = 0; i < CHAR_MAP.length; i++) {
            if (CHAR_MAP.charCodeAt(i) === charCode) {
                foundText = true;
                break;
            }
        }

        if (foundText) {
            if (this.inputTextCurrent.length < 20) {
                this.inputTextCurrent += String.fromCharCode(charCode);
            }

            if (this.inputPMCurrent.length < 80) {
                this.inputPMCurrent += String.fromCharCode(charCode);
            }
        }

        if (code === keycodes.ENTER) {
            this.inputTextFinal = this.inputTextCurrent;
            this.inputPMFinal = this.inputPMCurrent;
        } else if (code === keycodes.BACKSPACE) {
            if (this.inputTextCurrent.length > 0) {
                this.inputTextCurrent = this.inputTextCurrent.substring(
                    0,
                    this.inputTextCurrent.length - 1
                );
            }

            if (this.inputPMCurrent.length > 0) {
                this.inputPMCurrent = this.inputPMCurrent.substring(
                    0,
                    this.inputPMCurrent.length - 1
                );
            }
        }

        if (this.options.mobile) {
            // inputs can only be focused when a user performs an action,
            // and we set toggleKeyboard to true after an event has occured
            setTimeout(() => {
                if (!this.toggleKeyboard) {
                    return;
                }

                this.toggleKeyboard = false;
                this.mobileInputEl.focus();
            }, 125);
        }
    }

    keyReleased(e) {
        e.preventDefault();

        const code = e.keyCode;

        if (code === keycodes.LEFT_ARROW) {
            this.keyLeft = false;
        } else if (code === keycodes.RIGHT_ARROW) {
            this.keyRight = false;
        } else if (code === keycodes.UP_ARROW) {
            this.keyUp = false;
        } else if (code === keycodes.DOWN_ARROW) {
            this.keyDown = false;
        } else if (code === keycodes.SPACE) {
            this.keySpace = false;
        } else if (code === keycodes.HOME) {
            this.keyHome = false;
        } else if (code === keycodes.PAGE_UP) {
            this.keyPgUp = false;
        } else if (code === keycodes.PAGE_DOWN) {
            this.keyPgDown = false;
        } else if (code === keycodes.CTRL) {
            this.ctrl = false;
        }
    }

    mouseMoved(e) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
        this.mouseActionTimeout = 0;
    }

    mouseReleased(e) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
        this.mouseButtonDown = 0;

        if (e.button === 1) {
            this.middleButtonDown = false;
        }
    }

    mouseOut(e) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
        this.mouseButtonDown = 0;
        this.middleButtonDown = false;
    }

    mousePressed(e) {
        if (this.options.mobile) {
            // inputs can only be focused when a user performs an action,
            // and we set toggleKeyboard to true after an event has occured
            setTimeout(() => {
                if (!this.toggleKeyboard) {
                    return;
                }

                this.toggleKeyboard = false;
                this.mobileInputEl.focus();
            }, 125);
        }

        const x = e.offsetX;
        const y = e.offsetY;

        this.mouseX = x;
        this.mouseY = y;

        if (this.options.middleClickCamera && e.button === 1) {
            this.middleButtonDown = true;
            this.originRotation = this.cameraRotation;
            this.originMouseX = this.mouseX;

            return;
        }

        if (e.metaKey || e.button === 2) {
            this.mouseButtonDown = 2;
        } else {
            this.mouseButtonDown = 1;
        }

        this.lastMouseButtonDown = this.mouseButtonDown;
        this.mouseActionTimeout = 0;

        this.handleMouseDown(this.mouseButtonDown, x, y);
    }

    mouseWheel(e) {
        if (!this.options.mouseWheel) {
            return;
        }

        e.preventDefault();

        if (e.deltaMode === 0) {
            // deltaMode === 0 means deltaY/deltaY is given in pixels (chrome)
            this.mouseScrollDelta = Math.floor(e.deltaY / 14);
        } else if (e.deltaMode === 1) {
            // deltaMode === 1 means deltaY/deltaY is given in lines (firefox)
            this.mouseScrollDelta = Math.floor(e.deltaY);
        }

        return false;
    }

    setTargetFps(i) {
        this.targetFps = 1000 / i;
    }

    resetTimings() {
        for (let i = 0; i < 10; i += 1) {
            this.timings[i] = 0;
        }
    }

    start() {
        if (this.stopTimeout >= 0) {
            this.stopTimeout = 0;
        }
    }

    stop() {
        if (this.stopTimeout >= 0) {
            this.stopTimeout = 4000 / this.targetFps;
        }
    }

    async run() {
        if (this.loadingStep === 1) {
            this.loadingStep = 2;
            this.graphics = this.getGraphics();
            await this.loadJagex();
            this.drawLoadingScreen(0, 'Loading...');
            await this.startGame();
            this.loadingStep = 0;
        }

        let i = 0;
        let j = 256;
        let delay = 1;
        let i1 = 0;

        for (let j1 = 0; j1 < 10; j1++) {
            this.timings[j1] = Date.now();
        }

        while (this.stopTimeout >= 0) {
            if (this.stopTimeout > 0) {
                this.stopTimeout--;

                if (this.stopTimeout === 0) {
                    this.onClosing();
                    return;
                }
            }

            const k1 = j;
            const lastDelay = delay;

            j = 300;
            delay = 1;

            const time = Date.now();

            if (this.timings[i] === 0) {
                j = k1;
                delay = lastDelay;
            } else if (time > this.timings[i]) {
                j = ((2560 * this.targetFps) / (time - this.timings[i])) | 0;
            }

            if (j < 25) {
                j = 25;
            }

            if (j > 256) {
                j = 256;
                delay = (this.targetFps - (time - this.timings[i]) / 10) | 0;

                if (delay < this.threadSleep) {
                    delay = this.threadSleep;
                }
            }

            await sleep(delay);

            this.timings[i] = time;
            i = (i + 1) % 10;

            if (delay > 1) {
                for (let j2 = 0; j2 < 10; j2++) {
                    if (this.timings[j2] !== 0) {
                        this.timings[j2] += delay;
                    }
                }
            }

            let k2 = 0;

            while (i1 < 256) {
                await this.handleInputs();
                i1 += j;

                if (++k2 > this.maxDrawTime) {
                    i1 = 0;
                    this.interlaceTimer += 6;

                    if (this.interlaceTimer > 25) {
                        this.interlaceTimer = 0;
                        this.interlace = true;
                    }

                    break;
                }
            }

            this.interlaceTimer--;
            i1 &= 0xff;

            this.draw();

            // calculate fps
            this.fps = (1000 * j) / (this.targetFps * 256);

            this.mouseScrollDelta = 0;
        }
    }

    update(graphics) {
        this.paint(graphics);
    }

    paint() {
        if (this.loadingStep === 2 && this.imageLogo !== null) {
            this.drawLoadingScreen(
                this.loadingProgressPercent,
                this.loadingProgessText
            );
        }
    }

    async loadJagex() {
        this.graphics.setColor(Color.black);
        this.graphics.fillRect(0, 0, this.appletWidth, this.appletHeight);

        const jagexJag = await this.readDataFile(
            'jagex.jag',
            'Jagex library',
            0
        );

        if (jagexJag) {
            const logoTga = Utility.loadData('logo.tga', 0, jagexJag);
            this.imageLogo = this.parseTGA(logoTga);
        }

        const fontsJag = await this.readDataFile(
            `fonts${version.FONTS}.jag`,
            'Game fonts',
            5
        );

        if (jagexJag !== null) {
            for (let i = 0; i < FONTS.length; i += 1) {
                const fontName = FONTS[i];
                Surface.createFont(Utility.loadData(fontName, 0, fontsJag), i);
            }
        }
    }

    drawLoadingScreen(percent, text) {
        let x = ((this.appletWidth - 281) / 2) | 0;
        let y = ((this.appletHeight - 148) / 2) | 0;

        this.graphics.setColor(Color.black);
        this.graphics.fillRect(0, 0, this.appletWidth, this.appletHeight);

        if (!this.hasRefererLogoNotUsed) {
            this.graphics.drawImage(this.imageLogo, x, y /*, this*/);
        }

        x += 2;
        y += 90;

        this.loadingProgressPercent = percent;
        this.loadingProgessText = text;

        this.graphics.setColor(new Color(132, 132, 132));

        if (this.hasRefererLogoNotUsed) {
            this.graphics.setColor(new Color(220, 0, 0));
        }

        this.graphics.drawRect(x - 2, y - 2, 280, 23);
        this.graphics.fillRect(x, y, ((277 * percent) / 100) | 0, 20);
        this.graphics.setColor(new Color(198, 198, 198));

        if (this.hasRefererLogoNotUsed) {
            this.graphics.setColor(new Color(255, 255, 255));
        }

        this.drawString(
            this.graphics,
            text,
            this.fontTimesRoman15,
            x + 138,
            y + 10
        );

        if (!this.hasRefererLogoNotUsed) {
            this.drawString(
                this.graphics,
                'Created by JAGeX - visit www.jagex.com',
                this.fontHelvetica13b,
                x + 138,
                y + 30
            );

            this.drawString(
                this.graphics,
                '\u00a92001-2002 Andrew Gower and Jagex Ltd',
                this.fontHelvetica13b,
                x + 138,
                y + 44
            );
        } else {
            this.graphics.setColor(new Color(132, 132, 152));

            this.drawString(
                this.graphics,
                '\u00a92001-2002 Andrew Gower and Jagex Ltd',
                this.fontHelvetica12,
                x + 138,
                this.appletHeight - 20
            );
        }

        // not sure where this would have been used. maybe to indicate a
        // special client?
        if (this.logoHeaderText !== null) {
            this.graphics.setColor(Color.white);
            this.drawString(
                this.graphics,
                this.logoHeaderText,
                this.fontHelvetica13b,
                x + 138,
                y - 120
            );
        }
    }

    showLoadingProgress(percent, text) {
        const x = (((this.appletWidth - 281) / 2) | 0) + 2;
        const y = (((this.appletHeight - 148) / 2) | 0) + 90;

        this.loadingProgressPercent = percent;
        this.loadingProgessText = text;

        this.graphics.setColor(new Color(132, 132, 132));

        if (this.hasRefererLogoNotUsed) {
            this.graphics.setColor(new Color(220, 0, 0));
        }

        const progressWidth = ((277 * percent) / 100) | 0;

        this.graphics.fillRect(x, y, progressWidth, 20);
        this.graphics.setColor(Color.black);
        this.graphics.fillRect(x + progressWidth, y, 277 - progressWidth, 20);
        this.graphics.setColor(new Color(198, 198, 198));

        if (this.hasRefererLogoNotUsed) {
            this.graphics.setColor(new Color(255, 255, 255));
        }

        this.drawString(
            this.graphics,
            text,
            this.fontTimesRoman15,
            x + 138,
            y + 10
        );
    }

    drawString(graphics, string, font, x, y) {
        graphics.setFont(font);

        const { width, height } = graphics.ctx.measureText(string);

        graphics.drawString(
            string,
            x - ((width / 2) | 0),
            y + ((height / 4) | 0)
        );
    }

    parseTGA(tgaBuffer) {
        const tgaImage = new TGA();
        tgaImage.load(new Uint8Array(tgaBuffer.buffer));

        const canvas = tgaImage.getCanvas();
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        return imageData;
    }

    async readDataFile(file, description, percent) {
        file = `./data204/${file}`;

        this.showLoadingProgress(percent, `Loading ${description} - 0%`);

        const fileDownloadStream = Utility.openFile(file);

        const header = new Int8Array(6);
        await fileDownloadStream.readFully(header, 0, 6);

        const archiveSize =
            ((header[0] & 0xff) << 16) +
            ((header[1] & 0xff) << 8) +
            (header[2] & 0xff);

        const archiveSizeCompressed =
            ((header[3] & 0xff) << 16) +
            ((header[4] & 0xff) << 8) +
            (header[5] & 0xff);

        this.showLoadingProgress(percent, `Loading ${description} - 5%`);

        let read = 0;
        const archiveData = new Int8Array(archiveSizeCompressed);

        while (read < archiveSizeCompressed) {
            let length = archiveSizeCompressed - read;

            if (length > 1000) {
                length = 1000;
            }

            await fileDownloadStream.readFully(archiveData, read, length);
            read += length;

            this.showLoadingProgress(
                percent,
                `Loading ${description} - ` +
                    ((5 + (read * 95) / archiveSizeCompressed) | 0) +
                    '%'
            );
        }

        this.showLoadingProgress(percent, `Unpacking ${description}`);

        if (archiveSizeCompressed !== archiveSize) {
            const decompressed = new Int8Array(archiveSize);

            BZLib.decompress(
                decompressed,
                archiveSize,
                archiveData,
                archiveSizeCompressed,
                0
            );

            return decompressed;
        }

        return archiveData;
    }

    getGraphics() {
        return this._graphics;
    }

    async createSocket(server, port) {
        const socket = new Socket(server, port);
        await socket.connect();
        return socket;
    }
}

module.exports = GameShell;
