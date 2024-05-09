import { el } from '@faker-js/faker';
import { Router } from 'express';
import { User } from '../../schemas/userSchema.js';
import { Course } from '../../schemas/courseSchema.js';
import { authenticate } from '../../middleware/authMW.js';
import mongoose from 'mongoose';

const QrRouters = Router();

function convertToDateObject(date) {
  const [time, rubbish] = date.split('.');
  const timez = time + 'z';
  const timezOb = new Date(timez);
  return timezOb;
}

QrRouters.post('/qr-code', async (req, res) => {
  const date = req.body.date;
  const courseId = req.body.courseId;
  const lectureId = req.body.lecture;
  const courseCode = req.body.courseCode;
  const username = req.user;

  console.log(courseCode)
  if(username === undefined){
    console.log("handled")
    return res.status(400).json({errorMessage: "please log in "})

  }
  const usernameIdObject = new mongoose.Types.ObjectId(username._id);
  const courseIdObject = new mongoose.Types.ObjectId(courseId);
  const lectureIdObject = new mongoose.Types.ObjectId(lectureId);

  const dateNowSkeet = await fetch(
    `http://worldtimeapi.org/api/timezone/Pacific/Auckland`,
  );  
  const dateNowJson = await dateNowSkeet.json();
  const dateNow = dateNowJson.utc_datetime;

  const dateObject = convertToDateObject(date);
  const dateNowObject = convertToDateObject(dateNow);
  const difference = (dateNowObject - dateObject) / 1000;

  if (date == undefined || courseId == undefined) {
    return res.json('Date or courseId or lectureId undefined');
  }

  //---------------------------set expiry time here skeet ------------------------------------
  if (difference < 30) {

    try {
      const skeet = await User.updateOne(
        {
          _id: usernameIdObject,
          courses: { $not: { $elemMatch: { courseId: courseId } } },
        },
        {
          $addToSet: { courses: { courseId: courseId, courseCode: courseCode} },
        },
      ).exec();

      const existingCourse = await User.findOne(
        {
          _id: usernameIdObject,
          courses: { $elemMatch: { courseId: courseId } },
        },
        { 'courses.$': 1 },
      );
      if (existingCourse && existingCourse.courses.length > 0) {
        const course = existingCourse.courses[0];
        const lectureExists = course.lectures.some(
          (lecture) => lecture.lectureId === lectureId,
        );
        if (!lectureExists) {
          const addLecture = await User.updateOne(
            {
              _id: usernameIdObject,
              courses: { $elemMatch: { courseId: courseId } },
            },
            { $addToSet: { 'courses.$.lectures': { lectureId: lectureId } } },
          ).exec();
          const result = await Course.updateOne(
            { _id: courseId, 'lectures._id': lectureId },
            { $inc: { 'lectures.$.attendence': 1 } },
          ).exec();
        } else {
          return res.json({ validity: false });
        }
      }
    } catch (error) {
      return res.json({
        errorMessage: error,
        validity: false,
      });
    }

    return res.status(200).json({
      validity: true,
    });
  } else {
    return res.json({
      message: 'Qr code not valid',
      validity: false,
    });
  }
});

export default QrRouters;
