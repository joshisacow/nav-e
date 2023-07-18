import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@/components/utils/IconButton'

const ProfileMenu = ({ handleLogout, handleTripsClick, className, user }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div className={className}>
            <IconButton icon="cow" onClick={handleClick} className="bg-indigo-200 rounded-full p-3 border-2 border-white hover:bg-indigo-300 active:bg-indigo-400" />
            <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    handleClose();
                    handleTripsClick();
                }}>Saved Trips</MenuItem>
                <MenuItem onClick={() => {
                    handleLogout();
                    handleClose();
                }}>Log out</MenuItem>
            </Menu>
        </div>
    )
}

export default ProfileMenu