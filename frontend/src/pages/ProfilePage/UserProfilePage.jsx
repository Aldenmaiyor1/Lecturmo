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
  Snackbar,
  Alert,
} from '@mui/material';
import React, { useState, useContext } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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

  const handleResendEmail = async () => {
    console.log("user:", user)
    const res = await resendVerificationEmail({
      username: user.username,
      email: user.email,
    });
    setEmailError(res && res.error ? res.message : '');
    if (!res.error) {
      setSentEmailSuccess(true);
    }
  }

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
              image={user.avatarPicture}
              sx={{ width: 250, height: 250, borderRadius: 4 }}
            />
            <CardContent>
              <Typography
                variant="h3"
                color="initial"
                sx={{
                  paddingBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {user.fname} {user.lname}
              </Typography>
              {user.isVerified && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: '10px',
                  }}
                >
                  <CheckCircleIcon style={{ color: 'green' }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginLeft: '5px' }}
                  >
                    Verified
                  </Typography>
                </Box>
              )}
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
              <Typography variant="body2" color="#78858F">
                Rank
              </Typography>
              <Typography variant="subtitle2" color="initial">
                {`${user.rank.charAt(0).toUpperCase()}${user.rank.slice(1).toLowerCase()}`}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Card sx={{ width: 600, marginTop: 5, borderRadius: 4 }}>
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
          <Card sx={{ width: 600, marginTop: 5, borderRadius: 4 }}>
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

        <Snackbar
          open={sentEmailSuccess}
          autoHideDuration={6000}
          onClose={() => setSentEmailSuccess(false)}
        >
          <Alert
            onClose={() => setSentEmailSuccess(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            Successfully Sent Verficiation Email!
          </Alert>
        </Snackbar>

        {user.courses.length > 0 ? (
          user.courses.map((course) => (
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                //   justifyContent: "center",
                alignItems: 'center',
                width: 600,
                height: '150px',
                bgcolor: 'light.main',
                borderRadius: 4,
              }}
            >
              <Box
                sx={{
                  p: '30px',
                  pb: 2,
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
              <Typography>
                {course.lectures.length < 3 ? (
                  <Box
                    component="img"
                    sx={{
                      height: 20,
                      width: 20,
                    }}
                    alt="Bronze medal"
                    src="https://static.vecteezy.com/system/resources/previews/008/088/089/original/champion-art-bronze-medal-with-red-ribbon-icon-sign-first-place-isolated-on-transparent-background-illustration-free-vector.jpg"
                  />
                ) : course.lectures.length < 8 ? (
                  <Box
                    component="img"
                    sx={{
                      height: 20,
                      width: 20,
                    }}
                    alt="Silver medal"
                    src="https://png.pngtree.com/element_our/20200702/ourmid/pngtree-silver-cartoon-medal-illustration-image_2286645.jpg"
                  />
                ) : course.lectures.length < 15 ? (
                  <Box
                    component="img"
                    sx={{
                      height: 20,
                      width: 20,
                    }}
                    alt="gold medal"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8szUihTTG9Xt756UbzaXgdEVu9So3MkRMeFfdLsNIQA&s"
                  />
                ) : null}
              </Typography>
              <Typography>
                {course.lectures.length < 3
                  ? `Attend ${3 - course.lectures.length} more lectures to rank up!`
                  : course.lectures.length < 8
                    ? `Attend ${8 - course.lectures.length} more lectures to rank up!`
                    : course.lectures.length < 15
                      ? "You're a superstar!"
                      : null}
              </Typography>
            </Box>
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
