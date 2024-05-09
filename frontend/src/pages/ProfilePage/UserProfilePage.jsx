import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Paper,
  InputBase,
  Link,
  LinearProgress,
  Stack,
  Grid,
  Container,
} from '@mui/material';
import React, { useState, useContext } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';
import EmailIcon from '@mui/icons-material/Email';
import { useRedirectToLoginIfNotLoggedIn } from '../../hooks/useRedirectToLoginIfNotLoggedIn';
import { AuthContext } from '../../contexts/AuthContextProvider';
import Loading from '../../components/Loading';
import { resendVerificationEmail } from '../../services/profile/userProfileAPIFetch';

const UserProfilePage = () => {
  const { user } = useContext(AuthContext);
  useRedirectToLoginIfNotLoggedIn();

  const [emailError, setEmailError] = useState('');
  const [sentEmailSuccess, setSentEmailSuccess] = useState(false);

  if (user === null) {
    return <Loading />;
  }

  console.log(user);

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        my: "50px",
        width: "90%",
        bgcolor: 'primary.main',
        height: '100%',
        borderRadius: 5,
        paddingBottom: 5,
        minHeight: '100vh',
      }}
    >
      <IconButton
        sx={{ marginTop: 3, marginLeft: 3 }}
        color="initial"
        component={Link}
        href="/"
      >
        <ArrowBackIcon />
      </IconButton>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                pl: '10px',
                display: 'flex',
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CardMedia
                component="img"
                title="profile img"
                image={user.avatarPicture || '../../../no-avatar.png'}
                sx={{ width: 150, height: 150, borderRadius: 4 }}
              />
              <CardContent>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography
                    variant="h6"
                    color="initial"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mr: "10px"
                    }}
                  >
                    {user.fname} {user.lname}
                  </Typography>
                  {user.isVerified && <VerifiedIcon color="verifiedIcon"/>}
                </Box>
                <Box mt={1} display="flex" flexDirection="column" alignItems="center"> 
                  <Typography variant="body2" color="#78858F">
                    Email
                  </Typography>
                  <Typography variant="subtitle2" color="initial">
                    {user.email}
                  </Typography>
                  <Typography variant="body2" color="#78858F">
                    Date of Birth
                  </Typography>
                  <Typography variant="subtitle2" color="initial">
                    {new Date(user.dob).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="#78858F">
                    Gender
                  </Typography>
                  <Typography variant="subtitle2" color="initial">
                    {`${user.gender.charAt(0).toUpperCase()}${user.gender.slice(1).toLowerCase()}`}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ width: '100%' }}>
          <Card sx={{ mt: 5, borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" color="initial">
                About
              </Typography>
              <Typography variant="body2" color="initial">
                {user.profileDescription}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {!user.isVerified && (
          <Grid item xs={12} sx={{ width: '100%' }}>
            <Card sx={{ mt: 5, borderRadius: 4 }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" color="initial">
                  Resend email verification
                </Typography>
                <Paper
                  component="form"

                  sx={{
                    boxShadow: 'none',
                    bgcolor: 'grey.main',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <InputBase
                    placeholder="Enter your email"
                    value={user.email}
                    sx={{ padding: 1 }}
                  />
                  <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <EmailIcon />
                  </IconButton>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        )}




        {user.roles != "lecturer"
          ? (user.courses.length > 0 ? (
            user.courses.map((course) => (
              <Grid item xs={12} sx={{ width: '100%' }}>
                <Card sx={{ borderRadius: 3, mt: 5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      //   justifyContent: "center",
                      alignItems: 'center',
                      maxHeight: '180px',
                      bgcolor: 'light.main',
                      borderRadius: 4,
                    }}
                  >
                    <Box
                      sx={{
                        p: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="initial"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {course.courseCode}
                      </Typography>
                      <Typography variant="body2" color="#78858F">
                        {course.lectures.length} Classes attended!
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', p: '0 30px' }}>
                      <LinearProgress
                        variant="determinate"
                        value={
                          course.lectures.length < 3
                            ? (course.lectures.length / 3) * 100
                            : course.lectures.length < 8
                              ? (course.lectures.length / 8) * 100
                              : course.lectures.length < 15
                                ? (course.lectures.length / 15) * 100
                                : null
                        }
                      />
                    </Box>
                    <Stack
                      flexDirection="row"
                      mt="20px"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box>
                        {course.lectures.length < 3 ? (
                          <Box
                            component="img"
                            sx={{ width: '60px', height: '60px' }}
                            alt="Bronze medal"
                            src="../../../bronze-medal.png"
                          />
                        ) : course.lectures.length < 8 ? (
                          <Box
                            component="img"
                            sx={{ width: '60px', height: '60px' }}
                            alt="Silver medal"
                            src="../../../silver-medal.png"
                          />
                        ) : course.lectures.length < 15 ? (
                          <Box
                            component="img"
                            sx={{ width: '60px', height: '60px' }}
                            alt="gold medal"
                            src="../../../public/gold-badge.png"
                          />
                        ) : null}
                      </Box>
                      <Typography>
                        {course.lectures.length < 3
                          ? `Attend ${3 - course.lectures.length} more lectures to rank up!`
                          : course.lectures.length < 8
                            ? `Attend ${8 - course.lectures.length} more lectures to rank up!`
                            : course.lectures.length < 15
                              ? "You're a superstar!"
                              : null}
                      </Typography>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <p>oh naurr</p>
          ))
          : null}







        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: 5, borderRadius: 4, marginBottom: 5 }}
          component={Link}
          href="/edit-profile"
        >
          Edit profile
        </Button>
      </Box>
    </Container>
  );
};

export default UserProfilePage;
