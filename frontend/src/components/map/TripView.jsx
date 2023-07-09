import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TripEntry from '@/components/map/TripEntry'

const TripView = ({tripArray, setTripArray}) => {
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
    <div className = "trip-table-container">
        <DragDropContext onDragEnd = {onDragEnd}>
          <Droppable droppableId = "trip-table">
            {(provided, snapshot) => (
              <div
                ref = {provided.innerRef}
                {...provided.droppableProps}
              >
                {tripArray.map((placeObject, index) => (
                  <TripEntry
                    key = {index}
                    index = {index}
                    placeObject = {placeObject}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
            
          </Droppable>
        </DragDropContext>

    </div>
  )
}

export default TripView