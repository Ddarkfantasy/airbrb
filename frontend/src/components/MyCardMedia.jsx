import React from 'react';
import { useNavigate } from 'react-router-dom';
import MyCardMediaComponent from './MyCardMediaComponent';

/** 
 * for the list card when loading use media animation
 * Title
 * Thumbnail of property (or video if advanced)
 * Number of total reviews
 */
function MyCardMedia(props) {
  const {itemValue,searchValues} = props;
  const navigate = useNavigate();
  const goToDetailPage = ()=>{
    if (searchValues.minDate===null) {
      navigate('/listing/'+itemValue.id);
    }else{
      navigate(`/listing/${itemValue.id}/${searchValues.minDate.format("DD-MM-YYYY")}/${searchValues.maxDate.format("DD-MM-YYYY")}`);
    }
  }

  return (
      <MyCardMediaComponent goToDetailPage={goToDetailPage} itemValue={itemValue} /> 
  );
}

export default MyCardMedia;
