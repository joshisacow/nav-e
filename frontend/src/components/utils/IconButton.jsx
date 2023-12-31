import { faCow, faXmark, faRocket, faMagnifyingGlassLocation, faHouse, faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LoadingSpinner from './LoadingSpinner'

const iconMap = {
    cow: faCow,
    close: faXmark,
    rocket: faRocket,
    glass: faMagnifyingGlassLocation,
    home: faHouse,
    plus: faPlus,
    arrow: faArrowRight,
};

const IconButton = ({onClick, icon, className, loading}) => {
    return (
        <>
            {loading ? 
                <div className={className}> 
                    <LoadingSpinner /> 
                </div> :
                <button onClick={onClick} className={className}>
                    <FontAwesomeIcon icon={iconMap[icon]} size="1x" />
                </button>
            }
        </>
    )
}

export default IconButton