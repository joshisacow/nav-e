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

const SearchBar = ({setPan}) => {
    const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete();
    
    const handleSelect = async (val) => {

        // get value from select
        setValue(val, false);
        clearSuggestions();

        // turn address into latlng
        try {
            const results = await getGeocode({address: val});
            const {lat, lng} = await getLatLng(results[0]);
            setPan({lat, lng});
            console.log(lat, lng);
            // TODO: addToTrip(lat, lng);
        }
        catch(error) {
            console.log("Error: ", error);
        }
    }
    
    return (
        // search bar
        <div>
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

        </div>
    )
}

export default SearchBar