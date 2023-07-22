import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import MyReview from "./MyReview";
import TravelHeader from "./TravelHeader";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MyFullScreenDialog(props) {
  const [open, setOpen] = React.useState(false);
  const {reviews,title} = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen} width="100%">
        {title?title:""}
      </Button>
      <Dialog
        hideBackdrop
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <TravelHeader />
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Reviews
            </Typography>
          </Toolbar>
        </AppBar>
        <Stack
                direction="column-reverse"
                justifyContent="center"
                alignItems="center"
                spacing={0.5}
                >
                {reviews && reviews.map((review,index)=>(
                    <MyReview review={review} key={review.owner+'-'+index}  />
                ))}
        </Stack>
      </Dialog>
    </div>
  );
}