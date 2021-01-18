const colours = require('./_colours');

function drawDialogLogout() {
    this.surface.drawBox(126, 137, 260, 60, colours.black);
    this.surface.drawBoxEdge(126, 137, 260, 60, colours.white);
    this.surface.drawStringCenter('Logging out...', 256, 173, 5, colours.white);
}

module.exports = { drawDialogLogout };
