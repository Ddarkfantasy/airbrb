import React from 'react';
import { InputLabel, Button, TextField, Typography, Box } from '@mui/material';
import { registerRequest } from '../config/requests.js';
import { useSnackbar } from 'notistack';
import { isValidEmail,isNotNull } from '../util/helper';

/** css styles for Modal */ 
const styles = {
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    maxWidth: 400,
    minWidth: 250,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

/** register element */ 
const RegisterForm = (props) => {
  const { setRegisterModalOpen } = { ...props };
  const { enqueueSnackbar } = useSnackbar();
  const [values, setValues] = React.useState({
    email: '',
    name: '',
    password: '',
    password2: '',
  });
  // button can be used 
  const [disable, setDisable] = React.useState(true);
  // disable message
  const [disableMessage, setDisableMessage] = React.useState("");

  // submite the values
  const submit = async () => {
    if (values.email && values.name && values.password && values.password2) {
      if (values.password === values.password2) {
        const body = { ...values };
        delete body.password2;
        const res = await registerRequest(body);
        if (res.ok) {
          setRegisterModalOpen(false);
          enqueueSnackbar('Welcome to the AirBrB!', { variant: 'success' });
        } else {
          enqueueSnackbar(res.error, { variant: 'warning' });
        }
      }
    } else {
      enqueueSnackbar('Please fill all the fields', { variant: 'warning' });
    }
  };

  // every time the values change, validate the form
  React.useEffect(() => {
    if (isValidEmail(values.email) && 
    isNotNull(values.name) && 
    isNotNull(values.password) && 
    isNotNull(values.password2) && 
    values.password === values.password2) {
      // make the button can be used
      setDisable(false);
    }
  }, [values]);

  // show different message when type in different field
  const fieldOnChange = (event) => {
    const checkValue = event.target.value;
    // different check for different feild
    switch (event.target.id) {
      case "email":
        if(!isNotNull(checkValue)){
          setDisable(true);
          setDisableMessage("Please enter email");
        }else if(!isValidEmail(checkValue)){
          setDisable(true);
          setDisableMessage("Please use right email format");
        }else{
          setDisableMessage("");
        }
        break;
      case "name":
        if(!isNotNull(checkValue)){
          setDisable(true);
          setDisableMessage("Please enter username");
        }else{
          setDisableMessage("");
        }
        break;
      case "password":
        if(!isNotNull(checkValue)){
          setDisable(true);
          setDisableMessage("Please enter password");
        }else if(values.password2 && values.password2!== checkValue){
          setDisable(true);
          setDisableMessage("Please use the same password");
        }else{
          setDisableMessage("");
        }
        break;
      case "password2":
        if(!isNotNull(checkValue)){
          setDisable(true);
          setDisableMessage("Please comform password");
        }else if(values.password && checkValue!== values.password){
          setDisable(true);
          setDisableMessage("Please use the same password");
        }else{
          setDisableMessage("");
        }
        break;
      default:
        break;
    }
    // set the values
    setValues({
      ...values,
      [event.target.id]: event.target.value,
    });
  };


  return (
    <Box sx={ styles.modal }>
      <Box>
        <InputLabel htmlFor='email'>Email:</InputLabel>
        <TextField label="Email" id="email" margin="normal" size='small' name="registerEmail"
          onChange={fieldOnChange}
        />

        <InputLabel htmlFor='userName'>User Name:</InputLabel>
        <TextField label="UserName" id="name" margin="normal" size='small' name="registerUserName"
          onChange={fieldOnChange}
        />

        <InputLabel htmlFor='password'>Password:</InputLabel>
        <TextField label="Password" id="password" margin="normal" type="password" size='small' name="registerPassword"
          onChange={fieldOnChange}
        />

        <InputLabel htmlFor='password2'>Confirm Password:</InputLabel>
        <TextField label="Confirm Password" id="password2" margin="normal" type="password" size='small' name="registerPassword2"
          onChange={fieldOnChange}
        />

        <Box sx={{ height: 30, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
          {/* error messages before submit */}
        {disable && disableMessage && <Typography variant='caption' sx={{ color: 'red' }}>{disableMessage}</Typography>}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Button variant="contained" onClick={submit} disabled={disable} name="registerConfirmButton">Register</Button>
      </Box>
    </Box>
  );
};

export default RegisterForm;
