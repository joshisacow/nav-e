import React, {useMemo} from 'react'
import {GoogleMap} from '@react-google-maps/api'
import LocationPin from '@/components/LocationPin'

const Map = () => {
    const mapContainerStyle = {
        width: '100%',
        height: '100vh',
    };

    const center = useMemo( () => ({
        lat: 44,
        lng: -80,
    }), []);

    const options = useMemo( () => ({
        disableDefaultUI: true,
        mapId: "b6a8170c1c0be23f",
    }), []);

    return (
        <GoogleMap 
            zoom ={10} 
            center={center} 
            mapContainerStyle = {mapContainerStyle}
            options = {options}

        >
            <LocationPin 
                position = {center}
                icon = {"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
            />
        </GoogleMap>
    )
}


export default Map;