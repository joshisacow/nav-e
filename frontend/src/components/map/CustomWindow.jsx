import '@/styles/CustomWindow.css';

const CustomWindow = ({ info, addCurrentToTrip }) => {
    return (
        <div className = "info-window-container">
            <h1>{info.name}</h1>
            <h1>{info.formatted_phone_number}</h1>
            <h1>{info.formatted_address}</h1> 
            <h1>{info.business_status}</h1>
            <h2>{info.editorial_summary.overview}</h2>
            <h3>{info.price_level}</h3>
            <h3>{info.rating}</h3>
            <h3>{info.user_ratings_total}</h3>
            <h3>{info.website}</h3>
            <h3>{info.url}</h3>
            <h4>{info.opening_hours.weekday_text}</h4>

            <button onClick = {() => addCurrentToTrip()} className="add-button">
                Add to Trip
            </button>
        </div>
    )
}

export default CustomWindow;