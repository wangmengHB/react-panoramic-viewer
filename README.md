# react-panoramic-viewer
This is a react component for viewing a 3D panoramic image. 
Basically the function of viewing a 3D panoramic image is already done.
But many details of the component is not well designed.
It need to take more to finish it.

You can see the sample code of how to use it in 'src/index.jsx'
```js
ReactDOM.render(
    <PanoramicViewer 
      imageUrl={SAMPLE}
    />,
    document.getElementById('app')
)
```

# how to view a 3D panoramic image:

# viewport
```
（-180,90）   ---------------------------- （0,90） ------------------------------（180,90）
      |                                                                               |
      |                                                                               |
      |                       (-60,60) --- （0,60） --- (60,60)                        |
      |                           |           |           |                           |
      |                           |           |           |                           |
（-180,0）   ------------------------------（0,0）----------------------------------(180,0)
      |                           |           |           |                           |
      |                           |           |           |                           |
      |                       (-60,-60) ---（0，-60）---(60,-60)                       |                          
      |                                                                               |
      |                                                                               |
（-180，-90） -----------------------------（0，-90）-------------------------------（180，-90）
```

# run demo

$ npm run dev

$ localhost:8080
