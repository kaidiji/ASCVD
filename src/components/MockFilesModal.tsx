import React, { useState } from 'react';
import { X, Search, Mic, MoreHorizontal, Clock, Users, Folder, Check, FileText } from 'lucide-react';

interface MockFilesModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const MockFilesModal: React.FC<MockFilesModalProps> = ({ onClose, onConfirm }) => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>('file-1');

  return (
    <div className="absolute inset-0 z-50 bg-[#F2F2F7] text-gray-900 flex flex-col justify-between select-none overflow-hidden animate-in slide-in-from-bottom duration-250">
      {/* 1. iOS Files Header */}
      <div className="pt-3 px-4 pb-2 bg-[#F2F2F7] shrink-0">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-sm font-bold text-[#007AFF] hover:opacity-80 transition-opacity cursor-pointer"
          >
            取消
          </button>

          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-700 shadow-xs border border-gray-200/60">
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {selectedFileId && (
              <button
                onClick={onConfirm}
                className="bg-[#007AFF] text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-xs hover:bg-blue-600 active:scale-95 transition-all cursor-pointer"
              >
                選擇
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-gray-900 mt-2 tracking-tight">最近項目</h1>

        {/* Search Bar (iOS Style) */}
        <div className="mt-2 bg-[#E3E3E8] rounded-xl px-3 py-2 flex items-center gap-2 text-gray-500 text-sm">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-gray-400 text-sm flex-1">搜尋</span>
          <Mic className="w-4 h-4 text-gray-400 shrink-0" />
        </div>
      </div>

      {/* 2. File Grid (Strictly 1~2 Lab Report Files, clean & minimal) */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="grid grid-cols-2 gap-4">
          {/* File 1: 健檢結果報告 (去識別化) */}
          <div
            onClick={() => setSelectedFileId('file-1')}
            className={`group relative flex flex-col items-center p-3 rounded-2xl cursor-pointer transition-all bg-white border ${
              selectedFileId === 'file-1'
                ? 'border-[#007AFF] ring-2 ring-[#007AFF]/30 shadow-md bg-blue-50/20'
                : 'border-gray-200/70 shadow-2xs hover:border-gray-300'
            }`}
          >
            {/* File Preview Thumbnail */}
            <div className="w-24 h-32 rounded-lg bg-white shadow-xs border border-gray-200 p-2 flex flex-col justify-between overflow-hidden relative">
              <div className="border-b border-gray-200 pb-1 flex items-center justify-between">
                <span className="text-[7px] font-black text-red-600 bg-red-50 px-1 rounded">PDF</span>
                <span className="text-[6.5px] text-gray-400">去識別化</span>
              </div>

              {/* Document Mock Lines */}
              <div className="space-y-1 my-1">
                <div className="h-1.5 bg-gray-200 rounded-full w-4/5" />
                <div className="h-1.5 bg-red-100 rounded-full w-full" />
                <div className="h-1.5 bg-gray-200 rounded-full w-3/4" />
                <div className="h-1.5 bg-orange-100 rounded-full w-5/6" />
                <div className="h-1.5 bg-gray-200 rounded-full w-2/3" />
              </div>

              <div className="text-[7px] font-mono text-gray-600 border-t border-gray-100 pt-0.5">
                <div className="flex justify-between">
                  <span>血糖:</span>
                  <span className="font-bold text-red-600">103</span>
                </div>
                <div className="flex justify-between">
                  <span>膽固醇:</span>
                  <span className="font-bold text-gray-800">178</span>
                </div>
              </div>

              {/* Selection Checkmark */}
              {selectedFileId === 'file-1' && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="mt-2 text-center w-full">
              <div className="text-xs font-bold text-gray-900 leading-tight line-clamp-2">
                健檢結果報告 (去識別化)
              </div>
              <div className="text-[10.5px] text-gray-500 mt-0.5">下午 4:27</div>
              <div className="text-[10px] text-gray-400">我的 iPhone</div>
            </div>
          </div>

          {/* File 2: 健檢結果報告.pdf */}
          <div
            onClick={() => setSelectedFileId('file-2')}
            className={`group relative flex flex-col items-center p-3 rounded-2xl cursor-pointer transition-all bg-white border ${
              selectedFileId === 'file-2'
                ? 'border-[#007AFF] ring-2 ring-[#007AFF]/30 shadow-md bg-blue-50/20'
                : 'border-gray-200/70 shadow-2xs hover:border-gray-300'
            }`}
          >
            {/* File Preview Thumbnail */}
            <div className="w-24 h-32 rounded-lg bg-white shadow-xs border border-gray-200 p-2 flex flex-col justify-between overflow-hidden relative">
              <div className="border-b border-gray-200 pb-1 flex items-center justify-between">
                <span className="text-[7px] font-black text-red-600 bg-red-50 px-1 rounded">PDF</span>
                <span className="text-[6.5px] text-gray-400">雲端備份</span>
              </div>

              {/* Document Mock Lines */}
              <div className="space-y-1 my-1">
                <div className="h-1.5 bg-blue-100 rounded-full w-3/4" />
                <div className="h-1.5 bg-gray-200 rounded-full w-full" />
                <div className="h-1.5 bg-gray-200 rounded-full w-5/6" />
                <div className="h-1.5 bg-gray-200 rounded-full w-2/3" />
              </div>

              <div className="text-[7px] font-mono text-gray-600 border-t border-gray-100 pt-0.5">
                <div className="flex justify-between">
                  <span>三酸甘油脂:</span>
                  <span className="font-bold text-gray-800">122</span>
                </div>
                <div className="flex justify-between">
                  <span>肌酸酐:</span>
                  <span className="font-bold text-red-600">1.31</span>
                </div>
              </div>

              {/* Selection Checkmark */}
              {selectedFileId === 'file-2' && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            {/* File Info */}
            <div className="mt-2 text-center w-full">
              <div className="text-xs font-bold text-gray-900 leading-tight line-clamp-2">
                健檢結果報告.pdf
              </div>
              <div className="text-[10.5px] text-gray-500 mt-0.5">2026/9/4</div>
              <div className="text-[10px] text-gray-400">iCloud 雲碟</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. iOS Files Bottom Floating Tab Bar */}
      <div className="px-6 py-2 bg-white/90 backdrop-blur-md border-t border-gray-200 flex items-center justify-around shrink-0 text-[10.5px] font-bold text-gray-500">
        <div className="flex flex-col items-center gap-0.5 text-[#007AFF] cursor-pointer">
          <Clock className="w-5 h-5" />
          <span>最近項目</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 hover:text-gray-900 cursor-pointer">
          <Users className="w-5 h-5" />
          <span>已共享</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 hover:text-gray-900 cursor-pointer">
          <Folder className="w-5 h-5" />
          <span>瀏覽</span>
        </div>
      </div>
    </div>
  );
};
