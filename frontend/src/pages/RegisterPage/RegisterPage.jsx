import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UsernameField from '../../components/Register/UsernameField';
import PasswordField from '../../components/Register/PasswordField';
import ConfirmPasswordField from '../../components/Register/ConfirmPasswordField';
import EmailField from '../../components/Register/EmailField';
import VerifyEmailCheckbox from '../../components/Register/VerifyEmailCheckbox';
import GenderSelect from '../../components/Register/GenderSelect';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  IconButton,
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import Calendar from '../../components/Calendar';
import AvatarSelector from '../../components/Register/AvatarSelect';
import {
  checkIfUserExists,
  checkEmailInput,
  checkPasswordInput,
  checkPasswordsMatch,
  registerUser,
} from '../../services/auth/registerAPIFetch';
import { useRedirectToLoginIfNotLoggedIn } from '../../hooks/useRedirectToLoginIfNotLoggedIn';

export default function RegisterPage() {
  const [registerError, setRegisterError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    verifyEmail: false,
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    avatarURL: '',
  });
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // persists across re-renders, prevents unnecessary API calls
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // register dynamic validations and update form data
  const handleChange = async (event) => {
    const { name, value, checked, type } = event.target;
    setRegisterError('');
    setFormData((prevData) => ({
      ...prevData,
      // if checkbox, use the checked, else use the value property
      [name]: type === 'checkbox' ? checked : value,
    }));

    //restart timeout if change detected again
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (name === 'username') {
        const res = await checkIfUserExists({ username: value });
        setUsernameError(res && res.error ? res.message : '');
      } else if (name === 'email') {
        const res = await checkEmailInput({
          email: value,
          verifyEmail: formData.verifyEmail,
        });
        setEmailError(res && res.error && value.length > 0 ? res.message : '');
      } else if (name === 'password') {
        const res1 = await checkPasswordInput({ password: value });
        setPasswordError(
          res1 && res1.error && value.length > 0 ? res1.message : ''
        );
        const res2 = await checkPasswordsMatch({
          password: value,
          confirmPassword: formData.confirmPassword,
        });
        console.log('res2:', res2);
        setConfirmPasswordError(
          res2 && res2.error && formData.confirmPassword.length > 0
            ? res2.message
            : ''
        );
      } else if (name === 'confirmPassword') {
        const res = await checkPasswordsMatch({
          password: formData.password,
          confirmPassword: value,
        });
        setConfirmPasswordError(
          res && res.error && value.length > 0 ? res.message : ''
        );
      } else if (name === 'verifyEmail') {
        setFormData((prevData) => ({ ...prevData, verifyEmail: checked }));
        const res = await checkEmailInput({
          email: formData.email,
          verifyEmail: checked,
        });
        setEmailError(res && res.error && value.length > 0 ? res.message : '');
      }
    }, 500);
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    const res = await registerUser(formData);
    setRegisterError(res && res.error ? res.message : '');
    if (!res.error) {
      navigate('/login');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleGenderChange = (event) => {
    setFormData({ ...formData, gender: event.target.value });
  };

  const handleDateOfBirthChange = (date) => {
    setFormData({ ...formData, dateOfBirth: date });
  };

  const handleAvatarChange = (avatarURL) => {
    setFormData({ ...formData, avatarURL: avatarURL });
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        marginTop: '50px',
        width: {xs: "95%"},
        bgcolor: 'primary.main',
        borderRadius: 5,
        paddingBottom: 5,
      }}
    >
      <IconButton
        sx={{ marginTop: 1 }}
        color="initial"
        component={Link}
        href="/"
      >
        <ArrowBackIcon />
      </IconButton>
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create your Account
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleRegisterSubmit}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <UsernameField
                value={formData.username}
                error={usernameError}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <PasswordField
                showPassword={showPassword}
                formData={formData}
                handleChange={handleChange}
                passwordError={passwordError}
                handleClickShowPassword={handleClickShowPassword}
                handleMouseDownPassword={handleMouseDownPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <ConfirmPasswordField
                value={formData.confirmPassword}
                error={confirmPasswordError}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <EmailField
                value={formData.email}
                error={emailError}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <VerifyEmailCheckbox
                checked={formData.verifyEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <GenderSelect
                value={formData.gender}
                onChange={handleGenderChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Calendar
                value={formData.dateOfBirth}
                onChange={handleDateOfBirthChange}
              />
            </Grid>
            <Grid item xs={12}>
              <AvatarSelector
                value={formData.avatarURL}
                onChange={handleAvatarChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={
              usernameError !== '' ||
              emailError !== '' ||
              passwordError !== '' ||
              confirmPasswordError !== ''
            }
            sx={{
              mt: 3,
              mb: 2,
              borderRadius: 2,
              bgcolor: 'rgb(255,207,96)',
              color: '#808080',
              '&:hover': {
                bgcolor: 'rgb(255,199,71)',
                color: '#382e7f',
              },
            }}
          >
            Register
          </Button>
          {registerError && (
            <Typography color="error" align="center">
              {registerError}
            </Typography>
          )}
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Already have an account? '}
      <Link
        href="/login"
        variant="body2"
        sx={{
          textDecoration: 'none',
          color: '#1C89B6',
          '&:hover': {
            textDecoration: 'underline',
            color: '#1c69b6',
          },
        }}
      >
        {'Sign in'}
      </Link>
    </Typography>
  );
}
