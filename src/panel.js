const Surface = require('./surface');

const controlTypes = {
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

const CHAR_SET =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"£$%^&*()' +
    "-_=+[{]};:'@#~,<.>/?\\| ";

class Panel {
    constructor(surface, max) {
        this.controlCount = 0;

        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseLastButtonDown = 0;
        this.mouseButtonDown = 0;
        this.mouseMetaButtonHeld = 0;
        this.mouseScrollDelta = 0;

        this.focusControlIndex = -1;
        this.aBoolean219 = true;
        this.surface = surface;
        this.maxControls = max;
        this.controlShown = new Int8Array(max);
        this.controlListScrollbarHandleDragged = new Int8Array(max);
        this.controlMaskText = new Int8Array(max);
        this.controlClicked = new Int8Array(max);
        this.controlUseAlternativeColour = new Int8Array(max);
        this.controlFlashText = new Int32Array(max);
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

        this.colourScrollbarTop = this.rgbToIntMod(114, 114, 176);
        this.colourScrollbarBottom = this.rgbToIntMod(14, 14, 62);
        this.colourScrollbarHandleLeft = this.rgbToIntMod(200, 208, 232);
        this.colourScrollbarHandleMid = this.rgbToIntMod(96, 129, 184);
        this.colourScrollbarHandleRight = this.rgbToIntMod(53, 95, 115);
        this.colourRoundedBoxOut = this.rgbToIntMod(117, 142, 171);
        this.colourRoundedBoxMid = this.rgbToIntMod(98, 122, 158);
        this.colourRoundedBoxIn = this.rgbToIntMod(86, 100, 136);
        this.colourBoxTopNBottom = this.rgbToIntMod(135, 146, 179);
        this.colourBoxTopNBottom2 = this.rgbToIntMod(97, 112, 151);
        this.colourBoxLeftNRight2 = this.rgbToIntMod(88, 102, 136);
        this.colourBoxLeftNRight = this.rgbToIntMod(84, 93, 120);
    }

    rgbToIntMod(r, g, b) {
        return Surface.rgbToInt(
            ((Panel.redMod * r) / 114) | 0,
            ((Panel.greenMod * g) / 114) | 0,
            ((Panel.blueMod * b) / 176) | 0
        );
    }

    handleMouse(x, y, lastButton, isDown, scrollDelta = 0) {
        this.mouseX = x;
        this.mouseY = y;
        this.mouseButtonDown = isDown;
        this.mouseScrollDelta = scrollDelta;

        if (lastButton !== 0) {
            this.mouseLastButtonDown = lastButton;
        }

        if (lastButton === 1) {
            for (let i = 0; i < this.controlCount; i++) {
                if (
                    this.controlShown[i] &&
                    this.controlType[i] === controlTypes.BUTTON &&
                    this.mouseX >= this.controlX[i] &&
                    this.mouseY >= this.controlY[i] &&
                    this.mouseX <= this.controlX[i] + this.controlWidth[i] &&
                    this.mouseY <= this.controlY[i] + this.controlHeight[i]
                ) {
                    this.controlClicked[i] = true;
                }

                if (
                    this.controlShown[i] &&
                    this.controlType[i] === controlTypes.CHECKBOX &&
                    this.mouseX >= this.controlX[i] &&
                    this.mouseY >= this.controlY[i] &&
                    this.mouseX <= this.controlX[i] + this.controlWidth[i] &&
                    this.mouseY <= this.controlY[i] + this.controlHeight[i]
                ) {
                    this.controlListEntryMouseButtonDown[i] =
                        1 - this.controlListEntryMouseButtonDown[i];
                }
            }
        }

        if (isDown === 1) {
            this.mouseMetaButtonHeld++;
        } else {
            this.mouseMetaButtonHeld = 0;
        }

        // TODO i don't think we need this? what was controlType 15?
        /*if (lastButton === 1 || this.mouseMetaButtonHeld > 20) {
            for (let i = 0; i < this.controlCount; i++) {
                if (
                    this.controlShown[i] &&
                    this.controlType[i] === 15 &&
                    this.mouseX >= this.controlX[i] &&
                    this.mouseY >= this.controlY[i] &&
                    this.mouseX <= this.controlX[i] + this.controlWidth[i] &&
                    this.mouseY <= this.controlY[i] + this.controlHeight[i]
                ) {
                    this.controlClicked[i] = true;
                }
            }

            this.mouseMetaButtonHeld -= 5;
        }*/
    }

    isClicked(control) {
        if (this.controlShown[control] && this.controlClicked[control]) {
            this.controlClicked[control] = false;
            return true;
        }

        return false;
    }

    keyPress(key) {
        if (key === 0) {
            return;
        }

        if (
            this.focusControlIndex !== -1 &&
            this.controlText[this.focusControlIndex] !== null &&
            this.controlShown[this.focusControlIndex]
        ) {
            const inputLen = this.controlText[this.focusControlIndex].length;

            if (key === 8 && inputLen > 0) {
                this.controlText[this.focusControlIndex] = this.controlText[
                    this.focusControlIndex
                ].slice(0, inputLen - 1);
            }

            if ((key === 10 || key === 13) && inputLen > 0) {
                this.controlClicked[this.focusControlIndex] = true;
            }

            if (inputLen < this.controlInputMaxLen[this.focusControlIndex]) {
                for (let k = 0; k < CHAR_SET.length; k++) {
                    if (key === CHAR_SET.charCodeAt(k)) {
                        this.controlText[
                            this.focusControlIndex
                        ] += String.fromCharCode(key);
                    }
                }
            }

            if (key === 9) {
                do {
                    this.focusControlIndex =
                        (this.focusControlIndex + 1) % this.controlCount;
                } while (
                    this.controlType[this.focusControlIndex] !== 5 &&
                    this.controlType[this.focusControlIndex] !== 6
                );
            }
        }
    }

    drawPanel() {
        for (let i = 0; i < this.controlCount; i++) {
            if (this.controlShown[i]) {
                if (this.controlType[i] === controlTypes.TEXT) {
                    this.drawText(
                        i,
                        this.controlX[i],
                        this.controlY[i],
                        this.controlText[i],
                        this.controlTextSize[i]
                    );
                } else if (this.controlType[i] === controlTypes.CENTRE_TEXT) {
                    this.drawText(
                        i,
                        this.controlX[i] -
                            ((this.surface.textWidth(
                                this.controlText[i],
                                this.controlTextSize[i]
                            ) /
                                2) |
                                0),
                        this.controlY[i],
                        this.controlText[i],
                        this.controlTextSize[i]
                    );
                } else if (this.controlType[i] === controlTypes.GRADIENT_BG) {
                    this.drawBox(
                        this.controlX[i],
                        this.controlY[i],
                        this.controlWidth[i],
                        this.controlHeight[i]
                    );
                } else if (this.controlType[i] === controlTypes.HORIZ_LINE) {
                    this.drawLineHoriz(
                        this.controlX[i],
                        this.controlY[i],
                        this.controlWidth[i]
                    );
                } else if (this.controlType[i] === controlTypes.TEXT_LIST) {
                    this.drawTextList(
                        i,
                        this.controlX[i],
                        this.controlY[i],
                        this.controlWidth[i],
                        this.controlHeight[i],
                        this.controlTextSize[i],
                        this.controlListEntries[i],
                        this.controlListEntryCount[i],
                        this.controlFlashText[i]
                    );
                } else if (
                    this.controlType[i] === controlTypes.LIST_INPUT ||
                    this.controlType[i] === controlTypes.TEXT_INPUT
                ) {
                    this.drawTextInput(
                        i,
                        this.controlX[i],
                        this.controlY[i],
                        this.controlWidth[i],
                        this.controlHeight[i],
                        this.controlText[i],
                        this.controlTextSize[i]
                    );
                } else if (this.controlType[i] === controlTypes.HORIZ_OPTION) {
                    this.drawOptionListHoriz(
                        i,
                        this.controlX[i],
                        this.controlY[i],
                        this.controlTextSize[i],
                        this.controlListEntries[i]
                    );
                } else if (this.controlType[i] === controlTypes.VERT_OPTION) {
                    this.drawOptionListVert(
                        i,
                        this.controlX[i],
                        this.controlY[i],
                        this.controlTextSize[i],
                        this.controlListEntries[i]
                    );
                } else if (this.controlType[i] === controlTypes.I_TEXT_LIST) {
                    this.drawTextListInteractive(
                        i,
                        this.controlX[i],
                        this.controlY[i],
                        this.controlWidth[i],
                        this.controlHeight[i],
                        this.controlTextSize[i],
                        this.controlListEntries[i],
                        this.controlListEntryCount[i],
                        this.controlFlashText[i]
                    );
                } else if (this.controlType[i] === controlTypes.ROUND_BOX) {
                    this.drawRoundedBox(
                        this.controlX[i],
                        this.controlY[i],
                        this.controlWidth[i],
                        this.controlHeight[i]
                    );
                } else if (this.controlType[i] === controlTypes.IMAGE) {
                    this.drawPicture(
                        this.controlX[i],
                        this.controlY[i],
                        this.controlTextSize[i]
                    );
                } else if (this.controlType[i] === controlTypes.CHECKBOX) {
                    this.drawCheckbox(
                        i,
                        this.controlX[i],
                        this.controlY[i],
                        this.controlWidth[i],
                        this.controlHeight[i]
                    );
                }
            }
        }

        this.mouseLastButtonDown = 0;
    }

    drawCheckbox(control, x, y, width, height) {
        this.surface.drawBox(x, y, width, height, 0xffffff);
        this.surface.drawLineHoriz(x, y, width, this.colourBoxTopNBottom);
        this.surface.drawLineVert(x, y, height, this.colourBoxTopNBottom);
        this.surface.drawLineHoriz(
            x,
            y + height - 1,
            width,
            this.colourBoxLeftNRight
        );
        this.surface.drawLineVert(
            x + width - 1,
            y,
            height,
            this.colourBoxLeftNRight
        );

        if (this.controlListEntryMouseButtonDown[control] === 1) {
            for (let j1 = 0; j1 < height; j1++) {
                this.surface.drawLineHoriz(x + j1, y + j1, 1, 0);
                this.surface.drawLineHoriz(x + width - 1 - j1, y + j1, 1, 0);
            }
        }
    }

    drawText(control, x, y, text, textSize) {
        const y2 = y + ((this.surface.textHeight(textSize) / 3) | 0);
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
        let displayText = text;

        if (this.controlMaskText[control]) {
            const length = displayText.length;

            displayText = '';

            for (let i = 0; i < length; i++) {
                displayText += 'X';
            }
        }

        if (this.controlType[control] === controlTypes.LIST_INPUT) {
            if (
                this.mouseLastButtonDown === 1 &&
                this.mouseX >= x &&
                this.mouseY >= y - ((height / 2) | 0) &&
                this.mouseX <= x + width &&
                this.mouseY <= y + ((height / 2) | 0)
            ) {
                this.focusControlIndex = control;
                this.setMobileFocus(control, text);
            }
        } else if (this.controlType[control] === controlTypes.TEXT_INPUT) {
            if (
                this.mouseLastButtonDown === 1 &&
                this.mouseX >= x - ((width / 2) | 0) &&
                this.mouseY >= y - ((height / 2) | 0) &&
                this.mouseX <= x + width / 2 &&
                this.mouseY <= y + ((height / 2) | 0)
            ) {
                this.focusControlIndex = control;
                this.setMobileFocus(control, text);
            }

            x -= (this.surface.textWidth(displayText, textSize) / 2) | 0;
        }

        if (this.focusControlIndex === control) {
            const { mudclient } = this.surface;
            const caret = mudclient.mobileInputCaret;

            if (mudclient.options.mobile && caret !== -1) {
                displayText =
                    displayText.slice(0, caret) +
                    '*' +
                    displayText.slice(caret);
            } else {
                displayText += '*';
            }
        }

        const y2 = y + ((this.surface.textHeight(textSize) / 3) | 0);
        this.drawString(control, x, y2, displayText, textSize);
    }

    drawBox(x, y, width, height) {
        this.surface.setBounds(x, y, x + width, y + height);

        this.surface.drawGradient(
            x,
            y,
            width,
            height,
            this.colourBoxLeftNRight,
            this.colourBoxTopNBottom
        );

        if (Panel.drawBackgroundArrow) {
            for (let i1 = x - (y & 0x3f); i1 < x + width; i1 += 128) {
                for (let j1 = y - (y & 0x1f); j1 < y + height; j1 += 128) {
                    this.surface.drawSpriteAlpha(
                        i1,
                        j1,
                        6 + Panel.baseSpriteStart,
                        128
                    );
                }
            }
        }

        this.surface.drawLineHoriz(x, y, width, this.colourBoxTopNBottom);

        this.surface.drawLineHoriz(
            x + 1,
            y + 1,
            width - 2,
            this.colourBoxTopNBottom
        );

        this.surface.drawLineHoriz(
            x + 2,
            y + 2,
            width - 4,
            this.colourBoxTopNBottom2
        );

        this.surface.drawLineVert(x, y, height, this.colourBoxTopNBottom);

        this.surface.drawLineVert(
            x + 1,
            y + 1,
            height - 2,
            this.colourBoxTopNBottom
        );

        this.surface.drawLineVert(
            x + 2,
            y + 2,
            height - 4,
            this.colourBoxTopNBottom2
        );

        this.surface.drawLineHoriz(
            x,
            y + height - 1,
            width,
            this.colourBoxLeftNRight
        );

        this.surface.drawLineHoriz(
            x + 1,
            y + height - 2,
            width - 2,
            this.colourBoxLeftNRight
        );

        this.surface.drawLineHoriz(
            x + 2,
            y + height - 3,
            width - 4,
            this.colourBoxLeftNRight2
        );

        this.surface.drawLineVert(
            x + width - 1,
            y,
            height,
            this.colourBoxLeftNRight
        );

        this.surface.drawLineVert(
            x + width - 2,
            y + 1,
            height - 2,
            this.colourBoxLeftNRight
        );

        this.surface.drawLineVert(
            x + width - 3,
            y + 2,
            height - 4,
            this.colourBoxLeftNRight2
        );

        this.surface.resetBounds();
    }

    drawRoundedBox(x, y, width, height) {
        this.surface.drawBox(x, y, width, height, 0);
        this.surface.drawBoxEdge(x, y, width, height, this.colourRoundedBoxOut);

        this.surface.drawBoxEdge(
            x + 1,
            y + 1,
            width - 2,
            height - 2,
            this.colourRoundedBoxMid
        );

        this.surface.drawBoxEdge(
            x + 2,
            y + 2,
            width - 4,
            height - 4,
            this.colourRoundedBoxIn
        );

        this.surface._drawSprite_from3(x, y, 2 + Panel.baseSpriteStart);

        this.surface._drawSprite_from3(
            x + width - 7,
            y,
            3 + Panel.baseSpriteStart
        );

        this.surface._drawSprite_from3(
            x,
            y + height - 7,
            4 + Panel.baseSpriteStart
        );

        this.surface._drawSprite_from3(
            x + width - 7,
            y + height - 7,
            5 + Panel.baseSpriteStart
        );
    }

    drawPicture(x, y, size) {
        this.surface._drawSprite_from3(x, y, size);
    }

    drawLineHoriz(x, y, width) {
        this.surface.drawLineHoriz(x, y, width, 0xffffff);
    }

    drawTextList(
        control,
        x,
        y,
        width,
        height,
        textSize,
        listEntries,
        listEntryCount,
        listEntryPosition
    ) {
        const displayedEntryCount =
            (height / this.surface.textHeight(textSize)) | 0;
        const maxEntries = listEntryCount - displayedEntryCount;

        if (listEntryPosition > maxEntries) {
            listEntryPosition = maxEntries;
        }

        if (listEntryPosition < 0) {
            listEntryPosition = 0;
        }

        this.controlFlashText[control] = listEntryPosition;

        if (displayedEntryCount < listEntryCount) {
            const cornerTopRight = x + width - 12;
            let cornerBottomLeft =
                (((height - 27) * displayedEntryCount) / listEntryCount) | 0;

            if (cornerBottomLeft < 6) {
                cornerBottomLeft = 6;
            }

            let j3 =
                (((height - 27 - cornerBottomLeft) * listEntryPosition) /
                    maxEntries) |
                0;

            if (
                this.mouseScrollDelta !== 0 &&
                this.mouseX > x &&
                this.mouseX < x + width &&
                this.mouseY > y &&
                this.mouseY < y + height
            ) {
                listEntryPosition += this.mouseScrollDelta;

                if (listEntryPosition < 0) {
                    listEntryPosition = 0;
                } else if (listEntryPosition > maxEntries) {
                    listEntryPosition = maxEntries;
                }

                this.controlFlashText[control] = listEntryPosition;
            }

            if (
                this.mouseButtonDown === 1 &&
                this.mouseX >= cornerTopRight &&
                this.mouseX <= cornerTopRight + 12
            ) {
                if (
                    this.mouseY > y &&
                    this.mouseY < y + 12 &&
                    listEntryPosition > 0
                ) {
                    listEntryPosition--;
                }

                if (
                    this.mouseY > y + height - 12 &&
                    this.mouseY < y + height &&
                    listEntryPosition < listEntryCount - displayedEntryCount
                ) {
                    listEntryPosition++;
                }

                this.controlFlashText[control] = listEntryPosition;
            }

            if (
                this.mouseButtonDown === 1 &&
                ((this.mouseX >= cornerTopRight &&
                    this.mouseX <= cornerTopRight + 12) ||
                    (this.mouseX >= cornerTopRight - 12 &&
                        this.mouseX <= cornerTopRight + 24 &&
                        this.controlListScrollbarHandleDragged[control]))
            ) {
                if (this.mouseY > y + 12 && this.mouseY < y + height - 12) {
                    this.controlListScrollbarHandleDragged[control] = true;

                    const l3 =
                        this.mouseY - y - 12 - ((cornerBottomLeft / 2) | 0);

                    listEntryPosition =
                        ((l3 * listEntryCount) / (height - 24)) | 0;

                    if (listEntryPosition > maxEntries) {
                        listEntryPosition = maxEntries;
                    }

                    if (listEntryPosition < 0) {
                        listEntryPosition = 0;
                    }

                    this.controlFlashText[control] = listEntryPosition;
                }
            } else {
                this.controlListScrollbarHandleDragged[control] = false;
            }

            j3 =
                (((height - 27 - cornerBottomLeft) * listEntryPosition) /
                    (listEntryCount - displayedEntryCount)) |
                0;

            this.drawListContainer(x, y, width, height, j3, cornerBottomLeft);
        }

        const listStartY =
            height - displayedEntryCount * this.surface.textHeight(textSize);

        let listY =
            (y +
                ((this.surface.textHeight(textSize) * 5) / 6 +
                    listStartY / 2)) |
            0;

        for (let entry = listEntryPosition; entry < listEntryCount; entry++) {
            this.drawString(
                control,
                x + 2,
                listY,
                listEntries[entry],
                textSize
            );

            listY +=
                this.surface.textHeight(textSize) -
                Panel.textListEntryHeightMod;

            if (listY >= y + height) {
                return;
            }
        }
    }

    drawListContainer(x, y, width, height, corner1, corner2) {
        const x2 = x + width - 12;
        this.surface.drawBoxEdge(x2, y, 12, height, 0);

        // up arrow
        this.surface._drawSprite_from3(x2 + 1, y + 1, Panel.baseSpriteStart);

        // down arrow
        this.surface._drawSprite_from3(
            x2 + 1,
            y + height - 12,
            Panel.baseSpriteStart + 1
        );

        this.surface.drawLineHoriz(x2, y + 13, 12, 0);
        this.surface.drawLineHoriz(x2, y + height - 13, 12, 0);

        this.surface.drawGradient(
            x2 + 1,
            y + 14,
            11,
            height - 27,
            this.colourScrollbarTop,
            this.colourScrollbarBottom
        );

        this.surface.drawBox(
            x2 + 3,
            corner1 + y + 14,
            7,
            corner2,
            this.colourScrollbarHandleMid
        );

        this.surface.drawLineVert(
            x2 + 2,
            corner1 + y + 14,
            corner2,
            this.colourScrollbarHandleLeft
        );

        this.surface.drawLineVert(
            x2 + 2 + 8,
            corner1 + y + 14,
            corner2,
            this.colourScrollbarHandleRight
        );
    }

    drawOptionListHoriz(control, x, y, textSize, listEntries) {
        let listTotalTextWidth = 0;
        const listEntryCount = listEntries.length;

        for (let idx = 0; idx < listEntryCount; idx++) {
            listTotalTextWidth += this.surface.textWidth(
                listEntries[idx],
                textSize
            );

            if (idx < listEntryCount - 1) {
                listTotalTextWidth += this.surface.textWidth('  ', textSize);
            }
        }

        let left = x - ((listTotalTextWidth / 2) | 0);
        const bottom = y + ((this.surface.textHeight(textSize) / 3) | 0);

        for (let idx = 0; idx < listEntryCount; idx++) {
            let textColour;

            if (this.controlUseAlternativeColour[control]) {
                textColour = 0xffffff;
            } else {
                textColour = 0;
            }

            if (
                this.mouseX >= left &&
                this.mouseX <=
                    left + this.surface.textWidth(listEntries[idx], textSize) &&
                this.mouseY <= bottom &&
                this.mouseY > bottom - this.surface.textHeight(textSize)
            ) {
                if (this.controlUseAlternativeColour[control]) {
                    textColour = 0x808080;
                } else {
                    textColour = 0xffffff;
                }

                if (this.mouseLastButtonDown === 1) {
                    this.controlListEntryMouseButtonDown[control] = idx;
                    this.controlClicked[control] = true;
                }
            }

            if (this.controlListEntryMouseButtonDown[control] === idx) {
                if (this.controlUseAlternativeColour[control]) {
                    textColour = 0xff0000;
                } else {
                    textColour = 0xc00000;
                }
            }

            this.surface.drawString(
                listEntries[idx],
                left,
                bottom,
                textSize,
                textColour
            );

            left += this.surface.textWidth(listEntries[idx] + '  ', textSize);
        }
    }

    drawOptionListVert(control, x, y, textSize, listEntries) {
        const listEntryCount = listEntries.length;

        let listTotalTextHeightMid =
            y -
            (((this.surface.textHeight(textSize) * (listEntryCount - 1)) / 2) |
                0);

        for (let idx = 0; idx < listEntryCount; idx++) {
            let colour;

            if (this.controlUseAlternativeColour[control]) {
                colour = 0xffffff;
            } else {
                colour = 0;
            }

            const entryTextWidth = this.surface.textWidth(
                listEntries[idx],
                textSize
            );

            if (
                this.mouseX >= x - ((entryTextWidth / 2) | 0) &&
                this.mouseX <= x + ((entryTextWidth / 2) | 0) &&
                this.mouseY - 2 <= listTotalTextHeightMid &&
                this.mouseY - 2 >
                    listTotalTextHeightMid - this.surface.textHeight(textSize)
            ) {
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

            this.surface.drawString(
                listEntries[idx],
                x - ((entryTextWidth / 2) | 0),
                listTotalTextHeightMid,
                textSize,
                colour
            );

            listTotalTextHeightMid += this.surface.textHeight(textSize);
        }
    }

    drawTextListInteractive(
        control,
        x,
        y,
        width,
        height,
        textSize,
        listEntries,
        listEntryCount,
        listEntryPosition
    ) {
        const displayedEntryCount =
            (height / this.surface.textHeight(textSize)) | 0;

        const maxEntries = listEntryCount - displayedEntryCount;

        if (displayedEntryCount < listEntryCount) {
            const cornerTopRight = x + width - 12;

            let cornerBottomLeft =
                (((height - 27) * displayedEntryCount) / listEntryCount) | 0;

            if (cornerBottomLeft < 6) {
                cornerBottomLeft = 6;
            }

            let j3 =
                (((height - 27 - cornerBottomLeft) * listEntryPosition) /
                    maxEntries) |
                0;

            if (
                this.mouseScrollDelta !== 0 &&
                this.mouseX > x &&
                this.mouseX < x + width &&
                this.mouseY > y &&
                this.mouseY < y + height
            ) {
                listEntryPosition += this.mouseScrollDelta;

                if (listEntryPosition < 0) {
                    listEntryPosition = 0;
                } else if (listEntryPosition > maxEntries) {
                    listEntryPosition = maxEntries;
                }

                this.controlFlashText[control] = listEntryPosition;
            }

            // the up and down arrow buttons on the scrollbar
            if (
                this.mouseButtonDown === 1 &&
                this.mouseX >= cornerTopRight &&
                this.mouseX <= cornerTopRight + 12
            ) {
                if (
                    this.mouseY > y &&
                    this.mouseY < y + 12 &&
                    listEntryPosition > 0
                ) {
                    listEntryPosition--;
                }

                if (
                    this.mouseY > y + height - 12 &&
                    this.mouseY < y + height &&
                    listEntryPosition < maxEntries
                ) {
                    listEntryPosition++;
                }

                this.controlFlashText[control] = listEntryPosition;
            }

            // handle the thumb/middle section dragging of the scrollbar
            if (
                this.mouseButtonDown === 1 &&
                ((this.mouseX >= cornerTopRight &&
                    this.mouseX <= cornerTopRight + 12) ||
                    (this.mouseX >= cornerTopRight - 12 &&
                        this.mouseX <= cornerTopRight + 24 &&
                        this.controlListScrollbarHandleDragged[control]))
            ) {
                if (this.mouseY > y + 12 && this.mouseY < y + height - 12) {
                    this.controlListScrollbarHandleDragged[control] = true;

                    const l3 =
                        this.mouseY - y - 12 - ((cornerBottomLeft / 2) | 0);

                    listEntryPosition =
                        ((l3 * listEntryCount) / (height - 24)) | 0;

                    if (listEntryPosition < 0) {
                        listEntryPosition = 0;
                    }

                    if (listEntryPosition > maxEntries) {
                        listEntryPosition = maxEntries;
                    }

                    this.controlFlashText[control] = listEntryPosition;
                }
            } else {
                this.controlListScrollbarHandleDragged[control] = false;
            }

            j3 =
                (((height - 27 - cornerBottomLeft) * listEntryPosition) /
                    maxEntries) |
                0;

            this.drawListContainer(x, y, width, height, j3, cornerBottomLeft);
        } else {
            listEntryPosition = 0;
            this.controlFlashText[control] = 0;
        }

        this.controlListEntryMouseOver[control] = -1;

        const listStartY =
            height - displayedEntryCount * this.surface.textHeight(textSize);

        let listY =
            y +
            (((((this.surface.textHeight(textSize) * 5) / 6) | 0) +
                listStartY / 2) |
                0);

        for (let k3 = listEntryPosition; k3 < listEntryCount; k3++) {
            let textColour;

            if (this.controlUseAlternativeColour[control]) {
                textColour = 0xffffff;
            } else {
                textColour = 0;
            }

            if (
                this.mouseX >= x + 2 &&
                this.mouseX <=
                    //x + 2 + this.surface.textWidth(listEntries[k3], textSize) &&
                    x + width - 12 &&
                this.mouseY - 2 <= listY &&
                this.mouseY - 2 > listY - this.surface.textHeight(textSize)
            ) {
                if (this.controlUseAlternativeColour[control]) {
                    textColour = 0x808080;
                } else {
                    textColour = 0xffffff;
                }

                this.controlListEntryMouseOver[control] = k3;

                if (this.mouseLastButtonDown === 1) {
                    this.controlListEntryMouseButtonDown[control] = k3;
                    this.controlClicked[control] = true;
                }
            }

            if (
                this.controlListEntryMouseButtonDown[control] === k3 &&
                this.aBoolean219
            ) {
                textColour = 0xff0000;
            }

            this.surface.drawString(
                listEntries[k3],
                x + 2,
                listY,
                textSize,
                textColour
            );

            listY += this.surface.textHeight(textSize);

            if (listY >= y + height) {
                return;
            }
        }
    }

    addText(x, y, text, size, flag) {
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlTextSize[this.controlCount] = size;
        this.controlUseAlternativeColour[this.controlCount] = flag;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlText[this.controlCount] = text;

        return this.controlCount++;
    }

    addTextCentre(x, y, text, size, flag) {
        this.controlType[this.controlCount] = controlTypes.CENTRE_TEXT;
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
        this.controlType[this.controlCount] = controlTypes.GRADIENT_BG;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x - ((width / 2) | 0);
        this.controlY[this.controlCount] = y - ((height / 2) | 0);
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;

        return this.controlCount++;
    }

    addBoxRounded(x, y, width, height) {
        this.controlType[this.controlCount] = controlTypes.ROUND_BOX;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x - ((width / 2) | 0);
        this.controlY[this.controlCount] = y - ((height / 2) | 0);
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;

        return this.controlCount++;
    }

    addSprite(x, y, spriteId) {
        const width = this.surface.spriteWidth[spriteId];
        const height = this.surface.spriteHeight[spriteId];

        this.controlType[this.controlCount] = controlTypes.IMAGE;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x - ((width / 2) | 0);
        this.controlY[this.controlCount] = y - ((height / 2) | 0);
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;
        this.controlTextSize[this.controlCount] = spriteId;

        return this.controlCount++;
    }

    addTextList(x, y, width, height, size, maxLength, flag) {
        this.controlType[this.controlCount] = controlTypes.TEXT_LIST;
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
        this.controlType[this.controlCount] = controlTypes.LIST_INPUT;
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

    addTextInput(x, y, width, height, size, maxLength, isPassword, flag1) {
        this.controlType[this.controlCount] = controlTypes.TEXT_INPUT;
        this.controlShown[this.controlCount] = true;
        this.controlMaskText[this.controlCount] = isPassword;
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
        this.controlType[this.controlCount] = controlTypes.I_TEXT_LIST;
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
        this.controlType[this.controlCount] = controlTypes.BUTTON;
        this.controlShown[this.controlCount] = true;
        this.controlClicked[this.controlCount] = false;
        this.controlX[this.controlCount] = x - ((width / 2) | 0);
        this.controlY[this.controlCount] = y - ((height / 2) | 0);
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;

        return this.controlCount++;
    }

    addLineHoriz(x, y, width) {
        this.controlType[this.controlCount] = controlTypes.HORIZ_LINE;
        this.controlShown[this.controlCount] = true;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;

        return this.controlCount++;
    }

    addOptionListHoriz(x, y, textSize, maxListCount, useAltColour) {
        this.controlType[this.controlCount] = controlTypes.HORIZ_OPTION;
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
        this.controlType[this.controlCount] = controlTypes.VERT_OPTION;
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
        this.controlType[this.controlCount] = controlTypes.CHECKBOX;
        this.controlShown[this.controlCount] = true;
        this.controlX[this.controlCount] = x;
        this.controlY[this.controlCount] = y;
        this.controlWidth[this.controlCount] = width;
        this.controlHeight[this.controlCount] = height;
        this.controlListEntryMouseButtonDown[this.controlCount] = 0;

        return this.controlCount++;
    }

    toggleCheckbox(control, activated) {
        this.controlListEntryMouseButtonDown[control] = +activated;
    }

    isActivated(control) {
        return this.controlListEntryMouseButtonDown[control] !== 0;
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
                this.controlListEntries[control][k] = this.controlListEntries[
                    control
                ][k + 1];
            }
        }

        this.controlListEntries[control][j] = text;

        if (flag) {
            this.controlFlashText[control] = 999999;
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
        this.setMobileFocus(control, this.controlText[control]);
    }

    getListEntryIndex(control) {
        return this.controlListEntryMouseOver[control];
    }

    setMobileFocus(control, text) {
        const { mudclient } = this.surface;

        if (!mudclient.options.mobile) {
            return;
        }

        const isPassword = this.controlMaskText[control];

        const isListInput =
            this.controlType[control] === controlTypes.LIST_INPUT;

        const width = this.controlWidth[control];
        const height = this.controlHeight[control];

        const left = isListInput
            ? this.controlX[control]
            : this.controlX[control] - Math.floor(width / 2);

        mudclient.openKeyboard(
            isPassword ? 'password' : 'text',
            text,
            this.controlInputMaxLen[control],
            {
                width: `${width}px`,
                height: `${height}px`,
                top: `${this.controlY[control] - Math.floor(height / 2)}px`,
                left: `${left}px`,
                fontSize: isListInput ? '12px' : '14px',
                textAlign: isListInput ? 'left' : 'center'
            }
        );
    }
}

Panel.baseSpriteStart = 0;
Panel.drawBackgroundArrow = true;
Panel.redMod = 114;
Panel.greenMod = 114;
Panel.blueMod = 176;
Panel.textListEntryHeightMod = 0;

module.exports = Panel;
