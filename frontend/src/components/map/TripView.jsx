import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TripEntry from '@/components/map/TripEntry'
import '@/styles/TripView.css'

const TripView = ({ tripArray, setTripArray, removeFromTrip, buildTrip, saveTrip, tripInfo }) => {
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
    <>
      <div className = "trip-title">
        <h1>Trip</h1>
        <button className = "save-button" onClick = {() => {saveTrip()}}> Save </button>
        <button className = "build-button" onClick = {() => {buildTrip()}}> Build </button>
      </div>
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
      {tripInfo.duration && 
        <div className = "trip-info">
          Total Distance: {tripInfo.distanceMeters/1000} km <br/>
          Total Time: {Math.floor(tripInfo.duration / 3600)} hr {Math.ceil((tripInfo.duration % 3600) / 60)} min  <br/>
        </div>
      }
    </>
    
  )
}

export default TripView