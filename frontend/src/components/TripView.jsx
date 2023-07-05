import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TripEntry from '@/components/TripEntry'

const TripView = ({tripArray}) => {
  const onDragEnd = result => {
    //TODO: reorder tripArray
  }
  console.log(tripArray);
  console.log("bye");
  return (
    <div className = "trip-table-container">
        <DragDropContext onDragEnd = {onDragEnd}>
          <Droppable droppableId = "trip-table">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref = {provided.innerRef}

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