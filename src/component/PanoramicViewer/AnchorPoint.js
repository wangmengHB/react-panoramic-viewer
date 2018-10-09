

export default class AnchorPoint {

    // x, y 表示球面坐标系的 维度 和 精度， 最大值为 1

    constructor (x, y, content, nextUrl, nextAnchors, renderNext) {
        this.x = x;
        this.y = y;
        this.content = content;

        this.nextUrl = nextUrl;
        this.nextAnchors = nextAnchors || [];
        this.renderNext = renderNext;

        this.IMAGE_WIDTH = 0;
        this.IMAGE_HEIGHT = 0;
        this.VIEW_WIDTH = 0;
        this.VIEW_HEIGHT = 0;

        this.static_x = 0;
        this.static_y = 0;

    }

    createAnchorElement (IMAGE_WIDTH, IMAGE_HEIGHT, VIEW_WIDTH, VIEW_HEIGHT) {
        const ele = document.createElement('div');
        ele.className = "label";
        ele.innerText = this.content;

        this.IMAGE_WIDTH = IMAGE_WIDTH;
        this.IMAGE_HEIGHT = IMAGE_HEIGHT;
        this.VIEW_WIDTH = VIEW_WIDTH;
        this.VIEW_HEIGHT = VIEW_HEIGHT;

        this.static_x = this.IMAGE_WIDTH * this.x;
        this.static_y = this.IMAGE_HEIGHT * this.y;

        this.ele = ele;

        ele.addEventListener('click', () => {
            this.renderNext(this.nextUrl, this.nextAnchors);
        })


        return ele;
    }

    moveAt (current_x, current_y) {
        if (this.IMAGE_WIDTH - current_x < this.VIEW_WIDTH/3) {
            current_x = -(this.IMAGE_WIDTH - current_x)
        }

        let percentY = (this.static_y - (current_y - this.VIEW_HEIGHT/2)) / this.VIEW_HEIGHT * 100;
        let percentX = (this.static_x - (current_x - this.VIEW_WIDTH/2)) / this.VIEW_WIDTH * 100;
        
        this.ele.style.top = `${percentY}%`;
        this.ele.style.left = `${percentX}%`;
    }
}