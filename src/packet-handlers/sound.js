const serverOpcodes = require('../opcodes/server');

function fromCharArray(a) {
    return Array.from(a)
        .map((c) => String.fromCharCode(c))
        .join('');
}

module.exports = {
    [serverOpcodes.SOUND]: function (data, size) {
        const soundName = fromCharArray(data.slice(1, size));
        this.playSoundFile(soundName);
    }
};
