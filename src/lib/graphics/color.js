class Color {
    constructor(r, g, b, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toCanvasStyle() {
        return `rgba(${this.r},${this.g}, ${this.b}, ${this.a})`;
    }
}

Color.white = new Color(255, 255, 255);
Color.WHITE = Color.white;

Color.lightGray = new Color(192, 192, 192);
Color.LIGHT_GRAY = Color.lightGray;

Color.gray = new Color(128, 128, 128);
Color.GRAY = Color.gray;

Color.darkGray = new Color(64, 64, 64);
Color.DARK_GRAY = Color.darkGray;

Color.black = new Color(0, 0, 0);
Color.BLACK = Color.black;

Color.red = new Color(255, 0, 0);
Color.RED = Color.red;

Color.pink = new Color(255, 175, 175);
Color.PINK = Color.pink;

Color.orange = new Color(255, 200, 0);
Color.ORANGE = Color.orange;

Color.yellow = new Color(255, 255, 0);
Color.YELLOW = Color.yellow;

Color.green = new Color(0, 255, 0);
Color.GREEN = Color.green;

Color.magenta = new Color(255, 0, 255);
Color.MAGENTA = Color.magenta;

Color.cyan = new Color(0, 255, 255);
Color.CYAN = Color.cyan;

Color.blue = new Color(0, 0, 255);
Color.BLUE = Color.blue;

module.exports = Color;