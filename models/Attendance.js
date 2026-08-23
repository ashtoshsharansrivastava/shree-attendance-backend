import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    workerId: { type: String, required: true, lowercase: true, trim: true },
    photo: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, default: 'Verified' },
  },
  { timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);