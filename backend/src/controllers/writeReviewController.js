import { Course } from "../schemas/courseSchema";

export const addReview = async (courseId, reviewData) => {
    try {
        const review = await Course.findByIdAndUpdate(
            courseId,
            { $push: { reviews: reviewData } }, // Use $push to add the new review to the reviews array
            { new: true } // Set { new: true } to return the updated course document after the update
        );
        return review;
    } catch (error) {
        console.error(error);
        return null;
    }
};