import * as dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';
import express from 'express';
import { Course } from '../../schemas/courseSchema.js';

const router = express.Router();
const API_KEY = process.env.OPEN_AI_API_KEY ?? '';
const ORG_ID = process.env.ORG_ID ?? '';
const PROJ_ID = process.env.PROJ_ID ?? '';

export const openai = new OpenAI({
  apiKey: API_KEY,
  organization: ORG_ID,
  project: PROJ_ID,
});

router.post('/summarizeReview', async (req, res) => {
  const course_Id = req.body.courseId;

  if (!course_Id)
    return res
      .status(400)
      .json('Please provided a course you want to get summary');

  console.log(course_Id);

  try {
    const course = await Course.findById(course_Id);

    if (!course)
      return res.status(500).json('Unable to retrieve course reviews data');

    const courseName = JSON.stringify(
      course.course_dummy_id + ': ' + course.courseName,
    );
    const reviewArray = JSON.stringify(course.reviews);

    if (!reviewArray || reviewArray.length <= 0)
      return res.status(400).json('This course has no review yet!');

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Please act like a geniue course advisor summarize the reviews into only 50 words paragraph for course ${courseName} provided below in plain languages: ${reviewArray} for prospective students who might want to take the course and provide a rating 1 out of 5`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    if (!completion)
      return res
        .status(500)
        .json('Unable to generate summary, please try again in 10 minutes!');

    return res.status(200).json(completion.choices[0]);
  } catch (e) {
    console.log(e.messages);
    console.log(e);
    return res.status(500).json(e.messages);
  }
});

export default router;
