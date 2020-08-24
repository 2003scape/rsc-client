const Utility = require('./utility');

const BLACK = 0;
const DARK_GREY = 0xa0a0a0;
const LIGHT_GREY = 0xdcdcdc;

const C_0 = '0'.charCodeAt(0);
const C_9 = '9'.charCodeAt(0);

// canvas imagedata needs an alpha channel, but the client only uses rgb
function fixPixel(pixel) {
    let r = (pixel >> 16) & 255;
    let g = (pixel >> 8) & 255;
    let b = pixel & 255;
    let a = 255; // alpha always 255

    return (a << 24) + (b << 16) + (g << 8) + r;
}

class Surface {
    constructor(width, height, limit, component) {
        this.image = null;
        this.landscapeColours = null;
        this.anIntArray340 = null;
        this.anIntArray341 = null;
        this.anIntArray342 = null;
        this.anIntArray343 = null;
        this.anIntArray344 = null;
        this.anIntArray345 = null;
        this.boundsTopY = 0;
        this.boundsTopX = 0;

        this.interlace = false;
        this.loggedIn = false;
        this.boundsBottomY = height;
        this.boundsBottomX = width;
        this.width1 = this.width2 = width;
        this.height1 = this.height2 = height;
        this.area = width * height;
        this.pixels = new Int32Array(width * height);

        this.surfacePixels = [];
        this.surfacePixels.length = limit;
        this.surfacePixels.fill(null);
        this.spriteColoursUsed = [];
        this.spriteColoursUsed.length = limit;
        this.spriteColoursUsed.fill(null);
        this.spriteColourList = [];
        this.spriteColourList.length = limit;
        this.spriteColourList.fill(null);
        this.spriteTranslate = new Int8Array(limit);
        this.spriteWidth = new Int32Array(limit);
        this.spriteHeight = new Int32Array(limit);
        this.spriteWidthFull = new Int32Array(limit);
        this.spriteHeightFull = new Int32Array(limit);
        this.spriteTranslateX = new Int32Array(limit);
        this.spriteTranslateY = new Int32Array(limit);

        this.imageData = component._graphics.ctx.getImageData(0, 0, width, height);
        this.bufferedPixels = new Int32Array(width * height);
        this.pixelBytes = new Uint8ClampedArray(this.bufferedPixels.buffer);

        this.setComplete();
    }

    static rgbToLong(red, green, blue) {
        return (red << 16) + (green << 8) + blue;
    }

    static createFont(bytes, id) {
        Surface.gameFonts[id] = bytes;
    }

    setComplete() {
        for (let i = 0; i < this.area; i += 1) {
            this.bufferedPixels[i] = fixPixel(this.pixels[i]);
        }

        this.imageData.data.set(this.pixelBytes, 0, 0);
    }

    setBounds(x1, y1, x2, y2) {
        if (x1 < 0) {
            x1 = 0;
        }

        if (y1 < 0) {
            y1 = 0;
        }

        if (x2 > this.width2) {
            x2 = this.width2;
        }

        if (y2 > this.height2) {
            y2 = this.height2;
        }

        this.boundsTopX = x1;
        this.boundsTopY = y1;
        this.boundsBottomX = x2;
        this.boundsBottomY = y2;
    }

    resetBounds() {
        this.boundsTopX = 0;
        this.boundsTopY = 0;
        this.boundsBottomX = this.width2;
        this.boundsBottomY = this.height2;
    }

    draw(g, x, y) {
        // blit our canvas to the page's canvas
        this.setComplete();
        g.drawImage(this.imageData, x, y);
    }

    blackScreen() {
        let area = this.width2 * this.height2;

        if (!this.interlace) {
            for (let j = 0; j < area; j++) {
                this.pixels[j] = 0;
            }

            return;
        }

        let k = 0;

        for (let l = -this.height2; l < 0; l += 2) {
            for (let i1 = -this.width2; i1 < 0; i1++) {
                this.pixels[k++] = 0;
            }

            k += this.width2;
        }
    }

    drawCircle(x, y, radius, colour, alpha) {
        let bgAlpha = 256 - alpha;
        let red = (colour >> 16 & 0xff) * alpha;
        let green = (colour >> 8 & 0xff) * alpha;
        let blue = (colour & 0xff) * alpha;
        let top = y - radius;

        if (top < 0) {
            top = 0;
        }

        let bottom = y + radius;

        if (bottom >= this.height2) {
            bottom = this.height2 - 1;
        }

        let vertInc = 1;

        if (this.interlace) {
            vertInc = 2;

            if ((top & 1) !== 0) {
                top++;
            }
        }

        for (let yy = top; yy <= bottom; yy += vertInc) {
            let l3 = yy - y;
            let i4 = Math.sqrt(radius * radius - l3 * l3) | 0;
            let j4 = x - i4;

            if (j4 < 0) {
                j4 = 0;
            }

            let k4 = x + i4;

            if (k4 >= this.width2) {
                k4 = this.width2 - 1;
            }

            let pixelIdx = j4 + yy * this.width2;

            for (let i5 = j4; i5 <= k4; i5++) {
                let bgRed = (this.pixels[pixelIdx] >> 16 & 0xff) * bgAlpha;
                let bgGreen = (this.pixels[pixelIdx] >> 8 & 0xff) * bgAlpha;
                let bgBlue = (this.pixels[pixelIdx] & 0xff) * bgAlpha;
                let newColour = ((red + bgRed >> 8) << 16) + ((green + bgGreen >> 8) << 8) + (blue + bgBlue >> 8);
                this.pixels[pixelIdx++] = newColour;
            }
        }
    }

    drawBoxAlpha(x, y, width, height, colour, alpha) {
        if (x < this.boundsTopX) {
            width -= this.boundsTopX - x;
            x = this.boundsTopX;
        }

        if (y < this.boundsTopY) {
            height -= this.boundsTopY - y;
            y = this.boundsTopY;
        }

        if (x + width > this.boundsBottomX) {
            width = this.boundsBottomX - x;
        }

        if (y + height > this.boundsBottomY) {
            height = this.boundsBottomY - y;
        }

        let bgAlpha = 256 - alpha;
        let red = (colour >> 16 & 0xff) * alpha;
        let green = (colour >> 8 & 0xff) * alpha;
        let blue = (colour & 0xff) * alpha;
        let j3 = this.width2 - width; // wat
        let vertInc = 1;

        if (this.interlace) {
            vertInc = 2;
            j3 += this.width2;

            if ((y & 1) !== 0) {
                y++;
                height--;
            }
        }

        let pixelIdx = x + y * this.width2;

        for (let l3 = 0; l3 < height; l3 += vertInc) {
            for (let i4 = -width; i4 < 0; i4++) {
                let bgRed = (this.pixels[pixelIdx] >> 16 & 0xff) * bgAlpha;
                let bgGreen = (this.pixels[pixelIdx] >> 8 & 0xff) * bgAlpha;
                let bgBlue = (this.pixels[pixelIdx] & 0xff) * bgAlpha;
                let newColour = ((red + bgRed >> 8) << 16) + ((green + bgGreen >> 8) << 8) + (blue + bgBlue >> 8);
                this.pixels[pixelIdx++] = newColour;
            }

            pixelIdx += j3;
        }

    }

    drawGradient(x, y, width, height, colourTop, colourBottom) {
        if (x < this.boundsTopX) {
            width -= this.boundsTopX - x;
            x = this.boundsTopX;
        }

        if (x + width > this.boundsBottomX) {
            width = this.boundsBottomX - x;
        }

        let btmRed = colourBottom >> 16 & 0xff;
        let btmGreen = colourBottom >> 8 & 0xff;
        let btmBlue = colourBottom & 0xff;
        let topRed = colourTop >> 16 & 0xff;
        let topGreen = colourTop >> 8 & 0xff;
        let topBlue = colourTop & 0xff;
        let i3 = this.width2 - width; // wat
        let vertInc = 1;

        if (this.interlace) {
            vertInc = 2;
            i3 += this.width2;

            if ((y & 1) !== 0) {
                y++;
                height--;
            }
        }

        let pixelIdx = x + y * this.width2;

        for (let k3 = 0; k3 < height; k3 += vertInc) {
            if (k3 + y >= this.boundsTopY && k3 + y < this.boundsBottomY) {
                let newColour = ((btmRed * k3 + topRed * (height - k3)) / height << 16) + ((btmGreen * k3 + topGreen * (height - k3)) / height << 8) + (((btmBlue * k3 + topBlue * (height - k3)) / height) | 0);

                for (let i4 = -width; i4 < 0; i4++) {
                    this.pixels[pixelIdx++] = newColour;
                }

                pixelIdx += i3;
            } else {
                pixelIdx += this.width2;
            }
        }
    }

    drawBox(x, y, w, h, colour) {
        if (x < this.boundsTopX) {
            w -= this.boundsTopX - x;
            x = this.boundsTopX;
        }

        if (y < this.boundsTopY) {
            h -= this.boundsTopY - y;
            y = this.boundsTopY;
        }

        if (x + w > this.boundsBottomX) {
            w = this.boundsBottomX - x;
        }

        if (y + h > this.boundsBottomY) {
            h = this.boundsBottomY - y;
        }

        let j1 = this.width2 - w; // wat
        let vertInc = 1;

        if (this.interlace) {
            vertInc = 2;
            j1 += this.width2;

            if ((y & 1) !== 0) {
                y++;
                h--;
            }
        }

        let pixelIdx = x + y * this.width2;

        for (let l1 = -h; l1 < 0; l1 += vertInc) {
            for (let i2 = -w; i2 < 0; i2++) {
                this.pixels[pixelIdx++] = colour;
            }

            pixelIdx += j1;
        }
    }

    drawBoxEdge(x, y, width, height, colour) {
        this.drawLineHoriz(x, y, width, colour);
        this.drawLineHoriz(x, (y + height) - 1, width, colour);
        this.drawLineVert(x, y, height, colour);
        this.drawLineVert((x + width) - 1, y, height, colour);
    }

    drawLineHoriz(x, y, width, colour) {
        if (y < this.boundsTopY || y >= this.boundsBottomY) {
            return;
        }

        if (x < this.boundsTopX) {
            width -= this.boundsTopX - x;
            x = this.boundsTopX;
        }

        if (x + width > this.boundsBottomX) {
            width = this.boundsBottomX - x;
        }

        let i1 = x + y * this.width2;

        for (let j1 = 0; j1 < width; j1++) {
            this.pixels[i1 + j1] = colour;
        }
    }

    drawLineVert(x, y, height, colour) {
        if (x < this.boundsTopX || x >= this.boundsBottomX) {
            return;
        }

        if (y < this.boundsTopY) {
            height -= this.boundsTopY - y;
            y = this.boundsTopY;
        }

        if (y + height > this.boundsBottomX) {
            height = this.boundsBottomY - y;
        }

        let i1 = x + y * this.width2;

        for (let j1 = 0; j1 < height; j1++) {
            this.pixels[i1 + j1 * this.width2] = colour;
        }

    }

    setPixel(x, y, colour) {
        if (x < this.boundsTopX || y < this.boundsTopY || x >= this.boundsBottomX || y >= this.boundsBottomY) {
            return;
        } else {
            this.pixels[x + y * this.width2] = colour;

            return;
        }
    }

    fadeToBlack() {
        let k = this.width2 * this.height2;

        for (let j = 0; j < k; j++) {
            let i = this.pixels[j] & 0xffffff;
            this.pixels[j] = (i >>> 1 & 0x7f7f7f) + (i >>> 2 & 0x3f3f3f) + (i >>> 3 & 0x1f1f1f) + (i >>> 4 & 0xf0f0f);
        }
    }

    drawLineAlpha(i, j, x, y, width, height) {
        for (let xx = x; xx < x + width; xx++) {
            for (let yy = y; yy < y + height; yy++) {
                let i2 = 0;
                let j2 = 0;
                let k2 = 0;
                let l2 = 0;

                for (let i3 = xx - i; i3 <= xx + i; i3++)
                    if (i3 >= 0 && i3 < this.width2) {
                        for (let j3 = yy - j; j3 <= yy + j; j3++) {
                            if (j3 >= 0 && j3 < this.height2) {
                                let k3 = this.pixels[i3 + this.width2 * j3];
                                i2 += k3 >> 16 & 0xff;
                                j2 += k3 >> 8 & 0xff;
                                k2 += k3 & 0xff;
                                l2++;
                            }
                        }
                    }

                this.pixels[xx + this.width2 * yy] = (i2 / l2 << 16) + (j2 / l2 << 8) + ((k2 / l2) | 0);
            }
        }
    }

    clear() {
        for (let i = 0; i < this.surfacePixels.length; i++) {
            this.surfacePixels[i] = null;
            this.spriteWidth[i] = 0;
            this.spriteHeight[i] = 0;
            this.spriteColoursUsed[i] = null;
            this.spriteColourList[i] = null;
        }
    }

    parseSprite(spriteId, spriteData, indexData, frameCount) {
        let indexOff = Utility.getUnsignedShort(spriteData, 0);
        let fullWidth = Utility.getUnsignedShort(indexData, indexOff);
        indexOff += 2;

        let fullHeight = Utility.getUnsignedShort(indexData, indexOff);
        indexOff += 2;

        let colourCount = indexData[indexOff++] & 0xff;
        let colours = new Int32Array(colourCount);
        colours[0] = 0xff00ff;

        for (let i = 0; i < colourCount - 1; i++) {
            colours[i + 1] = ((indexData[indexOff] & 0xff) << 16) + ((indexData[indexOff + 1] & 0xff) << 8) + (indexData[indexOff + 2] & 0xff);
            indexOff += 3;
        }

        let spriteOff = 2;

        for (let id = spriteId; id < spriteId + frameCount; id++) {
            this.spriteTranslateX[id] = indexData[indexOff++] & 0xff;
            this.spriteTranslateY[id] = indexData[indexOff++] & 0xff;
            this.spriteWidth[id] = Utility.getUnsignedShort(indexData, indexOff);
            indexOff += 2;

            this.spriteHeight[id] = Utility.getUnsignedShort(indexData, indexOff);
            indexOff += 2;

            let unknown = indexData[indexOff++] & 0xff;
            let size = this.spriteWidth[id] * this.spriteHeight[id];

            this.spriteColoursUsed[id] = new Int8Array(size);
            this.spriteColourList[id] = colours;
            this.spriteWidthFull[id] = fullWidth;
            this.spriteHeightFull[id] = fullHeight;
            this.surfacePixels[id] = null;
            this.spriteTranslate[id] = false;

            if (this.spriteTranslateX[id] !== 0 || this.spriteTranslateY[id] !== 0) {
                this.spriteTranslate[id] = true;
            }

            if (unknown === 0) {
                for (let pixel = 0; pixel < size; pixel++) {
                    this.spriteColoursUsed[id][pixel] = spriteData[spriteOff++];

                    if (this.spriteColoursUsed[id][pixel] === 0) {
                        this.spriteTranslate[id] = true;
                    }
                }
            } else if (unknown === 1) {
                for (let x = 0; x < this.spriteWidth[id]; x++) {
                    for (let y = 0; y < this.spriteHeight[id]; y++) {
                        this.spriteColoursUsed[id][x + y * this.spriteWidth[id]] = spriteData[spriteOff++];

                        if (this.spriteColoursUsed[id][x + y * this.spriteWidth[id]] === 0) {
                            this.spriteTranslate[id] = true;
                        }
                    }
                }
            }
        }
    }

    readSleepWord(spriteId, spriteData) {
        let pixels = this.surfacePixels[spriteId] = new Int32Array(10200);

        this.spriteWidth[spriteId] = 255;
        this.spriteHeight[spriteId] = 40;
        this.spriteTranslateX[spriteId] = 0;
        this.spriteTranslateY[spriteId] = 0;
        this.spriteWidthFull[spriteId] = 255;
        this.spriteHeightFull[spriteId] = 40;
        this.spriteTranslate[spriteId] = false;

        let j = 0;
        let k = 1;
        let l = 0;

        for (l = 0; l < 255; ) {
            let i1 = spriteData[k++] & 0xff;

            for (let k1 = 0; k1 < i1; k1++) {
                pixels[l++] = j;
            }

            j = 0xffffff - j;
        }

        for (let y = 1; y < 40; y++) {
            for (let x = 0; x < 255; ) {
                let i2 = spriteData[k++] & 0xff;

                for (let j2 = 0; j2 < i2; j2++) {
                    pixels[l] = pixels[l - 255];
                    l++;
                    x++;
                }

                if (x < 255) {
                    pixels[l] = 0xffffff - pixels[l - 255];
                    l++;
                    x++;
                }
            }
        }
    }

    drawWorld(spriteId) {
        let spriteSize = this.spriteWidth[spriteId] * this.spriteHeight[spriteId];
        let spritePixels = this.surfacePixels[spriteId];
        let ai1 = new Int32Array(32768);

        for (let k = 0; k < spriteSize; k++) {
            let l = spritePixels[k];
            ai1[((l & 0xf80000) >> 9) + ((l & 0xf800) >> 6) + ((l & 0xf8) >> 3)]++;
        }

        let ai2 = new Int32Array(256);
        ai2[0] = 0xff00ff;

        let ai3 = new Int32Array(256);

        for (let i1 = 0; i1 < 32768; i1++) {
            let j1 = ai1[i1];

            if (j1 > ai3[255]) {
                for (let k1 = 1; k1 < 256; k1++) {
                    if (j1 <= ai3[k1]) {
                        continue;
                    }

                    for (let i2 = 255; i2 > k1; i2--) {
                        ai2[i2] = ai2[i2 - 1];
                        ai3[i2] = ai3[i2 - 1];
                    }

                    ai2[k1] = ((i1 & 0x7c00) << 9) + ((i1 & 0x3e0) << 6) + ((i1 & 0x1f) << 3) + 0x40404;
                    ai3[k1] = j1;
                    break;
                }
            }

            ai1[i1] = -1;
        }

        let abyte0 = new Int8Array(spriteSize);

        for (let l1 = 0; l1 < spriteSize; l1++) {
            let j2 = spritePixels[l1];
            let k2 = ((j2 & 0xf80000) >> 9) + ((j2 & 0xf800) >> 6) + ((j2 & 0xf8) >> 3);
            let l2 = ai1[k2];

            if (l2 === -1) {
                let i3 = 999999999;
                let j3 = j2 >> 16 & 0xff;
                let k3 = j2 >> 8 & 0xff;
                let l3 = j2 & 0xff;

                for (let i4 = 0; i4 < 256; i4++) {
                    let j4 = ai2[i4];
                    let k4 = j4 >> 16 & 0xff;
                    let l4 = j4 >> 8 & 0xff;
                    let i5 = j4 & 0xff;
                    let j5 = (j3 - k4) * (j3 - k4) + (k3 - l4) * (k3 - l4) + (l3 - i5) * (l3 - i5);

                    if (j5 < i3) {
                        i3 = j5;
                        l2 = i4;
                    }
                }

                ai1[k2] = l2;
            }

            abyte0[l1] = l2 & 0xff; // << 24 >> 24
        }

        this.spriteColoursUsed[spriteId] = abyte0;
        this.spriteColourList[spriteId] = ai2;
        this.surfacePixels[spriteId] = null;
    }

    loadSprite(spriteId) {
        if (this.spriteColoursUsed[spriteId] === null) {
            return;
        }

        let size = this.spriteWidth[spriteId] * this.spriteHeight[spriteId];
        let idx = this.spriteColoursUsed[spriteId];
        let cols = this.spriteColourList[spriteId];
        let pixels = new Int32Array(size);

        for (let pixel = 0; pixel < size; pixel++) {
            let colour = cols[idx[pixel] & 0xff];

            if (colour === 0) {
                colour = 1;
            } else if (colour === 0xff00ff) {
                colour = 0;
            }

            pixels[pixel] = colour;
        }

        this.surfacePixels[spriteId] = pixels;
        this.spriteColoursUsed[spriteId] = null;
        this.spriteColourList[spriteId] = null;
    }

    // used from World
    drawSpriteMinimap(sprite, x, y, width, height) {
        this.spriteWidth[sprite] = width;
        this.spriteHeight[sprite] = height;
        this.spriteTranslate[sprite] = false;
        this.spriteTranslateX[sprite] = 0;
        this.spriteTranslateY[sprite] = 0;
        this.spriteWidthFull[sprite] = width;
        this.spriteHeightFull[sprite] = height;

        let area = width * height;
        let pixel = 0;

        this.surfacePixels[sprite] = new Int32Array(area);

        for (let xx = x; xx < x + width; xx++) {
            for (let yy = y; yy < y + height; yy++) {
                this.surfacePixels[sprite][pixel++] = this.pixels[xx + yy * this.width2];
            }
        }
    }

    // used from mudclient
    _drawSprite_from5(sprite, x, y, width, height) {
        this.spriteWidth[sprite] = width;
        this.spriteHeight[sprite] = height;
        this.spriteTranslate[sprite] = false;
        this.spriteTranslateX[sprite] = 0;
        this.spriteTranslateY[sprite] = 0;
        this.spriteWidthFull[sprite] = width;
        this.spriteHeightFull[sprite] = height;

        let area = width * height;
        let pixel = 0;

        this.surfacePixels[sprite] = new Int32Array(area);

        for (let yy = y; yy < y + height; yy++) {
            for (let xx = x; xx < x + width; xx++) {
                this.surfacePixels[sprite][pixel++] = this.pixels[xx + yy * this.width2];
            }
        }
    }

    _drawSprite_from3(x, y, id) {
        if (this.spriteTranslate[id]) {
            x += this.spriteTranslateX[id];
            y += this.spriteTranslateY[id];
        }

        let rY = x + y * this.width2;
        let rX = 0;
        let height = this.spriteHeight[id];
        let width = this.spriteWidth[id];
        let w2 = this.width2 - width;
        let h2 = 0;

        if (y < this.boundsTopY) {
            let j2 = this.boundsTopY - y;
            height -= j2;
            y = this.boundsTopY;
            rX += j2 * width;
            rY += j2 * this.width2;
        }

        if (y + height >= this.boundsBottomY) {
            height -= ((y + height) - this.boundsBottomY) + 1;
        }

        if (x < this.boundsTopX) {
            let k2 = this.boundsTopX - x;
            width -= k2;
            x = this.boundsTopX;
            rX += k2;
            rY += k2;
            h2 += k2;
            w2 += k2;
        }

        if (x + width >= this.boundsBottomX) {
            let l2 = ((x + width) - this.boundsBottomX) + 1;
            width -= l2;
            h2 += l2;
            w2 += l2;
        }

        if (width <= 0 || height <= 0) {
            return;
        }

        let inc = 1;

        if (this.interlace) {
            inc = 2;
            w2 += this.width2;
            h2 += this.spriteWidth[id];

            if ((y & 1) !== 0) {
                rY += this.width2;
                height--;
            }
        }

        if (this.surfacePixels[id] === null) {
            this._drawSprite_from10A(this.pixels, this.spriteColoursUsed[id], this.spriteColourList[id], rX, rY, width, height, w2, h2, inc);
            return;
        } else {
            this._drawSprite_from10(this.pixels, this.surfacePixels[id], 0, rX, rY, width, height, w2, h2, inc);
            return;
        }
    }

    _spriteClipping_from5(x, y, width, height, spriteId) {
        try {
            let spriteWidth = this.spriteWidth[spriteId];
            let spriteHeight = this.spriteHeight[spriteId];
            let l1 = 0;
            let i2 = 0;
            let j2 = ((spriteWidth << 16) / width) | 0;
            let k2 = ((spriteHeight << 16) / height) | 0;

            if (this.spriteTranslate[spriteId]) {
                let l2 = this.spriteWidthFull[spriteId];
                let j3 = this.spriteHeightFull[spriteId];
                j2 = ((l2 << 16) / width) | 0;
                k2 = ((j3 << 16) / height) | 0;

                x += (((this.spriteTranslateX[spriteId] * width + l2) - 1) / l2) | 0;
                y += (((this.spriteTranslateY[spriteId] * height + j3) - 1) / j3) | 0;

                if ((this.spriteTranslateX[spriteId] * width) % l2 !== 0) {
                    l1 = ((l2 - (this.spriteTranslateX[spriteId] * width) % l2 << 16) / width) | 0;
                }

                if ((this.spriteTranslateY[spriteId] * height) % j3 !== 0) {
                    i2 = ((j3 - (this.spriteTranslateY[spriteId] * height) % j3 << 16) / height) | 0;
                }

                width = ((width * (this.spriteWidth[spriteId] - (l1 >> 16))) / l2) | 0;
                height = ((height * (this.spriteHeight[spriteId] - (i2 >> 16))) / j3) | 0;
            }

            let i3 = x + y * this.width2;
            let k3 = this.width2 - width;

            if (y < this.boundsTopY) {
                let l3 = this.boundsTopY - y;
                height -= l3;
                y = 0;
                i3 += l3 * this.width2;
                i2 += k2 * l3;
            }

            if (y + height >= this.boundsBottomY) {
                height -= ((y + height) - this.boundsBottomY) + 1;
            }

            if (x < this.boundsTopX) {
                let i4 = this.boundsTopX - x;
                width -= i4;
                x = 0;
                i3 += i4;
                l1 += j2 * i4;
                k3 += i4;
            }

            if (x + width >= this.boundsBottomX) {
                let j4 = ((x + width) - this.boundsBottomX) + 1;
                width -= j4;
                k3 += j4;
            }

            let yInc = 1;

            if (this.interlace) {
                yInc = 2;
                k3 += this.width2;
                k2 += k2;

                if ((y & 1) !== 0) {
                    i3 += this.width2;
                    height--;
                }
            }

            this._plotScale_from13(this.pixels, this.surfacePixels[spriteId], 0, l1, i2, i3, k3, width, height, j2, k2, spriteWidth, yInc);
        } catch (e) {
            console.log('error in sprite clipping routine');
        }
    }

    _spriteClipping_from7(x, y, w, h, id, tx, ty) {
        if (id >= 50000) {
            this.mudclientref.drawTeleportBubble(x, y, w, h, id - 50000, tx, ty);
            return;
        }

        if (id >= 40000) {
            this.mudclientref.drawItem(x, y, w, h, id - 40000, tx, ty);
            return;
        }

        if (id >= 20000) {
            this.mudclientref.drawNpc(x, y, w, h, id - 20000, tx, ty);
            return;
        }

        if (id >= 5000) {
            this.mudclientref.drawPlayer(x, y, w, h, id - 5000, tx, ty);
            return;
        } else {
            super._spriteClipping_from5(x, y, w, h, id);
            return;
        }
    }

    _drawSpriteAlpha_from4(x, y, spriteId, alpha) {
        if (this.spriteTranslate[spriteId]) {
            x += this.spriteTranslateX[spriteId];
            y += this.spriteTranslateY[spriteId];
        }

        let size = x + y * this.width2;
        let j1 = 0;
        let height = this.spriteHeight[spriteId];
        let width = this.spriteWidth[spriteId];
        let extraXSpace = this.width2 - width;
        let j2 = 0;

        if (y < this.boundsTopY) {
            let k2 = this.boundsTopY - y;
            height -= k2;
            y = this.boundsTopY;
            j1 += k2 * width;
            size += k2 * this.width2;
        }

        if (y + height >= this.boundsBottomY) {
            height -= ((y + height) - this.boundsBottomY) + 1;
        }

        if (x < this.boundsTopX) {
            let l2 = this.boundsTopX - x;
            width -= l2;
            x = this.boundsTopX;
            j1 += l2;
            size += l2;
            j2 += l2;
            extraXSpace += l2;
        }

        if (x + width >= this.boundsBottomX) {
            let i3 = ((x + width) - this.boundsBottomX) + 1;
            width -= i3;
            j2 += i3;
            extraXSpace += i3;
        }

        if (width <= 0 || height <= 0) {
            return;
        }

        let yInc = 1;

        if (this.interlace) {
            yInc = 2;
            extraXSpace += this.width2;
            j2 += this.spriteWidth[spriteId];

            if ((y & 1) !== 0) {
                size += this.width2;
                height--;
            }
        }

        if (this.surfacePixels[spriteId] === null) {
            this._drawSpriteAlpha_from11A(this.pixels, this.spriteColoursUsed[spriteId], this.spriteColourList[spriteId], j1, size, width, height, extraXSpace, j2, yInc, alpha);
            return;
        } else {
            this._drawSpriteAlpha_from11(this.pixels, this.surfacePixels[spriteId], 0, j1, size, width, height, extraXSpace, j2, yInc, alpha);
            return;
        }
    }

    drawActionBubble(x, y, scaleX, scaleY, sprite, alpha) {
        try {
            let spriteWidth = this.spriteWidth[sprite];
            let spriteHeight = this.spriteHeight[sprite];
            let i2 = 0;
            let j2 = 0;
            let k2 = ((spriteWidth << 16) / scaleX) | 0;
            let l2 = ((spriteHeight << 16) / scaleY) | 0;

            if (this.spriteTranslate[sprite]) {
                let i3 = this.spriteWidthFull[sprite];
                let k3 = this.spriteHeightFull[sprite];
                k2 = ((i3 << 16) / scaleX) | 0;
                l2 = ((k3 << 16) / scaleY) | 0;

                x += (((this.spriteTranslateX[sprite] * scaleX + i3) - 1) / i3) | 0;
                y += (((this.spriteTranslateY[sprite] * scaleY + k3) - 1) / k3) | 0;

                if ((this.spriteTranslateX[sprite] * scaleX) % i3 !== 0) {
                    i2 = ((i3 - (this.spriteTranslateX[sprite] * scaleX) % i3 << 16) / scaleX) | 0;
                }

                if ((this.spriteTranslateY[sprite] * scaleY) % k3 !== 0) {
                    j2 = ((k3 - (this.spriteTranslateY[sprite] * scaleY) % k3 << 16) / scaleY) | 0;
                }

                scaleX = ((scaleX * (this.spriteWidth[sprite] - (i2 >> 16))) / i3) | 0;
                scaleY = ((scaleY * (this.spriteHeight[sprite] - (j2 >> 16))) / k3) | 0;
            }

            let j3 = x + y * this.width2;
            let l3 = this.width2 - scaleX;

            if (y < this.boundsTopY) {
                let i4 = this.boundsTopY - y;
                scaleY -= i4;
                y = 0;
                j3 += i4 * this.width2;
                j2 += l2 * i4;
            }

            if (y + scaleY >= this.boundsBottomY)
                scaleY -= ((y + scaleY) - this.boundsBottomY) + 1;

            if (x < this.boundsTopX) {
                let j4 = this.boundsTopX - x;
                scaleX -= j4;
                x = 0;
                j3 += j4;
                i2 += k2 * j4;
                l3 += j4;
            }

            if (x + scaleX >= this.boundsBottomX) {
                let k4 = ((x + scaleX) - this.boundsBottomX) + 1;
                scaleX -= k4;
                l3 += k4;
            }

            let yInc = 1;

            if (this.interlace) {
                yInc = 2;
                l3 += this.width2;
                l2 += l2;

                if ((y & 1) !== 0) {
                    j3 += this.width2;
                    scaleY--;
                }
            }

            this.transparentScale(this.pixels, this.surfacePixels[sprite], 0, i2, j2, j3, l3, scaleX, scaleY, k2, l2, spriteWidth, yInc, alpha);
            return;
        } catch (e) {
            console.log('error in sprite clipping routine');
        }
    }

    _spriteClipping_from6(x, y, width, height, spriteId, colour) {
        try {
            let k1 = this.spriteWidth[spriteId];
            let l1 = this.spriteHeight[spriteId];
            let i2 = 0;
            let j2 = 0;
            let k2 = ((k1 << 16) / width) | 0;
            let l2 = ((l1 << 16) / height) | 0;

            if (this.spriteTranslate[spriteId]) {
                let i3 = this.spriteWidthFull[spriteId];
                let k3 = this.spriteHeightFull[spriteId];
                k2 = ((i3 << 16) / width) | 0;
                l2 = ((k3 << 16) / height) | 0;
                x += (((this.spriteTranslateX[spriteId] * width + i3) - 1) / i3) | 0;
                y += (((this.spriteTranslateY[spriteId] * height + k3) - 1) / k3) | 0;

                if ((this.spriteTranslateX[spriteId] * width) % i3 !== 0) {
                    i2 = ((i3 - (this.spriteTranslateX[spriteId] * width) % i3 << 16) / width) | 0;
                }

                if ((this.spriteTranslateY[spriteId] * height) % k3 !== 0) {
                    j2 = ((k3 - (this.spriteTranslateY[spriteId] * height) % k3 << 16) / height) | 0;
                }

                width = ((width * (this.spriteWidth[spriteId] - (i2 >> 16))) / i3) | 0;
                height = ((height * (this.spriteHeight[spriteId] - (j2 >> 16))) / k3) | 0;
            }

            let j3 = x + y * this.width2;
            let l3 = this.width2 - width;

            if (y < this.boundsTopY) {
                let i4 = this.boundsTopY - y;
                height -= i4;
                y = 0;
                j3 += i4 * this.width2;
                j2 += l2 * i4;
            }

            if (y + height >= this.boundsBottomY) {
                height -= ((y + height) - this.boundsBottomY) + 1;
            }

            if (x < this.boundsTopX) {
                let j4 = this.boundsTopX - x;
                width -= j4;
                x = 0;
                j3 += j4;
                i2 += k2 * j4;
                l3 += j4;
            }

            if (x + width >= this.boundsBottomX) {
                let k4 = ((x + width) - this.boundsBottomX) + 1;
                width -= k4;
                l3 += k4;
            }

            let yInc = 1;

            if (this.interlace) {
                yInc = 2;
                l3 += this.width2;
                l2 += l2;

                if ((y & 1) !== 0) {
                    j3 += this.width2;
                    height--;
                }
            }

            this._plotScale_from14(this.pixels, this.surfacePixels[spriteId], 0, i2, j2, j3, l3, width, height, k2, l2, k1, yInc, colour);
            return;
        } catch (e) {
            console.log('error in sprite clipping routine');
            console.error(e);
        }
    }

    _drawSprite_from10(dest, src, i, srcPos, destPos, width, height, j1, k1, yInc) {
        let i2 = -(width >> 2);
        width = -(width & 3);

        for (let j2 = -height; j2 < 0; j2 += yInc) {
            for (let k2 = i2; k2 < 0; k2++) {
                i = src[srcPos++];

                if (i !== 0) {
                    dest[destPos++] = i;
                } else {
                    destPos++;
                }

                i = src[srcPos++];

                if (i !== 0) {
                    dest[destPos++] = i;
                } else {
                    destPos++;
                }

                i = src[srcPos++];

                if (i !== 0) {
                    dest[destPos++] = i;
                } else {
                    destPos++;
                }

                i = src[srcPos++];

                if (i !== 0) {
                    dest[destPos++] = i;
                } else {
                    destPos++;
                }
            }

            for (let l2 = width; l2 < 0; l2++) {
                i = src[srcPos++];

                if (i !== 0) {
                    dest[destPos++] = i;
                } else {
                    destPos++;
                }
            }

            destPos += j1;
            srcPos += k1;
        }
    }

    _drawSprite_from10A(target, colourIdx, colours, srcPos, destPos, width, height, w2, h2, rowInc) {
        let l1 = -(width >> 2);
        width = -(width & 3);

        for (let i2 = -height; i2 < 0; i2 += rowInc) {
            for (let j2 = l1; j2 < 0; j2++) {
                let byte0 = colourIdx[srcPos++];

                if (byte0 !== 0) {
                    target[destPos++] = colours[byte0 & 0xff];
                } else {
                    destPos++;
                }

                byte0 = colourIdx[srcPos++];

                if (byte0 !== 0) {
                    target[destPos++] = colours[byte0 & 0xff];
                } else {
                    destPos++;
                }

                byte0 = colourIdx[srcPos++];

                if (byte0 !== 0) {
                    target[destPos++] = colours[byte0 & 0xff];
                } else {
                    destPos++;
                }

                byte0 = colourIdx[srcPos++];

                if (byte0 !== 0) {
                    target[destPos++] = colours[byte0 & 0xff];
                } else {
                    destPos++;
                }
            }

            for (let k2 = width; k2 < 0; k2++) {
                let byte1 = colourIdx[srcPos++];

                if (byte1 !== 0) {
                    target[destPos++] = colours[byte1 & 0xff];
                } else {
                    destPos++;
                }
            }

            destPos += w2;
            srcPos += h2;
        }
    }

    _plotScale_from13(dest, src, i, j, k, destPos, i1, j1, k1, l1, i2, j2, k2) {
        try {
            let l2 = j;

            for (let i3 = -k1; i3 < 0; i3 += k2) {
                let j3 = (k >> 16) * j2;

                for (let k3 = -j1; k3 < 0; k3++) {
                    i = src[(j >> 16) + j3];

                    if (i !== 0) {
                        dest[destPos++] = i;
                    } else {
                        destPos++;
                    }

                    j += l1;
                }

                k += i2;
                j = l2;
                destPos += i1;
            }

            return;
        } catch (e) {
            console.log('error in plotScale');
        }
    }

    _drawSpriteAlpha_from11(dest, src, i, srcPos, size, width, height, extraXSpace, k1, yInc, alpha) {
        let j2 = 256 - alpha;

        for (let k2 = -height; k2 < 0; k2 += yInc) {
            for (let l2 = -width; l2 < 0; l2++) {
                i = src[srcPos++];

                if (i !== 0) {
                    let i3 = dest[size];
                    dest[size++] = ((i & 0xff00ff) * alpha + (i3 & 0xff00ff) * j2 & -16711936) + ((i & 0xff00) * alpha + (i3 & 0xff00) * j2 & 0xff0000) >> 8;
                } else {
                    size++;
                }
            }

            size += extraXSpace;
            srcPos += k1;
        }
    }

    _drawSpriteAlpha_from11A(dest, coloursUsed, colourList, listPos, size, width, height, extraXSpace, j1, yInc, alpha) {
        let i2 = 256 - alpha;

        for (let j2 = -height; j2 < 0; j2 += yInc) {
            for (let k2 = -width; k2 < 0; k2++) {
                let l2 = coloursUsed[listPos++];

                if (l2 !== 0) {
                    l2 = colourList[l2 & 0xff];
                    let i3 = dest[size];
                    dest[size++] = ((l2 & 0xff00ff) * alpha + (i3 & 0xff00ff) * i2 & -16711936) + ((l2 & 0xff00) * alpha + (i3 & 0xff00) * i2 & 0xff0000) >> 8;
                } else {
                    size++;
                }
            }

            size += extraXSpace;
            listPos += j1;
        }
    }

    transparentScale(dest, src, i, j, k, destPos, i1, j1, k1, l1, i2, j2, yInc, alpha) {
        let i3 = 256 - alpha;

        try {
            let j3 = j;

            for (let k3 = -k1; k3 < 0; k3 += yInc) {
                let l3 = (k >> 16) * j2;

                for (let i4 = -j1; i4 < 0; i4++) {
                    i = src[(j >> 16) + l3];

                    if (i !== 0) {
                        let j4 = dest[destPos];
                        dest[destPos++] = ((i & 0xff00ff) * alpha + (j4 & 0xff00ff) * i3 & -16711936) + ((i & 0xff00) * alpha + (j4 & 0xff00) * i3 & 0xff0000) >> 8;
                    } else {
                        destPos++;
                    }

                    j += l1;
                }

                k += i2;
                j = j3;
                destPos += i1;
            }

            return;
        } catch (e) {
            console.log('error in tranScale');
        }
    }

    _plotScale_from14(target, pixels, i, j, k, l, i1, width, height, l1, i2, j2, yInc, colour) {
        let i3 = colour >> 16 & 0xff;
        let j3 = colour >> 8 & 0xff;
        let k3 = colour & 0xff;

        try {
            let l3 = j;

            for (let i4 = -height; i4 < 0; i4 += yInc) {
                let j4 = (k >> 16) * j2;
                for (let k4 = -width; k4 < 0; k4++) {
                    i = pixels[(j >> 16) + j4];

                    if (i !== 0) {
                        let l4 = i >> 16 & 0xff;
                        let i5 = i >> 8 & 0xff;
                        let j5 = i & 0xff;

                        if (l4 === i5 && i5 === j5) {
                            target[l++] = ((l4 * i3 >> 8) << 16) + ((i5 * j3 >> 8) << 8) + (j5 * k3 >> 8);
                        } else {
                            target[l++] = i;
                        }
                    } else {
                        l++;
                    }

                    j += l1;
                }

                k += i2;
                j = l3;
                l += i1;
            }

            return;
        } catch (e) {
            console.log('error in plotScale');
        }
    }

    // "scale" is not actually scaling when it comes to the landscape
    drawMinimapSprite(x, y, sprite, rotation, scale) {
        let j1 = this.width2;
        let k1 = this.height2;

        if (this.landscapeColours === null) {
            this.landscapeColours = new Int32Array(512);

            for (let l1 = 0; l1 < 256; l1++) {
                this.landscapeColours[l1] = (Math.sin(l1 * 0.02454369) * 32768) | 0;
                this.landscapeColours[l1 + 256] = (Math.cos(l1 * 0.02454369) * 32768) | 0;
            }
        }

        let i2 = -((this.spriteWidthFull[sprite] / 2) | 0);
        let j2 = -((this.spriteHeightFull[sprite] / 2) | 0);

        if (this.spriteTranslate[sprite]) {
            i2 += this.spriteTranslateX[sprite];
            j2 += this.spriteTranslateY[sprite];
        }

        let k2 = i2 + this.spriteWidth[sprite];
        let l2 = j2 + this.spriteHeight[sprite];
        let i3 = k2;
        let j3 = j2;
        let k3 = i2;
        let l3 = l2;
        rotation &= 0xff;
        let i4 = this.landscapeColours[rotation] * scale;
        let j4 = this.landscapeColours[rotation + 256] * scale;
        let k4 = x + (j2 * i4 + i2 * j4 >> 22);
        let l4 = y + (j2 * j4 - i2 * i4 >> 22);
        let i5 = x + (j3 * i4 + i3 * j4 >> 22);
        let j5 = y + (j3 * j4 - i3 * i4 >> 22);
        let k5 = x + (l2 * i4 + k2 * j4 >> 22);
        let l5 = y + (l2 * j4 - k2 * i4 >> 22);
        let i6 = x + (l3 * i4 + k3 * j4 >> 22);
        let j6 = y + (l3 * j4 - k3 * i4 >> 22);

        if (scale === 192 && (rotation & 0x3f) === (Surface.anInt348 & 0x3f)) {
            Surface.anInt346++;
        } else if (scale === 128) {
            Surface.anInt348 = rotation;
        } else {
            Surface.anInt347++;
        }

        let k6 = l4;
        let l6 = l4;

        if (j5 < k6) {
            k6 = j5;
        } else if (j5 > l6) {
            l6 = j5;
        }

        if (l5 < k6) {
            k6 = l5;
        } else if (l5 > l6) {
            l6 = l5;
        }

        if (j6 < k6) {
            k6 = j6;
        } else if (j6 > l6) {
            l6 = j6;
        }

        if (k6 < this.boundsTopY) {
            k6 = this.boundsTopY;
        }

        if (l6 > this.boundsBottomY) {
            l6 = this.boundsBottomY;
        }

        if (this.anIntArray340 === null || this.anIntArray340.length !== k1 + 1) {
            this.anIntArray340 = new Int32Array(k1 + 1);
            this.anIntArray341 = new Int32Array(k1 + 1);
            this.anIntArray342 = new Int32Array(k1 + 1);
            this.anIntArray343 = new Int32Array(k1 + 1);
            this.anIntArray344 = new Int32Array(k1 + 1);
            this.anIntArray345 = new Int32Array(k1 + 1);
        }

        for (let i7 = k6; i7 <= l6; i7++) {
            this.anIntArray340[i7] = 99999999;
            this.anIntArray341[i7] = -99999999;
        }

        let i8 = 0;
        let k8 = 0;
        let i9 = 0;
        let j9 = this.spriteWidth[sprite];
        let k9 = this.spriteHeight[sprite];

        i2 = 0;
        j2 = 0;
        i3 = j9 - 1;
        j3 = 0;
        k2 = j9 - 1;
        l2 = k9 - 1;
        k3 = 0;
        l3 = k9 - 1;

        if (j6 !== l4) {
            i8 = ((i6 - k4 << 8) / (j6 - l4)) | 0;
            i9 = ((l3 - j2 << 8) / (j6 - l4)) | 0;
        }

        let j7 = 0;
        let k7 = 0;
        let l7 = 0;
        let l8 = 0;

        if (l4 > j6) {
            l7 = i6 << 8;
            l8 = l3 << 8;
            j7 = j6;
            k7 = l4;
        } else {
            l7 = k4 << 8;
            l8 = j2 << 8;
            j7 = l4;
            k7 = j6;
        }

        if (j7 < 0) {
            l7 -= i8 * j7;
            l8 -= i9 * j7;
            j7 = 0;
        }

        if (k7 > k1 - 1) {
            k7 = k1 - 1;
        }

        for (let l9 = j7; l9 <= k7; l9++) {
            this.anIntArray340[l9] = this.anIntArray341[l9] = l7;
            l7 += i8;
            this.anIntArray342[l9] = this.anIntArray343[l9] = 0;
            this.anIntArray344[l9] = this.anIntArray345[l9] = l8;
            l8 += i9;
        }

        if (j5 !== l4) {
            i8 = ((i5 - k4 << 8) / (j5 - l4)) | 0;
            k8 = ((i3 - i2 << 8) / (j5 - l4)) | 0;
        }

        let j8 = 0;

        if (l4 > j5) {
            l7 = i5 << 8;
            j8 = i3 << 8;
            j7 = j5;
            k7 = l4;
        } else {
            l7 = k4 << 8;
            j8 = i2 << 8;
            j7 = l4;
            k7 = j5;
        }

        if (j7 < 0) {
            l7 -= i8 * j7;
            j8 -= k8 * j7;
            j7 = 0;
        }

        if (k7 > k1 - 1) {
            k7 = k1 - 1;
        }

        for (let i10 = j7; i10 <= k7; i10++) {
            if (l7 < this.anIntArray340[i10]) {
                this.anIntArray340[i10] = l7;
                this.anIntArray342[i10] = j8;
                this.anIntArray344[i10] = 0;
            }

            if (l7 > this.anIntArray341[i10]) {
                this.anIntArray341[i10] = l7;
                this.anIntArray343[i10] = j8;
                this.anIntArray345[i10] = 0;
            }

            l7 += i8;
            j8 += k8;
        }

        if (l5 !== j5) {
            i8 = ((k5 - i5 << 8) / (l5 - j5)) | 0;
            i9 = ((l2 - j3 << 8) / (l5 - j5)) | 0;
        }

        if (j5 > l5) {
            l7 = k5 << 8;
            j8 = k2 << 8;
            l8 = l2 << 8;
            j7 = l5;
            k7 = j5;
        } else {
            l7 = i5 << 8;
            j8 = i3 << 8;
            l8 = j3 << 8;
            j7 = j5;
            k7 = l5;
        }

        if (j7 < 0) {
            l7 -= i8 * j7;
            l8 -= i9 * j7;
            j7 = 0;
        }

        if (k7 > k1 - 1) {
            k7 = k1 - 1;
        }

        for (let j10 = j7; j10 <= k7; j10++) {
            if (l7 < this.anIntArray340[j10]) {
                this.anIntArray340[j10] = l7;
                this.anIntArray342[j10] = j8;
                this.anIntArray344[j10] = l8;
            }

            if (l7 > this.anIntArray341[j10]) {
                this.anIntArray341[j10] = l7;
                this.anIntArray343[j10] = j8;
                this.anIntArray345[j10] = l8;
            }

            l7 += i8;
            l8 += i9;
        }

        if (j6 !== l5) {
            i8 = ((i6 - k5 << 8) / (j6 - l5)) | 0;
            k8 = ((k3 - k2 << 8) / (j6 - l5)) | 0;
        }

        if (l5 > j6) {
            l7 = i6 << 8;
            j8 = k3 << 8;
            l8 = l3 << 8;
            j7 = j6;
            k7 = l5;
        } else {
            l7 = k5 << 8;
            j8 = k2 << 8;
            l8 = l2 << 8;
            j7 = l5;
            k7 = j6;
        }

        if (j7 < 0) {
            l7 -= i8 * j7;
            j8 -= k8 * j7;
            j7 = 0;
        }

        if (k7 > k1 - 1) {
            k7 = k1 - 1;
        }

        for (let k10 = j7; k10 <= k7; k10++) {
            if (l7 < this.anIntArray340[k10]) {
                this.anIntArray340[k10] = l7;
                this.anIntArray342[k10] = j8;
                this.anIntArray344[k10] = l8;
            }

            if (l7 > this.anIntArray341[k10]) {
                this.anIntArray341[k10] = l7;
                this.anIntArray343[k10] = j8;
                this.anIntArray345[k10] = l8;
            }

            l7 += i8;
            j8 += k8;
        }

        let l10 = k6 * j1;
        let ai = this.surfacePixels[sprite];

        for (let i11 = k6; i11 < l6; i11++) {
            let j11 = this.anIntArray340[i11] >> 8;
            let k11 = this.anIntArray341[i11] >> 8;

            if (k11 - j11 <= 0) {
                l10 += j1;
            } else {
                let l11 = this.anIntArray342[i11] << 9;
                let i12 = (((this.anIntArray343[i11] << 9) - l11) / (k11 - j11)) | 0;
                let j12 = this.anIntArray344[i11] << 9;
                let k12 = (((this.anIntArray345[i11] << 9) - j12) / (k11 - j11)) | 0;

                if (j11 < this.boundsTopX) {
                    l11 += (this.boundsTopX - j11) * i12;
                    j12 += (this.boundsTopX - j11) * k12;
                    j11 = this.boundsTopX;
                }

                if (k11 > this.boundsBottomX) {
                    k11 = this.boundsBottomX;
                }

                if (!this.interlace || (i11 & 1) === 0) {
                    if (!this.spriteTranslate[sprite]) {
                        this.drawMinimap(this.pixels, ai, 0, l10 + j11, l11, j12, i12, k12, j11 - k11, j9);
                    } else {
                        this.drawMinimapTranslate(this.pixels, ai, 0, l10 + j11, l11, j12, i12, k12, j11 - k11, j9);
                    }
                }

                l10 += j1;
            }
        }
    }

    drawMinimap(ai, ai1, i, j, k, l, i1, j1, k1, l1) {
        for (i = k1; i < 0; i++) {
            this.pixels[j++] = ai1[(k >> 17) + (l >> 17) * l1];
            k += i1;
            l += j1;
        }
    }

    drawMinimapTranslate(ai, ai1, i, j, k, l, i1, j1, k1, l1) {
        for (let i2 = k1; i2 < 0; i2++) {
            i = ai1[(k >> 17) + (l >> 17) * l1];

            if (i !== 0) {
                this.pixels[j++] = i;
            } else {
                j++;
            }

            k += i1;
            l += j1;
        }
    }

    _spriteClipping_from9(x, y, w, h, sprite, colour1, colour2, l1, flag) {
        try {
            if (colour1 === 0) {
                colour1 = 0xffffff;
            }

            if (colour2 === 0) {
                colour2 = 0xffffff;
            }

            let width = this.spriteWidth[sprite];
            let height = this.spriteHeight[sprite];
            let k2 = 0;
            let l2 = 0;
            let i3 = l1 << 16;
            let j3 = ((width << 16) / w) | 0;
            let k3 = ((height << 16) / h) | 0;
            let l3 = -(((l1 << 16) / h) | 0);

            if (this.spriteTranslate[sprite]) {
                let fullWidth = this.spriteWidthFull[sprite];
                let fullHeight = this.spriteHeightFull[sprite];
                j3 = ((fullWidth << 16) / w) | 0;
                k3 = ((fullHeight << 16) / h) | 0;
                let j5 = this.spriteTranslateX[sprite];
                let k5 = this.spriteTranslateY[sprite];

                if (flag) {
                    j5 = fullWidth - this.spriteWidth[sprite] - j5;
                }

                x += (((j5 * w + fullWidth) - 1) / fullWidth) | 0;
                let l5 = (((k5 * h + fullHeight) - 1) / fullHeight) | 0;
                y += l5;
                i3 += l5 * l3;

                if ((j5 * w) % fullWidth !== 0) {
                    k2 = ((fullWidth - (j5 * w) % fullWidth << 16) / w) | 0;
                }

                if ((k5 * h) % fullHeight !== 0) {
                    l2 = ((fullHeight - (k5 * h) % fullHeight << 16) / h) | 0;
                }

                w = (((((this.spriteWidth[sprite] << 16) - k2) + j3) - 1) / j3) | 0;
                h = (((((this.spriteHeight[sprite] << 16) - l2) + k3) - 1) / k3) | 0;
            }

            let j4 = y * this.width2;
            i3 += x << 16;

            if (y < this.boundsTopY) {
                let l4 = this.boundsTopY - y;
                h -= l4;
                y = this.boundsTopY;
                j4 += l4 * this.width2;
                l2 += k3 * l4;
                i3 += l3 * l4;
            }

            if (y + h >= this.boundsBottomY) {
                h -= ((y + h) - this.boundsBottomY) + 1;
            }

            let i5 = j4 / this.width2 & 1;

            if (!this.interlace) {
                i5 = 2;
            }

            if (colour2 === 0xffffff) {
                if (this.surfacePixels[sprite] !== null) {
                    if (!flag) {
                        this._transparentSpritePlot_from15(this.pixels, this.surfacePixels[sprite], 0, k2, l2, j4, w, h, j3, k3, width, colour1, i3, l3, i5);
                        return;
                    } else {
                        this._transparentSpritePlot_from15(this.pixels, this.surfacePixels[sprite], 0, (this.spriteWidth[sprite] << 16) - k2 - 1, l2, j4, w, h, -j3, k3, width, colour1, i3, l3, i5);
                        return;
                    }
                }

                if (!flag) {
                    this._transparentSpritePlot_from16A(this.pixels, this.spriteColoursUsed[sprite], this.spriteColourList[sprite], 0, k2, l2, j4, w, h, j3, k3, width, colour1, i3, l3, i5);
                    return;
                } else {
                    this._transparentSpritePlot_from16A(this.pixels, this.spriteColoursUsed[sprite], this.spriteColourList[sprite], 0, (this.spriteWidth[sprite] << 16) - k2 - 1, l2, j4, w, h, -j3, k3, width, colour1, i3, l3, i5);
                    return;
                }
            }

            if (this.surfacePixels[sprite] !== null) {
                if (!flag) {
                    this._transparentSpritePlot_from16(this.pixels, this.surfacePixels[sprite], 0, k2, l2, j4, w, h, j3, k3, width, colour1, colour2, i3, l3, i5);
                    return;
                } else {
                    this._transparentSpritePlot_from16(this.pixels, this.surfacePixels[sprite], 0, (this.spriteWidth[sprite] << 16) - k2 - 1, l2, j4, w, h, -j3, k3, width, colour1, colour2, i3, l3, i5);
                    return;
                }
            }

            if (!flag) {
                this._transparentSpritePlot_from17(this.pixels, this.spriteColoursUsed[sprite], this.spriteColourList[sprite], 0, k2, l2, j4, w, h, j3, k3, width, colour1, colour2, i3, l3, i5);
                return;
            } else {
                this._transparentSpritePlot_from17(this.pixels, this.spriteColoursUsed[sprite], this.spriteColourList[sprite], 0, (this.spriteWidth[sprite] << 16) - k2 - 1, l2, j4, w, h, -j3, k3, width, colour1, colour2, i3, l3, i5);
                return;
            }
        } catch (e) {
            console.log('error in sprite clipping routine');
            console.error(e);
        }
    }

    _transparentSpritePlot_from15(dest, src, i, j, k, destPos, i1, j1, k1, l1, i2, j2, k2, l2, i3) {
        let i4 = j2 >> 16 & 0xff;
        let j4 = j2 >> 8 & 0xff;
        let k4 = j2 & 0xff;

        try {
            let l4 = j;

            for (let i5 = -j1; i5 < 0; i5++) {
                let j5 = (k >> 16) * i2;
                let k5 = k2 >> 16;
                let l5 = i1;

                if (k5 < this.boundsTopX) {
                    let i6 = this.boundsTopX - k5;

                    l5 -= i6;
                    k5 = this.boundsTopX;
                    j += k1 * i6;
                }

                if (k5 + l5 >= this.boundsBottomX) {
                    let j6 = (k5 + l5) - this.boundsBottomX;

                    l5 -= j6;
                }

                i3 = 1 - i3;

                if (i3 !== 0) {
                    for (let k6 = k5; k6 < k5 + l5; k6++) {
                        i = src[(j >> 16) + j5];

                        if (i !== 0) {
                            let j3 = i >> 16 & 0xff;
                            let k3 = i >> 8 & 0xff;
                            let l3 = i & 0xff;

                            if (j3 === k3 && k3 === l3) {
                                dest[k6 + destPos] = ((j3 * i4 >> 8) << 16) + ((k3 * j4 >> 8) << 8) + (l3 * k4 >> 8);
                            } else {
                                dest[k6 + destPos] = i;
                            }
                        }

                        j += k1;
                    }
                }

                k += l1;
                j = l4;
                destPos += this.width2;
                k2 += l2;
            }

            return;
        } catch (e) {
            console.error('error in transparent sprite plot routine');
        }
    }

    _transparentSpritePlot_from16(dest, src, i, j, k, destPos, i1, j1, k1, l1, i2, j2, k2, l2, i3, j3) {
        let j4 = j2 >> 16 & 0xff;
        let k4 = j2 >> 8 & 0xff;
        let l4 = j2 & 0xff;
        let i5 = k2 >> 16 & 0xff;
        let j5 = k2 >> 8 & 0xff;
        let k5 = k2 & 0xff;

        try {
            let l5 = j;

            for (let i6 = -j1; i6 < 0; i6++) {
                let j6 = (k >> 16) * i2;
                let k6 = l2 >> 16;
                let l6 = i1;

                if (k6 < this.boundsTopX) {
                    let i7 = this.boundsTopX - k6;
                    l6 -= i7;
                    k6 = this.boundsTopX;
                    j += k1 * i7;
                }

                if (k6 + l6 >= this.boundsBottomX) {
                    let j7 = (k6 + l6) - this.boundsBottomX;
                    l6 -= j7;
                }

                j3 = 1 - j3;

                if (j3 !== 0) {
                    for (let k7 = k6; k7 < k6 + l6; k7++) {
                        i = src[(j >> 16) + j6];

                        if (i !== 0) {
                            let k3 = i >> 16 & 0xff;
                            let l3 = i >> 8 & 0xff;
                            let i4 = i & 0xff;

                            if (k3 === l3 && l3 === i4) {
                                dest[k7 + destPos] = ((k3 * j4 >> 8) << 16) + ((l3 * k4 >> 8) << 8) + (i4 * l4 >> 8);
                            } else if (k3 === 255 && l3 === i4) {
                                dest[k7 + destPos] = ((k3 * i5 >> 8) << 16) + ((l3 * j5 >> 8) << 8) + (i4 * k5 >> 8);
                            } else {
                                dest[k7 + destPos] = i;
                            }
                        }

                        j += k1;
                    }
                }

                k += l1;
                j = l5;
                destPos += this.width2;
                l2 += i3;
            }

            return;
        } catch (e) {
            console.log('error in transparent sprite plot routine');
        }
    }

    _transparentSpritePlot_from16A(dest, colourIdx, colours, i, j, k, l, i1, j1, k1, l1, i2, j2, k2, l2, i3) {
        let i4 = j2 >> 16 & 0xff;
        let j4 = j2 >> 8 & 0xff;
        let k4 = j2 & 0xff;

        try {
            let l4 = j;

            for (let i5 = -j1; i5 < 0; i5++) {
                let j5 = (k >> 16) * i2;
                let k5 = k2 >> 16;
                let l5 = i1;

                if (k5 < this.boundsTopX) {
                    let i6 = this.boundsTopX - k5;
                    l5 -= i6;
                    k5 = this.boundsTopX;
                    j += k1 * i6;
                }

                if (k5 + l5 >= this.boundsBottomX) {
                    let j6 = (k5 + l5) - this.boundsBottomX;
                    l5 -= j6;
                }

                i3 = 1 - i3;

                if (i3 !== 0) {
                    for (let k6 = k5; k6 < k5 + l5; k6++) {
                        i = colourIdx[(j >> 16) + j5] & 0xff;

                        if (i !== 0) {
                            i = colours[i];

                            let j3 = i >> 16 & 0xff;
                            let k3 = i >> 8 & 0xff;
                            let l3 = i & 0xff;

                            if (j3 === k3 && k3 === l3) {
                                dest[k6 + l] = ((j3 * i4 >> 8) << 16) + ((k3 * j4 >> 8) << 8) + (l3 * k4 >> 8);
                            } else {
                                dest[k6 + l] = i;
                            }
                        }

                        j += k1;
                    }
                }

                k += l1;
                j = l4;
                l += this.width2;
                k2 += l2;
            }

            return;
        } catch (e) {
            console.log('error in transparent sprite plot routine');
        }
    }

    _transparentSpritePlot_from17(dest, coloursUsed, colourList, i, j, k, l, i1, j1, k1, l1, i2, j2, k2, l2, i3, j3) {
        let j4 = j2 >> 16 & 0xff;
        let k4 = j2 >> 8 & 0xff;
        let l4 = j2 & 0xff;
        let i5 = k2 >> 16 & 0xff;
        let j5 = k2 >> 8 & 0xff;
        let k5 = k2 & 0xff;

        try {
            let l5 = j;

            for (let i6 = -j1; i6 < 0; i6++) {
                let j6 = (k >> 16) * i2;
                let k6 = l2 >> 16;
                let l6 = i1;

                if (k6 < this.boundsTopX) {
                    let i7 = this.boundsTopX - k6;
                    l6 -= i7;
                    k6 = this.boundsTopX;
                    j += k1 * i7;
                }

                if (k6 + l6 >= this.boundsBottomX) {
                    let j7 = (k6 + l6) - this.boundsBottomX;
                    l6 -= j7;
                }

                j3 = 1 - j3;

                if (j3 !== 0) {
                    for (let k7 = k6; k7 < k6 + l6; k7++) {
                        i = coloursUsed[(j >> 16) + j6] & 0xff;

                        if (i !== 0) {
                            i = colourList[i];
                            let k3 = i >> 16 & 0xff;
                            let l3 = i >> 8 & 0xff;
                            let i4 = i & 0xff;

                            if (k3 === l3 && l3 === i4) {
                                dest[k7 + l] = ((k3 * j4 >> 8) << 16) + ((l3 * k4 >> 8) << 8) + (i4 * l4 >> 8);
                            } else if (k3 === 255 && l3 === i4) {
                                dest[k7 + l] = ((k3 * i5 >> 8) << 16) + ((l3 * j5 >> 8) << 8) + (i4 * k5 >> 8);
                            } else {
                                dest[k7 + l] = i;
                            }
                        }

                        j += k1;
                    }
                }

                k += l1;
                j = l5;
                l += this.width2;
                l2 += i3;
            }

            return;
        } catch (e) {
            console.log('error in transparent sprite plot routine');
        }
    }

    drawStringRight(text, x, y, font, colour) {
        this.drawString(text, x - this.textWidth(text, font), y, font, colour);
    }

    drawStringCenter(text, x, y, font, colour) {
        this.drawString(text, x - ((this.textWidth(text, font) / 2) | 0), y, font, colour);
    }

    drawParagraph(text, x, y, font, colour, max) {
        try {
            let width = 0;
            let fontData = Surface.gameFonts[font];
            let start = 0;
            let end = 0;

            for (let index = 0; index < text.length; index++) {
                if (text[index] === '@' && index + 4 < text.length && text[index + 4] === '@') {
                    index += 4;
                } else if (text[index] === '~' && index + 4 < text.length && text[index + 4] === '~') {
                    index += 4;
                } else {
                    width += fontData[Surface.characterWidth[text.charCodeAt(index)] + 7];
                }

                if (text[index] === ' ') {
                    end = index;
                }

                if (text[index] === '%') {
                    end = index;
                    width = 1000;
                }

                if (width > max) {
                    if (end <= start) {
                        end = index;
                    }

                    this.drawStringCenter(text.slice(start, end), x, y, font, colour);
                    width = 0;
                    start = index = end + 1;
                    y += this.textHeight(font);
                }
            }

            if (width > 0) {
                this.drawStringCenter(text.slice(start), x, y, font, colour);
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    drawString(text, x, y, font, colour) {
        try {
            let fontData = Surface.gameFonts[font];

            for (let i = 0; i < text.length; i++) {
                if (text[i] === '@' && i + 4 < text.length && text[i + 4] === '@') {
                    if (text.slice(i + 1, i + 4).toLowerCase() === 'red') {
                        colour = 0xff0000;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'lre') {
                        colour = 0xff9040;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'yel') {
                        colour = 0xffff00;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'gre') {
                        colour = 65280;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'blu') {
                        colour = 255;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'cya') {
                        colour = 65535;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'mag') {
                        colour = 0xff00ff;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'whi') {
                        colour = 0xffffff;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'bla') {
                        colour = 0;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'dre') {
                        colour = 0xc00000;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'ora') {
                        colour = 0xff9040;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'ran') {
                        colour = (Math.random() * 16777215) | 0;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'or1') {
                        colour = 0xffb000;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'or2') {
                        colour = 0xff7000;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'or3') {
                        colour = 0xff3000;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'gr1') {
                        colour = 0xc0ff00;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'gr2') {
                        colour = 0x80ff00;
                    } else if (text.slice(i + 1, i + 4).toLowerCase() === 'gr3') {
                        colour = 0x40ff00;
                    }

                    i += 4;
                } else if (text[i] === '~' && i + 4 < text.length && text[i + 4] === '~') {
                    let c = text.charCodeAt(i + 1);
                    let c1 = text.charCodeAt(i + 2);
                    let c2 = text.charCodeAt(i + 3);

                    if (c >= C_0 && c <= C_9 && c1 >= C_0 && c1 <= C_9 && c2 >= C_0 && c2 <= C_9) {
                        x = Number(text.substring(i + 1, i + 4)) | 0;
                    }

                    i += 4;
                } else {
                    let width = Surface.characterWidth[text.charCodeAt(i)];

                    if (this.loggedIn && colour !== 0) {
                        this.drawCharacter(width, x + 1, y, 0, fontData);
                        this.drawCharacter(width, x, y + 1, 0, fontData);
                    }

                    this.drawCharacter(width, x, y, colour, fontData);
                    x += fontData[width + 7];
                }
            }
        } catch (e) {
            console.error(e);
            return;
        }
    }

    drawCharacter(width, x, y, colour, font) {
        let i1 = x + font[width + 5];
        let j1 = y - font[width + 6];
        let k1 = font[width + 3];
        let l1 = font[width + 4];
        let i2 = font[width] * 16384 + font[width + 1] * 128 + font[width + 2];
        let j2 = i1 + j1 * this.width2;
        let k2 = this.width2 - k1;
        let l2 = 0;

        if (j1 < this.boundsTopY) {
            let i3 = this.boundsTopY - j1;
            l1 -= i3;
            j1 = this.boundsTopY;
            i2 += i3 * k1;
            j2 += i3 * this.width2;
        }

        if (j1 + l1 >= this.boundsBottomY) {
            l1 -= ((j1 + l1) - this.boundsBottomY) + 1;
        }

        if (i1 < this.boundsTopX) {
            let j3 = this.boundsTopX - i1;
            k1 -= j3;
            i1 = this.boundsTopX;
            i2 += j3;
            j2 += j3;
            l2 += j3;
            k2 += j3;
        }

        if (i1 + k1 >= this.boundsBottomX) {
            let k3 = ((i1 + k1) - this.boundsBottomX) + 1;
            k1 -= k3;
            l2 += k3;
            k2 += k3;
        }

        if (k1 > 0 && l1 > 0) {
            this.plotLetter(this.pixels, font, colour, i2, j2, k1, l1, k2, l2);
        }
    }

    plotLetter(ai, abyte0, i, j, k, l, i1, j1, k1) {
        try {
            let l1 = -(l >> 2);

            l = -(l & 3);

            for (let i2 = -i1; i2 < 0; i2++) {
                for (let j2 = l1; j2 < 0; j2++) {
                    if (abyte0[j++] !== 0) {
                        ai[k++] = i;
                    } else {
                        k++;
                    }

                    if (abyte0[j++] !== 0) {
                        ai[k++] = i;
                    } else {
                        k++;
                    }

                    if (abyte0[j++] !== 0) {
                        ai[k++] = i;
                    } else {
                        k++;
                    }

                    if (abyte0[j++] !== 0) {
                        ai[k++] = i;
                    } else {
                        k++;
                    }
                }

                for (let k2 = l; k2 < 0; k2++) {
                    if (abyte0[j++] !== 0) {
                        ai[k++] = i;
                    } else {
                        k++;
                    }
                }

                k += j1;
                j += k1;
            }
        } catch (e) {
            console.error(e);
        }
    }

    // todo
    method259(ai, abyte0, i, j, k, l, i1, j1, k1) {
        for (let l1 = -i1; l1 < 0; l1++) {
            for (let i2 = -l; i2 < 0; i2++) {
                let j2 = abyte0[j++] & 0xff;

                if (j2 > 30) {
                    if (j2 >= 230) {
                        ai[k++] = i;
                    } else {
                        let k2 = ai[k];
                        ai[k++] = ((i & 0xff00ff) * j2 + (k2 & 0xff00ff) * (256 - j2) & 0xff00ff00) + ((i & 0xff00) * j2 + (k2 & 0xff00) * (256 - j2) & 0xff0000) >> 8;
                    }
                } else {
                    k++;
                }
            }

            k += j1;
            j += k1;
        }
    }

    textHeight(fontId) {
        if (fontId === 0) {
            return 12;
        }

        if (fontId === 1) {
            return 14;
        }

        if (fontId === 2) {
            return 14;
        }

        if (fontId === 3) {
            return 15;
        }

        if (fontId === 4) {
            return 15;
        }

        if (fontId === 5) {
            return 19;
        }

        if (fontId === 6) {
            return 24;
        }

        if (fontId === 7) {
            return 29;
        } else {
            return this.textHeightFont(fontId);
        }
    }

    textHeightFont(fontId) {
        if (fontId === 0) {
            return Surface.gameFonts[fontId][8] - 2;
        } else {
            return Surface.gameFonts[fontId][8] - 1;
        }
    }

    textWidth(text, fontId) {
        let total = 0;
        let font = Surface.gameFonts[fontId];

        for (let idx = 0; idx < text.length; idx++) {
            if (text[idx] === '@' && idx + 4 < text.length && text[idx + 4] === '@') {
                idx += 4;
            } else if (text[idx] === '~' && idx + 4 < text.length && text[idx + 4] === '~') {
                idx += 4;
            } else {
                total += font[Surface.characterWidth[text.charCodeAt(idx)] + 7];
            }
        }

        return total;
    }

    drawTabs(x, y, width, height, tabs, selected) {
        const tabWidth = (width / tabs.length) | 0;
        let xOffset = 0;

        for (let i = 0; i < tabs.length; i += 1) {
            const tabColour = selected === i ? LIGHT_GREY : DARK_GREY;

            this.drawBoxAlpha(x + xOffset, y, tabWidth, height, tabColour, 128);
            this.drawStringCenter(tabs[i], x + xOffset + ((tabWidth / 2) | 0),
                y + 16, 4, BLACK);

            if (i > 0) {
                this.drawLineVert(x + xOffset, y, height, BLACK);
            }

            xOffset += tabWidth;
        }

        this.drawLineHoriz(x, y + height, width, BLACK);
    }
}

Surface.anInt346 = 0;
Surface.anInt347 = 0;
Surface.anInt348 = 0;

Surface.gameFonts = [];
Surface.gameFonts.length = 50;
Surface.gameFonts.fill(null);

Surface.characterWidth = new Int32Array(256);

let s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"\243$%^&*()-_=+[{]};:\'@#~,<.>/?\\| ';

for (let i = 0; i < 256; i++) {
    let j = s.indexOf(String.fromCharCode(i));

    if (j === -1) {
        j = 74;
    }

    Surface.characterWidth[i] = j * 9;
}

module.exports = Surface;
