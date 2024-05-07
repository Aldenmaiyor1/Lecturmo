import { faker } from '@faker-js/faker';
import { User } from '../../schemas/userSchema.js';
import { hashPassword } from '../../utils/useBcrypt.js';
import { usersJSON } from './raw/usersJSON.js';

const NUMBER_OF_USERS = usersJSON.length;
const PASSWORD = '123';

export async function initUsers() {
  try {
    const initialUsers = await User.insertMany(usersJSON);
    console.log('Users initialized.');
    return initialUsers;
  } catch (error) {
    console.error('Error adding users:', error);
    throw error;
  }
}

// find the actual generated _id based off dummy id
async function fetchCourseIds(courses) {
  const courseMap = {};
  courses.forEach((course) => {
    courseMap[course.course_dummy_id] = course._id;
  });
  return courseMap;
}

export async function updateUserForeignKeys(users, courses) {
  try {
    // Retrieve the map of dummy IDs to actual course IDs
    const courseMap = await fetchCourseIds(courses);
    const updates = users.map(async (user) => {
      user.courses = user.courses.map((courseEntry) => {
        if (courseMap[courseEntry.dummyId]) {
          courseEntry.courseId = courseMap[courseEntry.dummyId];
        }
        return courseEntry;
      });
      await user.save();
    });
    await Promise.all(updates);
    console.log('User foreign keys updated successfully.');
  } catch (error) {
    console.error('Error updating user foreign keys:', error);
    throw error;
  }
}

export async function createEmptyUsers() {
  try {
    const users = await Promise.all(
      Array.from({ length: NUMBER_OF_USERS }, async () => {
        const hashedPassword = await hashPassword(PASSWORD);

        return new User({
          username: faker.internet.userName(),
          password: hashedPassword,
          email: faker.internet.email(),
        }).save();
      }),
    );
    return users;
  } catch (error) {
    console.error('Failed to create users:', error);
    throw error;
  }
}

export async function populateUsers(users, courses) {
  try {
    // Map over existing users and update them
    const updatedUsers = await Promise.all(
      users.map(async (user, index) => {
        // Assign courses randomly
        const userCourses = courses
          .map((course) => ({
            courseId: course._id,
            attendanceCount: faker.number.int({ min: 1, max: 100 }),
          }))
          .filter(() => faker.datatype.boolean());

        // Populate user details
        user.name = faker.person.fullName();
        user.username = `user${index + 1}`;
        // user.password = "123";
        user.email = faker.internet.email();
        user.rank = faker.helpers.arrayElement([
          'Beginner',
          'Intermediate',
          'Advanced',
        ]);
        user.profileDescription = faker.lorem.sentence();
        user.avatarPicture = faker.image.avatar();
        user.isVerified = faker.datatype.boolean();
        user.roles = faker.helpers.arrayElement([
          'student',
          'lecturer',
          'admin',
        ]);
        user.courses = userCourses;

        return user.save();
      }),
    );
  } catch (error) {
    console.error('Failed to populate users:', error);
  }
}