import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from "@mui/material";
import { locationConfig } from '../../config/locations.js';

// select state, city and input street
const StageThreeAddress = (props) => {
    const { state, setState, city, setCity, street, setStreet } = { ...props };
    const handleStateChange = (event) => {
      setCity('');
      setState(event.target.value);
    }
    const handleCityChange = (event) => setCity(event.target.value);
  
    return (
      <React.Fragment>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '70vw', minWidth: 240, maxWidth: 400 }} >
          {/* select state */}
          <FormControl sx={{ m: 1 }}>
            <InputLabel id="state-select-inputlabel">State</InputLabel>
            <Select
              labelId="select-state-label"
              id="select-state"
              value={state}
              onChange={handleStateChange}
              input={<OutlinedInput label="State" />}
              sx={{ bgcolor: 'rgb(255,255,255,0.6)', borderRadius: 3 }}
            >
              {Object.keys(locationConfig).map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  name={name}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {/* select city */}
          <FormControl sx={{ m: 1 }}>
            <InputLabel id="city-select-inputlabel">City</InputLabel>
            <Select
              labelId="city-state-label"
              id="select-city"
              value={city}
              onChange={handleCityChange}
              input={<OutlinedInput label="City" />}
              sx={{ bgcolor: 'rgb(255,255,255,0.6)', borderRadius: 3 }}
            >
              {
                locationConfig[state].map((city, index) => (
                  <MenuItem
                    key={`city${index}`}
                    value={city}
                    name={city}
                  >
                    {city}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
  
          {/* input street */}
          <FormControl sx={{ m: 1 }}>
            <InputLabel htmlFor="street-input">Detailed Address</InputLabel>
            <OutlinedInput
              multiline
              rows={4}
              id="street-input"
              defaultValue={street}
              onBlur={(event) => setStreet(event.target.value)}
              label="Detailed Address"
              sx={{ bgcolor: 'rgb(255,255,255,0.6)', borderRadius: 3 }}
            />
          </FormControl>
        </Box>
      </React.Fragment>
    )
  }

export default StageThreeAddress;