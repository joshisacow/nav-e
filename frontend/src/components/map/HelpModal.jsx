import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '../utils/IconButton';
import "@/styles/HelpModal.css";
import { EN_US } from '../../locales/EN-US';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflowY: 'auto',
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
                    {EN_US.HELP_MODAL.TITLE_1}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 0.5 }}>
                    {EN_US.HELP_MODAL.DESCRIPTION_1}
                </Typography>
                <Typography id="modal-modal-subtitle" variant="h6" sx={{ mt: 1 }}>
                    {EN_US.HELP_MODAL.TITLE_2}
                </Typography>
                <Typography id="modal-modal-description2" sx={{ mt: 0.5 }}>
                    {EN_US.HELP_MODAL.DESCRIPTION_2} 
                </Typography>
                <Typography id="modal-modal-description3" sx={{ mt: 1 }}>
                    {EN_US.HELP_MODAL.DESCRIPTION_3} 
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