import { useEffect,useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { LocalizationProvider,DatePicker } from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Typography from '@mui/material/Typography';

const getStart=(minDate,maxDate)=>{
  if(minDate && maxDate && minDate.isBefore(maxDate)){
    return minDate;
  }else{
    return null;
  }
}

const getEnd=(minDate,maxDate)=>{
  if(minDate && maxDate && minDate.isBefore(maxDate)){
    return maxDate;
  }else{
    return null;
  }
}

// customised for date range to choose
function DayRangeChoose(props) {
    // from parent provider when the date valid then change to parent
  const {minDate,maxDate,setMinDate,setMaxDate,setError} = props;
  const [start, setStart] = useState(getStart(minDate,maxDate));
  const [end, setEnd] = useState(getEnd(minDate,maxDate));

  // change every time to see if the date range is valid
  useEffect(() => {
    if(start && end){
        // remove the time zone influence
        const startDate = dayjs(start.format("DD/MM/YYYY"), "DD/MM/YYYY");
        const endDate = dayjs(end.format("DD/MM/YYYY"), "DD/MM/YYYY");
        if (!startDate.isBefore(endDate)) {
            // not valid range because the start < end
            setMinDate(null);
            setMaxDate(null);
            setError('End Date must after the Start');
            setStart(null);
            setEnd(null);
        }else{
            // send back to parent
            setMinDate(startDate.clone());
            setMaxDate(endDate.clone());
        }
    }
  }, [start,end,setMinDate,setMaxDate,setError]);
  
  return (
    <Box
      sx={{
      display: 'flex',
      // responsive to change flex direction
      flexDirection: { xs: 'column', md: 'row' },
      width: 'fit-content',
      borderRadius: 1,
      '& svg': {
        m: 1.5,
      },
      '& hr': {
        mx: 0.5,
      },
      }}
    >
    <LocalizationProvider dateAdapter={AdapterDayjs} className='test-date'>
      <DatePicker
        label="Start"
        value={start}
        className='test-start'
        onChange={(newValue) => {
        setStart(newValue);
        }}
        renderInput={(params) => <TextField name="startDate" {...params} />}
      />
    </LocalizationProvider>
    <Typography variant="caption" sx={{textAlign: 'center', lineHeight:1, px: 1, pt: 1, verticalAlign: 'center' }}>To</Typography>
    <LocalizationProvider dateAdapter={AdapterDayjs} className='test-date'>
      <DatePicker
        label="End"
        value={end}
        className='test-end'
        onChange={(newValue) => {
        setEnd(newValue);
        }}
        renderInput={(params) => <TextField name="endDate" {...params} />}
      />
    </LocalizationProvider>
    </Box>
  );
}


export default DayRangeChoose;
