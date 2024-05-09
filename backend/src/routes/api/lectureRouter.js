import { el } from '@faker-js/faker';
import { Router } from 'express';
import { User } from '../../schemas/userSchema.js';
import { Course } from '../../schemas/courseSchema.js';
import { authenticate } from '../../middleware/authMW.js';
import mongoose from 'mongoose';

const LectureRouter = Router();

function convertToDateObject(date) {
  const [time, rubbish] = date.split('.');
  const timez = time + 'z';
  const timezOb = new Date(timez);

  return timezOb;
}

LectureRouter.post('/add-lecture', async (req, res) => {
    const lectureName = req.body.lectureName;
    const courseId = req.body.courseId;
    const lectureTime = req.body.date

  const courseIdObject = new mongoose.Types.ObjectId(courseId);

  const dateNowSkeet = await fetch(
    `http://worldtimeapi.org/api/timezone/Pacific/Auckland`,
  );
  const dateNowSkeetJson = await dateNowSkeet.json();
  console.log(dateNowSkeetJson.utc_datetime);

    const lecture = {
        lectureName: lectureName,
        attendenace: 0,
        date: lectureTime,
        qrCreationTime: dateNowSkeetJson.utc_datetime,
    };

  const sket = await Course.updateOne(
    { _id: courseIdObject },
    {
      $push: { lectures: lecture },
    },
  ).exec();

  res.send('fuck');
});

LectureRouter.get('/lecture-list', async (req, res) => {
  try {
    const user = req.user;
    console.log(user._id);

    const course = await Course.find({ lecturerId: user._id }).exec();
    console.log(course);

    res.json(course);
  } catch (error) {
    res.send(error);
  }
});

LectureRouter.post('/delete-lecture', async (req, res) => {
  const courseId = req.body.courseId;
  const lectureId = req.body.lectureId;

  try {
    const res = Course.updateOne(
      { _id: courseId },
      { $pull: { lectures: { _id: lectureId } } },
    ).exec();
  } catch (error) {
    res.json({ errorMessage: error, success: false });
  }

  res.json({ success: true });
});

export default LectureRouter;
