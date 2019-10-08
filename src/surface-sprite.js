const Surface = require('./surface');

class SurfaceSprite extends Surface {
    constructor(width, height, limit, component) {
        super(width, height, limit, component);
        this.mudclientref = null;
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
}

module.exports = SurfaceSprite;