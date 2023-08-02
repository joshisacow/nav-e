import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import { getAddrDetails } from '@/services/api-requests';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {getGeocode, getLatLng} from 'use-places-autocomplete';
import IconButton from '@/components/utils/IconButton';
import '@/styles/SearchBar.css'

const autocompleteService = { current: null };

export default function SearchBar({setPan, setCurrentDetails, setDetailsLoading, addToPoints, clearInfoW, currentMarker}) {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    const fetch = React.useMemo(
        () =>
        debounce((request, callback) => {
            autocompleteService.current.getPlacePredictions(request, callback);
        }, 400),
        [],
    );
    React.useEffect(() => {
        let active = true;

        if (!autocompleteService.current && window.google) {
        autocompleteService.current =
            new window.google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
        return undefined;
        }

        if (inputValue === '') {
        setOptions(value ? [value] : []);
        return undefined;
        }

        fetch({ input: inputValue }, (results) => {
        if (active) {
            let newOptions = [];

            if (value) {
            newOptions = [value];
            }

            if (results) {
            newOptions = [...newOptions, ...results];
            }

            setOptions(newOptions);
        }
        });

        return () => {
        active = false;
        };
    }, [value, inputValue, fetch]);

    const selectedDest = async (val) => {

        clearInfoW();
        // turn address into latlng
        try {
            
            const results = await getGeocode({placeId: val});
            const {lat, lng} = await getLatLng(results[0]);

            // center current address
            setPan({lat, lng});
            console.log({lat, lng})
            
            // loading spinner while fetching details
            
            setDetailsLoading(true);
            const det = await getAddrDetails(val);
            setCurrentDetails(det);
            setDetailsLoading(false);
            
        }
        catch(error) {
            console.log("Error: ", error);
        }
    }

    return (
        // search bar
        <div className = "search-bar">

            <Autocomplete
                id="google-map"
                sx={{ width: 300 }}
                getOptionLabel={(option) =>
                    typeof option === 'string' ? option : option.description
                }
                filterOptions={(x) => x}
                options={options}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={value}
                noOptionsText="No locations"
                clearOnEscape
                onChange={(event, newValue) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                    if (newValue && newValue !== "") {
                        selectedDest(newValue.place_id);
                    }
                }}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue)
                }}
                renderInput={(params) => <TextField {...params} label="Add a location" />}
                renderOption={(props, option) => {
                    const matches =
                    option.structured_formatting.main_text_matched_substrings || [];

                    const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match) => [match.offset, match.offset + match.length]),
                    );

                    return (
                    <li {...props}>
                        <Grid container alignItems="center">
                        <Grid item sx={{ display: 'flex', width: 44 }}>
                            <FontAwesomeIcon icon={faLocationDot} />
                        </Grid>
                        <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                            {parts.map((part, index) => (
                            <Box
                                key={index}
                                component="span"
                                sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                            >
                                {part.text}
                            </Box>
                            ))}
                            <Typography variant="body2" color="text.secondary">
                            {option.structured_formatting.secondary_text}
                            </Typography>
                        </Grid>
                        </Grid>
                    </li>
                    );
                }}
            />
            {/* search button */}
            <IconButton icon="plus" onClick = {() => {addToPoints(currentMarker)}} className="search-add-button" />

        </div>

    );
    }
