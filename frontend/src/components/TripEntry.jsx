import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TripEntry = ({placeObject, index}) => {
    console.log(placeObject);
    return (
        <Draggable
            draggableId = {placeObject.details.result.place_id}
            index = {index}
            key = {placeObject.details.result.place_id}
        >
            {(provided) => (
                <div 
                    className = "trip-entry"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref = {provided.innerRef}
                >
                    <h1>
                        {index + 1}. {placeObject.details.result.formatted_address}
                    </h1>
                </div>
            )}
        </Draggable>
    )
}

export default TripEntry;