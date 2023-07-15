import { faCow, faXmark, faRocket, faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const iconMap = {
    cow: faCow,
    close: faXmark,
    rocket: faRocket,
    glass: faMagnifyingGlassLocation,
};

const IconButton = ({onClick, icon, className}) => {
    return (
        <button onClick={onClick} className={className}>
            <FontAwesomeIcon icon={iconMap[icon]} />
        </button>
    )
}

export default IconButton