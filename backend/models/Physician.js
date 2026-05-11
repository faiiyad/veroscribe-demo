import mongoose from 'mongoose';

const physicianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    bio: { type: String, required: true },
    // Initials + color for avatar
    initials: { type: String, required: true, maxlength: 2 },
    avatarColor: { type: String, default: '#2E8B7A' },
    // Weekdays they work: 0=Sun, 1=Mon, ..., 6=Sat
    workDays: { type: [Number], default: [1, 2, 3, 4, 5] },
    // Times available each work day (24h format "HH:MM")
    workTimes: {
      type: [String],
      default: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Physician', physicianSchema);
