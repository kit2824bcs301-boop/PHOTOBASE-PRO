/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldAlert, ArrowLeftRight, LogOut, Check } from 'lucide-react';

import { DbMock } from './dbMock';
import { UserProfile, Booking, Gallery, Folder, Photo, AppNotification, AuditLog } from './types';

// Components
import Splash from './components/Splash';
import Auth from './components/Auth';
import ClientDashboardView from './components/ClientDashboardView';
import AdminStaffDashboardView from './components/AdminStaffDashboardView';

export default function App() {
  const [splashComplete, setSplashComplete] = useState(false);

  // Core application states loaded from DbMock
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Initialize DB & load states
  useEffect(() => {
    DbMock.init();
    loadAllStates();
  }, []);

  const loadAllStates = () => {
    setUsers(DbMock.getUsers());
    setBookings(DbMock.getBookings());
    setGalleries(DbMock.getGalleries());
    setFolders(DbMock.getFolders());
    setPhotos(DbMock.getPhotos());
    setNotifications(DbMock.getNotifications());
    setAuditLogs(DbMock.getAuditLogs());
    setCurrentUser(DbMock.getCurrentUser());
  };

  // 1. Session Operations
  const handleLoginSuccess = (user: UserProfile) => {
    DbMock.setCurrentUser(user);
    setCurrentUser(user);
    DbMock.addAuditLog(user.name, user.role, 'Logged in securely');
    loadAllStates();
  };

  const handleRegisterSuccess = (newClient: UserProfile) => {
    const updatedUsers = [...users, newClient];
    DbMock.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    
    // Add welcome notification
    DbMock.addNotification(
      'Account Created Successfully',
      `Welcome to Photobase Pro, ${newClient.name}. Register a session to get started!`,
      'system',
      { userEmail: newClient.email }
    );

    DbMock.addAuditLog(newClient.name, 'client', 'Registered new client profile');
    loadAllStates();
  };

  const handleLogout = () => {
    if (currentUser) {
      DbMock.addAuditLog(currentUser.name, currentUser.role, 'Logged out from session');
    }
    DbMock.setCurrentUser(null);
    setCurrentUser(null);
    loadAllStates();
  };

  // Direct Evaluator Role Switcher
  const handleQuickRoleSwitch = (role: 'admin' | 'staff' | 'client') => {
    let targetEmail = 'sarah@photobase.pro'; // admin
    if (role === 'staff') targetEmail = 'marcus@photobase.pro';
    if (role === 'client') targetEmail = 'sophia@example.com';

    const foundUser = users.find(u => u.email === targetEmail);
    if (foundUser) {
      DbMock.setCurrentUser(foundUser);
      setCurrentUser(foundUser);
      DbMock.addAuditLog(foundUser.name, foundUser.role, `Switched sandbox role to ${role} via developer bar`);
      loadAllStates();
    }
  };

  // 2. Booking Operations
  const handleAddBooking = (bookingData: Omit<Booking, 'id' | 'clientName' | 'clientEmail' | 'status' | 'filesCount' | 'createdAt'>) => {
    if (!currentUser) return;
    
    const newBooking: Booking = {
      id: `B-2026-00${bookings.length + 1}`,
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      status: 'Pending',
      filesCount: 0,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ...bookingData,
    };

    const updatedBookings = [newBooking, ...bookings];
    DbMock.saveBookings(updatedBookings);
    setBookings(updatedBookings);

    DbMock.addAuditLog(currentUser.name, 'client', `Requested new session booking slot (Ref: ${newBooking.id})`);
    
    // Notify admins
    DbMock.addNotification(
      'New Session Booking Slot',
      `${currentUser.name} requested a new slot for ${newBooking.category}.`,
      'booking_status',
      { userRole: 'admin' }
    );

    loadAllStates();
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    if (!currentUser) return;

    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: newStatus };
      }
      return b;
    });

    DbMock.saveBookings(updatedBookings);
    setBookings(updatedBookings);
    loadAllStates();
  };

  const handleAssignStaff = (bookingId: string, staffId: string, staffName: string) => {
    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, assignedStaffId: staffId, assignedStaffName: staffName, status: 'Photographer Assigned' as Booking['status'] };
      }
      return b;
    });

    DbMock.saveBookings(updatedBookings);
    setBookings(updatedBookings);
    loadAllStates();
  };

  // 3. Gallery Operations
  const handleAddGallery = (title: string, bookingId: string, clientEmail: string) => {
    const newGallery: Gallery = {
      id: `G-00${galleries.length + 1}`,
      title,
      bookingId,
      clientEmail,
      folderCount: 1,
      photoCount: 0,
      status: 'Active',
      expirationType: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedGalleries = [newGallery, ...galleries];
    DbMock.saveGalleries(updatedGalleries);
    setGalleries(updatedGalleries);

    // Auto create default "Highlights" folder
    const defaultFolder: Folder = {
      id: `F-${Date.now()}`,
      galleryId: newGallery.id,
      name: 'Unsorted Proofs',
      photoCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedFolders = [...folders, defaultFolder];
    DbMock.saveFolders(updatedFolders);
    setFolders(updatedFolders);

    loadAllStates();
  };

  // 4. Folder Operations
  const handleAddFolder = (galleryId: string, name: string) => {
    const newFolder: Folder = {
      id: `F-${Date.now()}`,
      galleryId,
      name,
      photoCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedFolders = [...folders, newFolder];
    DbMock.saveFolders(updatedFolders);
    setFolders(updatedFolders);

    // Update gallery folder count
    const updatedGalleries = galleries.map(g => {
      if (g.id === galleryId) {
        return { ...g, folderCount: g.folderCount + 1 };
      }
      return g;
    });
    DbMock.saveGalleries(updatedGalleries);
    setGalleries(updatedGalleries);

    loadAllStates();
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    const updatedFolders = folders.map(f => {
      if (f.id === folderId) {
        return { ...f, name: newName };
      }
      return f;
    });
    DbMock.saveFolders(updatedFolders);
    setFolders(updatedFolders);
    loadAllStates();
  };

  const handleDeleteFolder = (folderId: string) => {
    const targetFolder = folders.find(f => f.id === folderId);
    if (!targetFolder) return;

    const remainingFolders = folders.filter(f => f.id !== folderId);
    DbMock.saveFolders(remainingFolders);
    setFolders(remainingFolders);

    // Clear associated photos
    const remainingPhotos = photos.filter(p => p.folderId !== folderId);
    DbMock.savePhotos(remainingPhotos);
    setPhotos(remainingPhotos);

    // Update gallery photo & folder counters
    const updatedGalleries = galleries.map(g => {
      if (g.id === targetFolder.galleryId) {
        const folderPhotosCount = photos.filter(p => p.folderId === folderId).length;
        return {
          ...g,
          folderCount: Math.max(0, g.folderCount - 1),
          photoCount: Math.max(0, g.photoCount - folderPhotosCount),
        };
      }
      return g;
    });
    DbMock.saveGalleries(updatedGalleries);
    setGalleries(updatedGalleries);

    loadAllStates();
  };

  // 5. Photo Operations & AI Assistant Scanning
  const handleUploadPhotos = (galleryId: string, folderId: string, photoFiles: { filename: string; url: string; size: string; extension: string }[]) => {
    const newPhotosUploaded: Photo[] = photoFiles.map((file) => {
      // Run Simulated Intelligent scanning for blur analysis and duplicates
      const aiResults = DbMock.simulateAIEngineOnNewPhoto(file.url, file.filename);

      return {
        id: `P-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        galleryId,
        folderId,
        url: file.url,
        filename: file.filename,
        size: file.size,
        extension: file.extension,
        isBlurry: aiResults.isBlurry,
        blurScore: aiResults.blurScore,
        isDuplicate: aiResults.isDuplicate,
        width: 4500,
        height: 3000,
        isCover: false,
        selectedAsBest: false,
        uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
    });

    const updatedPhotos = [...photos, ...newPhotosUploaded];
    DbMock.savePhotos(updatedPhotos);
    setPhotos(updatedPhotos);

    // Update Folder and Gallery file count
    const updatedFolders = folders.map(f => {
      if (f.id === folderId) {
        return { ...f, photoCount: f.photoCount + newPhotosUploaded.length };
      }
      return f;
    });
    DbMock.saveFolders(updatedFolders);
    setFolders(updatedFolders);

    const updatedGalleries = galleries.map(g => {
      if (g.id === galleryId) {
        return { ...g, photoCount: g.photoCount + newPhotosUploaded.length };
      }
      return g;
    });
    DbMock.saveGalleries(updatedGalleries);
    setGalleries(updatedGalleries);

    loadAllStates();
  };

  const handleDeletePhoto = (photoId: string) => {
    const targetPhoto = photos.find(p => p.id === photoId);
    if (!targetPhoto) return;

    const remainingPhotos = photos.filter(p => p.id !== photoId);
    DbMock.savePhotos(remainingPhotos);
    setPhotos(remainingPhotos);

    // Decrement counts
    const updatedFolders = folders.map(f => {
      if (f.id === targetPhoto.folderId) {
        return { ...f, photoCount: Math.max(0, f.photoCount - 1) };
      }
      return f;
    });
    DbMock.saveFolders(updatedFolders);
    setFolders(updatedFolders);

    const updatedGalleries = galleries.map(g => {
      if (g.id === targetPhoto.galleryId) {
        return { ...g, photoCount: Math.max(0, g.photoCount - 1) };
      }
      return g;
    });
    DbMock.saveGalleries(updatedGalleries);
    setGalleries(updatedGalleries);

    loadAllStates();
  };

  const handleTogglePhotoBest = (photoId: string) => {
    const updatedPhotos = photos.map(p => {
      if (p.id === photoId) {
        return { ...p, selectedAsBest: !p.selectedAsBest };
      }
      return p;
    });
    DbMock.savePhotos(updatedPhotos);
    setPhotos(updatedPhotos);
    loadAllStates();
  };

  const handleSetPhotoCover = (photoId: string) => {
    const targetPhoto = photos.find(p => p.id === photoId);
    if (!targetPhoto) return;

    const updatedPhotos = photos.map(p => {
      if (p.galleryId === targetPhoto.galleryId) {
        return { ...p, isCover: p.id === photoId };
      }
      return p;
    });
    DbMock.savePhotos(updatedPhotos);
    setPhotos(updatedPhotos);
    loadAllStates();
  };

  const handleClearDuplicatesInFolder = (galleryId: string, folderId: string) => {
    const duplicatesToRemove = photos.filter(p => p.galleryId === galleryId && p.folderId === folderId && p.isDuplicate);
    const nonDuplicates = photos.filter(p => !(p.galleryId === galleryId && p.folderId === folderId && p.isDuplicate));

    DbMock.savePhotos(nonDuplicates);
    setPhotos(nonDuplicates);

    // Adjust counts
    const updatedFolders = folders.map(f => {
      if (f.id === folderId) {
        return { ...f, photoCount: Math.max(0, f.photoCount - duplicatesToRemove.length) };
      }
      return f;
    });
    DbMock.saveFolders(updatedFolders);
    setFolders(updatedFolders);

    const updatedGalleries = galleries.map(g => {
      if (g.id === galleryId) {
        return { ...g, photoCount: Math.max(0, g.photoCount - duplicatesToRemove.length) };
      }
      return g;
    });
    DbMock.saveGalleries(updatedGalleries);
    setGalleries(updatedGalleries);

    loadAllStates();
  };

  // Clear unread notification counters
  const handleClearNotifications = () => {
    if (!currentUser) return;
    const updatedNotifications = notifications.map(n => {
      if (n.userEmail === currentUser.email || !n.userEmail) {
        return { ...n, read: true };
      }
      return n;
    });
    DbMock.saveNotifications(updatedNotifications);
    setNotifications(updatedNotifications);
    loadAllStates();
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    const updatedUsers = users.map(u => u.id === updatedProfile.id ? updatedProfile : u);
    DbMock.saveUsers(updatedUsers);
    setUsers(updatedUsers);
    
    // Update session
    DbMock.setCurrentUser(updatedProfile);
    setCurrentUser(updatedProfile);
    loadAllStates();
  };

  return (
    <div className="min-h-screen bg-stone-950 font-sans antialiased text-stone-100 flex flex-col justify-between" id="photobase-pro-app">
      
      {/* 1. Evaluation Sandbox Toggle Bar (Subtle Floating Top Banner) */}
      {currentUser && (
        <div className="bg-stone-900 border-b border-stone-800/80 p-3 px-6 flex flex-col md:flex-row items-center justify-between gap-3 relative z-40 flex-shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-mono text-stone-300 font-semibold flex items-center gap-1.5">
              <ShieldAlert size={12} className="text-amber-500" />
              PHOTOBASE PRO SANDBOX
            </span>
          </div>

          {/* Quick interactive test switch */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[10px] text-stone-500 font-mono flex items-center gap-0.5">
              <ArrowLeftRight size={10} /> QUICK ACT AS:
            </span>
            <button
              onClick={() => handleQuickRoleSwitch('admin')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                currentUser.role === 'admin'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-extrabold shadow'
                  : 'bg-stone-950 border-stone-800 text-stone-500 hover:text-stone-300'
              }`}
            >
              ADMIN
            </button>
            <button
              onClick={() => handleQuickRoleSwitch('staff')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                currentUser.role === 'staff'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-extrabold shadow'
                  : 'bg-stone-950 border-stone-800 text-stone-500 hover:text-stone-300'
              }`}
            >
              PHOTOGRAPHER
            </button>
            <button
              onClick={() => handleQuickRoleSwitch('client')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                currentUser.role === 'client'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-extrabold shadow'
                  : 'bg-stone-950 border-stone-800 text-stone-500 hover:text-stone-300'
              }`}
            >
              CLIENT
            </button>

            <div className="h-4 w-[1px] bg-stone-800 mx-1 hidden md:block" />

            <button
              onClick={handleLogout}
              className="px-2 py-1 bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 rounded-lg text-[10px] font-mono flex items-center gap-1 transition-all"
              title="Logout current session"
            >
              <LogOut size={10} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* 2. Main screen Router layout */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          
          {/* SCREEN A: SPLASH SCREEN */}
          {!splashComplete && (
            <motion.div key="splash-wrap" className="w-full h-full">
              <Splash onComplete={() => setSplashComplete(true)} />
            </motion.div>
          )}

          {/* SCREEN B: AUTHENTICATION FLOW */}
          {splashComplete && !currentUser && (
            <motion.div key="auth-wrap" className="w-full h-full">
              <Auth 
                onLoginSuccess={handleLoginSuccess} 
                users={users} 
                onRegisterSuccess={handleRegisterSuccess}
              />
            </motion.div>
          )}

          {/* SCREEN C: AUTHENTICATED WORKSPACES */}
          {splashComplete && currentUser && (
            <div className="w-full h-full">
              {currentUser.role === 'client' ? (
                // CLIENT VIEW (Handset framed device layout)
                <div className="w-full h-full flex justify-center bg-stone-950 md:p-4">
                  <div className="w-full max-w-lg bg-stone-950 md:border md:border-stone-800 md:rounded-[36px] md:shadow-2xl overflow-hidden flex flex-col h-full relative">
                    <ClientDashboardView
                      currentClient={currentUser}
                      bookings={bookings}
                      galleries={galleries}
                      folders={folders}
                      photos={photos}
                      notifications={notifications}
                      onAddBooking={handleAddBooking}
                      onUpdateProfile={handleUpdateProfile}
                      onTogglePhotoBest={handleTogglePhotoBest}
                      onClearNotificationBadge={handleClearNotifications}
                    />
                  </div>
                </div>
              ) : (
                // ADMIN & STAFF STUDIO CONTROL VIEW (Left drawer workspace dashboard)
                <AdminStaffDashboardView
                  currentUser={currentUser}
                  users={users}
                  bookings={bookings}
                  galleries={galleries}
                  folders={folders}
                  photos={photos}
                  auditLogs={auditLogs}
                  onAddGallery={handleAddGallery}
                  onUpdateBookingStatus={handleUpdateBookingStatus}
                  onAssignStaff={handleAssignStaff}
                  onAddFolder={handleAddFolder}
                  onRenameFolder={handleRenameFolder}
                  onDeleteFolder={handleDeleteFolder}
                  onUploadPhotos={handleUploadPhotos}
                  onDeletePhoto={handleDeletePhoto}
                  onTogglePhotoBest={handleTogglePhotoBest}
                  onSetPhotoCover={handleSetPhotoCover}
                  onClearDuplicatesInFolder={handleClearDuplicatesInFolder}
                  onResetDb={DbMock.reset}
                  onAddNotification={DbMock.addNotification}
                  onAddAuditLog={(action) => DbMock.addAuditLog(currentUser.name, currentUser.role, action)}
                />
              )}
            </div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
