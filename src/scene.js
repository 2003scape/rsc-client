const Long = require('long');
const Polygon = require('./polygon');
const Scanline = require('./scanline');

const COLOUR_TRANSPARENT = 12345678;

class Scene {
    constructor(surface, maxModelCount, polygonCount, spriteCount) {
        this.lastVisiblePolygonsCount = 0;
        this.anIntArray377 = null;
        this.textureCount = 0;
        this.textureColoursUsed = null;
        this.textureColourList = null;
        this.textureDimension = null;
        this.textureLoadedNumber = null;
        this.texturePixels = null;
        this.textureBackTransparent = null;
        this.textureColours64 = null;
        this.textureColours128 = null;
        this.scanlines = null;
        this.minY = 0;
        this.maxY = 0;
        this.interlace = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mousePickedCount = 0;
        this.newStart = 0;
        this.newEnd = 0;
        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraZ = 0;
        this.cameraYaw = 0;
        this.cameraPitch = 0;
        this.cameraRoll = 0;

        this.rampCount = 50;
        this.gradientBase = new Int32Array(this.rampCount);

        this.gradientRamps = [];

        for (let _i = 0; _i < this.rampCount; _i += 1) {
            this.gradientRamps.push(new Int32Array(256));
        }

        this.clipNear = 5;
        this.clipFar3d = 1000;
        this.clipFar2d = 1000;
        this.fogZFalloff = 20;
        this.fogZDistance = 10;
        this.wideBand = false;
        this.mousePickingActive = false;
        this.mousePickedMax = 100;
        this.mousePickedModels = [];
        this.mousePickedModels.length = this.mousePickedMax;
        this.mousePickedModels.fill(null);
        this.mousePickedFaces = new Int32Array(this.mousePickedMax);
        this.width = 512;
        this.clipX = 256;
        this.clipY = 192;
        this.baseX = 256;
        this.baseY = 256;
        this.viewDistance = 8;
        this.normalMagnitude = 4;
        this.planeX = new Int32Array(40);
        this.planeY = new Int32Array(40);
        this.vertexShade = new Int32Array(40);
        this.vertexX = new Int32Array(40);
        this.vertexY = new Int32Array(40);
        this.vertexZ = new Int32Array(40);
        this.interlace = false;
        this.surface = surface;
        this.clipX = (surface.width2 / 2) | 0;
        this.clipY = (surface.height2 / 2) | 0;
        this.raster = surface.pixels;
        this.modelCount = 0;
        this.maxModelCount = maxModelCount;
        this.models = [];
        this.models.length = this.maxModelCount;
        this.models.fill(null);

        this.visiblePolygonsCount = 0;
        this.visiblePolygons = [];

        for (let l = 0; l < polygonCount; l++) {
            this.visiblePolygons.push(new Polygon());
        }

        this.spriteCount = 0;
        //this.view = new GameModel(k * 2, k);
        this.spriteId = new Int32Array(spriteCount);
        this.spriteWidth = new Int32Array(spriteCount);
        this.spriteHeight = new Int32Array(spriteCount);
        this.spriteX = new Int32Array(spriteCount);
        this.spriteZ = new Int32Array(spriteCount);
        this.spriteY = new Int32Array(spriteCount);
        this.spriteTranslateX = new Int32Array(spriteCount);

        if (this.aByteArray434 === null) {
            this.aByteArray434 = new Int8Array(17691);
        }

        this.cameraX = 0;
        this.cameraY = 0;
        this.cameraZ = 0;
        this.cameraYaw = 0;
        this.cameraPitch = 0;
        this.cameraRoll = 0;

        for (let i1 = 0; i1 < 256; i1++) {
            Scene.sin512Cache[i1] = (Math.sin(i1 * 0.02454369) * 32768) | 0;
            Scene.sin512Cache[i1 + 256] =
                (Math.cos(i1 * 0.02454369) * 32768) | 0;
        }

        for (let j1 = 0; j1 < 1024; j1++) {
            Scene.sinCosCache[j1] = (Math.sin(j1 * 0.00613592315) * 32768) | 0;
            Scene.sinCosCache[j1 + 1024] =
                (Math.cos(j1 * 0.00613592315) * 32768) | 0;
        }
    }

    static textureScanline(
        ai,
        ai1,
        i,
        j,
        k,
        l,
        i1,
        j1,
        k1,
        l1,
        i2,
        j2,
        k2,
        l2
    ) {
        if (i2 <= 0) {
            return;
        }

        let i3 = 0;
        let j3 = 0;
        let i4 = 0;

        if (i1 !== 0) {
            i = (k / i1) << 7;
            j = (l / i1) << 7;
        }

        if (i < 0) {
            i = 0;
        } else if (i > 16256) {
            i = 16256;
        }

        k += j1;
        l += k1;
        i1 += l1;

        if (i1 !== 0) {
            i3 = (k / i1) << 7;
            j3 = (l / i1) << 7;
        }

        if (i3 < 0) {
            i3 = 0;
        } else if (i3 > 16256) {
            i3 = 16256;
        }

        let k3 = (i3 - i) >> 4;
        let l3 = (j3 - j) >> 4;

        for (let j4 = i2 >> 4; j4 > 0; j4--) {
            i += k2 & 0x600000;
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            i = (i & 0x3fff) + (k2 & 0x600000);
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            i = (i & 0x3fff) + (k2 & 0x600000);
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            i = (i & 0x3fff) + (k2 & 0x600000);
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i = i3;
            j = j3;
            k += j1;
            l += k1;
            i1 += l1;

            if (i1 !== 0) {
                i3 = (k / i1) << 7;
                j3 = (l / i1) << 7;
            }

            if (i3 < 0) {
                i3 = 0;
            } else if (i3 > 16256) {
                i3 = 16256;
            }

            k3 = (i3 - i) >> 4;
            l3 = (j3 - j) >> 4;
        }

        for (let k4 = 0; k4 < (i2 & 0xf); k4++) {
            if ((k4 & 3) === 0) {
                i = (i & 0x3fff) + (k2 & 0x600000);
                i4 = k2 >> 23;
                k2 += l2;
            }

            ai[j2++] = ai1[(j & 0x3f80) + (i >> 7)] >>> i4;
            i += k3;
            j += l3;
        }
    }

    static textureTranslucentScanline(
        ai,
        ai1,
        i,
        j,
        k,
        l,
        i1,
        j1,
        k1,
        l1,
        i2,
        j2,
        k2,
        l2
    ) {
        if (i2 <= 0) {
            return;
        }

        let i3 = 0;
        let j3 = 0;
        let i4 = 0;

        if (i1 !== 0) {
            i = (k / i1) << 7;
            j = (l / i1) << 7;
        }

        if (i < 0) {
            i = 0;
        } else if (i > 16256) {
            i = 16256;
        }

        k += j1;
        l += k1;
        i1 += l1;

        if (i1 !== 0) {
            i3 = (k / i1) << 7;
            j3 = (l / i1) << 7;
        }

        if (i3 < 0) {
            i3 = 0;
        } else if (i3 > 16256) {
            i3 = 16256;
        }

        let k3 = (i3 - i) >> 4;
        let l3 = (j3 - j) >> 4;

        for (let j4 = i2 >> 4; j4 > 0; j4--) {
            i += k2 & 0x600000;
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            i = (i & 0x3fff) + (k2 & 0x600000);
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            i = (i & 0x3fff) + (k2 & 0x600000);
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            i = (i & 0x3fff) + (k2 & 0x600000);
            i4 = k2 >> 23;
            k2 += l2;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i = i3;
            j = j3;
            k += j1;
            l += k1;
            i1 += l1;

            if (i1 !== 0) {
                i3 = (k / i1) << 7;
                j3 = (l / i1) << 7;
            }

            if (i3 < 0) {
                i3 = 0;
            } else if (i3 > 16256) {
                i3 = 16256;
            }

            k3 = (i3 - i) >> 4;
            l3 = (j3 - j) >> 4;
        }

        for (let k4 = 0; k4 < (i2 & 0xf); k4++) {
            if ((k4 & 3) === 0) {
                i = (i & 0x3fff) + (k2 & 0x600000);
                i4 = k2 >> 23;
                k2 += l2;
            }

            ai[j2++] =
                (ai1[(j & 0x3f80) + (i >> 7)] >>> i4) +
                ((ai[j2] >> 1) & 0x7f7f7f);
            i += k3;
            j += l3;
        }
    }

    static textureBackTranslucentScanline(
        ai,
        i,
        j,
        k,
        ai1,
        l,
        i1,
        j1,
        k1,
        l1,
        i2,
        j2,
        k2,
        l2,
        i3
    ) {
        if (j2 <= 0) {
            return;
        }

        let j3 = 0;
        let k3 = 0;
        i3 <<= 2;

        if (j1 !== 0) {
            j3 = (l / j1) << 7;
            k3 = (i1 / j1) << 7;
        }

        if (j3 < 0) {
            j3 = 0;
        } else if (j3 > 16256) {
            j3 = 16256;
        }

        for (let j4 = j2; j4 > 0; j4 -= 16) {
            l += k1;
            i1 += l1;
            j1 += i2;
            j = j3;
            k = k3;

            if (j1 !== 0) {
                j3 = (l / j1) << 7;
                k3 = (i1 / j1) << 7;
            }

            if (j3 < 0) {
                j3 = 0;
            } else if (j3 > 16256) {
                j3 = 16256;
            }

            let l3 = (j3 - j) >> 4;
            let i4 = (k3 - k) >> 4;
            let k4 = l2 >> 23;

            j += l2 & 0x600000;
            l2 += i3;

            if (j4 < 16) {
                for (let l4 = 0; l4 < j4; l4++) {
                    if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                        ai[k2] = i;
                    }

                    k2++;
                    j += l3;
                    k += i4;

                    if ((l4 & 3) === 3) {
                        j = (j & 0x3fff) + (l2 & 0x600000);
                        k4 = l2 >> 23;
                        l2 += i3;
                    }
                }
            } else {
                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;
                j = (j & 0x3fff) + (l2 & 0x600000);
                k4 = l2 >> 23;
                l2 += i3;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;
                j = (j & 0x3fff) + (l2 & 0x600000);
                k4 = l2 >> 23;
                l2 += i3;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;
                j = (j & 0x3fff) + (l2 & 0x600000);
                k4 = l2 >> 23;
                l2 += i3;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0x3f80) + (j >> 7)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
            }
        }
    }

    static textureScanline2(
        ai,
        ai1,
        i,
        j,
        k,
        l,
        i1,
        j1,
        k1,
        l1,
        i2,
        j2,
        k2,
        l2
    ) {
        if (i2 <= 0) {
            return;
        }

        let i3 = 0;
        let j3 = 0;
        l2 <<= 2;

        if (i1 !== 0) {
            i3 = (k / i1) << 6;
            j3 = (l / i1) << 6;
        }

        if (i3 < 0) {
            i3 = 0;
        } else if (i3 > 4032) {
            i3 = 4032;
        }

        for (let i4 = i2; i4 > 0; i4 -= 16) {
            k += j1;
            l += k1;
            i1 += l1;
            i = i3;
            j = j3;

            if (i1 !== 0) {
                i3 = (k / i1) << 6;
                j3 = (l / i1) << 6;
            }

            if (i3 < 0) {
                i3 = 0;
            } else if (i3 > 4032) {
                i3 = 4032;
            }

            let k3 = (i3 - i) >> 4;
            let l3 = (j3 - j) >> 4;
            let j4 = k2 >> 20;
            i += k2 & 0xc0000;
            k2 += l2;

            if (i4 < 16) {
                for (let k4 = 0; k4 < i4; k4++) {
                    ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                    i += k3;
                    j += l3;

                    if ((k4 & 3) === 3) {
                        i = (i & 0xfff) + (k2 & 0xc0000);
                        j4 = k2 >> 20;
                        k2 += l2;
                    }
                }
            } else {
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                i = (i & 0xfff) + (k2 & 0xc0000);
                j4 = k2 >> 20;
                k2 += l2;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                i = (i & 0xfff) + (k2 & 0xc0000);
                j4 = k2 >> 20;
                k2 += l2;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                i = (i & 0xfff) + (k2 & 0xc0000);
                j4 = k2 >> 20;
                k2 += l2;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
                i += k3;
                j += l3;
                ai[j2++] = ai1[(j & 0xfc0) + (i >> 6)] >>> j4;
            }
        }
    }

    static textureTranslucentScanline2(
        ai,
        ai1,
        i,
        j,
        k,
        l,
        i1,
        j1,
        k1,
        l1,
        i2,
        j2,
        k2,
        l2
    ) {
        if (i2 <= 0) {
            return;
        }

        let i3 = 0;
        let j3 = 0;
        l2 <<= 2;

        if (i1 !== 0) {
            i3 = (k / i1) << 6;
            j3 = (l / i1) << 6;
        }

        if (i3 < 0) {
            i3 = 0;
        } else if (i3 > 4032) {
            i3 = 4032;
        }

        for (let i4 = i2; i4 > 0; i4 -= 16) {
            k += j1;
            l += k1;
            i1 += l1;
            i = i3;
            j = j3;

            if (i1 !== 0) {
                i3 = (k / i1) << 6;
                j3 = (l / i1) << 6;
            }

            if (i3 < 0) {
                i3 = 0;
            } else if (i3 > 4032) {
                i3 = 4032;
            }

            let k3 = (i3 - i) >> 4;
            let l3 = (j3 - j) >> 4;
            let j4 = k2 >> 20;
            i += k2 & 0xc0000;
            k2 += l2;

            if (i4 < 16) {
                for (let k4 = 0; k4 < i4; k4++) {
                    ai[j2++] =
                        (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                        ((ai[j2] >> 1) & 0x7f7f7f);
                    i += k3;
                    j += l3;

                    if ((k4 & 3) === 3) {
                        i = (i & 0xfff) + (k2 & 0xc0000);
                        j4 = k2 >> 20;
                        k2 += l2;
                    }
                }
            } else {
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                i = (i & 0xfff) + (k2 & 0xc0000);
                j4 = k2 >> 20;
                k2 += l2;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                i = (i & 0xfff) + (k2 & 0xc0000);
                j4 = k2 >> 20;
                k2 += l2;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                i = (i & 0xfff) + (k2 & 0xc0000);
                j4 = k2 >> 20;
                k2 += l2;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
                i += k3;
                j += l3;
                ai[j2++] =
                    (ai1[(j & 0xfc0) + (i >> 6)] >>> j4) +
                    ((ai[j2] >> 1) & 0x7f7f7f);
            }
        }
    }

    static textureBackTranslucentScanline2(
        ai,
        i,
        j,
        k,
        ai1,
        l,
        i1,
        j1,
        k1,
        l1,
        i2,
        j2,
        k2,
        l2,
        i3
    ) {
        if (j2 <= 0) {
            return;
        }

        let j3 = 0;
        let k3 = 0;
        i3 <<= 2;

        if (j1 !== 0) {
            j3 = (l / j1) << 6;
            k3 = (i1 / j1) << 6;
        }

        if (j3 < 0) {
            j3 = 0;
        } else if (j3 > 4032) {
            j3 = 4032;
        }

        for (let j4 = j2; j4 > 0; j4 -= 16) {
            l += k1;
            i1 += l1;
            j1 += i2;
            j = j3;
            k = k3;

            if (j1 !== 0) {
                j3 = (l / j1) << 6;
                k3 = (i1 / j1) << 6;
            }

            if (j3 < 0) {
                j3 = 0;
            } else if (j3 > 4032) {
                j3 = 4032;
            }

            let l3 = (j3 - j) >> 4;
            let i4 = (k3 - k) >> 4;
            let k4 = l2 >> 20;
            j += l2 & 0xc0000;
            l2 += i3;

            if (j4 < 16) {
                for (let l4 = 0; l4 < j4; l4++) {
                    if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                        ai[k2] = i;
                    }

                    k2++;
                    j += l3;
                    k += i4;

                    if ((l4 & 3) === 3) {
                        j = (j & 0xfff) + (l2 & 0xc0000);
                        k4 = l2 >> 20;
                        l2 += i3;
                    }
                }
            } else {
                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;
                j = (j & 0xfff) + (l2 & 0xc0000);
                k4 = l2 >> 20;
                l2 += i3;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;
                j = (j & 0xfff) + (l2 & 0xc0000);
                k4 = l2 >> 20;
                l2 += i3;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;
                j = (j & 0xfff) + (l2 & 0xc0000);
                k4 = l2 >> 20;
                l2 += i3;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
                j += l3;
                k += i4;

                if ((i = ai1[(k & 0xfc0) + (j >> 6)] >>> k4) !== 0) {
                    ai[k2] = i;
                }

                k2++;
            }
        }
    }

    static gradientScanline(ai, i, j, k, ai1, l, i1) {
        if (i >= 0) {
            return;
        }

        i1 <<= 1;
        k = ai1[(l >> 8) & 0xff];
        l += i1;
        let j1 = (i / 8) | 0;

        for (let k1 = j1; k1 < 0; k1++) {
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[(l >> 8) & 0xff];
            l += i1;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[(l >> 8) & 0xff];
            l += i1;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[(l >> 8) & 0xff];
            l += i1;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[(l >> 8) & 0xff];
            l += i1;
        }

        j1 = -(i % 8);

        for (let l1 = 0; l1 < j1; l1++) {
            ai[j++] = k;

            if ((l1 & 1) === 1) {
                k = ai1[(l >> 8) & 0xff];
                l += i1;
            }
        }
    }

    static textureGradientScanline(ai, i, j, k, ai1, l, i1) {
        if (i >= 0) {
            return;
        }

        i1 <<= 2;
        k = ai1[(l >> 8) & 0xff];
        l += i1;
        let j1 = (i / 16) | 0;

        for (let k1 = j1; k1 < 0; k1++) {
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            k = ai1[(l >> 8) & 0xff];
            l += i1;
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            k = ai1[(l >> 8) & 0xff];
            l += i1;
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            k = ai1[(l >> 8) & 0xff];
            l += i1;
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);
            k = ai1[(l >> 8) & 0xff];
            l += i1;
        }

        j1 = -(i % 16);

        for (let l1 = 0; l1 < j1; l1++) {
            ai[j++] = k + ((ai[j] >> 1) & 0x7f7f7f);

            if ((l1 & 3) === 3) {
                k = ai1[(l >> 8) & 0xff];
                l += i1;
                l += i1;
            }
        }
    }

    static gradientScanline2(ai, i, j, k, ai1, l, i1) {
        if (i >= 0) {
            return;
        }

        i1 <<= 2;
        k = ai1[(l >> 8) & 0xff];
        l += i1;
        let j1 = (i / 16) | 0;

        for (let k1 = j1; k1 < 0; k1++) {
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[(l >> 8) & 0xff];
            l += i1;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[(l >> 8) & 0xff];
            l += i1;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[(l >> 8) & 0xff];
            l += i1;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            ai[j++] = k;
            k = ai1[(l >> 8) & 0xff];
            l += i1;
        }

        j1 = -(i % 16);

        for (let l1 = 0; l1 < j1; l1++) {
            ai[j++] = k;

            if ((l1 & 3) === 3) {
                k = ai1[(l >> 8) & 0xff];
                l += i1;
            }
        }
    }

    static rgb(i, j, k) {
        return -1 - ((i / 8) | 0) * 1024 - ((j / 8) | 0) * 32 - ((k / 8) | 0);
    }

    addModel(model) {
        if (model === null) {
            console.log('Warning tried to add null object!');
        }

        if (this.modelCount < this.maxModelCount) {
            this.models[this.modelCount++] = model;
        }
    }

    removeModel(gameModel) {
        for (let i = 0; i < this.modelCount; i++) {
            if (this.models[i] === gameModel) {
                this.modelCount--;

                for (let j = i; j < this.modelCount; j++) {
                    this.models[j] = this.models[j + 1];
                }
            }
        }
    }

    dispose() {
        this.clear();

        for (let i = 0; i < this.modelCount; i++) {
            this.models[i] = null;
        }

        this.modelCount = 0;
    }

    clear() {
        this.spriteCount = 0;
        this.view.clear();
    }

    reduceSprites(i) {
        this.spriteCount -= i;
        this.view.reduce(i, i * 2);

        if (this.spriteCount < 0) {
            this.spriteCount = 0;
        }
    }

    addSprite(n, x, z, y, w, h, tag) {
        this.spriteId[this.spriteCount] = n;
        this.spriteX[this.spriteCount] = x;
        this.spriteZ[this.spriteCount] = z;
        this.spriteY[this.spriteCount] = y;
        this.spriteWidth[this.spriteCount] = w;
        this.spriteHeight[this.spriteCount] = h;
        this.spriteTranslateX[this.spriteCount] = 0;

        const bottomVert = this.view.createVertex(x, z, y);
        const topVert = this.view.createVertex(x, z - h, y);
        const vertexes = new Int32Array([bottomVert, topVert]);

        this.view.createFace(2, vertexes, 0, 0);
        this.view.faceTag[this.spriteCount] = tag;
        this.view.isLocalPlayer[this.spriteCount++] = 0;

        return this.spriteCount - 1;
    }

    setLocalPlayer(i) {
        this.view.isLocalPlayer[i] = 1;
    }

    setSpriteTranslateX(i, n) {
        this.spriteTranslateX[i] = n;
    }

    setMouseLoc(x, y) {
        this.mouseX = x - this.baseX;
        this.mouseY = y;
        this.mousePickedCount = 0;
        this.mousePickingActive = true;
    }

    getMousePickedCount() {
        return this.mousePickedCount;
    }

    getMousePickedFaces() {
        return this.mousePickedFaces;
    }

    getMousePickedModels() {
        return this.mousePickedModels;
    }

    setBounds(baseX, baseY, clipX, clipY, width, viewDistance) {
        this.clipX = clipX;
        this.clipY = clipY;
        this.baseX = baseX;
        this.baseY = baseY;
        this.width = width;
        this.viewDistance = viewDistance;
        this.scanlines = [];

        for (let k1 = 0; k1 < clipY + baseY; k1++) {
            this.scanlines.push(new Scanline());
        }
    }

    polygonsQSort(polygons, low, high) {
        if (low < high) {
            let min = low - 1;
            let max = high + 1;
            let mid = ((low + high) / 2) | 0;
            let polygon = polygons[mid];
            polygons[mid] = polygons[low];
            polygons[low] = polygon;
            let j1 = polygon.depth;

            while (min < max) {
                do {
                    max--;
                } while (polygons[max].depth < j1);

                do {
                    min++;
                } while (polygons[min].depth > j1);

                if (min < max) {
                    let polygon_1 = polygons[min];
                    polygons[min] = polygons[max];
                    polygons[max] = polygon_1;
                }
            }

            this.polygonsQSort(polygons, low, max);
            this.polygonsQSort(polygons, max + 1, high);
        }
    }

    polygonsIntersectSort(step, polygons, count) {
        for (let i = 0; i <= count; i++) {
            polygons[i].skipSomething = false;
            polygons[i].index = i;
            polygons[i].index2 = -1;
        }

        let l = 0;

        do {
            while (polygons[l].skipSomething) {
                l++;
            }

            if (l === count) {
                return;
            }

            let polygon = polygons[l];
            polygon.skipSomething = true;
            let i1 = l;
            let j1 = l + step;

            if (j1 >= count) {
                j1 = count - 1;
            }

            for (let k1 = j1; k1 >= i1 + 1; k1--) {
                let other = polygons[k1];

                if (
                    polygon.minPlaneX < other.maxPlaneX &&
                    other.minPlaneX < polygon.maxPlaneX &&
                    polygon.minPlaneY < other.maxPlaneY &&
                    other.minPlaneY < polygon.maxPlaneY &&
                    polygon.index !== other.index2 &&
                    !this.separatePolygon(polygon, other) &&
                    this.heuristicPolygon(other, polygon)
                ) {
                    this.polygonsOrder(polygons, i1, k1);

                    if (polygons[k1] !== other) {
                        k1++;
                    }

                    i1 = this.newStart;
                    other.index2 = polygon.index;
                }
            }
        } while (true);
    }

    polygonsOrder(polygons, start, end) {
        do {
            let polygon = polygons[start];

            for (let k = start + 1; k <= end; k++) {
                let polygon_1 = polygons[k];

                if (!this.separatePolygon(polygon_1, polygon)) {
                    break;
                }

                polygons[start] = polygon_1;
                polygons[k] = polygon;
                start = k;

                if (start === end) {
                    this.newStart = start;
                    this.newEnd = start - 1;

                    return true;
                }
            }

            let polygon_2 = polygons[end];

            for (let l = end - 1; l >= start; l--) {
                let polygon_3 = polygons[l];

                if (!this.separatePolygon(polygon_2, polygon_3)) {
                    break;
                }

                polygons[end] = polygon_3;
                polygons[l] = polygon_2;
                end = l;

                if (start === end) {
                    this.newStart = end + 1;
                    this.newEnd = end;

                    return true;
                }
            }

            if (start + 1 >= end) {
                this.newStart = start;
                this.newEnd = end;

                return false;
            }

            if (!this.polygonsOrder(polygons, start + 1, end)) {
                this.newStart = start;

                return false;
            }

            end = this.newEnd;
        } while (true);
    }

    setFrustum(i, j, k) {
        let l = (-this.cameraYaw + 1024) & 0x3ff;
        let i1 = (-this.cameraPitch + 1024) & 0x3ff;
        let j1 = (-this.cameraRoll + 1024) & 0x3ff;

        if (j1 !== 0) {
            let k1 = Scene.sinCosCache[j1];
            let j2 = Scene.sinCosCache[j1 + 1024];
            let i3 = (j * k1 + i * j2) >> 15;
            j = (j * j2 - i * k1) >> 15;
            i = i3;
        }

        if (l !== 0) {
            let l1 = Scene.sinCosCache[l];
            let k2 = Scene.sinCosCache[l + 1024];
            let j3 = (j * k2 - k * l1) >> 15;
            k = (j * l1 + k * k2) >> 15;
            j = j3;
        }

        if (i1 !== 0) {
            let i2 = Scene.sinCosCache[i1];
            let l2 = Scene.sinCosCache[i1 + 1024];
            let k3 = (k * i2 + i * l2) >> 15;
            k = (k * l2 - i * i2) >> 15;
            i = k3;
        }

        if (i < Scene.frustumMaxX) {
            Scene.frustumMaxX = i;
        }

        if (i > Scene.frustumMinX) {
            Scene.frustumMinX = i;
        }

        if (j < Scene.frustumMaxY) {
            Scene.frustumMaxY = j;
        }

        if (j > Scene.frustumMinY) {
            Scene.frustumMinY = j;
        }

        if (k < Scene.frustumFarZ) {
            Scene.frustumFarZ = k;
        }

        if (k > Scene.frustumNearZ) {
            Scene.frustumNearZ = k;
        }
    }

    render() {
        this.interlace = this.surface.interlace;
        let i3 = (this.clipX * this.clipFar3d) >> this.viewDistance;
        let j3 = (this.clipY * this.clipFar3d) >> this.viewDistance;

        Scene.frustumMaxX = 0;
        Scene.frustumMinX = 0;
        Scene.frustumMaxY = 0;
        Scene.frustumMinY = 0;
        Scene.frustumFarZ = 0;
        Scene.frustumNearZ = 0;

        this.setFrustum(-i3, -j3, this.clipFar3d);
        this.setFrustum(-i3, j3, this.clipFar3d);
        this.setFrustum(i3, -j3, this.clipFar3d);
        this.setFrustum(i3, j3, this.clipFar3d);
        this.setFrustum(-this.clipX, -this.clipY, 0);
        this.setFrustum(-this.clipX, this.clipY, 0);
        this.setFrustum(this.clipX, -this.clipY, 0);
        this.setFrustum(this.clipX, this.clipY, 0);

        Scene.frustumMaxX += this.cameraX;
        Scene.frustumMinX += this.cameraX;
        Scene.frustumMaxY += this.cameraY;
        Scene.frustumMinY += this.cameraY;
        Scene.frustumFarZ += this.cameraZ;
        Scene.frustumNearZ += this.cameraZ;

        this.models[this.modelCount] = this.view;
        this.view.transformState = 2;

        for (let i = 0; i < this.modelCount; i++) {
            this.models[i].project(
                this.cameraX,
                this.cameraY,
                this.cameraZ,
                this.cameraYaw,
                this.cameraPitch,
                this.cameraRoll,
                this.viewDistance,
                this.clipNear
            );
        }

        this.models[this.modelCount].project(
            this.cameraX,
            this.cameraY,
            this.cameraZ,
            this.cameraYaw,
            this.cameraPitch,
            this.cameraRoll,
            this.viewDistance,
            this.clipNear
        );
        this.visiblePolygonsCount = 0;

        for (let count = 0; count < this.modelCount; count++) {
            let gameModel = this.models[count];

            if (gameModel.visible) {
                for (let face = 0; face < gameModel.numFaces; face++) {
                    let num_vertices = gameModel.faceNumVertices[face];
                    let vertices = gameModel.faceVertices[face];
                    let visible = false;

                    for (let vertex = 0; vertex < num_vertices; vertex++) {
                        let z = gameModel.projectVertexZ[vertices[vertex]];

                        if (z <= this.clipNear || z >= this.clipFar3d) {
                            continue;
                        }

                        visible = true;
                        break;
                    }

                    if (visible) {
                        let viewXCount = 0;

                        for (let vertex = 0; vertex < num_vertices; vertex++) {
                            let x = gameModel.vertexViewX[vertices[vertex]];

                            if (x > -this.clipX) {
                                viewXCount |= 1;
                            }

                            if (x < this.clipX) {
                                viewXCount |= 2;
                            }

                            if (viewXCount === 3) {
                                break;
                            }
                        }

                        if (viewXCount === 3) {
                            let viewYCount = 0;

                            for (
                                let vertex = 0;
                                vertex < num_vertices;
                                vertex++
                            ) {
                                let k1 =
                                    gameModel.vertexViewY[vertices[vertex]];

                                if (k1 > -this.clipY) {
                                    viewYCount |= 1;
                                }

                                if (k1 < this.clipY) {
                                    viewYCount |= 2;
                                }

                                if (viewYCount === 3) {
                                    break;
                                }
                            }

                            if (viewYCount === 3) {
                                let polygon_1 = this.visiblePolygons[
                                    this.visiblePolygonsCount
                                ];
                                polygon_1.model = gameModel;
                                polygon_1.face = face;
                                this.initialisePolygon3D(
                                    this.visiblePolygonsCount
                                );

                                let faceFill = 0;

                                if (polygon_1.visibility < 0) {
                                    faceFill = gameModel.faceFillFront[face];
                                } else {
                                    faceFill = gameModel.faceFillBack[face];
                                }

                                if (faceFill !== COLOUR_TRANSPARENT) {
                                    let h = 0;

                                    for (
                                        let vertex = 0;
                                        vertex < num_vertices;
                                        vertex++
                                    ) {
                                        h +=
                                            gameModel.projectVertexZ[
                                                vertices[vertex]
                                            ];
                                    }

                                    polygon_1.depth =
                                        ((h / num_vertices) | 0) +
                                        gameModel.depth;
                                    polygon_1.facefill = faceFill;
                                    this.visiblePolygonsCount++;
                                }
                            }
                        }
                    }
                }
            }
        }

        let model_2d = this.view;

        if (model_2d.visible) {
            for (let face = 0; face < model_2d.numFaces; face++) {
                let faceVertices = model_2d.faceVertices[face];
                let vertex0 = faceVertices[0];
                let vx = model_2d.vertexViewX[vertex0];
                let vy = model_2d.vertexViewY[vertex0];
                let vz = model_2d.projectVertexZ[vertex0];

                if (vz > this.clipNear && vz < this.clipFar2d) {
                    let vw =
                        ((this.spriteWidth[face] << this.viewDistance) / vz) |
                        0;
                    let vh =
                        ((this.spriteHeight[face] << this.viewDistance) / vz) |
                        0;

                    if (
                        vx - ((vw / 2) | 0) <= this.clipX &&
                        vx + ((vw / 2) | 0) >= -this.clipX &&
                        vy - vh <= this.clipY &&
                        vy >= -this.clipY
                    ) {
                        let polygon_2 = this.visiblePolygons[
                            this.visiblePolygonsCount
                        ];
                        polygon_2.model = model_2d;
                        polygon_2.face = face;

                        this.initialisePolygon2D(this.visiblePolygonsCount);

                        polygon_2.depth =
                            ((vz + model_2d.projectVertexZ[faceVertices[1]]) /
                                2) |
                            0;
                        this.visiblePolygonsCount++;
                    }
                }
            }
        }

        if (this.visiblePolygonsCount === 0) {
            return;
        }

        this.lastVisiblePolygonsCount = this.visiblePolygonsCount;
        this.polygonsQSort(
            this.visiblePolygons,
            0,
            this.visiblePolygonsCount - 1
        );
        this.polygonsIntersectSort(
            100,
            this.visiblePolygons,
            this.visiblePolygonsCount
        );

        for (let model = 0; model < this.visiblePolygonsCount; model++) {
            let polygon = this.visiblePolygons[model];
            let gameModel_2 = polygon.model;
            let l = polygon.face;

            if (gameModel_2 === this.view) {
                let faceverts = gameModel_2.faceVertices[l];
                let face_0 = faceverts[0];
                let vx = gameModel_2.vertexViewX[face_0];
                let vy = gameModel_2.vertexViewY[face_0];
                let vz = gameModel_2.projectVertexZ[face_0];
                let w = ((this.spriteWidth[l] << this.viewDistance) / vz) | 0;
                let h = ((this.spriteHeight[l] << this.viewDistance) / vz) | 0;
                let tx = gameModel_2.vertexViewX[faceverts[1]] - vx;
                let x = vx - ((w / 2) | 0);
                let y = this.baseY + vy - h;

                this.surface._spriteClipping_from7(
                    x + this.baseX,
                    y,
                    w,
                    h,
                    this.spriteId[l],
                    tx,
                    ((256 << this.viewDistance) / vz) | 0
                );

                if (
                    this.mousePickingActive &&
                    this.mousePickedCount < this.mousePickedMax
                ) {
                    x +=
                        ((this.spriteTranslateX[l] << this.viewDistance) / vz) |
                        0;

                    if (
                        this.mouseY >= y &&
                        this.mouseY <= y + h &&
                        this.mouseX >= x &&
                        this.mouseX <= x + w &&
                        !gameModel_2.unpickable &&
                        gameModel_2.isLocalPlayer[l] === 0
                    ) {
                        this.mousePickedModels[
                            this.mousePickedCount
                        ] = gameModel_2;
                        this.mousePickedFaces[this.mousePickedCount] = l;
                        this.mousePickedCount++;
                    }
                }
            } else {
                let k8 = 0;
                let j10 = 0;
                let l10 = gameModel_2.faceNumVertices[l];
                let ai3 = gameModel_2.faceVertices[l];

                if (gameModel_2.faceIntensity[l] !== COLOUR_TRANSPARENT) {
                    if (polygon.visibility < 0) {
                        j10 =
                            gameModel_2.lightAmbience -
                            gameModel_2.faceIntensity[l];
                    } else {
                        j10 =
                            gameModel_2.lightAmbience +
                            gameModel_2.faceIntensity[l];
                    }
                }

                for (let k11 = 0; k11 < l10; k11++) {
                    let k2 = ai3[k11];

                    this.vertexX[k11] = gameModel_2.projectVertexX[k2];
                    this.vertexY[k11] = gameModel_2.projectVertexY[k2];
                    this.vertexZ[k11] = gameModel_2.projectVertexZ[k2];

                    if (gameModel_2.faceIntensity[l] === COLOUR_TRANSPARENT) {
                        if (polygon.visibility < 0) {
                            j10 =
                                gameModel_2.lightAmbience -
                                gameModel_2.vertexIntensity[k2] +
                                gameModel_2.vertexAmbience[k2];
                        } else {
                            j10 =
                                gameModel_2.lightAmbience +
                                gameModel_2.vertexIntensity[k2] +
                                gameModel_2.vertexAmbience[k2];
                        }
                    }

                    if (gameModel_2.projectVertexZ[k2] >= this.clipNear) {
                        this.planeX[k8] = gameModel_2.vertexViewX[k2];
                        this.planeY[k8] = gameModel_2.vertexViewY[k2];
                        this.vertexShade[k8] = j10;

                        if (
                            gameModel_2.projectVertexZ[k2] > this.fogZDistance
                        ) {
                            this.vertexShade[k8] +=
                                ((gameModel_2.projectVertexZ[k2] -
                                    this.fogZDistance) /
                                    this.fogZFalloff) |
                                0;
                        }

                        k8++;
                    } else {
                        let k9 = 0;

                        if (k11 === 0) {
                            k9 = ai3[l10 - 1];
                        } else {
                            k9 = ai3[k11 - 1];
                        }

                        if (gameModel_2.projectVertexZ[k9] >= this.clipNear) {
                            let k7 =
                                gameModel_2.projectVertexZ[k2] -
                                gameModel_2.projectVertexZ[k9];
                            let i5 =
                                gameModel_2.projectVertexX[k2] -
                                ((((gameModel_2.projectVertexX[k2] -
                                    gameModel_2.projectVertexX[k9]) *
                                    (gameModel_2.projectVertexZ[k2] -
                                        this.clipNear)) /
                                    k7) |
                                    0);
                            let j6 =
                                gameModel_2.projectVertexY[k2] -
                                ((((gameModel_2.projectVertexY[k2] -
                                    gameModel_2.projectVertexY[k9]) *
                                    (gameModel_2.projectVertexZ[k2] -
                                        this.clipNear)) /
                                    k7) |
                                    0);
                            this.planeX[k8] =
                                ((i5 << this.viewDistance) / this.clipNear) | 0;
                            this.planeY[k8] =
                                ((j6 << this.viewDistance) / this.clipNear) | 0;
                            this.vertexShade[k8] = j10;
                            k8++;
                        }

                        if (k11 === l10 - 1) {
                            k9 = ai3[0];
                        } else {
                            k9 = ai3[k11 + 1];
                        }

                        if (gameModel_2.projectVertexZ[k9] >= this.clipNear) {
                            let l7 =
                                gameModel_2.projectVertexZ[k2] -
                                gameModel_2.projectVertexZ[k9];
                            let j5 =
                                gameModel_2.projectVertexX[k2] -
                                ((((gameModel_2.projectVertexX[k2] -
                                    gameModel_2.projectVertexX[k9]) *
                                    (gameModel_2.projectVertexZ[k2] -
                                        this.clipNear)) /
                                    l7) |
                                    0);
                            let k6 =
                                gameModel_2.projectVertexY[k2] -
                                ((((gameModel_2.projectVertexY[k2] -
                                    gameModel_2.projectVertexY[k9]) *
                                    (gameModel_2.projectVertexZ[k2] -
                                        this.clipNear)) /
                                    l7) |
                                    0);
                            this.planeX[k8] =
                                ((j5 << this.viewDistance) / this.clipNear) | 0;
                            this.planeY[k8] =
                                ((k6 << this.viewDistance) / this.clipNear) | 0;
                            this.vertexShade[k8] = j10;
                            k8++;
                        }
                    }
                }

                for (let i12 = 0; i12 < l10; i12++) {
                    if (this.vertexShade[i12] < 0) {
                        this.vertexShade[i12] = 0;
                    } else if (this.vertexShade[i12] > 255) {
                        this.vertexShade[i12] = 255;
                    }

                    if (polygon.facefill >= 0) {
                        if (this.textureDimension[polygon.facefill] === 1) {
                            this.vertexShade[i12] <<= 9;
                        } else {
                            this.vertexShade[i12] <<= 6;
                        }
                    }
                }

                this.generateScanlines(
                    0,
                    0,
                    0,
                    0,
                    k8,
                    this.planeX,
                    this.planeY,
                    this.vertexShade,
                    gameModel_2,
                    l
                );

                if (this.maxY > this.minY) {
                    this.rasterize(
                        0,
                        0,
                        l10,
                        this.vertexX,
                        this.vertexY,
                        this.vertexZ,
                        polygon.facefill,
                        gameModel_2
                    );
                }
            }
        }

        this.mousePickingActive = false;
    }

    generateScanlines(i, j, k, l, i1, ai, ai1, ai2, gameModel, pid) {
        if (i1 === 3) {
            let k1 = ai1[0] + this.baseY;
            let k2 = ai1[1] + this.baseY;
            let k3 = ai1[2] + this.baseY;
            let k4 = ai[0];
            let l5 = ai[1];
            let j7 = ai[2];
            let l8 = ai2[0];
            let j10 = ai2[1];
            let j11 = ai2[2];
            let j12 = this.baseY + this.clipY - 1;
            let l12 = 0;
            let j13 = 0;
            let l13 = 0;
            let j14 = 0;
            let l14 = COLOUR_TRANSPARENT;
            let j15 = -COLOUR_TRANSPARENT;

            if (k3 !== k1) {
                j13 = (((j7 - k4) << 8) / (k3 - k1)) | 0;
                j14 = (((j11 - l8) << 8) / (k3 - k1)) | 0;

                if (k1 < k3) {
                    l12 = k4 << 8;
                    l13 = l8 << 8;
                    l14 = k1;
                    j15 = k3;
                } else {
                    l12 = j7 << 8;
                    l13 = j11 << 8;
                    l14 = k3;
                    j15 = k1;
                }

                if (l14 < 0) {
                    l12 -= j13 * l14;
                    l13 -= j14 * l14;
                    l14 = 0;
                }

                if (j15 > j12) {
                    j15 = j12;
                }
            }

            let l15 = 0;
            let j16 = 0;
            let l16 = 0;
            let j17 = 0;
            let l17 = COLOUR_TRANSPARENT;
            let j18 = -COLOUR_TRANSPARENT;

            if (k2 !== k1) {
                j16 = (((l5 - k4) << 8) / (k2 - k1)) | 0;
                j17 = (((j10 - l8) << 8) / (k2 - k1)) | 0;

                if (k1 < k2) {
                    l15 = k4 << 8;
                    l16 = l8 << 8;
                    l17 = k1;
                    j18 = k2;
                } else {
                    l15 = l5 << 8;
                    l16 = j10 << 8;
                    l17 = k2;
                    j18 = k1;
                }

                if (l17 < 0) {
                    l15 -= (j16 * l17) | 0;
                    l16 -= (j17 * l17) | 0;
                    l17 = 0;
                }

                if (j18 > j12) {
                    j18 = j12;
                }
            }

            let l18 = 0;
            let j19 = 0;
            let l19 = 0;
            let j20 = 0;
            let l20 = COLOUR_TRANSPARENT;
            let j21 = -COLOUR_TRANSPARENT;

            if (k3 !== k2) {
                j19 = (((j7 - l5) << 8) / (k3 - k2)) | 0;
                j20 = (((j11 - j10) << 8) / (k3 - k2)) | 0;

                if (k2 < k3) {
                    l18 = l5 << 8;
                    l19 = j10 << 8;
                    l20 = k2;
                    j21 = k3;
                } else {
                    l18 = j7 << 8;
                    l19 = j11 << 8;
                    l20 = k3;
                    j21 = k2;
                }

                if (l20 < 0) {
                    l18 -= (j19 * l20) | 0;
                    l19 -= (j20 * l20) | 0;
                    l20 = 0;
                }

                if (j21 > j12) {
                    j21 = j12;
                }
            }

            this.minY = l14;

            if (l17 < this.minY) {
                this.minY = l17;
            }

            if (l20 < this.minY) {
                this.minY = l20;
            }

            this.maxY = j15;

            if (j18 > this.maxY) {
                this.maxY = j18;
            }

            if (j21 > this.maxY) {
                this.maxY = j21;
            }

            let l21 = 0;

            for (k = this.minY; k < this.maxY; k++) {
                if (k >= l14 && k < j15) {
                    i = j = l12;
                    l = l21 = l13;
                    l12 += j13;
                    l13 += j14;
                } else {
                    i = 655360;
                    j = -655360;
                }

                if (k >= l17 && k < j18) {
                    if (l15 < i) {
                        i = l15;
                        l = l16;
                    }

                    if (l15 > j) {
                        j = l15;
                        l21 = l16;
                    }

                    l15 += j16;
                    l16 += j17;
                }

                if (k >= l20 && k < j21) {
                    if (l18 < i) {
                        i = l18;
                        l = l19;
                    }

                    if (l18 > j) {
                        j = l18;
                        l21 = l19;
                    }

                    l18 += j19;
                    l19 += j20;
                }

                let scanline_6 = this.scanlines[k];
                scanline_6.startX = i;
                scanline_6.endX = j;
                scanline_6.startS = l;
                scanline_6.endS = l21;
            }

            if (this.minY < this.baseY - this.clipY) {
                this.minY = this.baseY - this.clipY;
            }
        } else if (i1 === 4) {
            let l1 = ai1[0] + this.baseY;
            let l2 = ai1[1] + this.baseY;
            let l3 = ai1[2] + this.baseY;
            let l4 = ai1[3] + this.baseY;
            let i6 = ai[0];
            let k7 = ai[1];
            let i9 = ai[2];
            let k10 = ai[3];
            let k11 = ai2[0];
            let k12 = ai2[1];
            let i13 = ai2[2];
            let k13 = ai2[3];
            let i14 = this.baseY + this.clipY - 1;
            let k14 = 0;
            let i15 = 0;
            let k15 = 0;
            let i16 = 0;
            let k16 = COLOUR_TRANSPARENT;
            let i17 = -COLOUR_TRANSPARENT;

            if (l4 !== l1) {
                i15 = (((k10 - i6) << 8) / (l4 - l1)) | 0;
                i16 = (((k13 - k11) << 8) / (l4 - l1)) | 0;

                if (l1 < l4) {
                    k14 = i6 << 8;
                    k15 = k11 << 8;
                    k16 = l1;
                    i17 = l4;
                } else {
                    k14 = k10 << 8;
                    k15 = k13 << 8;
                    k16 = l4;
                    i17 = l1;
                }

                if (k16 < 0) {
                    k14 -= i15 * k16;
                    k15 -= i16 * k16;
                    k16 = 0;
                }

                if (i17 > i14) {
                    i17 = i14;
                }
            }

            let k17 = 0;
            let i18 = 0;
            let k18 = 0;
            let i19 = 0;
            let k19 = COLOUR_TRANSPARENT;
            let i20 = -COLOUR_TRANSPARENT;

            if (l2 !== l1) {
                i18 = (((k7 - i6) << 8) / (l2 - l1)) | 0;
                i19 = (((k12 - k11) << 8) / (l2 - l1)) | 0;

                if (l1 < l2) {
                    k17 = i6 << 8;
                    k18 = k11 << 8;
                    k19 = l1;
                    i20 = l2;
                } else {
                    k17 = k7 << 8;
                    k18 = k12 << 8;
                    k19 = l2;
                    i20 = l1;
                }

                if (k19 < 0) {
                    k17 -= i18 * k19;
                    k18 -= i19 * k19;
                    k19 = 0;
                }

                if (i20 > i14) {
                    i20 = i14;
                }
            }

            let k20 = 0;
            let i21 = 0;
            let k21 = 0;
            let i22 = 0;
            let j22 = COLOUR_TRANSPARENT;
            let k22 = -COLOUR_TRANSPARENT;

            if (l3 !== l2) {
                i21 = (((i9 - k7) << 8) / (l3 - l2)) | 0;
                i22 = (((i13 - k12) << 8) / (l3 - l2)) | 0;

                if (l2 < l3) {
                    k20 = k7 << 8;
                    k21 = k12 << 8;
                    j22 = l2;
                    k22 = l3;
                } else {
                    k20 = i9 << 8;
                    k21 = i13 << 8;
                    j22 = l3;
                    k22 = l2;
                }

                if (j22 < 0) {
                    k20 -= i21 * j22;
                    k21 -= i22 * j22;
                    j22 = 0;
                }

                if (k22 > i14) {
                    k22 = i14;
                }
            }

            let l22 = 0;
            let i23 = 0;
            let j23 = 0;
            let k23 = 0;
            let l23 = COLOUR_TRANSPARENT;
            let i24 = -COLOUR_TRANSPARENT;

            if (l4 !== l3) {
                i23 = (((k10 - i9) << 8) / (l4 - l3)) | 0;
                k23 = (((k13 - i13) << 8) / (l4 - l3)) | 0;

                if (l3 < l4) {
                    l22 = i9 << 8;
                    j23 = i13 << 8;
                    l23 = l3;
                    i24 = l4;
                } else {
                    l22 = k10 << 8;
                    j23 = k13 << 8;
                    l23 = l4;
                    i24 = l3;
                }

                if (l23 < 0) {
                    l22 -= i23 * l23;
                    j23 -= k23 * l23;
                    l23 = 0;
                }

                if (i24 > i14) {
                    i24 = i14;
                }
            }

            this.minY = k16;

            if (k19 < this.minY) {
                this.minY = k19;
            }

            if (j22 < this.minY) {
                this.minY = j22;
            }

            if (l23 < this.minY) {
                this.minY = l23;
            }

            this.maxY = i17;

            if (i20 > this.maxY) {
                this.maxY = i20;
            }

            if (k22 > this.maxY) {
                this.maxY = k22;
            }

            if (i24 > this.maxY) {
                this.maxY = i24;
            }

            let j24 = 0;

            for (k = this.minY; k < this.maxY; k++) {
                if (k >= k16 && k < i17) {
                    i = j = k14;
                    l = j24 = k15;
                    k14 += i15;
                    k15 += i16;
                } else {
                    i = 655360;
                    j = -655360;
                }

                if (k >= k19 && k < i20) {
                    if (k17 < i) {
                        i = k17;
                        l = k18;
                    }

                    if (k17 > j) {
                        j = k17;
                        j24 = k18;
                    }

                    k17 += i18;
                    k18 += i19;
                }

                if (k >= j22 && k < k22) {
                    if (k20 < i) {
                        i = k20;
                        l = k21;
                    }

                    if (k20 > j) {
                        j = k20;
                        j24 = k21;
                    }

                    k20 += i21;
                    k21 += i22;
                }

                if (k >= l23 && k < i24) {
                    if (l22 < i) {
                        i = l22;
                        l = j23;
                    }

                    if (l22 > j) {
                        j = l22;
                        j24 = j23;
                    }

                    l22 += i23;
                    j23 += k23;
                }

                let scanline_7 = this.scanlines[k];
                scanline_7.startX = i;
                scanline_7.endX = j;
                scanline_7.startS = l;
                scanline_7.endS = j24;
            }

            if (this.minY < this.baseY - this.clipY) {
                this.minY = this.baseY - this.clipY;
            }
        } else {
            this.maxY = this.minY = ai1[0] += this.baseY;

            for (k = 1; k < i1; k++) {
                let i2 = 0;

                if ((i2 = ai1[k] += this.baseY) < this.minY) {
                    this.minY = i2;
                } else if (i2 > this.maxY) {
                    this.maxY = i2;
                }
            }

            if (this.minY < this.baseY - this.clipY) {
                this.minY = this.baseY - this.clipY;
            }

            if (this.maxY >= this.baseY + this.clipY) {
                this.maxY = this.baseY + this.clipY - 1;
            }

            if (this.minY >= this.maxY) {
                return;
            }

            for (k = this.minY; k < this.maxY; k++) {
                let scanline = this.scanlines[k];
                scanline.startX = 655360;
                scanline.endX = -655360;
            }

            let j2 = i1 - 1;
            let i3 = ai1[0];
            let i4 = ai1[j2];

            if (i3 < i4) {
                let i5 = ai[0] << 8;
                let j6 = (((ai[j2] - ai[0]) << 8) / (i4 - i3)) | 0;
                let l7 = ai2[0] << 8;
                let j9 = (((ai2[j2] - ai2[0]) << 8) / (i4 - i3)) | 0;

                if (i3 < 0) {
                    i5 -= j6 * i3;
                    l7 -= j9 * i3;
                    i3 = 0;
                }

                if (i4 > this.maxY) {
                    i4 = this.maxY;
                }

                for (k = i3; k <= i4; k++) {
                    let scanline_2 = this.scanlines[k];
                    scanline_2.startX = scanline_2.endX = i5;
                    scanline_2.startS = scanline_2.endS = l7;
                    i5 += j6;
                    l7 += j9;
                }
            } else if (i3 > i4) {
                let j5 = ai[j2] << 8;
                let k6 = (((ai[0] - ai[j2]) << 8) / (i3 - i4)) | 0;
                let i8 = ai2[j2] << 8;
                let k9 = (((ai2[0] - ai2[j2]) << 8) / (i3 - i4)) | 0;

                if (i4 < 0) {
                    j5 -= k6 * i4;
                    i8 -= k9 * i4;
                    i4 = 0;
                }

                if (i3 > this.maxY) {
                    i3 = this.maxY;
                }

                for (k = i4; k <= i3; k++) {
                    let scanline_3 = this.scanlines[k];
                    scanline_3.startX = scanline_3.endX = j5;
                    scanline_3.startS = scanline_3.endS = i8;
                    j5 += k6;
                    i8 += k9;
                }
            }

            for (k = 0; k < j2; k++) {
                let k5 = k + 1;
                let j3 = ai1[k];
                let j4 = ai1[k5];

                if (j3 < j4) {
                    let l6 = ai[k] << 8;
                    let j8 = (((ai[k5] - ai[k]) << 8) / (j4 - j3)) | 0;
                    let l9 = ai2[k] << 8;
                    let l10 = (((ai2[k5] - ai2[k]) << 8) / (j4 - j3)) | 0;

                    if (j3 < 0) {
                        l6 -= j8 * j3;
                        l9 -= l10 * j3;
                        j3 = 0;
                    }

                    if (j4 > this.maxY) {
                        j4 = this.maxY;
                    }

                    for (let l11 = j3; l11 <= j4; l11++) {
                        let scanline_4 = this.scanlines[l11];

                        if (l6 < scanline_4.startX) {
                            scanline_4.startX = l6;
                            scanline_4.startS = l9;
                        }

                        if (l6 > scanline_4.endX) {
                            scanline_4.endX = l6;
                            scanline_4.endS = l9;
                        }

                        l6 += j8;
                        l9 += l10;
                    }
                } else if (j3 > j4) {
                    let i7 = ai[k5] << 8;
                    let k8 = (((ai[k] - ai[k5]) << 8) / (j3 - j4)) | 0;
                    let i10 = ai2[k5] << 8;
                    let i11 = (((ai2[k] - ai2[k5]) << 8) / (j3 - j4)) | 0;

                    if (j4 < 0) {
                        i7 -= k8 * j4;
                        i10 -= i11 * j4;
                        j4 = 0;
                    }

                    if (j3 > this.maxY) {
                        j3 = this.maxY;
                    }

                    for (let i12 = j4; i12 <= j3; i12++) {
                        let scanline_5 = this.scanlines[i12];

                        if (i7 < scanline_5.startX) {
                            scanline_5.startX = i7;
                            scanline_5.startS = i10;
                        }

                        if (i7 > scanline_5.endX) {
                            scanline_5.endX = i7;
                            scanline_5.endS = i10;
                        }

                        i7 += k8;
                        i10 += i11;
                    }
                }
            }

            if (this.minY < this.baseY - this.clipY) {
                this.minY = this.baseY - this.clipY;
            }
        }

        if (
            this.mousePickingActive &&
            this.mousePickedCount < this.mousePickedMax &&
            this.mouseY >= this.minY &&
            this.mouseY < this.maxY
        ) {
            let scanline_1 = this.scanlines[this.mouseY];

            if (
                this.mouseX >= scanline_1.startX >> 8 &&
                this.mouseX <= scanline_1.endX >> 8 &&
                scanline_1.startX <= scanline_1.endX &&
                !gameModel.unpickable &&
                gameModel.isLocalPlayer[pid] === 0
            ) {
                this.mousePickedModels[this.mousePickedCount] = gameModel;
                this.mousePickedFaces[this.mousePickedCount] = pid;
                this.mousePickedCount++;
            }
        }
    }

    rasterize(i, j, k, ai, ai1, ai2, l, gameModel) {
        if (l === -2) {
            return;
        }

        if (l >= 0) {
            if (l >= this.textureCount) {
                l = 0;
            }

            this.prepareTexture(l);

            let i1 = ai[0];
            let k1 = ai1[0];
            let j2 = ai2[0];
            let i3 = i1 - ai[1];
            let k3 = k1 - ai1[1];
            let i4 = j2 - ai2[1];
            k--;
            let i6 = ai[k] - i1;
            let j7 = ai1[k] - k1;
            let k8 = ai2[k] - j2;

            if (this.textureDimension[l] === 1) {
                let l9 = (i6 * k1 - j7 * i1) << 12;
                let k10 =
                    (j7 * j2 - k8 * k1) << (5 - this.viewDistance + 7 + 4);
                let i11 = (k8 * i1 - i6 * j2) << (5 - this.viewDistance + 7);
                let k11 = (i3 * k1 - k3 * i1) << 12;
                let i12 =
                    (k3 * j2 - i4 * k1) << (5 - this.viewDistance + 7 + 4);
                let k12 = (i4 * i1 - i3 * j2) << (5 - this.viewDistance + 7);
                let i13 = (k3 * i6 - i3 * j7) << 5;
                let k13 = (i4 * j7 - k3 * k8) << (5 - this.viewDistance + 4);
                let i14 = (i3 * k8 - i4 * i6) >> (this.viewDistance - 5);
                let k14 = k10 >> 4;
                let i15 = i12 >> 4;
                let k15 = k13 >> 4;
                let i16 = this.minY - this.baseY;
                let k16 = this.width;
                let i17 = this.baseX + this.minY * k16;
                let byte1 = 1;
                l9 += i11 * i16;
                k11 += k12 * i16;
                i13 += i14 * i16;

                if (this.interlace) {
                    if ((this.minY & 1) === 1) {
                        this.minY++;
                        l9 += i11;
                        k11 += k12;
                        i13 += i14;
                        i17 += k16;
                    }

                    i11 <<= 1;
                    k12 <<= 1;
                    i14 <<= 1;
                    k16 <<= 1;
                    byte1 = 2;
                }

                if (gameModel.textureTranslucent) {
                    for (i = this.minY; i < this.maxY; i += byte1) {
                        let scanline_3 = this.scanlines[i];
                        j = scanline_3.startX >> 8;
                        let k17 = scanline_3.endX >> 8;
                        let k20 = k17 - j;

                        if (k20 <= 0) {
                            l9 += i11;
                            k11 += k12;
                            i13 += i14;
                            i17 += k16;
                        } else {
                            let i22 = scanline_3.startS;
                            let k23 = ((scanline_3.endS - i22) / k20) | 0;

                            if (j < -this.clipX) {
                                i22 += (-this.clipX - j) * k23;
                                j = -this.clipX;
                                k20 = k17 - j;
                            }

                            if (k17 > this.clipX) {
                                let l17 = this.clipX;
                                k20 = l17 - j;
                            }

                            Scene.textureTranslucentScanline(
                                this.raster,
                                this.texturePixels[l],
                                0,
                                0,
                                l9 + k14 * j,
                                k11 + i15 * j,
                                i13 + k15 * j,
                                k10,
                                i12,
                                k13,
                                k20,
                                i17 + j,
                                i22,
                                k23 << 2
                            );

                            l9 += i11;
                            k11 += k12;
                            i13 += i14;
                            i17 += k16;
                        }
                    }

                    return;
                }

                if (!this.textureBackTransparent[l]) {
                    for (i = this.minY; i < this.maxY; i += byte1) {
                        let scanline_4 = this.scanlines[i];
                        j = scanline_4.startX >> 8;
                        let i18 = scanline_4.endX >> 8;
                        let l20 = i18 - j;

                        if (l20 <= 0) {
                            l9 += i11;
                            k11 += k12;
                            i13 += i14;
                            i17 += k16;
                        } else {
                            let j22 = scanline_4.startS;
                            let l23 = ((scanline_4.endS - j22) / l20) | 0;

                            if (j < -this.clipX) {
                                j22 += (-this.clipX - j) * l23;
                                j = -this.clipX;
                                l20 = i18 - j;
                            }

                            if (i18 > this.clipX) {
                                let j18 = this.clipX;
                                l20 = j18 - j;
                            }

                            Scene.textureScanline(
                                this.raster,
                                this.texturePixels[l],
                                0,
                                0,
                                l9 + k14 * j,
                                k11 + i15 * j,
                                i13 + k15 * j,
                                k10,
                                i12,
                                k13,
                                l20,
                                i17 + j,
                                j22,
                                l23 << 2
                            );

                            l9 += i11;
                            k11 += k12;
                            i13 += i14;
                            i17 += k16;
                        }
                    }

                    return;
                }

                for (i = this.minY; i < this.maxY; i += byte1) {
                    let scanline_5 = this.scanlines[i];
                    j = scanline_5.startX >> 8;
                    let k18 = scanline_5.endX >> 8;
                    let i21 = k18 - j;

                    if (i21 <= 0) {
                        l9 += i11;
                        k11 += k12;
                        i13 += i14;
                        i17 += k16;
                    } else {
                        let k22 = scanline_5.startS;
                        let i24 = ((scanline_5.endS - k22) / i21) | 0;

                        if (j < -this.clipX) {
                            k22 += (-this.clipX - j) * i24;
                            j = -this.clipX;
                            i21 = k18 - j;
                        }

                        if (k18 > this.clipX) {
                            let l18 = this.clipX;
                            i21 = l18 - j;
                        }

                        Scene.textureBackTranslucentScanline(
                            this.raster,
                            0,
                            0,
                            0,
                            this.texturePixels[l],
                            l9 + k14 * j,
                            k11 + i15 * j,
                            i13 + k15 * j,
                            k10,
                            i12,
                            k13,
                            i21,
                            i17 + j,
                            k22,
                            i24
                        );

                        l9 += i11;
                        k11 += k12;
                        i13 += i14;
                        i17 += k16;
                    }
                }

                return;
            }

            let i10 = (i6 * k1 - j7 * i1) << 11;
            let l10 = (j7 * j2 - k8 * k1) << (5 - this.viewDistance + 6 + 4);
            let j11 = (k8 * i1 - i6 * j2) << (5 - this.viewDistance + 6);
            let l11 = (i3 * k1 - k3 * i1) << 11;
            let j12 = (k3 * j2 - i4 * k1) << (5 - this.viewDistance + 6 + 4);
            let l12 = (i4 * i1 - i3 * j2) << (5 - this.viewDistance + 6);
            let j13 = (k3 * i6 - i3 * j7) << 5;
            let l13 = (i4 * j7 - k3 * k8) << (5 - this.viewDistance + 4);
            let j14 = (i3 * k8 - i4 * i6) >> (this.viewDistance - 5);
            let l14 = l10 >> 4;
            let j15 = j12 >> 4;
            let l15 = l13 >> 4;
            let j16 = this.minY - this.baseY;
            let l16 = this.width;
            let j17 = this.baseX + this.minY * l16;
            let byte2 = 1;
            i10 += j11 * j16;
            l11 += l12 * j16;
            j13 += j14 * j16;

            if (this.interlace) {
                if ((this.minY & 1) === 1) {
                    this.minY++;
                    i10 += j11;
                    l11 += l12;
                    j13 += j14;
                    j17 += l16;
                }

                j11 <<= 1;
                l12 <<= 1;
                j14 <<= 1;
                l16 <<= 1;
                byte2 = 2;
            }

            if (gameModel.textureTranslucent) {
                for (i = this.minY; i < this.maxY; i += byte2) {
                    let scanline_6 = this.scanlines[i];
                    j = scanline_6.startX >> 8;
                    let i19 = scanline_6.endX >> 8;
                    let j21 = i19 - j;

                    if (j21 <= 0) {
                        i10 += j11;
                        l11 += l12;
                        j13 += j14;
                        j17 += l16;
                    } else {
                        let l22 = scanline_6.startS;
                        let j24 = ((scanline_6.endS - l22) / j21) | 0;

                        if (j < -this.clipX) {
                            l22 += (-this.clipX - j) * j24;
                            j = -this.clipX;
                            j21 = i19 - j;
                        }

                        if (i19 > this.clipX) {
                            let j19 = this.clipX;
                            j21 = j19 - j;
                        }

                        Scene.textureTranslucentScanline2(
                            this.raster,
                            this.texturePixels[l],
                            0,
                            0,
                            i10 + l14 * j,
                            l11 + j15 * j,
                            j13 + l15 * j,
                            l10,
                            j12,
                            l13,
                            j21,
                            j17 + j,
                            l22,
                            j24
                        );

                        i10 += j11;
                        l11 += l12;
                        j13 += j14;
                        j17 += l16;
                    }
                }

                return;
            }

            if (!this.textureBackTransparent[l]) {
                for (i = this.minY; i < this.maxY; i += byte2) {
                    let scanline_7 = this.scanlines[i];
                    j = scanline_7.startX >> 8;
                    let k19 = scanline_7.endX >> 8;
                    let k21 = k19 - j;

                    if (k21 <= 0) {
                        i10 += j11;
                        l11 += l12;
                        j13 += j14;
                        j17 += l16;
                    } else {
                        let i23 = scanline_7.startS;
                        let k24 = ((scanline_7.endS - i23) / k21) | 0;

                        if (j < -this.clipX) {
                            i23 += (-this.clipX - j) * k24;
                            j = -this.clipX;
                            k21 = k19 - j;
                        }
                        if (k19 > this.clipX) {
                            let l19 = this.clipX;
                            k21 = l19 - j;
                        }

                        Scene.textureScanline2(
                            this.raster,
                            this.texturePixels[l],
                            0,
                            0,
                            i10 + l14 * j,
                            l11 + j15 * j,
                            j13 + l15 * j,
                            l10,
                            j12,
                            l13,
                            k21,
                            j17 + j,
                            i23,
                            k24
                        );

                        i10 += j11;
                        l11 += l12;
                        j13 += j14;
                        j17 += l16;
                    }
                }

                return;
            }

            for (i = this.minY; i < this.maxY; i += byte2) {
                let scanline = this.scanlines[i];
                j = scanline.startX >> 8;
                let i20 = scanline.endX >> 8;
                let l21 = i20 - j;

                if (l21 <= 0) {
                    i10 += j11;
                    l11 += l12;
                    j13 += j14;
                    j17 += l16;
                } else {
                    let j23 = scanline.startS;
                    let l24 = ((scanline.endS - j23) / l21) | 0;

                    if (j < -this.clipX) {
                        j23 += (-this.clipX - j) * l24;
                        j = -this.clipX;
                        l21 = i20 - j;
                    }

                    if (i20 > this.clipX) {
                        let j20 = this.clipX;
                        l21 = j20 - j;
                    }

                    Scene.textureBackTranslucentScanline2(
                        this.raster,
                        0,
                        0,
                        0,
                        this.texturePixels[l],
                        i10 + l14 * j,
                        l11 + j15 * j,
                        j13 + l15 * j,
                        l10,
                        j12,
                        l13,
                        l21,
                        j17 + j,
                        j23,
                        l24
                    );

                    i10 += j11;
                    l11 += l12;
                    j13 += j14;
                    j17 += l16;
                }
            }

            return;
        }

        for (let j1 = 0; j1 < this.rampCount; j1++) {
            if (this.gradientBase[j1] === l) {
                this.anIntArray377 = this.gradientRamps[j1];
                break;
            }

            if (j1 === this.rampCount - 1) {
                let l1 = (Math.random() * this.rampCount) | 0;
                this.gradientBase[l1] = l;
                l = -1 - l;
                let k2 = ((l >> 10) & 0x1f) * 8;
                let j3 = ((l >> 5) & 0x1f) * 8;
                let l3 = (l & 0x1f) * 8;

                for (let j4 = 0; j4 < 256; j4++) {
                    let j6 = j4 * j4;
                    let k7 = ((k2 * j6) / 0x10000) | 0;
                    let l8 = ((j3 * j6) / 0x10000) | 0;
                    let j10 = ((l3 * j6) / 0x10000) | 0;
                    this.gradientRamps[l1][255 - j4] =
                        (k7 << 16) + (l8 << 8) + j10;
                }

                this.anIntArray377 = this.gradientRamps[l1];
            }
        }

        let i2 = this.width;
        let l2 = this.baseX + this.minY * i2;
        let byte0 = 1;

        if (this.interlace) {
            if ((this.minY & 1) === 1) {
                this.minY++;
                l2 += i2;
            }

            i2 <<= 1;
            byte0 = 2;
        }

        if (gameModel.transparent) {
            for (i = this.minY; i < this.maxY; i += byte0) {
                let scanline = this.scanlines[i];
                j = scanline.startX >> 8;
                let k4 = scanline.endX >> 8;
                let k6 = k4 - j;

                if (k6 <= 0) {
                    l2 += i2;
                } else {
                    let l7 = scanline.startS;
                    let i9 = ((scanline.endS - l7) / k6) | 0;

                    if (j < -this.clipX) {
                        l7 += (-this.clipX - j) * i9;
                        j = -this.clipX;
                        k6 = k4 - j;
                    }

                    if (k4 > this.clipX) {
                        let l4 = this.clipX;
                        k6 = l4 - j;
                    }

                    Scene.textureGradientScanline(
                        this.raster,
                        -k6,
                        l2 + j,
                        0,
                        this.anIntArray377,
                        l7,
                        i9
                    );
                    l2 += i2;
                }
            }

            return;
        }

        if (this.wideBand) {
            for (i = this.minY; i < this.maxY; i += byte0) {
                let scanline_1 = this.scanlines[i];
                j = scanline_1.startX >> 8;
                let i5 = scanline_1.endX >> 8;
                let l6 = i5 - j;

                if (l6 <= 0) {
                    l2 += i2;
                } else {
                    let i8 = scanline_1.startS;
                    let j9 = ((scanline_1.endS - i8) / l6) | 0;

                    if (j < -this.clipX) {
                        i8 += (-this.clipX - j) * j9;
                        j = -this.clipX;
                        l6 = i5 - j;
                    }

                    if (i5 > this.clipX) {
                        let j5 = this.clipX;
                        l6 = j5 - j;
                    }

                    Scene.gradientScanline(
                        this.raster,
                        -l6,
                        l2 + j,
                        0,
                        this.anIntArray377,
                        i8,
                        j9
                    );
                    l2 += i2;
                }
            }

            return;
        }

        for (i = this.minY; i < this.maxY; i += byte0) {
            let scanline_2 = this.scanlines[i];
            j = scanline_2.startX >> 8;
            let k5 = scanline_2.endX >> 8;
            let i7 = k5 - j;

            if (i7 <= 0) {
                l2 += i2;
            } else {
                let j8 = scanline_2.startS;
                let k9 = ((scanline_2.endS - j8) / i7) | 0;

                if (j < -this.clipX) {
                    j8 += (-this.clipX - j) * k9;
                    j = -this.clipX;
                    i7 = k5 - j;
                }

                if (k5 > this.clipX) {
                    let l5 = this.clipX;
                    i7 = l5 - j;
                }

                Scene.gradientScanline2(
                    this.raster,
                    -i7,
                    l2 + j,
                    0,
                    this.anIntArray377,
                    j8,
                    k9
                );
                l2 += i2;
            }
        }
    }

    setCamera(x, z, y, pitch, yaw, roll, distance) {
        pitch &= 0x3ff;
        yaw &= 0x3ff;
        roll &= 0x3ff;
        this.cameraYaw = (1024 - pitch) & 0x3ff;
        this.cameraPitch = (1024 - yaw) & 0x3ff;
        this.cameraRoll = (1024 - roll) & 0x3ff;

        let l1 = 0;
        let i2 = 0;
        let j2 = distance;

        if (pitch !== 0) {
            let k2 = Scene.sinCosCache[pitch];
            let j3 = Scene.sinCosCache[pitch + 1024];
            let i4 = (i2 * j3 - j2 * k2) >> 15;
            j2 = (i2 * k2 + j2 * j3) >> 15;
            i2 = i4;
        }

        if (yaw !== 0) {
            let l2 = Scene.sinCosCache[yaw];
            let k3 = Scene.sinCosCache[yaw + 1024];
            let j4 = (j2 * l2 + l1 * k3) >> 15;
            j2 = (j2 * k3 - l1 * l2) >> 15;
            l1 = j4;
        }

        if (roll !== 0) {
            let i3 = Scene.sinCosCache[roll];
            let l3 = Scene.sinCosCache[roll + 1024];
            let k4 = (i2 * i3 + l1 * l3) >> 15;
            i2 = (i2 * l3 - l1 * i3) >> 15;
            l1 = k4;
        }

        this.cameraX = x - l1;
        this.cameraY = z - i2;
        this.cameraZ = y - j2;
    }

    initialisePolygon3D(i) {
        let polygon = this.visiblePolygons[i];
        let gameModel = polygon.model;
        let face = polygon.face;
        let faceVertices = gameModel.faceVertices[face];
        let faceNumVertices = gameModel.faceNumVertices[face];
        let faceCameraNormalScale = gameModel.normalScale[face];
        let vcx = gameModel.projectVertexX[faceVertices[0]];
        let vcy = gameModel.projectVertexY[faceVertices[0]];
        let vcz = gameModel.projectVertexZ[faceVertices[0]];
        let vcx1 = gameModel.projectVertexX[faceVertices[1]] - vcx;
        let vcy1 = gameModel.projectVertexY[faceVertices[1]] - vcy;
        let vcz1 = gameModel.projectVertexZ[faceVertices[1]] - vcz;
        let vcx2 = gameModel.projectVertexX[faceVertices[2]] - vcx;
        let vcy2 = gameModel.projectVertexY[faceVertices[2]] - vcy;
        let vcz2 = gameModel.projectVertexZ[faceVertices[2]] - vcz;
        let t1 = vcy1 * vcz2 - vcy2 * vcz1;
        let t2 = vcz1 * vcx2 - vcz2 * vcx1;
        let t3 = vcx1 * vcy2 - vcx2 * vcy1;

        if (faceCameraNormalScale === -1) {
            faceCameraNormalScale = 0;

            for (
                ;
                t1 > 25000 ||
                t2 > 25000 ||
                t3 > 25000 ||
                t1 < -25000 ||
                t2 < -25000 ||
                t3 < -25000;
                t3 >>= 1
            ) {
                faceCameraNormalScale++;
                t1 >>= 1;
                t2 >>= 1;
            }

            gameModel.normalScale[face] = faceCameraNormalScale;
            gameModel.normalMagnitude[face] =
                (this.normalMagnitude *
                    Math.sqrt(t1 * t1 + t2 * t2 + t3 * t3)) |
                0;
        } else {
            t1 >>= faceCameraNormalScale;
            t2 >>= faceCameraNormalScale;
            t3 >>= faceCameraNormalScale;
        }

        polygon.visibility = vcx * t1 + vcy * t2 + vcz * t3;
        polygon.normalX = t1;
        polygon.normalY = t2;
        polygon.normalZ = t3;

        let j4 = gameModel.projectVertexZ[faceVertices[0]];
        let k4 = j4;
        let l4 = gameModel.vertexViewX[faceVertices[0]];
        let i5 = l4;
        let j5 = gameModel.vertexViewY[faceVertices[0]];
        let k5 = j5;

        for (let l5 = 1; l5 < faceNumVertices; l5++) {
            let i1 = gameModel.projectVertexZ[faceVertices[l5]];

            if (i1 > k4) {
                k4 = i1;
            } else if (i1 < j4) {
                j4 = i1;
            }

            i1 = gameModel.vertexViewX[faceVertices[l5]];

            if (i1 > i5) {
                i5 = i1;
            } else if (i1 < l4) {
                l4 = i1;
            }

            i1 = gameModel.vertexViewY[faceVertices[l5]];

            if (i1 > k5) {
                k5 = i1;
            } else if (i1 < j5) {
                j5 = i1;
            }
        }

        polygon.minZ = j4;
        polygon.maxZ = k4;
        polygon.minPlaneX = l4;
        polygon.maxPlaneX = i5;
        polygon.minPlaneY = j5;
        polygon.maxPlaneY = k5;
    }

    initialisePolygon2D(i) {
        let polygon = this.visiblePolygons[i];
        let gameModel = polygon.model;
        let j = polygon.face;
        let ai = gameModel.faceVertices[j];
        let l = 0;
        let i1 = 0;
        let j1 = 1;
        let k1 = gameModel.projectVertexX[ai[0]];
        let l1 = gameModel.projectVertexY[ai[0]];
        let i2 = gameModel.projectVertexZ[ai[0]];

        gameModel.normalMagnitude[j] = 1;
        gameModel.normalScale[j] = 0;
        polygon.visibility = k1 * l + l1 * i1 + i2 * j1;
        polygon.normalX = l;
        polygon.normalY = i1;
        polygon.normalZ = j1;

        let j2 = gameModel.projectVertexZ[ai[0]];
        let k2 = j2;
        let l2 = gameModel.vertexViewX[ai[0]];
        let i3 = l2;

        if (gameModel.vertexViewX[ai[1]] < l2) {
            l2 = gameModel.vertexViewX[ai[1]];
        } else {
            i3 = gameModel.vertexViewX[ai[1]];
        }

        let j3 = gameModel.vertexViewY[ai[1]];
        let k3 = gameModel.vertexViewY[ai[0]];
        let k = gameModel.projectVertexZ[ai[1]];

        if (k > k2) {
            k2 = k;
        } else if (k < j2) {
            j2 = k;
        }

        k = gameModel.vertexViewX[ai[1]];

        if (k > i3) {
            i3 = k;
        } else if (k < l2) {
            l2 = k;
        }

        k = gameModel.vertexViewY[ai[1]];

        if (k > k3) {
            k3 = k;
        } else if (k < j3) {
            j3 = k;
        }

        polygon.minZ = j2;
        polygon.maxZ = k2;
        polygon.minPlaneX = l2 - 20;
        polygon.maxPlaneX = i3 + 20;
        polygon.minPlaneY = j3;
        polygon.maxPlaneY = k3;
    }

    separatePolygon(polygon, polygon_1) {
        if (polygon.minPlaneX >= polygon_1.maxPlaneX) {
            return true;
        }

        if (polygon_1.minPlaneX >= polygon.maxPlaneX) {
            return true;
        }

        if (polygon.minPlaneY >= polygon_1.maxPlaneY) {
            return true;
        }

        if (polygon_1.minPlaneY >= polygon.maxPlaneY) {
            return true;
        }

        if (polygon.minZ >= polygon_1.maxZ) {
            return true;
        }

        if (polygon_1.minZ > polygon.maxZ) {
            return false;
        }

        let gameModel = polygon.model;
        let gameModel_1 = polygon_1.model;
        let i = polygon.face;
        let j = polygon_1.face;
        let ai = gameModel.faceVertices[i];
        let ai1 = gameModel_1.faceVertices[j];
        let k = gameModel.faceNumVertices[i];
        let l = gameModel_1.faceNumVertices[j];
        let k2 = gameModel_1.projectVertexX[ai1[0]];
        let l2 = gameModel_1.projectVertexY[ai1[0]];
        let i3 = gameModel_1.projectVertexZ[ai1[0]];
        let j3 = polygon_1.normalX;
        let k3 = polygon_1.normalY;
        let l3 = polygon_1.normalZ;
        let i4 = gameModel_1.normalMagnitude[j];
        let j4 = polygon_1.visibility;
        let flag = false;

        for (let k4 = 0; k4 < k; k4++) {
            let i1 = ai[k4];
            let i2 =
                (k2 - gameModel.projectVertexX[i1]) * j3 +
                (l2 - gameModel.projectVertexY[i1]) * k3 +
                (i3 - gameModel.projectVertexZ[i1]) * l3;

            if ((i2 >= -i4 || j4 >= 0) && (i2 <= i4 || j4 <= 0)) {
                continue;
            }

            flag = true;
            break;
        }

        if (!flag) {
            return true;
        }

        k2 = gameModel.projectVertexX[ai[0]];
        l2 = gameModel.projectVertexY[ai[0]];
        i3 = gameModel.projectVertexZ[ai[0]];
        j3 = polygon.normalX;
        k3 = polygon.normalY;
        l3 = polygon.normalZ;
        i4 = gameModel.normalMagnitude[i];
        j4 = polygon.visibility;
        flag = false;

        for (let l4 = 0; l4 < l; l4++) {
            let j1 = ai1[l4];
            let j2 =
                (k2 - gameModel_1.projectVertexX[j1]) * j3 +
                (l2 - gameModel_1.projectVertexY[j1]) * k3 +
                (i3 - gameModel_1.projectVertexZ[j1]) * l3;

            if ((j2 >= -i4 || j4 <= 0) && (j2 <= i4 || j4 >= 0)) {
                continue;
            }

            flag = true;
            break;
        }

        if (!flag) {
            return true;
        }

        let ai2 = null;
        let ai3 = null;

        if (k === 2) {
            ai2 = new Int32Array(4);
            ai3 = new Int32Array(4);
            let i5 = ai[0];
            let k1 = ai[1];
            ai2[0] = gameModel.vertexViewX[i5] - 20;
            ai2[1] = gameModel.vertexViewX[k1] - 20;
            ai2[2] = gameModel.vertexViewX[k1] + 20;
            ai2[3] = gameModel.vertexViewX[i5] + 20;
            ai3[0] = ai3[3] = gameModel.vertexViewY[i5];
            ai3[1] = ai3[2] = gameModel.vertexViewY[k1];
        } else {
            ai2 = new Int32Array(k);
            ai3 = new Int32Array(k);

            for (let j5 = 0; j5 < k; j5++) {
                let i6 = ai[j5];
                ai2[j5] = gameModel.vertexViewX[i6];
                ai3[j5] = gameModel.vertexViewY[i6];
            }
        }

        let ai4 = null;
        let ai5 = null;

        if (l === 2) {
            ai4 = new Int32Array(4);
            ai5 = new Int32Array(4);
            let k5 = ai1[0];
            let l1 = ai1[1];
            ai4[0] = gameModel_1.vertexViewX[k5] - 20;
            ai4[1] = gameModel_1.vertexViewX[l1] - 20;
            ai4[2] = gameModel_1.vertexViewX[l1] + 20;
            ai4[3] = gameModel_1.vertexViewX[k5] + 20;
            ai5[0] = ai5[3] = gameModel_1.vertexViewY[k5];
            ai5[1] = ai5[2] = gameModel_1.vertexViewY[l1];
        } else {
            ai4 = new Int32Array(l);
            ai5 = new Int32Array(l);

            for (let l5 = 0; l5 < l; l5++) {
                let j6 = ai1[l5];
                ai4[l5] = gameModel_1.vertexViewX[j6];
                ai5[l5] = gameModel_1.vertexViewY[j6];
            }
        }

        return !this.intersect(ai2, ai3, ai4, ai5);
    }

    heuristicPolygon(polygon, polygon_1) {
        let gameModel = polygon.model;
        let gameModel_1 = polygon_1.model;
        let i = polygon.face;
        let j = polygon_1.face;
        let ai = gameModel.faceVertices[i];
        let ai1 = gameModel_1.faceVertices[j];
        let k = gameModel.faceNumVertices[i];
        let l = gameModel_1.faceNumVertices[j];
        let i2 = gameModel_1.projectVertexX[ai1[0]];
        let j2 = gameModel_1.projectVertexY[ai1[0]];
        let k2 = gameModel_1.projectVertexZ[ai1[0]];
        let l2 = polygon_1.normalX;
        let i3 = polygon_1.normalY;
        let j3 = polygon_1.normalZ;
        let k3 = gameModel_1.normalMagnitude[j];
        let l3 = polygon_1.visibility;
        let flag = false;

        for (let i4 = 0; i4 < k; i4++) {
            let i1 = ai[i4];
            let k1 =
                (i2 - gameModel.projectVertexX[i1]) * l2 +
                (j2 - gameModel.projectVertexY[i1]) * i3 +
                (k2 - gameModel.projectVertexZ[i1]) * j3;
            if ((k1 >= -k3 || l3 >= 0) && (k1 <= k3 || l3 <= 0)) {
                continue;
            }
            flag = true;
            break;
        }

        if (!flag) {
            return true;
        }

        i2 = gameModel.projectVertexX[ai[0]];
        j2 = gameModel.projectVertexY[ai[0]];
        k2 = gameModel.projectVertexZ[ai[0]];
        l2 = polygon.normalX;
        i3 = polygon.normalY;
        j3 = polygon.normalZ;
        k3 = gameModel.normalMagnitude[i];
        l3 = polygon.visibility;
        flag = false;

        for (let j4 = 0; j4 < l; j4++) {
            let j1 = ai1[j4];
            let l1 =
                (i2 - gameModel_1.projectVertexX[j1]) * l2 +
                (j2 - gameModel_1.projectVertexY[j1]) * i3 +
                (k2 - gameModel_1.projectVertexZ[j1]) * j3;

            if ((l1 >= -k3 || l3 <= 0) && (l1 <= k3 || l3 >= 0)) {
                continue;
            }

            flag = true;
            break;
        }

        return !flag;
    }

    allocateTextures(count, something7, something11) {
        this.textureCount = count;
        this.textureColoursUsed = []; // byte[][]
        this.textureColoursUsed.length = count; // byte[][]
        this.textureColoursUsed.fill(null);
        this.textureColourList = [];
        this.textureColourList.length = count;
        this.textureColourList.fill(null);
        this.textureDimension = new Int32Array(count);
        this.textureLoadedNumber = [];
        this.textureLoadedNumber.length = count;
        this.textureLoadedNumber.fill(null);
        this.textureBackTransparent = new Int8Array(count);
        this.texturePixels = [];
        this.texturePixels.length = count;
        this.texturePixels.fill(null);
        Scene.textureCountLoaded = new Long(0);

        for (let i = 0; i < count; i += 1) {
            this.textureLoadedNumber.push(new Long(0));
        }

        // 64x64 rgba
        this.textureColours64 = [];
        this.textureColours64.length = something7;
        this.textureColours64.fill(null);

        // 128x128 rgba
        this.textureColours128 = [];
        this.textureColours128.length = something11;
        this.textureColours128.fill(null);
    }

    defineTexture(id, usedColours, colours, wide128) {
        this.textureColoursUsed[id] = usedColours;
        this.textureColourList[id] = colours;
        // is 1 if the this.texture is 128+ pixels wide, 0 if <128
        this.textureDimension[id] = wide128;
        // as in the current loaded this.texture count when its loaded
        this.textureLoadedNumber[id] = new Long(0);
        this.textureBackTransparent[id] = false;
        this.texturePixels[id] = null;
        this.prepareTexture(id);
    }

    prepareTexture(id) {
        if (id < 0) {
            return;
        }

        Scene.textureCountLoaded = Scene.textureCountLoaded.add(1);
        this.textureLoadedNumber[id] = new Long(Scene.textureCountLoaded);

        if (this.texturePixels[id] !== null) {
            return;
        }

        if (this.textureDimension[id] === 0) {
            // is 64 pixels wide
            for (let j = 0; j < this.textureColours64.length; j++) {
                if (this.textureColours64[j] === null) {
                    this.textureColours64[j] = new Int32Array(16384);
                    this.texturePixels[id] = this.textureColours64[j];
                    this.setTexturePixels(id);
                    return;
                }
            }

            // almost as large as exemplar's nas storage
            let GIGALONG = new Long(1).shiftLeft(30);
            let wut = 0;

            for (let k1 = 0; k1 < this.textureCount; k1++) {
                if (
                    k1 !== id &&
                    this.textureDimension[k1] === 0 &&
                    this.texturePixels[k1] !== null &&
                    this.textureLoadedNumber[k1].lessThan(GIGALONG)
                ) {
                    GIGALONG = this.textureLoadedNumber[k1];
                    wut = k1;
                }
            }

            this.texturePixels[id] = this.texturePixels[wut];
            this.texturePixels[wut] = null;
            this.setTexturePixels(id);
            return;
        }

        // is 128 wide
        for (let k = 0; k < this.textureColours128.length; k++) {
            if (this.textureColours128[k] === null) {
                this.textureColours128[k] = new Int32Array(0x10000);
                this.texturePixels[id] = this.textureColours128[k];
                this.setTexturePixels(id);
                return;
            }
        }

        // 1G 2G 3G... 4G?
        let GIGALONG = new Long(1).shiftLeft(30);
        let wat = 0;

        for (let i2 = 0; i2 < this.textureCount; i2++) {
            if (
                i2 !== id &&
                this.textureDimension[i2] === 1 &&
                this.texturePixels[i2] !== null &&
                this.textureLoadedNumber[i2].lessThan(GIGALONG)
            ) {
                GIGALONG = this.textureLoadedNumber[i2];
                wat = i2;
            }
        }

        this.texturePixels[id] = this.texturePixels[wat];
        this.texturePixels[wat] = null;
        this.setTexturePixels(id);
    }

    setTexturePixels(id) {
        let textureWidth = 0;

        if (this.textureDimension[id] === 0) {
            textureWidth = 64;
        } else {
            textureWidth = 128;
        }

        let colours = this.texturePixels[id];
        let colourCount = 0;

        for (let x = 0; x < textureWidth; x++) {
            for (let y = 0; y < textureWidth; y++) {
                let colour = this.textureColourList[id][
                    this.textureColoursUsed[id][y + x * textureWidth] & 0xff
                ];
                colour &= 0xf8f8ff;

                if (colour === 0) {
                    colour = 1;
                } else if (colour === 0xf800ff) {
                    colour = 0;
                    this.textureBackTransparent[id] = true;
                }

                colours[colourCount++] = colour;
            }
        }

        for (let i1 = 0; i1 < colourCount; i1++) {
            let colour = colours[i1]; // ??
            colours[colourCount + i1] = (colour - (colour >>> 3)) & 0xf8f8ff;
            colours[colourCount * 2 + i1] =
                (colour - (colour >>> 2)) & 0xf8f8ff;
            colours[colourCount * 3 + i1] =
                (colour - (colour >>> 2) - (colour >>> 3)) & 0xf8f8ff;
        }
    }

    doSOemthingWithTheFuckinFountainFuck(id) {
        if (this.texturePixels[id] === null) {
            return;
        }

        let colours = this.texturePixels[id];

        for (let i = 0; i < 64; i++) {
            let k = i + 4032;
            let l = colours[k];

            for (let j1 = 0; j1 < 63; j1++) {
                colours[k] = colours[k - 64];
                k -= 64;
            }

            this.texturePixels[id][k] = l;
        }

        let c = 4096;

        for (let i1 = 0; i1 < c; i1++) {
            let k1 = colours[i1];
            colours[c + i1] = (k1 - (k1 >>> 3)) & 0xf8f8ff;
            colours[c * 2 + i1] = (k1 - (k1 >>> 2)) & 0xf8f8ff;
            colours[c * 3 + i1] = (k1 - (k1 >>> 2) - (k1 >>> 3)) & 0xf8f8ff;
        }
    }

    method302(i) {
        if (i === COLOUR_TRANSPARENT) {
            return 0;
        }

        this.prepareTexture(i);

        if (i >= 0) {
            return this.texturePixels[i][0];
        }

        if (i < 0) {
            i = -(i + 1);

            let j = (i >> 10) & 0x1f;
            let k = (i >> 5) & 0x1f;
            let l = i & 0x1f;

            return (j << 19) + (k << 11) + (l << 3);
        } else {
            return 0;
        }
    }

    _setLight_from3(i, j, k) {
        if (i === 0 && j === 0 && k === 0) {
            i = 32;
        }

        for (let l = 0; l < this.modelCount; l++) {
            this.models[l]._setLight_from3(i, j, k);
        }
    }

    _setLight_from5(i, j, k, l, i1) {
        if (k === 0 && l === 0 && i1 === 0) {
            k = 32;
        }

        for (let j1 = 0; j1 < this.modelCount; j1++) {
            this.models[j1]._setLight_from5(i, j, k, l, i1);
        }
    }

    setLight(...args) {
        switch (args.length) {
            case 3:
                return this._setLight_from3(...args);
            case 5:
                return this._setLight_from5(...args);
        }
    }

    method306(i, j, k, l, i1) {
        if (l === j) {
            return i;
        } else {
            return i + ((((k - i) * (i1 - j)) / (l - j)) | 0);
        }
    }

    method307(i, j, k, l, flag) {
        if ((flag && i <= k) || i < k) {
            if (i > l) {
                return true;
            }

            if (j > k) {
                return true;
            }

            if (j > l) {
                return true;
            }

            return !flag;
        }

        if (i < l) {
            return true;
        }

        if (j < k) {
            return true;
        }

        if (j < l) {
            return true;
        } else {
            return flag;
        }
    }

    method308(i, j, k, flag) {
        if ((flag && i <= k) || i < k) {
            if (j > k) {
                return true;
            }

            return !flag;
        }

        if (j < k) {
            return true;
        } else {
            return flag;
        }
    }

    intersect(ai, ai1, ai2, ai3) {
        let i = ai.length;
        let j = ai2.length;
        let byte0 = 0;
        let i20;
        let k20 = (i20 = ai1[0]);
        let k = 0;
        let j20;
        let l20 = (j20 = ai3[0]);
        let i1 = 0;

        for (let i21 = 1; i21 < i; i21++) {
            if (ai1[i21] < i20) {
                i20 = ai1[i21];
                k = i21;
            } else if (ai1[i21] > k20) {
                k20 = ai1[i21];
            }
        }

        for (let j21 = 1; j21 < j; j21++) {
            if (ai3[j21] < j20) {
                j20 = ai3[j21];
                i1 = j21;
            } else if (ai3[j21] > l20) {
                l20 = ai3[j21];
            }
        }

        if (j20 >= k20) {
            return false;
        }

        if (i20 >= l20) {
            return false;
        }

        let l = 0;
        let j1 = 0;
        let flag = false;

        if (ai1[k] < ai3[i1]) {
            for (l = k; ai1[l] < ai3[i1]; l = (l + 1) % i);
            for (; ai1[k] < ai3[i1]; k = (k - 1 + i) % i);
            let k1 = this.method306(
                ai[(k + 1) % i],
                ai1[(k + 1) % i],
                ai[k],
                ai1[k],
                ai3[i1]
            );
            let k6 = this.method306(
                ai[(l - 1 + i) % i],
                ai1[(l - 1 + i) % i],
                ai[l],
                ai1[l],
                ai3[i1]
            );
            let l10 = ai2[i1];
            flag = (k1 < l10) | (k6 < l10);

            if (this.method308(k1, k6, l10, flag)) {
                return true;
            }

            j1 = (i1 + 1) % j;
            i1 = (i1 - 1 + j) % j;

            if (k === l) {
                byte0 = 1;
            }
        } else {
            for (j1 = i1; ai3[j1] < ai1[k]; j1 = (j1 + 1) % j);
            for (; ai3[i1] < ai1[k]; i1 = (i1 - 1 + j) % j);
            let l1 = ai[k];
            let i11 = this.method306(
                ai2[(i1 + 1) % j],
                ai3[(i1 + 1) % j],
                ai2[i1],
                ai3[i1],
                ai1[k]
            );
            let l15 = this.method306(
                ai2[(j1 - 1 + j) % j],
                ai3[(j1 - 1 + j) % j],
                ai2[j1],
                ai3[j1],
                ai1[k]
            );
            flag = (l1 < i11) | (l1 < l15);

            if (this.method308(i11, l15, l1, !flag)) {
                return true;
            }

            l = (k + 1) % i;
            k = (k - 1 + i) % i;

            if (i1 === j1) {
                byte0 = 2;
            }
        }

        while (byte0 === 0) {
            if (ai1[k] < ai1[l]) {
                if (ai1[k] < ai3[i1]) {
                    if (ai1[k] < ai3[j1]) {
                        let i2 = ai[k];
                        let l6 = this.method306(
                            ai[(l - 1 + i) % i],
                            ai1[(l - 1 + i) % i],
                            ai[l],
                            ai1[l],
                            ai1[k]
                        );
                        let j11 = this.method306(
                            ai2[(i1 + 1) % j],
                            ai3[(i1 + 1) % j],
                            ai2[i1],
                            ai3[i1],
                            ai1[k]
                        );
                        let i16 = this.method306(
                            ai2[(j1 - 1 + j) % j],
                            ai3[(j1 - 1 + j) % j],
                            ai2[j1],
                            ai3[j1],
                            ai1[k]
                        );

                        if (this.method307(i2, l6, j11, i16, flag)) {
                            return true;
                        }

                        k = (k - 1 + i) % i;

                        if (k === l) {
                            byte0 = 1;
                        }
                    } else {
                        let j2 = this.method306(
                            ai[(k + 1) % i],
                            ai1[(k + 1) % i],
                            ai[k],
                            ai1[k],
                            ai3[j1]
                        );
                        let i7 = this.method306(
                            ai[(l - 1 + i) % i],
                            ai1[(l - 1 + i) % i],
                            ai[l],
                            ai1[l],
                            ai3[j1]
                        );
                        let k11 = this.method306(
                            ai2[(i1 + 1) % j],
                            ai3[(i1 + 1) % j],
                            ai2[i1],
                            ai3[i1],
                            ai3[j1]
                        );
                        let j16 = ai2[j1];

                        if (this.method307(j2, i7, k11, j16, flag)) {
                            return true;
                        }

                        j1 = (j1 + 1) % j;

                        if (i1 === j1) {
                            byte0 = 2;
                        }
                    }
                } else if (ai3[i1] < ai3[j1]) {
                    let k2 = this.method306(
                        ai[(k + 1) % i],
                        ai1[(k + 1) % i],
                        ai[k],
                        ai1[k],
                        ai3[i1]
                    );
                    let j7 = this.method306(
                        ai[(l - 1 + i) % i],
                        ai1[(l - 1 + i) % i],
                        ai[l],
                        ai1[l],
                        ai3[i1]
                    );
                    let l11 = ai2[i1];
                    let k16 = this.method306(
                        ai2[(j1 - 1 + j) % j],
                        ai3[(j1 - 1 + j) % j],
                        ai2[j1],
                        ai3[j1],
                        ai3[i1]
                    );

                    if (this.method307(k2, j7, l11, k16, flag)) {
                        return true;
                    }

                    i1 = (i1 - 1 + j) % j;

                    if (i1 === j1) {
                        byte0 = 2;
                    }
                } else {
                    let l2 = this.method306(
                        ai[(k + 1) % i],
                        ai1[(k + 1) % i],
                        ai[k],
                        ai1[k],
                        ai3[j1]
                    );
                    let k7 = this.method306(
                        ai[(l - 1 + i) % i],
                        ai1[(l - 1 + i) % i],
                        ai[l],
                        ai1[l],
                        ai3[j1]
                    );
                    let i12 = this.method306(
                        ai2[(i1 + 1) % j],
                        ai3[(i1 + 1) % j],
                        ai2[i1],
                        ai3[i1],
                        ai3[j1]
                    );
                    let l16 = ai2[j1];

                    if (this.method307(l2, k7, i12, l16, flag)) {
                        return true;
                    }

                    j1 = (j1 + 1) % j;

                    if (i1 === j1) {
                        byte0 = 2;
                    }
                }
            } else if (ai1[l] < ai3[i1]) {
                if (ai1[l] < ai3[j1]) {
                    let i3 = this.method306(
                        ai[(k + 1) % i],
                        ai1[(k + 1) % i],
                        ai[k],
                        ai1[k],
                        ai1[l]
                    );
                    let l7 = ai[l];
                    let j12 = this.method306(
                        ai2[(i1 + 1) % j],
                        ai3[(i1 + 1) % j],
                        ai2[i1],
                        ai3[i1],
                        ai1[l]
                    );
                    let i17 = this.method306(
                        ai2[(j1 - 1 + j) % j],
                        ai3[(j1 - 1 + j) % j],
                        ai2[j1],
                        ai3[j1],
                        ai1[l]
                    );

                    if (this.method307(i3, l7, j12, i17, flag)) {
                        return true;
                    }

                    l = (l + 1) % i;

                    if (k === l) {
                        byte0 = 1;
                    }
                } else {
                    let j3 = this.method306(
                        ai[(k + 1) % i],
                        ai1[(k + 1) % i],
                        ai[k],
                        ai1[k],
                        ai3[j1]
                    );
                    let i8 = this.method306(
                        ai[(l - 1 + i) % i],
                        ai1[(l - 1 + i) % i],
                        ai[l],
                        ai1[l],
                        ai3[j1]
                    );
                    let k12 = this.method306(
                        ai2[(i1 + 1) % j],
                        ai3[(i1 + 1) % j],
                        ai2[i1],
                        ai3[i1],
                        ai3[j1]
                    );
                    let j17 = ai2[j1];

                    if (this.method307(j3, i8, k12, j17, flag)) {
                        return true;
                    }

                    j1 = (j1 + 1) % j;

                    if (i1 === j1) {
                        byte0 = 2;
                    }
                }
            } else if (ai3[i1] < ai3[j1]) {
                let k3 = this.method306(
                    ai[(k + 1) % i],
                    ai1[(k + 1) % i],
                    ai[k],
                    ai1[k],
                    ai3[i1]
                );
                let j8 = this.method306(
                    ai[(l - 1 + i) % i],
                    ai1[(l - 1 + i) % i],
                    ai[l],
                    ai1[l],
                    ai3[i1]
                );
                let l12 = ai2[i1];
                let k17 = this.method306(
                    ai2[(j1 - 1 + j) % j],
                    ai3[(j1 - 1 + j) % j],
                    ai2[j1],
                    ai3[j1],
                    ai3[i1]
                );

                if (this.method307(k3, j8, l12, k17, flag)) {
                    return true;
                }

                i1 = (i1 - 1 + j) % j;

                if (i1 === j1) {
                    byte0 = 2;
                }
            } else {
                let l3 = this.method306(
                    ai[(k + 1) % i],
                    ai1[(k + 1) % i],
                    ai[k],
                    ai1[k],
                    ai3[j1]
                );
                let k8 = this.method306(
                    ai[(l - 1 + i) % i],
                    ai1[(l - 1 + i) % i],
                    ai[l],
                    ai1[l],
                    ai3[j1]
                );
                let i13 = this.method306(
                    ai2[(i1 + 1) % j],
                    ai3[(i1 + 1) % j],
                    ai2[i1],
                    ai3[i1],
                    ai3[j1]
                );
                let l17 = ai2[j1];

                if (this.method307(l3, k8, i13, l17, flag)) {
                    return true;
                }

                j1 = (j1 + 1) % j;

                if (i1 === j1) {
                    byte0 = 2;
                }
            }
        }

        while (byte0 === 1) {
            if (ai1[k] < ai3[i1]) {
                if (ai1[k] < ai3[j1]) {
                    let i4 = ai[k];
                    let j13 = this.method306(
                        ai2[(i1 + 1) % j],
                        ai3[(i1 + 1) % j],
                        ai2[i1],
                        ai3[i1],
                        ai1[k]
                    );
                    let i18 = this.method306(
                        ai2[(j1 - 1 + j) % j],
                        ai3[(j1 - 1 + j) % j],
                        ai2[j1],
                        ai3[j1],
                        ai1[k]
                    );
                    return this.method308(j13, i18, i4, !flag);
                }
                let j4 = this.method306(
                    ai[(k + 1) % i],
                    ai1[(k + 1) % i],
                    ai[k],
                    ai1[k],
                    ai3[j1]
                );
                let l8 = this.method306(
                    ai[(l - 1 + i) % i],
                    ai1[(l - 1 + i) % i],
                    ai[l],
                    ai1[l],
                    ai3[j1]
                );
                let k13 = this.method306(
                    ai2[(i1 + 1) % j],
                    ai3[(i1 + 1) % j],
                    ai2[i1],
                    ai3[i1],
                    ai3[j1]
                );
                let j18 = ai2[j1];

                if (this.method307(j4, l8, k13, j18, flag)) {
                    return true;
                }

                j1 = (j1 + 1) % j;

                if (i1 === j1) {
                    byte0 = 0;
                }
            } else if (ai3[i1] < ai3[j1]) {
                let k4 = this.method306(
                    ai[(k + 1) % i],
                    ai1[(k + 1) % i],
                    ai[k],
                    ai1[k],
                    ai3[i1]
                );
                let i9 = this.method306(
                    ai[(l - 1 + i) % i],
                    ai1[(l - 1 + i) % i],
                    ai[l],
                    ai1[l],
                    ai3[i1]
                );
                let l13 = ai2[i1];
                let k18 = this.method306(
                    ai2[(j1 - 1 + j) % j],
                    ai3[(j1 - 1 + j) % j],
                    ai2[j1],
                    ai3[j1],
                    ai3[i1]
                );

                if (this.method307(k4, i9, l13, k18, flag)) {
                    return true;
                }

                i1 = (i1 - 1 + j) % j;

                if (i1 === j1) {
                    byte0 = 0;
                }
            } else {
                let l4 = this.method306(
                    ai[(k + 1) % i],
                    ai1[(k + 1) % i],
                    ai[k],
                    ai1[k],
                    ai3[j1]
                );
                let j9 = this.method306(
                    ai[(l - 1 + i) % i],
                    ai1[(l - 1 + i) % i],
                    ai[l],
                    ai1[l],
                    ai3[j1]
                );
                let i14 = this.method306(
                    ai2[(i1 + 1) % j],
                    ai3[(i1 + 1) % j],
                    ai2[i1],
                    ai3[i1],
                    ai3[j1]
                );
                let l18 = ai2[j1];

                if (this.method307(l4, j9, i14, l18, flag)) {
                    return true;
                }

                j1 = (j1 + 1) % j;

                if (i1 === j1) {
                    byte0 = 0;
                }
            }
        }

        while (byte0 === 2) {
            if (ai3[i1] < ai1[k]) {
                if (ai3[i1] < ai1[l]) {
                    let i5 = this.method306(
                        ai[(k + 1) % i],
                        ai1[(k + 1) % i],
                        ai[k],
                        ai1[k],
                        ai3[i1]
                    );
                    let k9 = this.method306(
                        ai[(l - 1 + i) % i],
                        ai1[(l - 1 + i) % i],
                        ai[l],
                        ai1[l],
                        ai3[i1]
                    );
                    let j14 = ai2[i1];

                    return this.method308(i5, k9, j14, flag);
                }

                let j5 = this.method306(
                    ai[(k + 1) % i],
                    ai1[(k + 1) % i],
                    ai[k],
                    ai1[k],
                    ai1[l]
                );
                let l9 = ai[l];
                let k14 = this.method306(
                    ai2[(i1 + 1) % j],
                    ai3[(i1 + 1) % j],
                    ai2[i1],
                    ai3[i1],
                    ai1[l]
                );
                let i19 = this.method306(
                    ai2[(j1 - 1 + j) % j],
                    ai3[(j1 - 1 + j) % j],
                    ai2[j1],
                    ai3[j1],
                    ai1[l]
                );

                if (this.method307(j5, l9, k14, i19, flag)) {
                    return true;
                }

                l = (l + 1) % i;

                if (k === l) {
                    byte0 = 0;
                }
            } else if (ai1[k] < ai1[l]) {
                let k5 = ai[k];
                let i10 = this.method306(
                    ai[(l - 1 + i) % i],
                    ai1[(l - 1 + i) % i],
                    ai[l],
                    ai1[l],
                    ai1[k]
                );
                let l14 = this.method306(
                    ai2[(i1 + 1) % j],
                    ai3[(i1 + 1) % j],
                    ai2[i1],
                    ai3[i1],
                    ai1[k]
                );
                let j19 = this.method306(
                    ai2[(j1 - 1 + j) % j],
                    ai3[(j1 - 1 + j) % j],
                    ai2[j1],
                    ai3[j1],
                    ai1[k]
                );

                if (this.method307(k5, i10, l14, j19, flag)) {
                    return true;
                }

                k = (k - 1 + i) % i;

                if (k === l) {
                    byte0 = 0;
                }
            } else {
                let l5 = this.method306(
                    ai[(k + 1) % i],
                    ai1[(k + 1) % i],
                    ai[k],
                    ai1[k],
                    ai1[l]
                );
                let j10 = ai[l];
                let i15 = this.method306(
                    ai2[(i1 + 1) % j],
                    ai3[(i1 + 1) % j],
                    ai2[i1],
                    ai3[i1],
                    ai1[l]
                );
                let k19 = this.method306(
                    ai2[(j1 - 1 + j) % j],
                    ai3[(j1 - 1 + j) % j],
                    ai2[j1],
                    ai3[j1],
                    ai1[l]
                );

                if (this.method307(l5, j10, i15, k19, flag)) {
                    return true;
                }

                l = (l + 1) % i;

                if (k === l) {
                    byte0 = 0;
                }
            }
        }

        if (ai1[k] < ai3[i1]) {
            let i6 = ai[k];
            let j15 = this.method306(
                ai2[(i1 + 1) % j],
                ai3[(i1 + 1) % j],
                ai2[i1],
                ai3[i1],
                ai1[k]
            );
            let l19 = this.method306(
                ai2[(j1 - 1 + j) % j],
                ai3[(j1 - 1 + j) % j],
                ai2[j1],
                ai3[j1],
                ai1[k]
            );

            return this.method308(j15, l19, i6, !flag);
        }

        let j6 = this.method306(
            ai[(k + 1) % i],
            ai1[(k + 1) % i],
            ai[k],
            ai1[k],
            ai3[i1]
        );
        let k10 = this.method306(
            ai[(l - 1 + i) % i],
            ai1[(l - 1 + i) % i],
            ai[l],
            ai1[l],
            ai3[i1]
        );
        let k15 = ai2[i1];

        return this.method308(j6, k10, k15, flag);
    }
}

Scene.aByteArray434 = null;
Scene.frustumFarZ = 0;
Scene.frustumMaxX = 0;
Scene.frustumMaxY = 0;
Scene.frustumMinX = 0;
Scene.frustumMinY = 0;
Scene.frustumNearZ = 0;
Scene.sin512Cache = new Int32Array(512);
Scene.sinCosCache = new Int32Array(2048);
Scene.textureCountLoaded = new Long(0);

module.exports = Scene;
