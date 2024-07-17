import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '../utils/IconButton';
import "@/styles/HelpModal.css";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const HelpModal = ({ openHelpModal, handleClose }) => {
    return (
        <Modal
            open={openHelpModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Get Started with Nav-E
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Nav-E is a tool built to make visualizing and planning multi-stop iterinaries more intuitive for users. The main benefit is the ability to visualize all potential destinations before actually choosing the destinations you want to add to your intinerary based on the information laid out. To get started, just add all locations you were considering visitng to the 'considering' category. Or, if you're sure about specific locations, add it to 'decided' which will directly add it to your itinerary. Based on the layout of the locations, you have the power to choose which destinations should be included in your itinerary intuitively, and you can click on those destinations and add them to your itinerary ('decided' button). After choosing all the locations you want, you can reorder them by dragging the locations into your desired order or use the optimize route button to find the shortest path through all the points. Then, you can build the path and click the trip text to open the trip in Google Maps or save the route to your profile.   
                </Typography>
                <IconButton
                    icon="close"
                    onClick={handleClose}
                    className="modal-close-button"
                />
            </Box>
        </Modal>
    );
}

export default HelpModal;