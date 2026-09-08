import React from 'react';
import { X } from 'lucide-react';
import { MOCK_RECOGNIZED_LAB_ITEMS } from './mockLabRecognitionData';

interface MockAIResultSheetProps {
  onClose: () => void;
  onRescan: () => void;
  onConfirmAdd: () => void;
}

export const MockAIResultSheet: React.FC<MockAIResultSheetProps> = ({
  onClose,
  onRescan,
  onConfirmAdd,
}) => {
  // Items matching S__42344457_0
  const recognizedItems = MOCK_RECOGNIZED_LAB_ITEMS;
  return (
    <div className="absolute inset-0 z-50 bg-black/45 backdrop-blur-xs flex flex-col justify-end select-none animate-in fade-in duration-200">
      {/* Dimmed background tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Sheet Container (Matches S__42344457_0) */}
      <div className="bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[82%] overflow-hidden animate-in slide-in-from-bottom duration-250 border-t border-gray-100">
        {/* Header */}
        <div className="pt-4 pb-3 px-6 text-center border-b border-gray-100 relative shrink-0">
          <h2 className="text-base font-black text-gray-900 tracking-tight">AI 辨識結果</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-3.5 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recognized List (Scrollable) */}
        <div className="overflow-y-auto px-5 py-2 divide-y divide-gray-100 no-scrollbar flex-1">
          {recognizedItems.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between">
              {/* Item Name */}
              <span className="text-sm font-extrabold text-gray-800 tracking-tight pr-2">
                {item.name}
              </span>

              {/* Value Input Box & Unit */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-16 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-sm font-bold text-gray-600 shadow-2xs">
                  {item.value}
                </div>
                <span className="text-xs text-gray-600 font-bold w-12 text-right">
                  {item.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions Bar (Matches S__42344457_0) */}
        <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between shrink-0 shadow-lg">
          {/* Left: Recognized Count */}
          <div className="text-sm font-extrabold text-[#F26522]">
            辨識 <span className="text-base font-black">{recognizedItems.length}</span>項
          </div>

          {/* Right: Rescan & Add Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRescan}
              className="text-sm font-black text-[#F26522] hover:opacity-80 px-2 py-1 transition-opacity cursor-pointer"
            >
              重新辨識
            </button>

            <button
              onClick={onConfirmAdd}
              className="bg-[#F26522] hover:bg-[#d95517] active:scale-95 text-white font-black text-sm px-6 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              新增
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
