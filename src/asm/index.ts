export function add(a: i32, b: i32): i32 {
    return a + b;
}

export function rgbToRGBA(
    area: u32,
    rgb: Uint8Array
): void  {
    for (let i: u32 = 0; i < area; i += 4) {
        /*const pixel = unchecked(rgb[i / 4]);

        unchecked(rgba[i] = (pixel >> 16) & 255);
        unchecked(rgba[i + 1] = (pixel >> 8) & 255);
        unchecked(rgba[i + 2] = pixel & 255);
        unchecked(rgba[i + 3] = 255);*/

        const blue = unchecked(rgb[i]);

        unchecked(rgb[i] = rgb[i + 2]);
        unchecked(rgb[i + 2] = blue);
        unchecked(rgb[i + 3] = 255);
    }
}

export const Int32Array_ID = idof<Int32Array>();
export const Uint8Array_ID = idof<Uint8Array>();
