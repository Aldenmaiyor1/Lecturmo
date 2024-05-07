import { faker } from '@faker-js/faker';
import { Course } from '../../schemas/courseSchema.js';
import { coursesJSON } from './raw/coursesJSON.js';
import { newCoursesJSON } from './raw/newCoursesJSON.js'

const NUMBER_OF_COURSES = 5;

export async function initCourses() {
  try {
    // const intialCourses = await Course.insertMany(coursesJSON)
    const secondInitCourses = await Course.insertMany(newCoursesJSON);
    console.log('Courses initialized.');
    return secondInitCourses;
  } catch (error) {
    console.error('Error adding courses:', error);
    throw error;
  }
}

// find the actual generated _id based off dummy id
async function fetchUserIds(users) {
  const userMap = {};
  users.forEach((user) => {
    userMap[user.user_dummy_id] = user._id;
  });
  return userMap;
}

export async function updateCourseForeignKeys(users, courses) {
  try {
    // Retrieve the map of dummy IDs to actual user IDs
    const userMap = await fetchUserIds(users);

    // Map the courses and update their nested references
    const updates = courses.map(async (course) => {
      // Update lecturer reference
      if (course.dummyLecId && userMap[course.dummyLecId]) {
        course.lecturerId = userMap[course.dummyLecId];
      }

      // Update reviews references
      course.reviews.forEach((review) => {
        if (review.dummyId && userMap[review.dummyId]) {
          review.userId = userMap[review.dummyId];
        }
        review.likes = review.dummyLikes.map((dummy) => ({
          userId: userMap[dummy],
        }));
      });

      // Save the updated course
      await course.save();
    });

    await Promise.all(updates);
    console.log('Course foreign keys updated successfully.');
  } catch (error) {
    console.error('Error updating course foreign keys:', error);
    throw error;
  }
}

export async function createEmptyCourses() {
  const courses = await Promise.all(
    Array.from({ length: NUMBER_OF_COURSES }, () => new Course().save()),
  );
  return courses;
}

export async function populateCourses(users, courses) {
  try {
    const updatedCourses = await Promise.all(
      courses.map(async (course) => {
        // Populate course details
        course.courseName = faker.company.catchPhrase();
        (course.lecturer = faker.helpers.arrayElement(users)._id),
          (course.description = course.description);
        course.category = course.category;
        course.level = faker.helpers.arrayElement([
          'Bachelor',
          'Postgrad',
          'Masters',
        ]);

        // Create random reviews
        // course.reviews = Array.from(
        //   { length: faker.number.int({ min: 1, max: 5 }) },
        //   () => ({
        //     userId: faker.helpers.arrayElement(users)._id, // Random user ID from the fetched users
        //     content: this,
        //     likes: users
        //       .filter(() => faker.datatype.boolean())
        //       .map((user) => user._id),
        //     difficultyRating: faker.number.int({ min: 1, max: 5 }),
        //     contentRating: faker.number.int({ min: 1, max: 5 }),
        //     qualityRating: faker.number.int({ min: 1, max: 5 })
        //   }),
        // );

        course.reviews = course.reviews.map((review) => {
          return {
            userId: faker.helpers.arrayElement(users)._id,
            content: review.content,
            likes: users
              .filter(() => faker.datatype.boolean())
              .map((user) => user._id),
            difficultyRating: faker.number.int({ min: 1, max: 5 }),
            contentRating: faker.number.int({ min: 1, max: 5 }),
            qualityRating: faker.number.int({ min: 1, max: 5 })
          }
        })

        return course.save(); // Save the updated course
      }),
    );
  } catch (error) {
    console.error('Failed to populate courses:', error);
  }
}
