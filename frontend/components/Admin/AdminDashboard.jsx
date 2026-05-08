'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getBookings, getPhysicians, updateBookingStatus } from '../../lib/api';
import { formatDate, formatTime } from '../utils/component_utils';
import { StatCard, StatusBadge } from './StatusComponents';


const Wrapper = ({ children }) => (
  <div
    style={{
      minHeight: '100vh',
      background: 'transparent',
      padding: '7rem 1rem 2rem', // space for fixed navbar
    }}
  >
    <main style={{ maxWidth: 1100, margin: '0 auto' }}>
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

  // Filters
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

  const counts = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  

  return (
    <Wrapper>
      <div style={{ minHeight: '100vh', background: '#b7d4da', padding: '2rem 1rem' }}>

        <main style={{ maxWidth: 1100, margin: '0 auto' }} className="animate-fade-up">
          <div style={{ marginBottom: '1.75rem' }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: '#1A1A2E', margin: 0 }}>
              Appointment Dashboard
            </h1>
            <p style={{ color: '#9A8F82', fontSize: 14, marginTop: 4 }}>
              Manage and update patient appointment statuses.
            </p>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '1.75rem' }}>
            <StatCard label="Total Bookings" value={counts.total} color="#1A3C5E" />
            <StatCard label="Pending Review" value={counts.pending} color="#D97706" />
            <StatCard label="Confirmed" value={counts.confirmed} color="#059669" />
            <StatCard label="Cancelled" value={counts.cancelled} color="#DC2626" />
          </div>

          {/* Filters */}
          <div style={{
            background: 'white', borderRadius: 10, border: '1.5px solid #EAE6DE',
            padding: '1rem 1.25rem', marginBottom: '1.25rem',
            display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Filter:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                padding: '6px 12px', borderRadius: 7, border: '1.5px solid #E5E1D8',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#374151',
                background: 'white', cursor: 'pointer',
              }}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filterPhysician}
              onChange={e => setFilterPhysician(e.target.value)}
              style={{
                padding: '6px 12px', borderRadius: 7, border: '1.5px solid #E5E1D8',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#374151',
                background: 'white', cursor: 'pointer',
              }}
            >
              <option value="">All Physicians</option>
              {physicians.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            {(filterStatus || filterPhysician) && (
              <button
                onClick={() => { setFilterStatus(''); setFilterPhysician(''); }}
                style={{ fontSize: 12, color: '#9A8F82', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear filters
              </button>
            )}

            <button
              onClick={fetchData}
              style={{
                marginLeft: 'auto', padding: '6px 14px', background: '#EEF2F7', border: '1.5px solid #D1DCE8',
                borderRadius: 7, cursor: 'pointer', fontSize: 13, color: '#1A3C5E', fontWeight: 500,
              }}
            >
              ↻ Refresh
            </button>
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '0.875rem 1rem', marginBottom: '1rem', color: '#991B1B', fontSize: 14 }}>
              ⚠ {error}
            </div>
          )}

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 12, border: '1.5px solid #EAE6DE', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#9A8F82', fontSize: 14 }}>
                Loading appointments...
              </div>
            ) : bookings.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <p style={{ color: '#9A8F82', fontSize: 15 }}>No appointments found.</p>
                <Link href="/book" style={{ fontSize: 14, color: '#2E8B7A', fontWeight: 500 }}>Book the first one →</Link>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans', sans-serif" }}>
                  <thead>
                    <tr style={{ background: '#F7F5F0', borderBottom: '1.5px solid #EAE6DE' }}>
                      {['Patient', 'Physician', 'Date & Time', 'Reason', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{
                          padding: '0.875rem 1rem', textAlign: 'left',
                          fontSize: 12, fontWeight: 700, color: '#6B7280',
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, idx) => (
                      <tr
                        key={booking._id}
                        style={{
                          borderBottom: idx < bookings.length - 1 ? '1px solid #F0ECE5' : 'none',
                          background: updatingId === booking._id ? '#FAFAF7' : 'white',
                          transition: 'background 0.2s',
                        }}
                      >
                        {/* Patient */}
                        <td style={{ padding: '1rem', minWidth: 160 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A2E' }}>{booking.patientName}</div>
                          <div style={{ fontSize: 12, color: '#9A8F82', marginTop: 2 }}>{booking.patientEmail}</div>
                          {booking.patientPhone && (
                            <div style={{ fontSize: 12, color: '#9A8F82' }}>{booking.patientPhone}</div>
                          )}
                        </td>

                        {/* Physician */}
                        <td style={{ padding: '1rem', minWidth: 180 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                              background: booking.physician?.avatarColor || '#1A3C5E',
                              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11, fontWeight: 700,
                            }}>
                              {booking.physician?.initials || booking.physicianName?.split(' ').map(n => n[0]).slice(1, 3).join('')}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1A2E' }}>{booking.physicianName}</div>
                              <div style={{ fontSize: 11, color: '#9A8F82' }}>{booking.physicianSpecialty}</div>
                            </div>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td style={{ padding: '1rem', minWidth: 160, whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1A2E' }}>{formatDate(booking.slotDate)}</div>
                          <div style={{ fontSize: 12, color: '#2E8B7A', fontWeight: 500, marginTop: 2 }}>{formatTime(booking.slotTime)}</div>
                        </td>

                        {/* Reason */}
                        <td style={{ padding: '1rem', maxWidth: 220 }}>
                          <div style={{
                            fontSize: 13, color: '#6B7280', lineHeight: 1.4,
                            overflow: 'hidden', display: '-webkit-box',
                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                          }}>
                            {booking.reasonForVisit}
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                          <StatusBadge status={booking.status} />
                          {booking.adminNotes && (
                            <div style={{ fontSize: 11, color: '#9A8F82', marginTop: 4, fontStyle: 'italic' }}>
                              {booking.adminNotes}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {booking.status !== 'confirmed' && booking.status !== 'cancelled' && (
                              <button
                                onClick={() => handleStatusChange(booking._id, 'confirmed')}
                                disabled={updatingId === booking._id}
                                style={{
                                  padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                                  border: '1.5px solid #A7F3D0', background: '#D1FAE5', color: '#065F46',
                                  fontWeight: 600, opacity: updatingId === booking._id ? 0.6 : 1,
                                }}
                              >
                                Confirm
                              </button>
                            )}
                            {booking.status !== 'cancelled' && (
                              <button
                                onClick={() => handleStatusChange(booking._id, 'cancelled')}
                                disabled={updatingId === booking._id}
                                style={{
                                  padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                                  border: '1.5px solid #FECACA', background: '#FEE2E2', color: '#991B1B',
                                  fontWeight: 600, opacity: updatingId === booking._id ? 0.6 : 1,
                                }}
                              >
                                Cancel
                              </button>
                            )}
                            {booking.status === 'cancelled' && (
                              <button
                                onClick={() => handleStatusChange(booking._id, 'pending')}
                                disabled={updatingId === booking._id}
                                style={{
                                  padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
                                  border: '1.5px solid #FDE68A', background: '#FEF3C7', color: '#92400E',
                                  fontWeight: 600, opacity: updatingId === booking._id ? 0.6 : 1,
                                }}
                              >
                                Restore
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p style={{ fontSize: 12, color: '#C5BFB5', textAlign: 'center', marginTop: '1.5rem' }}>
            Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            {filterStatus || filterPhysician ? ' (filtered)' : ''}
          </p>
        </main>
      </div>
    </Wrapper>
  );
}
