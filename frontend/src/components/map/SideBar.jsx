import React from "react";
import "@/styles/SideBar.css";

const SideBar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const sidebarClass = isOpen ? "sidebar open" : "sidebar";

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={sidebarClass}>
            <button onClick={() => {toggleSidebar()}} className="sidebar-toggle">
                Toggle Sidebar
            </button>

            
        </div>
    );
};
    
export default SideBar;