// All browser-side API calls go through the proxy at /api
// In Docker: proxy routes /api/* → backend:4000
// In local dev: Next.js rewrites /api/* → localhost:4000
const API_BASE = '/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

// Physicians
export const getPhysicians = () => request('/physicians');
export const getPhysicianSlots = (id) => request(`/physicians/${id}/slots`);

// Bookings
export const createBooking = (payload) =>
  request('/bookings', { method: 'POST', body: JSON.stringify(payload) });

export const getBookings = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/bookings${qs ? `?${qs}` : ''}`);
};

export const updateBookingStatus = (id, status, adminNotes) =>
  request(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, ...(adminNotes ? { adminNotes } : {}) }),
  });
