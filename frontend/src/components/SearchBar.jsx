import React from 'react'
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

const SearchBar = ({setPan, setTripArray}) => {
    const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete();
    
    const [currentAddress, setCurrentAddress] = React.useState(null);

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
            console.log(lat, lng);
            //delete
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
                        {status === "OK" && data.map(({id, description}) => (
                            <ComboboxOption key={id} value={description} />
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