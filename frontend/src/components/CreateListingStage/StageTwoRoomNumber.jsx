import React from "react";
import { Box, Button, Typography, Divider, IconButton, Modal } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline, DeleteForever, AddCircle } from '@mui/icons-material';

const styles = {
    modal: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '40vw',
      maxWidth: 350,
      minWidth: 200,
      bgcolor: 'background.paper',
      boxShadow: 24,
      borderRadius: 3,
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  };

// bathrooms and bedrooms, should set beds in bedroom seperately
const StageTwoRoomNumber = (props) => {
    const { rooms, setRooms, bathroomNumber, setBathroomNumber } = { ...props };
    const [ editingRoom, setEditingRoom ] = React.useState(0);
    const [ openBedTypeMenu, setOpenBedTypeMenu ] = React.useState(false);
    const allBedTypes = ['singleBed', 'kingBed', 'sofaBed', 'crib', 'other'];
    const addNewRoom = () => {
      setRooms([...rooms, { singleBed: 1 }]);
    }
  
    const handleBedTypeMenuOpen = (event, index) => {
      setEditingRoom(index);
      setOpenBedTypeMenu(true);
    }
    const handleBedTypeMenuClose = () => setOpenBedTypeMenu(false);
    const reduceBathroom = () => {
      if (bathroomNumber > 0) {
        setBathroomNumber(bathroomNumber - 1);
      }
    }
    const reduceBed = (index, bedType) => {
      if (rooms[index][bedType] > 0) {
        rooms[index][bedType] = rooms[index][bedType] - 1;
        if (rooms[index][bedType] === 0) {
          delete rooms[index][bedType];
        }
        setRooms([...rooms]);
      }
    }
    return (
      <Box sx={{ minWidth: 240, maxWidth: 400, width: '70vw' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" color="text.primary">Bathrooms</Typography>
          <Box>
            <IconButton name="subBathButton" onClick={ reduceBathroom }><RemoveCircleOutline sx={{ fontSize: 16 }}/></IconButton>
            <Typography name="bathroomNumber" variant="h7" color="text.primary">{bathroomNumber}</Typography>
            <IconButton name="addBathButton" onClick={() => { setBathroomNumber(bathroomNumber + 1) }}><AddCircleOutline sx={{ fontSize: 16 }}/></IconButton>
          </Box>
        </Box>
        <Box>
          <Typography variant="h6" color="text.primary">Bedrooms</Typography>
        </Box>
        
        {/* a model to select new bed type */}
        <Modal
          open={openBedTypeMenu}
          onClose={handleBedTypeMenuClose}
          aria-labelledby="choose bed type"
          aria-describedby="choose bed type"
        >
          <Box sx={ styles.modal }>
            {allBedTypes.map((bedType, index) => {
              return (
                <Box key={`newBedType${index}`}>
                  <Typography variant="h6" color="text.primary"
                    sx = {{ cursor: 'pointer', my: 1 }}
                    name={bedType}
                    onClick={() => {
                      const newRooms = [...rooms];
                      newRooms[editingRoom][bedType] = newRooms[editingRoom][bedType] ? newRooms[editingRoom][bedType] + 1 : 1;
                      setRooms(newRooms);
                      handleBedTypeMenuClose();
                    }}
                  >
                    {bedType}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Modal>
  
        <Box>
          {/* iterate rooms array, generate box for each room */}
          {rooms.map((room, index) => {
            return (
              <Box key={`room${index}`} sx={{ width: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid lightgray', borderRadius: 3, mb: 1, bgcolor:'rgb(255,255,255,0.6)' }}>
                <Box sx={{ mr: 1, width: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <IconButton name={`delete${index}`} onClick={() => { setRooms(rooms.filter((room, i) => i !== index));}}><DeleteForever sx={{ fontSize: 20 }}/></IconButton>
                    {/* click to open a menu to select bed type */}
                    <IconButton name={`addBedTypeFor${index}`} onClick={(event) => { handleBedTypeMenuOpen(event, index) }}><AddCircle sx={{ fontSize: 18 }}/></IconButton>
                  </Box>
                  <Typography variant="h7" color="text.primary">Room {index + 1}</Typography>
                </Box>
                <Divider />
                <Box sx={{ width: '100%' }}>
                  {/* create bedtype and number for this room */}
                  {
                    // index is bedtype index
                    Object.keys(room).map((bedType, j) => {
                      return (
                        <Box key={`room${index}bed${j}`} sx={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Typography variant="h7" color="text.primary" sx={{ mx: 1 }}>{bedType}</Typography>
                          <IconButton name={`sub${bedType}for${index}`} onClick={() => { reduceBed(index, bedType) }}><RemoveCircleOutline sx={{ fontSize: 16, color: 'lightskyblue' }}/></IconButton>
                          <Typography variant="h7" color="text.primary">{room[bedType]}</Typography>
                          <IconButton name={`add${bedType}for${index}`} onClick={() => { setRooms(rooms.map((room, i) => i === index ? { ...room, [bedType]: room[bedType] + 1 } : room)); }}><AddCircleOutline sx={{ fontSize: 16, color: 'lightskyblue' }}/></IconButton>
                        </Box>
                      );
                    })
                  }
                </Box>
              </Box>
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant='contained' onClick={addNewRoom} name="addRoomButton">
            Add Room
          </Button>
        </Box>
      </Box>
    )
  }

export default StageTwoRoomNumber;

