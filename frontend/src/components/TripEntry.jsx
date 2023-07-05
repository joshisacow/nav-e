import React from 'react'


const TripEntry = ({placeObject, index}) => {
    console.log(placeObject);
    console.log("hi");
    return (
        <div className = "trip-entry">
            <h1>
                {index + 1}. {placeObject.details.result.formatted_address}
            </h1>
        </div>
    )
}

export default TripEntry