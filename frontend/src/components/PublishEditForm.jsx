import React, { useState } from 'react';
import { Grid, Box, Typography, Paper, Button, Select, MenuItem } from "@mui/material";
import { DateObject, Calendar } from "react-multi-date-picker";
import "react-multi-date-picker/styles/colors/purple.css"
import { publishListingRequest } from '../config/requests';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const PublishEditForm = (props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { itemInfo } = { ...props };// id, availability, published
  const [displayMonths, setDisplayMonths] = useState(3);
  const [allDates, setAllDates] = useState([])

  const publish = async () => {
    if (allDates.length > 0) {
      const res = await publishListingRequest(itemInfo.id, { availability: [allDates.map(date => date.format("DD/MM/YYYY"))] });
      if (res.ok) {
        enqueueSnackbar('Listing published successfully', { variant: 'success' });
        navigate('/hosting');
      }
    } else {
      enqueueSnackbar("Please choose at least one date", { variant: 'warning' });
    }
  }

  return (
    <React.Fragment>
    <Box display='flex' flexDirection='column-reverse' sx={{ width: '100%', mb: '40px' }}>
      <Grid container spacing={{ xs: 2, sm:2, md: 2 }} columns={{ xs: 2, sm: 4, }} mx={2} sx={{ p: 1 }}>
        <Grid item xs={2}>
        </Grid>
      </Grid>

      {/* show all selected date in the panel */}
      <Paper elevation={20} sx={{ minHeight: 100, mx: 2, mt: 0, background: 'linear-gradient(to left top, #f83734, #673af8 )' }}>
        <Grid container spacing={1} columns={{ xs: 2, sm: 4, md: 6, lg: 8, xl: 12}} sx={{ mb: 2, mt: 1 }}>
          {
            [...Array(displayMonths).keys()].map((month) => {
              return (
                <Grid item xs={2} sm={2} md={2} key={month} display='flex' justifyContent='center'>
                  <Paper elevation={10} id={month}>
                    <Calendar
                      value={allDates}
                      multiple={true}
                      className="purple"
                      onChange={(dates) => {
                        setAllDates(dates)
                      }}
                      currentDate={new DateObject().add(month, "month")}
                      minDate={new DateObject().add(month, "month").toFirstOfMonth()}
                      maxDate={new DateObject().add(month, "month").toLastOfMonth()}/>
                  </Paper>
                </Grid>
              )
            })
          }
        </Grid>
      </Paper>
      
      {/* display how many months in the calendar */}
      <Box display='flex' sx={{ m: 1, mb: 1 }}>
        <Typography variant="h6" sx={{ m: 1, mt: 0.5 }}>
          Availability in
        </Typography>
        <Select value={displayMonths} onChange={(e) => setDisplayMonths(e.target.value)} sx={{height:40}}>
          {[...Array(12).keys()].map((item) => (
            <MenuItem key={item} value={item + 1}>
              {item + 1 }
            </MenuItem>
          ))}
        </Select>
        <Typography variant="h6" sx={{ m: 1, mt: 0.5 }}>
          months
        </Typography>
      </Box>
      
    </Box>
      {/* save button */}
    <Paper elevation={20} sx={{ width: '101%', height: 62, position: 'fixed', bottom: -3, left: -1, background: 'white', zIndex: 100 }}>
      <Box sx={{ width: '101%', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', background: 'white' }}>
        <Button name="publish" onClick={publish}>Publish</Button>
      </Box>
    </Paper>
    </React.Fragment>
  )
}

export default PublishEditForm;