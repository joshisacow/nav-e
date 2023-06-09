import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TripEntry from '@/components/map/TripEntry'

const TripView = ({tripArray, setTripArray, removeFromTrip}) => {
  const onDragEnd = result => {
    const { destination, source, draggableId } = result;

    // dropped outside of list
    if (!destination) {
      return;
    }

    // dropped in same place
    if (
      destination.droppableId == source.droppableId &&
      destination.index == source.index
    ) {
      return;
    }

    // reorder tripArray
    const newTripArray = Array.from(tripArray);
    newTripArray.splice(source.index, 1);
    newTripArray.splice(destination.index, 0, tripArray[source.index]);
    console.log(newTripArray);

    // update tripArray
    setTripArray(newTripArray);
  }
  return (
    <DragDropContext onDragEnd = {onDragEnd}>
      <Droppable droppableId = "trip-table">
        {(provided, snapshot) => (
          <div
            ref = {provided.innerRef}
            {...provided.droppableProps}
            className = "trip-table-container"
          >
            {tripArray.map((placeObject, index) => (
              <TripEntry
                key = {index}
                index = {index}
                placeObject = {placeObject}
                removeFromTrip = {removeFromTrip}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
        
      </Droppable>
    </DragDropContext>
  )
}

export default TripView