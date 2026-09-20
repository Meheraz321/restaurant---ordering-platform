import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  Utensils,
  Wine,
  Heart,
  Trees,
  Crown,
  Info,
} from 'lucide-react';
import { TableType, Reservation } from '../types.ts';

interface ReservationSectionProps {
  onReservationCreated: (res: Reservation) => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ onReservationCreated }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:30');
  const [guests, setGuests] = useState(2);
  const [tableType, setTableType] = useState<TableType>('couple');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00'
  ];

  const tableTypeOptions: { type: TableType; label: string; icon: any; desc: string }[] = [
    { type: 'couple', label: 'Romantic Couple Booth', icon: Heart, desc: 'Intimate candlelit seating' },
    { type: 'indoor', label: 'Main Hearth Dining', icon: Utensils, desc: 'Central ambiance with open kitchen view' },
    { type: 'outdoor', label: 'Garden Courtyard Terrace', icon: Trees, desc: 'Under starlight with gentle heaters' },
    { type: 'family', label: 'Family & Group Round', icon: Users, desc: 'Spacious 6-8 guest table' },
    { type: 'vip', label: 'The Sovereign VIP Suite', icon: Crown, desc: 'Private mezzanine with dedicated sommelier' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !date || !time) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail: customerEmail || 'guest@emberspice.com',
          customerPhone,
          date,
          time,
          guests,
          tableType,
          specialRequest,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedReservation(data.data);
        onReservationCreated(data.data);

        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#ea580c'],
        });
      }
    } catch (err) {
      console.error('Reservation failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservations" className="py-20 px-4 sm:px-6 lg:px-8 relative bg-stone-950 text-left overflow-hidden">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Table Reservations</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-100 mb-4 tracking-tight">
            Reserve Your Gastronomic Evening
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Immerse yourself in our open-hearth culinary theatre. Select your preferred ambiance, time, and party size below.
          </p>
        </div>

        {/* Form or Confirmed State */}
        {confirmedReservation ? (
          <div className="max-w-xl mx-auto p-8 rounded-3xl bg-stone-900 border border-amber-500/30 text-center shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-500">
                Reservation Confirmed
              </span>
              <h3 className="font-display text-2xl font-bold text-stone-100">
                We Look Forward to Welcoming You
              </h3>
              <p className="text-xs text-stone-400">
                A confirmation SMS & email has been dispatched to {confirmedReservation.customerEmail}.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-stone-950 rounded-2xl border border-stone-800 p-5 text-left text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                <span className="text-stone-400">Reservation Ticket</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {confirmedReservation.reservationNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Guest Name</span>
                <span className="font-semibold text-stone-200">{confirmedReservation.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Date & Time</span>
                <span className="font-bold text-stone-100">
                  {confirmedReservation.date} at {confirmedReservation.time}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Party Size</span>
                <span className="text-stone-200">{confirmedReservation.guests} Guests</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Table Ambience</span>
                <span className="uppercase text-amber-300 font-semibold">{confirmedReservation.tableType}</span>
              </div>
              {confirmedReservation.tableNumber && (
                <div className="flex justify-between items-center pt-2 border-t border-stone-800">
                  <span className="text-stone-400">Assigned Table</span>
                  <span className="font-bold text-amber-400 text-sm">{confirmedReservation.tableNumber}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setConfirmedReservation(null)}
              className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
            >
              Make Another Reservation
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-2xl backdrop-blur-xl space-y-8"
          >
            {/* 1. Date, Time & Guests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-500" />
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Select Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts} (Dinner Service)
                    </option>
                  ))}
                </select>
              </div>

              {/* Party Size */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  Number of Guests
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[1, 2, 4, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`flex-1 min-w-[38px] py-2.5 rounded-xl text-xs font-bold transition-all ${
                        guests === num
                          ? 'bg-amber-600 text-stone-950 shadow-md'
                          : 'bg-stone-950 border border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {num}{num === 10 ? '+' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Table Ambience Options */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-3">
                Preferred Dining Ambiance
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tableTypeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = tableType === opt.type;
                  return (
                    <div
                      key={opt.type}
                      onClick={() => setTableType(opt.type)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-600/15 border-amber-500 text-amber-200 shadow-lg shadow-amber-600/10'
                          : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                        <span className="font-semibold text-xs text-stone-200">{opt.label}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-normal">{opt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Customer Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Lorde Sterling"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Special Request */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Special Requests or Dietary Requirements (Optional)
              </label>
              <textarea
                rows={2}
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="Anniversary candles, dietary allergies, sommelier consultation..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                id="btn-confirm-reservation"
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-xl shadow-amber-600/25 transition-all hover:scale-102 active:scale-98"
              >
                {isSubmitting ? 'Confirming Table Allocation...' : 'Confirm Table Reservation'}
              </button>
              <p className="text-[11px] text-stone-500 mt-2">
                No upfront reservation fee required. Cancellations are free up to 2 hours before dining time.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
