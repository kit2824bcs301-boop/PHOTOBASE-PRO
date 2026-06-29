/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Mail, Lock, User, Key, KeyRound, Sparkles, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthProps {
  onLoginSuccess: (user: UserProfile) => void;
  users: UserProfile[];
  onRegisterSuccess: (newUser: UserProfile) => void;
}

export default function Auth({ onLoginSuccess, users, onRegisterSuccess }: AuthProps) {
  const [screen, setScreen] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');
  
  // Login input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register input states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPreference, setRegPreference] = useState('Wedding');

  // Verify input states
  const [verifyCode, setVerifyCode] = useState(['', '', '', '']);
  const [verificationEmail, setVerificationEmail] = useState('');

  // Preset switch triggers for rapid evaluation of roles
  const handleQuickLogin = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      onLoginSuccess(user);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Check credential matching or fallback match
    const user = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
    if (user) {
      onLoginSuccess(user);
    } else {
      setLoginError('No corresponding active sandbox credentials. Try the quick preset buttons below!');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) return;

    // Simulate creation
    const newClient: UserProfile = {
      id: `u-client-${Date.now()}`,
      name: regName,
      email: regEmail,
      phone: regPhone,
      role: 'client',
      joinedDate: new Date().toISOString().split('T')[0],
      categoryPreference: regPreference,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    };

    setVerificationEmail(regEmail);
    onRegisterSuccess(newClient); // Save in DB
    setScreen('verify'); // Transition to email verify PIN
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const joinedCode = verifyCode.join('');
    if (joinedCode.length < 4) return;

    // Find client registered or login matching email
    const user = users.find(u => u.email.toLowerCase() === verificationEmail.toLowerCase()) || users.find(u => u.role === 'client');
    if (user) {
      onLoginSuccess(user);
    }
  };

  const handleVerifyCodeChange = (index: number, val: string) => {
    if (val.length > 1) return;
    const nextCode = [...verifyCode];
    nextCode[index] = val;
    setVerifyCode(nextCode);

    // Auto focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4 relative overflow-hidden" id="auth-root-container">
      {/* Visual background enhancements */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-stone-500/5 blur-3xl rounded-full" />

      <AnimatePresence mode="wait">
        
        {/* LOGIN SCREEN */}
        {screen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative z-10 text-left"
          >
            {/* Branding */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 mx-auto flex items-center justify-center text-stone-950 shadow-md">
                <KeyRound size={20} />
              </div>
              <h2 className="font-display text-2xl font-extrabold text-stone-100 tracking-wide mt-3">PHOTOBASE PRO</h2>
              <p className="text-stone-400 text-xs">Secure Photography Management suite</p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-start gap-2">
                <ShieldCheck size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5 text-left">
                <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase block">Email Coordinates</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-stone-500" size={13} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@photobase.pro"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-stone-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase block">Passcode</label>
                  <button 
                    type="button" 
                    onClick={() => setScreen('forgot')}
                    className="text-[10px] font-mono text-amber-500 hover:text-amber-400 font-semibold"
                  >
                    Forgot Key?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-stone-500" size={13} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-10 py-2.5 text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-stone-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-stone-500 hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl transition-all shadow-md shadow-amber-500/10 font-display text-xs"
              >
                Authenticate Session
              </button>
            </form>

            <div className="text-center">
              <span className="text-stone-500 text-xs">New to the studio? </span>
              <button 
                onClick={() => setScreen('register')}
                className="text-xs text-amber-500 hover:text-amber-400 font-semibold underline"
              >
                Register Account
              </button>
            </div>

            {/* Quick Presets section */}
            <div className="pt-4 border-t border-stone-800/80 space-y-2.5">
              <span className="text-[9px] font-mono text-stone-500 tracking-wider uppercase block text-center font-semibold">
                QUICK ACCESS EVALUATION PORTAL
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleQuickLogin('sarah@photobase.pro')}
                  className="py-1 px-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-[10px] font-semibold border border-rose-500/20 transition-all font-mono text-center"
                >
                  ADMIN
                </button>
                <button
                  onClick={() => handleQuickLogin('marcus@photobase.pro')}
                  className="py-1 px-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-[10px] font-semibold border border-amber-500/20 transition-all font-mono text-center"
                >
                  PHOTOGRAPHER
                </button>
                <button
                  onClick={() => handleQuickLogin('sophia@example.com')}
                  className="py-1 px-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-semibold border border-emerald-500/20 transition-all font-mono text-center"
                >
                  CLIENT
                </button>
              </div>
            </div>

          </motion.div>
        )}

        {/* REGISTRATION SCREEN */}
        {screen === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative z-10 text-left"
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20">
                <User size={20} />
              </div>
              <h2 className="font-display text-xl font-bold text-stone-100 mt-3">Register Client Account</h2>
              <p className="text-stone-400 text-xs">Unlock private proofing & secure downloading</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-stone-500" size={13} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sophia Loren"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase block">Email Coordinates</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-stone-500" size={13} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. sophia@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase block">Phone Contact</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-stone-500" size={13} />
                  <input
                    type="tel"
                    placeholder="+1 (555) 012-3456"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase block">Create Passcode</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-stone-500" size={13} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase block">Primary Booking Style Preference</label>
                <select
                  value={regPreference}
                  onChange={(e) => setRegPreference(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 focus:outline-none"
                >
                  <option value="Wedding">Wedding Photography</option>
                  <option value="Portrait">Portrait & Family Session</option>
                  <option value="Fashion Editorial">Fashion Editorial</option>
                  <option value="Commercial Shoot">Commercial & Products</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition-all shadow-md shadow-amber-500/10 text-xs font-display flex items-center justify-center gap-1.5"
              >
                Register & Verify Email <ArrowRight size={13} />
              </button>
            </form>

            <div className="text-center">
              <span className="text-stone-500 text-xs">Already registered? </span>
              <button 
                onClick={() => setScreen('login')}
                className="text-xs text-amber-500 hover:text-amber-400 font-semibold underline"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        )}

        {/* FORGOT PASSWORD SCREEN */}
        {screen === 'forgot' && (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative z-10 text-left"
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center border border-amber-500/20">
                <Key size={20} />
              </div>
              <h2 className="font-display text-xl font-bold text-stone-100 mt-3">Reset Passcode Key</h2>
              <p className="text-stone-400 text-xs">Request simulated encrypted temporary credential</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-stone-400 font-mono tracking-wider text-[10px] uppercase block">Email Coordinates</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-stone-500" size={13} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. sophia@example.com"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  alert('Reset token dispatched successfully to mock inbox! Follow verification instructions.');
                  setScreen('login');
                }}
                className="w-full py-2.5 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs font-display"
              >
                Dispatch Security Token
              </button>

              <button 
                onClick={() => setScreen('login')}
                className="w-full py-2 text-stone-400 hover:text-stone-200 font-semibold"
              >
                &larr; Return to Sign In
              </button>
            </div>
          </motion.div>
        )}

        {/* EMAIL VERIFICATION PIN CODE SCREEN */}
        {screen === 'verify' && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative z-10 text-left"
          >
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck size={20} />
              </div>
              <h2 className="font-display text-xl font-bold text-stone-100 mt-3">Verify Secure Identity</h2>
              <p className="text-stone-400 text-xs mt-1">A simulated 4-digit token has been sent to {verificationEmail || 'your email'}</p>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-6 text-xs text-center">
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`pin-${idx}`}
                    type="text"
                    required
                    maxLength={1}
                    value={verifyCode[idx]}
                    onChange={(e) => handleVerifyCodeChange(idx, e.target.value)}
                    className="w-12 h-12 bg-stone-950 border border-stone-800 rounded-xl text-center text-lg font-mono font-bold text-amber-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                ))}
              </div>

              <div className="text-[10px] text-stone-500 font-mono">
                Hint: Enter any 4 digits (e.g. <strong className="text-amber-500/80">1234</strong>) to confirm the flow.
              </div>

              <button
                type="submit"
                disabled={verifyCode.join('').length < 4}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition-all shadow-md shadow-amber-500/10 font-display text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Validate Security Token
              </button>
            </form>

            <button 
              onClick={() => setScreen('login')}
              className="w-full py-2 text-stone-400 hover:text-stone-200 font-semibold text-center text-xs"
            >
              Cancel
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
