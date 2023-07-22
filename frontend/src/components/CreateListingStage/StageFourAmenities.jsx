import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { amenitiesConfig } from "../../config/amenities.js";


// choose multiple amenities and their types
const StageFourAmenities = (props) => {
    const { amenities, setAmenities } = { ...props };
    const AmenitiesLayout = ({oneTypeAmenities, type}) => {
      return (
        <Grid container
        spacing={{ xs: 1, sm:2, md: 2 }} columns={{ xs: 6, sm: 8, md: 8 }} mx={2}>
          {Object.keys(oneTypeAmenities).map((amenity, index) => (
            <Grid item xs={2} sm={2} md={2} key={`Amenity${type}${index}`}>
              <Box name={`Amenity${type}${index}`} sx={{height:100, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center', bgcolor: amenities.includes(amenity) ? 'rgb(255,255,255,0.7)' : 'rgb(255,255,255,0.2)',
                border: amenities.includes(amenity) ? '1.5px solid gray' : '1.5px solid rgb(255,255,255,0.2)',
                borderRadius: 3, cursor: 'pointer' 
              }}
              onClick={() => {
                if (amenities.includes(amenity)) {
                  setAmenities(amenities.filter((a) => a !== amenity));
                } else {
                  setAmenities([...amenities, amenity]);
                }
              }}
  
              >
                {oneTypeAmenities[amenity]}
                <Typography variant="caption" sx={{textAlign: 'center', lineHeight:1, px: 1, pt: 1 }}>{amenity}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      );
    };
  
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '70vw', minWidth: 240, maxWidth: 400 }}>
        {/* Standout amenities */}
        <Typography variant="h6" sx={{ mb: 1 }}>Do you have any standout amenities?</Typography>
        <AmenitiesLayout oneTypeAmenities={amenitiesConfig.standout} type="standout" />
        
        {/* Basic amenities */}
        <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>What about these guest favourites?</Typography>
        <AmenitiesLayout oneTypeAmenities={amenitiesConfig.basics} type="basics" />
        
        {/* Safety amenities */}
        <Typography variant="h6" sx={{ my: 1, mt: 2 }}>Do you have any of these safety items?</Typography>
        <AmenitiesLayout oneTypeAmenities={amenitiesConfig.safety} type="safety" />
      </Box>
    )
  }

  export default StageFourAmenities;