import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    courseName: { type: String, required: true, default: 'null' },
    lecturer: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true, default: 'null' },
    category: String,
    level: String,
    price: Number,
    reviews: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        content: String,
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    lectures: [{
      // lectureId: {type: String, unique:true, },
      lectureName: {type:String},
      attendence: {type: Number, default: 0},
      date: {type:String}
    }]
  },
  { timestamps: true },
);

export const Course = mongoose.model('Course', courseSchema);
