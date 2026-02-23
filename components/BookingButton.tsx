import React from 'react';
import { Calendar } from 'lucide-react';

const BookingButton: React.FC = () => {
  return (
    <a 
      href="#book"
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex items-center bg-white text-black px-6 py-4 rounded-full shadow-2xl shadow-black/50 hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300"
      aria-label="Book Appointment"
    >
      <Calendar className="w-5 h-5 flex-shrink-0 mr-3" strokeWidth={2.5} />
      <span className="font-bold uppercase tracking-[0.15em] text-xs whitespace-nowrap">
        Book Appointment
      </span>
    </a>
  );
};

export default BookingButton;