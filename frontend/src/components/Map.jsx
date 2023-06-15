import {useMemo, useCallback, useState, useRef, useEffect} from 'react'
import {GoogleMap} from '@react-google-maps/api'
import LocationPin from '@/components/LocationPin'
import SearchBar from '@/components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const serverURL = 'https://nav-e-387904.uc.r.appspot.com/trips/1';

// post method
//TODO: check userID, generate tripID

const postTrip = async (trip) => {
    console.log(JSON.stringify({"trip": trip}))
    const response = await fetch(serverURL, {
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
        mapId: process.env.NEXT_PUBLIC_MAPS_ID,
    }), []);

    const onLoad = useCallback((map) => (mapRef.current = map), []);

    const saveTrip = () => {
        postTrip(tripArray);
        toast.success("saved trip!", {position: "top-center"});
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
            <button className = "save-button" onClick = {saveTrip}>Save Trip</button>
            <GoogleMap 
                zoom ={10} 
                center={center} 
                mapContainerClassName = "map-container"
                options = {options}
                onLoad = {onLoad}

            >   
                {pan && <LocationPin  position = {pan} icon = {"/blue-dot.png"} />}
                <LocationPin 
                    position = {center}
                    icon = {"/red-dot.png"}
                />

                {/* mark locations in tripArray */}
                {tripArray.map((position, index) => (
                    <LocationPin key = {index} position = {position} icon = {"/blue-dot.png"} />
                ))}
            
            </GoogleMap>
        </div>

        
    )
}


export default Map;