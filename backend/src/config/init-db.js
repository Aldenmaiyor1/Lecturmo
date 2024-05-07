import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import {
  createEmptyCourses,
  populateCourses,
  initCourses,
  updateCourseForeignKeys,
} from './data/initCourseData.js';
import {
  createEmptyUsers,
  populateUsers,
  initUsers,
  updateUserForeignKeys,
} from './data/initUserData.js';

const MONGODB_CONNECTION_STRING =
  process.env.MONGODB_CONNECTION_STRING ??
  'mongodb://localhost:27017/lecturmon';

// This is a standalone program which will populate the database with initial data.
async function run() {
  try {
    console.log('Connecting to database.');
    await mongoose.connect(MONGODB_CONNECTION_STRING);

    await mongoose.connection.dropDatabase();
    console.log('Database cleared.');

    // barebones creation just to allow foreign key referencing
    // const users = await createEmptyUsers();
    // const courses = await createEmptyCourses();

    const courses = await initCourses();

    if (courses) {
      const users = await initUsers();

      await updateUserForeignKeys(users, courses);
      await updateCourseForeignKeys(users, courses);

      await populateUsers(users, courses);
      await populateCourses(users, courses);
    }

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

run();
