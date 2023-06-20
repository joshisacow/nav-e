import React from 'react'
import {Marker} from '@react-google-maps/api'

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
        icon = {props.icon}
        label = {props.label}
    />  
  )
}

export default LocationPin