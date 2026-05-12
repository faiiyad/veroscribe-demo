import express from 'express';
import Booking from '../models/Booking.js';
import Physician from '../models/Physician.js';

const router = express.Router();

// POST /api/bookings — create a new booking
router.post('/', async (req, res) => {
  try {
    const { physicianId, slotDate, slotTime, patientName, patientEmail, patientPhone, reasonForVisit } =
      req.body;

    // Validate required fields
    if (!physicianId || !slotDate || !slotTime || !patientName || !patientEmail || !reasonForVisit) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const physician = await Physician.findById(physicianId);
    if (!physician) return res.status(404).json({ success: false, error: 'Physician not found' });

    // Check slot isn't already taken (guard against race condition)
    const conflict = await Booking.findOne({
      physician: physicianId,
      slotDate,
      slotTime,
      status: { $ne: 'cancelled' },
    });
    if (conflict) {
      return res.status(409).json({ success: false, error: 'This time slot is no longer available' });
    }

    const booking = await Booking.create({
      physician: physicianId,
      physicianName: physician.name,
      physicianSpecialty: physician.specialty,
      slotDate,
      slotTime,
      patientName,
      patientEmail,
      patientPhone,
      reasonForVisit,
      status: 'pending',
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'This time slot is no longer available' });
    }
    console.error('[POST /bookings]', err);
    res.status(500).json({ success: false, error: 'Failed to create booking' });
  }
});

// GET /api/bookings — list all bookings (admin view)
router.get('/', async (req, res) => {
  try {
    const { status, physicianId, patientEmail, page = 1, limit = 50 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (physicianId) filter.physician = physicianId;
    if (patientEmail) filter.patientEmail = patientEmail;

    const bookings = await Booking.find(filter)
      .populate('physician', 'name specialty avatarColor initials')
      .sort({ slotDate: 1, slotTime: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    res.json({ success: true, data: bookings, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error('[GET /bookings]', err);
    res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/:id — single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('physician');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch booking' });
  }
});

// PATCH /api/bookings/:id/status — update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const update = { status };
    if (adminNotes !== undefined) update.adminNotes = adminNotes;

    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true }).populate(
      'physician',
      'name specialty'
    );

    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

    res.json({ success: true, data: booking });
  } catch (err) {
    console.error('[PATCH /bookings/:id/status]', err);
    res.status(500).json({ success: false, error: 'Failed to update booking' });
  }
});

// DELETE /api/bookings/:id — hard delete (optional, admin only)
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete booking' });
  }
});

export default router;
