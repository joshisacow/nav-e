import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import IconButton from '@/components/utils/IconButton';
import '@/styles/TripEntry.css'

const TripEntry = ({placeObject, index, removeFromTrip}) => {
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
                    <h1 className = "trip-entry-text">
                        {index + 1}. {placeObject.details.result.formatted_address}
                    </h1>
                    <IconButton 
                        icon = "close"
                        className = "trip-entry-button" 
                        onClick = {() => removeFromTrip(placeObject)} 
                    />
                </div>
            )}
        </Draggable>
    )
}

export default TripEntry;