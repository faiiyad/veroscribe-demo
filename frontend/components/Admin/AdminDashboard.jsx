'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBookings, getPhysicians, updateBookingStatus, deleteBooking } from '../../lib/api';
import { StatCard } from './StatusComponents';
import { DashboardHeader } from './DashboardHeader';
import { DashboardFilters } from './DashboardFilters';
import { BookingsTable } from './BookingsTable';

const Wrapper = ({ children }) => (
  <div className="min-h-screen bg-transparent pt-28 px-4 pb-8">
    <main className="max-w-[1100px] mx-auto">
      {children}
    </main>
  </div>
);

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [physicians, setPhysicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterPhysician, setFilterPhysician] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterPhysician) params.physicianId = filterPhysician;

      const [bookingsRes, physRes] = await Promise.all([
        getBookings(params),
        physicians.length === 0 ? getPhysicians() : Promise.resolve({ data: physicians }),
      ]);

      setBookings(bookingsRes.data);
      if (physicians.length === 0) setPhysicians(physRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPhysician]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleStatusChange(bookingId, newStatus) {
    setUpdatingId(bookingId);
    try {
      const res = await updateBookingStatus(bookingId, newStatus);
      setBookings(prev => prev.map(b => b._id === bookingId ? res.data : b));
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Permanently delete this booking?')) return;
    try {
      await deleteBooking(id);
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  }

  const counts = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };



  return (
    <Wrapper>
      <div className="min-h-screen bg-white/60 py-8 px-4 rounded-xl">
        <main className="max-w-[1100px] mx-auto animate-fade-up">

          <DashboardHeader />

          {/* Stat cards */}
          <div className="flex gap-3 flex-wrap mb-7">
            <StatCard label="Total Bookings"  value={counts.total}     color="#ffffff" />
            <StatCard label="Pending Review"  value={counts.pending}   color="#ffffff" />
            <StatCard label="Confirmed"       value={counts.confirmed} color="#ffffff" />
            <StatCard label="Cancelled"       value={counts.cancelled} color="#ffffff" />
          </div>

          <DashboardFilters
            filterStatus={filterStatus}
            filterPhysician={filterPhysician}
            physicians={physicians}
            onStatusChange={setFilterStatus}
            onPhysicianChange={setFilterPhysician}
            onClear={() => { setFilterStatus(''); setFilterPhysician(''); }}
            onRefresh={fetchData}
          />

          {error && (
            <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-lg py-3.5 px-4 mb-4 text-[#991B1B] text-sm">
              ⚠ {error}
            </div>
          )}

          <BookingsTable
            bookings={bookings}
            loading={loading}
            updatingId={updatingId}
            onStatusChange={handleStatusChange}
            onDelete = {handleDelete}
          />

          <p className="text-xs text-[#C5BFB5] text-center mt-6">
            Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            {filterStatus || filterPhysician ? ' (filtered)' : ''}
          </p>

        </main>
      </div>
    </Wrapper>
  );
}