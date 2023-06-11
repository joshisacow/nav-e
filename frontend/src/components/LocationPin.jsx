import React from 'react'
import {Marker} from '@react-google-maps/api'

const LocationPin = props => {
  return (
    <Marker 
        position={props.position} 
        icon = {props.icon}
    />  
  )
}

export default LocationPin