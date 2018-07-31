export default class ImageData {
    constructor (data, width, height, viewData, viewWidth, viewHeight) {
        this.sourceData = data
        this.WIDTH = width
        this.HEIGHT = height
        this.viewData = viewData
        this.VIEW_WIDTH = viewWidth
        this.VIEW_HEIGHT = viewHeight
    }

    getDataAt (x, y) {
        this.fillDataAt(x, y)
        return this.viewData
    }

    fillDataAt(x1, y1) {
        for (let y = 0; y < this.VIEW_HEIGHT; y++) {
            for (let x = 0; x < this.VIEW_WIDTH; x++) {
                let index = y * this.VIEW_WIDTH * 4 + x * 4
                let targetIndex = this.findPointIndex(x1 + x, y1 + y)
                this.viewData.data[index] = this.sourceData.data[targetIndex]
                this.viewData.data[index + 1] = this.sourceData.data[targetIndex + 1]
                this.viewData.data[index + 2] = this.sourceData.data[targetIndex + 2]
                this.viewData.data[index + 3] = this.sourceData.data[targetIndex + 3]
            }
        } 
    }

    findPointIndex (x, y) {
        let targetIndex = 0
        if (y >= this.HEIGHT) {
            y = 2 * this.HEIGHT - y
            x = x + Math.floor(this.WIDTH / 2)
        } else if (y < 0) {
            y = -y
            x = x + Math.floor(this.WIDTH /2)
        }
        if (x > this.WIDTH) {
            x = x - this.WIDTH
        }     
        return targetIndex = (y * this.WIDTH * 4) + x * 4
    }

}