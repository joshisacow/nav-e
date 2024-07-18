import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';
import { getAddrDetails } from '@/services/api-requests';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {getGeocode, getLatLng} from 'use-places-autocomplete';
import useWindowDimensions from "@/hooks/useWindowDimensions"
import '@/styles/SearchBar.css'

const autocompleteService = { current: null };

export default function SearchBar({ setPan, setCurrentDetails, setDetailsLoading, clearInfoW, toggleSidebar }) {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    const { height, width} = useWindowDimensions();

    const fetch = React.useMemo(
        () =>
            debounce((request, callback) => {
                autocompleteService.current.getPlacePredictions(request, callback);
            }, 400), []
    );
    React.useEffect(() => {
        let active = true;
        if (!autocompleteService.current && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
        } if (!autocompleteService.current) {
            return undefined;
        } if (inputValue === '') {
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
            if (width < 1200) {
                toggleSidebar();
            }
            const det = await getAddrDetails(val);
            setCurrentDetails({lat, lng}, det);
            setDetailsLoading(false);
            
        } catch(error) {
            console.log("Error: ", error);
        }
    }

    return (
        // search bar
        <Autocomplete
            id="google-map-search"
            className="search-bar-container"
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
            PaperComponent={({ children }) => (
                <Paper style={{ backgroundColor: 'var(--background-one)' }}>{children}</Paper>
            )}
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
                <li className="search-box" key={props.key} {...props}>
                    <Grid className="search-box" container alignItems="center">
                        <Grid className="pin-icon" item>
                            <FontAwesomeIcon icon={faLocationDot} />
                        </Grid>
                        <Grid className="search-bar" item>
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
    );
}
