import React, {useMemo, useCallback, useState} from 'react'
import {GoogleMap} from '@react-google-maps/api'
import LocationPin from '@/components/LocationPin'
import SearchBar from '@/components/SearchBar'

const Map = (props) => {
    const [pan, setPan] = React.useState();
    const [tripArray, setTripArray] = useState([]);
    const mapRef = React.useRef();
    const center = useMemo( () => ({
        lat: 33.68,
        lng: -117.83,
        // TODO: change to user's location
    }), []);

    const options = useMemo( () => ({
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        mapId: "b6a8170c1c0be23f",
    }), []);
    const onLoad = useCallback((map) => (mapRef.current = map), []);

    return (
        <div class="wrapper">
            <div className="search-bar-container">
                <h1>Nav-E</h1> 
                <SearchBar 
                    setPan = {(position) => {
                        setPan(position);
                        mapRef.current?.panTo(position);
                    }}
                    setTripArray = {(position) => {
                        setTripArray([...tripArray, position]);
                        console.log(tripArray);
                        <LocationPin position = {position} />
                    }}
                />
            </div>
            <GoogleMap 
                zoom ={10} 
                center={center} 
                mapContainerClassName = "map-container"
                options = {options}
                onLoad = {onLoad}

            >   
                {pan && <LocationPin  position = {pan} />}
                <LocationPin 
                    position = {center}
                    icon = {"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
                />
            </GoogleMap>
            <div className="markers"> 
                {tripArray.map((position) => (
                    <LocationPin position = {position} />
                ))}
            </div>
        </div>

        // markers
        
    )
}


export default Map;