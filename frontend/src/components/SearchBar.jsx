import React, {useState} from 'react'
import usePlacesAutocomplete, {getGeocode, getLatLng} from 'use-places-autocomplete'
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
  } from "@reach/combobox";
import "@reach/combobox/styles.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// TODO: put in config file
// const serverURL = 'https://api-dot-nav-e-387904.uc.r.appspot.com/place';

// local test url
const serverURL = 'http://127.0.0.1:8080/place'

const getAddrDetails = async (address) => {
    const response = await fetch(
        serverURL + "?" + new URLSearchParams({
            "placeID": address
        }), 
        {
            method: "GET"
        }
    );
    const data = await response.json();
    console.log(data);
    return data;
}

const SearchBar = ({setPan, setTripArray, setInfoWindowDetails}) => {
    const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete();
    const [currentAddress, setCurrentAddress] = useState(null);

    const addDest = () => {
        if (currentAddress == null) {
            toast.error("Please enter a destination!", {position: "top-center"});
        }
        else {
            setTripArray(currentAddress);
        } 
    }

    const selectedDest = async (val) => {
        
        clearSuggestions();

        // turn address into latlng
        try {
            const results = await getGeocode({address: val});
            const {lat, lng} = await getLatLng(results[0]);
          
            // center current address
            setPan({lat, lng});
            setCurrentAddress({lat, lng});
            console.log({lat, lng})
            
            // get address details
            const det = await getAddrDetails(results[0].place_id);
            setInfoWindowDetails(det);
            
        }
        catch(error) {
            console.log("Error: ", error);
        }

        // get value from select
        setValue(val, false);
    }
    
    return (
        // search bar
        <div className = "search-bar">
            <Combobox onSelect ={selectedDest}>
                <ComboboxInput 
                    value={value} 
                    onChange={(e) => setValue(e.target.value)} 
                    disabled={!ready} 
                    placeholder="Search destinations"
                    className="combobox"/>

                <ComboboxPopover> 
                    <ComboboxList>
                        
                        {status === "OK" && data.map(({place_id, description}) => (
                            <ComboboxOption key={place_id} value={description} />
                        ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
            
            {/* search button */}
            <button onClick = {addDest} className="search-button">
                Add
            </button>
            <ToastContainer />
            
        </div>
    )
}

export default SearchBar