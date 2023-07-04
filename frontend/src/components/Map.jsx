import {useMemo, useCallback, useState, useRef, useEffect} from 'react';
import {GoogleMap, InfoWindow, Marker} from '@react-google-maps/api';
import LocationPin from '@/components/LocationPin';
import SearchBar from '@/components/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config.json'


//TODO: check userID, generate tripID

const postTrip = async (trip) => {
    console.log(JSON.stringify({"trip": trip}))
    const response = await fetch(config.baseURL + "trips/1", {
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
    const [tripArray, setTripArray] = useState([]);
    const [pointArray, setPointArray] = useState([]);
    const [infoWindowMarker, setInfoWindowMarker] = useState("");
    const [infoWindowDetails, setInfoWindowDetails] = useState({});
    const [currentDetails, setCurrentDetails] = useState({});
    
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

    const addToTrip = (position, details) => {
        const placeObject = {position, details}

        if (tripArray.length >= 15) {
            toast.error("max number of locations reached!", {position: "top-center"});
            return;
        }
        if (tripArray.some((item) => item.position === position )) {
            toast.error("location already added!", {position: "top-center"});
            return;
        }
        
        // add to trip array
        setTripArray((prevTripArray) => [...prevTripArray, placeObject]);

        // remove from pointArray if exists
        if (pointArray.some((item) => item.position === position)) {
            setPointArray((prevPointArray) => prevPointArray.filter((item) => item.position !== position));
        }

        // close infoWindow
        setInfoWindowMarker("");

        console.log(tripArray);
        console.log(pointArray);
    }

    const addToPoints = (position) => {
        const placeObject = {position, details: currentDetails}
        if (pointArray.some((item) => item.position === position)) {
            toast.error("location already added!", {position: "top-center"});
            return;
        }
        setPointArray((prevPointArray) => [...prevPointArray, placeObject]);
        
        // clear current pin
        setPan();
    }

    const handlePointClick = (placeObject) => {
        setInfoWindowMarker(placeObject.position);
        setInfoWindowDetails(placeObject.details);
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
                    setPointArray = {(position) => addToPoints(position)}
                    setCurrentDetails = {(details) => {
                        setCurrentDetails(details);
                    }}
                />
            </div>
            <button className = "save-button" 
                onClick = {() => {
                    postTrip(tripArray);
                    toast.success("saved trip!", {position: "top-center"});
                }
            }> Save Trip </button>
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
                            setInfoWindowDetails(currentDetails);
                        }}
                    />
                }

                {/* mark locations in tripArray */}
                {tripArray.map((placeObject, index) => (
                    <LocationPin 
                        key = {index} 
                        position = {placeObject.position} 
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
                            // TODO: change to new info window without button
                            handlePointClick(placeObject);
                        }}
                    />
                ))}

                {/* mark locations in pointArray */}
                {pointArray.map((placeObject, index) => (
                    <LocationPin 
                        key = {index} 
                        position = {placeObject.position} 
                        shape = "dot"
                        color = "orange"
                        onClick = {() => {
                            handlePointClick(placeObject);
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
                            <button onClick = {() => {addToTrip(infoWindowMarker, infoWindowDetails)}} className="add-button">
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