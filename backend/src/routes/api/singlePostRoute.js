import { el } from '@faker-js/faker';
import { Router } from 'express';
import { User } from '../../schemas/userSchema.js';
import { Course } from '../../schemas/courseSchema.js';
import { authenticate } from '../../middleware/authMW.js';
import mongoose from 'mongoose';

const SinglePageRouters = Router();

SinglePageRouters.post("/toggle-like", async (req, res) => {
  const reviewId = req.body.reviewId
  const courseId = req.body.courseId
  const loggedInUserId = req.user

  if (loggedInUserId == undefined) {
    return res.status(404).json({ Error_message: "user not logged in " })
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
  try {
    const courseId = req.params.courseId;

    // Fetch the course document
    const course = await Course.findById(courseId).populate({
      path: 'reviews',
      populate: {
        path: 'userId',
        select: 'userId',
      },
    });


    if (!course) {
      console.log(`Course with ID ${courseId} not found`);
      return res.status(404).json({ error: 'Course not found' });
    }

    // Extract user IDs from reviews
    const userIds = course.reviews.map(review => review.userId._id.toString());

    // Remove duplicates by creating a Set from the array
    const uniqueUserIds = [...new Set(userIds)];

    // Fetch users from the User collection
    const users = await User.find({ _id: { $in: uniqueUserIds } }).select('username avatarPicture courses isVerified');

    // Create a map of userId to user details for quick lookup
    const userMap = new Map();
    users.forEach(user => {
      user.courses = user.courses.filter(userCourse => userCourse.courseId.toString() === courseId); // Filter courses for the current course
      userMap.set(user._id.toString(), user);
    });

    // Merge user details back into the reviews
    course.reviews.forEach(review => {
      if (userMap.has(review.userId._id.toString())) {
        review.userId = userMap.get(review.userId._id.toString());
      }
    });

    res.status(200).json(course);

    // const course = await Course.findById(courseId).populate({
    //   path: 'reviews',
    //   populate: {
    //     path: 'userId',
    //     select: 'username avatarPicture courses isVerified',
    //   },
    // });
    // if (!course) {
    //   return res.status(404).json({ error: 'Course not found' });
    // }
    // if (course && course.reviews.length > 0) {
    //   for(let i = 0; i < course.reviews.length; i++){
    //     course.reviews[i].userId.courses = course.reviews[i].userId.courses.filter(userCourse => userCourse.courseId == courseId);
    //   }   
    // }
    // res.json(course);
  } catch (error) {
    console.error('Error fetching course data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default SinglePageRouters;
