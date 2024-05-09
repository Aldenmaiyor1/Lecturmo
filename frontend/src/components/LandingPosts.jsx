import {
  Grid,
  Box,
  Card,
  CardHeader,
  IconButton,
  CardActions,
  Typography,
  Rating,
  CardContent,
  Stack,
} from '@mui/material';
import React, { useEffect } from 'react';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';

const LandingPosts = ({ posts }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const calculateOverallRating = (post) => {
    if (!post || !post.reviews || post.reviews.length === 0) {
      return 0;
    }

    let totalRating = 0;
    let totalReviews = post.reviews.length;

    post.reviews.forEach((review) => {
      const averageRating =
        (review.difficultyRating +
          review.contentRating +
          review.qualityRating) /
        3;
      totalRating += averageRating;
    });
    const overallRating = totalRating / totalReviews;
    console.log('course: ', post.courseCode);
    console.log(overallRating);
    return overallRating;
  };

  useEffect(() => {
    console.log('posts:', posts);
  }, [posts]);

  return (
    <Grid
      container
      direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
      justifyContent="center"
      alignItems="center"
      spacing={2}
      sx={{ mt: '20px' }}
    >
      
      {[...Array(2)].map((_, columnIndex) => (
        <Grid item lg={2} key={columnIndex}>
          {/* Each column */}
          {posts
            .filter((_, index) => columnIndex === index % 3)
            .map((post, index) => (
              <Box
                key={index}
                sx={{
                  cursor: 'pointer',
                  marginTop: '15px',
                  width: '400px',
                  boxShadow: theme.shadows[1],
                }}
                onClick={() => {
                  navigate(`/courses?courseId=${post._id}`);
                  console.log(post);
                }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 5,
                    bgcolor: index % 2 === 0 ? 'primary.main' : 'light.main',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: '100%',
                      pr: '10px'
                    }}
                  >
                    <CardHeader
                      title={post.courseCode}
                      titleTypographyProps={{
                        variant: 'h5',
                        fontWeight: 'bold',
                      }}
                    />
                    <Box>
                      {post?.reviews?.length}
                      <RateReviewIcon color='heart' sx={{width: "20px"}}/>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      margin: '10px 10px 16px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        bgcolor: 'secondary.main',
                        padding: '5px',
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
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" color="initial">
                        Ratings:
                      </Typography>
                      <Rating
                        name="size-small"
                        value={calculateOverallRating(post)}
                        readOnly
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Box>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="initial"
                          fontSize={15}
                          sx={{ lineHeight: 3 }}
                        >
                          Review:
                        </Typography>
                        
                      </Box>
                      <Typography
                        variant="body2"
                        color="initial"
                        fontSize={15}
                        sx={{ lineHeight: 2 }}
                      >
                        {post?.reviews[0]?.content}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="#78858F"
                        sx={{ lineHeight: 3 }}
                      >
                        {new Date(
                          post?.reviews[0]?.createdAt
                        ).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
              </Box>
            ))}
        </Grid>
      ))}
    </Grid>
  );
};

export default LandingPosts;
