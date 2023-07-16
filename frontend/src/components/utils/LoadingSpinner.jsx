import { faCow } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const LoadingSpinner = ({size}) => {
    return (
        <FontAwesomeIcon icon={faCow} spin size={size} /> 
    )
}

export default LoadingSpinner