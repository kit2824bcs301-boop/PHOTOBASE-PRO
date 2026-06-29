/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, AlertTriangle, AlertCircle, Image as ImageIcon, FolderPlus, Compass, ArrowRight, RefreshCw } from 'lucide-react';
import { Photo } from '../types';

interface AIAssistantWidgetProps {
  photos: Photo[];
  onApplyCoverSuggestion?: (photoId: string) => void;
  onApplyBestQualitySuggestion?: (photoId: string) => void;
  onClearDuplicates?: () => void;
  onOrganizeAlbums?: () => void;
}

export default function AIAssistantWidget({
  photos,
  onApplyCoverSuggestion,
  onApplyBestQualitySuggestion,
  onClearDuplicates,
  onOrganizeAlbums,
}: AIAssistantWidgetProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'summary' | 'blurry' | 'duplicates' | 'albums'>('summary');

  // Business calculations based on current photos
  const blurryPhotos = photos.filter(p => p.isBlurry);
  const duplicates = photos.filter(p => p.isDuplicate);
  const bestQualityPhotos = [...photos]
    .filter(p => !p.isBlurry && p.extension !== 'RAW')
    .sort((a, b) => a.blurScore - b.blurScore); // lowest score = crispest quality
  
  const recommendedCover = bestQualityPhotos[0];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const organizeAlbumsSimulate = () => {
    if (onOrganizeAlbums) {
      onOrganizeAlbums();
    }
  };

  return (
    <div className="bg-stone-900/80 backdrop-blur-md border border-stone-800 rounded-2xl p-6" id="ai-assistant-widget">
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/10">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-display font-semibold text-stone-100 flex items-center gap-1.5">
              AI Smart Assistant
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">Active</span>
            </h3>
            <p className="text-xs text-stone-400">Automated photo audit & smart curation</p>
          </div>
        </div>

        {scanComplete && (
          <button 
            onClick={handleStartScan}
            className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-stone-200 transition-colors flex items-center gap-1 text-xs font-mono"
            title="Re-scan directory"
          >
            <RefreshCw size={13} className={isScanning ? 'animate-spin' : ''} />
            RE-AUDIT
          </button>
        )}
      </div>

      {!scanComplete && !isScanning ? (
        // Start State
        <div className="text-center py-6 border border-dashed border-stone-800 rounded-xl bg-stone-950/30">
          <ImageIcon size={32} className="mx-auto text-stone-600 mb-3" />
          <h4 className="text-sm font-medium text-stone-300">Unanalyzed Directory</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4 px-4">
            Audit this folder for blurriness index, duplicate files, cover nominations, and automated category groupings.
          </p>
          <button
            onClick={handleStartScan}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-medium rounded-xl text-xs transition-all shadow-md shadow-amber-500/15 font-display"
          >
            <Sparkles size={14} />
            Scan Gallery ({photos.length} files)
          </button>
        </div>
      ) : isScanning ? (
        // Scanning State
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin" />
            <Sparkles size={24} className="text-amber-500 animate-pulse" />
          </div>
          <span className="text-xs text-stone-400 font-mono tracking-wider">RUNNING PHOTO AUDIT... {scanProgress}%</span>
          <p className="text-[10px] text-stone-500 font-mono mt-1.5">Analyzing focus depth, metadata, and hash structures</p>
        </div>
      ) : (
        // Results State
        <div className="space-y-4">
          {/* Quick tab filters */}
          <div className="flex bg-stone-950/80 p-1 rounded-xl border border-stone-800/80 text-xs">
            {(['summary', 'blurry', 'duplicates', 'albums'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-1 py-1.5 rounded-lg text-center font-medium capitalize transition-all ${
                  selectedTab === tab
                    ? 'bg-stone-800 text-amber-400 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content screens */}
          <AnimatePresence mode="wait">
            {selectedTab === 'summary' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-3"
              >
                {/* 1. Cover Recommendation */}
                {recommendedCover ? (
                  <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-3">
                    <img 
                      src={recommendedCover.url} 
                      alt="Recommended cover" 
                      className="w-12 h-12 rounded-lg object-cover border border-amber-500/20 shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-mono bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 font-bold tracking-wider">
                        ★ SMART COVER NOMINATION
                      </span>
                      <h4 className="text-xs font-semibold text-stone-200 mt-1.5 truncate">{recommendedCover.filename}</h4>
                      <p className="text-[10px] text-stone-400 leading-tight">
                        Crispest focus depth index detected (Blur score: {recommendedCover.blurScore}/100). Outstanding composition.
                      </p>
                    </div>
                    {onApplyCoverSuggestion && (
                      <button
                        onClick={() => {
                          onApplyCoverSuggestion(recommendedCover.id);
                        }}
                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 font-semibold rounded-lg text-[10px] transition-colors font-display self-center flex items-center gap-1"
                      >
                        Set Cover
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-stone-400 text-xs">No suitable cover photo recommendation.</div>
                )}

                {/* 2. Quick stats list */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800/60">
                    <span className="text-[10px] font-mono text-stone-500 block">BLUR INDEX</span>
                    <span className={`text-sm font-bold block mt-1 ${blurryPhotos.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {blurryPhotos.length} Flagged
                    </span>
                  </div>
                  <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800/60">
                    <span className="text-[10px] font-mono text-stone-500 block">DUPLICATES</span>
                    <span className={`text-sm font-bold block mt-1 ${duplicates.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {duplicates.length} Found
                    </span>
                  </div>
                  <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800/60">
                    <span className="text-[10px] font-mono text-stone-500 block">BEST QUALITY</span>
                    <span className="text-sm font-bold text-amber-400 block mt-1">
                      {bestQualityPhotos.length} Gold Proofs
                    </span>
                  </div>
                </div>

                {/* 3. Automatic Albumpack organize trigger */}
                <div className="flex items-center justify-between p-3 bg-stone-950 border border-stone-800/60 rounded-xl">
                  <div className="flex items-center gap-2">
                    <FolderPlus className="text-stone-400" size={16} />
                    <div className="text-left">
                      <h4 className="text-xs font-semibold text-stone-300">Automated Organizers</h4>
                      <p className="text-[10px] text-stone-500">Group by capture timestamp & focus types</p>
                    </div>
                  </div>
                  <button
                    onClick={organizeAlbumsSimulate}
                    className="p-1 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-stone-100 rounded-lg text-[10px] font-mono border border-stone-700/50 transition-colors flex items-center gap-1"
                  >
                    ORGANIZE <ArrowRight size={10} />
                  </button>
                </div>
              </motion.div>
            )}

            {selectedTab === 'blurry' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-stone-400">BLUR INDEX (LIMIT: THRESHOLD SCORE &gt; 70)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                    {blurryPhotos.length} FILE(S) FAILED
                  </span>
                </div>

                {blurryPhotos.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {blurryPhotos.map((photo) => (
                      <div key={photo.id} className="p-2 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={photo.url} alt="blurry thumbnail" className="w-8 h-8 rounded object-cover border border-stone-800" />
                          <div className="min-w-0">
                            <h5 className="text-[11px] font-semibold text-stone-300 truncate max-w-[160px]">{photo.filename}</h5>
                            <span className="text-[9px] font-mono text-stone-500">Hash Code: {photo.id}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-[10px] text-rose-400 font-mono font-bold block">Score {photo.blurScore}%</span>
                            <span className="text-[8px] text-stone-500 font-mono">Camera Shake</span>
                          </div>
                          <div className="p-1 rounded bg-rose-500/10 text-rose-500">
                            <AlertCircle size={12} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-stone-950 border border-stone-800 rounded-xl">
                    <Check className="text-emerald-500 mx-auto mb-1" size={20} />
                    <p className="text-[11px] text-stone-300">All proofs met the crisp focus target Index.</p>
                  </div>
                )}
              </motion.div>
            )}

            {selectedTab === 'duplicates' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-stone-400">DUPLICATE HASH DETECTION</span>
                  {duplicates.length > 0 && onClearDuplicates && (
                    <button
                      onClick={onClearDuplicates}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-mono font-semibold"
                    >
                      CLEAR DUPLICATES
                    </button>
                  )}
                </div>

                {duplicates.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {duplicates.map((photo) => (
                      <div key={photo.id} className="p-2 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={photo.url} alt="duplicate thumbnail" className="w-8 h-8 rounded object-cover border border-stone-800" />
                          <div className="min-w-0">
                            <h5 className="text-[11px] font-semibold text-stone-300 truncate max-w-[160px]">{photo.filename}</h5>
                            <span className="text-[9px] font-mono text-stone-500">Match found elsewhere</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono uppercase font-semibold">
                            Identical Hash
                          </span>
                          <div className="p-1 rounded bg-amber-500/10 text-amber-500">
                            <AlertTriangle size={12} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-stone-950 border border-stone-800 rounded-xl">
                    <Check className="text-emerald-500 mx-auto mb-1" size={20} />
                    <p className="text-[11px] text-stone-300">No duplicate file hashes detected in this path.</p>
                  </div>
                )}
              </motion.div>
            )}

            {selectedTab === 'albums' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-2.5 text-xs text-stone-300"
              >
                <span className="text-xs font-mono text-stone-400 block mb-1">AUTOMATED SUB-ALBUMS REC</span>
                
                <div className="space-y-2 text-stone-300">
                  <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold">Cluster 1: Ceremony Highlights</h5>
                      <p className="text-[10px] text-stone-500">Based on timestamp range 14:02 - 14:33</p>
                    </div>
                    <span className="font-mono text-[10px] text-amber-400 font-bold">5 photos recommended</span>
                  </div>

                  <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold">Cluster 2: Portrait Studio Lighting</h5>
                      <p className="text-[10px] text-stone-500">Based on color saturation and aperture data</p>
                    </div>
                    <span className="font-mono text-[10px] text-amber-400 font-bold">4 photos recommended</span>
                  </div>
                </div>

                <button
                  onClick={organizeAlbumsSimulate}
                  className="w-full mt-2 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-center font-semibold text-xs border border-stone-700/50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FolderPlus size={14} /> Commit AI Album Re-organization
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
