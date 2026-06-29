/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, Booking, Gallery, Folder, Photo, AppNotification, AuditLog, UserRole } from './types';

// Predefined high-quality Unsplash photography URLs to represent real studio shoots
const IMAGES = {
  wedding1: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  wedding2: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  wedding3: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  wedding4: 'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&w=800&q=80',
  portrait1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  portrait2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  portrait3: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
  fashion1: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80',
  fashion2: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800&q=80',
  fashion3: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
  commercial1: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  commercial2: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
  blurry1: 'https://images.unsplash.com/photo-1551817958-c5b5d37af135?auto=format&fit=crop&w=400&q=20', // Intentional blurry camera shake style
  blurry2: 'https://images.unsplash.com/photo-1500051644838-9519f1db772d?auto=format&fit=crop&w=400&q=20',
};

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'u-admin',
    name: 'Sarah Jenkins',
    email: 'sarah@photobase.pro',
    role: 'admin',
    phone: '+1 (555) 019-2834',
    joinedDate: '2025-01-10',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'u-staff-1',
    name: 'Marcus Thorne',
    email: 'marcus@photobase.pro',
    role: 'staff',
    phone: '+1 (555) 014-9922',
    joinedDate: '2025-03-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'u-staff-2',
    name: 'Elena Vance',
    email: 'elena@photobase.pro',
    role: 'staff',
    phone: '+1 (555) 015-8833',
    joinedDate: '2025-04-20',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'u-client-1',
    name: 'Sophia Loren',
    email: 'sophia@example.com',
    role: 'client',
    phone: '+1 (555) 012-3456',
    joinedDate: '2026-02-01',
    categoryPreference: 'Wedding',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'u-client-2',
    name: 'David Beckham',
    email: 'david@example.com',
    role: 'client',
    phone: '+1 (555) 017-6543',
    joinedDate: '2026-05-12',
    categoryPreference: 'Fashion Editorial',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'u-client-tn1',
    name: 'Anand Krishnan (Tamil Nadu)',
    email: 'anand@example.com',
    role: 'client',
    phone: '+91 98401 23456',
    joinedDate: '2026-03-20',
    categoryPreference: 'Wedding Photography',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'u-client-tn2',
    name: 'Priya Sundaram (Tamil Nadu)',
    email: 'priya@example.com',
    role: 'client',
    phone: '+91 94440 98765',
    joinedDate: '2026-04-15',
    categoryPreference: 'Portrait Session',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'u-client-tn3',
    name: 'Karthik Raja (Tamil Nadu)',
    email: 'karthik@example.com',
    role: 'client',
    phone: '+91 91234 56789',
    joinedDate: '2026-06-01',
    categoryPreference: 'Commercial Shoot',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  }
];

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'B-2026-001',
    clientName: 'Sophia Loren',
    clientEmail: 'sophia@example.com',
    category: 'Wedding Photography',
    date: '2026-07-15',
    time: '13:00',
    location: 'The Glasshouse Hall, ECR, Chennai, Tamil Nadu',
    notes: 'Desires bright, airy wedding shots with high dynamic range. Ceremony starts at 14:00.',
    status: 'Editing',
    assignedStaffId: 'u-staff-1',
    assignedStaffName: 'Marcus Thorne',
    price: 250000,
    filesCount: 14,
    createdAt: '2026-05-10 10:24',
  },
  {
    id: 'B-2026-002',
    clientName: 'David Beckham',
    clientEmail: 'david@example.com',
    category: 'Fashion Editorial',
    date: '2026-06-20',
    time: '10:00',
    location: 'Studio Green, Film City, Chennai, Tamil Nadu',
    notes: 'High fashion winter catalog concept. Strong studio lighting, multiple backdrop changes.',
    status: 'Client Review',
    assignedStaffId: 'u-staff-2',
    assignedStaffName: 'Elena Vance',
    price: 150000,
    filesCount: 8,
    createdAt: '2026-05-18 14:15',
  },
  {
    id: 'B-2026-003',
    clientName: 'Sophia Loren',
    clientEmail: 'sophia@example.com',
    category: 'Portrait Session',
    date: '2026-02-14',
    time: '16:00',
    location: 'Marina Beach, Chennai, Tamil Nadu',
    notes: 'Sunset family portrait shoot. Prefers warm, golden hour colors.',
    status: 'Delivered',
    assignedStaffId: 'u-staff-1',
    assignedStaffName: 'Marcus Thorne',
    price: 15000,
    filesCount: 5,
    createdAt: '2026-01-15 09:12',
  },
  {
    id: 'B-2026-004',
    clientName: 'Emma Watson',
    clientEmail: 'emma@example.com',
    category: 'Commercial Shoot',
    date: '2026-07-05',
    time: '11:00',
    location: 'Downtown Organic Cafe, Coimbatore, Tamil Nadu',
    notes: 'New menu launch. Needs bright macro food photography and interior architectural framing.',
    status: 'Approved',
    assignedStaffId: 'u-staff-2',
    assignedStaffName: 'Elena Vance',
    price: 75000,
    filesCount: 0,
    createdAt: '2026-06-25 16:40',
  },
  {
    id: 'B-2026-005',
    clientName: 'Alice Johnson',
    clientEmail: 'alice@example.com',
    category: 'Maternity Session',
    date: '2026-07-22',
    time: '09:30',
    location: 'Botanical Gardens, Ooty, Tamil Nadu',
    notes: 'Soft pastel themed session. Outdoor and indoor greenhouse setups.',
    status: 'Pending',
    price: 25000,
    filesCount: 0,
    createdAt: '2026-06-28 11:15',
  },
  {
    id: 'B-2026-006',
    clientName: 'Anand Krishnan (Tamil Nadu)',
    clientEmail: 'anand@example.com',
    category: 'Wedding Photography',
    date: '2026-08-12',
    time: '09:00',
    location: 'Leela Palace, Chennai, Tamil Nadu',
    notes: 'Traditional Tamil wedding photography and cinematic shoot.',
    status: 'Approved',
    assignedStaffId: 'u-staff-1',
    assignedStaffName: 'Marcus Thorne',
    price: 250000,
    filesCount: 0,
    createdAt: '2026-06-20 11:30',
  },
  {
    id: 'B-2026-007',
    clientName: 'Priya Sundaram (Tamil Nadu)',
    clientEmail: 'priya@example.com',
    category: 'Portrait Session',
    date: '2026-07-28',
    time: '17:00',
    location: 'Marina Beach, Chennai, Tamil Nadu',
    notes: 'Outdoor sunset session in traditional attire.',
    status: 'Pending',
    price: 15000,
    filesCount: 0,
    createdAt: '2026-06-28 15:45',
  }
];

const DEFAULT_GALLERIES: Gallery[] = [
  {
    id: 'G-001',
    title: 'Sophia & Leo Wedding Day',
    bookingId: 'B-2026-001',
    clientEmail: 'sophia@example.com',
    folderCount: 3,
    photoCount: 14,
    status: 'Active',
    expirationType: '60 days',
    createdAt: '2026-06-25',
  },
  {
    id: 'G-002',
    title: 'Autumn Fashion Editorial',
    bookingId: 'B-2026-002',
    clientEmail: 'david@example.com',
    folderCount: 2,
    photoCount: 8,
    status: 'Active',
    expirationType: 'Never',
    createdAt: '2026-06-22',
  },
  {
    id: 'G-003',
    title: 'Sunset Portrait Session',
    bookingId: 'B-2026-003',
    clientEmail: 'sophia@example.com',
    folderCount: 1,
    photoCount: 5,
    status: 'Active',
    expirationType: '30 days',
    createdAt: '2026-02-16',
  },
];

const DEFAULT_FOLDERS: Folder[] = [
  // Sophia & Leo Wedding Folders
  { id: 'F-001', galleryId: 'G-001', name: 'Ceremony Highlights', photoCount: 5, createdAt: '2026-06-25' },
  { id: 'F-002', galleryId: 'G-001', name: 'Bridal Portraits', photoCount: 5, createdAt: '2026-06-25' },
  { id: 'F-003', galleryId: 'G-001', name: 'Reception & Dance', photoCount: 4, createdAt: '2026-06-25' },

  // Autumn Fashion Folders
  { id: 'F-004', galleryId: 'G-002', name: 'Studio Catalog', photoCount: 5, createdAt: '2026-06-22' },
  { id: 'F-005', galleryId: 'G-002', name: 'Behind the Scenes', photoCount: 3, createdAt: '2026-06-22' },

  // Sunset Portraits Folder
  { id: 'F-006', galleryId: 'G-003', name: 'Selected Highlights', photoCount: 5, createdAt: '2026-02-16' },
];

const DEFAULT_PHOTOS: Photo[] = [
  // G-001 F-001: Ceremony Highlights
  {
    id: 'P-101',
    galleryId: 'G-001',
    folderId: 'F-001',
    url: IMAGES.wedding1,
    filename: 'ceremony_first_kiss_master.jpg',
    size: '4.2 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 12,
    isDuplicate: false,
    width: 4500,
    height: 3000,
    isCover: true,
    selectedAsBest: true,
    uploadDate: '2026-06-25 14:02',
  },
  {
    id: 'P-102',
    galleryId: 'G-001',
    folderId: 'F-001',
    url: IMAGES.wedding2,
    filename: 'ceremony_ring_exchange.jpg',
    size: '3.8 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 18,
    isDuplicate: false,
    width: 4500,
    height: 3000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-25 14:03',
  },
  {
    id: 'P-103',
    galleryId: 'G-001',
    folderId: 'F-001',
    url: IMAGES.wedding3,
    filename: 'ceremony_exit_cheers.jpg',
    size: '5.1 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 25,
    isDuplicate: false,
    width: 4500,
    height: 3000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-25 14:04',
  },
  {
    id: 'P-104',
    galleryId: 'G-001',
    folderId: 'F-001',
    url: IMAGES.wedding4,
    filename: 'ceremony_vows_closeup.jpg',
    size: '3.5 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 14,
    isDuplicate: false,
    width: 3000,
    height: 4500,
    isCover: false,
    selectedAsBest: true,
    uploadDate: '2026-06-25 14:05',
  },
  {
    id: 'P-105',
    galleryId: 'G-001',
    folderId: 'F-001',
    url: IMAGES.blurry1,
    filename: 'ceremony_unfocused_test.jpg',
    size: '2.9 MB',
    extension: 'JPG',
    isBlurry: true,
    blurScore: 82, // High blurry score
    isDuplicate: false,
    width: 2000,
    height: 1333,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-25 14:06',
  },

  // G-001 F-002: Bridal Portraits
  {
    id: 'P-106',
    galleryId: 'G-001',
    folderId: 'F-002',
    url: IMAGES.portrait1,
    filename: 'bridal_portrait_orchard_glow.jpg',
    size: '4.8 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 8,
    isDuplicate: false,
    width: 4000,
    height: 6000,
    isCover: false,
    selectedAsBest: true,
    uploadDate: '2026-06-25 14:15',
  },
  {
    id: 'P-107',
    galleryId: 'G-001',
    folderId: 'F-002',
    url: IMAGES.portrait2,
    filename: 'bridal_groom_look_back.jpg',
    size: '5.2 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 11,
    isDuplicate: false,
    width: 4000,
    height: 6000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-25 14:16',
  },
  {
    id: 'P-108',
    galleryId: 'G-001',
    folderId: 'F-002',
    url: IMAGES.portrait3,
    filename: 'bridal_veil_breeze.jpg',
    size: '3.9 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 15,
    isDuplicate: false,
    width: 6000,
    height: 4000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-25 14:17',
  },
  {
    id: 'P-109',
    galleryId: 'G-001',
    folderId: 'F-002',
    url: IMAGES.portrait1, // Duplicate image url
    filename: 'bridal_portrait_duplicate_copy.jpg',
    size: '4.8 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 8,
    isDuplicate: true, // Marked duplicate
    width: 4000,
    height: 6000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-25 14:18',
  },
  {
    id: 'P-110',
    galleryId: 'G-001',
    folderId: 'F-002',
    url: 'RAW_FILE_PLACEHOLDER_CR2',
    filename: 'bridal_raw_capture_IMG_9948.CR2',
    size: '28.4 MB',
    extension: 'RAW',
    isBlurry: false,
    blurScore: 5,
    isDuplicate: false,
    width: 6000,
    height: 4000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-25 14:19',
  },

  // G-001 F-003: Reception & Dance
  {
    id: 'P-111',
    galleryId: 'G-001',
    folderId: 'F-003',
    url: IMAGES.wedding3,
    filename: 'reception_champagne_toast.jpg',
    size: '4.0 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 19,
    isDuplicate: false,
    width: 4500,
    height: 3000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-25 14:30',
  },
  {
    id: 'P-112',
    galleryId: 'G-001',
    folderId: 'F-003',
    url: IMAGES.wedding4,
    filename: 'reception_cake_cutting.jpg',
    size: '3.7 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 22,
    isDuplicate: false,
    width: 4500,
    height: 3000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-25 14:31',
  },
  {
    id: 'P-113',
    galleryId: 'G-001',
    folderId: 'F-003',
    url: IMAGES.wedding1,
    filename: 'reception_dancefloor_spin.jpg',
    size: '4.5 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 17,
    isDuplicate: false,
    width: 4500,
    height: 3000,
    isCover: false,
    selectedAsBest: true,
    uploadDate: '2026-06-25 14:32',
  },
  {
    id: 'P-114',
    galleryId: 'G-001',
    folderId: 'F-003',
    url: IMAGES.blurry2,
    filename: 'reception_out_of_focus.jpg',
    size: '2.1 MB',
    extension: 'JPG',
    isBlurry: true,
    blurScore: 78,
    isDuplicate: false,
    width: 1920,
    height: 1080,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-25 14:33',
  },

  // G-002 F-004: Autumn Fashion Editorial - Studio Catalog
  {
    id: 'P-201',
    galleryId: 'G-002',
    folderId: 'F-004',
    url: IMAGES.fashion1,
    filename: 'fashion_overcoat_outdoor_stare.jpg',
    size: '6.4 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 4,
    isDuplicate: false,
    width: 5000,
    height: 7500,
    isCover: true,
    selectedAsBest: true,
    uploadDate: '2026-06-22 11:15',
  },
  {
    id: 'P-202',
    galleryId: 'G-002',
    folderId: 'F-004',
    url: IMAGES.fashion2,
    filename: 'fashion_monochrome_jacket.jpg',
    size: '5.9 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 6,
    isDuplicate: false,
    width: 5000,
    height: 7500,
    isCover: false,
    selectedAsBest: true,
    uploadDate: '2026-06-22 11:16',
  },
  {
    id: 'P-203',
    galleryId: 'G-002',
    folderId: 'F-004',
    url: IMAGES.fashion3,
    filename: 'fashion_knitwear_close.jpg',
    size: '7.1 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 5,
    isDuplicate: false,
    width: 7500,
    height: 5000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-22 11:17',
  },
  {
    id: 'P-204',
    galleryId: 'G-002',
    folderId: 'F-004',
    url: 'RAW_FILE_PLACEHOLDER_NEF',
    filename: 'fashion_raw_profile_capture_DSC_0411.NEF',
    size: '34.2 MB',
    extension: 'RAW',
    isBlurry: false,
    blurScore: 3,
    isDuplicate: false,
    width: 7360,
    height: 4912,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-22 11:18',
  },
  {
    id: 'P-205',
    galleryId: 'G-002',
    folderId: 'F-004',
    url: IMAGES.blurry1,
    filename: 'fashion_shaky_test.jpg',
    size: '3.1 MB',
    extension: 'JPG',
    isBlurry: true,
    blurScore: 89,
    isDuplicate: false,
    width: 3000,
    height: 2000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-22 11:19',
  },

  // G-002 F-005: Autumn Fashion Editorial - Behind the Scenes
  {
    id: 'P-206',
    galleryId: 'G-002',
    folderId: 'F-005',
    url: IMAGES.commercial1,
    filename: 'bts_lighting_setup.jpg',
    size: '4.5 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 28,
    isDuplicate: false,
    width: 4000,
    height: 2666,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-22 11:25',
  },
  {
    id: 'P-207',
    galleryId: 'G-002',
    folderId: 'F-005',
    url: IMAGES.commercial2,
    filename: 'bts_hair_makeup_prep.jpg',
    size: '3.8 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 24,
    isDuplicate: false,
    width: 4000,
    height: 2666,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-22 11:26',
  },
  {
    id: 'P-208',
    galleryId: 'G-002',
    folderId: 'F-005',
    url: IMAGES.fashion3, // Duplicate of P-203
    filename: 'bts_duplicate_check.jpg',
    size: '7.1 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 5,
    isDuplicate: true,
    width: 7500,
    height: 5000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-06-22 11:27',
  },

  // G-003 F-006: Sunset Portrait Session
  {
    id: 'P-301',
    galleryId: 'G-003',
    folderId: 'F-006',
    url: IMAGES.portrait2,
    filename: 'portrait_baker_beach_sunset.jpg',
    size: '4.1 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 10,
    isDuplicate: false,
    width: 4500,
    height: 3000,
    isCover: true,
    selectedAsBest: true,
    uploadDate: '2026-02-16 17:10',
  },
  {
    id: 'P-302',
    galleryId: 'G-003',
    folderId: 'F-006',
    url: IMAGES.portrait1,
    filename: 'portrait_smile_ocean_background.jpg',
    size: '3.9 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 12,
    isDuplicate: false,
    width: 3000,
    height: 4500,
    isCover: false,
    selectedAsBest: true,
    uploadDate: '2026-02-16 17:11',
  },
  {
    id: 'P-303',
    galleryId: 'G-003',
    folderId: 'F-006',
    url: IMAGES.portrait3,
    filename: 'portrait_profile_golden_light.jpg',
    size: '4.5 MB',
    extension: 'JPG',
    isBlurry: false,
    blurScore: 9,
    isDuplicate: false,
    width: 4500,
    height: 3000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-02-16 17:12',
  },
  {
    id: 'P-304',
    galleryId: 'G-003',
    folderId: 'F-006',
    url: IMAGES.blurry2,
    filename: 'portrait_blurred_wave_accident.jpg',
    size: '2.5 MB',
    extension: 'JPG',
    isBlurry: true,
    blurScore: 75,
    isDuplicate: false,
    width: 3000,
    height: 2000,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-02-16 17:13',
  },
  {
    id: 'P-305',
    galleryId: 'G-003',
    folderId: 'F-006',
    url: 'RAW_FILE_PLACEHOLDER_ARW',
    filename: 'portrait_uncompressed_sony_capture.ARW',
    size: '41.5 MB',
    extension: 'RAW',
    isBlurry: false,
    blurScore: 4,
    isDuplicate: false,
    width: 7952,
    height: 5304,
    isCover: false,
    selectedAsBest: false,
    uploadDate: '2026-02-16 17:14',
  },
];

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'N-001',
    userRole: 'admin',
    title: 'New Session Request',
    message: 'Alice Johnson requested a Maternity Session for July 22nd.',
    type: 'booking_status',
    read: false,
    date: '2026-06-28 11:15',
  },
  {
    id: 'N-002',
    userEmail: 'sophia@example.com',
    title: 'Gallery Ready for Proofing',
    message: 'Your wedding gallery is ready. Please review the photographs and request prints or high-res downloads.',
    type: 'proof_review',
    read: false,
    date: '2026-06-25 14:45',
  },
  {
    id: 'N-003',
    userRole: 'staff',
    title: 'New Booking Assigned',
    message: 'You have been assigned to cover Emma Watson\'s Commercial Shoot on July 5th.',
    type: 'booking_status',
    read: false,
    date: '2026-06-25 16:45',
  },
  {
    id: 'N-004',
    userEmail: 'david@example.com',
    title: 'Autumn Fashion Catalog Live',
    message: 'Elena Vance uploaded 8 proofs. Drag-and-drop is secured on your client dashboard.',
    type: 'photo_uploaded',
    read: true,
    date: '2026-06-22 12:00',
  },
  {
    id: 'N-005',
    userEmail: 'sophia@example.com',
    title: 'Gallery Expiring Soon',
    message: 'Your Sunset Portrait Session gallery expires in 7 days.',
    type: 'gallery_expiring',
    read: false,
    date: '2026-06-29 08:00',
  },
];

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  { id: 'L-001', user: 'Sarah Jenkins', role: 'admin', action: 'Approved booking B-2026-001 (Sophia Loren)', date: '2026-05-11', time: '09:15' },
  { id: 'L-002', user: 'Marcus Thorne', role: 'staff', action: 'Uploaded 14 proofs to G-001 (Sophia Wedding)', date: '2026-06-25', time: '14:02' },
  { id: 'L-003', user: 'Elena Vance', role: 'staff', action: 'Changed booking status B-2026-002 (David Beckham) to Client Review', date: '2026-06-22', time: '11:45' },
  { id: 'L-004', user: 'Sophia Loren', role: 'client', action: 'Logged in securely and unlocked G-001 Wedding Day', date: '2026-06-26', time: '18:12' },
  { id: 'L-005', user: 'Sarah Jenkins', role: 'admin', action: 'Configured global watermark overlay parameters', date: '2026-06-27', time: '10:30' },
  { id: 'L-006', user: 'David Beckham', role: 'client', action: 'Saved 2 photographs as favorites', date: '2026-06-23', time: '15:22' },
];

export class DbMock {
  static init() {
    const isV2 = localStorage.getItem('pb_v2');
    if (!isV2) {
      DbMock.reset();
      localStorage.setItem('pb_v2', 'true');
      return;
    }
    if (!localStorage.getItem('pb_users')) {
      localStorage.setItem('pb_users', JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem('pb_bookings')) {
      localStorage.setItem('pb_bookings', JSON.stringify(DEFAULT_BOOKINGS));
    }
    if (!localStorage.getItem('pb_galleries')) {
      localStorage.setItem('pb_galleries', JSON.stringify(DEFAULT_GALLERIES));
    }
    if (!localStorage.getItem('pb_folders')) {
      localStorage.setItem('pb_folders', JSON.stringify(DEFAULT_FOLDERS));
    }
    if (!localStorage.getItem('pb_photos')) {
      localStorage.setItem('pb_photos', JSON.stringify(DEFAULT_PHOTOS));
    }
    if (!localStorage.getItem('pb_notifications')) {
      localStorage.setItem('pb_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
    }
    if (!localStorage.getItem('pb_audit_logs')) {
      localStorage.setItem('pb_audit_logs', JSON.stringify(DEFAULT_AUDIT_LOGS));
    }
    // Set active user session if not set (default to admin to see everything first)
    if (!localStorage.getItem('pb_current_user')) {
      localStorage.setItem('pb_current_user', JSON.stringify(DEFAULT_USERS[0]));
    }
  }

  static reset() {
    localStorage.setItem('pb_users', JSON.stringify(DEFAULT_USERS));
    localStorage.setItem('pb_bookings', JSON.stringify(DEFAULT_BOOKINGS));
    localStorage.setItem('pb_galleries', JSON.stringify(DEFAULT_GALLERIES));
    localStorage.setItem('pb_folders', JSON.stringify(DEFAULT_FOLDERS));
    localStorage.setItem('pb_photos', JSON.stringify(DEFAULT_PHOTOS));
    localStorage.setItem('pb_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
    localStorage.setItem('pb_audit_logs', JSON.stringify(DEFAULT_AUDIT_LOGS));
    localStorage.setItem('pb_current_user', JSON.stringify(DEFAULT_USERS[0]));
  }

  // Getters
  static getUsers(): UserProfile[] {
    return JSON.parse(localStorage.getItem('pb_users') || '[]');
  }

  static getBookings(): Booking[] {
    return JSON.parse(localStorage.getItem('pb_bookings') || '[]');
  }

  static getGalleries(): Gallery[] {
    return JSON.parse(localStorage.getItem('pb_galleries') || '[]');
  }

  static getFolders(): Folder[] {
    return JSON.parse(localStorage.getItem('pb_folders') || '[]');
  }

  static getPhotos(): Photo[] {
    return JSON.parse(localStorage.getItem('pb_photos') || '[]');
  }

  static getNotifications(): AppNotification[] {
    return JSON.parse(localStorage.getItem('pb_notifications') || '[]');
  }

  static getAuditLogs(): AuditLog[] {
    return JSON.parse(localStorage.getItem('pb_audit_logs') || '[]');
  }

  static getCurrentUser(): UserProfile | null {
    const user = localStorage.getItem('pb_current_user');
    return user ? JSON.parse(user) : null;
  }

  // Setters / Updates
  static setCurrentUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem('pb_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pb_current_user');
    }
  }

  static saveUsers(users: UserProfile[]) {
    localStorage.setItem('pb_users', JSON.stringify(users));
  }

  static saveBookings(bookings: Booking[]) {
    localStorage.setItem('pb_bookings', JSON.stringify(bookings));
  }

  static saveGalleries(galleries: Gallery[]) {
    localStorage.setItem('pb_galleries', JSON.stringify(galleries));
  }

  static saveFolders(folders: Folder[]) {
    localStorage.setItem('pb_folders', JSON.stringify(folders));
  }

  static savePhotos(photos: Photo[]) {
    localStorage.setItem('pb_photos', JSON.stringify(photos));
  }

  static saveNotifications(notifications: AppNotification[]) {
    localStorage.setItem('pb_notifications', JSON.stringify(notifications));
  }

  static saveAuditLogs(logs: AuditLog[]) {
    localStorage.setItem('pb_audit_logs', JSON.stringify(logs));
  }

  // Business Logic
  static addAuditLog(userName: string, role: UserRole, action: string) {
    const logs = this.getAuditLogs();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
    const newLog: AuditLog = {
      id: `L-${Date.now()}`,
      user: userName,
      role,
      action,
      date: dateStr,
      time: timeStr,
    };
    logs.unshift(newLog);
    this.saveAuditLogs(logs);
  }

  static addNotification(title: string, message: string, type: AppNotification['type'], options?: { userRole?: UserRole; userEmail?: string }) {
    const notifications = this.getNotifications();
    const newNotif: AppNotification = {
      id: `N-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ...options,
    };
    notifications.unshift(newNotif);
    this.saveNotifications(notifications);
  }

  // Simulated Intelligent Assistant AI scoring for Blur / Duplicate check
  static simulateAIEngineOnNewPhoto(photoUrl: string, filename: string): { isBlurry: boolean; blurScore: number; isDuplicate: boolean } {
    // Basic heuristics to make duplicate or blurry checks feel highly responsive and smart in front of user
    let blurScore = Math.floor(Math.random() * 35) + 5; // standard crisp photobase images (5 to 40 score)
    let isBlurry = false;
    
    // Check if filename has indicators of blurry or test
    if (filename.toLowerCase().includes('blur') || filename.toLowerCase().includes('shake') || filename.toLowerCase().includes('out_of_focus') || filename.toLowerCase().includes('unfocused')) {
      blurScore = Math.floor(Math.random() * 25) + 75; // 75 to 100
      isBlurry = true;
    }

    // Check if there's duplicate file in database
    const existingPhotos = this.getPhotos();
    const isDuplicate = existingPhotos.some(p => p.url === photoUrl || p.filename === filename);

    return {
      blurScore,
      isBlurry,
      isDuplicate,
    };
  }
}
