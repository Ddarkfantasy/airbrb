import React, { useContext } from 'react';
import { tokenContext } from '../App.jsx';
import { InputLabel, Button, TextField, Box, Typography } from '@mui/material';
import { loginRequest } from '../config/requests.js';
import { isValidEmail,isNotNull } from '../util/helper';
import { useSnackbar } from 'notistack';

/** css styles for Modal */ 
const styles = {
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    maxWidth: 400,
    minWidth: 210,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

/** login element */ 
const LoginForm = (props) => {
  // tokenData controlles the token, use setToken to change the token
  const tokenData = useContext(tokenContext);
  const { enqueueSnackbar } = useSnackbar();
  const prop = { ...props };
  const setLoginModalOpen = prop.setLoginModalOpen;
  /** state for form values */ 
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });

  // button can be used 
  const [disable, setDisable] = React.useState(true);
  // disable message
  const [disableMessage, setDisableMessage] = React.useState("");

  // before submit check
  React.useEffect(() => {
    if (isValidEmail(values.email) && 
    isNotNull(values.password)) {
      // make the button can be used
      setDisable(false);
    }
  }, [values]);

  const submit = async () => {
    const email = values.email;
    const password = values.password;
    if (email && password) {
      const body = { email, password };
      const res = await loginRequest(body);
      if (res.ok) {
        const data = res.data;
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
        tokenData.setToken(data.token);
        tokenData.setLoginEmail(email);
        setLoginModalOpen(false);
      } else {
        enqueueSnackbar(res.error, { variant: 'warning' });
      }
    } else {
      enqueueSnackbar('Please fill all the fields', { variant: 'warning' });
    }
  };

  // check for each feild
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
      case "password":
        if(!isNotNull(checkValue)){
          setDisable(true);
          setDisableMessage("Please enter password");
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
    <Box sx={ styles.modal } className="myLoginForm">
      <Box>
        <InputLabel htmlFor='email'>Email:</InputLabel>
        <TextField label="Email" id="email" margin="normal" size='small' name="loginEmail"
          onChange={ fieldOnChange}
        />

        <InputLabel htmlFor='password'>Password:</InputLabel>
        <TextField label="Password" id="password" margin="normal" type="password" size='small' name="loginPassword"
          onChange={ fieldOnChange }
        />
      </Box>

      <Box sx={{ height: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            {/* error messages before submit */}
          {disable && disableMessage && <Typography variant='caption' sx={{ color: 'red' }}>{disableMessage}</Typography>}
      </Box>
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Button variant="contained" onClick={submit} name="loginConfirmButton">Log In</Button>
      </Box>

    </Box>
  );
};

export default LoginForm;
