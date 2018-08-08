const VALID_VIEWPORT_ANGLE = 120

export function limitX (x, WIDTH) {
    if (x < 0 ) {
        return limitX(x + WIDTH, WIDTH)
    } else if (x >= WIDTH) {
        return x % WIDTH
    } else {
        return x
    }
}

export function limitY (y, HEIGHT, VIEW_HEIGHT) {
    if (y > HEIGHT - Math.floor(VIEW_HEIGHT /2)) {
        return HEIGHT - Math.floor(VIEW_HEIGHT / 2)
    } else if (y < -Math.floor(VIEW_HEIGHT/2)) {
        return -Math.floor(VIEW_HEIGHT / 2)
    } else {
        return y
    }
}

export function calcViewSize (IMAGE_WIDTH, IMAGE_HEIGHT, sceenWidth, sceenHeight) {
    const ratio = sceenWidth / sceenHeight
    const MAX_LEN = Math.floor(IMAGE_WIDTH * VALID_VIEWPORT_ANGLE / 360)
    let width = MAX_LEN, height = MAX_LEN
    if (ratio > 1) {
        height = Math.floor(width / ratio)
    } else if (ratio < 1) {
        width = Math.floor(height * ratio)
    }
    return {
        width,
        height
    }
}