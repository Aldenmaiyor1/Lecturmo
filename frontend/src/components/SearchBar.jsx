import React, { useEffect, useState, useRef } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  MenuItem,
  Menu,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BACKEND_EXPRESS_APP_ENDPOINT_API_URL ?? 'http://localhost:3000/api';

const SearchBar = () => {
  const [categorySearch, setCategorySearch] = useState([]);
  const [courseSearch, setCourseSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const submit = async () => {
    const response = await axios
      .post(
        `${BASE_URL}/search`,
        {
          searchterm: searchTerm,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        setCourseSearch(response.data.courses);
        setCategorySearch(response.data.category);
        // console.log(response.data);
      });
  };

  useEffect(() => {
    submit();
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: { xs: '80%', lg: '70%' },
        mt: '50px',
        position: 'relative',
      }}
    >
      <TextField
        placeholder="Search"
        sx={{
          width: '100%',
          bgcolor: 'light.main',
          borderRadius: 10,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: 'none',
            },
          },
        }}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsDropdownOpen(true);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {isDropdownOpen && (
        <Grid
          ref={dropdownRef}
          container
          flexDirection="column"
          sx={{
            bgcolor: 'light.main',
            borderRadius: 3,
            mt: '10px',
            width: '100%',
            zIndex: 999,
            position: 'absolute',
            top: '100%',
            left: 0,
          }}
        >
          {courseSearch != undefined && categorySearch != undefined
            ? courseSearch.map((result) => {
                return (
                  <Grid
                    item
                    key={result.id}
                    sx={{
                      p: '10px 10px 10px 10px ',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        cursor: 'pointer',
                        borderRadius: 3,
                      },
                    }}
                    onClick={() => {
                      navigate(`/courses?courseId=${result._id}`);
                      console.log(result._id);
                    }}
                  >
                    {result.courseName}
                  </Grid>
                );
              })
            : null}
        </Grid>
      )}
    </Box>
  );
};

export default SearchBar;
