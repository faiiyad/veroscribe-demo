import './globals.css';
import NavBar from '../components/Navbar/Navbar';

export const metadata = {
  title: 'MedBook — Patient Appointment Booking',
  description: 'Book appointments with our specialist physicians easily and securely.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <NavBar/>
        {children}
      </body>
    </html>
  );
}
