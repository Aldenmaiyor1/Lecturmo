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
  Avatar,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useEffect, useState, useContext } from 'react';
import RateReviewIcon from '@mui/icons-material/RateReview';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { postRequest } from '../../services/postRequest';
import Loading from '../../components/Loading';
import WriteReview from '../../components/writeReview';
import { AuthContext } from '../../contexts/AuthContextProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = import.meta.env.VITE_BACKEND_EXPRESS_APP_ENDPOINT_API_URL ?? 'http://localhost:3000/api';

const SinglePostPage = () => {
  const { user } = useContext(AuthContext);
  const [initialLoad, setInitialLoad] = useState(true)

  const [searchParams, setSearchParams] = useSearchParams();
  const [course, setCourse] = useState([]);
  const [courseId, setCourseId] = useState();
  const [sortBy, setSortBy] = useState(50);
  const [reviews, setReview] = useState();
  const [triggerReload, setTriggerReload] = useState(false)
  const [heartLoading, setHeartLoading] = useState(false)

  //AI
  const [summary, setSummary] = useState(null);
  const [aiInProgress, setAiInProgress] = useState(false);
  const [aiError, setAiError] = useState(false);

  const generateCourseReviewSummary = async (course_Id) => {
    setAiInProgress(true);
    const courseIdObj = {
      courseId: course_Id,
    };

    const response = await postRequest(
      `${BASE_URL}/lecturai/summarizeReview`,
      courseIdObj
    );

    if (!response.message.content) {
      setAiError(true);
      setAiInProgress(false);
    }

    setSummary(response.message.content);
    setAiInProgress(false);
  };

  const toggleLike = async (reviewId, varCourseId) => {
    const response = await postRequest(`http://localhost:3000/api/toggle-like`,
      {
        reviewId: reviewId,
        courseId: varCourseId
      }
    ).then(setTriggerReload(!triggerReload))
  }

  const calculateOverallRating = (course) => {
    if (!course || !course.reviews || course.reviews.length === 0) {
      return 0;
    }

    let totalRating = 0;
    let totalReviews = course.reviews.length;

    course.reviews.forEach((review) => {
      const averageRating =
        (review.difficultyRating +
          review.contentRating +
          review.qualityRating) /
        3;
      totalRating += averageRating;
    });

    const overallRating = totalRating / totalReviews;

    return overallRating;
  };

  const calculateOverallDifficulty = (course) => {
    if (!course || !course.reviews || course.reviews.length === 0) {
      return 0;
    }

    let totalDifficulty = 0;
    let totalReviews = course.reviews.length;

    course.reviews.forEach((review) => {
      totalDifficulty += review.difficultyRating;
    });

    const overallDifficulty = totalDifficulty / totalReviews;
    // console.log(overallDifficulty);
    return overallDifficulty;
  };

  const calculateOverallContent = (course) => {
    if (!course || !course.reviews || course.reviews.length === 0) {
      return 0;
    }

    let totalContent = 0;
    let totalReviews = course.reviews.length;

    course.reviews.forEach((review) => {
      totalContent += review.contentRating;
    });

    const overallContent = totalContent / totalReviews;
    // console.log(overallContent);
    return overallContent;
  };

  const calculateOverallQuality = (course) => {
    if (!course || !course.reviews || course.reviews.length === 0) {
      return 0;
    }

    let totalQuality = 0;
    let totalReviews = course.reviews.length;

    course.reviews.forEach((review) => {
      totalQuality += review.qualityRating;
    });

    const overallQuality = totalQuality / totalReviews;
    return overallQuality;
  };

  const calculateSingleRating = (review) => {
    if (
      !review.difficultyRating &&
      !review.qualityRating &&
      !review.contentRating
    )
      return 0;
    let totalRating =
      (review.difficultyRating + review.contentRating + review.qualityRating) /
      3;
    return totalRating;
  };

  const sortReviews = (reviews) => {
    console.log(sortBy)
    switch (sortBy) {
      case 30: // Highest Rating
        return reviews
          .slice()
          .sort((a, b) => calculateSingleRating(b) - calculateSingleRating(a));
      case 40: // Lowest Rating
        return reviews
          .slice()
          .sort((a, b) => calculateSingleRating(a) - calculateSingleRating(b));
      case 50:
        reviews.sort((a, b) => b.likes.length - a.likes.length);
        return reviews;
      case 60:
        return reviews
          .slice()
          .sort((a, b) => calculateSingleRating(b) - calculateSingleRating(a));
      default: // Newest
        return reviews
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // useEffect(() => {
  //   if (reviews != undefined) {
  //     setReview(sortReviews(reviews));
  //   }
  // }, [reviews]);

  useEffect(() => {
    setCourseId(searchParams.get('courseId'));
  }, []);

  useEffect(() => {
    if (courseId != undefined) {
      const fetchData = async () => {
        try {
          const response = await axios
            .get(`${BASE_URL}/courses/${courseId}`)
            .then((res) => {
              console.log('single course: ', res.data.reviews);
              setCourse(res.data);
              setReview(sortReviews(res.data.reviews));
              setInitialLoad(false)
              setHeartLoading(false)
            });
        } catch (error) {
          console.log('Error fetching single post data: ', error);
        }
      };
      fetchData();
    }
  }, [courseId, triggerReload]);

  return (
    <>
      {initialLoad ? <Loading /> :
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              bgcolor: 'light.main',
              height: '100%',
              p: '20px',
              borderRadius: 5,
              mt: 5,
            }}
          >
            <Typography variant="h4" color="initial">
              {course.courseCode}
            </Typography>
            <Typography variant="subtitle1" color="initial">
              {course.courseName}
            </Typography>
            <Divider sx={{ borderBottomWidth: 3 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: '20px',
                mb: '20px',
              }}
            >
              <Box
                width={{ xs: '100%', md: 'calc(80% - 10px)' }}
                mr={{ xs: '10px', md: '20px' }}
              >
                <Typography variant="body1" color="initial" align="justify">
                  {course.description}
                </Typography>
              </Box>

              <Grid>
                <Grid container direction={{ xs: 'column', sm: 'row', md: 'row' }}>
                  <Grid item alignItems="center">
                    <Typography
                      variant="body1"
                      color="initial"
                      sx={{
                        fontWeight: 'bold',
                        mr: '5px',
                      }}
                    >
                      Overall:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Rating
                      size="small"
                      value={calculateOverallRating(course)}
                      precision={0.5}
                      readOnly
                    />
                  </Grid>
                </Grid>
                <Grid container direction={{ xs: 'column', sm: 'row', md: 'row' }}>
                  <Grid item alignItems="center">
                    <Typography variant="body1" color="initial" mr="5px">
                      Difficulty:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Rating
                      size="small"
                      value={calculateOverallDifficulty(course)}
                      precision={0.5}
                      readOnly
                    />
                  </Grid>
                </Grid>
                <Grid container direction={{ xs: 'column', sm: 'row', md: 'row' }}>
                  <Grid item alignItems="center">
                    <Typography variant="body1" color="initial" mr="5px">
                      Content:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Rating
                      size="small"
                      value={calculateOverallContent(course)}
                      precision={0.5}
                      readOnly
                    />
                  </Grid>
                </Grid>
                <Grid container direction={{ xs: 'column', sm: 'row', md: 'row' }}>
                  <Grid item alignItems="center">
                    <Typography variant="body1" color="initial" mr="5px">
                      Quality:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Rating
                      size="small"
                      value={calculateOverallQuality(course)}
                      precision={0.5}
                      readOnly
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>

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

          <Box
            sx={{
              bgcolor: 'secondary.main',
              height: '100%',
              width: '100%',
              p: '20px',
              borderRadius: 5,
              mt: 5,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {aiInProgress ? (
                  <LoadingButton
                    loading
                    sx={{
                      bgcolor: 'background.default',
                      borderRadius: 5,
                      '& .MuiCircularProgress-svg': {
                        color: 'light.main',
                      },
                    }}
                  >
                    Generating summary...
                  </LoadingButton>
                ) : (
                  <Button
                    sx={{
                      bgcolor: 'background.default',
                      color: 'primary.main',
                      borderRadius: 5,
                      '&:hover': {
                        bgcolor: 'lightBlue.main',
                      },
                    }}
                    onClick={() => generateCourseReviewSummary(courseId)}
                  >
                    Generate Summary
                  </Button>
                )}
              </Box>
              <Box mt="10px" sx={{ display: 'flex', justifyContent: 'center' }}>
                {!summary && (
                  <Typography
                    variant="body1"
                    color="initial"
                    sx={{ fontWeight: 'bold' }}
                  >
                    If you don't want to read reviews, please use AI to summarize
                    reviews
                  </Typography>
                )}
                {aiError ? (
                  <Typography sx={{ color: 'red' }}>
                    AI generation error, try again in 5 minutes
                  </Typography>
                ) : (
                  <Typography variant="body1" color="#000000">
                    {summary}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Box
            mt={5}
            sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" color="light.main">
                Sort:
              </Typography>
              <FormControl sx={{ width: 250 }}>
                <Select
                  labelId="post-select"
                  id="post-select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    setReview(sortReviews(reviews))
                    console.log(e.target.value)
                  }}
                  sx={{ borderRadius: 5, bgcolor: 'light.main', height: '40px' }}
                >
                  <MenuItem value={50}>Most popular</MenuItem>
                  <MenuItem value={60}>Least popular</MenuItem>
                  <MenuItem value={20}>Newest</MenuItem>
                  <MenuItem value={30}>Highest Rating</MenuItem>
                  <MenuItem value={40}>Lowest Rating</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>

          {course.reviews && course.reviews.length > 0 ? (
            reviews.map((review, index) => {
              return (
                <>
                  <Grid mt={5} sx={{ width: '80%' }} key={index}>
                    <Card sx={{ borderRadius: 5 }}>
                      <CardContent sx={{ p: '20px' }}>
                        <Typography variant="body1" color="initial">
                          {review.content}
                        </Typography>
                        <Grid container justifyContent="space-between" mt={2}>
                          <Grid item>
                            <Stack direction="row">
                              <Typography variant="body1" color="initial">
                                Overall:
                              </Typography>
                              <Rating
                                size="small"
                                value={calculateSingleRating(review)}
                                precision={0.5}
                              />
                            </Stack>
                          </Grid>
                          <Grid item>
                            <Stack direction="row">
                              <Typography variant="body1" color="initial">
                                Difficulty:
                              </Typography>
                              <Rating
                                size="small"
                                value={review.difficultyRating}
                                precision={0.5}
                              />
                            </Stack>
                          </Grid>
                          <Grid item>
                            <Stack direction="row">
                              <Typography variant="body1" color="initial">
                                Content:
                              </Typography>
                              <Rating
                                size="small"
                                value={review.contentRating}
                                precision={0.5}
                              />
                            </Stack>
                          </Grid>
                          <Grid item>
                            <Stack direction="row">
                              <Typography variant="body1" color="initial">
                                Quality:
                              </Typography>
                              <Rating
                                size="small"
                                value={review.qualityRating}
                                precision={0.5}
                              />
                            </Stack>
                          </Grid>
                        </Grid>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: '15px',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Avatar
                              sx={{ mr: '15px' }}
                              src={review.userId.avatarPicture}
                            />
                            <Box>
                              <Typography
                                variant="body1"
                                color="initial"
                                sx={{ fontWeight: 'bold' }}
                              >
                                {review.userId.username}
                              </Typography>
                              <Typography variant="caption" color="initial">
                                {new Date(review.createdAt).toLocaleDateString(
                                  'en-US',
                                  {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  }
                                )}
                              </Typography>
                            </Box>

                            {/* for siennna */}
                            <Typography>{
                              review.userId.courses.length < 3
                                ? review.userId.courses.length
                                : review.userId.courses.length < 8
                                  ? review.userId.courses.length
                                  : review.userId.courses.length < 15
                                    ? review.userId.courses.length
                                    : null
                            }</Typography>


                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                              {user == null
                                ? <FavoriteBorderIcon
                                  onClick={() => {
                                    toast.error("Please log in to like the review")
                                  }}
                                  sx={{ color: 'heart.main', cursor: "pointer" }} />
                                : (!heartLoading &&
                                  (review.likes.findIndex(like => like.userId === user?._id) == -1
                                    ? <FavoriteBorderIcon
                                      onClick={() => {
                                        console.log("fuck", user)
                                        toggleLike(review._id, courseId)
                                        setHeartLoading(true)
                                        console.log("userId: ", review.likes.findIndex(like => like.userId === user._id))
                                      }}
                                      sx={{ color: 'heart.main', cursor: "pointer" }} />
                                    : <FavoriteIcon
                                      onClick={() => {
                                        console.log("fuck", user)
                                        toggleLike(review._id, courseId)
                                        console.log("userId: ", review.likes.findIndex(like => like.userId === user._id))
                                      }}
                                      sx={{ color: 'heart.main', cursor: "pointer" }}
                                    />
                                  )
                                )
                              }
                              <Typography variant="body1" color="initial">
                                {review.likes.length}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </>
              );
            })
          ) : (
            <Box
              mt={5}
              display="flex"
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
            >
              <Divider
                sx={{
                  color: 'light.main',
                  '&::before, &::after': {
                    borderColor: 'light.main',
                  },
                  width: '100vw',
                  p: '30px',
                }}
              >
                No reviews
              </Divider>
              <Button
                variant="contained"
                sx={{
                  width: '300px',
                  borderRadius: 5,
                  bgcolor: 'secondary.main',
                  '&.MuiButton-root:hover': {
                    bgcolor: 'secondary.main',
                  },
                }}
              >
                Please help us write a review!
              </Button>
            </Box>
          )}
        </Container>
      }
    </>
  );
};

export default SinglePostPage;
