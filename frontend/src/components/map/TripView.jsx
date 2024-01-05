import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TripEntry from '@/components/map/TripEntry'
import '@/styles/TripView.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

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

    // update tripArray
    setTripArray(newTripArray);
  }

  const exportToGMaps = () => {
    var url = "https://www.google.com/maps/dir/?api=1"

    // add origin and dest
    url += "&origin=" + tripArray[0].position.lat + "%2C" + tripArray[0].position.lng + "&origin_place_id=" + tripArray[0].details.result.place_id;
    url += "&destination=" + tripArray[tripArray.length - 1].position.lat + "%2C" + tripArray[tripArray.length - 1].position.lng + "&destination_place_id=" + tripArray[tripArray.length - 1].details.result.place_id;
    url += "&travelmode=driving"

    if (tripArray.length > 2) {
      // add waypoints
      var waypoints = "&waypoints=";
      var waypoint_place_ids = "&waypoint_place_ids=";
      for (var i = 1; i < tripArray.length - 1; i++) {
        waypoints += tripArray[i].position.lat + "%2C" + tripArray[i].position.lng + "%7C";
        waypoint_place_ids += tripArray[i].details.result.place_id + "%7C";
      }
      // remove last pipe
      waypoints = waypoints.slice(0, -3);
      waypoint_place_ids = waypoint_place_ids.slice(0, -3);
      url += waypoints + waypoint_place_ids;
    }

    document.getElementById('link').href = url;
  }

  return (
    <>
      <div className = "trip-title">
        {tripArray.length < 2 
          ? <h1>Trip</h1>
          : <a id="link" href="" onClick={exportToGMaps} target="_blank" rel="noopener noreferrer">
              Trip 
              <FontAwesomeIcon className="text-xs text-gray-500 ml-1" icon={faArrowUpRightFromSquare} />
            </a>
        }
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