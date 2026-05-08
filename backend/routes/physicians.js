const express = require('express');
const router = express.Router();
const Physician = require('../models/Physician');
const Booking = require('../models/Booking');

// GET /api/physicians — list all active physicians
router.get('/', async (req, res) => {
  try {
    const physicians = await Physician.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: physicians });
  } catch (err) {
    console.error('[GET /physicians]', err);
    res.status(500).json({ success: false, error: 'Failed to fetch physicians' });
  }
});

// GET /api/physicians/:id — single physician
router.get('/:id', async (req, res) => {
  try {
    const physician = await Physician.findById(req.params.id);
    if (!physician) return res.status(404).json({ success: false, error: 'Physician not found' });
    res.json({ success: true, data: physician });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch physician' });
  }
});

// GET /api/physicians/:id/slots — available slots for next 14 days
router.get('/:id/slots', async (req, res) => {
  try {
    const physician = await Physician.findById(req.params.id);
    if (!physician) return res.status(404).json({ success: false, error: 'Physician not found' });

    // Fetch all active (non-cancelled) bookings for this physician
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureBookings = await Booking.find({
      physician: physician._id,
      status: { $ne: 'cancelled' },
    }).select('slotDate slotTime');

    // Build a set of booked slot keys
    const bookedKeys = new Set(futureBookings.map((b) => `${b.slotDate}_${b.slotTime}`));

    const slots = [];

    for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);

      const dayOfWeek = date.getDay();
      if (!physician.workDays.includes(dayOfWeek)) continue;

      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

      const availableTimes = physician.workTimes.filter(
        (time) => !bookedKeys.has(`${dateStr}_${time}`)
      );

      if (availableTimes.length > 0) {
        slots.push({ date: dateStr, times: availableTimes });
      }
    }

    res.json({ success: true, data: slots });
  } catch (err) {
    console.error('[GET /physicians/:id/slots]', err);
    res.status(500).json({ success: false, error: 'Failed to fetch slots' });
  }
});

module.exports = router;
