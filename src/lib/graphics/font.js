class Font {
    constructor(name, type, size) {
        this.name = name;
        this.type = type;
        this.size = size;
    }

    toCanvasFont() {
        return `${this.getType()} ${this.size}px ${this.name}`;
    }

    getType(){
        if (this.type === 1) {
            return 'bold';
        } else if (this.type === 2) {
            return 'italic';
        }

        return 'normal';
    }
}

module.exports = Font;