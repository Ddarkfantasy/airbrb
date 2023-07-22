import * as React from 'react';
import Box from '@mui/material/Box';
import {Slider,Typography} from '@mui/material';

const markBedrooms = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 10,
        label: '5',
    },
    {
        value: 20,
        label: '10',
    },
    {
        value: 40,
        label: '20',
    },
    {
        value: 100,
        label: '50',
    },
];

const markPrice = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 10,
        label: '1000',
    },
    {
        value: 20,
        label: '2000',
    },
    {
        value: 100,
        label: '10000',
    },
];
  
/** choose a range */
function MyRangeSlider(props) {
    const {mode,value,setValue} = props;

    const valuetext = (originalValue)=>{
        if (mode === "AUD") {
            return `${Math.floor(originalValue*100)} AUD`;
        } else {
            return Math.floor(originalValue/2).toString();
        }
    }
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
        mode==="AUD"?(
        <Box sx={{ textAlign: 'center', width: "80%" }}>       
            <Typography id="price-range" gutterBottom sx={{textAlign: 'center', lineHeight:1, px: 1, pt: 1, verticalAlign: 'center' }}>
                Price choose: {valuetext(value[0])} to {valuetext(value[1])}
            </Typography>
            <Slider
            track="inverted"
            aria-labelledby="price-range"
            value={value}
            getAriaValueText={valuetext}
            marks={markPrice}
            onChange={handleChange}
            />
      </Box>
        ):(
            <Box sx={{ textAlign: 'center', width: "80%" }}>
                <Typography id="bedroom-number" gutterBottom sx={{textAlign: 'center', lineHeight:1, px: 1, pt: 1, verticalAlign: 'center' }}>
                    Bedroom number: {valuetext(value[0])} to {valuetext(value[1])}
                </Typography>
                <Slider
                track="inverted"
                aria-labelledby="bedroom-number"
                getAriaValueText={valuetext}
                value={value}
                marks={markBedrooms}
                onChange={handleChange}
                />
            </Box>
        )
    );
}

export default MyRangeSlider;
