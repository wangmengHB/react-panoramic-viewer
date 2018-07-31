import SAMPLE from './sample.jpg'
import React from 'react'
import ReactDOM from 'react-dom'
import PanoramicViewer from './component/PanoramicViewer'


ReactDOM.render(
    <PanoramicViewer 
      imageUrl={SAMPLE}
    />,
    document.getElementById('app')
)
