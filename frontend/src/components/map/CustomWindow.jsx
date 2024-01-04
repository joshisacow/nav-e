import '@/styles/CustomWindow.css';
import Rating from '@mui/material/Rating';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCircleQuestion, faHouseCircleCheck, faArrowUpRightFromSquare, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const CustomWindow = ({ info, addCurrentToTrip, addCurrentToPoints }) => {

    return (
        <div className = "info-window-container">
            <div className="info-header">
                {info.name && info.website 
                    ? (
                        <a href={info.website} className="text-xl hover:text-gray-500 active:text-gray-400">
                            {info.name} 
                            <FontAwesomeIcon className="text-xs text-gray-500 ml-1 mr-5" icon={faArrowUpRightFromSquare} />
                        </a>
                    )
                    : info.name && <div className="text-xl mr-5">{info.name}</div>
                }
                {info.rating && info.user_ratings_total && 
                    (
                        <>
                            {info.rating} 
                            <Rating 
                                className="ml-1 mr-1"
                                value={info.rating}
                                readOnly
                                precision={0.1}
                                size="small"
                            />
                            <a className="underline mr-2 hover:text-gray-500 active:text-gray-400" href={info.url}>
                                ({info.user_ratings_total})
                            </a>
                            {info.price_level && 
                                [...Array(info.price_level)].map((e, i) =>(
                                    <FontAwesomeIcon key={i+1} className="text-gray-500" icon={faDollarSign} />
                                ))
                            }
                        </>
                    )
                }
            </div>
            {info.formatted_address && <div className="text-xs">{info.formatted_address}</div>}
            {info.formatted_phone_number && <div className="text-xs">{info.formatted_phone_number}</div>}
            {info.editorial_summary && <div className="mt-1 mb-1 text-sm">{info.editorial_summary.overview}</div>}
            {info.opening_hours && 
                <Accordion>
                    <AccordionSummary
                        expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="body2" className="open-hours">
                            Hours: {'  '}
                            {info.opening_hours.open_now 
                                ? <div className="text-green-500 ml-2">Open</div>  
                                : <div className="text-red-700 ml-2">Closed</div>  
                            }
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {info.opening_hours.weekday_text.map((day, i) => (
                            <Typography variant="body2" key={i+1}>{day}</Typography>
                        ))}
                    </AccordionDetails>
                </Accordion>
            }

            <div className="button-row">
                <button onClick = {() => addCurrentToPoints()} className="consider-button">
                    Considering 
                    {'  '}
                    <FontAwesomeIcon icon={faCircleQuestion} />
                </button>
                <button onClick = {() => addCurrentToTrip()} className="decided-button">
                    Decided 
                    {'  '}
                    <FontAwesomeIcon icon={faHouseCircleCheck} />
                </button>
            </div>
        </div>
    )
}

export default CustomWindow;