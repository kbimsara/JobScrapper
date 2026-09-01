import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  requirements: [{ type: String }],
  skills: [{ type: String }],
  employmentType: { type: String },
  source: { type: String, required: true }, // platform (e.g., linkedin)
  sourceJobId: { type: String },
  url: { type: String, required: true },
  postedAt: { type: Date },
  collectedAt: { type: Date, default: Date.now },
  fingerprint: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'jobposts'
});

export const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
