import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContextProvider';
import Typography from '@mui/material/Typography';
import LandingPosts from '../../components/LandingPosts';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Footer from '../../components/Footer';
import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import Loading from '../../components/Loading';
import SearchBar from '../../components/SearchBar';

const BASE_URL =
  import.meta.env.VITE_BACKEND_EXPRESS_APP_ENDPOINT_API_URL ??
  'http://localhost:3000/api';

const HomePage = () => {
  const location = useLocation();
  const message = location.state?.message;

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [toggleSearch, setToggleSearch] = useState(false)

  const toggleSearchBar = ()=>{
    setToggleSearch(!toggleSearch)
  }

  useEffect(()=>{
    document.addEventListener("mousedown", (e)=>{
      // console.log(e.target)
    })
  },[])

  useEffect(() => {
    console.log('message:', message);
    if (message === 'Successfully verified!') {
      setOpen(true);
    }
  }, [message]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios
          .get(`${BASE_URL}/landing-posts`)
          .then((response) => {
            setPosts(response.data);
            setInitialLoad(false);
          });
        // console.log('data', response.data);
      } catch (error) {
        console.log('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {initialLoad ? (
        <Loading />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box component="img" src="../../../FullLogo.png" sx={{width: "60%"}}></Box>
          <SearchBar toggle= {toggleSearch} skeet="skeet"/>
          <LandingPosts posts={posts} />
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
      )}
    </>
  );
};

export default HomePage;
