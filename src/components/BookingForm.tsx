/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, FileText, BadgeDollarSign, CheckCircle2, ChevronRight } from 'lucide-react';
import { Booking } from '../types';

interface BookingFormProps {
  onSubmit: (bookingData: Omit<Booking, 'id' | 'clientName' | 'clientEmail' | 'status' | 'filesCount' | 'createdAt'>) => void;
  clientEmail: string;
}

const CATEGORIES = [
  { name: 'Wedding Photography', price: 250000, desc: 'Full ceremony & bridal party portraits' },
  { name: 'Fashion Editorial', price: 150000, desc: 'High-fashion backdrops and studio lighting' },
  { name: 'Portrait Session', price: 1500, desc: 'Sunset family or personal headshots' },
  { name: 'Commercial Shoot', price: 75000, desc: 'Commercial products and restaurant menu framing' },
  { name: 'Maternity Session', price: 25000, desc: 'Soft pastel themed family portrait series' },
];

export default function BookingForm({ onSubmit, clientEmail }: BookingFormProps) {
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto calculate pricing based on selection
  const selectedCat = CATEGORIES.find(c => c.name === category) || CATEGORIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !location) return;

    onSubmit({
      category,
      date,
      time,
      location,
      notes,
      price: selectedCat.price,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      // Reset
      setDate('');
      setLocation('');
      setNotes('');
    }, 2500);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5" id="booking-form-sec">
      <div className="mb-4">
        <h3 className="text-base font-display font-semibold text-stone-100 flex items-center gap-2">
          <BadgeDollarSign className="text-amber-500" size={18} />
          Book Photography Session
        </h3>
        <p className="text-xs text-stone-400">Select standard category package & request a secure slot</p>
      </div>

      {isSubmitted ? (
        <motion.div 
          className="py-12 flex flex-col items-center text-center justify-center space-y-3 bg-stone-950/40 rounded-xl border border-stone-800"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="text-sm font-semibold text-stone-200">Booking Request Sent!</h4>
          <p className="text-xs text-stone-400 max-w-[240px]">
            Your booking ID is being assigned. Live progress timeline is now active in your dashboard.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Category selection grid */}
          <div className="space-y-2">
            <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase">Photography Category</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                    category === cat.name
                      ? 'border-amber-500 bg-amber-500/5 text-stone-100'
                      : 'border-stone-800 bg-stone-950/50 hover:bg-stone-900/60 text-stone-300'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-stone-200">{cat.name}</p>
                    <p className="text-[10px] text-stone-500 leading-tight mt-0.5">{cat.desc}</p>
                  </div>
                  <span className="font-mono text-xs text-amber-500 font-bold">₹{cat.price.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Date Picker */}
            <div className="space-y-1.5 text-left">
              <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase flex items-center gap-1">
                <Calendar size={11} className="text-amber-500" />
                Date Request
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Time Picker */}
            <div className="space-y-1.5 text-left">
              <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase flex items-center gap-1">
                <Clock size={11} className="text-amber-500" />
                Time Slot
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-1.5 text-left">
            <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase flex items-center gap-1">
              <MapPin size={11} className="text-amber-500" />
              Event Coordinates / Location
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Leela Palace, ECR, Chennai or Coimbatore, Tamil Nadu"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5 text-left">
            <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase flex items-center gap-1">
              <FileText size={11} className="text-amber-500" />
              Creative Concept Notes (Optional)
            </label>
            <textarea
              placeholder="Desires, lighting preferences, or outfit plans..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
          </div>

          {/* Pricing Summary bar and submit button */}
          <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-stone-500 uppercase">ESTIMATED PRICE</span>
              <p className="text-lg font-mono font-bold text-amber-500">₹{selectedCat.price.toLocaleString('en-IN')}</p>
            </div>
            <button
              type="submit"
              disabled={!date || !location}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-semibold rounded-xl transition-all shadow-md shadow-amber-500/10 disabled:opacity-55 disabled:cursor-not-allowed font-display"
            >
              Request Slot <ChevronRight size={13} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
