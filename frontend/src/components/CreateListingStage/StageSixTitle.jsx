import React from "react";
import { Box, Typography,
  FormControl, InputLabel, OutlinedInput } from "@mui/material";

const StageSixTitle = (props) => {
    const { title, setTitle } = props;
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70vw', minWidth: 240, maxWidth: 400 }}>
        <Typography variant="h6" sx={{ mb: 1, lineHeight: 1.1 }}>What's the title of your listing?</Typography>
        <FormControl sx={{width: '100%'}}>
          <InputLabel htmlFor="title">Title</InputLabel>
          <OutlinedInput
            multiline
            minRows={2}
            id="title"
            label="Title"
            variant="outlined"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            sx={{ bgcolor: 'rgb(255,255,255,0.5)', borderRadius: 3 }}
          />
        </FormControl>
      </Box>
    )
  }

export default StageSixTitle;
