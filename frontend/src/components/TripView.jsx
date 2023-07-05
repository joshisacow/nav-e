import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd';
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
          {tripArray.map((placeObject, index) => (
            <TripEntry
              key = {index}
              index = {index}
              placeObject = {placeObject}
            />
          ))}
        </DragDropContext>

    </div>
  )
}

export default TripView