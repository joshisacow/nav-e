import { faCow } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const LoadingSpinner = () => {
    return (
        <FontAwesomeIcon icon={faCow} spin size="3x" /> 
    )
}

export default LoadingSpinner