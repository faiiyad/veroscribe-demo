'use client';

import { useEffect, useState } from 'react';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-4 left-1/2 -translate-x-1/2
        w-[70%]
        flex items-center justify-between
        px-6 py-3
        rounded-xl
        z-50
        transition-all duration-300
        ${scrolled
          ? 'bg-white/50 backdrop-blur-md border border-white/40 shadow-none'
          : 'bg-transparent border border-transparent shadow-none'}
      `}
    >

      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-5 w-auto" />
      </div>


      <div className="flex items-center gap-3">
        <button className="light-sweep px-4 py-2 bg-black text-white rounded-md hover:opacity-80 transition">
          Book Now <span>→</span>
        </button>

        <button className="light-sweep px-4 py-2 bg-black text-white rounded-md hover:opacity-80 transition">
          Login <span>→</span>
        </button>
      </div>
    </nav>
  );
}