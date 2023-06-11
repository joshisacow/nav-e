import React, {useMemo, useCallback} from 'react'
import {GoogleMap} from '@react-google-maps/api'
import LocationPin from '@/components/LocationPin'

const Map = () => {
    const mapRef = React.useRef();
    const center = useMemo( () => ({
        lat: 44,
        lng: -80,
    }), []);

    const options = useMemo( () => ({
        disableDefaultUI: true,
        mapId: "b6a8170c1c0be23f",
    }), []);
    const onLoad = useCallback((map) => (mapRef.current = map), []);

    return (
        <GoogleMap 
            zoom ={10} 
            center={center} 
            mapContainerClassName = "map-container"
            options = {options}
            onLoad = {onLoad}

        >
            <LocationPin 
                position = {center}
                icon = {"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
            />
        </GoogleMap>
    )
}


export default Map;