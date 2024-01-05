import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { GoogleMap, InfoWindow, Polyline } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LocationPin from '@/components/map/LocationPin';
import LoadingSpinner from '@/components/utils/LoadingSpinner';
import IconButton from '@/components/utils/IconButton';
import { optimizeRoute, getRouteDetails, postTrip } from "@/services/api-requests";
import { useAuth } from '@/components/auth/AuthContext';
import ProfileMenu from '@/components/utils/ProfileMenu';
import SideBar from '@/components/map/SideBar';
import CustomWindow from '@/components/map/CustomWindow';
import '@/styles/Map.css'

const Map = ({ searchParams }) => {
    const router = useRouter();
    const [currentMarker, setCurrentMarker] = useState({position: null, details: null});
    const [tripArray, setTripArray] = useState([]);
    const [pointArray, setPointArray] = useState([]);
    const [infoW, setInfoW] = useState({position: null, details: null});
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [optimizeLoading, setOptimizeLoading] = useState(false);
    const [tripInfo, setTripInfo] = useState({distanceMeters: null, duration: null, polyline: null})
    const [polyline, setPolyline] = useState([]);
    const [showPolyline, setShowPolyline] = useState(true);
    const { currentUser, logOut } = useAuth();

    // update tripArray when searchParams changes
    useEffect (() => {
        if (searchParams.get("trip")) {
            setTripArray(JSON.parse(searchParams.get("trip")));
        }
    }, [searchParams]);

    // dont show tripinfo if trip changed
    useEffect (() => {
        setTripInfo({distanceMeters: null, duration: null, polyline: null});
        setPolyline([]);
    }, [tripArray]);

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

    const addCurrentToTrip = () => {
        if (infoW.position === null) {
            return;
        }
        addToTrip(infoW);
    }

    const addCurrentToPoints = () => {
        if (infoW.position === null) {
            return;
        }
        addToPoints(infoW);
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

        // clear current pin and close infoWindow
        setCurrentMarker({position: null, details: null});
        clearInfoW();
    }

    const removeFromTrip = (placeObject) => {
        setTripArray((prevTripArray) => prevTripArray.filter((item) => !cmpPos(item.position, placeObject.position)));
    }

    const handlePointClick = (placeObject) => {
        setInfoW(placeObject);
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
        buildTrip(route[0]);
    }

    // save trip to db
    const saveTrip = async () => {
        if (tripArray.length < 2) {
            toast.error("add more locations to save trip!");
            return;
        }
        if (currentUser) {
            await postTrip(tripArray, currentUser.uid);
            toast.success("saved trip!");
        } else {
            toast.error("please login to save trip!");
        }
    }

    const buildTrip = async (trip) => {
        if (trip.length < 2) {
            toast.error("add more locations to build trip!");
            return;
        }
        const positions = trip.map(item => item.position);
        const route = await getRouteDetails(positions);
        const info = route["routes"][0];
        info.duration = Number(info.duration.slice(0, -1))
        setTripInfo(info);
        setPolyline(google.maps.geometry.encoding.decodePath(info.polyline.encodedPolyline));
    }

    const togglePolyline = () => {
        setShowPolyline((prevShowPolyline) => !prevShowPolyline);
    }

    const handleTripsClick = () => {
        router.push('/trips');
    }

    // Search Bar functions
    const setPan = (position) => {
        if (!inArrays(position)) {
            setCurrentMarker((prevMarker) => ({...prevMarker, position}));
        }
        mapRef.current?.panTo(position);
    }

    const setCurrentDetails = (position, details) => {
        setCurrentMarker((prevMarker) => ({...prevMarker, details}));
        setInfoW({position, details});
    }

    const clearInfoW = () => {
        if (infoW.position !== null) {
            setInfoW((prevInfoW) => ({...prevInfoW, position: null}));
        }
    }

    return (
        <div className="wrapper">
            <SideBar 
                tripArray = {tripArray}
                setTripArray = {setTripArray}  
                removeFromTrip = {removeFromTrip} 
                setPan = {setPan}
                setDetailsLoading = {setDetailsLoading}
                setCurrentDetails = {setCurrentDetails}
                clearInfoW = {clearInfoW}
                setInfoW = {setInfoW}
                buildTrip = {buildTrip}
                saveTrip = {saveTrip}
                tripInfo = {tripInfo}
                togglePolyline = {togglePolyline}
                showPolyline = {showPolyline}
            />

            <div className="map">
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
                            options={{ minWidth: 250, maxWidth: 400 }}
                            onCloseClick={() => {
                                setInfoW((prevInfoW) => ({...prevInfoW, position: null}))
                            }}
                            position={infoW.position}
                            zIndex={20}
                        >
                            {/* if loading currentMarker show spinner */}
                            {(detailsLoading && cmpPos(infoW.position, currentMarker.position)) || !infoW.details 
                                ? <LoadingSpinner size="2x" /> 
                                : <CustomWindow 
                                    info={infoW.details.result} 
                                    addCurrentToTrip={addCurrentToTrip} 
                                    addCurrentToPoints={addCurrentToPoints}
                                />
                            }
                        </InfoWindow>
                    )}

                    {/* render polyline if tripInfo is not null */}
                    {tripInfo.polyline && showPolyline && (
                        <Polyline
                            path={polyline}
                            options={{
                                strokeColor: "#0080FF",
                                strokeOpacity: 0.7,
                                strokeWeight: 3,
                                zIndex: 10,
                            }}
                        />
                    )}



                    <div className = "opt-route-button-container">
                        <IconButton icon = "rocket" className="opt-route-button" onClick={() => handleOptimizeRoute()} loading={optimizeLoading} />
                        <span className="opt-route-text bg-gray-700 text-white text-sm opacity-100 rounded-full px-3 py-2">Optimize Route</span>
                    </div>
                    {/* TODO: BUILD REC FUNCTIONALITY */}
                    {/* <div className = "rec-button-container">
                        <IconButton icon = "glass" className="rec-button" onClick={() => console.log("rec")} />
                        <span className="rec-text bg-gray-700 text-white text-sm opacity-100 rounded-full px-3 py-2">Recommend</span>
                    </div> */}

                    {/* render button based on login state */}
                    {currentUser ? 
                        <ProfileMenu user={currentUser} handleLogout={logOut} handleTripsClick={handleTripsClick} className="absolute top-4 right-4" />
                        :
                        <button onClick={() => router.push('/login')} className="absolute top-4 right-4 bg-indigo-600 rounded-lg shadow-xl text-white p-2 z-10 hover:bg-indigo-700 active:bg-indigo-800">
                            Login
                        </button>
                    }
                
                </GoogleMap>
            </div>
            <ToastContainer position = "top-center"/>
        </div>

    )
}


export default Map;