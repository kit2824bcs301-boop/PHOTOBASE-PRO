/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Users, Calendar, Image as ImageIcon, BarChart3, ShieldAlert, 
  Settings, ChevronRight, Menu, Plus, Trash2, Edit2, UploadCloud, CheckCircle2, 
  AlertTriangle, Folder, FolderPlus, ArrowUpRight, Search, Sparkles, RefreshCw, X, Eye
} from 'lucide-react';
import { Booking, Gallery, Folder as FolderType, Photo, UserProfile, AuditLog, UserRole } from '../types';
import AnalyticsCharts from './AnalyticsCharts';
import AIAssistantWidget from './AIAssistantWidget';
import WatermarkedImage from './WatermarkedImage';

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

interface AdminStaffDashboardViewProps {
  currentUser: UserProfile;
  users: UserProfile[];
  bookings: Booking[];
  galleries: Gallery[];
  folders: FolderType[];
  photos: Photo[];
  auditLogs: AuditLog[];
  onAddGallery: (title: string, bookingId: string, clientEmail: string) => void;
  onUpdateBookingStatus: (bookingId: string, newStatus: any) => void;
  onAssignStaff: (bookingId: string, staffId: string, staffName: string) => void;
  onAddFolder: (galleryId: string, name: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onUploadPhotos: (galleryId: string, folderId: string, photoFiles: { filename: string; url: string; size: string; extension: string }[]) => void;
  onDeletePhoto: (photoId: string) => void;
  onTogglePhotoBest: (photoId: string) => void;
  onSetPhotoCover: (photoId: string) => void;
  onClearDuplicatesInFolder: (galleryId: string, folderId: string) => void;
  onResetDb: () => void;
  onAddNotification: (title: string, msg: string, type: any, opts: any) => void;
  onAddAuditLog: (action: string) => void;
}

export default function AdminStaffDashboardView({
  currentUser,
  users,
  bookings,
  galleries,
  folders,
  photos,
  auditLogs,
  onAddGallery,
  onUpdateBookingStatus,
  onAssignStaff,
  onAddFolder,
  onRenameFolder,
  onDeleteFolder,
  onUploadPhotos,
  onDeletePhoto,
  onTogglePhotoBest,
  onSetPhotoCover,
  onClearDuplicatesInFolder,
  onResetDb,
  onAddNotification,
  onAddAuditLog,
}: AdminStaffDashboardViewProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'clients' | 'bookings' | 'galleries' | 'analytics' | 'settings'>('dashboard');
  
  // Search & Filter state
  const [bookingFilter, setBookingFilter] = useState<string>('All');
  const [clientSearch, setClientSearch] = useState('');
  const [gallerySearch, setGallerySearch] = useState('');

  // Creation Modals & Forms State
  const [selectedGalleryId, setSelectedGalleryId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  
  // Folder Creation Form
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderForm, setShowFolderForm] = useState(false);

  // Gallery Creation Form
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryBookingId, setNewGalleryBookingId] = useState('');

  // Drag-and-drop Simulated Uploader State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detail Photo Modal
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);

  // 1. Calculations
  const staffMembers = users.filter(u => u.role === 'staff');
  const clientMembers = users.filter(u => u.role === 'client');
  const totalPhotosCount = photos.length;
  
  // Filter bookings based on selected status tab
  const filteredBookings = bookings.filter(b => {
    // If staff, only show assigned bookings
    const isAssigned = currentUser.role === 'admin' || b.assignedStaffId === currentUser.id;
    if (!isAssigned) return false;

    if (bookingFilter === 'All') return true;
    return b.status === bookingFilter;
  });

  // Handle Drag / Drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!selectedGalleryId || !selectedFolderId) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      simulateUploadProcess(files);
    } else {
      simulateUploadProcess();
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedGalleryId || !selectedFolderId) return;
    const files = e.target.files;
    if (files && files.length > 0) {
      simulateUploadProcess(files);
    } else {
      simulateUploadProcess();
    }
  };

  const simulateUploadProcess = (files?: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);

    if (files && files.length > 0) {
      const fileList = Array.from(files);
      const readPromises = fileList.map(file => {
        return new Promise<{ filename: string; url: string; size: string; extension: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
            const ext = file.name.split('.').pop()?.toUpperCase() || 'JPG';
            resolve({
              filename: file.name,
              url: reader.result as string,
              size: `${sizeInMB} MB`,
              extension: ext
            });
          };
          reader.readAsDataURL(file);
        });
      });

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 20;
        setUploadProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          Promise.all(readPromises).then(uploadedFiles => {
            setIsUploading(false);
            onUploadPhotos(selectedGalleryId, selectedFolderId, uploadedFiles);
            uploadedFiles.forEach(uf => {
              onAddAuditLog(`Uploaded file: ${uf.filename} and persisted securely`);
              onAddNotification(
                'File Upload Completed',
                `Smart AI scanned ${uf.filename}. Focus Index and Duplicate integrity logged.`,
                'photo_uploaded',
                { userRole: 'admin' }
              );
            });
          });
        }
      }, 100);
    } else {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsUploading(false);
              
              const index = Math.floor(Math.random() * 3);
              const uploadPool = [
                {
                  filename: `proof_capture_DSC_${Math.floor(Math.random() * 8000) + 1000}.jpg`,
                  url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                  size: '3.8 MB',
                  extension: 'JPG'
                },
                {
                  filename: `proof_camera_shake_FAILED.jpg`,
                  url: 'https://images.unsplash.com/photo-1551817958-c5b5d37af135?auto=format&fit=crop&w=400&q=20',
                  size: '2.5 MB',
                  extension: 'JPG'
                },
                {
                  filename: `fashion_monochrome_jacket.jpg`,
                  url: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800&q=80',
                  size: '5.9 MB',
                  extension: 'JPG'
                }
              ];

              const selectedUpload = [uploadPool[index]];

              onUploadPhotos(selectedGalleryId, selectedFolderId, selectedUpload);
              onAddAuditLog(`Simulated upload of proof file: ${selectedUpload[0].filename}`);
              
              onAddNotification(
                'File Upload Completed',
                `Smart AI scanned ${selectedUpload[0].filename}. Focus Index and Duplicate integrity logged.`,
                'photo_uploaded',
                { userRole: 'admin' }
              );

            }, 400);
            return 100;
          }
          return prev + 25;
        });
      }, 120);
    }
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGalleryId || !newFolderName) return;

    onAddFolder(selectedGalleryId, newFolderName);
    onAddAuditLog(`Created folder: ${newFolderName}`);
    setNewFolderName('');
    setShowFolderForm(false);
  };

  const handleCreateGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle || !newGalleryBookingId) return;

    const bookingObj = bookings.find(b => b.id === newGalleryBookingId);
    if (!bookingObj) return;

    onAddGallery(newGalleryTitle, newGalleryBookingId, bookingObj.clientEmail);
    onAddAuditLog(`Created secure gallery: ${newGalleryTitle}`);
    
    // Notify Client
    onAddNotification(
      'New Private Gallery Created',
      `Secure proofing gallery ${newGalleryTitle} has been created for your review.`,
      'proof_review',
      { userEmail: bookingObj.clientEmail }
    );

    setNewGalleryTitle('');
    setNewGalleryBookingId('');
    setShowGalleryForm(false);
  };

  return (
    <div className="flex h-screen bg-stone-950 text-stone-100 overflow-hidden" id="admin-workspace-root">
      
      {/* 1. Left Drawer/Sidebar */}
      <aside 
        className={`bg-stone-900 border-r border-stone-800 transition-all duration-300 flex flex-col justify-between z-30 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
        id="navigation-drawer"
      >
        <div className="p-4 space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2.5 overflow-hidden ${!sidebarOpen && 'hidden'}`}>
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-display font-extrabold shadow shadow-amber-500/25">
                P
              </div>
              <span className="font-display font-extrabold tracking-wider text-stone-100 text-sm">PHOTOBASE</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-stone-200 transition-colors"
            >
              <Menu size={16} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5 text-xs text-left">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'clients', label: 'Manage Clients', icon: Users, roleLimit: 'admin' },
              { id: 'bookings', label: 'Studio Bookings', icon: Calendar },
              { id: 'galleries', label: 'Secure Galleries', icon: ImageIcon },
              { id: 'analytics', label: 'Analytics & Logs', icon: BarChart3, roleLimit: 'admin' },
              { id: 'settings', label: 'Settings & About', icon: Settings },
            ].map((tab) => {
              if (tab.roleLimit === 'admin' && currentUser.role !== 'admin') return null;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentTab(tab.id as any);
                    setSelectedGalleryId(null);
                    setSelectedFolderId(null);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-3 font-semibold transition-all ${
                    currentTab === tab.id
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/10'
                      : 'text-stone-400 hover:bg-stone-800/60 hover:text-stone-200'
                  }`}
                >
                  <Icon size={16} />
                  <span className={`${!sidebarOpen && 'hidden'}`}>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/40 text-left">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-stone-800 border border-stone-700 overflow-hidden flex-shrink-0">
              <img src={currentUser.avatar} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
            <div className={`${!sidebarOpen && 'hidden'} min-w-0`}>
              <h5 className="font-semibold text-xs text-stone-200 truncate">{currentUser.name}</h5>
              <span className="text-[10px] font-mono text-amber-500 block uppercase font-bold mt-0.5">
                {currentUser.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace Panel */}
      <main className="flex-1 flex flex-col overflow-hidden bg-stone-950" id="workspace-panel">
        {/* Workspace Top Header */}
        <header className="bg-stone-900/30 border-b border-stone-800/40 p-4 px-6 flex items-center justify-between flex-shrink-0">
          <div className="text-left">
            <h1 className="text-base font-display font-bold text-stone-100 capitalize">
              {currentTab === 'dashboard' ? `${currentUser.role} Workspace` : currentTab.replace('-', ' ')}
            </h1>
            <p className="text-[11px] text-stone-500 font-mono">PHOTOBASE SECURITY SYSTEMS v3.11</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-stone-900 text-stone-400 border border-stone-800">
              ROLE: {currentUser.role.toUpperCase()}
            </span>
          </div>
        </header>

        {/* Workspace Content Router scroll area */}
        <div className="flex-1 overflow-y-auto p-6 text-left" id="workspace-content">
          <AnimatePresence mode="wait">
            
            {/* TAB: DASHBOARD */}
            {currentTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Visual Overview cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800">
                    <span className="text-[9px] font-mono text-stone-500 block">CLIENT LISTING</span>
                    <span className="text-2xl font-display font-bold block mt-1">{clientMembers.length}</span>
                    <span className="text-[9px] text-stone-400 block mt-1">Validated & verified in portal</span>
                  </div>
                  <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800">
                    <span className="text-[9px] font-mono text-stone-500 block">TOTAL PHOTOGRAPHS</span>
                    <span className="text-2xl font-display font-bold text-amber-500 block mt-1">{totalPhotosCount}</span>
                    <span className="text-[9px] text-stone-400 block mt-1">Hashed securely in vault</span>
                  </div>
                  <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800">
                    <span className="text-[9px] font-mono text-stone-500 block">PENDING DISPATCH</span>
                    <span className="text-2xl font-display font-bold text-amber-500 block mt-1">
                      {bookings.filter(b => b.status === 'Pending').length}
                    </span>
                    <span className="text-[9px] text-stone-400 block mt-1">Awaiting studio approval</span>
                  </div>
                  <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800">
                    <span className="text-[9px] font-mono text-stone-500 block">STAFF MEMBERS</span>
                    <span className="text-2xl font-display font-bold block mt-1">{staffMembers.length}</span>
                    <span className="text-[9px] text-stone-400 block mt-1">Photographers & Editors</span>
                  </div>
                </div>

                {/* Split list: Schedule / Action Queue */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Active Booking dispatch queue */}
                  <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-display font-semibold text-stone-200">Active Bookings Queue</h3>
                    
                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {bookings.map(b => (
                        <div key={b.id} className="p-3 bg-stone-950/70 border border-stone-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-stone-200">{b.clientName}</h4>
                              <span className="text-[9px] px-1.5 py-0.2 bg-stone-900 rounded font-mono border border-stone-800 text-stone-400">{b.id}</span>
                            </div>
                            <p className="text-stone-400 font-mono text-[10px] mt-0.5">{b.category} • {b.date}</p>
                          </div>
                          
                          <div className="flex items-center gap-3 justify-end">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                              b.status === 'Pending' 
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                                : b.status === 'Approved'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-stone-800 text-stone-400 border-stone-700'
                            }`}>
                              {b.status}
                            </span>
                            <button
                              onClick={() => {
                                setCurrentTab('bookings');
                              }}
                              className="text-[10px] text-amber-500 hover:text-amber-400 font-semibold"
                            >
                              Dispatch &rarr;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick staff dispatch guide */}
                  <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-3">
                    <h3 className="text-sm font-display font-semibold text-stone-200">Photography Team</h3>
                    
                    <div className="space-y-3">
                      {staffMembers.map(staff => (
                        <div key={staff.id} className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center gap-3">
                          <img src={staff.avatar} alt="Staff avatar" className="w-8 h-8 rounded-full object-cover border border-stone-800" />
                          <div>
                            <h4 className="text-xs font-semibold text-stone-200">{staff.name}</h4>
                            <span className="text-[9px] font-mono text-stone-500">Active status // {staff.joinedDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: CLIENTS */}
            {currentTab === 'clients' && (
              <motion.div
                key="clients"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-display font-semibold text-stone-200">Registered Portal Clients</h3>
                    <p className="text-xs text-stone-500">Security authorizations and folder allocations</p>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 text-stone-500" size={13} />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="bg-stone-900 border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500/40 w-56 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clientMembers
                    .filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.email.toLowerCase().includes(clientSearch.toLowerCase()))
                    .map(client => (
                      <div key={client.id} className="p-4 bg-stone-900 border border-stone-800 rounded-2xl flex items-start gap-4">
                        <img src={client.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-stone-800" />
                        <div className="flex-1 min-w-0 text-xs">
                          <h4 className="font-semibold text-stone-200 text-sm">{client.name}</h4>
                          <p className="text-stone-400 font-mono text-[10px] mt-0.5">{client.email}</p>
                          <p className="text-stone-500 mt-2">Preferred Style: <strong className="text-stone-300">{client.categoryPreference || 'Wedding'}</strong></p>
                          <p className="text-stone-500 font-mono text-[10px] mt-1">Joined: {client.joinedDate}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* TAB: BOOKINGS */}
            {currentTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Status bar selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800/60">
                  {['All', 'Pending', 'Approved', 'Photographer Assigned', 'Shooting Completed', 'Editing', 'Client Review', 'Delivered'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setBookingFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                        bookingFilter === filter
                          ? 'bg-amber-500 border-amber-500 text-stone-950'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Queue Display list */}
                <div className="space-y-3">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((b) => (
                      <div key={b.id} className="p-5 bg-stone-900 border border-stone-800 rounded-2xl space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider block">BOOKING SECURITY DEED</span>
                            <h4 className="text-base font-display font-bold text-stone-100 mt-1">{b.clientName}</h4>
                            <p className="text-stone-400 font-mono text-[10px] mt-0.5">{b.category} // Session Ref: {b.id}</p>
                          </div>

                          {/* Quick status timeline dropdown */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-stone-500 font-mono">FLOW STATUS:</span>
                            <select
                              value={b.status}
                              onChange={(e) => {
                                onUpdateBookingStatus(b.id, e.target.value as any);
                                onAddAuditLog(`Updated status for ${b.id} to ${e.target.value}`);
                                onAddNotification(
                                  'Booking Timeline Update',
                                  `Your session status for ${b.category} has changed to: ${e.target.value}.`,
                                  'booking_status',
                                  { userEmail: b.clientEmail }
                                );
                              }}
                              className="bg-stone-950 border border-stone-800 rounded-lg p-1 px-2.5 text-xs text-amber-500 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                            >
                              {STATUS_STEPS.map(step => (
                                <option key={step} value={step}>{step}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Booking properties grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-stone-950/40 border border-stone-800/40 rounded-xl p-3">
                          <div>
                            <span className="text-[9px] font-mono text-stone-500 block">TARGET DATE</span>
                            <span className="font-mono text-stone-300 block mt-1">{b.date} @ {b.time}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-stone-500 block">COORDINATES / VENUE</span>
                            <span className="text-stone-300 block mt-1 truncate max-w-[150px]" title={b.location}>{b.location}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-stone-500 block">ASSIGNED STAFF</span>
                            {currentUser.role === 'admin' ? (
                              <select
                                value={b.assignedStaffId || ''}
                                onChange={(e) => {
                                  const selectedStaff = staffMembers.find(s => s.id === e.target.value);
                                  if (selectedStaff) {
                                    onAssignStaff(b.id, selectedStaff.id, selectedStaff.name);
                                    onAddAuditLog(`Assigned ${selectedStaff.name} to booking ${b.id}`);
                                    onAddNotification(
                                      'Photographer Dispatched',
                                      `${selectedStaff.name} has been assigned to cover your session.`,
                                      'booking_status',
                                      { userEmail: b.clientEmail }
                                    );
                                  }
                                }}
                                className="bg-transparent border-none p-0 text-amber-500 focus:outline-none font-mono font-semibold mt-1"
                              >
                                <option value="">Unassigned</option>
                                {staffMembers.map(s => (
                                  <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-stone-300 font-mono block mt-1">{b.assignedStaffName || 'Unassigned'}</span>
                            )}
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-stone-500 block">CONTRACT VALUE</span>
                            <span className="font-mono text-emerald-400 font-bold block mt-1">₹{b.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {b.notes && (
                          <div className="p-3 bg-stone-950/20 border border-stone-800 rounded-xl text-xs text-stone-400">
                            <strong className="text-stone-300 block font-mono text-[9px] uppercase tracking-wider">Studio Creative brief:</strong>
                            <p className="mt-1">{b.notes}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-stone-900/10 border border-stone-800 border-dashed rounded-2xl">
                      <Calendar className="mx-auto text-stone-600 mb-2" size={24} />
                      <p className="text-stone-500 text-xs">No active bookings under this status queue.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: SECURE GALLERIES */}
            {currentTab === 'galleries' && (
              <motion.div
                key="galleries"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {selectedGalleryId === null ? (
                  // Galleries list
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-display font-semibold text-stone-200">Active Gallery Deploys</h3>
                        <p className="text-xs text-stone-500">Secure watermark configurations & automatic archives</p>
                      </div>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => setShowGalleryForm(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs transition-colors font-display"
                        >
                          <Plus size={14} /> NEW GALLERY
                        </button>
                      )}
                    </div>

                    {/* Gallery Creation Modal Form */}
                    {showGalleryForm && (
                      <div className="p-4 bg-stone-900 border border-amber-500/20 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-mono font-bold text-amber-400">DEPLOY PRIVATE GALLERY</h4>
                          <button onClick={() => setShowGalleryForm(false)} className="text-stone-500 hover:text-stone-300">
                            <X size={15} />
                          </button>
                        </div>
                        <form onSubmit={handleCreateGallery} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1.5 text-left">
                            <label className="text-stone-400 font-mono text-[9px]">Gallery Title</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sophia Wedding Collection"
                              value={newGalleryTitle}
                              onChange={(e) => setNewGalleryTitle(e.target.value)}
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5 text-left">
                            <label className="text-stone-400 font-mono text-[9px]">Assign to Booking Contract</label>
                            <select
                              required
                              value={newGalleryBookingId}
                              onChange={(e) => setNewGalleryBookingId(e.target.value)}
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 focus:outline-none"
                            >
                              <option value="">Select booking...</option>
                              {bookings.map(b => (
                                <option key={b.id} value={b.id}>{b.clientName} - {b.category} ({b.id})</option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="submit"
                            className="w-full py-2 bg-amber-500 text-stone-950 font-bold rounded-lg text-xs md:col-span-2 transition-colors"
                          >
                            Compile Gallery Portal
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Galleries Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {galleries.map(g => (
                        <div
                          key={g.id}
                          onClick={() => {
                            setSelectedGalleryId(g.id);
                            const firstFolder = folders.find(f => f.galleryId === g.id);
                            if (firstFolder) setSelectedFolderId(firstFolder.id);
                          }}
                          className="p-5 bg-stone-900 hover:bg-stone-900/80 border border-stone-800 hover:border-amber-500/20 rounded-2xl cursor-pointer transition-all space-y-4"
                        >
                          <div className="flex justify-between items-center text-[10px] font-mono text-stone-500">
                            <span>REFS: {g.bookingId}</span>
                            <span>EXP: {g.expirationType}</span>
                          </div>

                          <div>
                            <h4 className="font-display font-bold text-stone-200 hover:text-amber-500 transition-colors">{g.title}</h4>
                            <p className="text-xs text-stone-400 mt-1">{g.photoCount} proofs in safe vault</p>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-3 border-t border-stone-800/80">
                            <span>Sub-folders: {g.folderCount}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono uppercase font-bold">
                              {g.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Detail Gallery Manager View
                  <div className="space-y-6">
                    {/* Header menu navigation */}
                    <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedGalleryId(null);
                            setSelectedFolderId(null);
                          }}
                          className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-mono font-bold"
                        >
                          &larr; BACK
                        </button>
                        <div>
                          <h3 className="text-sm font-display font-bold text-stone-200">
                            {galleries.find(g => g.id === selectedGalleryId)?.title}
                          </h3>
                          <p className="text-[10px] text-stone-500 font-mono">Gallery ID: {selectedGalleryId}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowFolderForm(true)}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 rounded-xl text-xs font-semibold flex items-center gap-1"
                        >
                          <FolderPlus size={13} /> ADD FOLDER
                        </button>
                      </div>
                    </div>

                    {/* Folder form submission */}
                    {showFolderForm && (
                      <div className="p-4 bg-stone-900 border border-amber-500/20 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-mono font-bold text-amber-400">CREATE SUB-DIRECTORY FOLDER</h4>
                          <button onClick={() => setShowFolderForm(false)} className="text-stone-500">
                            <X size={15} />
                          </button>
                        </div>
                        <form onSubmit={handleCreateFolder} className="flex gap-2 text-xs">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Raw Master captures"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className="flex-1 bg-stone-950 border border-stone-800 rounded-lg p-2 text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />
                          <button type="submit" className="px-4 py-2 bg-amber-500 text-stone-950 font-bold rounded-lg transition-colors">
                            Compile Folder
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Folders Tab Bar & Folder Operations */}
                    <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 border-b border-stone-800/60">
                      <div className="flex gap-2">
                        {folders
                          .filter(f => f.galleryId === selectedGalleryId)
                          .map(f => (
                            <button
                              key={f.id}
                              onClick={() => setSelectedFolderId(f.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                                selectedFolderId === f.id
                                  ? 'bg-amber-500 border-amber-500 text-stone-950'
                                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                              }`}
                            >
                              {f.name} ({f.photoCount})
                            </button>
                          ))}
                      </div>

                      {selectedFolderId && (
                        <button
                          onClick={() => {
                            if (confirm('Delete this folder and its secure proofs?')) {
                              onDeleteFolder(selectedFolderId);
                              setSelectedFolderId(null);
                            }
                          }}
                          className="p-1 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-mono flex items-center gap-1 transition-all"
                        >
                          <Trash2 size={12} /> Delete Folder
                        </button>
                      )}
                    </div>

                    {selectedFolderId && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* LEFT: Photo proofing grid & simulated file uploader */}
                        <div className="lg:col-span-2 space-y-4">
                          
                          {/* Drag & Drop simulated uploader container */}
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={triggerFileSelect}
                            className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                              isDragging 
                                ? 'border-amber-500 bg-amber-500/5' 
                                : 'border-stone-800 bg-stone-900/30 hover:bg-stone-900/50'
                            }`}
                          >
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handleFileChange} 
                              className="hidden" 
                              accept="image/*"
                            />
                            
                            {isUploading ? (
                              <div className="space-y-3 w-full max-w-xs">
                                <RefreshCw className="text-amber-500 animate-spin mx-auto" size={24} />
                                <span className="text-xs text-stone-400 font-mono block">Hashing File ... {uploadProgress}%</span>
                                <div className="w-full bg-stone-950 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500" style={{ width: `${uploadProgress}%` }} />
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <UploadCloud className="text-stone-500 mx-auto" size={32} />
                                <h4 className="text-xs font-semibold text-stone-300">Drag photographs here or Click to select</h4>
                                <p className="text-[10px] text-stone-500 font-mono">Supports JPG, PNG, WEBP, and RAW placeholders</p>
                              </div>
                            )}
                          </div>

                          {/* Uploaded proofs grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {photos
                              .filter(p => p.galleryId === selectedGalleryId && p.folderId === selectedFolderId)
                              .map(photo => {
                                const isRaw = photo.extension === 'RAW';
                                return (
                                  <div 
                                    key={photo.id}
                                    className="group relative bg-stone-900 border border-stone-800 rounded-xl overflow-hidden p-2 flex flex-col justify-between h-48"
                                  >
                                    <div className="relative flex-1 rounded-lg overflow-hidden min-h-0 bg-stone-950 flex items-center justify-center">
                                      {isRaw ? (
                                        <div className="text-center p-2">
                                          <AlertTriangle size={16} className="text-amber-500 mx-auto mb-1" />
                                          <span className="text-[9px] font-mono text-stone-400 block uppercase">RAW CAPTURE</span>
                                        </div>
                                      ) : (
                                        <img 
                                          src={photo.url} 
                                          alt="Preview" 
                                          className="w-full h-full object-cover pointer-events-none"
                                        />
                                      )}

                                      {/* Hover Action Overlays */}
                                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-20">
                                        <button
                                          onClick={() => setPreviewPhoto(photo)}
                                          className="p-1.5 bg-stone-800 text-stone-100 hover:text-amber-400 rounded-lg border border-stone-700"
                                          title="View secure preview"
                                        >
                                          <Eye size={13} />
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (confirm('Delete this proof file from vault?')) {
                                              onDeletePhoto(photo.id);
                                              onAddAuditLog(`Deleted proof file ID ${photo.id}`);
                                            }
                                          }}
                                          className="p-1.5 bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg border border-rose-500/20"
                                          title="Delete"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>

                                      {/* Flag icons overlay */}
                                      <div className="absolute top-1 left-1 flex flex-col gap-1 z-10">
                                        {photo.isBlurry && (
                                          <div className="bg-rose-500 text-white px-1 py-0.5 rounded text-[7px] font-mono font-bold tracking-wider uppercase shadow">
                                            BLURRY {photo.blurScore}%
                                          </div>
                                        )}
                                        {photo.isDuplicate && (
                                          <div className="bg-amber-500 text-stone-950 px-1 py-0.5 rounded text-[7px] font-mono font-bold tracking-wider uppercase shadow">
                                            DUPLICATE
                                          </div>
                                        )}
                                      </div>

                                      {photo.selectedAsBest && (
                                        <div className="absolute top-1 right-1 bg-amber-500 text-stone-950 p-0.5 rounded-full z-10 shadow">
                                          <Sparkles size={8} />
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

                        {/* RIGHT SIDEBAR: AI Assist Analysis */}
                        <div className="space-y-4">
                          <AIAssistantWidget
                            photos={photos.filter(p => p.galleryId === selectedGalleryId && p.folderId === selectedFolderId)}
                            onApplyCoverSuggestion={(photoId) => {
                              onSetPhotoCover(photoId);
                              onAddAuditLog(`Applied Cover suggestion for photo ID ${photoId}`);
                              alert('Smarts Cover photo suggestion set successfully!');
                            }}
                            onApplyBestQualitySuggestion={(photoId) => {
                              onTogglePhotoBest(photoId);
                              onAddAuditLog(`Flagged best-quality suggestion for photo ID ${photoId}`);
                            }}
                            onClearDuplicates={() => {
                              onClearDuplicatesInFolder(selectedGalleryId, selectedFolderId);
                              onAddAuditLog(`Cleared folder duplicates under ${selectedFolderId}`);
                              onAddNotification(
                                'Duplicates Cleaned',
                                `Smart assistant removed all duplicate image hashes from the current folder directory.`,
                                'system',
                                { userRole: 'admin' }
                              );
                              alert('AI Duplicate cleanup process finalized successfully!');
                            }}
                            onOrganizeAlbums={() => {
                              alert('AI Sub-album clusters saved! Moving highlighted coordinates into separate smart directories.');
                              onAddAuditLog('Committed AI automatic directory re-clusters');
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB: ANALYTICS */}
            {currentTab === 'analytics' && currentUser.role === 'admin' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <AnalyticsCharts bookings={bookings} auditLogs={auditLogs} galleries={galleries} />
              </motion.div>
            )}

            {/* TAB: SETTINGS & ABOUT */}
            {currentTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 max-w-xl text-left"
              >
                {/* About Photobase */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-display font-semibold text-stone-200">PHOTOBASE PRO // SYSTEM</h3>
                      <p className="text-[10px] text-stone-500 font-mono">SECURE STUDIO CRYPTO ENGINE v3.11</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Photobase Pro provides high-density security frameworks for photography workflows. Dynamic diagonal watermarks, randomized blur scores, duplicate checkers, and background window blur detection keep files insulated.
                  </p>
                </div>

                {/* Database resetting triggers */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-mono text-stone-400 uppercase tracking-widest font-bold">DEVELOPER PRESETS CONTROL</h4>
                  <p className="text-xs text-stone-400">
                    Reset local sandbox state to original default user models and bookings files.
                  </p>
                  
                  <button
                    onClick={() => {
                      if (confirm('Clear local preferences & restore sandbox defaults?')) {
                        onResetDb();
                        alert('System sandbox database reset initialized. Page will reload.');
                        window.location.reload();
                      }
                    }}
                    className="py-2 px-4 bg-stone-850 hover:bg-stone-800 text-amber-500 border border-amber-500/20 rounded-xl text-xs font-mono font-bold transition-colors"
                  >
                    RESET SANDBOX DATABASE
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Floating full-screen Preview Dialog for Admins */}
      <AnimatePresence>
        {previewPhoto && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden max-w-lg w-full relative p-4 space-y-4 text-left"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <button
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-4 right-4 p-1.5 bg-stone-950 hover:bg-stone-800 rounded-full border border-stone-800 text-stone-400 hover:text-stone-100 z-50 transition-colors"
              >
                <X size={15} />
              </button>

              <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-950 flex items-center justify-center">
                <WatermarkedImage 
                  src={previewPhoto.url} 
                  alt={previewPhoto.filename} 
                  clientName="Sarah Jenkins (Admin Preview)"
                  date={previewPhoto.uploadDate.split(' ')[0]}
                  className="w-full h-full"
                  isRawPlaceholder={previewPhoto.extension === 'RAW'}
                />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider font-semibold">
                      SECURE DIGITAL PROOF PREVIEW
                    </span>
                    <h4 className="text-sm font-display font-semibold text-stone-200 mt-1.5 truncate max-w-[280px]">{previewPhoto.filename}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-stone-500 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                    {previewPhoto.size} ({previewPhoto.extension})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[10px] bg-stone-950 p-2 rounded-lg text-stone-400">
                  <div>Blur Score: {previewPhoto.blurScore}% ({previewPhoto.isBlurry ? 'Blurry' : 'Crisp'})</div>
                  <div>Duplicate Match: {previewPhoto.isDuplicate ? 'Yes' : 'No'}</div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onTogglePhotoBest(previewPhoto.id);
                      setPreviewPhoto(prev => prev ? { ...prev, selectedAsBest: !prev.selectedAsBest } : null);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      previewPhoto.selectedAsBest
                        ? 'bg-amber-500 text-stone-950 shadow'
                        : 'bg-stone-950 text-stone-300 border border-stone-800 hover:bg-stone-800/60'
                    }`}
                  >
                    ★ {previewPhoto.selectedAsBest ? 'Favorite Selected' : 'Mark Favorite'}
                  </button>

                  <button
                    onClick={() => {
                      onSetPhotoCover(previewPhoto.id);
                      alert('Cover Suggestion Applied!');
                    }}
                    className="px-4 py-2 bg-stone-850 hover:bg-stone-800 text-stone-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border border-stone-800 transition-colors"
                  >
                    Nominate Cover
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
