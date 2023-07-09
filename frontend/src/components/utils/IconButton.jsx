import { faCow } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const iconMap = {
    cow: faCow,
};

const IconButton = ({onClick, icon}) => {
    return (
        <button onclick={onClick}>
            <FontAwesomeIcon icon={iconMap[icon]} />
        </button>
    )
}

export default IconButton