import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TripEntry = ({placeObject, index}) => {
    console.log(placeObject);
    console.log("hi");
    return (
        <Draggable
            draggableId = {placeObject.details.result.name}
            index = {index}
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