/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Calendar, Image as ImageIcon, User, Bell, ShieldCheck, CheckCircle2, 
  MapPin, Clock, Star, Download, Sparkles, Phone, Mail, Award, AlertTriangle, X
} from 'lucide-react';
import { Booking, Gallery, Folder, Photo, AppNotification, UserProfile } from '../types';
import WatermarkedImage from './WatermarkedImage';
import BookingForm from './BookingForm';

interface ClientDashboardViewProps {
  currentClient: UserProfile;
  bookings: Booking[];
  galleries: Gallery[];
  folders: Folder[];
  photos: Photo[];
  notifications: AppNotification[];
  onAddBooking: (bookingData: any) => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onTogglePhotoBest: (photoId: string) => void;
  onClearNotificationBadge?: () => void;
}

const STATUS_STEPS = [
  'Pending',
  'Approved',
  'Photographer Assigned',
  'Shooting Completed',
  'Editing',
  'Client Review',
  'Delivered',
  'Archived'
];

export default function ClientDashboardView({
  currentClient,
  bookings,
  galleries,
  folders,
  photos,
  notifications,
  onAddBooking,
  onUpdateProfile,
  onTogglePhotoBest,
  onClearNotificationBadge,
}: ClientDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'gallery' | 'profile' | 'notifications'>('home');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Profile preferences state
  const [phone, setPhone] = useState(currentClient.phone || '');
  const [categoryPreference, setCategoryPreference] = useState(currentClient.categoryPreference || 'Wedding');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter items for current client
  const clientBookings = bookings.filter(b => b.clientEmail === currentClient.email);
  const clientGalleries = galleries.filter(g => g.clientEmail === currentClient.email);
  const clientNotifications = notifications.filter(n => n.userEmail === currentClient.email || !n.userEmail);

  const unreadCount = clientNotifications.filter(n => !n.read).length;

  const currentActiveBooking = clientBookings.find(b => b.status !== 'Delivered' && b.status !== 'Archived') || clientBookings[0];
  const previousBookings = clientBookings.filter(b => b.id !== currentActiveBooking?.id);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...currentClient,
      phone,
      categoryPreference,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Helper to get status index
  const getStatusStepIndex = (status: string) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="flex flex-col h-full bg-stone-950 text-stone-100 select-none" id="client-dashboard-root">
      {/* Simulation Device Handheld Status Bar */}
      <div className="bg-stone-900/40 border-b border-stone-800/50 px-5 py-2 flex items-center justify-between text-[11px] font-mono text-stone-400">
        <div className="flex items-center gap-1.5 font-bold">
          <span>09:41 AM</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1 rounded">5G</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5">
            <ShieldCheck size={11} className="text-amber-500" /> Secure Sandbox Mode
          </span>
          <span>100% 🔋</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-20 p-4 md:p-6" id="client-main-view">
        <AnimatePresence mode="wait">
          {/* 1. HOME VIEW */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Header Greeting Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800 flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full" />
                <div>
                  <h2 className="text-xl font-display font-bold text-stone-100">Welcome, {currentClient.name}</h2>
                  <p className="text-xs text-stone-400 mt-1">Ready to review your premium photography proofs</p>
                </div>
                <div className="w-12 h-12 rounded-full border border-stone-800 bg-stone-900 overflow-hidden">
                  <img src={currentClient.avatar} alt="Client avatar" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Status Tracker & Timeline for Active Booking */}
              {currentActiveBooking ? (
                <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-amber-500/20">
                        ACTIVE BOOKING TIMELINE
                      </span>
                      <h3 className="text-sm font-display font-semibold text-stone-200 mt-2">{currentActiveBooking.category}</h3>
                    </div>
                    <span className="text-xs font-mono text-stone-400">{currentActiveBooking.id}</span>
                  </div>

                  {/* Horizontal Timeline Indicators */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 mb-2">
                      <span>Status: <strong className="text-amber-400">{currentActiveBooking.status}</strong></span>
                      <span>Progress {Math.round(((getStatusStepIndex(currentActiveBooking.status) + 1) / STATUS_STEPS.length) * 100)}%</span>
                    </div>

                    <div className="w-full bg-stone-950 h-2 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full bg-gradient-to-r from-stone-600 via-amber-500 to-yellow-400 transition-all duration-500" 
                        style={{ width: `${((getStatusStepIndex(currentActiveBooking.status) + 1) / STATUS_STEPS.length) * 100}%` }}
                      />
                    </div>

                    {/* Timeline Step details */}
                    <div className="mt-4 grid grid-cols-4 md:grid-cols-8 gap-2 text-center text-[9px] font-mono">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = getStatusStepIndex(currentActiveBooking.status) >= idx;
                        const isCurrent = currentActiveBooking.status === step;
                        return (
                          <div key={step} className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border text-[8px] font-bold ${
                              isCurrent 
                                ? 'bg-amber-500 text-stone-950 border-amber-400 font-extrabold animate-pulse' 
                                : isDone 
                                  ? 'bg-stone-800 text-stone-300 border-stone-700' 
                                  : 'bg-stone-950 text-stone-600 border-stone-900'
                            }`}>
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span className={`mt-1.5 hidden md:block truncate w-14 ${isCurrent ? 'text-amber-400 font-bold' : 'text-stone-500'}`}>{step}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-800/60 grid grid-cols-2 gap-3 text-xs text-stone-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-amber-500" />
                      <span className="truncate">{currentActiveBooking.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Clock size={13} className="text-amber-500" />
                      <span>{currentActiveBooking.date} @ {currentActiveBooking.time}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-stone-900/40 rounded-2xl border border-stone-800">
                  <p className="text-stone-400 text-xs">No active bookings currently scheduled.</p>
                </div>
              )}

              {/* Secure Quick-Proof Gallery Banner */}
              {clientGalleries.length > 0 && (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-display font-semibold text-stone-200">Your Secure Galleries</h3>
                    <button 
                      onClick={() => setActiveTab('gallery')}
                      className="text-xs text-amber-500 hover:text-amber-400 font-mono flex items-center gap-0.5"
                    >
                      VIEW ALL &rarr;
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {clientGalleries.map(g => (
                      <div 
                        key={g.id}
                        onClick={() => {
                          setSelectedGalleryId(g.id);
                          setActiveTab('gallery');
                        }}
                        className="p-4 bg-stone-950 border border-stone-800 hover:border-amber-500/40 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-amber-500 border border-stone-800">
                            <ImageIcon size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-stone-200 group-hover:text-amber-400 transition-colors">{g.title}</h4>
                            <span className="text-[10px] font-mono text-stone-500 block mt-0.5">{g.photoCount} proofs secure</span>
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold uppercase">
                          {g.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 2. BOOKINGS VIEW */}
          {activeTab === 'bookings' && (
            <motion.div
              key="bookings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Form to submit a booking */}
              <BookingForm onSubmit={onAddBooking} clientEmail={currentClient.email} />

              {/* Previous Bookings Activity */}
              {previousBookings.length > 0 && (
                <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-5 space-y-3 text-left">
                  <h3 className="text-sm font-display font-semibold text-stone-300">Previous Booking Sessions</h3>
                  <div className="space-y-2.5">
                    {previousBookings.map(b => (
                      <div key={b.id} className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <h4 className="font-semibold text-stone-200">{b.category}</h4>
                          <span className="text-[10px] font-mono text-stone-500 block mt-0.5">{b.date} • {b.location}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] px-2 py-0.5 bg-stone-900 rounded font-mono text-stone-400 font-bold border border-stone-800">
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. GALLERY SECURE WORKSPACE */}
          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              {selectedGalleryId === null ? (
                // Galleries Selection view
                <div className="space-y-4">
                  <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-semibold text-stone-200">Client Secure Proofing Desk</h3>
                      <p className="text-[10px] text-stone-500">Watermarks active on previews. Downloads blocked on pending proofs.</p>
                    </div>
                  </div>

                  {clientGalleries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {clientGalleries.map(g => (
                        <div
                          key={g.id}
                          onClick={() => {
                            setSelectedGalleryId(g.id);
                            // Auto select first folder
                            const firstFolder = folders.find(f => f.galleryId === g.id);
                            if (firstFolder) setSelectedFolderId(firstFolder.id);
                          }}
                          className="p-5 bg-stone-900 hover:bg-stone-900/80 border border-stone-800 hover:border-amber-500/30 rounded-2xl cursor-pointer transition-all space-y-4 relative group overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-2xl rounded-full" />
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 rounded-full font-bold">
                              SECURE PORTAL
                            </span>
                            <span className="text-[10px] font-mono text-stone-500">EXPIRATION: {g.expirationType}</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-display font-bold text-stone-200 group-hover:text-amber-400 transition-colors">{g.title}</h4>
                            <p className="text-xs text-stone-400 mt-1">{g.photoCount} high-resolution photographs locked</p>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-stone-500 border-t border-stone-800/80 pt-3">
                            <span>Folders: {g.folderCount}</span>
                            <span>Created: {g.createdAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-stone-900/30 border border-stone-800 border-dashed rounded-2xl">
                      <ImageIcon className="mx-auto text-stone-600 mb-3" size={32} />
                      <h4 className="text-sm font-medium text-stone-300">No Galleries Allocated</h4>
                      <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">Your assigned photographer will publish proofs here once editing begins.</p>
                    </div>
                  )}
                </div>
              ) : (
                // Detail view inside chosen gallery
                <div className="space-y-4">
                  {/* Gallery header bar with back button */}
                  <div className="flex items-center justify-between p-3 bg-stone-900 border border-stone-800 rounded-2xl">
                    <button
                      onClick={() => {
                        setSelectedGalleryId(null);
                        setSelectedFolderId(null);
                      }}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-mono font-bold transition-all"
                    >
                      &larr; GALLERIES
                    </button>
                    <h3 className="text-xs font-display font-semibold text-stone-300 truncate max-w-[180px]">
                      {clientGalleries.find(g => g.id === selectedGalleryId)?.title}
                    </h3>
                  </div>

                  {/* Sub folders scroll list */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {folders
                      .filter(f => f.galleryId === selectedGalleryId)
                      .map(f => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFolderId(f.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                            selectedFolderId === f.id
                              ? 'bg-amber-500 border-amber-500 text-stone-950 font-bold'
                              : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {f.name} ({f.photoCount})
                        </button>
                      ))}
                  </div>

                  {/* Photo proofing grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {photos
                      .filter(p => p.galleryId === selectedGalleryId && p.folderId === selectedFolderId)
                      .map(photo => {
                        const isRaw = photo.extension === 'RAW';
                        return (
                          <div 
                            key={photo.id}
                            onClick={() => setSelectedPhoto(photo)}
                            className="group cursor-pointer bg-stone-900/50 border border-stone-800 rounded-xl overflow-hidden p-2 hover:border-amber-500/30 transition-all flex flex-col justify-between h-48"
                          >
                            <div className="relative flex-1 rounded-lg overflow-hidden min-h-0 bg-stone-950 flex items-center justify-center">
                              {isRaw ? (
                                <div className="text-center p-2">
                                  <AlertTriangle size={16} className="text-amber-500 mx-auto mb-1" />
                                  <span className="text-[9px] font-mono text-stone-400 block uppercase">RAW Capture</span>
                                </div>
                              ) : (
                                <img 
                                  src={photo.url} 
                                  alt="Secure thumbnail" 
                                  className="w-full h-full object-cover pointer-events-none"
                                />
                              )}
                              {/* Soft security indicators */}
                              <div className="absolute top-1.5 left-1.5 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-mono text-white/80 z-10 flex items-center gap-0.5 border border-white/5">
                                <ShieldCheck size={8} className="text-amber-500" /> PROOF
                              </div>

                              {photo.selectedAsBest && (
                                <div className="absolute top-1.5 right-1.5 bg-amber-500 text-stone-950 px-1 py-1 rounded-full z-10 shadow">
                                  <Star size={8} fill="currentColor" />
                                </div>
                              )}
                            </div>

                            <div className="mt-2 text-left">
                              <h5 className="text-[10px] font-semibold text-stone-300 truncate font-mono">{photo.filename}</h5>
                              <div className="flex justify-between items-center text-[8px] font-mono text-stone-500 mt-1">
                                <span>{photo.size}</span>
                                <span>{photo.extension}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 4. CLIENT PROFILE VIEW */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 text-left"
            >
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500/30 shadow">
                    <img src={currentClient.avatar} alt="Profile avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-base font-display font-bold text-stone-100">{currentClient.name}</h3>
                    <p className="text-xs font-mono text-stone-500">Client Account ID: u-client-1</p>
                  </div>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase block">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={currentClient.email}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-400 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 text-stone-500" size={13} />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase block">Preferred Photography Style</label>
                    <select
                      value={categoryPreference}
                      onChange={(e) => setCategoryPreference(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Wedding">Wedding & Ceremony</option>
                      <option value="Portrait">Portrait & Headshots</option>
                      <option value="Fashion Editorial">Fashion Editorial</option>
                      <option value="Commercial Shoot">Commercial & Products</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl transition-all shadow-md shadow-amber-500/10 font-display text-xs"
                  >
                    Save Changes
                  </button>

                  {saveSuccess && (
                    <motion.div 
                      className="text-center text-xs font-mono text-emerald-400 font-semibold mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ✓ Preferences updated securely
                    </motion.div>
                  )}
                </form>
              </div>

              {/* Secure Download info card */}
              <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="text-amber-500" size={14} /> SECURITY PROTOCOL SUMMARY
                </h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Every preview is dynamically layered with digital noise and a reproducing watermark. Long pressing and drags are blocked. RAW captures are kept untouched on physical servers.
                </p>
              </div>
            </motion.div>
          )}

          {/* 5. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-display font-semibold text-stone-200">System Activity Notifications</h3>
                {onClearNotificationBadge && (
                  <button 
                    onClick={onClearNotificationBadge}
                    className="text-[10px] font-mono text-stone-500 hover:text-stone-300"
                  >
                    MARK ALL READ
                  </button>
                )}
              </div>

              {clientNotifications.length > 0 ? (
                <div className="space-y-2.5">
                  {clientNotifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                        n.read 
                          ? 'bg-stone-900/40 border-stone-800/80 text-stone-400' 
                          : 'bg-stone-900 border-amber-500/10 text-stone-200 shadow-md shadow-amber-500/5'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${
                        n.type === 'booking_status' 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : n.type === 'proof_review'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-stone-800 text-stone-400'
                      }`}>
                        <Bell size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-xs font-semibold ${n.read ? 'text-stone-300' : 'text-stone-100'}`}>{n.title}</h4>
                        <p className="text-[11px] text-stone-400 mt-1 leading-snug">{n.message}</p>
                        <span className="text-[9px] font-mono text-stone-500 block mt-1.5">{n.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-stone-900/20 border border-stone-800 rounded-2xl">
                  <Bell className="mx-auto text-stone-700 mb-2" size={24} />
                  <p className="text-stone-500 text-xs font-mono">No notifications on file.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Photo Preview Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden max-w-lg w-full relative p-4 space-y-4 text-left"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-1.5 bg-stone-950 hover:bg-stone-800 rounded-full border border-stone-800 text-stone-400 hover:text-stone-100 z-50 transition-colors"
              >
                <X size={15} />
              </button>

              {/* Main Photo block */}
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-950 flex items-center justify-center">
                <WatermarkedImage 
                  src={selectedPhoto.url} 
                  alt={selectedPhoto.filename} 
                  clientName={currentClient.name}
                  date={selectedPhoto.uploadDate.split(' ')[0]}
                  className="w-full h-full"
                  isRawPlaceholder={selectedPhoto.extension === 'RAW'}
                />
              </div>

              {/* Photo Details / Proof Controls */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider font-semibold">
                      SECURE DIGITAL PROOF
                    </span>
                    <h4 className="text-sm font-display font-semibold text-stone-200 mt-1.5 truncate max-w-[280px]">{selectedPhoto.filename}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                    {selectedPhoto.size} ({selectedPhoto.extension})
                  </span>
                </div>

                <p className="text-[10px] text-stone-400 leading-relaxed">
                  This proofing session allows you to flag your favorites. High-definition files will unlock once studio editing reaches delivered status.
                </p>

                {/* Proof Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onTogglePhotoBest(selectedPhoto.id);
                      setSelectedPhoto(prev => prev ? { ...prev, selectedAsBest: !prev.selectedAsBest } : null);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      selectedPhoto.selectedAsBest
                        ? 'bg-amber-500 text-stone-950 shadow'
                        : 'bg-stone-950 text-stone-300 border border-stone-800 hover:bg-stone-800/60'
                    }`}
                  >
                    <Star size={13} fill={selectedPhoto.selectedAsBest ? 'currentColor' : 'none'} />
                    {selectedPhoto.selectedAsBest ? 'Favorite Selected' : 'Mark Favorite'}
                  </button>

                  <button
                    onClick={() => {
                      alert('Download Request Filed! High-resolution secure package will trigger once status is finalized by Admin.');
                    }}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border border-stone-700 transition-colors"
                  >
                    <Download size={13} />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-stone-900 border-t border-stone-800 z-40 max-w-lg mx-auto rounded-t-2xl shadow-xl flex justify-around p-1">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
            activeTab === 'home' ? 'text-amber-500' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
            activeTab === 'bookings' ? 'text-amber-500' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Calendar size={18} />
          <span>Bookings</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
            activeTab === 'gallery' ? 'text-amber-500' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <ImageIcon size={18} />
          <span>Gallery</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors relative ${
            activeTab === 'notifications' ? 'text-amber-500' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Bell size={18} />
          <span>Alerts</span>
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-6 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
            activeTab === 'profile' ? 'text-amber-500' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <User size={18} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
