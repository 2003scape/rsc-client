const BZLib = require('./bzlib');
const Color = require('./lib/graphics/color');
const Font = require('./lib/graphics/font');
const Graphics = require('./lib/graphics/graphics');
const KEYCODES = require('./lib/keycodes');
const Socket = require('./lib/net/socket');
const Surface = require('./surface');
const Utility = require('./utility');
const VERSION = require('./version');
const zzz = require('sleep-promise');
const { TGA } = require('./lib/tga');

class GameShell {
    constructor(canvas) {
        this._canvas = canvas;
        this._graphics = new Graphics(this._canvas);

        this.options = {
            middleClickCamera: false,
            mouseWheel: false,
            resetCompass: false,
            zoomCamera: false,
            showRoofs: true
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
        this.threadSleep = 1;
        this.interlace = false;
        this.inputTextCurrent = '';
        this.inputTextFinal = '';
        this.inputPmCurrent = '';
        this.inputPmFinal = '';
    }

    async startApplication(width, height, title) {
        window.document.title = title;
        this._canvas.width = width;
        this._canvas.height = height;

        console.log('Started application');
        this.appletWidth = width;
        this.appletHeight = height;

        GameShell.gameFrame = this._canvas.getContext('2d');

        this._canvas.addEventListener('mousedown', this.mousePressed.bind(this));
        this._canvas.addEventListener('contextmenu', this.mousePressed.bind(this));
        this._canvas.addEventListener('mousemove', this.mouseMoved.bind(this));
        this._canvas.addEventListener('mouseup', this.mouseReleased.bind(this));
        this._canvas.addEventListener('mouseout', this.mouseOut.bind(this));
        this._canvas.addEventListener('wheel', this.mouseWheel.bind(this));

        window.addEventListener('keydown', this.keyPressed.bind(this));
        window.addEventListener('keyup', this.keyReleased.bind(this));

        this.loadingStep = 1;

        await this.run();
    }

    setTargetFps(i) {
        this.targetFps = 1000 / i;
    }

    resetTimings() {
        for (let i = 0; i < 10; i += 1) {
            this.timings[i] = 0;
        }
    }

    keyPressed(e) {
        e.preventDefault();

        let code = e.keyCode;
        let chr = e.key.length === 1 ? e.key.charCodeAt(0) : 65535;

        if ([8, 10, 13, 9].indexOf(code) > -1 ) {
            chr = code;
        }

        this.handleKeyPress(chr);

        if (code === KEYCODES.LEFT_ARROW) {
            this.keyLeft = true;
        } else if (code === KEYCODES.RIGHT_ARROW) {
            this.keyRight = true;
        } else if (code === KEYCODES.UP_ARROW) {
            this.keyUp = true;
        } else if (code === KEYCODES.DOWN_ARROW) {
            this.keyDown = true;
        } else if (code === KEYCODES.SPACE) {
            this.keySpace = true;
        } else if (code === KEYCODES.F1) {
            this.interlace = !this.interlace;
        } else if (code === KEYCODES.HOME) {
            this.keyHome = true;
        } else if (code === KEYCODES.PAGE_UP) {
            this.keyPgUp = true;
        } else if (code === KEYCODES.PAGE_DOWN) {
            this.keyPgDown = true;
        }

        let foundText = false;

        for (let i = 0; i < GameShell.charMap.length; i++) {
            if (GameShell.charMap.charCodeAt(i) === chr) {
                foundText = true;
                break;
            }
        }

        if (foundText) {
            if (this.inputTextCurrent.length < 20) {
                this.inputTextCurrent += String.fromCharCode(chr);
            }

            if (this.inputPmCurrent.length < 80) {
                this.inputPmCurrent += String.fromCharCode(chr);
            }
        }

        if (code === KEYCODES.ENTER) {
            this.inputTextFinal = this.inputTextCurrent;
            this.inputPmFinal = this.inputPmCurrent;
        }

        if (code === KEYCODES.BACKSPACE) {
            if (this.inputTextCurrent.length > 0) {
                this.inputTextCurrent = this.inputTextCurrent.substring(0, this.inputTextCurrent.length - 1);
            }

            if (this.inputPmCurrent.length > 0) {
                this.inputPmCurrent = this.inputPmCurrent.substring(0, this.inputPmCurrent.length - 1);
            }
        }

        return false;
    }

    keyReleased(e) {
        e.preventDefault();

        let code = e.keyCode;

        if (code === KEYCODES.LEFT_ARROW) {
            this.keyLeft = false;
        } else if (code === KEYCODES.RIGHT_ARROW) {
            this.keyRight = false;
        } else if (code === KEYCODES.UP_ARROW) {
            this.keyUp = false;
        } else if (code === KEYCODES.DOWN_ARROW) {
            this.keyDown = false;
        } else if (code === KEYCODES.SPACE) {
            this.keySpace = false;
        } else if (code === KEYCODES.HOME) {
            this.keyHome = false;
        } else if (code === KEYCODES.PAGE_UP) {
            this.keyPgUp = false;
        } else if (code === KEYCODES.PAGE_DOWN) {
            this.keyPgDown = false;
        }

        return false;
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
        e.preventDefault();

        let x = e.offsetX;
        let y = e.offsetY;

        this.mouseX = x;
        this.mouseY = y;

        if (this.options.middleClickCamera && e.button === 1) {
            this.middleButtonDown = true;
            this.originRotation = this.cameraRotation;
            this.originMouseX = this.mouseX;
            return false;
        }

        if (e.metaKey || e.button === 2) {
            this.mouseButtonDown = 2;
        } else {
            this.mouseButtonDown = 1;
        }

        this.lastMouseButtonDown = this.mouseButtonDown;
        this.mouseActionTimeout = 0;
        this.handleMouseDown(this.mouseButtonDown, x, y);

        return false;
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
        let sleep = 1;
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

            let k1 = j;
            let lastSleep = sleep;

            j = 300;
            sleep = 1;

            let time = Date.now();

            if (this.timings[i] === 0) {
                j = k1;
                sleep = lastSleep;
            } else if (time > this.timings[i]) {
                j = ((2560 * this.targetFps) / (time - this.timings[i])) | 0;
            }

            if (j < 25) {
                j = 25;
            }

            if (j > 256) {
                j = 256;
                sleep = (this.targetFps - (time - this.timings[i]) / 10) | 0;

                if (sleep < this.threadSleep) {
                    sleep = this.threadSleep;
                }
            }

            await zzz(sleep);

            this.timings[i] = time;
            i = (i + 1) % 10;

            if (sleep > 1) {
                for (let j2 = 0; j2 < 10; j2++) {
                    if (this.timings[j2] !== 0) {
                        this.timings[j2] += sleep;
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

            this.mouseScrollDelta = 0;
        }
    }

    update(g) {
        this.paint(g);
    }

    paint() {
        if (this.loadingStep === 2 && this.imageLogo !== null) {
            this.drawLoadingScreen(this.loadingProgressPercent, this.loadingProgessText);
        }
    }

    async loadJagex() {
        this.graphics.setColor(Color.black);
        this.graphics.fillRect(0, 0, this.appletWidth, this.appletHeight);

        let buff = await this.readDataFile('jagex.jag', 'Jagex library', 0);

        if (buff !== null) {
            let logo = Utility.loadData('logo.tga', 0, buff);
            this.imageLogo = this.createImage(logo);
        }

        buff = await this.readDataFile(`fonts${VERSION.FONTS}.jag`, 'Game fonts', 5);

        if (buff !== null) {
            Surface.createFont(Utility.loadData('h11p.jf', 0, buff), 0);
            Surface.createFont(Utility.loadData('h12b.jf', 0, buff), 1);
            Surface.createFont(Utility.loadData('h12p.jf', 0, buff), 2);
            Surface.createFont(Utility.loadData('h13b.jf', 0, buff), 3);
            Surface.createFont(Utility.loadData('h14b.jf', 0, buff), 4);
            Surface.createFont(Utility.loadData('h16b.jf', 0, buff), 5);
            Surface.createFont(Utility.loadData('h20b.jf', 0, buff), 6);
            Surface.createFont(Utility.loadData('h24b.jf', 0, buff), 7);
        }
    }

    drawLoadingScreen(percent, text) {
        let midX = ((this.appletWidth - 281) / 2) | 0;
        let midY = ((this.appletHeight - 148) / 2) | 0;

        this.graphics.setColor(Color.black);
        this.graphics.fillRect(0, 0, this.appletWidth, this.appletHeight);

        if (!this.hasRefererLogoNotUsed) {
            this.graphics.drawImage(this.imageLogo, midX, midY/*, this*/);
        }

        midX += 2;
        midY += 90;

        this.loadingProgressPercent = percent;
        this.loadingProgessText = text;
        this.graphics.setColor(new Color(132, 132, 132));

        if (this.hasRefererLogoNotUsed) {
            this.graphics.setColor(new Color(220, 0, 0));
        }

        this.graphics.drawRect(midX - 2, midY - 2, 280, 23);
        this.graphics.fillRect(midX, midY, ((277 * percent) / 100) | 0, 20);
        this.graphics.setColor(new Color(198, 198, 198));

        if (this.hasRefererLogoNotUsed) {
            this.graphics.setColor(new Color(255, 255, 255));
        }

        this.drawString(this.graphics, text, this.fontTimesRoman15, midX + 138, midY + 10);

        if (!this.hasRefererLogoNotUsed) {
            this.drawString(this.graphics, 'Created by JAGeX - visit www.jagex.com', this.fontHelvetica13b, midX + 138, midY + 30);
            this.drawString(this.graphics, '\u00a92001-2002 Andrew Gower and Jagex Ltd', this.fontHelvetica13b, midX + 138, midY + 44);
        } else {
            this.graphics.setColor(new Color(132, 132, 152));
            this.drawString(this.graphics, '\u00a92001-2002 Andrew Gower and Jagex Ltd', this.fontHelvetica12, midX + 138, this.appletHeight - 20);
        }

        // not sure where this would have been used. maybe to indicate a special client?
        if (this.logoHeaderText !== null) {
            this.graphics.setColor(Color.white);
            this.drawString(this.graphics, this.logoHeaderText, this.fontHelvetica13b, midX + 138, midY - 120);
        }
    }

    showLoadingProgress(i, s) {
        let j = ((this.appletWidth - 281) / 2) | 0;
        let k = ((this.appletHeight - 148) / 2) | 0;
        j += 2;
        k += 90;

        this.loadingProgressPercent = i;
        this.loadingProgessText = s;

        let l = ((277 * i) / 100) | 0;
        this.graphics.setColor(new Color(132, 132, 132));

        if (this.hasRefererLogoNotUsed) {
            this.graphics.setColor(new Color(220, 0, 0));
        }

        this.graphics.fillRect(j, k, l, 20);
        this.graphics.setColor(Color.black);
        this.graphics.fillRect(j + l, k, 277 - l, 20);
        this.graphics.setColor(new Color(198, 198, 198));

        if (this.hasRefererLogoNotUsed) {
            this.graphics.setColor(new Color(255, 255, 255));
        }

        this.drawString(this.graphics, s, this.fontTimesRoman15, j + 138, k + 10);
    }

    drawString(g, s, font, i, j) {
        g.setFont(font);
        const { width, height } = g.ctx.measureText(s);
        g.drawString(s, i - ((width / 2) | 0), j + ((height / 4) | 0));
    }

    createImage(buff) {
        const tgaImage = new TGA();

        tgaImage.load(buff.buffer);

        const canvas = tgaImage.getCanvas();
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        return imageData;
    }

    async readDataFile(file, description, percent) {
        file = './data204/' + file;

        let archiveSize = 0;
        let archiveSizeCompressed = 0;
        let archiveData = null;

        this.showLoadingProgress(percent, 'Loading ' + description + ' - 0%');

        let fileDownloadStream = Utility.openFile(file);
        let header = new Int8Array(6);

        await fileDownloadStream.readFully(header, 0, 6);

        archiveSize = ((header[0] & 0xff) << 16) + ((header[1] & 0xff) << 8) + (header[2] & 0xff);
        archiveSizeCompressed = ((header[3] & 0xff) << 16) + ((header[4] & 0xff) << 8) + (header[5] & 0xff);

        this.showLoadingProgress(percent, 'Loading ' + description + ' - 5%');

        let read = 0;
        archiveData = new Int8Array(archiveSizeCompressed);

        while (read < archiveSizeCompressed) {
            let length = archiveSizeCompressed - read;

            if (length > 1000) {
                length = 1000;
            }

            await fileDownloadStream.readFully(archiveData, read, length);
            read += length;
            this.showLoadingProgress(percent, 'Loading ' + description + ' - ' + ((5 + (read * 95) / archiveSizeCompressed) | 0) + '%');
        }

        this.showLoadingProgress(percent, 'Unpacking ' + description);

        if (archiveSizeCompressed !== archiveSize) {
            let decompressed = new Int8Array(archiveSize);
            BZLib.decompress(decompressed, archiveSize, archiveData, archiveSizeCompressed, 0);
            return decompressed;
        } else {
            return archiveData;
        }
    }

    getGraphics() {
        //return new Graphics(this.canvas);
        return this._graphics;
    }

    async createSocket(s, i) {
        let socket = new Socket(s, i);
        await socket.connect();
        return socket;
    }
}

GameShell.gameFrame = null;
GameShell.charMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"\243$%^&*()-_=+[{]};:\'@#~,<.>/?\\| ';

module.exports = GameShell;
