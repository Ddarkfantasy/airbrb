import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos, Close } from "@mui/icons-material";

const ImageListModal = ({ open, setOpen, images, index, setIndex }) => {
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleNext = () => {
    if (index < images.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  };  
  const handlePrevious = () => {
    if (index > 0) {
      setIndex(index - 1);
    } else {
      setIndex(images.length - 1);
    }
  };

  const handleKey = (e) => {
    if (e.key === "ArrowLeft") {
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };
  
  return (
    <Modal open={open} onClose={handleClose}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onKeyDown={handleKey}
    >

      <Box className="imageListModalFrame" sx={{ display: "flex", alignItems: "center", justifyContent: "center", mx: 2}}>
        <IconButton onClick={handleClose} className="test-click"
          sx={{ color: 'white', float: 'left', position: 'absolute', top: 10, bgcolor: 'rgb(255,255,255,0.2)', '&:hover': { color: 'black', bgcolor: 'rgb(255,255,255,0.7)' }}}>
          <Close />
        </IconButton>
        <Box sx={{ width: '100%', float: 'center', position: 'absolute', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <IconButton onClick={handlePrevious} className="test-click"
            sx={{ color: 'white', m: 2, bgcolor: 'rgb(255,255,255,0.2)', '&:hover': { color: 'black', bgcolor: 'rgb(255,255,255,0.7)' } }}>
            <ArrowBackIosNew />
          </IconButton>
          <IconButton onClick={handleNext} className="test-click"
            sx={{ color: 'white', m: 2, bgcolor: 'rgb(255,255,255,0.2)', '&:hover': { color: 'black', bgcolor: 'rgb(255,255,255,0.7)' } }}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
        <img
          style={{ width: "100%", height: "100%", maxHeight: '100vh', }}
          className="image-list-modal__image"
          src={images[index]}
          alt="listing"
        />
      </Box>
    </Modal>
  );
}

export default ImageListModal;
