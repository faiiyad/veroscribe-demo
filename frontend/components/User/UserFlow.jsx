'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBookings } from '../../lib/api';
import { UserDashboardHeader } from './UserDashboardHeader';
import { UserAppointmentCard } from './UserAppointmentCard';

const DEMO_EMAIL = 'faiyad.masnoon@mail.utoronto.ca';

const STATUS_ORDER = { confirmed: 0, pending: 1, cancelled: 2 };

const Wrapper = ({ children }) => (
  <div className="min-h-screen bg-transparent pt-28 px-4 pb-8">
    <main className="max-w-[900px] mx-auto">
      {children}
    </main>
  </div>
);

export default function UserFlow() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

    const fetchBookings = () => {
            getBookings({ patientEmail: DEMO_EMAIL })
            .then(res => setBookings(res.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
        };

        useEffect(() => {
            fetchBookings();
            const interval = setInterval(fetchBookings, 10000);
            return () => clearInterval(interval);
        }, []);

  const filtered = bookings
    .filter(b => !filterStatus || b.status === filterStatus)
    .sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));

  const counts = {
    all:       bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const filterTabs = [
    { label: 'All',       value: '',          count: counts.all       },
    { label: 'Confirmed', value: 'confirmed',  count: counts.confirmed },
    { label: 'Pending',   value: 'pending',    count: counts.pending   },
    { label: 'Cancelled', value: 'cancelled',  count: counts.cancelled },
  ];

  return (
    <Wrapper>
      <div className="animate-fade-up">
        <UserDashboardHeader />

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                filterStatus === tab.value
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-[#6B7280] border-[#bee0f6] hover:border-black hover:text-black'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs ${filterStatus === tab.value ? 'opacity-70' : 'opacity-50'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-lg py-3.5 px-4 mb-6 text-[#991B1B] text-sm">
            ⚠ {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-[#9A8F82] text-sm">
            Loading your appointments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border-[1.5px] border-[#bee0f6]">
            <p className="text-[#9A8F82] text-[15px] mb-4">
              {filterStatus ? `No ${filterStatus} appointments.` : "You don't have any appointments yet."}
            </p>
            <Link
              href="/book"
              className="inline-block px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium"
            >
              Book your first appointment →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {filtered.map(booking => (
              <UserAppointmentCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}

        {/* Footer count */}
        {!loading && bookings.length > 0 && (
          <p className="text-xs text-[#C5BFB5] text-center mt-6">
            Showing {filtered.length} of {bookings.length} appointment{bookings.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </Wrapper>
  );
}