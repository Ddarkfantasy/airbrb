import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import StageOnePropertyType from '../components/CreateListingStage/StageOnePropertyType.jsx';
import StageTwoRoomNumber from '../components/CreateListingStage/StageTwoRoomNumber.jsx';
import StageThreeAddress  from '../components/CreateListingStage/StageThreeAddress.jsx';
import StageFourAmenities from '../components/CreateListingStage/StageFourAmenities';
import StageFivePictures from '../components/CreateListingStage/StageFivePictures.jsx';
import StageSixTitle from '../components/CreateListingStage/StageSixTitle';
import StageSevenPrice from '../components/CreateListingStage/StageSevenPrice';
import HostingHeader from '../components/HostingHeader.jsx';
import { useSnackbar } from 'notistack';
import { createListingRequest, updateListingRequest, getSingleListing } from '../config/requests.js';
import UploadJsonFile from '../components/UploadJsonFile.jsx';
import { locationConfig } from '../config/locations.js';
import { amenitiesConfig } from "../config/amenities.js";

// create a new listing, there are 7 stages to finish the form
const CreateListingPage = (props) => {
  const [onEditPage] = useState(props?.listingId);
  // make sure user get a message when some things wrong
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  // set which stage to display
  const [stage, setStage] = useState(0);
  // set the data for each stage
  const [propertyType, setPropertyType] = useState('Apartment');
  const [rooms, setRooms] = useState([{ singleBed: 1 }]);
  const [bathroomNumber, setBathroomNumber] = useState(1);
  const [state, setState] = useState('NSW');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [thumbnail, setThumbnail] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  // upload the json file to get the json data and set to each stage
  const [jsonValue, setJsonValue] = useState(null);

  useEffect(() => {
    if (jsonValue) {
      // set to each stage
      try {
        // title
        if (jsonValue.title   && typeof jsonValue.title === "string") {
          setTitle(jsonValue.title);
        }
        // address
        if (jsonValue.address) {
          if (jsonValue.address.street && typeof jsonValue.address.street === "string") {
            setStreet(jsonValue.address.street);
          }
          if (jsonValue.address.state && typeof jsonValue.address.state === "string") {
            // check state name is valid
            if (jsonValue.address.state in locationConfig) {
              setState(jsonValue.address.state);
              if (jsonValue.address.city && typeof jsonValue.address.city === "string" ) {
                // check city name is valid
                if (locationConfig[jsonValue.address.state].includes(jsonValue.address.city)) {
                  setCity(jsonValue.address.city);
                }
              }
            }
          }
          
        }
        if (jsonValue.price) {
          // check if the price can be used
          const newPrice = parseInt(jsonValue.price);
          setPrice(newPrice);
        }
        if (jsonValue.thumbnail && typeof jsonValue.thumbnail === "string") {
          setThumbnail(jsonValue.thumbnail);
        }
        if (jsonValue.metadata) {
          if (jsonValue.metadata.rooms) {
            const roomTypes = ['singleBed', 'kingBed', 'sofaBed', 'crib', 'other'];
            const newRooms = [];
            for (const room of jsonValue.metadata.rooms) {
              const roomData = {};
              for (const key in room) {
                if (roomTypes.includes(key)) {
                  roomData[key] = parseInt(room[key]);
                }
              }
              newRooms.push(roomData);
            }
            setRooms(newRooms);
          }
          if (jsonValue.metadata.bathrooms) {
            const number = parseInt(jsonValue.metadata.bathrooms);
            setBathroomNumber(number);
          }
          if (jsonValue.metadata.propertyType && typeof jsonValue.metadata.propertyType === "string") {
            // check if valid
            const propertyTypes = ['Apartment','House','Self-contained unit','Unique space','Bed and breakfast','Boutique hotel' ];
            if (propertyTypes.includes(jsonValue.metadata.propertyType)) {
              setPropertyType(jsonValue.metadata.propertyType);
            }
          }
          if (jsonValue.metadata.amenities) {
            const newAmenties = [];
            for (const amenty of jsonValue.metadata.amenities) {
              // check if it is valid
              if (typeof amenty === "string") {
                if (amenty in amenitiesConfig.standout || amenty in amenitiesConfig.basics || amenty in amenitiesConfig.safety) {
                  newAmenties.push(amenty);
                }
              }
            }
            setAmenities(newAmenties);
          }
          if (jsonValue.metadata.images) {
            const newImages=[];
            for (const image of jsonValue.metadata.images) {
              if (typeof image === "string") {
                newImages.push(image);
              }
            }
            setImages(newImages);     
          }
          if (jsonValue.metadata.videoUrl && typeof jsonValue.metadata.videoUrl === "string" ) {
            setVideoUrl(jsonValue.metadata.videoUrl);
          }
        }
      } catch (error) {
        enqueueSnackbar('Failed, try new file?', { variant: 'warning' });
      }
  }
  }, [jsonValue,enqueueSnackbar]);
  

  // if can't find token, go to home page
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    } else if (onEditPage) {
      const fetchListingData = async () => {
        const res = await getSingleListing(props.listingId);
        if (res.ok) {
          const data = res.data.listing;
          if (Object.keys(data).length !== 0) {
            // if the listing is not belong to the user, go to hosting home page
            if (data.owner !== localStorage.getItem('email')) {
              enqueueSnackbar('failed to fetch listing data', { variant: 'warning' });
              navigate('/hosting');
            } else{
              setState(data.address.state);
              setPropertyType(data.metadata.propertyType);
              setRooms(data.metadata.rooms);
              setBathroomNumber(data.metadata.bathrooms);
              setAmenities(data.metadata.amenities);
              setStreet(data.address.street);
              setThumbnail(data.thumbnail);
              setImages(data.metadata.images);
              setVideoUrl(data.metadata.videoUrl);
              setTitle(data.title);
              setPrice(data.price);
              setLoading(false);
              setCity(data.address.city);
            }
          } else {
            enqueueSnackbar('failed to fetch listing data', { variant: 'warning' });
            navigate('/hosting');
          }
        } else {
          enqueueSnackbar(res.error, { variant: 'error' });
          navigate('/hosting');
        }
      };
      fetchListingData();
    } else {
      setLoading(false);
    }
  }, [enqueueSnackbar, navigate, onEditPage, props.listingId]);

  // validate data for stage 1 (property type)
  const nextStageOne = async () => {
    setStage(stage + 1);
    
  }

  // validate data for stage 2 (room number)
  const nextStageTwo = async () => {
    const newRooms = rooms.filter(room => Object.keys(room).length > 0);
    if (newRooms.length > 0) {
      setStage(stage + 1);
      setRooms(newRooms);
    } else {
      enqueueSnackbar('Please add at least one room', { variant: 'info' });
    }
  }

  // validate data for stage 3 (address)
  const nextStageThree = () => {
    if(!city) {
      enqueueSnackbar('Please select you city', { variant: 'info' });
    } else if(!street) {
      enqueueSnackbar('Please enter your street', { variant: 'info' });
    } else {
      setStage(stage + 1);
    }
  }

  // validate data for stage 4 (amenities)
  const nextStageFour = () => {
    setStage(stage + 1);
  }

  // validate data for stage 5 (pictures)
  const nextStageFive = () => {
    if (thumbnail) {
      // change youtube url to embed url
      if (videoUrl.includes('youtube')) {
        const embedUrl = videoUrl.replace('watch?v=', 'embed/');
        setVideoUrl(embedUrl);
      }
      setStage(stage + 1);
    } else {
      enqueueSnackbar('Please upload a main picture', { variant: 'info' });
    }
  }

  // validate data for stage 6 (title)
  const nextStageSix = () => {
    if (title) {
      setStage(stage + 1);
    } else {
      enqueueSnackbar('Please enter a title', { variant: 'info' });
    }
  }

  // submit the form
  const onFinish = async () => {
    const data = {
      title: title,
      address: {
        state: state,
        city: city,
        street: street,
      },
      price: price,
      thumbnail: thumbnail,
      metadata: {
        rooms: rooms, // [{singleBed: 1}, {singleBed: 2, doubleBed: 1}]
        bathrooms: bathroomNumber, // 3
        propertyType: propertyType, // Apartment
        amenities: amenities, // ['wifi', 'airConditioner']
        images: images, // ['url1', 'url2']
        videoUrl: videoUrl, // 'url'
      },
    }
    if (!onEditPage) {
      const res = await createListingRequest(data);
      if(res.ok) {
        enqueueSnackbar('Create listing successfully', { variant: 'success' });
        navigate('/hosting');
      }else {
        enqueueSnackbar(res.error, { variant: 'error' });
      }
    } else {
      const res = await updateListingRequest(props.listingId, data);
      if(res.ok) {
        enqueueSnackbar('Update successfully', { variant: 'success' });
        navigate('/hosting');
      }else {
        enqueueSnackbar(res.error, { variant: 'error' });
      }
    }
  }

  // validate data for stage 7 (price)
  const nextStageSeven = () => {
    // check price is a number
    if (!isNaN(price)) {
      if (price > 0) {
        onFinish();
      } else {
        enqueueSnackbar('Please enter a price', { variant: 'info' });
      }
    } else {
      setPrice(0);
    }
  }

  // go back to previous stage
  const lastStage = () => {
    setStage(stage - 1);
  }

  return (
    <React.Fragment >
      <Box sx={{ minHeight: '100vh', maxHeight: '999vh', background: 'linear-gradient(to left top, #f83734, #673af8 )' }}>
      <HostingHeader />
        { loading ? null :
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', pb: '75px', pt: '30px' }}>
          <Box sx={{ bgcolor: 'rgb(255,255,255,0.6)', p: 2, borderRadius: 4 }}>
            {/* {stage === -1 && } */}
            {stage === 0 && <StageOnePropertyType propertyType={propertyType} setPropertyType={setPropertyType}/>}
            {stage === 1 && <StageTwoRoomNumber rooms={rooms} setRooms={setRooms} bathroomNumber={bathroomNumber} setBathroomNumber={setBathroomNumber}/>}
            {stage === 2 && <StageThreeAddress state={state} setState={setState} city={city} setCity={setCity} street={street} setStreet={setStreet}/>}
            {stage === 3 && <StageFourAmenities amenities={amenities} setAmenities={setAmenities}/>}
            {stage === 4 && <StageFivePictures images={images} setImages={setImages} videoUrl={videoUrl} setVideoUrl={setVideoUrl} thumbnail={thumbnail} setThumbnail={setThumbnail}/>}
            {stage === 5 && <StageSixTitle title={title} setTitle={setTitle}/>}
            {stage === 6 && <StageSevenPrice price={price} setPrice={setPrice}/>}
          </Box>     
        </Box>}
      </Box>
      { loading ? null :
      <Box sx={{ width: '101%', height: 62, position: 'fixed', bottom: -3, left: -1, background: 'white', zIndex: 10 }}>
        <Box sx={{ width: `calc((${stage} + 1) * 14.3% )`, height: 6, position: 'absolute', bgcolor: 'blueviolet'}}/>
        <Box sx={{ width: '101%', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', background: 'white' }}>
          {stage > 0 && <Button onClick={lastStage} >Back</Button>}
          {stage === 0 && <UploadJsonFile setJsonValue={setJsonValue}/>}
          {stage === 0 && <Button name="stage1next" onClick={nextStageOne} >Next</Button>}
          {stage === 1 && <Button name="stage2next" onClick={nextStageTwo} >Next</Button>}
          {stage === 2 && <Button name="stage3next" onClick={nextStageThree} >Next</Button>}
          {stage === 3 && <Button name="stage4next" onClick={nextStageFour} >Next</Button>}
          {stage === 4 && <Button name="stage5next" onClick={nextStageFive} >Next</Button>}
          {stage === 5 && <Button name="stage6next" onClick={nextStageSix} >Next</Button>}
          {stage === 6 && <Button name="submitListing" onClick={nextStageSeven} >{onEditPage? 'Save': 'Create'}</Button>}
        </Box>
      </Box>}
    </React.Fragment>
  );
};

export default CreateListingPage;
