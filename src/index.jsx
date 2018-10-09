import SAMPLE from './sample.jpg'
import React from 'react'
import ReactDOM from 'react-dom'
import PanoramicViewer from './component/PanoramicViewer'
import AnchorPoint from './component/PanoramicViewer/AnchorPoint'


const nextUrl = SAMPLE;



const anchors = [
  new AnchorPoint(0, 0.3, 'SOUTH', nextUrl, renderUrl),
  new AnchorPoint(0.25, 0.3, 'WEST', nextUrl, renderUrl),
  new AnchorPoint(0.5, 0.3, 'NORTH', nextUrl, renderUrl),
  new AnchorPoint(0.75, 0.3, 'EAST', nextUrl, renderUrl),
]


renderUrl(SAMPLE);


function renderUrl (url) {
  ReactDOM.render(
    <PanoramicViewer
      imageUrl={url}
      fullscreen={true}
      anchors={anchors}
    />,
    document.getElementById('app')
  )
}





