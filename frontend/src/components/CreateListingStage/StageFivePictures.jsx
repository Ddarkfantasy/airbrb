import React, { useState } from "react";
import { Box, Button, Typography, IconButton, Grid,
  FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { DeleteForever, PhotoCamera, Collections, Add, Visibility } from '@mui/icons-material';
import ImageListModal from "../ImageListModal.jsx";

// allow to upload multiple images and (optional) videos
const StageFivePictures = (props) => {
    // check if mouse on thumbnail, if on show buttons
    const [onMainImage, setOnMainImage] = useState(false);
    const [onWhichImage, setOnWhichImage] = useState(-1);
    // if show the images preview modal
    const [displayImages, setDisplayImages] = useState([]);
    const [imageIndex, setImageIndex] = useState(0);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
  
    // show the video preview modal, and set display image to the img you clicked
    const handleOpenPreviewModal = (index) => {
      if (!previewModalOpen) {
        if (index === -1){
          setImageIndex(0);
          setDisplayImages([thumbnail]);
        } else {
          setImageIndex(index);
          setDisplayImages(images);
        }
      } else {
        setImageIndex(0);
        setDisplayImages([]);
      }
      setPreviewModalOpen(!previewModalOpen);
    }
  
    const { images, setImages, videoUrl, setVideoUrl, thumbnail, setThumbnail } = { ...props };
    // when upload images, change Images
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // clear input files
      event.target.value = null;
      reader.onloadend = () => {
        setImages([...images, reader.result]);
      }
    }
    // when upload thumbnail, set thumbnail
    const handleThumbnailUpload = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // clear input files
      event.target.value = null;
      reader.onloadend = () => {
        setThumbnail(reader.result);
      }
    }
    // when click delete button, delete image
    const handleDeleteImage = (index) => {
      setImages(images.filter((image, i) => i !== index));
    }
  
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '70vw', minWidth: 240, maxWidth: 800 }}>
        {/* display all images */}
        <ImageListModal className="imageListModal" open={previewModalOpen} setOpen={setPreviewModalOpen} images={displayImages} index={imageIndex} setIndex={setImageIndex}/>
        {/* for user to upload thumbnail*/}
        <Box>
          <Typography variant="h6" sx={{ mb: 1, lineHeight: 1.1 }}>Upload a main picture</Typography>
          { thumbnail
          ?
          // if thumbnail is uploaded, show it, if its hoverd, show a button to change it or delete it
          <Box
            onMouseOver={() => setOnMainImage(true)}
            sx={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection:'row' }}>
            <img src={thumbnail} alt="thumbnail"
              id="thumbnail"
              style={{ width: '100%', height: '100%', borderRadius: 10, border: '1px solid rgb(255,255,255,0.7)', filter: onMainImage ? 'brightness(0.6)': null }}
              onMouseLeave={() => setOnMainImage(false)}
            />
            <Box sx={{float: 'center', position: 'absolute' }}>
              {/* click eye to open image modal */}
              <IconButton
                onClick={ () => handleOpenPreviewModal(-1) }
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgb(255,255,255,0.7)',
                    color: 'black',
                  },
                  color: 'white', mr: 1,
                  display: onMainImage ? null : 'none',
              }}>
                <Visibility />
              </IconButton>
              {/* click plus to upload a new thumbnail */}
              <IconButton
                component="label"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgb(255,255,255,0.7)',
                    color: 'black',
                  },
                  color: 'white', ml: 1,
                  display: onMainImage ? null : 'none',
              }}>
                <input hidden accept="image/*" type="file" 
                  onChange={handleThumbnailUpload} id="updateThumbnail" className="hiddenInput0"
                />
                <Add />
              </IconButton>
            </Box>
          </Box>
          :
          <Button color="primary" aria-label="upload picture" component="label" sx={{ width: '100%', height: '100%', minHeight: 100, border: '1px solid rgb(255,255,255,0.7)', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="hiddenInputBox">
              <input hidden accept="image/*" type="file" id="uploadThumbnail" className="hiddenInput1"
              onChange={handleThumbnailUpload}
              />
              <PhotoCamera />
            </Box>
          </Button>
          }
        </Box>
  
        {/* for user to upload images */}
        <Box>
          <Typography variant="h6" sx={{ mt: 2, mb: 1, lineHeight: 1.1 }}>Upload more pictures here~</Typography>
          <Box sx={{border: '1px solid rgb(255,255,255,0.7)', p: 1, borderRadius: 3 }}>
            {/* upload button */}
            <Button color="primary" aria-label="upload picture" component="label" sx={{ width: '100%', height: '100%', minHeight: 100, border: '1px solid rgb(255,255,255,0.7)', borderRadius: 3, mb:2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <input hidden accept="image/*" type="file" id="uploadImages" className="hiddenInput2"
                onChange={handleImageUpload}
                />
                <Collections />
              </Box>
            </Button>
            <Grid container spacing={2} columns={{ xs: 4, sm: 4, md: 6 }} >
              {images.map((image, index) => (
                <Grid item 
                  key={`image${index}`} xs={2} sm={2} md={2}>
                  <Box
                    onMouseOver={() => setOnWhichImage(index)}
                    onMouseLeave={() => setOnWhichImage(-1)}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={image} alt="uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, filter: onWhichImage === index ? 'brightness(0.6)': null }} />
                    <Box sx={{float: 'center', position: 'absolute' }}>
                      {/* click eye to open image modal */}
                      <IconButton
                        onClick={ () => handleOpenPreviewModal(index) }
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgb(255,255,255,0.7)',
                            color: 'black',
                          },
                          color: 'white', mr: 1,
                          display: onWhichImage === index ? null : 'none',
                      }}>
                        <Visibility />
                      </IconButton>
                      {/* click plus to upload a new thumbnail */}
                      <IconButton
                        onClick={ () => handleDeleteImage(index) }
                        component="label"
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgb(255,255,255,0.7)',
                            color: 'black',
                          },
                          color: 'white', ml: 1,
                          display: onWhichImage === index ? null : 'none',
                      }}>
                        <DeleteForever />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
        
        {/* for user to upload video url*/}
        <Box>
          <Typography variant="h6" sx={{ mt: 2, mb: 1, lineHeight: 1.1 }}>Try a video link?</Typography>
          <FormControl sx={{width: '100%'}}>
            <InputLabel htmlFor="videoUrl">Video URL</InputLabel>
            <OutlinedInput
              multiline
              minRows={2}
              id="videoUrl"
              label="Video URL"
              variant="outlined"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              sx={{ bgcolor: 'rgb(255,255,255,0.5)', borderRadius: 3 }}
            />
          </FormControl>
        </Box>
      </Box>
    )
  }

export default StageFivePictures;
