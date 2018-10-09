
import React from 'react'
import ReactDOM from 'react-dom'
import PanoramicViewer from './component/PanoramicViewer'
import AnchorPoint from './component/PanoramicViewer/AnchorPoint'

import SAMPLE from './sample.jpg'
import SAMPLE_2 from './sample_2.jpg'
import SAMPLE_3 from './sample_3.png'


const URL_2 = SAMPLE_2;
const URL_3 = SAMPLE_3;



const anchors = [
  new AnchorPoint(0, 0.3, 'SOUTH', URL_2, [], renderUrl),
  new AnchorPoint(0.25, 0.3, 'WEST', URL_2, [], renderUrl),
  new AnchorPoint(0.5, 0.3, 'NORTH', URL_3, [], renderUrl),
  new AnchorPoint(0.75, 0.3, 'EAST', URL_3, [], renderUrl),
]






renderUrl(SAMPLE, anchors);


function renderUrl (url, anchors = []) {
  const container = document.getElementById('app')
  ReactDOM.unmountComponentAtNode(container)
  ReactDOM.render(
    <PanoramicViewer
      imageUrl={url}
      fullscreen={true}
      anchors={anchors}
    />,
    container
  )
}





