import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContextProvider';
import Typography from '@mui/material/Typography';
import SearchBar from '../../components/SearchBar';
import LandingPosts from '../../components/LandingPosts';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Footer from '../../components/Footer';
import { useTheme } from '@emotion/react';
import { Box, IconButton } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';
import LandingImage from '../../components/LandingImage';
import LandingBackground from '../../components/LandingBackground';
import Loading from '../../components/Loading';

const BASE_URL = import.meta.env.VITE_BACKEND_EXPRESS_APP_ENDPOINT_API_URL ?? 'http://localhost:3000/api';

const HomePage = () => {
  const theme = useTheme();
  const location = useLocation();
  const message = location.state?.message;

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true)

  useEffect(() => {
    console.log('message:', message);
    if (message === 'Successfully verified!') {
      setOpen(true);
    }
  }, [message]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('hello');
      try {
        const response = await axios.get(
          `${BASE_URL}/landing-posts`
        ).then((response) => {
          setPosts(response.data)
          setInitialLoad(false)
        })
        console.log('data', response.data);
      } catch (error) {
        console.log('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <SearchBar />
      <LandingPosts posts={posts} />
      {/* <IconButton
        sx={{
          bgcolor: 'secondary.main',
          width: '60px',
          height: '60px',
          borderRadius: 10,
          padding: '5px',
          marginTop: '70px',
          textAlign: 'center',
          boxShadow: theme.shadows[1],
          '&:hover': {
            backgroundColor: 'secondary.main',
            color: '#000000',
          },
        }}
      >
        <ArrowDownwardIcon sx={{ fontSize: 50 }} />
      </IconButton> */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Successfully verified!
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
    }
    </>
  );
};

export default HomePage;
