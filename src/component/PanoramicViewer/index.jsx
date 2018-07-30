import './style.scss'
import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import ImageData from './ImageData'


const VALID_HORIZONTAL_VIEWPORT = 120
const VALID_VERTICAL_VIEWPORT = 60


export default class PanoramicViewer extends React.Component {
    static propTypes = {
        src: PropTypes.string,
    }

    constructor (props) {
        super(props)
        this.imageLoad = this.imageLoad.bind(this)
        this.handMousemove = this.handMousemove.bind(this)
        this.IMAGE_WIDTH = 0
        this.IMAGE_HEIGHT = 0
        this.VIEW_WIDTH = 0
        this.VIEW_HEIGHT = 0
        this.x = 0
        this.y = 0
        this.imageData = null
        this.ctx = null
    }

    componentDidMount () {
        this.refs.sourceImage.addEventListener('load', this.imageLoad)
        this.refs.viewport.addEventListener('mousemove', this.handMousemove)
    }

    imageLoad () {
        const {sourceImage, sourceData, viewport} = this.refs
        sourceData.width = sourceImage.width
        sourceData.height = sourceImage.height
        this.IMAGE_WIDTH = sourceImage.width
        this.IMAGE_HEIGHT = sourceImage.height
        console.log(`IMAGE_WIDTH: ${this.IMAGE_WIDTH};IMAGE_HEIGHT:${this.IMAGE_HEIGHT}`)
        viewport.width = this.VIEW_WIDTH = Math.floor(this.IMAGE_WIDTH * VALID_HORIZONTAL_VIEWPORT / 360)
        viewport.height = this.VIEW_HEIGHT = Math.floor(this.IMAGE_HEIGHT * VALID_VERTICAL_VIEWPORT / 180)
        console.log(`VIEW_WIDTH: ${this.VIEW_WIDTH};VIEW_HEIGHT:${this.VIEW_HEIGHT}`)
        this.x = Math.floor((this.IMAGE_WIDTH - this.VIEW_WIDTH)/2)
        this.y = Math.floor((this.IMAGE_HEIGHT - this.VIEW_HEIGHT)/2)
        console.log(`x: ${this.x}; y:${this.y}`)
        const ctx = sourceData.getContext('2d')
        ctx.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height)
        const data = ctx.getImageData(0, 0, sourceImage.width, sourceImage.height)      
        this.ctx = viewport.getContext('2d')
        const viewData = this.ctx.createImageData(this.VIEW_WIDTH, this.VIEW_HEIGHT)
        this.imageData = new ImageData(
            data, 
            sourceImage.width, 
            sourceImage.height, 
            viewData, 
            this.VIEW_WIDTH,
            this.VIEW_HEIGHT
        )
        this.repaint()

    }


    handMousemove (ev) {
        let {movementX, movementY} = ev
        if (ev.which !== 0) {         
            this.x += movementX
            this.y += movementY

            this.x = limitX(this.x, this.IMAGE_WIDTH)
            
            this.repaint()
        }
    }

    repaint () {
        const view = this.imageData.getData(this.x, this.y)
        this.ctx.putImageData(view, 0, 0)
    }

    render () {
        return (
          <div className="panoramic-viewer">
            <img ref="sourceImage" className="source-image" src={this.props.src}/>
            <canvas ref="sourceData" className="source-canvas"/>
            <canvas ref="viewport" className="viewport"/>
          </div>
        )
    }
}


function limitX (x, WIDTH) {
    debugger;
    if (x < 0 ) {
        return limitX(x + WIDTH, WIDTH)
    }
    if (x > WIDTH) {
        return x % WIDTH
    } 
}

function limitY (y, HEIGHT) {

}