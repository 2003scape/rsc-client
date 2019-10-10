const Utility = require('./utility');
const Scene = require('./scene');

const COLOUR_TRANSPARENT = 12345678;

class GameModel {
    constructor() {
        this.numVertices = 0;
        this.numFaces = 0;
        this.transformState = 0;
        this.visible = false;
        this.textureTranslucent = false;
        this.transparent = false;
        this.isolated = false;
        this.unlit = false;
        this.unpickable = false;
        this.projected = false;
        this.autocommit = false;
        this.depth = 0;
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.z1 = 0;
        this.z2 = 0;
        this.key = 0;
        this.maxVerts = 0;
        this.lightDiffuse = 0;
        this.lightAmbience = 0;
        this.magic = 0;
        this.maxFaces = 0;
        this.baseX = 0;
        this.baseY = 0;
        this.baseZ = 0;
        this.scaleFx = 0;
        this.scaleFy = 0;
        this.scaleFz = 0;
        this.shearXy = 0;
        this.shearXz = 0;
        this.shearYx = 0;
        this.shearYz = 0;
        this.shearZx = 0;
        this.shearZy = 0;
        this.transformKind = 0;
        this.diameter = 0;
        this.lightDirectionX = 0;
        this.lightDirectionY = 0;
        this.lightDirectionZ = 0;
        this.lightDirectionMagnitude = 0;
        this.dataPtr = 0;
        this.orientationYaw = 0;
        this.orientationPitch = 0;
        this.orientationRoll = 0;

        this.projectVertexX = null;
        this.projectVertexY = null;
        this.projectVertexZ = null;
        this.vertexViewX = null;
        this.vertexViewY = null;
        this.vertexIntensity = null;
        this.vertexAmbience = null;
        this.faceNumVertices = null;
        this.faceVertices = null; // keep this one an array of int32arrays
        this.faceFillFront = null;
        this.faceFillBack = null;
        this.normalMagnitude = null;
        this.normalScale = null;
        this.faceIntensity = null;
        this.faceNormalX = null;
        this.faceNormalY = null;
        this.faceNormalZ = null;
        this.faceTag = null;
        this.isLocalPlayer = null;
        this.vertexX = null;
        this.vertexY = null;
        this.vertexZ = null;
        this.vertexTransformedX = null;
        this.vertexTransformedY = null;
        this.vertexTransformedZ = null;
        this.faceTransStateThing = null;
        this.faceBoundLeft = null;
        this.faceBoundRight = null;
        this.faceBoundBottom = null;
        this.faceBoundTop = null;
        this.faceBoundNear = null;
        this.faceBoundFar = null;

        /*switch (args.length) {
        case 2:
            if (Array.isArray(args[0])) {
                return this._from2A(...args);
            }

            return this._from2(...args);
        case 3:
            return this._from3(...args);
        case 7:
            return this._from7(...args);
        }*/
    }

    static _from2(numVertices, numFaces) {
        let gameModel = new GameModel();

        gameModel.transformState = 1;
        gameModel.visible = true;
        gameModel.textureTranslucent = false;
        gameModel.transparent = false;
        gameModel.key = -1;
        gameModel.autocommit = false;
        gameModel.isolated = false;
        gameModel.unlit = false;
        gameModel.unpickable = false;
        gameModel.projected = false;
        gameModel.magic = COLOUR_TRANSPARENT;
        gameModel.diameter = COLOUR_TRANSPARENT;
        gameModel.lightDirectionX = 180;
        gameModel.lightDirectionY = 155;
        gameModel.lightDirectionZ = 95;
        gameModel.lightDirectionMagnitude = 256;
        gameModel.lightDiffuse = 512;
        gameModel.lightAmbience = 32;

        gameModel.allocate(numVertices, numFaces);

        // TODO: maybe make gameModel an int32 array
        gameModel.faceTransStateThing = [];

        for (let v = 0; v < gameModel.numFaces; v++) {
            gameModel.faceTransStateThing.push(new Int32Array([0]));
        }

        return gameModel;
    }

    static _from2A(pieces, count) {
        let gameModel = new GameModel();

        gameModel.transformState = 1;
        gameModel.visible = true;
        gameModel.textureTranslucent = false;
        gameModel.transparent = false;
        gameModel.key = -1;
        gameModel.autocommit = false;
        gameModel.isolated = false;
        gameModel.unlit = false;
        gameModel.unpickable = false;
        gameModel.projected = false;
        gameModel.magic = COLOUR_TRANSPARENT;
        gameModel.diameter = COLOUR_TRANSPARENT;
        gameModel.lightDirectionX = 180;
        gameModel.lightDirectionY = 155;
        gameModel.lightDirectionZ = 95;
        gameModel.lightDirectionMagnitude = 256;
        gameModel.lightDiffuse = 512;
        gameModel.lightAmbience = 32;

        gameModel.merge(pieces, count, true);

        return gameModel;
    }

    static _from3(data, offset, unused) {
        let gameModel = new GameModel();

        gameModel.transformState = 1;
        gameModel.visible = true;
        gameModel.textureTranslucent = false;
        gameModel.transparent = false;
        gameModel.key = -1;
        gameModel.autocommit = false;
        gameModel.isolated = false;
        gameModel.unlit = false;
        gameModel.unpickable = false;
        gameModel.projected = false;
        gameModel.magic = COLOUR_TRANSPARENT;
        gameModel.diameter = COLOUR_TRANSPARENT;
        gameModel.lightDirectionX = 180;
        gameModel.lightDirectionY = 155;
        gameModel.lightDirectionZ = 95;
        gameModel.lightDirectionMagnitude = 256;
        gameModel.lightDiffuse = 512;
        gameModel.lightAmbience = 32;

        let j = Utility.getUnsignedShort(data, offset);
        offset += 2;
        let k = Utility.getUnsignedShort(data, offset);
        offset += 2;

        gameModel.allocate(j, k);

        gameModel.faceTransStateThing = [];
        gameModel.faceTransStateThing.length = k;
        
        for (let i = 0; i < k; i += 1) {
            gameModel.faceTransStateThing[i] = [0];
        }

        for (let l = 0; l < j; l++) {
            gameModel.vertexX[l] = Utility.getSignedShort(data, offset);
            offset += 2;
        }

        for (let i1 = 0; i1 < j; i1++) {
            gameModel.vertexY[i1] = Utility.getSignedShort(data, offset);
            offset += 2;
        }

        for (let j1 = 0; j1 < j; j1++) {
            gameModel.vertexZ[j1] = Utility.getSignedShort(data, offset);
            offset += 2;
        }

        gameModel.numVertices = j;

        for (let k1 = 0; k1 < k; k1++) {
            gameModel.faceNumVertices[k1] = data[offset++] & 0xff;
        }

        for (let l1 = 0; l1 < k; l1++) {
            gameModel.faceFillFront[l1] = Utility.getSignedShort(data, offset);
            offset += 2;

            if (gameModel.faceFillFront[l1] === 32767) {
                gameModel.faceFillFront[l1] = gameModel.magic;
            }
        }

        for (let i2 = 0; i2 < k; i2++) {
            gameModel.faceFillBack[i2] = Utility.getSignedShort(data, offset);
            offset += 2;

            if (gameModel.faceFillBack[i2] === 32767) {
                gameModel.faceFillBack[i2] = gameModel.magic;
            }
        }

        for (let j2 = 0; j2 < k; j2++) {
            let k2 = data[offset++] & 0xff;

            if (k2 === 0) {
                gameModel.faceIntensity[j2] = 0;
            } else {
                gameModel.faceIntensity[j2] = gameModel.magic;
            }
        }

        for (let l2 = 0; l2 < k; l2++) {
            gameModel.faceVertices[l2] = new Int32Array(gameModel.faceNumVertices[l2]);

            for (let i3 = 0; i3 < gameModel.faceNumVertices[l2]; i3++) {
                if (j < 256) {
                    gameModel.faceVertices[l2][i3] = data[offset++] & 0xff;
                } else {
                    gameModel.faceVertices[l2][i3] = Utility.getUnsignedShort(data, offset);
                    offset += 2;
                }
            }
        }

        gameModel.numFaces = k;
        gameModel.transformState = 1;
        
        return gameModel;
    }

    static _from6(pieces, count, autocommit, isolated, unlit, unpickable) {
        let gameModel = new GameModel();

        gameModel.transformState = 1;
        gameModel.visible = true;
        gameModel.textureTranslucent = false;
        gameModel.transparent = false;
        gameModel.key = -1;
        gameModel.projected = false;
        gameModel.magic = COLOUR_TRANSPARENT;
        gameModel.diameter = COLOUR_TRANSPARENT;
        gameModel.lightDirectionX = 180;
        gameModel.lightDirectionY = 155;
        gameModel.lightDirectionZ = 95;
        gameModel.lightDirectionMagnitude = 256;
        gameModel.lightDiffuse = 512;
        gameModel.lightAmbience = 32;
        gameModel.autocommit = autocommit;
        gameModel.isolated = isolated;
        gameModel.unlit = unlit;
        gameModel.unpickable = unpickable;

        gameModel.merge(pieces, count, false);

        return gameModel;
    }

    static _from7(numVertices, numFaces, autocommit, isolated, unlit, unpickable, projected) {
        let gameModel = new GameModel();

        gameModel.transformState = 1;
        gameModel.visible = true;
        gameModel.textureTranslucent = false;
        gameModel.transparent = false;
        gameModel.key = -1;
        gameModel.magic = COLOUR_TRANSPARENT;
        gameModel.diameter = COLOUR_TRANSPARENT;
        gameModel.lightDirectionX = 180;
        gameModel.lightDirectionY = 155;
        gameModel.lightDirectionZ = 95;
        gameModel.lightDirectionMagnitude = 256;
        gameModel.lightDiffuse = 512;
        gameModel.lightAmbience = 32;
        gameModel.autocommit = autocommit;
        gameModel.isolated = isolated;
        gameModel.unlit = unlit;
        gameModel.unpickable = unpickable;
        gameModel.projected = projected;

        gameModel.allocate(numVertices, numFaces);

        return gameModel;
    }

    allocate(numV, numF) {
        this.vertexX = new Int32Array(numV);
        this.vertexY = new Int32Array(numV);
        this.vertexZ = new Int32Array(numV);
        this.vertexIntensity = new Int32Array(numV);
        this.vertexAmbience = new Int8Array(numV);
        this.faceNumVertices = new Int32Array(numF);

        this.faceVertices = [];
        this.faceVertices.length = numF;
        this.faceVertices.fill(null);
        this.faceFillFront = new Int32Array(numF);
        this.faceFillBack = new Int32Array(numF);
        this.faceIntensity = new Int32Array(numF);
        this.normalScale = new Int32Array(numF);
        this.normalMagnitude = new Int32Array(numF);

        if (!this.projected) {
            this.projectVertexX = new Int32Array(numV);
            this.projectVertexY = new Int32Array(numV);
            this.projectVertexZ = new Int32Array(numV);
            this.vertexViewX = new Int32Array(numV);
            this.vertexViewY = new Int32Array(numV);
        }

        if (!this.unpickable) {
            this.isLocalPlayer = new Int8Array(numF);
            this.faceTag = new Int32Array(numF);
        }

        if (this.autocommit) {
            this.vertexTransformedX = this.vertexX;
            this.vertexTransformedY = this.vertexY;
            this.vertexTransformedZ = this.vertexZ;
        } else {
            this.vertexTransformedX = new Int32Array(numV);
            this.vertexTransformedY = new Int32Array(numV);
            this.vertexTransformedZ = new Int32Array(numV);
        }

        if (!this.unlit || !this.isolated) {
            this.faceNormalX = new Int32Array(numF);
            this.faceNormalY = new Int32Array(numF);
            this.faceNormalZ = new Int32Array(numF);
        }

        if (!this.isolated) {
            this.faceBoundLeft = new Int32Array(numF);
            this.faceBoundRight = new Int32Array(numF);
            this.faceBoundBottom = new Int32Array(numF);
            this.faceBoundTop = new Int32Array(numF);
            this.faceBoundNear = new Int32Array(numF);
            this.faceBoundFar = new Int32Array(numF);
        }

        this.numFaces = 0;
        this.numVertices = 0;
        this.maxVerts = numV;
        this.maxFaces = numF;
        this.baseX = this.baseY = this.baseZ = 0;
        this.orientationYaw = this.orientationPitch = this.orientationRoll = 0;
        this.scaleFx = this.scaleFy = this.scaleFz = 256;
        this.shearXy = this.shearXz = this.shearYx = this.shearYz = this.shearZx = this.shearZy = 256;
        this.transformKind = 0;
    }

    projectionPrepare() {
        this.projectVertexX = new Int32Array(this.numVertices);
        this.projectVertexY = new Int32Array(this.numVertices);
        this.projectVertexZ = new Int32Array(this.numVertices);
        this.vertexViewX = new Int32Array(this.numVertices);
        this.vertexViewY = new Int32Array(this.numVertices);
    }

    clear() {
        this.numFaces = 0;
        this.numVertices = 0;
    }

    reduce(df, dz) {
        this.numFaces -= df;

        if (this.numFaces < 0) {
            this.numFaces = 0;
        }

        this.numVertices -= dz;

        if (this.numVertices < 0) {
            this.numVertices = 0;
        }
    }

    merge(pieces, count, transState) {
        let numF = 0;
        let numV = 0;

        for (let i = 0; i < count; i++) {
            numF += pieces[i].numFaces;
            numV += pieces[i].numVertices;
        }

        this.allocate(numV, numF);

        if (transState) {
            this.faceTransStateThing = [];
            this.faceTransStateThing.length = numF;
        }

        for (let i = 0; i < count; i++) {
            let source = pieces[i];
            source.commit();

            this.lightAmbience = source.lightAmbience;
            this.lightDiffuse = source.lightDiffuse;
            this.lightDirectionX = source.lightDirectionX;
            this.lightDirectionY = source.lightDirectionY;
            this.lightDirectionZ = source.lightDirectionZ;
            this.lightDirectionMagnitude = source.lightDirectionMagnitude;

            for (let srcF = 0; srcF < source.numFaces; srcF++) {
                let dstVs = new Int32Array(source.faceNumVertices[srcF]);
                let srcVs = source.faceVertices[srcF];

                for (let v = 0; v < source.faceNumVertices[srcF]; v++) {
                    dstVs[v] = this.vertexAt(source.vertexX[srcVs[v]], source.vertexY[srcVs[v]], source.vertexZ[srcVs[v]]);
                }

                let dstF = this.createFace(source.faceNumVertices[srcF], dstVs, source.faceFillFront[srcF], source.faceFillBack[srcF]);
                this.faceIntensity[dstF] = source.faceIntensity[srcF];
                this.normalScale[dstF] = source.normalScale[srcF];
                this.normalMagnitude[dstF] = source.normalMagnitude[srcF];

                if (transState) {
                    if (count > 1) {
                        this.faceTransStateThing[dstF] = new Int32Array(source.faceTransStateThing[srcF].length + 1);
                        this.faceTransStateThing[dstF][0] = i;

                        for (let i2 = 0; i2 < source.faceTransStateThing[srcF].length; i2++) {
                            this.faceTransStateThing[dstF][i2 + 1] = source.faceTransStateThing[srcF][i2];
                        }
                    } else {
                        this.faceTransStateThing[dstF] = new Int32Array(source.faceTransStateThing[srcF].length);

                        for (let j2 = 0; j2 < source.faceTransStateThing[srcF].length; j2++) {
                            this.faceTransStateThing[dstF][j2] = source.faceTransStateThing[srcF][j2];
                        }
                    }
                }
            }
        }

        this.transformState = 1;
    }


    vertexAt(x, y, z) {
        for (let l = 0; l < this.numVertices; l++) {
            if (this.vertexX[l] === x && this.vertexY[l] === y && this.vertexZ[l] === z) {
                return l;
            }
        }

        if (this.numVertices >= this.maxVerts) {
            return -1;
        } else {
            this.vertexX[this.numVertices] = x;
            this.vertexY[this.numVertices] = y;
            this.vertexZ[this.numVertices] = z;

            return this.numVertices++;
        }
    }

    createVertex(i, j, k) {
        if (this.numVertices >= this.maxVerts) {
            return -1;
        } else {
            this.vertexX[this.numVertices] = i;
            this.vertexY[this.numVertices] = j;
            this.vertexZ[this.numVertices] = k;

            return this.numVertices++;
        }
    }

    createFace(n, vs, front, back) {
        if (this.numFaces >= this.maxFaces) {
            return -1;
        } else {
            this.faceNumVertices[this.numFaces] = n;
            this.faceVertices[this.numFaces] = vs;
            this.faceFillFront[this.numFaces] = front;
            this.faceFillBack[this.numFaces] = back;
            this.transformState = 1;

            return this.numFaces++;
        }
    }

    split(unused1, unused2, pieceDx, pieceDz, rows, count, pieceMaxVertices, pickable) {
        this.commit();

        let pieceNV = new Int32Array(count);
        let pieceNF = new Int32Array(count);

        for (let i = 0; i < count; i++) {
            pieceNV[i] = 0;
            pieceNF[i] = 0;
        }

        for (let f = 0; f < this.numFaces; f++) {
            let sumX = 0;
            let sumZ = 0;
            let n = this.faceNumVertices[f];
            let vs = this.faceVertices[f];

            for (let i = 0; i < n; i++) {
                sumX += this.vertexX[vs[i]];
                sumZ += this.vertexZ[vs[i]];
            }

            let p = ((sumX / (n * pieceDx)) | 0) + ((sumZ / (n * pieceDz)) | 0) * rows;
            pieceNV[p] += n;
            pieceNF[p]++;
        }

        let pieces = [];

        for (let i = 0; i < count; i++) {
            if (pieceNV[i] > pieceMaxVertices) {
                pieceNV[i] = pieceMaxVertices;
            }

            pieces.push(GameModel._from7(pieceNV[i], pieceNF[i], true, true, true, pickable, true));
            pieces[i].lightDiffuse = this.lightDiffuse;
            pieces[i].lightAmbience = this.lightAmbience;
        }

        for (let f = 0; f < this.numFaces; f++) {
            let sumX = 0;
            let sumZ = 0;
            let n = this.faceNumVertices[f];
            let vs = this.faceVertices[f];

            for (let i = 0; i < n; i++) {
                sumX += this.vertexX[vs[i]];
                sumZ += this.vertexZ[vs[i]];
            }

            let p = ((sumX / (n * pieceDx)) | 0) + ((sumZ / (n * pieceDz)) | 0) * rows;
            this.copyLighting(pieces[p], vs, n, f);
        }

        for (let p = 0; p < count; p++) {
            pieces[p].projectionPrepare();
        }

        return pieces;
    }

    copyLighting(model, srcVs, nV, inF) {
        let dstVs = new Int32Array(nV);

        for (let inV = 0; inV < nV; inV++) {
            let outV = dstVs[inV] = model.vertexAt(this.vertexX[srcVs[inV]], this.vertexY[srcVs[inV]], this.vertexZ[srcVs[inV]]);
            model.vertexIntensity[outV] = this.vertexIntensity[srcVs[inV]];
            model.vertexAmbience[outV] = this.vertexAmbience[srcVs[inV]];
        }

        let outF = model.createFace(nV, dstVs, this.faceFillFront[inF], this.faceFillBack[inF]);

        if (!model.unpickable && !this.unpickable) {
            model.faceTag[outF] = this.faceTag[inF];
        }

        model.faceIntensity[outF] = this.faceIntensity[inF];
        model.normalScale[outF] = this.normalScale[inF];
        model.normalMagnitude[outF] = this.normalMagnitude[inF];
    }

    _setLight_from5(ambience, diffuse, x, y, z) {
        this.lightAmbience = 256 - ambience * 4;
        this.lightDiffuse = (64 - diffuse) * 16 + 128;

        if (!this.unlit) {
            this.lightDirectionX = x;
            this.lightDirectionY = y;
            this.lightDirectionZ = z;
            this.lightDirectionMagnitude = Math.sqrt(x * x + y * y + z * z) | 0;
            this.light();
        }
    }

    _setLight_from6(gouraud, ambient, diffuse, x, y, z) {
        this.lightAmbience = 256 - ambient * 4;
        this.lightDiffuse = (64 - diffuse) * 16 + 128;

        if (this.unlit) {
            return;
        }

        for (let i = 0; i < this.numFaces; i++) {
            if (gouraud) {
                this.faceIntensity[i] = this.magic;
            } else {
                this.faceIntensity[i] = 0;
            }
        }

        this.lightDirectionX = x;
        this.lightDirectionY = y;
        this.lightDirectionZ = z;
        this.lightDirectionMagnitude = Math.sqrt(x * x + y * y + z * z) | 0;

        this.light();
    }

    _setLight_from3(x, y, z) {
        if (!this.unlit) {
            this.lightDirectionX = x;
            this.lightDirectionY = y;
            this.lightDirectionZ = z;
            this.lightDirectionMagnitude = Math.sqrt(x * x + y * y + z * z) | 0;
            this.light();
        }
    }
    
    setLight(...args) {
        switch (args.length) {
        case 6:
            return this._setLight_from6(...args);
        case 5:
            return this._setLight_from5(...args);
        case 3:
            return this._setLight_from3(...args);
        }
    }

    setVertexAmbience(v, ambience) {
        this.vertexAmbience[v] = ambience & 0xff;
    }

    rotate(yaw, pitch, roll) {
        this.orientationYaw = this.orientationYaw + yaw & 0xff;
        this.orientationPitch = this.orientationPitch + pitch & 0xff;
        this.orientationRoll = this.orientationRoll + roll & 0xff;
        this.determineTransformKind();
        this.transformState = 1;
    }

    orient(yaw, pitch, roll) {
        this.orientationYaw = yaw & 0xff;
        this.orientationPitch = pitch & 0xff;
        this.orientationRoll = roll & 0xff;
        this.determineTransformKind();
        this.transformState = 1;
    }

    translate(x, y, z) {
        this.baseX += x;
        this.baseY += y;
        this.baseZ += z;
        this.determineTransformKind();
        this.transformState = 1;
    }

    place(x, y, z) {
        this.baseX = x;
        this.baseY = y;
        this.baseZ = z;
        this.determineTransformKind();
        this.transformState = 1;
    }

    determineTransformKind() {
        if (this.shearXy !== 256 || this.shearXz !== 256 || this.shearYx !== 256 || this.shearYz !== 256 || this.shearZx !== 256 || this.shearZy !== 256) {
            this.transformKind = 4;
        } else if (this.scaleFx !== 256 || this.scaleFy !== 256 || this.scaleFz !== 256) {
            this.transformKind = 3;
        } else if (this.orientationYaw !== 0 || this.orientationPitch !== 0 || this.orientationRoll !== 0) {
            this.transformKind = 2;
        } else if (this.baseX !== 0 || this.baseY !== 0 || this.baseZ !== 0) {
            this.transformKind = 1;
        } else {
            this.transformKind = 0;
        }
    }

    applyTranslate(dx, dy, dz) {
        for (let v = 0; v < this.numVertices; v++) {
            this.vertexTransformedX[v] += dx;
            this.vertexTransformedY[v] += dy;
            this.vertexTransformedZ[v] += dz;
        }
    }

    applyRotation(yaw, roll, pitch) {
        for (let v = 0; v < this.numVertices; v++) {
            if (pitch !== 0) {
                let sin = GameModel.sine9[pitch];
                let cos = GameModel.sine9[pitch + 256];
                let x = this.vertexTransformedY[v] * sin + this.vertexTransformedX[v] * cos >> 15;

                this.vertexTransformedY[v] = this.vertexTransformedY[v] * cos - this.vertexTransformedX[v] * sin >> 15;
                this.vertexTransformedX[v] = x;
            }

            if (yaw !== 0) {
                let sin = GameModel.sine9[yaw];
                let cos = GameModel.sine9[yaw + 256];
                let y = this.vertexTransformedY[v] * cos - this.vertexTransformedZ[v] * sin >> 15;

                this.vertexTransformedZ[v] = this.vertexTransformedY[v] * sin + this.vertexTransformedZ[v] * cos >> 15;
                this.vertexTransformedY[v] = y;
            }

            if (roll !== 0) {
                let sin = GameModel.sine9[roll];
                let cos = GameModel.sine9[roll + 256];
                let x = this.vertexTransformedZ[v] * sin + this.vertexTransformedX[v] * cos >> 15;

                this.vertexTransformedZ[v] = this.vertexTransformedZ[v] * cos - this.vertexTransformedX[v] * sin >> 15;
                this.vertexTransformedX[v] = x;
            }
        }
    }

    applyShear(xy, xz, yx, yz, zx, zy) {
        for (let idx = 0; idx < this.numVertices; idx++) {
            if (xy !== 0) {
                this.vertexTransformedX[idx] += this.vertexTransformedY[idx] * xy >> 8;
            }

            if (xz !== 0) {
                this.vertexTransformedZ[idx] += this.vertexTransformedY[idx] * xz >> 8;
            }

            if (yx !== 0) {
                this.vertexTransformedX[idx] += this.vertexTransformedZ[idx] * yx >> 8;
            }

            if (yz !== 0) {
                this.vertexTransformedY[idx] += this.vertexTransformedZ[idx] * yz >> 8;
            }

            if (zx !== 0) {
                this.vertexTransformedZ[idx] += this.vertexTransformedX[idx] * zx >> 8;
            }

            if (zy !== 0) {
                this.vertexTransformedY[idx] += this.vertexTransformedX[idx] * zy >> 8;
            }
        }
    }

    applyScale(fx, fy, fz) {
        for (let v = 0; v < this.numVertices; v++) {
            this.vertexTransformedX[v] = this.vertexTransformedX[v] * fx >> 8;
            this.vertexTransformedY[v] = this.vertexTransformedY[v] * fy >> 8;
            this.vertexTransformedZ[v] = this.vertexTransformedZ[v] * fz >> 8;
        }
    }

    computeBounds() {
        this.x1 = this.y1 = this.z1 = 999999;
        this.diameter = this.x2 = this.y2 = this.z2 = -999999;

        for (let face = 0; face < this.numFaces; face++) {
            let vs = this.faceVertices[face];
            let v = vs[0];
            let n = this.faceNumVertices[face];
            let x1 = 0;
            let x2 = x1 = this.vertexTransformedX[v];
            let y1 = 0;
            let y2 = y1 = this.vertexTransformedY[v];
            let z1 = 0;
            let z2 = z1 = this.vertexTransformedZ[v];

            for (let i = 0; i < n; i++) {
                v = vs[i];

                if (this.vertexTransformedX[v] < x1) {
                    x1 = this.vertexTransformedX[v];
                } else if (this.vertexTransformedX[v] > x2) {
                    x2 = this.vertexTransformedX[v];
                }

                if (this.vertexTransformedY[v] < y1) {
                    y1 = this.vertexTransformedY[v];
                } else if (this.vertexTransformedY[v] > y2) {
                    y2 = this.vertexTransformedY[v];
                }

                if (this.vertexTransformedZ[v] < z1) {
                    z1 = this.vertexTransformedZ[v];
                } else if (this.vertexTransformedZ[v] > z2) {
                    z2 = this.vertexTransformedZ[v];
                }
            }

            if (!this.isolated) {
                this.faceBoundLeft[face] = x1;
                this.faceBoundRight[face] = x2;
                this.faceBoundBottom[face] = y1;
                this.faceBoundTop[face] = y2;
                this.faceBoundNear[face] = z1;
                this.faceBoundFar[face] = z2;
            }

            if (x2 - x1 > this.diameter) {
                this.diameter = x2 - x1;
            }

            if (y2 - y1 > this.diameter) {
                this.diameter = y2 - y1;
            }

            if (z2 - z1 > this.diameter) {
                this.diameter = z2 - z1;
            }

            if (x1 < this.x1) {
                this.x1 = x1;
            }

            if (x2 > this.x2) {
                this.x2 = x2;
            }

            if (y1 < this.y1) {
                this.y1 = y1;
            }

            if (y2 > this.y2) {
                this.y2 = y2;
            }

            if (z1 < this.z1) {
                this.z1 = z1;
            }

            if (z2 > this.z2) {
                this.z2 = z2;
            }
        }
    }

    light() {
        if (this.unlit) {
            return;
        }

        let divisor = this.lightDiffuse * this.lightDirectionMagnitude >> 8;

        for (let face = 0; face < this.numFaces; face++) {
            if (this.faceIntensity[this.face] !== this.magic) {
                this.faceIntensity[this.face] = ((this.faceNormalX[face] * this.lightDirectionX + this.faceNormalY[face] * this.lightDirectionY + this.faceNormalZ[face] * this.lightDirectionZ) / divisor) | 0;
            }
        }

        let normalX = new Int32Array(this.numVertices);
        let normalY = new Int32Array(this.numVertices);
        let normalZ = new Int32Array(this.numVertices);
        let normalMagnitude = new Int32Array(this.numVertices);

        for (let k = 0; k < this.numVertices; k++) {
            normalX[k] = 0;
            normalY[k] = 0;
            normalZ[k] = 0;
            normalMagnitude[k] = 0;
        }

        for (let face = 0; face < this.numFaces; face++) {
            if (this.faceIntensity[face] === this.magic) {
                for (let v = 0; v < this.faceNumVertices[face]; v++) {
                    let k1 = this.faceVertices[face][v];

                    normalX[k1] += this.faceNormalX[face];
                    normalY[k1] += this.faceNormalY[face];
                    normalZ[k1] += this.faceNormalZ[face];
                    normalMagnitude[k1]++;
                }
            }
        }

        for (let v = 0; v < this.numVertices; v++) {
            if (normalMagnitude[v] > 0) {
                this.vertexIntensity[v] = ((normalX[v] * this.lightDirectionX + normalY[v] * this.lightDirectionY + normalZ[v] * this.lightDirectionZ) / (divisor * normalMagnitude[v])) | 0;
            }
        }
    }

    relight() {
        if (this.unlit && this.isolated) {
            return;
        }

        for (let face = 0; face < this.numFaces; face++) {
            let verts = this.faceVertices[face];

            let aX = this.vertexTransformedX[verts[0]];
            let aY = this.vertexTransformedY[verts[0]];
            let aZ = this.vertexTransformedZ[verts[0]];
            let bX = this.vertexTransformedX[verts[1]] - aX;
            let bY = this.vertexTransformedY[verts[1]] - aY;
            let bZ = this.vertexTransformedZ[verts[1]] - aZ;
            let cX = this.vertexTransformedX[verts[2]] - aX;
            let cY = this.vertexTransformedY[verts[2]] - aY;
            let cZ = this.vertexTransformedZ[verts[2]] - aZ;

            let normX = bY * cZ - cY * bZ;
            let normY = bZ * cX - cZ * bX;
            let normZ;

            for (normZ = bX * cY - cX * bY; normX > 8192 || normY > 8192 || normZ > 8192 || normX < -8192 || normY < -8192 || normZ < -8192; normZ >>= 1) {
                normX >>= 1;
                normY >>= 1;
            }

            let normMag = (256 * Math.sqrt(normX * normX + normY * normY + normZ * normZ)) | 0;

            if (normMag <= 0) {
                normMag = 1;
            }

            this.faceNormalX[face] = ((normX * 0x10000) / normMag) | 0;
            this.faceNormalY[face] = ((normY * 0x10000) / normMag) | 0;
            this.faceNormalZ[face] = ((normZ * 65535) / normMag) | 0;
            this.normalScale[face] = -1;
        }

        this.light();
    }

    apply() {
        if (this.transformState === 2) {
            this.transformState = 0;

            for (let v = 0; v < this.numVertices; v++) {
                this.vertexTransformedX[v] = this.vertexX[v];
                this.vertexTransformedY[v] = this.vertexY[v];
                this.vertexTransformedZ[v] = this.vertexZ[v];
            }

            this.x1 = this.y1 = this.z1 = -9999999;
            this.diameter = this.x2 = this.y2 = this.z2 = 9999999;

            return;
        }

        if (this.transformState === 1) {
            this.transformState = 0;

            for (let v = 0; v < this.numVertices; v++) {
                this.vertexTransformedX[v] = this.vertexX[v];
                this.vertexTransformedY[v] = this.vertexY[v];
                this.vertexTransformedZ[v] = this.vertexZ[v];
            }

            if (this.transformKind >= 2) {
                this.applyRotation(this.orientationYaw, this.orientationPitch, this.orientationRoll);
            }

            if (this.transformKind >= 3) {
                this.applyScale(this.scaleFx, this.scaleFy, this.scaleFz);
            }

            if (this.transformKind >= 4) {
                this.applyShear(this.shearXy, this.shearXz, this.shearYx, this.shearYz, this.shearZx, this.shearZy);
            }

            if (this.transformKind >= 1) {
                this.applyTranslate(this.baseX, this.baseY, this.baseZ);
            }

            this.computeBounds();
            this.relight();
        }
    }

    project(cameraX, cameraY, cameraZ, cameraPitch, cameraRoll, cameraYaw, viewDist, clipNear) {
        this.apply();

        if (this.z1 > Scene.frustumNearZ || this.z2 < Scene.frustumFarZ || this.x1 > Scene.frustumMinX || this.x2 < Scene.frustumMaxX || this.y1 > Scene.frustumMinY || this.y2 < Scene.frustumMaxY) {
            this.visible = false;
            return;
        }

        this.visible = true;

        let yawSin = 0;
        let yawCos = 0;
        let pitchSin = 0;
        let pitchCos = 0;
        let rollSin = 0;
        let rollCos = 0;

        if (cameraYaw !== 0) {
            yawSin = GameModel.sine11[cameraYaw];
            yawCos = GameModel.sine11[cameraYaw + 1024];
        }

        if (cameraRoll !== 0) {
            rollSin = GameModel.sine11[cameraRoll];
            rollCos = GameModel.sine11[cameraRoll + 1024];
        }

        if (cameraPitch !== 0) {
            pitchSin = GameModel.sine11[cameraPitch];
            pitchCos = GameModel.sine11[cameraPitch + 1024];
        }

        for (let v = 0; v < this.numVertices; v++) {
            let x = this.vertexTransformedX[v] - cameraX;
            let y = this.vertexTransformedY[v] - cameraY;
            let z = this.vertexTransformedZ[v] - cameraZ;

            if (cameraYaw !== 0) {
                let X = y * yawSin + x * yawCos >> 15;
                y = y * yawCos - x * yawSin >> 15;
                x = X;
            }

            if (cameraRoll !== 0) {
                let X = z * rollSin + x * rollCos >> 15;
                z = z * rollCos - x * rollSin >> 15;
                x = X;
            }

            if (cameraPitch !== 0) {
                let Y = y * pitchCos - z * pitchSin >> 15;
                z = y * pitchSin + z * pitchCos >> 15;
                y = Y;
            }

            if (z >= clipNear) {
                this.vertexViewX[v] = ((x << viewDist) / z) | 0;
            } else {
                this.vertexViewX[v] = x << viewDist;
            }

            if (z >= clipNear) {
                this.vertexViewY[v] = ((y << viewDist) / z) | 0;
            } else {
                this.vertexViewY[v] = y << viewDist;
            }

            this.projectVertexX[v] = x;
            this.projectVertexY[v] = y;
            this.projectVertexZ[v] = z;
        }
    }

    commit() {
        this.apply();

        for (let i = 0; i < this.numVertices; i++) {
            this.vertexX[i] = this.vertexTransformedX[i];
            this.vertexY[i] = this.vertexTransformedY[i];
            this.vertexZ[i] = this.vertexTransformedZ[i];
        }

        this.baseX = this.baseY = this.baseZ = 0;
        this.orientationYaw = this.orientationPitch = this.orientationRoll = 0;
        this.scaleFx = this.scaleFy = this.scaleFz = 256;
        this.shearXy = this.shearXz = this.shearYx = this.shearYz = this.shearZx = this.shearZy = 256;
        this.transformKind = 0;
    }

    // TODO see if we have to call .slice() anywhere here
    copy(...args) {
        if (!args || !args.length) {
            let pieces = [this]; 
            let gameModel = GameModel._from2A(pieces, 1);
            gameModel.depth = this.depth;
            gameModel.transparent = this.transparent;

            return gameModel;
        }

        const [autocommit, isolated, unlit, pickable] = args;

        let pieces = [this];
        let gameModel = GameModel._from6(pieces, 1, autocommit, isolated, unlit, pickable);
        gameModel.depth = this.depth;

        return gameModel;
    }

    copyPosition(model) {
        this.orientationYaw = model.orientationYaw;
        this.orientationPitch = model.orientationPitch;
        this.orientationRoll = model.orientationRoll;
        this.baseX = model.baseX;
        this.baseY = model.baseY;
        this.baseZ = model.baseZ;
        this.determineTransformKind();
        this.transformState = 1;
    }

    readBase64(buff) {
        for (; buff[this.dataPtr] === 10 || buff[this.dataPtr] === 13; this.dataPtr++) ;

        let hi = GameModel.base64Alphabet[buff[this.dataPtr++] & 0xff];
        let mid = GameModel.base64Alphabet[buff[this.dataPtr++] & 0xff];
        let lo = GameModel.base64Alphabet[buff[this.dataPtr++] & 0xff];
        let val = ((hi * 4096 + mid * 64 + lo) - 0x20000) | 0;

        if (val === 123456) {
            val = this.magic;
        }

        return val;
    }
}

GameModel.sine9 = new Int32Array(512);
GameModel.sine11 = new Int32Array(2048);

GameModel.base64Alphabet = new Int32Array(256);

for (let i = 0; i < 256; i++) {
    GameModel.sine9[i] = (Math.sin(i * 0.02454369) * 32768) | 0;
    GameModel.sine9[i + 256] = (Math.cos(i * 0.02454369) * 32768) | 0;
}

for (let j = 0; j < 1024; j++) {
    GameModel.sine11[j] = (Math.sin(j * 0.00613592315) * 32768) | 0;
    GameModel.sine11[j + 1024] = (Math.cos(j * 0.00613592315) * 32768) | 0;
}

for (let j1 = 0; j1 < 10; j1++) {
    GameModel.base64Alphabet[48 + j1] = j1;
}

for (let k1 = 0; k1 < 26; k1++) {
    GameModel.base64Alphabet[65 + k1] = k1 + 10;
}

for (let l1 = 0; l1 < 26; l1++) {
    GameModel.base64Alphabet[97 + l1] = l1 + 36;
}

GameModel.base64Alphabet[163] = 62;
GameModel.base64Alphabet[36] = 63;

module.exports = GameModel;