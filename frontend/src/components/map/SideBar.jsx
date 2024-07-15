import { useState } from "react";
import "@/styles/SideBar.css";
import TripView from "@/components/map/TripView";
import SearchBar from "@/components/map/SearchBar";
import IconButton from '@/components/utils/IconButton';
import HelpModal from "@/components/map/HelpModal";

const SideBar = ({ tripArray, setTripArray, removeFromTrip, setPan, setCurrentDetails, setDetailsLoading, clearInfoW, buildTrip, saveTrip, tripInfo, togglePolyline, showPolyline }) => {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarClass = isOpen ? "sidebar open" : "sidebar";
    const [openHelpModal, setOpenHelpModal] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleHelpModal = () => {
        setOpenHelpModal(!openHelpModal);
    };

    return (
        <div className={sidebarClass}>
            <div className="sidebar-toggle" onClick={() => {toggleSidebar()}}>
                <div className="sidebar-toggle-icon"></div>
            </div>
            <div className="sidebar-title">
                <h1 className="text-base whitespace-nowrap">Nav-E</h1>
                
                <IconButton
                    icon="help"
                    onClick={toggleHelpModal}
                    className="help-button"
                />
            </div>
            <HelpModal 
                    openHelpModal={openHelpModal}
                    handleClose={toggleHelpModal}
                />
            {isOpen &&
                <div className = "search-box-container">
                    <SearchBar 
                        setPan = {setPan}
                        setCurrentDetails = {setCurrentDetails}
                        setDetailsLoading = {setDetailsLoading}
                        clearInfoW = {clearInfoW}
                        toggleSidebar={toggleSidebar}
                    />
                    
                    <TripView
                        tripArray = {tripArray}
                        setTripArray = {setTripArray}  
                        removeFromTrip = {removeFromTrip} 
                        buildTrip = {buildTrip}
                        saveTrip = {saveTrip}
                        tripInfo = {tripInfo}
                        togglePolyline = {togglePolyline}
                        showPolyline = {showPolyline}
                    />     
                </div>
            }
        </div>
    );
};
    
export default SideBar;