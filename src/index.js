import './style.scss'
import SAMPLE from './sample.jpg'

const RESOLUTION = 3
const WIDTH = 360 * RESOLUTION
const HEIGHT = 180 * RESOLUTION
const VIEW_WIDTH = 60 * RESOLUTION
const VIEW_HEIGHT = 60 * RESOLUTION
const STEP = 10

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
        origin.x = origin.x % WIDTH
        origin.y = origin.y % HEIGHT
        let imageData = calcImageData(origin.x, origin.y)
        targetCtx.putImageData(imageData, 0, 0);
    }


    function calcImageData (x, y) {
        return sourceCtx.getImageData(x, y, VIEW_WIDTH, VIEW_HEIGHT)
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








