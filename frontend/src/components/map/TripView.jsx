import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TripEntry from '@/components/map/TripEntry'
import '@/styles/TripView.css'

const TripView = ({ tripArray, setTripArray, removeFromTrip, buildTrip, saveTrip, tripInfo, togglePolyline, showPolyline }) => {
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
        <button className = "build-button" onClick = {() => {buildTrip(tripArray)}}> Build </button>
        
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
          Distance: {(tripInfo.distanceMeters/1000).toFixed(2)} km <br/>
          Time: {Math.floor(tripInfo.duration / 3600)} hr {Math.ceil((tripInfo.duration % 3600) / 60)} min  <br/>
          {showPolyline 
            ? <button className = "toggle-polyline-button" onClick = {() => {togglePolyline()}}> Hide </button>
            : <button className = "toggle-polyline-button" onClick = {() => {togglePolyline()}}> Show </button>
          }
        </div>
      }
    </>
    
  )
}

export default TripView