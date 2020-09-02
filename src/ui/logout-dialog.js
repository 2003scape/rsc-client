const BLACK = 0;
const WHITE = 0xffffff;

function drawDialogLogout() {
    this.surface.drawBox(126, 137, 260, 60, BLACK);
    this.surface.drawBoxEdge(126, 137, 260, 60, WHITE);
    this.surface.drawStringCenter('Logging out...', 256, 173, 5, WHITE);
}

module.exports = { drawDialogLogout };
