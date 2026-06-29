/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, Calendar, Cloud, Activity, Search, ShieldAlert, Award, Database, Download } from 'lucide-react';
import { Booking, AuditLog, Gallery } from '../types';

interface AnalyticsChartsProps {
  bookings: Booking[];
  auditLogs: AuditLog[];
  galleries: Gallery[];
}

export default function AnalyticsCharts({ bookings, auditLogs, galleries }: AnalyticsChartsProps) {
  const [logSearch, setLogSearch] = useState('');

  // 1. Calculate Core KPI Stats
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status !== 'Delivered' && b.status !== 'Archived').length;
  const completedBookings = bookings.filter(b => b.status === 'Delivered' || b.status === 'Archived').length;
  
  // Storage stats (simulated metrics)
  const totalStorageGB = 500;
  const usedStorageGB = parseFloat((galleries.length * 4.2 + bookings.reduce((acc, b) => acc + (b.filesCount * 0.035), 0)).toFixed(1));
  const storagePercentage = Math.round((usedStorageGB / totalStorageGB) * 100);

  // Popular Photography Categories
  const categoriesMap: { [key: string]: number } = {};
  bookings.forEach(b => {
    categoriesMap[b.category] = (categoriesMap[b.category] || 0) + 1;
  });
  const sortedCategories = Object.entries(categoriesMap).sort((a, b) => b[1] - a[1]);
  const primaryCategory = sortedCategories[0]?.[0] || 'Wedding Photography';

  // 2. Mock Trend Data for beautiful SVG plotting
  // Monthly bookings: Feb, Mar, Apr, May, Jun, Jul (simulated)
  const monthlyData = [
    { month: 'Feb', count: 3 },
    { month: 'Mar', count: 5 },
    { month: 'Apr', count: 8 },
    { month: 'May', count: 12 },
    { month: 'Jun', count: totalBookings + 2 }, // Link to current state
    { month: 'Jul', count: totalBookings + 5 },
  ];

  // Weekly bookings: Mon, Tue, Wed, Thu, Fri, Sat, Sun
  const weeklyData = [
    { day: 'Mon', count: 1 },
    { day: 'Tue', count: 0 },
    { day: 'Wed', count: 3 },
    { day: 'Thu', count: 4 },
    { day: 'Fri', count: bookings.filter(b => b.status === 'Approved').length + 2 },
    { day: 'Sat', count: 8 },
    { day: 'Sun', count: 5 },
  ];

  const maxMonthly = Math.max(...monthlyData.map(d => d.count), 1);
  const maxWeekly = Math.max(...weeklyData.map(d => d.count), 1);

  // 3. Filtered Audit Logs
  const filteredLogs = auditLogs.filter(log => 
    log.user.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.role.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="space-y-6" id="analytics-module">
      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">TOTAL BOOKINGS</span>
            <h4 className="text-2xl font-display font-bold text-stone-100 mt-1">{totalBookings}</h4>
            <span className="text-[9px] text-emerald-500 font-mono mt-0.5 flex items-center gap-0.5">
              <TrendingUp size={10} /> +18% this month
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-800/80 flex items-center justify-center text-amber-500">
            <Calendar size={18} />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">ACTIVE SESSIONS</span>
            <h4 className="text-2xl font-display font-bold text-amber-400 mt-1">{activeBookings}</h4>
            <span className="text-[9px] text-stone-400 font-mono mt-0.5">Editing or Review status</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-800/80 flex items-center justify-center text-stone-300">
            <Activity size={18} />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">SECURE STORAGE</span>
            <h4 className="text-2xl font-display font-bold text-stone-100 mt-1">{usedStorageGB} GB</h4>
            <span className="text-[9px] text-amber-500 font-mono mt-0.5">
              {storagePercentage}% of {totalStorageGB}GB quota
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-800/80 flex items-center justify-center text-amber-500">
            <Cloud size={18} />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">POPULARITY</span>
            <h4 className="text-sm font-display font-bold text-stone-200 mt-2 truncate max-w-[140px]" title={primaryCategory}>
              {primaryCategory}
            </h4>
            <span className="text-[9px] text-stone-400 font-mono mt-0.5">Primary Studio Driver</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-800/80 flex items-center justify-center text-stone-300">
            <Award size={18} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Monthly Booking trends */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-display font-semibold text-stone-200">Monthly Bookings Trend</h3>
              <p className="text-[10px] text-stone-500">Studio activity overview last 6 months</p>
            </div>
            <BarChart3 className="text-stone-500" size={16} />
          </div>

          {/* SVG Custom Responsive Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-4 pt-4 px-2 bg-stone-950/40 rounded-xl border border-stone-800/40">
            {monthlyData.map((d, index) => {
              const heightPct = (d.count / maxMonthly) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center group h-full justify-end">
                  {/* Tooltip on hover */}
                  <span className="text-[9px] font-mono text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 bg-stone-900 px-1 rounded">
                    {d.count}
                  </span>
                  
                  {/* Animated Bar */}
                  <div className="w-full relative bg-stone-800/50 hover:bg-stone-700/50 rounded-t h-full flex items-end">
                    <motion.div
                      className="w-full bg-gradient-to-t from-stone-800 to-amber-500 rounded-t"
                      style={{ height: `${heightPct}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Label */}
                  <span className="text-[10px] font-mono text-stone-400 mt-2 py-1">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Studio storage details */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-display font-semibold text-stone-200">Vault Health & Quota</h3>
            <p className="text-[10px] text-stone-500">Secure storage allocation metrics</p>
          </div>

          <div className="py-6 flex flex-col items-center relative">
            {/* Circular Gauge */}
            <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
              <circle cx="60" cy="60" r="50" fill="transparent" stroke="#1c1917" strokeWidth="8" />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
                stroke="#d97706" /* amber-600 */
                strokeWidth="8"
                strokeDasharray="314"
                initial={{ strokeDashoffset: 314 }}
                animate={{ strokeDashoffset: 314 - (314 * storagePercentage) / 100 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
              <span className="text-xl font-mono font-bold text-stone-100">{storagePercentage}%</span>
              <span className="text-[9px] font-mono text-stone-500 uppercase">Vault Full</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-mono text-stone-400">
              <span>RAW Master files:</span>
              <span className="text-stone-300">112.5 GB</span>
            </div>
            <div className="flex justify-between font-mono text-stone-400">
              <span>Client JPG Proofs:</span>
              <span className="text-stone-300">12.4 GB</span>
            </div>
            <div className="flex justify-between font-mono text-stone-400 border-t border-stone-800 pt-1">
              <span>Remaining Quota:</span>
              <span className="text-amber-500 font-semibold">{totalStorageGB - usedStorageGB} GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security System Audit Trail Logs */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5" id="audit-trail-sec">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-display font-semibold text-stone-200 flex items-center gap-1.5">
              <ShieldAlert size={15} className="text-amber-500" />
              System Audit Trails
            </h3>
            <p className="text-[10px] text-stone-500">Verifiable logging of administrator, staff, and client actions</p>
          </div>

          {/* Search Logs */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 text-stone-500" size={13} />
            <input
              type="text"
              placeholder="Search logs..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="bg-stone-950/80 border border-stone-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 w-full md:w-56 font-mono"
            />
          </div>
        </div>

        {/* Logs List Table */}
        <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-950/50 max-h-64 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-stone-900 text-stone-400 border-b border-stone-800">
                <th className="p-2.5 pl-4 font-semibold uppercase tracking-wider text-[10px]">OPERATOR</th>
                <th className="p-2.5 font-semibold uppercase tracking-wider text-[10px]">ROLE</th>
                <th className="p-2.5 font-semibold uppercase tracking-wider text-[10px]">ACTION SECURITY TRAIL</th>
                <th className="p-2.5 pr-4 font-semibold uppercase tracking-wider text-[10px] text-right">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-900/40 text-stone-300">
                    <td className="p-2.5 pl-4 font-semibold">{log.user}</td>
                    <td className="p-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] border font-bold ${
                        log.role === 'admin' 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                          : log.role === 'staff' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {log.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-2.5 text-stone-400">{log.action}</td>
                    <td className="p-2.5 pr-4 text-right text-stone-500">{log.date} @ {log.time}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-stone-500 italic">No corresponding logs discovered in this search filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
