function init2DInt8Array(x, y) {
    const a = [];

    for (let i = 0; i < x; i += 1) {
        a.push(new Int8Array(y));
    }

    return a;
}

function init2DInt32Array(x, y) {
    const a = [];

    for (let i = 0; i < x; i += 1) {
        a.push(new Int32Array(y));
    }

    return a;
}

class BZState {
    constructor() {
        this.tt = null; // Int32Array
        this.input = null; // Int8Array
        this.nextIn = 0;
        this.availIn = 0;
        this.totalInLo32 = 0;
        this.totalInHi32 = 0;
        this.output = null; // Int8Array
        this.availOut = 0;
        this.decompressedSize = 0;
        this.totalOutLo32 = 0;
        this.totalOutHi32 = 0;
        this.stateOutCh = 0; // char
        this.stateOutLen = 0;
        this.blockRandomised = false;
        this.bsBuff = 0;
        this.bsLive = 0;
        this.blocksize100k = 0;
        this.blockNo = 0;
        this.origPtr = 0;
        this.tpos = 0;
        this.k0 = 0;
        this.nblockUsed = 0;
        this.nInUse = 0;
        this.saveNblock = 0;

        this.unzftab = new Int32Array(256); 
        this.cftab = new Int32Array(257); 
        this.inUse = new Int8Array(256); // this was a bool[]
        this.inUse_16 = new Int8Array(16); 
        this.setToUnseq = new Int8Array(256); 
        this.mtfa = new Int8Array(4096);
        this.mtfbase = new Int32Array(16);
        this.selector = new Int8Array(18002); 
        this.selectorMtf = new Int8Array(18002); 

        this.len = init2DInt8Array(6, 258);
        this.limit = init2DInt32Array(6, 258);
        this.base = init2DInt32Array(6, 258);
        this.perm = init2DInt32Array(6, 258);

        this.minLens = new Int32Array(6);
    }
}

// TODO should we just use functions here instead? it's all static.
class BZLib {
    static decompress(out, outSize, input, inSize, offset) {
        let block = new BZState();

        block.input = input;
        block.nextIn = offset;
        block.output = out;
        block.availOut = 0;
        block.availIn = inSize;
        block.decompressedSize = outSize;
        block.bsLive = 0;
        block.bsBuff = 0;
        block.totalInLo32 = 0;
        block.totalInHi32 = 0;
        block.totalOutLo32 = 0;
        block.totalOutHi32 = 0;
        block.blockNo = 0;
        BZLib.decompressState(block);
        outSize -= block.decompressedSize;

        return outSize;
    }

    static nextHeader(state) {
        let cStateOutCh = state.stateOutCh;
        let cStateOutLen = state.stateOutLen;
        let cNblockUsed = state.nblockUsed;
        let cK0 = state.k0;
        let cTt = state.tt;
        let cTpos = state.tpos;
        let output = state.output;
        let csNextOut = state.availOut;
        let csAvailOut = state.decompressedSize;
        let asdasdasd = csAvailOut;
        let sSaveNblockPP = state.saveNblock + 1;

        returnNotr:
        do {
            if (cStateOutLen > 0) {
                do {
                    if (csAvailOut === 0) {
                        break returnNotr;
                    }

                    if (cStateOutLen === 1) {
                        break;
                    }

                    output[csNextOut] = cStateOutCh;
                    cStateOutLen--;
                    csNextOut++;
                    csAvailOut--;
                } while (true);

                if (csAvailOut === 0) {
                    cStateOutLen = 1;
                    break;
                }

                output[csNextOut] = cStateOutCh;
                csNextOut++;
                csAvailOut--;
            }

            let flag = true;

            while (flag) {
                flag = false;

                if (cNblockUsed === sSaveNblockPP) {
                    cStateOutLen = 0;
                    break returnNotr;
                }

                cStateOutCh = cK0 & 0xff;
                cTpos = cTt[cTpos];
                let k1 = cTpos & 0xff;
                cTpos >>= 8;
                cNblockUsed++;

                if (k1 !== cK0) {
                    cK0 = k1;

                    if (csAvailOut === 0) {
                        cStateOutLen = 1;
                    } else {
                        output[csNextOut] = cStateOutCh;
                        csNextOut++;
                        csAvailOut--;
                        flag = true;
                        continue;
                    }

                    break returnNotr;
                }

                if (cNblockUsed !== sSaveNblockPP) {
                    continue;
                }

                if (csAvailOut === 0) {
                    cStateOutLen = 1;
                    break returnNotr;
                }

                output[csNextOut] = cStateOutCh;
                csNextOut++;
                csAvailOut--;
                flag = true;
            }

            cStateOutLen = 2;
            cTpos = cTt[cTpos];
            let k2 = cTpos & 0xff;
            cTpos >>= 8;

            if (++cNblockUsed !== sSaveNblockPP) {
                if (k2 !== cK0) {
                    cK0 = k2;
                } else {
                    cStateOutLen = 3;
                    cTpos = cTt[cTpos];
                    let k3 = cTpos & 0xff;
                    cTpos >>= 8;

                    if (++cNblockUsed !== sSaveNblockPP) {
                        if (k3 !== cK0) {
                            cK0 = k3;
                        } else {
                            cTpos = cTt[cTpos];
                            let byte3 = cTpos & 0xff;
                            cTpos >>= 8;
                            cNblockUsed++;
                            cStateOutLen = (byte3 & 0xff) + 4;
                            cTpos = cTt[cTpos];
                            cK0 = cTpos & 0xff;
                            cTpos >>= 8;
                            cNblockUsed++;
                        }
                    }
                }
            }
        } while (true);

        let i2 = state.totalOutLo32;
        state.totalOutLo32 += asdasdasd - csAvailOut;

        if (state.totalOutLo32 < i2) {
            state.totalOutHi32++;
        }

        state.stateOutCh = cStateOutCh;
        state.stateOutLen = cStateOutLen;
        state.nblockUsed = cNblockUsed;
        state.k0 = cK0;
        state.tt = cTt;
        state.tpos = cTpos;
        state.output = output;
        state.availOut = csNextOut;
        state.decompressedSize = csAvailOut;
    }

    static decompressState(state) {
        let gMinLen = 0;
        let gLimit = null;
        let gBase = null;
        let gPerm = null;

        state.blocksize100k = 1;

        if (state.tt === null) {
            state.tt = new Int32Array(state.blocksize100k * 100000);
        }

        let goingandshit = true;

        while (goingandshit) {
            let uc = BZLib.getUChar(state);

            if (uc === 23) {
                return;
            }

            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            state.blockNo++;
            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            uc = BZLib.getUChar(state);
            uc = BZLib.getBit(state);
            state.blockRandomised = uc !== 0;

            if (state.blockRandomised) {
                console.log('PANIC! RANDOMISED BLOCK!');
            }

            state.origPtr = 0;
            uc = BZLib.getUChar(state);
            state.origPtr = state.origPtr << 8 | uc & 0xff;
            uc = BZLib.getUChar(state);
            state.origPtr = state.origPtr << 8 | uc & 0xff;
            uc = BZLib.getUChar(state);
            state.origPtr = state.origPtr << 8 | uc & 0xff;

            for (let i = 0; i < 16; i++) {
                uc = BZLib.getBit(state);
                state.inUse_16[i] = uc === 1;
            }

            for (let i = 0; i < 256; i++) {
                state.inUse[i] = false;
            }

            for (let i = 0; i < 16; i++) {
                if (state.inUse_16[i]) {
                    for (let j = 0; j < 16; j++) {
                        uc = BZLib.getBit(state);
                        if (uc === 1) {
                            state.inUse[i * 16 + j] = true;
                        }
                    }
                }
            }

            BZLib.makeMaps(state);

            let alphaSize = state.nInUse + 2;
            let nGroups = BZLib.getBits(3, state);
            let nSelectors = BZLib.getBits(15, state);

            for (let i = 0; i < nSelectors; i++) {
                let j = 0;

                do {
                    uc = BZLib.getBit(state);

                    if (uc === 0) {
                        break;
                    }

                    j++;
                } while (true);

                state.selectorMtf[i] = j & 0xff;
            }

            let pos = new Int8Array(6);

            for (let v = 0; v < nGroups; v++) {
                pos[v] = v;
            }

            for (let i = 0; i < nSelectors; i++) {
                let v = state.selectorMtf[i];
                let tmp = pos[v];

                for (; v > 0; v--) {
                    pos[v] = pos[v - 1];
                }

                pos[0] = tmp;
                state.selector[i] = tmp;
            }

            for (let t = 0; t < nGroups; t++) {
                let curr = BZLib.getBits(5, state);

                for (let i = 0; i < alphaSize; i++) {
                    do {
                        uc = BZLib.getBit(state);

                        if (uc === 0) {
                            break;
                        }

                        uc = BZLib.getBit(state);

                        if (uc === 0) {
                            curr++;
                        } else {
                            curr--;
                        }
                    } while (true);

                    state.len[t][i] = curr & 0xff;
                }
            }

            for (let t = 0; t < nGroups; t++) {
                let minLen = 32;
                let maxLen = 0;

                for (let l1 = 0; l1 < alphaSize; l1++) {
                    if (state.len[t][l1] > maxLen) {
                        maxLen = state.len[t][l1];
                    }

                    if (state.len[t][l1] < minLen) {
                        minLen = state.len[t][l1];
                    }
                }

                BZLib.createDecodeTables(state.limit[t], state.base[t], state.perm[t], state.len[t], minLen, maxLen, alphaSize);
                state.minLens[t] = minLen;
            }

            let eob = state.nInUse + 1;
            let nblockMax = 100000 * state.blocksize100k;
            let groupNo = -1;
            let groupPos = 0;

            for (let i = 0; i <= 255; i++) {
                state.unzftab[i] = 0;
            }

            let kk = 4095; // MTFASIZE-1;

            for (let ii = 15; ii >= 0; ii--) {
                for (let jj = 15; jj >= 0; jj--) {
                    state.mtfa[kk] = (ii * 16 + jj) & 0xff;
                    kk--;
                }

                state.mtfbase[ii] = kk + 1;
            }

            let nblock = 0;

            // GETMTFVAL
            if (groupPos === 0) {
                groupNo++;
                groupPos = 50; // BZGSIZE
                let gSel = state.selector[groupNo];
                gMinLen = state.minLens[gSel];
                gLimit = state.limit[gSel];
                gPerm = state.perm[gSel];
                gBase = state.base[gSel];
            }

            groupPos--;
            let zn = gMinLen;
            let zvec = 0;
            let zj = 0;

            for (zvec = BZLib.getBits(zn, state); zvec > gLimit[zn]; zvec = zvec << 1 | zj) {
                zn++;
                zj = BZLib.getBit(state);
            }

            for (let nextSym = gPerm[zvec - gBase[zn]]; nextSym !== eob; ) {
                if (nextSym === 0 || nextSym === 1) { // BZRUNA, BZRUNB
                    let es = -1;
                    let N = 1;

                    do {
                        if (nextSym === 0) {
                            es += N;
                        } else if (nextSym === 1) {
                            es += 2 * N;
                        }

                        N *= 2;

                        // GETMTFVAL, y da fuk did they not subroutine this
                        if (groupPos === 0) {
                            groupNo++;
                            groupPos = 50;
                            let gSel = state.selector[groupNo];
                            gMinLen = state.minLens[gSel];
                            gLimit = state.limit[gSel];
                            gPerm = state.perm[gSel];
                            gBase = state.base[gSel];
                        }

                        groupPos--;
                        let zn_2 = gMinLen;
                        let zvec_2 = 0;
                        let zj_2 = 0;

                        for (zvec_2 = BZLib.getBits(zn_2, state); zvec_2 > gLimit[zn_2]; zvec_2 = zvec_2 << 1 | zj_2) {
                            zn_2++;
                            zj_2 = BZLib.getBit(state);
                        }

                        nextSym = gPerm[zvec_2 - gBase[zn_2]];
                    } while (nextSym === 0 || nextSym === 1);

                    es++;
                    uc = state.setToUnseq[state.mtfa[state.mtfbase[0]] & 0xff];
                    state.unzftab[uc & 0xff] += es;

                    for (; es > 0; es--) {
                        state.tt[nblock] = uc & 0xff;
                        nblock++;
                    }
                } else {
                    let nn = nextSym - 1;

                    if (nn < 16) { // MTFLSIZE
                        let pp = state.mtfbase[0];
                        uc = state.mtfa[pp + nn];

                        for (; nn > 3; nn -= 4) {
                            let z = pp + nn;
                            state.mtfa[z] = state.mtfa[z - 1];
                            state.mtfa[z - 1] = state.mtfa[z - 2];
                            state.mtfa[z - 2] = state.mtfa[z - 3];
                            state.mtfa[z - 3] = state.mtfa[z - 4];
                        }

                        for (; nn > 0; nn--) {
                            state.mtfa[pp + nn] = state.mtfa[(pp + nn) - 1];
                        }

                        state.mtfa[pp] = uc;
                    } else {
                        let lno = (nn / 16) | 0;
                        let off = nn % 16;
                        let pp = state.mtfbase[lno] + off;
                        uc = state.mtfa[pp];

                        for (; pp > state.mtfbase[lno]; pp--) {
                            state.mtfa[pp] = state.mtfa[pp - 1];
                        }

                        state.mtfbase[lno]++;

                        for (; lno > 0; lno--) {
                            state.mtfbase[lno]--;
                            state.mtfa[state.mtfbase[lno]] = state.mtfa[(state.mtfbase[lno - 1] + 16) - 1];
                        }

                        state.mtfbase[0]--;
                        state.mtfa[state.mtfbase[0]] = uc;

                        if (state.mtfbase[0] === 0) {
                            kk = 4095; // MTFASIZE - 1
                            for (let ii = 15; ii >= 0; ii--) {
                                for (let jj = 15; jj >= 0; jj--) {
                                    state.mtfa[kk] = state.mtfa[state.mtfbase[ii] + jj];
                                    kk--;
                                }

                                state.mtfbase[ii] = kk + 1;
                            }

                        }
                    }

                    state.unzftab[state.setToUnseq[uc & 0xff] & 0xff]++;
                    state.tt[nblock] = state.setToUnseq[uc & 0xff] & 0xff;
                    nblock++;

                    // GETMTFVAL here we go AGAIN
                    if (groupPos === 0) {
                        groupNo++;
                        groupPos = 50;
                        let gSel = state.selector[groupNo];
                        gMinLen = state.minLens[gSel];
                        gLimit = state.limit[gSel];
                        gPerm = state.perm[gSel];
                        gBase = state.base[gSel];
                    }

                    groupPos--;
                    let zn_2 = gMinLen;
                    let zvec_2 = 0;
                    let zj_2 = 0;

                    for (zvec_2 = BZLib.getBits(zn_2, state); zvec_2 > gLimit[zn_2]; zvec_2 = zvec_2 << 1 | zj_2) {
                        zn_2++;
                        zj_2 = BZLib.getBit(state);
                    }

                    nextSym = gPerm[zvec_2 - gBase[zn_2]];
                }
            }

            state.stateOutLen = 0;
            state.stateOutCh = 0;
            state.cftab[0] = 0;

            for (let i = 1; i <= 256; i++) {
                state.cftab[i] = state.unzftab[i - 1];
            }

            for (let i = 1; i <= 256; i++) {
                state.cftab[i] += state.cftab[i - 1];
            }

            for (let i = 0; i < nblock; i++) {
                uc = (state.tt[i] & 0xff);
                state.tt[state.cftab[uc & 0xff]] |= i << 8;
                state.cftab[uc & 0xff]++;
            }

            state.tpos = state.tt[state.origPtr] >> 8;
            state.nblockUsed = 0;
            state.tpos = state.tt[state.tpos];
            state.k0 = state.tpos & 0xff;
            state.tpos >>= 8;
            state.nblockUsed++;
            state.saveNblock = nblock;
            BZLib.nextHeader(state);
            goingandshit = state.nblockUsed === state.saveNblock + 1 && state.stateOutLen === 0;
        }
    }

    static getUChar(state) {
        return BZLib.getBits(8, state) & 0xff;
    }

    static getBit(state) {
        return BZLib.getBits(1, state) & 0xff;
    }

    static getBits(i, state) {
        let bits = 0;

        do {
            if (state.bsLive >= i) {
                let v = state.bsBuff >> state.bsLive - i & (1 << i) - 1;
                state.bsLive -= i;
                bits = v;
                break;
            }

            state.bsBuff = state.bsBuff << 8 | state.input[state.nextIn] & 0xff;
            state.bsLive += 8;
            state.nextIn++;
            state.availIn--;
            state.totalInLo32++;

            if (state.totalInLo32 === 0) {
                state.totalInHi32++;
            }
        } while (true);

        return bits;
    }

    static makeMaps(state) {
        state.nInUse = 0;

        for (let i = 0; i < 256; i++) {
            if (state.inUse[i]) {
                state.setToUnseq[state.nInUse] = i & 0xff;
                state.nInUse++;
            }
        }
    }

    static createDecodeTables(limit, base, perm, length, minLen, maxLen, alphaSize) {
        let pp = 0;

        for (let i = minLen; i <= maxLen; i++) {
            for (let j = 0; j < alphaSize; j++)
                if (length[j] === i) {
                    perm[pp] = j;
                    pp++;
                }
        }

        for (let i = 0; i < 23; i++) {
            base[i] = 0;
        }

        for (let i = 0; i < alphaSize; i++) {
            base[length[i] + 1]++;
        }

        for (let i = 1; i < 23; i++) {
            base[i] += base[i - 1];
        }

        for (let i = 0; i < 23; i++) {
            limit[i] = 0;
        }

        let vec = 0;

        for (let i = minLen; i <= maxLen; i++) {
            vec += base[i + 1] - base[i];
            limit[i] = vec - 1;
            vec <<= 1;
        }

        for (let i = minLen + 1; i <= maxLen; i++) {
            base[i] = (limit[i - 1] + 1 << 1) - base[i];
        }
    }    
}

module.exports = BZLib;