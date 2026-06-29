/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react';

interface WatermarkedImageProps {
  src: string;
  alt: string;
  clientName?: string;
  date?: string;
  className?: string;
  isRawPlaceholder?: boolean;
}

export default function WatermarkedImage({
  src,
  alt,
  clientName = 'DEMO CLIENT',
  date = '2026-06-29',
  className = '',
  isRawPlaceholder = false,
}: WatermarkedImageProps) {
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [showCopyWarning, setShowCopyWarning] = useState(false);

  // Monitor window focus/blur state to blur image content when user switches windows/tabs (security prevention)
  useEffect(() => {
    const handleBlur = () => setIsWindowBlurred(true);
    const handleFocus = () => setIsWindowBlurred(false);

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Prevent right click context menus
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerWarning();
  };

  // Prevent dragging
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    triggerWarning();
  };

  const triggerWarning = () => {
    setShowCopyWarning(true);
    setTimeout(() => setShowCopyWarning(false), 2000);
  };

  if (isRawPlaceholder) {
    return (
      <div className={`relative bg-stone-900 border border-stone-800 rounded-xl p-6 flex flex-col items-center justify-center text-center aspect-square ${className}`} id="raw-placeholder">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-3">
          <AlertTriangle size={24} />
        </div>
        <span className="font-mono text-xs text-amber-500 font-semibold tracking-wider">RAW FILE PREVIEW</span>
        <h4 className="text-sm font-medium text-stone-200 mt-2">{alt}</h4>
        <p className="text-xs text-stone-400 max-w-[200px] mt-2">
          RAW formats (.CR2, .NEF, .ARW) are available for download only. Previews are disabled for color accuracy.
        </p>
        <div className="mt-4 px-3 py-1.5 bg-stone-800 rounded-lg text-[10px] text-stone-300 font-mono">
          File Size: 28.4 MB
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden select-none bg-stone-950 rounded-xl ${className}`}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      style={{
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
      }}
      id="watermark-container"
    >
      {/* Underlying protected Image */}
      <img
        src={src}
        alt={alt}
        draggable="false"
        className={`w-full h-full object-cover pointer-events-none transition-all duration-300 ${
          isWindowBlurred ? 'blur-2xl scale-105 saturate-50' : ''
        }`}
        referrerPolicy="no-referrer"
      />

      {/* Repeating Diagonal Custom Security Watermark SVG Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-30 mix-blend-difference"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='200' viewBox='0 0 250 200'><text fill='%23ffffff' font-family='monospace' font-size='10' font-weight='bold' x='125' y='100' text-anchor='middle' transform='rotate(-35 125 100)'>© REPRODUCTION EXPLICITLY FORBIDDEN</text></svg>")`,
          backgroundRepeat: 'repeat',
        }}
        id="diagonal-watermark"
      />

      {/* Footer watermark overlay */}
      <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 flex items-center justify-between text-[9px] font-mono text-stone-300 z-10 tracking-tight">
        <span className="flex items-center gap-1">
          <ShieldCheck size={10} className="text-emerald-500" />
          SECURE PROOF: {clientName.toUpperCase()}
        </span>
        <span>{date}</span>
      </div>

      {/* Window blurred protection screen overlay */}
      {isWindowBlurred && (
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-lg flex flex-col items-center justify-center text-center z-20 p-4 transition-all duration-300">
          <EyeOff className="text-rose-500 mb-2 animate-pulse" size={32} />
          <h5 className="font-semibold text-stone-100 text-sm">Preview Hidden</h5>
          <p className="text-stone-400 text-xs mt-1 max-w-[200px] leading-snug">
            App is in the background. Proofing elements hidden for protection.
          </p>
        </div>
      )}

      {/* Copy Warning Popup */}
      {showCopyWarning && (
        <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-center z-30 p-4 animate-fade-in text-rose-400">
          <AlertTriangle size={24} className="mb-1 text-amber-500 animate-bounce" />
          <h6 className="text-xs font-semibold uppercase tracking-wider">Security Active</h6>
          <p className="text-[10px] text-stone-300 mt-1 max-w-[160px]">
            Copy, drag, and screenshots are restricted on secure proof files.
          </p>
        </div>
      )}
    </div>
  );
}
