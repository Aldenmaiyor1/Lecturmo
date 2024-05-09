import { Router } from 'express';

import { Course } from '../../schemas/courseSchema.js';

const landingPosts = Router();

landingPosts.get('/landing-posts', async (req, res) => {
  
  try {
    const courses = await Course.find({});

    return res.status(200).json(courses)

  } catch (error) {
    console.error('Error fetching courses: ', error);

    return res.status(500).send('Internal server error');
  }
});

export default landingPosts;
