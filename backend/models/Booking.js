import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    physician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Physician',
      required: true,
    },
    
    physicianName: { type: String, required: true },
    physicianSpecialty: { type: String, required: true },

    // Appointment slot
    slotDate: { type: String, required: true }, // "YYYY-MM-DD"
    slotTime: { type: String, required: true }, // "HH:MM"

    // Patient details
    patientName: { type: String, required: true, trim: true },
    patientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    patientPhone: { type: String, trim: true },
    reasonForVisit: { type: String, required: true, trim: true },

    // Workflow status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },

    // Optional admin notes
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Compound index to prevent double-booking
bookingSchema.index({ physician: 1, slotDate: 1, slotTime: 1 }, { unique: true });

export default mongoose.model('Booking', bookingSchema);
