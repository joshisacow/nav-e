import {useMemo, useCallback, useState, useRef, useEffect} from 'react'
import {GoogleMap} from '@react-google-maps/api'
import LocationPin from '@/components/LocationPin'
import SearchBar from '@/components/SearchBar'


// post method
//TODO: check userID, generate tripID

const postTrip = async (trip) => {
    console.log(JSON.stringify({"trip": trip}))
    const response = await fetch('http://localhost:8080/trips/1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"trip": trip})
    });
    const data = await response.json();
    console.log(data);
}


const Map = (props) => {
    const [pan, setPan] = useState();
    const [tripArray, setTripArray] = useState([]);
    const mapRef = useRef();
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

    const handleClick = () => {
        postTrip(tripArray);
    }

    return (
        <div className="wrapper">
            <div className="search-bar-container">
                <h1>Nav-E</h1> 
                <SearchBar 
                    setPan = {(position) => {
                        setPan(position);
                        mapRef.current?.panTo(position);
                    }}
                    setTripArray = {(position) => {
                        setTripArray([...tripArray, position]);
                        <LocationPin position = {position} />
                    }}
                />
            </div>
            <button className = "save-button" onClick = {handleClick}>Save Trip</button>
            <GoogleMap 
                zoom ={10} 
                center={center} 
                mapContainerClassName = "map-container"
                options = {options}
                onLoad = {onLoad}

            >   
                {pan && <LocationPin  position = {pan} icon = {"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"} />}
                <LocationPin 
                    position = {center}
                    icon = {"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
                />

                {/* mark locations in tripArray */}
                {tripArray.map((position, index) => (
                    <LocationPin key = {index} position = {position} icon = {"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"} />
                ))}
            
            </GoogleMap>
        </div>

        
    )
}


export default Map;