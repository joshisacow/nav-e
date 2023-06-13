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

const SearchBar = ({setPan, setTripArray}) => {
    const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete();
    
    const [currentAddress, setCurrentAddress] = React.useState(null);

    const handleClick = async () => {
        if (currentAddress == null) {
            alert("Please enter a destination!");
        }
        else {
            setTripArray(currentAddress);
        }

    }

    const handleSelect = async (val) => {

        // get value from select
        setValue(val, false);
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
    }
    
    return (
        // search bar
        <div className = "search-bar">
            <Combobox onSelect ={handleSelect}>
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
            <button onClick = {handleClick} className="search-button">
                Add
            </button>

        </div>
    )
}

export default SearchBar