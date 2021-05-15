const bulk = require('bulk-require');

function getPacketHandlers(mudclient) {
    const handlers = bulk(__dirname, ['*.js']);
    const packetMap = {};

    for (const [handlerName, handlerMap] of Object.entries(handlers)) {
        if (/^_|index/.test(handlerName)) {
            continue;
        }

        for (const [id, handler] of Object.entries(handlerMap)) {
            packetMap[id] = handler.bind(mudclient);
        }
    }

    return packetMap;
}

module.exports = getPacketHandlers;
