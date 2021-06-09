void rgbToRGBA(int area, unsigned char* rgb) {
    for (int i = 0; i < area; i += 4) {
        unsigned char blue = rgb[i];
        rgb[i] = rgb[i + 2];
        rgb[i + 2] = blue;
        rgb[i + 3] = 255;
    }
}
