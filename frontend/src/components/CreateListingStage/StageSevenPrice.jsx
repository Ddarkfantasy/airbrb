import React from "react";
import { Box, Typography,
  FormControl, InputLabel, OutlinedInput } from "@mui/material";

const StageSevenPrice = (props) => {
    const { price, setPrice } = props;
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70vw', minWidth: 240, maxWidth: 400 }}>
        <Typography variant="h6" sx={{ mb: 1, lineHeight: 1.1 }}>How much for one night?</Typography>
        <FormControl sx={{width: '100%'}}>
          <InputLabel htmlFor="price">Price</InputLabel>
          <OutlinedInput
            id="price"
            label="Price"
            variant="outlined"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            sx={{ bgcolor: 'rgb(255,255,255,0.5)', borderRadius: 3 }}
          />
        </FormControl>
      </Box>
    )
  }

export default StageSevenPrice;
