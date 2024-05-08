import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Avatar,
  Button,
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
  FormHelperText,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContextProvider';
import axios from 'axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const { loginUser } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message === 'Successfully verified!') {
      setOpen(true);
    }
  }, [message]);

  const handleClose = (event) => {
    setOpen(false);
    location.state = {};
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const body = {
      username: username,
      password: password,
    };
    const res = await loginUser(JSON.stringify(body));
    if (res && res.error) {
      setError(res.message);
    } else {
      setError('');
      navigate('/');
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setError('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError('');
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        mt: '100px',
        width: '90%',
        bgcolor: 'primary.main',
        borderRadius: 5,
        p: '10px 10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Hi, Welcome Back! 👋
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
            onFocus={() => setError('')}
          />
          <FormControl fullWidth required variant="outlined" margin="normal">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => setError('')}
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
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
          <Grid
            container
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: 'secondary.main',
              color: 'lightText.primary',
              '&:hover': {
                color: 'initial',
                bgcolor: 'secondary.main',
              },
            }}
          >
            Login
          </Button>
          <Grid container>
            <Link href="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Successfully verified!
        </Alert>
      </Snackbar>
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
      {'Copyright © '}
      <Link color="inherit">Lectermo</Link> {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
