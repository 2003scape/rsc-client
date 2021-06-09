clang ./src/c/index.c \
    --target=wasm32 \
    --optimize=3 \
    -nostdlib \
    -Wl,--export-all \
    -Wl,--no-entry \
    -Wl,--allow-undefined \
    -Wl,-z,stack-size=$[48 * 1024 * 1024] \
    --output ./dist/index.bundle.wasm
