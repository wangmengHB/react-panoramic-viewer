import SAMPLE from './sample.jpg'
import React from 'react'
import ReactDOM from 'react-dom'
import PanoramicViewer from './component/PanoramicViewer'


const root = document.getElementById('app')

ReactDOM.render(
    <PanoramicViewer src={SAMPLE}/>,
    root
)
