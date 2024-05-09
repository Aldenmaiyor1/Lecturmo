import { el } from '@faker-js/faker';
import { Router } from 'express';
import { User } from '../../schemas/userSchema.js';
import { Course } from '../../schemas/courseSchema.js';
import { authenticate } from '../../middleware/authMW.js';
import mongoose from 'mongoose';

const SinglePageRouters = Router();

SinglePageRouters.post("/toggle-like", async (req,res) =>{
  const reviewId = req.body.reviewId
  const courseId = req.body.courseId
  const loggedInUserId = req.user

  if (loggedInUserId == undefined){
    return res.json({Error_message: "user not logged in "})
  }

  const loggedInUserIdString = loggedInUserId._id.toString()

  try {
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const review = course.reviews.find(review => review._id.toString() === reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const userExists = review.likes.some(like => like.userId === loggedInUserIdString);

    if (!userExists) {
      // User doesn't exist in likes, so add the like
      review.likes.push({ userId: loggedInUserIdString });
    } else {
      // User exists in likes, so remove the like
      review.likes = review.likes.filter(like => like.userId !== loggedInUserIdString);
    }

    // Update the likes in the database
    await Course.findByIdAndUpdate(courseId, course);

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



SinglePageRouters.get('/courses/:courseId', async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const course = await Course.findById(courseId).populate({
      path: 'reviews',
      populate: {
        path: 'userId',
        select: 'username avatarPicture courses isVerified',
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    if (course && course.reviews.length > 0) {
      for(let i = 0; i < course.reviews.length; i++){
        course.reviews[i].userId.courses = course.reviews[i].userId.courses.filter(userCourse => userCourse.courseId == courseId);
      }   
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default SinglePageRouters;
