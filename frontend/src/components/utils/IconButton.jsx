import { faCow, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const iconMap = {
    cow: faCow,
    close: faXmark,
};

const IconButton = ({onClick, icon}) => {
    return (
        <button onClick={onClick}>
            <FontAwesomeIcon icon={iconMap[icon]} />
        </button>
    )
}

export default IconButton