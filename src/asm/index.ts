export function add(a: i32, b: i32): i32 {
    return a + b;
}

export function fixPixels(
    area: u32,
    pixels: Int32Array,
    canvasPixels: Uint8Array
): void  {
    for (let i: u32 = 0; i < area; i += 4) {
        const pixel = unchecked(pixels[i / 4]);

        unchecked(canvasPixels[i] = (pixel >> 16) & 255);
        unchecked(canvasPixels[i + 1] = (pixel >> 8) & 255);
        unchecked(canvasPixels[i + 2] = pixel & 255);
        unchecked(canvasPixels[i + 3] = 255);
    }
}

export const Int32Array_ID = idof<Int32Array>();
export const Uint8Array_ID = idof<Uint8Array>();
