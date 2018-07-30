export default class ImageData {
    constructor (data, width, height, viewData, viewWidth, viewHeight) {
        this.data = data
        this.WIDTH = width
        this.HEIGHT = height
        this.viewData = viewData
        this.VIEW_WIDTH = viewWidth
        this.VIEW_HEIGHT = viewHeight
    }

    getData (x, y) {
        this.fillData(x, y)
        return this.viewData
    }


    fillData(x1, y1) {
        for (let y = 0; y < this.VIEW_HEIGHT; y++) {
            for (let x = 0; x < this.VIEW_WIDTH; x++) {
                let index = y * this.VIEW_WIDTH * 4 + x * 4
                let targetIndex = this.findPointIndex(x1, y1, x, y)
                this.viewData.data[index] = this.data.data[targetIndex]
                this.viewData.data[index + 1] = this.data.data[targetIndex + 1]
                this.viewData.data[index + 2] = this.data.data[targetIndex + 2]
                this.viewData.data[index + 3] = this.data.data[targetIndex + 3]
            }
        } 
    }

    findPointIndex (x1, y1, x2, y2) {
        let targetIndex = 0
        if (x1 < this.WIDTH - this.VIEW_WIDTH && x1 >= 0) {
            if (y1 >= 0 && y1 < this.HEIGHT - this.VIEW_HEIGHT) {
                return targetIndex = ((y1 + y2) * this.WIDTH * 4) + ((x1 + x2) * 4)
            }
        }
    }

}