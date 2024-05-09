import { Router } from 'express';

import { Course } from '../../schemas/courseSchema.js';

const landingPosts = Router();

landingPosts.get('/landing-posts', async (req, res) => {
  try {
    const courses = await Course.find({});

    res.send(courses);
  } catch (error) {
    console.error('Error fetching courses: ', error);

    res.status(500).send('Internal server error');
  }
});

export default landingPosts;
