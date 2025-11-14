import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ['game', 'article'],
      required: true
    },
    targetId: {
      type: String,
      required: true
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
