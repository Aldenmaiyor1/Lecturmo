import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  Modal,
  Typography,
  Button,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TextField,
  IconButton,
} from '@mui/material';
import QrCode from '../QrCode/QrCode.jsx';
import AddNewLecture from '../../components/AddNewLecture.jsx';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContextProvider.jsx';
import { AuthContext } from '../../contexts/AuthContextProvider.jsx';
import Loading from '../../components/Loading.jsx';
import { toast } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClearIcon from '@mui/icons-material/Clear';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions.js';

const LecturerPage = () => {
  const { user } = useContext(AuthContext);
  if (user === null) {
    return <Loading />;
  }

  useEffect(() => {
    console.log('user:', user);
  }, [user]);

  const navigate = useNavigate();

  const [handleInitalLoad, setInitialLoad] = useState(true)

  const [coursesList, setCoursesList] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedLectureId, setSelectedLectureId] = useState(null);
  const [selectedLectureName, setSelectedLectureName] = useState(null);
  const [selectedCourseId, setCourseId] = useState(null);
  const [selectedCourseCode, setSelectedCourseCode] = useState('nothing selected');
  const [courses, setCourses] = useState();
  const [courseNo, setCourseNo] = useState();
  const [lectures, setLectures] = useState();
  const [newLectureTitle, setNewLectureTitle] = useState();
  const [lectureDate, setLectureDate] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [createLectureCourse, setCreateLectureCourse] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [paginationState, setPagination] = useState({})

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (months are zero-based) and pad with leading zero if necessary
    const year = date.getFullYear(); // Get full year

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const deleteLecture = async (lectureIdToDelete, courseIdToDelete) => {
    const response = await axios
      .post(
        `${BASE_URL}/delete-lecture`,
        {
          courseId: courseIdToDelete,
          lectureId: lectureIdToDelete,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          toast.success('Lecture successfully deleted');
          setCourseId(null);
          setSelectedLectureName(null);
          setSelectedLectureId(null);
          setSelectedCourseName('nothing selected');
        } else {
          toast.error('Error deleting lecture');
        }
        setIsLoading(!isLoading);
      });
  };

  const getClasses = async () => {
    await axios.get(`${BASE_URL}/lecture-list`).then((res) => {
      console.log(res);
      setCourseNo(res.data.length);
      setCourses(res.data);
      setLectures(res.data.lectures);
      setInitialLoad(false);
    });
  };

  const createLecture = async (courseId) => {
    console.log("lec", lectureDate)
    await axios
      .post(
        `${BASE_URL}/add-lecture`,
        {
          lectureName: newLectureTitle,
          courseId: courseId,
          date: lectureDate,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        setIsLoading(!isLoading);
      });
  };

  const handleSubmitLecture = async (courseId) => {
    try {
      await createLecture(courseId);
      toast.success('Lecture added successfully!');
      setOpenModal(false);
    } catch (error) {
      console.error('Failed to add lecture:', error);
      toast.error('Failed to add lecture. Please try again.');
    }
  };

  console.log(courses);

  useEffect(() => {
    sortList(changeSort)
  }, [changeSort])

  useEffect(() => {
    getClasses();
  }, [isLoading]);

  useEffect(() => {
    if (coursesList != undefined) {
      console.log(courseList);
    }
  }, [coursesList]);

  return (
    <>
      {handleInitalLoad ? <Loading /> :
        (user === null || user.roles != "lecturer" ? <AccessDenied /> :
          (courses ? (
            <Container
              maxWidth="lg"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 10,
              }}
            >
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  height: '250px',
                  width: '100vw',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="img"
                  src={user.avatarPicture}
                  sx={{ width: 180, height: '200px', borderRadius: 4 }}
                />
                <Box ml="10px">
                  <Typography variant="h6" color="initial">
                    Hi, {user.fname} {user.lname}
                  </Typography>
                  <Typography variant="body1" color="initial">
                    You are teaching{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      {courseNo} {courseNo <= 1 ? 'class' : 'classes'} {''}
                    </span>
                    at the moment.
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  bgcolor: 'secondary.main',
                  height: '100%',
                  width: '100vw',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'light.main',
                    maxWidth: '100%',
                    height: '200px',
                    borderRadius: 5,
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    m: 2,
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    color="initial"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {selectedCourseCode}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="initial"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {selectedLectureName}
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      window.open(
                        `http://localhost:5173/qr?lecture=${selectedLectureId}&course=${selectedCourseId}&courseCode=${encodeURI(selectedCourseCode)}`,
                        '_blank'
                      );
                    }}
                    sx={{
                      bgcolor: 'background.default',
                      borderRadius: 4,
                      width: '150px',
                      '&:hover': {
                        backgroundColor: 'secondary.main',
                        color: '#000000',
                      },
                    }}
                    disabled={
                      selectedLectureId === null ||
                        selectedCourseId === null ? true : false
                    }
                  >
                    Create QR code
                  </Button>
                </Box>
                <Box sx={{ bgcolor: "primary.main" }}>
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
                          value={changeSort}
                          onChange={(e) => {
                            setChangeSort(e.target.value)
                            console.log(changeSort)
                          }
                          }
                          sx={{ borderRadius: 5, bgcolor: 'light.main', height: '40px' }}
                        >
                          <MenuItem value={"dateDesc"}>Latest</MenuItem>
                          <MenuItem value={"dateAsc"}>Oldest</MenuItem>
                          <MenuItem value={"titleAsc"}>Title Ascending</MenuItem>
                          <MenuItem value={"titleDesc"}>Title Descending</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>
                  </Box>

            {courses.length > 0 ? (
              courses.map((course) => (
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    width: '100%',
                    height: '100%',
                    p: '20px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'center',
                      mb: '10px',
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="initial"
                      sx={{ mb: '5px', mr: '10px' }}
                    >
                      {course.courseName}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: 'secondary.main', borderRadius: 5 }}
                      onClick={() => {
                        setOpenModal(true);
                        setCreateLectureCourse(course._id);
                      }}
                    >
                      Add Lecture
                    </Button>
                  </Box>
                  <Table sx={{ maxWidth: '100%', bgcolor: 'grey.main' }}>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'light.main' }}>
                          Title
                        </TableCell>
                        <TableCell sx={{ color: 'light.main' }}>Date</TableCell>
                        <TableCell sx={{ color: 'light.main' }}>
                          Student Attendance
                        </TableCell>
                        <TableCell sx={{ color: 'light.main' }}>
                          Delete
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {course.lectures ? (
                        course.lectures
                          .map((lecture) => (
                            <TableRow
                              key={lecture._id}
                              onClick={() => {
                                setSelectedLectureId(lecture._id);
                                setSelectedLectureName(lecture.lectureName);
                                setCourseId(course._id);
                                setSelectedCourseName(course.courseName);
                              }}
                            >
                              <TableCell>
                                {' '}
                                {lecture.lectureName && lecture.lectureName}
                              </TableCell>
                              <TableCell>
                                {lecture.date ? formatDate(lecture.date) : null}
                              </TableCell>
                              <TableCell>
                                {lecture.attendence} students
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => {
                                    deleteLecture(lecture._id, course._id);
                                  }}
                                >
                                  <ClearIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <Typography variant="h6">
                          there are no lectures currently
                        </Typography>
                      )}
                    </TableBody>
                  </Table>

                  <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100vh',
                    }}
                    slotProps={{
                      backdrop: {
                        style: { backgroundColor: 'rgba(128, 128, 128, 0.3)' },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: 'secondary.main',
                        p: 10,
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 5,
                      }}
                    >
                      <TextField
                        onChange={(e) => {
                          setNewLectureTitle(e.target.value);
                        }}
                        sx={{ bgcolor: 'light.main' }}
                      ></TextField>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          format="DD-MM-YYYY"
                          onChange={(e) => {
                            setLectureDate(e.$d);
                            console.log(e.$d);
                          }}
                          label="Choose lecture date"
                          sx={{ bgcolor: 'light.main' }}
                        />
                      </LocalizationProvider>
                      <Button
                        onClick={() => {
                          handleSubmitLecture(createLectureCourse);
                        }}
                        sx={{
                          bgcolor: 'background.default',
                          ml: '10px',
                          borderRadius: 5,
                          '&:hover': {
                            backgroundColor: 'lightBlue.main',
                          },
                        }}
                        disabled={
                          newLectureTitle === undefined ||
                          lectureDate === undefined
                        }
                      >
                        Submit
                      </Button>
                    </Box>
                  </Modal>
                </Box>
              ))
            ) : (
              <Typography variant="h6">
                YOU ARE NOT CURRENTLY IN CHARGE OF ANY CLASSES
              </Typography>
            )}
          </Box>
        </Container>
      ) : null}
    </>
  );
};

export default LecturerPage;
