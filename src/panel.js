const Surface = require('./surface');

const CONTROL_TYPES = {
    TEXT: 0,
    CENTRE_TEXT: 1,
    GRADIENT_BG: 2,
    HORIZ_LINE: 3,
    TEXT_LIST: 4,
    LIST_INPUT: 5,
    TEXT_INPUT: 6,
    HORIZ_OPTION: 7,
    VERT_OPTION: 8,
    I_TEXT_LIST: 9,
    BUTTON: 10,
    ROUND_BOX: 11,
    IMAGE: 12,
    CHECKBOX: 14
};

class Panel {
    constructor(surface, max) {
        this.controlCount = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseLastButtonDown = 0;
        this.mouseButtonDown = 0;
        this.mouseMetaButtonHeld = 0;

        this.focusControlIndex = -1;
        this.aBoolean219 = true;
        this.surface = surface;
        this.maxControls = max;
        this.controlShown = new Int8Array(max);
        this.controlListScrollbarHandleDragged = new Int8Array(max);
        this.controlMaskText = new Int8Array(max);
        this.controlClicked = new Int8Array(max);
        this.controlUseAlternativeColour = new Int8Array(max);
        this.controlFlashText = new Int32Array(max);// not so sure
        this.controlListEntryCount = new Int32Array(max);
        this.controlListEntryMouseButtonDown = new Int32Array(max);
        this.controlListEntryMouseOver = new Int32Array(max);
        this.controlX = new Int32Array(max);
        this.controlY = new Int32Array(max);
        this.controlType = new Int32Array(max);
        this.controlWidth = new Int32Array(max);
        this.controlHeight = new Int32Array(max);
        this.controlInputMaxLen = new Int32Array(max);
        this.controlTextSize = new Int32Array(max);

        this.controlText = [];
        this.controlText.length = max;

        this.controlListEntries = [];

        for (let i = 0; i < max; i += 1) {
            this.controlListEntries.push([]);
        }

        this.colourScrollbarTop = this.rgbToLongMod(114, 114, 176);
        this.colourScrollbarBottom = this.rgbToLongMod(14, 14, 62);
        this.colourScrollbarHandleLeft = this.rgbToLongMod(200, 208, 232);
        this.colourScrollbarHandleMid = this.rgbToLongMod(96, 129, 184);
        this.colourScrollbarHandleRight = this.rgbToLongMod(53, 95, 115);
        this.colourRoundedBoxOut = this.rgbToLongMod(117, 142, 171);
        this.colourRoundedBoxMid = this.rgbToLongMod(98, 122, 158);
        this.colourRoundedBoxIn = this.rgbToLongMod(86, 100, 136);
        this.colourBoxTopNBottom = this.rgbToLongMod(135, 146, 179);
        this.colourBoxTopNBottom2 = this.rgbToLongMod(97, 112, 151);
        this.colourBoxLeftNRight2 = this.rgbToLongMod(88, 102, 136);
        this.colourBoxLeftNRight = this.rgbToLongMod(84, 93, 120);
    }

    rgbToLongMod(i, j, k) {
        return Surface.rgbToLong(((Panel.redMod * i) / 114) | 0, ((Panel.greenMod * j) / 114) | 0, ((Panel.blueMod * k) / 176) | 0);
    }

    handleMouse(mx, my, lastMb, mbDown) {
        this.mouseX = mx;
        this.mouseY = my;
        this.mouseButtonDown = mbDown;

        if (lastMb !== 0) {
            this.mouseLastButtonDown = lastMb;
        }

        if (lastMb === 1) {
            for (let i1 = 0; i1 < this.controlCount; i1++) {
                if (this.controlShown[i1] && this.controlType[i1] === 10 && this.mouseX >= this.controlX[i1] && this.mouseY >= this.controlY[i1] && this.mouseX <= this.controlX[i1] + this.controlWidth[i1] && this.mouseY <= this.controlY[i1] + this.controlHeight[i1]) {
                    this.controlClicked[i1] = true;
                }

                if (this.controlShown[i1] && this.controlType[i1] === 14 && this.mouseX >= this.controlX[i1] && this.mouseY >= this.controlY[i1] && this.mouseX <= this.controlX[i1] + this.controlWidth[i1] && this.mouseY <= this.controlY[i1] + this.controlHeight[i1]) {
                    this.controlListEntryMouseButtonDown[i1] = 1 - this.controlListEntryMouseButtonDown[i1];
                }
            }
        }

        if (mbDown === 1) {
            this.mouseMetaButtonHeld++;
        } else {
            this.mouseMetaButtonHeld = 0;
        }

        if (lastMb === 1 || this.mouseMetaButtonHeld > 20) {
            for (let j1 = 0; j1 < this.controlCount; j1++) {
                if (this.controlShown[j1] && this.controlType[j1] === 15 && this.mouseX >= this.controlX[j1] && this.mouseY >= this.controlY[j1] && this.mouseX <= this.controlX[j1] + this.controlWidth[j1] && this.mouseY <= this.controlY[j1] + this.controlHeight[j1]) {
                    this.controlClicked[j1] = true;
                }
            }

            this.mouseMetaButtonHeld -= 5;
        }
    }

    isClicked(i) {
        if (this.controlShown[i] && this.controlClicked[i]) {
            this.controlClicked[i] = false;
            return true;
        } else {
            return false;
        }
    }

    keyPress(key) {
        if (key === 0) {
            return;
        }

        if (this.focusControlIndex !== -1 && this.controlText[this.focusControlIndex] !== null && this.controlShown[this.focusControlIndex]) {
            let inputLen = this.controlText[this.focusControlIndex].length;

            if (key === 8 && inputLen > 0) {
                this.controlText[this.focusControlIndex] = this.controlText[this.focusControlIndex].slice(0, inputLen - 1);
            }

            if ((key === 10 || key === 13) && inputLen > 0) {
                this.controlClicked[this.focusControlIndex] = true;
            }

            let s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"£$%^&*()-_=+[{]};:\'@#~,<.>/?\\| ';

            if (inputLen < this.controlInputMaxLen[this.focusControlIndex]) {
                for (let k = 0; k < s.length; k++) {
                    if (key === s.charCodeAt(k)) {
                        this.controlText[this.focusControlIndex] += String.fromCharCode(key);
                    }
                }
            }

            if (key === 9) {
                do {
                    this.focusControlIndex = (this.focusControlIndex + 1) % this.controlCount;
                } while (this.controlType[this.focusControlIndex] !== 5 && this.controlType[this.focusControlIndex] !== 6);
            }
        }
    }

    drawPanel() {
        for (let i = 0; i < this.controlCount; i++) {
            if (this.controlShown[i]) {
                if (this.controlType[i] === CONTROL_TYPES.TEXT) {
                    this.drawText(i, this.controlX[i], this.controlY[i], this.controlText[i], this.controlTextSize[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.CENTRE_TEXT) {
                    this.drawText(i, this.controlX[i] - ((this.surface.textWidth(this.controlText[i], this.controlTextSize[i]) / 2) | 0), this.controlY[i], this.controlText[i], this.controlTextSize[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.GRADIENT_BG) {
                    this.drawBox(this.controlX[i], this.controlY[i], this.controlWidth[i], this.controlHeight[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.HORIZ_LINE) {
                    this.drawLineHoriz(this.controlX[i], this.controlY[i], this.controlWidth[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.TEXT_LIST) {
                    this.drawTextList(i, this.controlX[i], this.controlY[i], this.controlWidth[i], this.controlHeight[i], this.controlTextSize[i], this.controlListEntries[i], this.controlListEntryCount[i], this.controlFlashText[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.LIST_INPUT || this.controlType[i] === CONTROL_TYPES.TEXT_INPUT) {
                    this.drawTextInput(i, this.controlX[i], this.controlY[i], this.controlWidth[i], this.controlHeight[i], this.controlText[i], this.controlTextSize[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.HORIZ_OPTION) {
                    this.drawOptionListHoriz(i, this.controlX[i], this.controlY[i], this.controlTextSize[i], this.controlListEntries[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.VERT_OPTION) {
                    this.drawOptionListVert(i, this.controlX[i], this.controlY[i], this.controlTextSize[i], this.controlListEntries[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.I_TEXT_LIST) {
                    this.drawTextListInteractive(i, this.controlX[i], this.controlY[i], this.controlWidth[i], this.controlHeight[i], this.controlTextSize[i], this.controlListEntries[i], this.controlListEntryCount[i], this.controlFlashText[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.ROUND_BOX) {
                    this.drawRoundedBox(this.controlX[i], this.controlY[i], this.controlWidth[i], this.controlHeight[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.IMAGE) {
                    this.drawPicture(this.controlX[i], this.controlY[i], this.controlTextSize[i]);
                } else if (this.controlType[i] === CONTROL_TYPES.CHECKBOX) {
                    this.drawCheckbox(i, this.controlX[i], this.controlY[i], this.controlWidth[i], this.controlHeight[i]);
                }
            }
        }

        this.mouseLastButtonDown = 0;
    }

    drawCheckbox(control, x, y, width, height) {
        this.surface.drawBox(x, y, width, height, 0xffffff);
        this.surface.drawLineHoriz(x, y, width, this.colourBoxTopNBottom);
        this.surface.drawLineVert(x, y, height, this.colourBoxTopNBottom);
        this.surface.drawLineHoriz(x, (y + height) - 1, width, this.colourBoxLeftNRight);
        this.surface.drawLineVert((x + width) - 1, y, height, this.colourBoxLeftNRight);

        if (this.controlListEntryMouseButtonDown[control] === 1) {
            for (let j1 = 0; j1 < height; j1++) {
                this.surface.drawLineHoriz(x + j1, y + j1, 1, 0);
                this.surface.drawLineHoriz((x + width) - 1 - j1, y + j1, 1, 0);
            }
        }
    }

    drawText(control, x, y, text, textSize) {
        let y2 = y + ((this.surface.textHeight(textSize) / 3) | 0);
        this.drawString(control, x, y2, text, textSize);
    }

    drawString(control, x, y, text, textSize) {
        let i1;

        if (this.controlUseAlternativeColour[control]) {
            i1 = 0xffffff;
        } else {
            i1 = 0;
        }

        this.surface.drawString(text, x, y, textSize, i1);
    }

    drawTextInput(control, x, y, width, height, text, textSize) {
        // password
        if (this.controlMaskText[control]) {
            let len = text.length;
            text = '';

            for (let i2 = 0; i2 < len; i2++) {
                text = text + 'X';
            }
        }

        if (this.controlType[control] == CONTROL_TYPES.LIST_INPUT) {
            if (this.mouseLastButtonDown === 1 && this.mouseX >= x && this.mouseY >= y - ((height / 2) | 0) && this.mouseX <= x + width && this.mouseY <= y + ((height / 2) | 0)) {
                this.focusControlIndex = control;
            }
        } else if (this.controlType[control] === CONTROL_TYPES.TEXT_INPUT) {
            if (this.mouseLastButtonDown === 1 && this.mouseX >= x - ((width / 2) | 0) && this.mouseY >= y - ((height / 2) | 0) && this.mouseX <= x + width / 2 && this.mouseY <= y + ((height / 2) |0)) {
                this.focusControlIndex = control;
            }

            x -= (this.surface.textWidth(text, textSize) / 2) | 0;
        }

        if (this.focusControlIndex === control) {
            text = text + '*';
        }

        let y2 = y + ((this.surface.textHeight(textSize) / 3) | 0);
        this.drawString(control, x, y2, text, textSize);
    }


    drawBox(x, y, width, height) {
        this.surface.setBounds(x, y, x + width, y + height);
        this.surface.drawGradient(x, y, width, height, this.colourBoxLeftNRight, this.colourBoxTopNBottom);

        if (Panel.drawBackgroundArrow) {
            for (let i1 = x - (y & 0x3f); i1 < x + width; i1 += 128) {
                for (let j1 = y - (y & 0x1f); j1 < y + height; j1 += 128) {
                    this.surface.drawSpriteAlpha(i1, j1, 6 + Panel.baseSpriteStart, 128);
                }
            }
        }

        this.surface.drawLineHoriz(x, y, width, this.colourBoxTopNBottom);
        this.surface.drawLineHoriz(x + 1, y + 1, width - 2, this.colourBoxTopNBottom);
        this.surface.drawLineHoriz(x + 2, y + 2, width - 4, this.colourBoxTopNBottom2);
        this.surface.drawLineVert(x, y, height, this.colourBoxTopNBottom);
        this.surface.drawLineVert(x + 1, y + 1, height - 2, this.colourBoxTopNBottom);
        this.surface.drawLineVert(x + 2, y + 2, height - 4, this.colourBoxTopNBottom2);
        this.surface.drawLineHoriz(x, (y + height) - 1, width, this.colourBoxLeftNRight);
        this.surface.drawLineHoriz(x + 1, (y + height) - 2, width - 2, this.colourBoxLeftNRight);
        this.surface.drawLineHoriz(x + 2, (y + height) - 3, width - 4, this.colourBoxLeftNRight2);
        this.surface.drawLineVert((x + width) - 1, y, height, this.colourBoxLeftNRight);
        this.surface.drawLineVert((x + width) - 2, y + 1, height - 2, this.colourBoxLeftNRight);
        this.surface.drawLineVert((x + width) - 3, y + 2, height - 4, this.colourBoxLeftNRight2);
        this.surface.resetBounds();
    }

    drawRoundedBox(x, y, width, height) {
        this.surface.drawBox(x, y, width, height, 0);
        this.surface.drawBoxEdge(x, y, width, height, this.colourRoundedBoxOut);
        this.surface.drawBoxEdge(x + 1, y + 1, width - 2, height - 2, this.colourRoundedBoxMid);
        this.surface.drawBoxEdge(x + 2, y + 2, width - 4, height - 4, this.colourRoundedBoxIn);
        this.surface._drawSprite_from3(x, y, 2 + Panel.baseSpriteStart);
        this.surface._drawSprite_from3((x + width) - 7, y, 3 + Panel.baseSpriteStart);
        this.surface._drawSprite_from3(x, (y + height) - 7, 4 + Panel.baseSpriteStart);
        this.surface._drawSprite_from3((x + width) - 7, (y + height) - 7, 5 + Panel.baseSpriteStart);
    }

    drawPicture(x, y, size) {
        this.surface._drawSprite_from3(x, y, size);
    }

    drawLineHoriz(x, y, width) {
        this.surface.drawLineHoriz(x, y, width, 0xffffff);
    }

    drawTextList(control, x, y, width, height, textSize, listEntries, listEntryCount, l1) {
        let displayedEntryCount = (height / this.surface.textHeight(textSize)) | 0;

        if (l1 > listEntryCount - displayedEntryCount) {
            l1 = listEntryCount - displayedEntryCount;
        }

        if (l1 < 0) {
            l1 = 0;
        }

        this.controlFlashText[control] = l1;

        if (displayedEntryCount < listEntryCount) {
            let cornerTopRight = (x + width) - 12;
            let cornerBottomLeft = (((height - 27) * displayedEntryCount) / listEntryCount) | 0;

            if (cornerBottomLeft < 6) {
                cornerBottomLeft = 6;
            }

            let j3 = (((height - 27 - cornerBottomLeft) * l1) / (listEntryCount - displayedEntryCount)) | 0;

            if (this.mouseButtonDown === 1 && this.mouseX >= cornerTopRight && this.mouseX <= cornerTopRight + 12) {
                if (this.mouseY > y && this.mouseY < y + 12 && l1 > 0) {
                    l1--;
                }

                if (this.mouseY > (y + height) - 12 && this.mouseY < y + height && l1 < listEntryCount - displayedEntryCount) {
                    l1++;
                }

                this.controlFlashText[control] = l1;
            }

            if (this.mouseButtonDown === 1 && (this.mouseX >= cornerTopRight && this.mouseX <= cornerTopRight + 12 || this.mouseX >= cornerTopRight - 12 && this.mouseX <= cornerTopRight + 24 && this.controlListScrollbarHandleDragged[control])) {
                if (this.mouseY > y + 12 && this.mouseY < (y + height) - 12) {
                    this.controlListScrollbarHandleDragged[control] = true;
                    let l3 = this.mouseY - y - 12 - ((cornerBottomLeft / 2) | 0);
                    l1 = ((l3 * listEntryCount) / (height - 24)) | 0;

                    if (l1 > listEntryCount - displayedEntryCount) {
                        l1 = listEntryCount - displayedEntryCount;
                    }

                    if (l1 < 0) {
                        l1 = 0;
                    }

                    this.controlFlashText[control] = l1;
                }
            } else {
                this.controlListScrollbarHandleDragged[control] = false;
            }

            j3 = (((height - 27 - cornerBottomLeft) * l1) / (listEntryCount - displayedEntryCount)) | 0;
            this.drawListContainer(x, y, width, height, j3, cornerBottomLeft);
        }
        
        let entryListStartY = height - displayedEntryCount * this.surface.textHeight(textSize);
        let y2 = y + ((this.surface.textHeight(textSize) * 5) / 6 + entryListStartY / 2) | 0;

        for (let entry = l1; entry < listEntryCount; entry++) {
            this.drawString(control, x + 2, y2, listEntries[entry], textSize);
            y2 += this.surface.textHeight(textSize) - Panel.textListEntryHeightMod;

            if (y2 >= y + height) {
                return;
            }
        }
    }

    drawListContainer(x, y, width, height, corner1, corner2) {
        let x2 = (x + width) - 12;
        this.surface.drawBoxEdge(x2, y, 12, height, 0);
        this.surface._drawSprite_from3(x2 + 1, y + 1, Panel.baseSpriteStart); // up arrow?
        this.surface._drawSprite_from3(x2 + 1, (y + height) - 12, 1 + Panel.baseSpriteStart); // down arrow?
        this.surface.drawLineHoriz(x2, y + 13, 12, 0);
        this.surface.drawLineHoriz(x2, (y + height) - 13, 12, 0);
        this.surface.drawGradient(x2 + 1, y + 14, 11, height - 27, this.colourScrollbarTop, this.colourScrollbarBottom);
        this.surface.drawBox(x2 + 3, corner1 + y + 14, 7, corner2, this.colourScrollbarHandleMid);
        this.surface.drawLineVert(x2 + 2, corner1 + y + 14, corner2, this.colourScrollbarHandleLeft);
        this.surface.drawLineVert(x2 + 2 + 8, corner1 + y + 14, corner2, this.colourScrollbarHandleRight);
    }

    drawOptionListHoriz(control, x, y, textSize, listEntries) {
        let listTotalTextWidth = 0;
        let listEntryCount = listEntries.length;

        for (let idx = 0; idx < listEntryCount; idx++) {
            listTotalTextWidth += this.surface.textWidth(listEntries[idx], textSize);

            if (idx < listEntryCount - 1) {
                listTotalTextWidth += this.surface.textWidth('  ', textSize);
            }
        }

        let left = x - ((listTotalTextWidth / 2) | 0);
        let bottom = y + ((this.surface.textHeight(textSize) / 3) | 0);

        for (let idx = 0; idx < listEntryCount; idx++) {
            let colour;

            if (this.controlUseAlternativeColour[control]) {
                colour = 0xffffff;
            } else {
                colour = 0;
            }

            if (this.mouseX >= left && this.mouseX <= left + this.surface.textWidth(listEntries[idx], textSize) && this.mouseY <= bottom && this.mouseY > bottom - this.surface.textHeight(textSize)) {
                if (this.controlUseAlternativeColour[control]) {
                    colour = 0x808080;
                } else {
                    colour = 0xffffff;
                }

                if (this.mouseLastButtonDown === 1) {
                    this.controlListEntryMouseButtonDown[control] = idx;
                    this.controlClicked[control] = true;
                }
            }

            if (this.controlListEntryMouseButtonDown[control] === idx) {
                if (this.controlUseAlternativeColour[control]) {
                    colour = 0xff0000;
                } else {
                    colour = 0xc00000;
                }
            }

            this.surface.drawString(listEntries[idx], left, bottom, textSize, colour);
            left += this.surface.textWidth(listEntries[idx] + '  ', textSize);
        }
    }

    drawOptionListVert(control, x, y, textSize, listEntries) {
        let listEntryCount = listEntries.length;
        let listTotalTextHeightMid = y - (((this.surface.textHeight(textSize) * (listEntryCount - 1)) / 2) | 0);

        for (let idx = 0; idx < listEntryCount; idx++) {
            let colour;

            if (this.controlUseAlternativeColour[control]) {
                colour = 0xffffff;
            } else {
                colour = 0;
            }

            let entryTextWidth = this.surface.textWidth(listEntries[idx], textSize);

            if (this.mouseX >= x - ((entryTextWidth / 2) | 0) && this.mouseX <= x + ((entryTextWidth / 2) | 0) && this.mouseY - 2 <= listTotalTextHeightMid && this.mouseY - 2 > listTotalTextHeightMid - this.surface.textHeight(textSize)) {
                if (this.controlUseAlternativeColour[control]) {
                    colour = 0x808080;
                } else {
                    colour = 0xffffff;
                }

                if (this.mouseLastButtonDown === 1) {
                    this.controlListEntryMouseButtonDown[control] = idx;
                    this.controlClicked[control] = true;
                }
            }

            if (this.controlListEntryMouseButtonDown[control] === idx) {
                if (this.controlUseAlternativeColour[control]) {
                    colour = 0xff0000;
                } else {
                    colour = 0xc00000;
                }
            }

            this.surface.drawString(listEntries[idx], x - ((entryTextWidth / 2) | 0), listTotalTextHeightMid, textSize, colour);
            listTotalTextHeightMid += this.surface.textHeight(textSize);
        }
    }

    drawTextListInteractive(control, x, y, width, height, textSize, listEntries, listEntryCount, l1) {
        let displayedEntryCount = (height / this.surface.textHeight(textSize)) | 0;

        if (displayedEntryCount < listEntryCount) {
            let right = (x + width) - 12;
            let l2 = (((height - 27) * displayedEntryCount) / listEntryCount) | 0;

            if (l2 < 6) {
                l2 = 6;
            }

            let j3 = (((height - 27 - l2) * l1) / (listEntryCount - displayedEntryCount)) | 0;

            if (this.mouseButtonDown === 1 && this.mouseX >= right && this.mouseX <= right + 12) { 
                if (this.mouseY > y && this.mouseY < y + 12 && l1 > 0) {
                    l1--;
                }

                if (this.mouseY > (y + height) - 12 && this.mouseY < y + height && l1 < listEntryCount - displayedEntryCount) {
                    l1++;
                }

                this.controlFlashText[control] = l1;
            }

            if (this.mouseButtonDown == 1 && (this.mouseX >= right && this.mouseX <= right + 12 || this.mouseX >= right - 12 && this.mouseX <= right + 24 && this.controlListScrollbarHandleDragged[control])) {
                if (this.mouseY > y + 12 && this.mouseY < (y + height) - 12) {
                    this.controlListScrollbarHandleDragged[control] = true;

                    let l3 = this.mouseY - y - 12 - ((l2 / 2) | 0);
                    l1 = ((l3 * listEntryCount) / (height - 24)) | 0;

                    if (l1 < 0) {
                        l1 = 0;
                    }

                    if (l1 > listEntryCount - displayedEntryCount) {
                        l1 = listEntryCount - displayedEntryCount;
                    }

                    this.controlFlashText[control] = l1;
                }
            } else {
                this.controlListScrollbarHandleDragged[control] = false;
            }

            j3 = (((height - 27 - l2) * l1) / (listEntryCount - displayedEntryCount)) | 0;
            this.drawListContainer(x, y, width, height, j3, l2);
        } else {
            l1 = 0;
            this.controlFlashText[control] = 0;
        }

        this.controlListEntryMouseOver[control] = -1;
        let k2 = height - displayedEntryCount * this.surface.textHeight(textSize);
        let i3 = y + (((((this.surface.textHeight(textSize) * 5) / 6) | 0) + k2 / 2) | 0);
        

        for (let k3 = l1; k3 < listEntryCount; k3++) {
            let i4;

            if (this.controlUseAlternativeColour[control]) {
                i4 = 0xffffff;
            } else {
                i4 = 0;
            }

            if (this.mouseX >= x + 2 && this.mouseX <= x + 2 + this.surface.textWidth(listEntries[k3], textSize) && this.mouseY - 2 <= i3 && this.mouseY - 2 > i3 - this.surface.textHeight(textSize)) {
                if (this.controlUseAlternativeColour[control]) {
                    i4 = 0x808080;
                } else {
                    i4 = 0xffffff;
                }

                this.controlListEntryMouseOver[control] = k3;

                if (this.mouseLastButtonDown === 1) {
                    this.controlListEntryMouseButtonDown[control] = k3;
                    this.controlClicked[control] = true;
                }
            }

            if (this.controlListEntryMouseButtonDown[control] === k3 && this.aBoolean219) {
                i4 = 0xff0000;
            }

            this.surface.drawString(listEntries[k3], x + 2, i3, textSize, i4);
            i3 += this.surface.textHeight(textSize);

            if (i3 >= y + height) {
                return;
            }
        }
    }

    addText(x, y, text, size, flag) {
        this.controlType[this.controlCount] = 1;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlTextSize[this.controlCount] = size;
        this.controlUseAlternativeColour[this.controlCount] = flag;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlText[this.controlCount] = text;

        return this.controlCount++;
    }

    addButtonBackground(x, y, width, height) {
        this.controlType[this.controlCount] = 2;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x - ((width / 2) | 0);
        this.controlY[this.controlCount] = y - ((height / 2) | 0);
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;

        return this.controlCount++;
    }

    addBoxRounded(x, y, width, height) {
        this.controlType[this.controlCount] = 11;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x - ((width / 2) | 0);
        this.controlY[this.controlCount] = y - ((height / 2) | 0);
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;

        return this.controlCount++;
    }

    addSprite(x, y, spriteId) {
        let imgWidth = this.surface.spriteWidth[spriteId];
        let imgHeight = this.surface.spriteHeight[spriteId];

        this.controlType[this.controlCount] = CONTROL_TYPES.IMAGE;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x - ((imgWidth / 2) | 0);
        this.controlY[this.controlCount] = y - ((imgHeight / 2) | 0);
        this.controlWidth[this.controlCount] = imgWidth;
        this.controlHeight[this.controlCount] = imgHeight;
        this.controlTextSize[this.controlCount] = spriteId;

        return this.controlCount++;
    }

    addTextList(x, y, width, height, size, maxLength, flag) {
        this.controlType[this.controlCount] = CONTROL_TYPES.TEXT_LIST;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;
        this.controlUseAlternativeColour[this.controlCount] = flag;
        this.controlTextSize[this.controlCount] = size;
        this.controlInputMaxLen[this.controlCount] = maxLength;
        this.controlListEntryCount[this.controlCount] = 0;
        this.controlFlashText[this.controlCount] = 0;
        this.controlListEntries[this.controlCount] = [];
        this.controlListEntries[this.controlCount].length = maxLength;
        this.controlListEntries[this.controlCount].fill(null);
        
        return this.controlCount++;
    }

    addTextListInput(x, y, width, height, size, maxLength, flag, flag1) {
        this.controlType[this.controlCount] = CONTROL_TYPES.LIST_INPUT;
        this.controlShown[this.controlCount] = true;
        this.controlMaskText[this.controlCount] = flag;
        this.controlClicked[this.controlCount] = false;
        this.controlTextSize[this.controlCount] = size;
        this.controlUseAlternativeColour[this.controlCount] = flag1;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;
        this.controlInputMaxLen[this.controlCount] = maxLength;
        this.controlText[this.controlCount] = '';
        
        return this.controlCount++;
    }

    addTextInput(x, y, width, height, size, maxLength, flag, flag1) {
        this.controlType[this.controlCount] = CONTROL_TYPES.TEXT_INPUT;
        this.controlShown[this.controlCount] = true;
        this.controlMaskText[this.controlCount] = flag;
        this.controlClicked[this.controlCount] = false;
        this.controlTextSize[this.controlCount] = size;
        this.controlUseAlternativeColour[this.controlCount] = flag1;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;
        this.controlInputMaxLen[this.controlCount] = maxLength;
        this.controlText[this.controlCount] = '';

        return this.controlCount++;
    }

    addTextListInteractive(x, y, width, height, textSize, maxLength, flag) {
        this.controlType[this.controlCount] = CONTROL_TYPES.I_TEXT_LIST;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlTextSize[this.controlCount] = textSize;
        this.controlUseAlternativeColour[this.controlCount] = flag;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;
        this.controlInputMaxLen[this.controlCount] = maxLength;
        this.controlListEntries[this.controlCount] = [];
        this.controlListEntries[this.controlCount].length = maxLength;
        this.controlListEntries[this.controlCount].fill(null);
        this.controlListEntryCount[this.controlCount] = 0;
        this.controlFlashText[this.controlCount] = 0;
        this.controlListEntryMouseButtonDown[this.controlCount] = -1;
        this.controlListEntryMouseOver[this.controlCount] = -1;

        return this.controlCount++;
    }

    addButton(x, y, width, height) {
        this.controlType[this.controlCount] = CONTROL_TYPES.BUTTON;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x - ((width / 2) | 0);
        this.controlY[this.controlCount] = y - ((height / 2) | 0);
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;

        return this.controlCount++;
    }

    addLineHoriz(x, y, width) {
        this.controlType[this.controlCount] = CONTROL_TYPES.HORIZ_LINE;
        this.controlShown[this.controlCount] = true;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;

        return this.controlCount++;
    }

    addOptionListHoriz(x, y, textSize, maxListCount, useAltColour) {
        this.controlType[this.controlCount] = CONTROL_TYPES.HORIZ_OPTION;
        this.controlShown[this.controlCount] = true;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlTextSize[this.controlCount] = textSize;
        this.controlListEntries[this.controlCount] = [];
        this.controlListEntries[this.controlCount].length = maxListCount;
        this.controlListEntries[this.controlCount].fill(null);
        this.controlListEntryCount[this.controlCount] = 0;
        this.controlUseAlternativeColour[this.controlCount] = useAltColour;
        this.controlClicked[this.controlCount] = false;

        return this.controlCount++;
    }

    addOptionListVert(x, y, textSize, maxListCount, useAltColour) {
        this.controlType[this.controlCount] = CONTROL_TYPES.VERT_OPTION;
        this.controlShown[this.controlCount] = true;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlTextSize[this.controlCount] = textSize;
        this.controlListEntries[this.controlCount] = [];
        this.controlListEntries[this.controlCount].length = maxListCount;
        this.controlListEntries[this.controlCount].fill(null);
        this.controlListEntryCount[this.controlCount] = 0;
        this.controlUseAlternativeColour[this.controlCount] = useAltColour;
        this.controlClicked[this.controlCount] = false;

        return this.controlCount++;
    }

    addCheckbox(x, y, width, height) {
        this.controlType[this.controlCount] = CONTROL_TYPES.CHECKBOX;
        this.controlShown[this.controlCount] = true;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;
        this.controlListEntryMouseButtonDown[this.controlCount] = 0;

        return this.controlCount++;
    }

    clearList(control) {
        this.controlListEntryCount[control] = 0;
    }

    resetListProps(control) {
        this.controlFlashText[control] = 0;
        this.controlListEntryMouseOver[control] = -1;
    }

    addListEntry(control, index, text) {
        this.controlListEntries[control][index] = text;

        if (index + 1 > this.controlListEntryCount[control]) {
            this.controlListEntryCount[control] = index + 1;
        }
    }

    removeListEntry(control, text, flag) {
        let j = this.controlListEntryCount[control]++;

        if (j >= this.controlInputMaxLen[control]) {
            j--;

            this.controlListEntryCount[control]--;

            for (let k = 0; k < j; k++) {
                this.controlListEntries[control][k] = this.controlListEntries[control][k + 1];
            }
        }

        this.controlListEntries[control][j] = text;

        if (flag) {
            this.controlFlashText[control] = 999999; // 0xf423f;
        }
    }

    updateText(control, s) {
        this.controlText[control] = s;
    }

    getText(control) {
        if (this.controlText[control] === null) {
            return 'null';
        } else {
            return this.controlText[control];
        }
    }

    show(control) {
        this.controlShown[control] = true;
    }

    hide(control) {
        this.controlShown[control] = false;
    }

    setFocus(control) {
        this.focusControlIndex = control;
    }

    getListEntryIndex(control) {
        return this.controlListEntryMouseOver[control];
    }
}

Panel.drawBackgroundArrow = true;
Panel.baseSpriteStart = 0;
Panel.redMod = 114;
Panel.greenMod = 114;
Panel.blueMod = 176;
Panel.textListEntryHeightMod = 0;

module.exports = Panel;