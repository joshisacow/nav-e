import '@/styles/CustomWindow.css';
import Rating from '@mui/material/Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

const CustomWindow = ({ info, addCurrentToTrip, addCurrentToPoints }) => {

    if (info.price_level) {
        const price = Array(info.price_level).fill(<FontAwesomeIcon icon={faDollarSign} />);
        console.log(price);
    }

    return (
        <div className = "info-window-container">
            <div className="info-header">
                <h1 className = "text-xl">{info.name}</h1>
                {info.rating && info.user_ratings_total && 
                    (
                        <>
                            {info.rating}
                            <Rating 
                                name="user-rating"
                                value={info.rating}
                                readOnly
                                precision={0.1}
                                />
                            ({info.user_ratings_total}) 

                            {info.price_level && 
                                [...Array(info.price_level)].map((e, i) =>(
                                    <FontAwesomeIcon id={i+1} className="text-gray-500" icon={faDollarSign} />
                                ))
                            }
                        </>
                    )
                }
            </div>
            <h1>{info.formatted_address}</h1> 
            {info.formatted_phone_number && <h1>{info.formatted_phone_number}</h1>}
            {info.business_status && <h1>{info.business_status}</h1>}
            {info.editorial_summary && <h1>{info.editorial_summary.overview}</h1>}
            {info.website && <h1>{info.website}</h1>}
            {info.url && <h1>{info.url}</h1>}
            {info.opening_hours && 
                <>
                    <div className="open-hours">
                        Hours:
                        {info.opening_hours.open_now 
                            ? <h1 className="text-green-500">Open</h1>  
                            : <h1 className="text-red-700">Closed</h1>  
                        }
                    </div>
                    <h1>{info.opening_hours.weekday_text}</h1>
                </>
            }

            <div className="button-row">
                <button onClick = {() => addCurrentToPoints()} className="consider-button">
                    Considering
                </button>
                <button onClick = {() => addCurrentToTrip()} className="decided-button">
                    Decided
                </button>
            </div>
        </div>
    )
}

export default CustomWindow;