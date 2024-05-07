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
    <Box
      sx={{
        marginTop: '50px',
        marginBottom: '50px',
        bgcolor: 'primary.main',
        height: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 5,
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
        <Box sx={{ width: 600 }}>
          <Card
            sx={{
              padding: '10px',
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
              sx={{ width: 250, height: 250, borderRadius: 4 }}
            />
            <CardContent>
              <Stack
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography
                  variant="h5"
                  color="initial"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  mr="10px"
                >
                  {user.fname} {user.lname}
                </Typography>
                {user.isVerified && <VerifiedIcon color="verifiedIcon" />}
              </Stack>
              <Typography variant="body2" color="#78858F" marginTop={5}>
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
            </CardContent>
          </Card>
        </Box>

        <Card sx={{ width: 600, mt: 5, borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" color="initial">
              About
            </Typography>
            <Typography variant="body2" color="initial">
              {user.profileDescription}
            </Typography>
          </CardContent>
        </Card>

        {!user.isVerified && (
          <Card sx={{ width: 600, mt: 5, borderRadius: 4 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" color="initial">
                Resend email verification
              </Typography>
              <Paper
                component="form"
                sx={{
                  boxShadow: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px',
                  fontStyle: 'italic',
                }}
              >
                <InputBase
                  placeholder="Enter your email"
                  value={user.email}
                  sx={{ padding: 1 }}
                />

                <IconButton sx={{ p: '10px' }} aria-label="menu"
                  onClick={handleResendEmail}>
                  <EmailIcon />
                </IconButton>

              </Paper>
              {emailError && (
                <Typography color="error" align="center">
                  {emailError}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {user.courses.length > 0 ? (
          user.courses.map((course) => (
            <Card sx={{ borderRadius: 3, mt: 5 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  //   justifyContent: "center",
                  alignItems: 'center',
                  width: 600,
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
                    variant="h5"
                    color="initial"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {course.courseName}
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
          ))
        ) : (
          <p>oh naurr</p>
        )}

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
    </Box>
  );
};

export default UserProfilePage;
