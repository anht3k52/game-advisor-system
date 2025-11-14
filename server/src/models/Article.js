import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    titleVi: {
      type: String,
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
    shortDescriptionVi: String,
    content: {
      type: String,
      required: true
    },
    contentVi: String,
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

// 👉 Text index KHÔNG chứa tags
articleSchema.index({
  title: 'text',
  shortDescription: 'text',
  content: 'text'
});

// 👉 Tạo index bình thường cho tags (không bắt buộc)
articleSchema.index({ tags: 1 });

articleSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
