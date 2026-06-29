/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Camera, ShieldCheck } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-stone-950 flex flex-col items-center justify-center z-50 text-stone-100 p-6 overflow-hidden select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      id="splash-screen"
    >
      {/* Background ambient decorative blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-stone-500/5 blur-3xl pointer-events-none" />

      {/* Main branding group */}
      <div className="flex flex-col items-center max-w-sm text-center">
        {/* Animated Camera Aperture Icon */}
        <motion.div
          className="relative w-24 h-24 rounded-full border-2 border-dashed border-stone-800 flex items-center justify-center mb-6"
          initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/20"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ yoyo: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <Camera size={28} strokeWidth={2} />
          </motion.div>
          
          {/* Outer glowing ring */}
          <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
        </motion.div>

        {/* Brand Text */}
        <motion.h1
          className="font-display text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-stone-100 via-stone-200 to-amber-400 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        >
          PHOTOBASE PRO
        </motion.h1>

        <motion.p
          className="text-stone-400 text-xs font-mono uppercase tracking-[0.25em] mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Studio Engine & Security
        </motion.p>

        {/* Loader Simulation Bar */}
        <div className="w-48 h-1 bg-stone-900 rounded-full overflow-hidden mb-6 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-stone-500 via-amber-500 to-yellow-400 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            onAnimationComplete={onComplete}
          />
        </div>

        {/* Secure badge */}
        <motion.div
          className="flex items-center gap-1.5 px-3 py-1 bg-stone-900/50 border border-stone-800 rounded-full text-[10px] text-stone-400 font-mono"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <ShieldCheck size={12} className="text-amber-500" />
          MIL-SPEC FILE ENCRYPTION ACTIVE
        </motion.div>
      </div>

      {/* Subtle bottom label */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] font-mono text-stone-600 tracking-widest">
        SYSTEM REVISION v3.11 // SAN FRANCISCO, CA
      </div>
    </motion.div>
  );
}
