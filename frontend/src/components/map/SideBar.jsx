import React from "react";
import "@/styles/SideBar.css";
import TripView from "@/components/map/TripView";
import SearchBar from "@/components/map/SearchBar";
import IconButton from "@/components/utils/IconButton";

const SideBar = ({ tripArray, setTripArray, removeFromTrip, setPan, addToPoints, currentMarker, setCurrentDetails, setDetailsLoading, clearInfoW }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const sidebarClass = isOpen ? "sidebar open" : "sidebar";

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={sidebarClass}>
            <div className="sidebar-toggle" onClick={() => {toggleSidebar()}}>
                <div className="sidebar-toggle-icon"></div>
            </div>
            <div className = "search-box-container">
                    <TripView
                        tripArray = {tripArray}
                        setTripArray = {setTripArray}  
                        removeFromTrip = {removeFromTrip} 
                    />
                    <div className="search-bar-container">
                        <h1>Nav-E</h1> 
                        <SearchBar 
                            setPan = {setPan}
                            addToPoints = {addToPoints}
                            setCurrentDetails = {setCurrentDetails}
                            setDetailsLoading = {setDetailsLoading}
                            clearInfoW = {clearInfoW}
                            currentMarker = {currentMarker}
                        />
                        {/* <button className = "save-button" onClick = {() => handleBuildTrip()}> Build Trip </button> */}
                    </div>
                </div>
        </div>
    );
};
    
export default SideBar;