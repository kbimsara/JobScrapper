import mongoose from 'mongoose';

const JobRoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  keywords: [{ type: String }],
  locations: [{ type: String }],
  enabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'jobroles'
});

export const JobRole = mongoose.models.JobRole || mongoose.model('JobRole', JobRoleSchema);
