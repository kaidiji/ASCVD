import React, { useState } from 'react';
import { X, ChevronDown, Check, Camera, FileSpreadsheet, FileText } from 'lucide-react';

interface MockGalleryModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const MockGalleryModal: React.FC<MockGalleryModalProps> = ({ onClose, onConfirm }) => {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    if (selectedPhotoId === id) {
      setSelectedPhotoId(null);
    } else {
      setSelectedPhotoId(id);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-white text-gray-900 flex flex-col justify-between select-none overflow-hidden animate-in slide-in-from-bottom duration-250">
      {/* 1. iOS Photos Top Navigation Bar */}
      <div className="pt-3 px-4 pb-3 flex items-center justify-between border-b border-gray-100 bg-white shrink-0">
        {/* Left: Close X */}
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Center: Album Name Dropdown */}
        <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
          <span className="text-base font-extrabold text-gray-900 tracking-tight">最近項目</span>
          <ChevronDown className="w-4 h-4 text-gray-700" />
        </div>

        {/* Right: Select Action Button */}
        {selectedPhotoId ? (
          <button
            onClick={onConfirm}
            className="text-sm font-black text-[#007AFF] hover:opacity-80 px-2 py-1 rounded transition-opacity cursor-pointer"
          >
            選擇 (1)
          </button>
        ) : (
          <span className="text-sm font-bold text-gray-400 px-2 py-1">完成</span>
        )}
      </div>

      {/* 2. Simplified Photos Grid - Strictly 2 Lab Report Images */}
      <div className="flex-1 overflow-y-auto p-3 bg-gray-50/50">
        <div className="mb-2 text-xs text-gray-500 font-bold px-1">請選取欲辨識的健檢報告：</div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Item 1: 1788510375909 - Laptop Screen Lab Report */}
          <div
            onClick={() => toggleSelect('report-laptop')}
            className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all border-2 bg-slate-900 shadow-sm ${
              selectedPhotoId === 'report-laptop'
                ? 'border-[#007AFF] ring-2 ring-[#007AFF]/40 scale-[0.98]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Visual simulation of Laptop with PDF report */}
            <div className="w-full h-full p-2 flex flex-col justify-between bg-gradient-to-b from-[#111827] to-[#1e293b] text-white">
              <div className="flex items-center justify-between text-[8px] border-b border-gray-700 pb-1">
                <span className="text-zinc-400 truncate">健檢結果報告(去識別化).pdf</span>
                <span className="text-orange-400 font-bold">100%</span>
              </div>

              {/* Table preview lines */}
              <div className="bg-white/95 rounded p-1 text-[7.5px] text-zinc-900 font-mono space-y-0.5 shadow-inner">
                <div className="flex justify-between font-bold text-[8px] text-blue-900 border-b border-gray-200 pb-0.5">
                  <span>血液生化學檢查</span>
                  <span className="text-red-600">*103.0</span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>總膽固醇 T-CHOL</span>
                  <span>178.0</span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>三酸甘油脂 TG</span>
                  <span>122.0</span>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>肌酸酐 CRTN</span>
                  <span className="text-red-600">*1.31</span>
                </div>
              </div>

              <div className="text-[7.5px] text-center text-zinc-500 font-bold">ASUS Vivobook 拍攝</div>
            </div>

            {/* Selection Checkmark Badge */}
            {selectedPhotoId === 'report-laptop' && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-md animate-in zoom-in-75">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              健檢報告相片
            </div>
          </div>

          {/* Item 2: Paper Scanned Lab Report */}
          <div
            onClick={() => toggleSelect('report-scanned')}
            className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all border-2 bg-white shadow-sm ${
              selectedPhotoId === 'report-scanned'
                ? 'border-[#007AFF] ring-2 ring-[#007AFF]/40 scale-[0.98]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Visual simulation of Paper Document */}
            <div className="w-full h-full p-2.5 flex flex-col justify-between bg-zinc-50 border border-zinc-100">
              <div className="flex items-center gap-1.5 text-zinc-700">
                <FileText className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="text-[8.5px] font-black truncate">健康檢查總結報告表</span>
              </div>

              <div className="bg-white rounded border border-zinc-200 p-1.5 space-y-1 text-[7.5px] text-zinc-600 font-sans shadow-xs">
                <div className="flex justify-between">
                  <span>受檢項目:</span>
                  <span className="font-bold text-zinc-800">一般檢查+抽血</span>
                </div>
                <div className="flex justify-between">
                  <span>飯前血糖:</span>
                  <span className="font-bold text-red-600">103 mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span>總膽固醇:</span>
                  <span className="font-bold text-zinc-800">178 mg/dL</span>
                </div>
              </div>

              <div className="text-[7.5px] text-zinc-400 text-right">紙本清晰掃描件</div>
            </div>

            {/* Selection Checkmark Badge */}
            {selectedPhotoId === 'report-scanned' && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-md animate-in zoom-in-75">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              健檢紙本掃描
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Photos Bar */}
      <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>已選擇 {selectedPhotoId ? '1' : '0'} 張照片</span>
        <button
          disabled={!selectedPhotoId}
          onClick={onConfirm}
          className={`px-4 py-2 rounded-lg font-black text-sm transition-all ${
            selectedPhotoId
              ? 'bg-[#007AFF] text-white hover:bg-blue-600 active:scale-95 cursor-pointer shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          使用選取照片
        </button>
      </div>
    </div>
  );
};
