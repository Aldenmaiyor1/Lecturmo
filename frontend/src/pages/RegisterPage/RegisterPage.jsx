import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Calendar from '../../components/Calendar';
import AvatarSelector from '../../components/AvatarSelect';
import { checkIfUserExists } from '../../services/auth/registerAPIFetch';

const defaultTheme = createTheme();

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    allowExtraEmails: false,
    gender: '',
  });
  const [usernameError, setUsernameError] = useState('');

  const handleChange = async (event) => {
    const { name, value, checked, type } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      // if checkbox, use the checked, else use the value property
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (name === 'username') {
      const res = await checkIfUserExists({
        username: value,
      });
      if (res && res.error) {
        setUsernameError(res.message);
      } else {
        setUsernameError('');
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    // Add your logic to proceed with form submission
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

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        marginTop: '50px',
        bgcolor: 'primary.main',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 5,
      }}
    >
      <IconButton sx={{ marginTop: 1 }} color="initial" component={Link} href="/">
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
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
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
                required
                fullWidth
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                error={Boolean(usernameError)}
                helperText={usernameError}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>

              <FormControl fullWidth required variant="outlined">
                <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  value={formData.gender}
                  onChange={handleGenderChange}
                  label="Gender"
                >
                  <MenuItem value="">Select Gender</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="allowExtraEmails"
                    color="primary"
                    checked={formData.allowExtraEmails}
                    onChange={handleChange}
                  />
                }
                label="I want to receive notifications, updates via email."
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <Calendar />
            </Grid>
            <Grid item xs={12}>
              <AvatarSelector />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
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
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container >
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

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];