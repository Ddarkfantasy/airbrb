import * as React from 'react';
import {
    Autocomplete,
    Chip,
    TextField,
    SwipeableDrawer,
    Toolbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Box,
    AppBar,
    Stack
} from '@mui/material';
import { Search,FilterList } from '@mui/icons-material';
import DayRangeChoose from './DayRangeChoose';
import MyRangeSlider from './MyRangeSlider';
import MySeparator from './MySeparator';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

function SwipeableEdgeDrawer(props) {
  // for container
  const { window } = props;
  // control the filter open
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const container = window !== undefined ? () => window().document.body : undefined;

  // control the changed search values
  const [searchInput, setSearchInput] = React.useState([]);
  const [bedrooms, setBedrooms] = React.useState([0,100]);
  const [maxDate, setMaxDate] = React.useState(null);
  const [minDate, setMinDate] = React.useState(null);
  const [prices, setPrices] = React.useState([0,100]);
  const [ratingSort, setRatingSort] = React.useState(0);
  // for error
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = React.useState("");
  useEffect(() => {
    if(error!==""){
      enqueueSnackbar(error, { variant: 'warning' });
    }
  }, [error,enqueueSnackbar]);
  

  // from parent to set
  const {saveSearchValues} = props;
  const reFilt = ()=>{
    const newSearchValues = {
      searchInput:[...searchInput],
      minBedrooms:Math.floor(bedrooms[0]/2),
      maxBedrooms:Math.floor(bedrooms[1]/2),
      minDate:minDate,
      maxDate:maxDate,
      minPrice:Math.floor(prices[0]*100),
      maxPrice:Math.floor(prices[1]*100),
      ratingSort:ratingSort
    };
    saveSearchValues(newSearchValues);
  }
  // control the date choose

  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
        <Box sx={{ m: 2, width: '100%'}} >
          <Autocomplete
              multiple
              id="searchInput"
              options={searchInput}
              value={searchInput}
              onChange={(event, newValue) => {
                setSearchInput(newValue);
              }}
              freeSolo
              renderTags={(value, getTagProps) =>{
                return value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))}
              }
              renderInput={(params) => {
                return(
                <TextField
                  id="searchInputText"
                  {...params}
                  variant="filled"
                  label="Search"
                  placeholder="Search for the title and address, please enter to add a tag"
                />
              )}}
            />
        </Box>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
              spacing={0}
            >
              <IconButton onClick={toggleDrawer(true)} sx={{ mt: 1 }} aria-label="open filter" edge="end" name="openFilter">
                <FilterList sx={{ fontSize: 30 }}/>
              </IconButton>
              {/* save to send search */}
              <IconButton onClick={reFilt} sx={{ mt: 1 }} edge="end" name="search">
                <Search sx={{ fontSize: 30 }}/>
              </IconButton>
            </Stack>
        </Toolbar>
      </AppBar>
    </Box>
    <SwipeableDrawer
      container={container}
      anchor="bottom"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <MySeparator/>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
      >
        <DayRangeChoose minDate={minDate} maxDate={maxDate} setMinDate={setMinDate} setMaxDate={setMaxDate} setError={setError}/>
        <MyRangeSlider mode="Bedroom" value={bedrooms} setValue={setBedrooms}/>
        <MyRangeSlider mode="AUD" value={prices} setValue={setPrices}/>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="rating-sort-label">Rating Sort</InputLabel>
          <Select
            labelId="rating-sort-label"
            id="rating-sort"
            value={ratingSort}
            label="rating-sort"
            onChange={(event)=>setRatingSort(event.target.value)}
          >
            <MenuItem value={0}>None</MenuItem>
            <MenuItem value={1}>Decrease</MenuItem>
            <MenuItem value={-1}>Increase</MenuItem>
          </Select>
        </FormControl>         
      </Stack>
      </SwipeableDrawer>
    </>
  );
}


export default SwipeableEdgeDrawer;
