import './style.scss'
import React from 'react'
import PropTypes from 'prop-types'
import ImageData from './ImageData'


const VALID_HORIZONTAL_VIEWPORT = 120
const VALID_VERTICAL_VIEWPORT = 60


export default class PanoramicViewer extends React.Component {
    static propTypes = {
        imageUrl: PropTypes.string,
    }

    constructor (props) {
        super(props)
        this.imageLoad = this.imageLoad.bind(this)
        this.handleMousemove = this.handleMousemove.bind(this)
        this.handleTouchmove = this.handleTouchmove.bind(this)
        this.handleTouchstart = this.handleTouchstart.bind(this)
        this.x = 0
        this.y = 0
        this.imageData = null
        this.ctx = null
        this.touchX = 0
        this.touchY = 0
        this.state = {
            IMAGE_WIDTH: 0,
            IMAGE_HEIGHT: 0,
            VIEW_WIDTH: 0,
            VIEW_HEIGHT: 0
        }
    }

    componentDidMount () {
        this.refs.sourceImage.addEventListener('load', this.imageLoad)
        this.refs.viewport.addEventListener('mousemove', this.handleMousemove)
        this.refs.viewport.addEventListener('touchmove', this.handleTouchmove)
        this.refs.viewport.addEventListener('touchstart', this.handleTouchstart)
    }

    imageLoad () {
        const {sourceImage, sourceCanvas, viewport} = this.refs
        const IMAGE_WIDTH = sourceImage.width
        const IMAGE_HEIGHT = sourceImage.height       
        const VIEW_WIDTH = Math.floor(IMAGE_WIDTH * VALID_HORIZONTAL_VIEWPORT / 360)
        const VIEW_HEIGHT = Math.floor(IMAGE_HEIGHT * VALID_VERTICAL_VIEWPORT / 180)
        this.x = Math.floor((IMAGE_WIDTH - VIEW_WIDTH)/2)
        this.y = Math.floor((IMAGE_HEIGHT - VIEW_HEIGHT)/2)
        console.log(`IMAGE_WIDTH: ${IMAGE_WIDTH};IMAGE_HEIGHT:${IMAGE_HEIGHT}`)
        console.log(`VIEW_WIDTH: ${VIEW_WIDTH};VIEW_HEIGHT:${VIEW_HEIGHT}`)      
        console.log(`x: ${this.x}; y:${this.y}`)

        this.setState({
            IMAGE_WIDTH: IMAGE_WIDTH,
            IMAGE_HEIGHT: IMAGE_HEIGHT,
            VIEW_WIDTH: VIEW_WIDTH,
            VIEW_HEIGHT: VIEW_HEIGHT
        })

        // 由于必须要设置canvas的宽度和高度，但是在微信小程序中
        // 不能直接操作DOM，只能通过修改vm，让DOM发生变化.
        // 所以需要将初始化过程分为两步执行
        
        setTimeout(() => {
            const {IMAGE_WIDTH, IMAGE_HEIGHT, VIEW_WIDTH, VIEW_HEIGHT} = this.state
            const ctx = sourceCanvas.getContext('2d')
            ctx.drawImage(sourceImage, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT)
            const data = ctx.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT)      
            this.ctx = viewport.getContext('2d')
            const viewData = this.ctx.createImageData(VIEW_WIDTH, VIEW_HEIGHT)
            this.imageData = new ImageData(
                data, 
                IMAGE_WIDTH, 
                IMAGE_HEIGHT, 
                viewData, 
                VIEW_WIDTH,
                VIEW_HEIGHT
            )
            this.repaint()
        }, 0)       
    }

    handleTouchstart (e) {
        const { clientX, clientY } = e.changedTouches[0]
        this.touchX = clientX
        this.touchY = clientY
        e.preventDefault()
    }

    handleTouchmove (e) {
        const { IMAGE_WIDTH, IMAGE_HEIGHT, VIEW_WIDTH, VIEW_HEIGHT } = this.state
        if (IMAGE_WIDTH <= 0 || IMAGE_HEIGHT <= 0) {
            console.log('image is not loaded.')
            return;
        }
        const { clientX, clientY } = e.changedTouches[0]
        
        let moveX = clientX - this.touchX
        let moveY = clientY - this.touchY

        
        this.x += moveX
        this.y += moveY
        this.x = limitX(this.x, IMAGE_WIDTH)
        this.y = limitY(this.y, IMAGE_HEIGHT, VIEW_HEIGHT)
        this.repaint()
        this.touchX = clientX
        this.touchY = clientY
        e.preventDefault()
    
    }


    handleMousemove (ev) {
        let {movementX, movementY} = ev
        const {IMAGE_WIDTH, IMAGE_HEIGHT, VIEW_WIDTH, VIEW_HEIGHT} = this.state
        if (IMAGE_WIDTH <= 0 || IMAGE_HEIGHT <= 0) {
            console.log('image is not loaded.')
            return;
        }
        if (ev.which !== 0) {         
            this.x += movementX
            this.y += movementY
            this.x = limitX(this.x, IMAGE_WIDTH)
            this.y = limitY(this.y, IMAGE_HEIGHT, VIEW_HEIGHT)
            this.repaint()
        }
    }

    repaint () {
        const data = this.imageData.getDataAt(this.x, this.y)
        this.ctx.putImageData(data, 0, 0)
    }

    render () {
        let {IMAGE_WIDTH, IMAGE_HEIGHT, VIEW_WIDTH, VIEW_HEIGHT} = this.state
        return (
          <div className="panoramic-viewer">
            <img ref="sourceImage" className="source-image" src={this.props.imageUrl}/>
            <canvas 
              ref="sourceCanvas" 
              className="source-canvas"
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
            />
            <canvas 
              ref="viewport" 
              className="viewport"
              width={VIEW_WIDTH}
              height={VIEW_HEIGHT}
            />
          </div>
        )
    }
}


function limitX (x, WIDTH) {
    if (x < 0 ) {
        return limitX(x + WIDTH, WIDTH)
    } else if (x >= WIDTH) {
        return x % WIDTH
    } else {
        return x
    }
}

function limitY (y, HEIGHT, VIEW_HEIGHT) {
    if (y > HEIGHT - Math.floor(VIEW_HEIGHT /2)) {
        return HEIGHT - Math.floor(VIEW_HEIGHT / 2)
    } else if (y < -Math.floor(VIEW_HEIGHT/2)) {
        return -Math.floor(VIEW_HEIGHT / 2)
    } else {
        return y
    }
}