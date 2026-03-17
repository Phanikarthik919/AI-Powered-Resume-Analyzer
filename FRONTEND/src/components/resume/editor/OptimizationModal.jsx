import React from 'react';

const OptimizationModal = ({
  optimizationModal,
  setOptimizationModal,
  applyOptimization,
  inputClass,
  primaryBtn,
  secondaryBtn
}) => {
  if (!optimizationModal.show) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 px-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-[#e8e8ed] transform animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#0066cc]/10 rounded-full flex items-center justify-center text-xl">✨</div>
          <h3 className="text-xl font-semibold text-[#1d1d1f]">AI Suggestion</h3>
        </div>

        <div className="mb-6">
          <p className="text-xs font-bold text-[#0066cc] uppercase tracking-widest mb-2">Why this is better:</p>
          <div className="bg-[#f5f5f7] p-4 rounded-xl text-sm text-[#1d1d1f] leading-relaxed italic border-l-4 border-[#0066cc]">
            "{optimizationModal.justification}"
          </div>
        </div>

        <div className="mb-8">
          <p className="text-xs font-bold text-[#6e6e73] uppercase tracking-widest mb-2">Refined Content:</p>
          <textarea
            readOnly
            className={`${inputClass} h-64 resize-none leading-relaxed p-5 bg-white border-2 border-[#0066cc]/20 font-medium`}
            value={optimizationModal.content}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setOptimizationModal({ ...optimizationModal, show: false })}
            className={`${secondaryBtn} flex-1 py-4 font-semibold text-[#1d1d1f] border-[#d2d2d7] hover:bg-[#f5f5f7]`}
          >
            Keep Original
          </button>
          <button
            onClick={applyOptimization}
            className={`${primaryBtn} flex-1 py-4 font-semibold shadow-lg shadow-[#0066cc]/20`}
          >
            Apply AI Suggestion
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimizationModal;
