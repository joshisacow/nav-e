import {useMemo, useCallback, useState, useRef, useEffect} from 'react';
import {GoogleMap, InfoWindow, Marker} from '@react-google-maps/api';
import LocationPin from '@/components/LocationPin';
import SearchBar from '@/components/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const Map = () => {
    
    const [pan, setPan] = useState();

    //TODO: change so that tripArray stores an array of position + place details / reconfigure firestore + server
    const [tripArray, setTripArray] = useState([]);
    const [pointArray, setPointArray] = useState([]);

    // TODO: change to only use details for curr marker, else check saved points array
    const [infoWindowMarker, setInfoWindowMarker] = useState("");
    const [infoWindowDetails, setInfoWindowDetails] = useState({});
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

    const addToTrip = (position) => {
        console.log ("hi");
        if (tripArray.length >= 15) {
            toast.error("max number of locations reached!", {position: "top-center"});
            return;
        }
        if (tripArray.includes(position)) {
            toast.error("location already added!", {position: "top-center"});
            return;
        }

        // add to trip array
        setTripArray((prevTripArray) => [...prevTripArray, position]);

        // remove from pointArray if exists
        if (pointArray.includes(position)) {
            setPointArray((prevPointArray) => prevPointArray.filter((item) => item !== position));
        }

        // close infoWindow
        setInfoWindowMarker("");

        toast.success("added to trip!", {position: "top-center"});
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
                    setPointArray = {(position) => {
                        if (pointArray.length >= 15) {
                            toast.error("max number of locations reached!", {position: "top-center"});
                            return;
                        }
                        if (pointArray.includes(position)) {
                            toast.error("location already added!", {position: "top-center"});
                            return;
                        }
                        setPointArray((prevPointArray) => [...prevPointArray, position]);
                        
                        // clear current pin
                        setPan();

                        toast.success("destination added!", {position: "top-center"});
                    }}
                    setInfoWindowDetails = {(details) => {
                        setInfoWindowDetails(details);
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
                {pan && 
                    <LocationPin  
                        position = {pan} 
                        color = "red"  
                        shape = "dot"
                        onClick = {() => {
                            setInfoWindowMarker(pan);
                            console.log(pan);
                        }}
                    />
                }

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
                        shape = "pin"
                        color = "blue"
                        onClick = {() => {
                            setInfoWindowMarker(position);
                            console.log(position);
                        }}
                    />
                ))}

                {/* mark locations in pointArray */}
                {pointArray.map((position, index) => (
                    <LocationPin 
                        key = {index} 
                        position = {position} 
                        shape = "dot"
                        color = "red"
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
                            <h1>{infoWindowDetails.result.formatted_address}</h1> 
                            <button onClick = {() => {addToTrip(infoWindowMarker)}} className="add-button">
                                Add to Trip
                            </button>
                        </div>
                    </InfoWindow>
                )}
            
            </GoogleMap>
        </div>

    )
}


export default Map;