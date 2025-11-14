import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    thumbnailUrl: String,
    shortDescription: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    relatedGameId: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    publishedAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

articleSchema.index({ title: 'text', shortDescription: 'text', content: 'text', tags: 1 });

articleSchema.pre('save', function setUpdated(next) {
  this.updatedAt = new Date();
  next();
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
