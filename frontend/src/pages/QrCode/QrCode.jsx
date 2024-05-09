import { Container, Typography, Box, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FRONTEND_HOST_URL =
  import.meta.env.VITE_FRONTEND_NETLIFY_APP_URL ??
  'http://localhost:5173';

const QrCode = () => {

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const [qrCode, setQrCode] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  const courseId = searchParams.get('course');
  const lecture = searchParams.get('lecture');
  const courseCode = searchParams.get('courseCode');

  if (!courseId || !lecture) {
    return (<>
      <div style={{backgroundColor: "white"}}>
        <h1 style={{
          color: "black",
          scale: "500px"
        }}>
          Error generating QR code
        </h1>
        <button onClick={()=>{navigate(-1)}}>Go Back</button>
      </div>
    </>)
  }

  const getServerTime = async () => {
    const time = await fetch(
      `http://worldtimeapi.org/api/timezone/Pacific/Auckland`
    );
    const timeJson = await time.json();
    setCurrentTime(timeJson.utc_datetime);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      getServerTime();
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setQrCode(
      `${FRONTEND_HOST_URL}/qr-landing-page?date=${currentTime}&course=${courseId}&lecture=${lecture}&courseCode=${encodeURI(courseCode)}`
    );
  }, [currentTime]);

  useEffect(() => {
    console.log(qrCode);
  }, [qrCode]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row-reverse',
        width: '100%',
        justifyContent: 'center',
        mt: 10,
      }}
    >
      <Box>
        <Typography variant='h5' mb="10px" color="light.main">{courseCode}</Typography>
        <QRCode value={qrCode} />
        <Typography variant="body1" color="primary">
          {currentTime}
        </Typography>
      </Box>
      <Box
        component="img"
        src="/will_smith.png"
        sx={{ width: '400px' }}
      ></Box>
    </Box>
  );
};

export default QrCode;
