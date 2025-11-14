import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rawgGameId: {
      type: String,
      required: true,
      index: true
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

ratingSchema.index({ user: 1, rawgGameId: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
