import './style.scss'
import SAMPLE from './sample.jpg'

const RESOLUTION = 2
const WIDTH = 360 * RESOLUTION
const HEIGHT = 180 * RESOLUTION
const STEP = 10
const DEG = Math.PI / 180;

let sourceImg = new Image(WIDTH, HEIGHT)
sourceImg.src = SAMPLE
sourceImg.onload = function () {
    let sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = sourceImg.width;
    sourceCanvas.height = sourceImg.height;
    let sourceCtx = sourceCanvas.getContext('2d')
    sourceCtx.drawImage(sourceImg, 0, 0, sourceImg.width, sourceImg.height);


    let targetCanvas = document.createElement('canvas')
    targetCanvas.className = 'viewport';
    document.body.appendChild(targetCanvas)
    const VIEW_WIDTH = targetCanvas.width
    const VIEW_HEIGHT = targetCanvas.height
    


    let targetCtx = targetCanvas.getContext('2d')
    let imageData = targetCtx.createImageData(VIEW_WIDTH, VIEW_HEIGHT);
    let pixelData = sourceCtx.getImageData(0, 0, VIEW_WIDTH, VIEW_HEIGHT)


    targetCtx.putImageData(pixelData, 0, 0);

    let origin = {
        x: 0,
        y: 0
    }
    
    function move(deltaX, deltaY) {
        origin.x += deltaX
        origin.y += deltaY
        if (origin.x < 0) {
            origin.x += WIDTH * 10
        }
        if (origin.y < 0) {
            origin.y += HEIGHT * 10
        }

        origin.x = origin.x % WIDTH
        origin.y = origin.y % HEIGHT
        renderAtOrigin(origin.x, origin.y)
        
    }


    function renderAtOrigin (x, y) {
        if (y <= HEIGHT - VIEW_HEIGHT) {
            if (x <= WIDTH - VIEW_WIDTH) {
                let imageData = sourceCtx.getImageData(x, y, VIEW_WIDTH, VIEW_HEIGHT)
                targetCtx.putImageData(imageData, 0, 0);
                return;
            }

            if (x > WIDTH - VIEW_WIDTH) {
                let block1Width = WIDTH - x
                let block2Width = WIDTH + VIEW_WIDTH - x
                let block1 = sourceCtx.getImageData(x, y, block1Width, VIEW_HEIGHT)
                let block2 = sourceCtx.getImageData(0, y, block2Width, VIEW_HEIGHT)
                targetCtx.putImageData(block1, 0, 0);
                targetCtx.putImageData(block2, block1Width, 0);
                return;
            }
        }

        if (y > HEIGHT - VIEW_HEIGHT) {
            if (x <= WIDTH - VIEW_WIDTH) {
                let block1Height = HEIGHT - y
                let block2Height = VIEW_HEIGHT - block1Height
                let block2X = (x + WIDTH / 2) % WIDTH
                let block2Y = HEIGHT -  block2Height
                let block1 = sourceCtx.getImageData(x, y, VIEW_WIDTH, block1Height)
                let block2 = sourceCtx.getImageData(block2X, block2Y, VIEW_WIDTH, block2Height)

                // block2 需要顺时针转 180 度
                let canvas = document.createElement('canvas')
                let ctx = canvas.getContext('2d')
                let convertedBlock2 = ctx.createImageData(VIEW_WIDTH, block2Height)
                for (let y = 0; y < block2Height; y++) {
                    for (let x = 0; x < VIEW_WIDTH; x++) {
                        let index = y * VIEW_WIDTH * 4 + x * 4
                        let mappingX = VIEW_WIDTH - 1 - x
                        let mappingY = block2Height -1 - y
                        let mappingIndex = mappingY * VIEW_WIDTH * 4 + mappingX * 4
                        convertedBlock2.data[index] = block2.data[mappingIndex]
                        convertedBlock2.data[index + 1] = block2.data[mappingIndex + 1]
                        convertedBlock2.data[index + 2] = block2.data[mappingIndex + 2]
                        convertedBlock2.data[index + 3] = block2.data[mappingIndex + 3]
                        
                    }
                }
                targetCtx.putImageData(block1, 0, 0);
                targetCtx.putImageData(convertedBlock2, 0, block1Height);
                return;
            }


            // 有4个方块需要拼接
            if (x > WIDTH - VIEW_WIDTH) {
                let x1 = x, y1 = y;
                let w1 = WIDTH - x
                let h1 = HEIGHT - y
                let block1 = sourceCtx.getImageData(x1, y1, w1, h1)
                let x2 = 0, y2 = y;
                let w2 = VIEW_WIDTH - w1, h2 = h1;
                let block2 = sourceCtx.getImageData(x2, y2, w2, h2)
                let x3 = (x1 + WIDTH / 2) % WIDTH
                let y3 = HEIGHT + h1 - VIEW_HEIGHT;
                let w3 = w1, h3 = VIEW_HEIGHT - h1;
                let block3 = sourceCtx.getImageData(x3, y3, w3, h3)
                let x4 = WIDTH / 2, y4 = y3, w4 = w2 , h4 = h3;
                let block4 = sourceCtx.getImageData(x4, y4, w4, h4)


                // 先合并 block3 和 block4， 然后再作顺时针变换 180 度

                let can1 = document.createElement('canvas')
                can1.width = w3 + w4
                can1.height = h3
                let ctx1 = can1.getContext('2d')
                ctx1.putImageData(block3, 0, 0)
                ctx1.putImageData(block4, w3, 0)
                let mergeData =  ctx1.getImageData(0, 0, w3 + w4, h3)
                let mergeWidth = w3 + w4
                let mergeHeight = h3

                
            

                // block3 需要顺时针转 180 度
                let canvas = document.createElement('canvas')
                let ctx = canvas.getContext('2d')
                let convertedBlock = ctx.createImageData(mergeWidth, mergeHeight)
                for (let y = 0; y < mergeHeight; y++) {
                    for (let x = 0; x < mergeWidth; x++) {
                        let index = y * mergeWidth * 4 + x * 4
                        let mappingX = mergeWidth - 1 - x
                        let mappingY = mergeHeight - 1 - y
                        let mappingIndex = mappingY * mergeWidth * 4 + mappingX * 4
                        convertedBlock.data[index] = mergeData.data[mappingIndex]
                        convertedBlock.data[index + 1] = mergeData.data[mappingIndex + 1]
                        convertedBlock.data[index + 2] = mergeData.data[mappingIndex + 2]
                        convertedBlock.data[index + 3] = mergeData.data[mappingIndex + 3]

                    }
                }




                targetCtx.putImageData(block1, 0, 0)
                targetCtx.putImageData(block2, w1, 0)
                targetCtx.putImageData(convertedBlock, 0, h1)

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








