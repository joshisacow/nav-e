import {useMemo, useCallback, useState, useRef, useEffect} from 'react';
import {GoogleMap, InfoWindow} from '@react-google-maps/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LocationPin from '@/components/map/LocationPin';
import SearchBar from '@/components/map/SearchBar';
import TripView from '@/components/map/TripView';
import LoadingSpinner from '@/components/utils/LoadingSpinner';
import IconButton from '@/components/utils/IconButton';
import { postTrip, optimizeRoute } from "@/services/api-requests";
import { useRouter } from 'next/navigation';

const Map = () => {
    const router = useRouter();
    const [currentMarker, setCurrentMarker] = useState({position: null, details: null});
    const [tripArray, setTripArray] = useState([]);
    const [pointArray, setPointArray] = useState([]);
    const [infoW, setInfoW] = useState({position: null, details: null});
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [optimizeLoading, setOptimizeLoading] = useState(false);

    // update infoWindow when details finishes fetch
    useEffect (() => {
        // check if infoWindow is showing current marker
        if (cmpPos(infoW.position, currentMarker.position)) {
            setInfoW((prevInfoW) => ({...prevInfoW, details: currentMarker.details}));
        }
    }, [currentMarker.details]);

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

    const cmpPos = (pos1, pos2) => {
        if (pos1 && pos2) {
            return pos1.lat === pos2.lat && pos1.lng === pos2.lng;
        }
        return false;
    }

    const inArrays = (position) => {
        return tripArray.some(e => cmpPos(e.position, position)) || pointArray.some(e => cmpPos(e.position, position));
    } 

    const addToTrip = (placeObject) => {

        if (tripArray.length >= 15) {
            toast.error("max number of locations reached!");
            return;
        }
        if (tripArray.some((e) => cmpPos(e.position, placeObject.position) )) {
            toast.error("location already added!", {position: "top-center"});
            return;
        }
        
        // add to trip array
        setTripArray((prevTripArray) => [...prevTripArray, placeObject]);

        // if adding current marker, clear
        if (cmpPos(placeObject.position, currentMarker.position)) {
            setCurrentMarker({position: null, details: null});
        }
        // remove from pointArray if exists
        else if (pointArray.some((e) => cmpPos(e.position, placeObject.position))) {
            setPointArray((prevPointArray) => prevPointArray.filter((item) => !cmpPos(item.position, placeObject.position)));
        }

        // close infoWindow
        setInfoW((prevInfoW) => ({...prevInfoW, position: null}));;
    }

    const addToPoints = (placeObject) => {
        if (placeObject.position === null) {
            toast.error("Please enter a destination!", {position: "top-center"});
            return;
        }

        if (inArrays(placeObject.position)) {
            toast.error("location already added!", {position: "top-center"});
            return;
        }
        setPointArray((prevPointArray) => [...prevPointArray, placeObject]);

        // clear current pin
        setCurrentMarker({position: null, details: null});
    }

    const removeFromTrip = (placeObject) => {
        setTripArray((prevTripArray) => prevTripArray.filter((item) => !cmpPos(item.position, placeObject.position)));
    }

    const handlePointClick = (placeObject) => {
        setInfoW(placeObject);
    }

    const handleSaveTrip = async () => {
        if (tripArray.length < 2) {
            toast.error("add more locations to save trip!");
            return;
        }
        await postTrip(tripArray);
        toast.success("saved trip!");
    }

    const handleOptimizeRoute = async () => {
        if (tripArray.length < 3) {
            toast.error("add more locations to optimize route!");
            return;
        }
        setOptimizeLoading(true);
        const route = await optimizeRoute(tripArray);
        setOptimizeLoading(false);
        setTripArray(route[0]);
        toast.success("recommended route!");
        // TODO: show route on map
    }

    return (
        <div className="wrapper">
            <div className = "search-box-container">
                <TripView
                    tripArray = {tripArray}
                    setTripArray = {setTripArray}  
                    removeFromTrip = {removeFromTrip} 
                />
                <div className="search-bar-container">
                    <h1>Nav-E</h1> 
                    <SearchBar 
                        setPan = {(position) => {
                            if (!inArrays(position)) {
                                setCurrentMarker((prevMarker) => ({...prevMarker, position}));
                            }
                            mapRef.current?.panTo(position);
                        }}
                        addToPoints = {() => {addToPoints(currentMarker)}}
                        setCurrentDetails = {(details) => {
                            setCurrentMarker((prevMarker) => ({...prevMarker, details}));
                        }}
                        setDetailsLoading = {(bool) => setDetailsLoading(bool)}
                        clearInfoW = {() => {
                            if (infoW.position !== null) {
                                setInfoW((prevInfoW) => ({...prevInfoW, position: null}));
                            }
                        }}
                    />
                    <button className = "save-button" onClick = {() => handleSaveTrip()}> Save Trip </button>
                </div>
            </div>
            <GoogleMap 
                zoom ={10} 
                center={center} 
                mapContainerClassName = "map-container"
                options = {options}
                onLoad = {onLoad}
            >   
                {currentMarker.position && 
                    <LocationPin  
                        position = {currentMarker.position} 
                        color = "red"  
                        shape = "dot"
                        onClick = {() => {
                            handlePointClick(currentMarker);
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

                {infoW.position && (
                    <InfoWindow 
                        onCloseClick={() => {
                            setInfoW((prevInfoW) => ({...prevInfoW, position: null}))
                        }}
                        position = {infoW.position}
                    >
                        {/* if loading currentMarker show spinner */}
                        {(detailsLoading && cmpPos(infoW.position, currentMarker.position)) || !infoW.details ? <LoadingSpinner size="2x" /> :
                            <div className = "info-window-container">
                                <h1>lat: {infoW.position.lat}</h1>
                                <h1>lng: {infoW.position.lng}</h1>   
                                <h1>{infoW.details.result.formatted_address}</h1> 
                                <button onClick = {() => {addToTrip(infoW)}} className="add-button">
                                    Add to Trip
                                </button>
                            </div>
                        }
                    </InfoWindow>
                )}
                <div className = "opt-route-button-container">
                    <IconButton icon = "rocket" className="opt-route-button" onClick={() => handleOptimizeRoute()} loading={optimizeLoading} />
                    <span className="opt-route-text">Optimize Route</span>
                </div>
                <div className = "rec-button-container">
                    <IconButton icon = "glass" className="rec-button" onClick={() => console.log("rec")} />
                    <span className="rec-text">Recommend</span>
                </div>
                <button className="login-button" onClick={() => router.push('/login')}>
                    Login
                </button>
            
            </GoogleMap>

            <ToastContainer position = "top-center"/>
        </div>

    )
}


export default Map;