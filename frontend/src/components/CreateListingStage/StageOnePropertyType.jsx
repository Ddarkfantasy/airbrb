import React from "react";
import { Box, Typography } from "@mui/material";

// choose one property type, if click next or back, it will still be there
const StageOnePropertyType = (props) => {
    const { propertyType, setPropertyType } = { ...props };
    const propertyTypes = [
      'Apartment',
      'House',
      'Self-contained unit',
      'Unique space',
      'Bed and breakfast',
      'Boutique hotel',
    ];
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
        {propertyTypes.map((property, index) => {
          return (
            <Box key={index} className='test-options' name={`option${index}`}
              sx={property === propertyType ? { border: '1.5px solid gray', borderRadius: 3, my: 1, bgcolor:'rgb(255,255,255,0.7)' } : { border: '1.5px solid rgb(255,255,255,0.2)', borderRadius: 3, my: 1, bgcolor:'rgb(255,255,255,0.2)' }}
              onClick={() => { setPropertyType(property); }}>
              <Box sx={{ width: '70vw', minWidth: 206, maxWidth: 400, height: 35, display: 'flex', alignItems: 'center', m: 2, cursor: 'pointer' }}>
              <Typography variant="caption" color="text.primary" className="test-info">{property}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    )
  }

export default StageOnePropertyType;
