import React from 'react'
import {Marker} from '@react-google-maps/api'
import { faLocationPin } from '@fortawesome/free-solid-svg-icons'


const LocationPin = (props) => {
  // const markerRef = React.useRef();
  // <PinElement> </PinElement>
  // markerRef.current = new google.maps.marker.PinElement({
  //   position: props.position,
  //   glyph: "1",
  // })
  return (

    <Marker 
        position={props.position} 
        icon = {{
          path: faLocationPin.icon[4],
          scale: 0.075,
          strokeWeight: 0.2,
          strokeColor: 'black',
          strokeOpacity: 1,
          fillColor: props.color,
          fillOpacity: 0.7,
          anchor: new google.maps.Point(192, 512),
          labelOrigin: new google.maps.Point(192, 200),
        }}
        label = {props.label}
        onClick = {props.onClick}
    />  
  )
}

export default LocationPin