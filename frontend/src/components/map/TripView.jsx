import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TripEntry from '@/components/map/TripEntry'
import '@/styles/TripView.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faFloppyDisk, faHammer } from '@fortawesome/free-solid-svg-icons';
import { Typography } from '@mui/material';

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

    // address approach
    url += "&origin=" + tripArray[0].details.result.formatted_address.replace(',', '%2C').replace(' ', '+');
    url += "&destination=" + tripArray[tripArray.length - 1].details.result.formatted_address.replace(',', '%2C').replace(' ', '+');
    url += "&travelmode=driving"

    if (tripArray.length > 2) {
      // add waypoints
      var waypoints = "&waypoints=";
      for (var i = 1; i < tripArray.length - 1; i++) {
        waypoints += tripArray[i].details.result.formatted_address.replace(',', '%2C').replace(' ', '+') + "%7C";
      }
      // remove last pipe
      waypoints = waypoints.slice(0, -3);
      url += waypoints;
    }

    // coordinates + place_id approach
    // url += "&origin=" + tripArray[0].position.lat + "%2C" + tripArray[0].position.lng + "&origin_place_id=" + tripArray[0].details.result.place_id;
    // url += "&destination=" + tripArray[tripArray.length - 1].position.lat + "%2C" + tripArray[tripArray.length - 1].position.lng + "&destination_place_id=" + tripArray[tripArray.length - 1].details.result.place_id;
    // url += "&travelmode=driving"

    // if (tripArray.length > 2) {
    //   // add waypoints
    //   var waypoints = "&waypoints=";
    //   var waypoint_place_ids = "&waypoint_place_ids=";
    //   for (var i = 1; i < tripArray.length - 1; i++) {
    //     waypoints += tripArray[i].position.lat + "%2C" + tripArray[i].position.lng + "%7C";
    //     waypoint_place_ids += tripArray[i].details.result.place_id + "%7C";
    //   }
    //   // remove last pipe
    //   waypoints = waypoints.slice(0, -3);
    //   waypoint_place_ids = waypoint_place_ids.slice(0, -3);
    //   url += waypoints + waypoint_place_ids;
    // }

    console.log(url);
    document.getElementById('link').href = url;
  }

  return (
    <>
      <div className = "trip-title">
        {tripArray.length < 2 
          ? <Typography sx={{ fontWeight: 500, fontSize: 16 }}>Trip</Typography>
          : <a id="link" href="" onClick={exportToGMaps} className="trip-link" target="_blank" rel="noopener noreferrer">
              <Typography sx={{ fontWeight: 500, fontSize: 16 }}>
                Trip
                <FontAwesomeIcon className="text-xs text-gray-500 ml-1 mb-0.5" icon={faArrowUpRightFromSquare} />
              </Typography> 
            </a>
        }
        <button 
          className = "save-button text-sm font-bold py-1.5 px-3 rounded-full" 
          onClick = {() => {saveTrip()}}
        > 
          <FontAwesomeIcon className="text-xs mr-1" icon={faFloppyDisk} /> 
          Save
        </button>
        <button 
          className = "build-button text-sm font-bold py-1.5 px-3 rounded-full" 
          onClick = {() => {buildTrip(tripArray)}}
        > 
          <FontAwesomeIcon className="text-xs mr-1" icon={faHammer} />
          Build 
        </button>
        
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
          <Typography variant='body2'>
            Distance: {(tripInfo.distanceMeters/1000).toFixed(2)} km <br/>
            Time: {Math.floor(tripInfo.duration / 3600)} hr {Math.ceil((tripInfo.duration % 3600) / 60)} min  <br/>
          </Typography>
          <button 
            className = "bg-blue-400 hover:bg-blue-500 text-white text-sm font-bold py-1.5 px-3 ml-auto rounded" 
            onClick = {() => {togglePolyline()}}
          >
            { showPolyline ? 'Show' : 'Hide' }
          </button>
        </div>
      }
    </>
    
  )
}

export default TripView