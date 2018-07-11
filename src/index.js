import './style.scss'
import SAMPLE from './sample.jpg'

const RESOLUTION = 2
const WIDTH = 840
const HEIGHT = 420
const STEP = 11
const DEG = Math.PI / 180;



let sourceImg = new Image(WIDTH, HEIGHT)
sourceImg.src = SAMPLE
sourceImg.onload = function () {
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = sourceImg.width;
    sourceCanvas.height = sourceImg.height;
    const sourceCtx = sourceCanvas.getContext('2d')
    sourceCtx.drawImage(sourceImg, 0, 0, sourceImg.width, sourceImg.height);


    let targetCanvas = document.createElement('canvas')
    targetCanvas.className = 'viewport';
    document.body.appendChild(targetCanvas)
    const VIEW_WIDTH = targetCanvas.width
    const VIEW_HEIGHT = targetCanvas.height
    const MIN_VIEW_HEIGHT = -VIEW_HEIGHT/2 - 50
    const MAX_VIEW_HEIGHT = HEIGHT
    
    const targetCtx = targetCanvas.getContext('2d')
    
    // x: 540; y: -75
    // 150; y: 327.5
    let origin = {
        x: 150,
        y: 250,
    }

    move(0, 0)
    
    function move(deltaX, deltaY) {
        origin.x += deltaX
        origin.y += deltaY
        if (origin.x < 0) {
            origin.x += (WIDTH * 10)
        }
        origin.x = origin.x % WIDTH
        if (origin.y < MIN_VIEW_HEIGHT) {
            origin.y = MIN_VIEW_HEIGHT
        } else if (origin.y > MAX_VIEW_HEIGHT) {
            origin.y = MAX_VIEW_HEIGHT
        }
        console.log(`x: ${origin.x}; y: ${origin.y}`)
        renderAtOrigin(origin.x, origin.y)
        
    }


    function renderAtOrigin (x, y) {
        if (x <= WIDTH - VIEW_WIDTH) {
            if (y >= MIN_VIEW_HEIGHT && y <= 0) {
                let block1, block2
                let x1 = (x + WIDTH / 2) % WIDTH, y1 = 0, w1 = VIEW_WIDTH, h1 = -y
                let x2 = x, y2 = 0, w2 = VIEW_WIDTH, h2 = VIEW_HEIGHT - h1
                block1 = getCrossAxisXBlockImageData(x1, y1, w1, h1, WIDTH, sourceCtx)

                // block1 需要做镜像
                block1 = mirrorImageDataAtAxisY(block1, w1, h1)
                block2 = sourceCtx.getImageData(x2, y2, w2, h2)

                targetCtx.putImageData(block1, 0, 0)
                targetCtx.putImageData(block2, 0, h1)
                return

            }

            if (y > 0 && y < HEIGHT - VIEW_HEIGHT) {            
                let imageData = sourceCtx.getImageData(x, y, VIEW_WIDTH, VIEW_HEIGHT)
                targetCtx.putImageData(imageData, 0, 0);
                return;
            }

            if (y > HEIGHT - VIEW_HEIGHT && y <= HEIGHT) {
                let x1 = x, y1 = y, w1 = VIEW_WIDTH, h1 = HEIGHT - y
                let x2 = (x + WIDTH / 2) % WIDTH, y2 = HEIGHT + h1 - VIEW_HEIGHT, w2 = VIEW_WIDTH, h2 = VIEW_HEIGHT - h1
                let block1, block2
                block2 = getCrossAxisXBlockImageData(x2, y2, w2, h2, WIDTH, sourceCtx)
                block1 = sourceCtx.getImageData(x1, y1, w1, h1)
                
                // block2 在Y轴上做镜像翻转
                block2 = mirrorImageDataAtAxisY(block2, w2, h2)

                targetCtx.putImageData(block1, 0, 0);
                targetCtx.putImageData(block2, 0, h1);
                return;
            }

        }


             

            
        

        if (x > WIDTH - VIEW_WIDTH) {
            if (y >= MIN_VIEW_HEIGHT && y <= 0) {
                let block1, block2, block3, block4
                let x1 = (x + WIDTH / 2) % WIDTH, y1 = 0, w1 = WIDTH - x, h1 = -y;
                let x2 = (WIDTH / 2), y2 = 0, w2 = VIEW_WIDTH - w1, h2 = h1
                block1 = sourceCtx.getImageData(x1, y1, w1, h1)
                block2 = sourceCtx.getImageData(x2, y2, w2, h2)
                let stitchWidth = VIEW_WIDTH
                let stitchHeight = h1
                let stitchBlock = stitchImageData(block1, w1, h1, block2, w2, h2)
                // 镜像
                stitchBlock = mirrorImageDataAtAxisY(stitchBlock, stitchWidth, stitchHeight)
                let x3 = x, y3 = 0, w3 = WIDTH - x, h3 = VIEW_HEIGHT - h1
                let x4 = 0, y4 = 0, w4 = VIEW_WIDTH - w3, h4 = h3
                block3 = sourceCtx.getImageData(x3, y3, w3, h3)
                block4 = sourceCtx.getImageData(x4, y4, w4, h4)



                targetCtx.putImageData(stitchBlock, 0, 0)
                targetCtx.putImageData(block3, 0, h1)
                targetCtx.putImageData(block4, w3, h1)

                return
            }
            

            if (y > 0 && y < HEIGHT - VIEW_HEIGHT) {
                let block1Width = WIDTH - x
                let block2Width = WIDTH + VIEW_WIDTH - x
                let block1 = sourceCtx.getImageData(x, y, block1Width, VIEW_HEIGHT)
                let block2 = sourceCtx.getImageData(0, y, block2Width, VIEW_HEIGHT)
                targetCtx.putImageData(block1, 0, 0);
                targetCtx.putImageData(block2, block1Width, 0);
                return;
            }

            if (y > HEIGHT - VIEW_HEIGHT && y <= HEIGHT) {
                let x1 = x, y1 = y, w1 = WIDTH - x, h1 = HEIGHT - y
                let block1 = sourceCtx.getImageData(x1, y1, w1, h1)
                let x2 = 0, y2 = y, w2 = VIEW_WIDTH - w1, h2 = h1;
                let block2 = sourceCtx.getImageData(x2, y2, w2, h2)
                let x3 = (x1 + WIDTH / 2) % WIDTH, y3 = HEIGHT + h1 - VIEW_HEIGHT, w3 = w1, h3 = VIEW_HEIGHT - h1;
                // todo: 需要检查block3 是否是由两块组成，更为安全，这里省略了
                let block3 = sourceCtx.getImageData(x3, y3, w3, h3)
                let x4 = WIDTH / 2, y4 = y3, w4 = w2 , h4 = h3;
                let block4 = sourceCtx.getImageData(x4, y4, w4, h4)


                // 先合并 block3 和 block4， 然后在作Y轴镜像
                let stitchWidth = w3 + w4, stitchHeight = h3
                let stitchBlock = stitchImageData(block3, w3, h3, block4, w4, h4)

                let finalBlock = mirrorImageDataAtAxisY(stitchBlock, stitchWidth, stitchHeight)


                targetCtx.putImageData(block1, 0, 0)
                targetCtx.putImageData(block2, w1, 0)
                targetCtx.putImageData(finalBlock, 0, h1)

                return;
            }

            
        }




        






        
    }




    
    
    document.addEventListener('keydown', function(ev) {
        switch (ev.keyCode) {
            // key: up
            case 38:
                move(0, -STEP)
                break
            // key: down
            case 40:
                move(0, STEP)
                break
            // key: left
            case 37:
                move(-STEP, 0)
                break
            // key: right
            case 39:
                move(STEP, 0)
                break
    
        }
    })

}


function getCrossAxisXBlockImageData (x, y, w, h, WIDTH, sourceCtx) {
    let block
    if (x + w > WIDTH) {
        let x1 = x, y1 = y, w1 = WIDTH - x, h1 = h
        let x2 = 0, y2 = y, w2 = w - w1, h2 = h
        let sub1 = sourceCtx.getImageData(x1, y1, w1, h1)
        let sub2 = sourceCtx.getImageData(x2, y2, w2, h2)
        block = stitchImageData(sub1, w1, h1, sub2, w2, h2)
    } else {
        block = sourceCtx.getImageData(x, y, w, h)
    }
    return block
}



function mirrorImageDataAtAxisY (sourceImageData, width, height) {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    let imageData = ctx.createImageData(width, height)
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let index = y * width * 4 + x * 4
            let mappingX = x
            let mappingY = height -1 - y
            let mappingIndex = mappingY * width * 4 + mappingX * 4
            imageData.data[index] = sourceImageData.data[mappingIndex]
            imageData.data[index + 1] = sourceImageData.data[mappingIndex + 1]
            imageData.data[index + 2] = sourceImageData.data[mappingIndex + 2]
            imageData.data[index + 3] = sourceImageData.data[mappingIndex + 3]
            
        }
    }
    return imageData
}


function stitchImageData(source1, w1, h1, source2, w2, h2) {
    let canvas = document.createElement('canvas')
    canvas.width = w1 + w2
    canvas.height = h1
    let ctx = canvas.getContext('2d')
    ctx.putImageData(source1, 0, 0)
    ctx.putImageData(source2, w1, 0)
    let mergeData =  ctx.getImageData(0, 0, w1 + w2, h1)
    return mergeData
}


class Block {
    constructor(x, y, w, h, mirror = false) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.mirror = mirror
    }
}






