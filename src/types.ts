/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'staff' | 'client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  joinedDate: string;
  categoryPreference?: string;
}

export type BookingStatus =
  | 'Pending'
  | 'Approved'
  | 'Photographer Assigned'
  | 'Shooting Completed'
  | 'Editing'
  | 'Client Review'
  | 'Delivered'
  | 'Archived';

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  category: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
  status: BookingStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  price: number;
  filesCount: number;
  createdAt: string;
}

export interface Gallery {
  id: string;
  title: string;
  bookingId: string;
  clientEmail: string;
  folderCount: number;
  photoCount: number;
  status: 'Active' | 'Archived';
  expirationType: 'Never' | '30 days' | '60 days' | '90 days';
  createdAt: string;
}

export interface Folder {
  id: string;
  galleryId: string;
  name: string;
  photoCount: number;
  createdAt: string;
}

export interface Photo {
  id: string;
  galleryId: string;
  folderId: string;
  url: string;
  filename: string;
  size: string;
  extension: string;
  isBlurry: boolean;
  blurScore: number; // 0 (crisp) to 100 (very blurry)
  isDuplicate: boolean;
  width: number;
  height: number;
  isCover: boolean;
  selectedAsBest: boolean;
  uploadDate: string;
}

export interface AppNotification {
  id: string;
  userRole?: UserRole;
  userEmail?: string;
  title: string;
  message: string;
  type: 'booking_status' | 'photo_uploaded' | 'gallery_expiring' | 'system' | 'proof_review';
  read: boolean;
  date: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: UserRole;
  action: string;
  date: string;
  time: string;
}
