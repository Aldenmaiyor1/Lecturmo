import {
  Container,
  Box,
  Typography,
  Divider,
  Rating,
  Stack,
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
} from '@mui/material';
import React from 'react';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WriteReview from '../../components/WriteReview';

const SinglePostPage = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        justifyContent: 'flex',
        alignItems: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          bgcolor: 'light.main',
          height: '100%',
          p: '20px',
          borderRadius: 5,
        }}
      >
        <Typography variant="h4" color="initial">
          Compsci 732
        </Typography>
        <Typography variant="subtitle1" color="initial">
          Software Tools and Technique
        </Typography>
        <Divider sx={{ borderBottomWidth: 3 }} />
        <Grid container spacing={{ xs: 2, md: 1 }} sx={{ p: '20px 0' }}>
          <Grid item xs={9} lg={10}>
            <Typography variant="body2" color="initial" align="justify">
              State-of-the-art software development, particularly in teams,
              requires the use of advanced tools to deliver high-quality
              software across the many platforms that we encounter today. It is
              characterized by a wide variety of techniques ranging from formal
              to informal, from automated to manual operations and covering
              programs as well as data. In industry, there is an increasing
              demand to apply recent research to software development tools.
              This course has a lecture component and a group project component
              which work together to give a broad picture of current software
              development and data management tool research. The group projects
              are often exploring a novel take on interesting problems and offer
              both an authentic application of software development practices
              and an opportunity to deliver an exciting result.
            </Typography>
          </Grid>

          <Grid item xs={2} lg={1}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="body2"
                color="initial"
                sx={{ width: '300px', fontWeight: 'bold' }}
              >
                Overall:
              </Typography>
              <Rating size="small" defaultValue={3} readOnly />
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="body2"
                color="initial"
                sx={{ width: '300px', mr: '' }}
              >
                Difficulty:
              </Typography>
              <Rating size="small" defaultValue={3} />
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="body2"
                color="initial"
                sx={{ width: '300px', mr: '' }}
              >
                Content:
              </Typography>
              <Rating size="small" defaultValue={3} />
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="body2"
                color="initial"
                sx={{ width: '300px', mr: '' }}
              >
                Quality:
              </Typography>
              <Rating size="small" defaultValue={3} />
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <WriteReview />
          <Box
            sx={{
              display: 'flex',
              bgcolor: 'secondary.main',
              padding: '8px',
              width: 190,
              borderRadius: 3,
            }}
          >
            <LocationOnOutlinedIcon
              fontSize="small"
              sx={{ marginRight: '5px' }}
            />
            <Typography variant="body2" color="initial">
              University of Auckland
            </Typography>
          </Box>
        </Box>
      </Box>

      <Stack
        direction="row"
        justifyContent="end"
        alignItems="center"
        spacing={1}
        mt={5}
      >
        <Typography variant="h6" color="light.main">
          Sort:
        </Typography>
        <FormControl sx={{ width: 250 }}>
          <Select
            labelId="post-select"
            id="post-select"
            defaultValue={10}
            sx={{ borderRadius: 5, bgcolor: 'light.main' }}
            // MenuProps={{
            //   PaperProps: {
            //     sx: {
            //       borderRadius: 5,
            //       mt: 1,
            //     },
            //     "& .MuiMenuItem-root:hover": {
            //       bgcolor: "red",
            //     },
            //   },
            // }}
          >
            <MenuItem value={10}>Most Relevant</MenuItem>
            <MenuItem value={20}>Newest</MenuItem>
            <MenuItem value={30}>Highest Rating</MenuItem>
            <MenuItem value={40}>Lowest Rating</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Grid>
        <Card>
          <CardContent>
            <Typography variant="body1" color="initial"></Typography>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
};

export default SinglePostPage;
