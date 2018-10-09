import './style.scss'
import React from 'react'
import PropTypes from 'prop-types'
import ImageData from './ImageData'
import {limitX, limitY, calcViewSize} from './util'
import AnchorPoint from './AnchorPoint'







export default class PanoramicViewer extends React.Component {
    static propTypes = {
        imageUrl: PropTypes.string,
        fullsceen: PropTypes.bool,
        width: PropTypes.number,
        height: PropTypes.number,
        // anchors: PropTypes.arrayOf(AnchorPoint)
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
        this.IMAGE_WIDTH = 0
        this.IMAGE_HEIGHT = 0
        this.VIEW_WIDTH = 0
        this.VIEW_HEIGHT= 0
        
        this.imageLoaded = false;
        
        this.anchors = [];
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
        const size = calcViewSize(
            IMAGE_WIDTH, 
            IMAGE_HEIGHT,
            screen.width,
            screen.height
        )       
        const VIEW_WIDTH = size.width
        const VIEW_HEIGHT = size.height
        this.x = Math.floor((IMAGE_WIDTH - VIEW_WIDTH)/2)
        this.y = Math.floor((IMAGE_HEIGHT - VIEW_HEIGHT)/2)
        console.log(`IMAGE_WIDTH: ${IMAGE_WIDTH};IMAGE_HEIGHT:${IMAGE_HEIGHT}`)
        console.log(`VIEW_WIDTH: ${VIEW_WIDTH};VIEW_HEIGHT:${VIEW_HEIGHT}`)      
        console.log(`x: ${this.x}; y:${this.y}`)

        sourceCanvas.width = IMAGE_WIDTH
        sourceCanvas.height = IMAGE_HEIGHT
        viewport.width = VIEW_WIDTH
        viewport.height = VIEW_HEIGHT 

        this.IMAGE_HEIGHT = IMAGE_HEIGHT
        this.IMAGE_WIDTH = IMAGE_WIDTH
        this.VIEW_HEIGHT = VIEW_HEIGHT
        this.VIEW_WIDTH = VIEW_WIDTH
        
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
        
        const {anchors} = this.props;
        let node = this.refs.labelgroup;
        anchors.forEach(anchor => {
            const ele = anchor.createAnchorElement(
                this.IMAGE_WIDTH,
                this.IMAGE_HEIGHT,
                this.VIEW_WIDTH,
                this.VIEW_HEIGHT
            );
            node.appendChild(ele);
        })

        this.repaint();
        this.imageLoaded = true;
               
    }

    handleTouchstart (e) {
        const { clientX, clientY } = e.changedTouches[0]
        this.touchX = clientX
        this.touchY = clientY
        e.preventDefault()
    }

    handleTouchmove (e) {
        if (!this.imageLoaded) {
            console.log('image is not loaded.')
            return;
        }
        const { clientX, clientY } = e.changedTouches[0]
        
        let moveX = clientX - this.touchX
        let moveY = clientY - this.touchY

        
        this.x += moveX
        this.y += moveY
        this.x = limitX(this.x, this.IMAGE_WIDTH)
        this.y = limitY(this.y, this.IMAGE_HEIGHT, this.VIEW_HEIGHT)
        this.repaint()
        this.touchX = clientX
        this.touchY = clientY
        e.preventDefault()
    
    }


    handleMousemove (ev) {
        let {movementX, movementY} = ev
        if (!this.imageLoaded) {
            console.log('image is not loaded.')
            return;
        }
        if (ev.which !== 0) {        
            this.x += movementX
            this.y += movementY
            this.x = limitX(this.x, this.IMAGE_WIDTH)
            this.y = limitY(this.y, this.IMAGE_HEIGHT, this.VIEW_HEIGHT)
            this.repaint()
        }
    }

    repaint () {
        const data = this.imageData.getDataAt(this.x, this.y)
        this.ctx.putImageData(data, 0, 0)
        console.log(`x: ${this.x}; y:${this.y}`)
        const {anchors} = this.props;
        anchors.forEach(anchor => {
            anchor.moveAt(this.x, this.y);
        })
    }

    render () {
        const {fullsceen} = this.props
        const cls = `panoramic-viewer${fullsceen?' fullscreen':''}`

        // todo: if image is not loaded, can show some loading animation effect

        return (
          <div className={cls}>
            <img ref="sourceImage" className="source-image" src={this.props.imageUrl}/>
            <canvas 
              ref="sourceCanvas" 
              className="source-canvas"
            />
            <canvas 
              ref="viewport" 
              className="viewport"
            />
            <div ref="labelgroup">
                North
            </div>
          </div>
        )
    }
}


