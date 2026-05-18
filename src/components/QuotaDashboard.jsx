import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quotaTracker } from '../utils/quotaTracker';
import { FiActivity, FiX, FiAlertTriangle } from 'react-icons/fi';

const QuotaDashboard = () => {
  const [usage, setUsage] = useState(quotaTracker.getUsage());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Update usage every time the dashboard is opened
    if (isOpen) {
      setUsage(quotaTracker.getUsage());
    }
  }, [isOpen]);

  const percentage = (usage.total / usage.dailyLimit) * 100;
  const isHighUsage = percentage > 80;

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl z-[200] transition-all ${
          isHighUsage ? 'bg-red-600 animate-pulse' : 'bg-amber-500'
        } text-white hover:scale-110`}
        title="API Quota Monitor"
      >
        <FiActivity size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[300] flex items-end justify-end p-6 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="w-full max-w-md glass-dark rounded-3xl p-6 pointer-events-auto border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isHighUsage ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                    <FiActivity size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Quota Monitor</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-white/40">
                  <span>Usage Status</span>
                  <span className={isHighUsage ? 'text-red-500' : 'text-amber-500'}>
                    {usage.total} / {usage.dailyLimit} units
                  </span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    className={`h-full ${isHighUsage ? 'bg-red-600' : 'bg-amber-500'} shadow-[0_0_15px_rgba(245,158,11,0.5)]`}
                  />
                </div>
                {isHighUsage && (
                  <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold mt-2 uppercase">
                    <FiAlertTriangle size={12} />
                    Critical Quota Limit Reached
                  </div>
                )}
              </div>

              {/* Endpoint Breakdown */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-2">Endpoint Consumption</h4>
                <div className="max-h-48 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                  {Object.entries(usage.endpoints).sort((a, b) => b[1] - a[1]).map(([endpoint, cost]) => (
                    <div key={endpoint} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-xs text-white/70 font-medium truncate max-w-[200px]">{endpoint}</span>
                      <span className="text-xs font-bold text-white">{cost} pts</span>
                    </div>
                  ))}
                  {Object.keys(usage.endpoints).length === 0 && (
                    <div className="text-center py-6 text-white/20 text-xs italic">
                      No API calls tracked yet.
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => { quotaTracker.reset(); setUsage(quotaTracker.getUsage()); }}
                className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all"
              >
                Reset Counter
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuotaDashboard;
