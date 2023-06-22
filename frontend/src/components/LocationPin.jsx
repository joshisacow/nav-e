import React from 'react'
import {Marker} from '@react-google-maps/api'
import { faLocationPin, faLocationDot } from '@fortawesome/free-solid-svg-icons'


const LocationPin = (props) => {
  let iconPath = props.shape === 'dot' ? faLocationDot.icon[4] : faLocationPin.icon[4];

  return (
    <Marker 
        position={props.position} 
        icon = {{
          path: iconPath,
          scale: 0.075,
          strokeWeight: 0.2,
          strokeColor: 'black',
          strokeOpacity: 1,
          fillColor: props.color,
          fillOpacity: 0.8,
          anchor: new google.maps.Point(192, 512),
          labelOrigin: new google.maps.Point(192, 200),
        }}
        label = {props.label}
        onClick = {props.onClick}
    />  
  )
}

export default LocationPin