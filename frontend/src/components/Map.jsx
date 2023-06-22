import {useMemo, useCallback, useState, useRef, useEffect} from 'react'
import {GoogleMap, InfoWindow, Marker} from '@react-google-maps/api'
import LocationPin from '@/components/LocationPin'
import SearchBar from '@/components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationPin } from '@fortawesome/free-solid-svg-icons'

// TODO: put in config file
const serverURL = 'https://api-dot-nav-e-387904.uc.r.appspot.com/trips/1';


// post method
//TODO: check userID, generate tripID

const postTrip = async (trip) => {
    console.log(JSON.stringify({"trip": trip}))
    const response = await fetch(serverURL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"trip": trip})
    });
    const data = await response.json();
    console.log(data);
}


const Map = props => {
    
    const [pan, setPan] = useState();
    const [tripArray, setTripArray] = useState([]);
    const [infoWindowMarker, setInfoWindowMarker] = useState("");
    const mapRef = useRef();
    const center = useMemo( () => ({
        lat: 33.7233519,
        lng: -117.7753504,
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

    console.log(faLocationPin)
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
                        if (tripArray.length >= 15) {
                            toast.error("max number of locations reached!", {position: "top-center"});
                            return;
                        }
                        if (tripArray.includes(position)) {
                            toast.error("location already added!", {position: "top-center"});
                            return;
                        }
                        setTripArray((prevTripArray) => [...prevTripArray, position]);
                        toast.success("destination added!", {position: "top-center"});
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
                {pan && <LocationPin  position = {pan} color = "red"  />}
                <LocationPin
                    position = {center}  
                    label = "A"
                    color = "red"
                />
                

                {/* mark locations in tripArray */}
                {tripArray.map((position, index) => (
                    <LocationPin 
                        key = {index} 
                        position = {position} 
                        label = {{
                            text: (index+1).toString(),
                            color: "white",
                            fontsize: "16px",
                            fontWeight: "bold",
                            className: "pin-label",
                        }}
                        color = "blue"
                        onClick = {() => {
                            setInfoWindowMarker(position);
                            console.log(position);
                        }}
                    />
                ))}
                {infoWindowMarker && (
                    <InfoWindow 
                        onCloseClick={() => {setInfoWindowMarker("")}}
                        position = {infoWindowMarker}
                    >
                        <div className = "info-window-container">
                            <h1>lat: {infoWindowMarker.lat}</h1>
                            <h1>lng: {infoWindowMarker.lng}</h1>    
                        </div>
                    </InfoWindow>
                )}
            
            </GoogleMap>
        </div>

    )
}


export default Map;