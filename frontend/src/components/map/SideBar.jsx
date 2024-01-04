"use client";

import React from "react";
import "@/styles/SideBar.css";
import TripView from "@/components/map/TripView";
import SearchBar from "@/components/map/SearchBar";

const SideBar = ({ tripArray, setTripArray, removeFromTrip, setPan, setCurrentDetails, setDetailsLoading, clearInfoW, buildTrip, saveTrip, tripInfo }) => {
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
            <h1 className="text-base whitespace-nowrap">Nav-E</h1>
            {isOpen &&
                <div className = "search-box-container">
                    <SearchBar 
                        setPan = {setPan}
                        setCurrentDetails = {setCurrentDetails}
                        setDetailsLoading = {setDetailsLoading}
                        clearInfoW = {clearInfoW}
                    />
                    
                    <TripView
                        tripArray = {tripArray}
                        setTripArray = {setTripArray}  
                        removeFromTrip = {removeFromTrip} 
                        buildTrip = {buildTrip}
                        saveTrip = {saveTrip}
                        tripInfo = {tripInfo}
                    />     
                </div>
            }
        </div>
    );
};
    
export default SideBar;