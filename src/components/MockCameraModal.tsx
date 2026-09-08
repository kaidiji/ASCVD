import React, { useState } from 'react';
import { X, RefreshCw, ZapOff } from 'lucide-react';

interface MockCameraModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export const MockCameraModal: React.FC<MockCameraModalProps> = ({ onClose, onConfirm }) => {
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [zoomLevel, setZoomLevel] = useState('1x');

  return (
    <div className="absolute inset-0 z-50 bg-black text-white flex flex-col justify-between select-none overflow-hidden animate-in fade-in duration-200">
      {/* Top Bar: Camera Indicator & Flash */}
      <div className="pt-2 px-6 pb-2 flex items-center justify-between text-xs text-white/80 shrink-0 z-20">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-white/60">相機已啟用</span>
        </div>
        <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white/90">
          <ZapOff className="w-4 h-4" />
        </button>
      </div>

      {/* Main Camera Viewfinder Frame */}
      <div className="flex-1 relative flex items-center justify-center bg-zinc-950 overflow-hidden mx-2 rounded-2xl border border-white/10 shadow-inner">
        {/* Realistic Laptop Screen with Lab Report (Matches S__42344453_0 & S__42344454_0) */}
        <div className="w-full h-full relative flex flex-col justify-center items-center bg-[#0d1117] p-2">
          {/* Laptop Browser Header */}
          <div className="w-full max-w-[340px] bg-[#1f242c] rounded-t-md px-2 py-1 flex items-center gap-1.5 text-[9px] text-zinc-300 border-b border-zinc-700">
            <span className="truncate">C:/Users/WaCare/Desktop/健檢報告/健檢結果報告(去識別化).pdf</span>
          </div>

          {/* Report Paper Surface */}
          <div className="w-full max-w-[340px] bg-[#FAF8F5] text-zinc-900 rounded-b-md shadow-2xl p-2.5 font-mono text-[9px] leading-tight border border-zinc-400/50">
            {/* Report Header */}
            <div className="border-b border-zinc-400 pb-1 mb-1.5 flex justify-between items-center text-[10px] font-bold">
              <span className="text-zinc-800">高雄小港職醫 健檢結果報告</span>
              <span className="text-zinc-500 text-[8px]">1 / 2 頁</span>
            </div>

            {/* General Checkup Row */}
            <div className="bg-orange-50/70 p-1 rounded border border-orange-200/60 mb-1.5 grid grid-cols-3 gap-1 text-[8.5px]">
              <div><span className="text-zinc-500">身高:</span> <b className="text-zinc-900">158.1</b> cm</div>
              <div><span className="text-zinc-500">體重:</span> <b className="text-zinc-900">66.3</b> kg</div>
              <div><span className="text-zinc-500">腰圍:</span> <b className="text-zinc-900">95</b> cm</div>
              <div><span className="text-zinc-500">收縮壓:</span> <b className="text-red-600 font-black">*151</b></div>
              <div><span className="text-zinc-500">舒張壓:</span> <b className="text-zinc-900">76</b></div>
              <div><span className="text-zinc-500">心律:</span> <b className="text-zinc-900">94</b> bpm</div>
            </div>

            {/* Blood Biochemistry & Lipid Check Table */}
            <div className="space-y-0.5 text-[8px]">
              <div className="text-[8.5px] font-black text-blue-900 bg-blue-50/60 px-1 py-0.5 rounded">血液生化學檢查 / 血脂肪</div>
              <div className="grid grid-cols-12 py-0.5 border-b border-zinc-200 text-zinc-700 font-sans">
                <span className="col-span-6 font-bold text-zinc-800">飯前血糖 Glu(Ac)</span>
                <span className="col-span-3 text-red-600 font-black text-right">*103.0</span>
                <span className="col-span-3 text-zinc-400 text-right">mg/dL</span>
              </div>
              <div className="grid grid-cols-12 py-0.5 border-b border-zinc-200 text-zinc-700 font-sans">
                <span className="col-span-6 font-bold text-zinc-800">總膽固醇 T-cholesterol</span>
                <span className="col-span-3 text-zinc-900 font-black text-right">178.0</span>
                <span className="col-span-3 text-zinc-400 text-right">mg/dL</span>
              </div>
              <div className="grid grid-cols-12 py-0.5 border-b border-zinc-200 text-zinc-700 font-sans">
                <span className="col-span-6 font-bold text-zinc-800">高密度脂蛋白 HDL-C</span>
                <span className="col-span-3 text-zinc-900 font-black text-right">56.0</span>
                <span className="col-span-3 text-zinc-400 text-right">mg/dL</span>
              </div>
              <div className="grid grid-cols-12 py-0.5 border-b border-zinc-200 text-zinc-700 font-sans">
                <span className="col-span-6 font-bold text-zinc-800">低密度脂蛋白 LDL-C</span>
                <span className="col-span-3 text-zinc-900 font-black text-right">112.0</span>
                <span className="col-span-3 text-zinc-400 text-right">mg/dL</span>
              </div>
              <div className="grid grid-cols-12 py-0.5 border-b border-zinc-200 text-zinc-700 font-sans">
                <span className="col-span-6 font-bold text-zinc-800">三酸甘油脂 TG</span>
                <span className="col-span-3 text-zinc-900 font-black text-right">122.0</span>
                <span className="col-span-3 text-zinc-400 text-right">mg/dL</span>
              </div>
              <div className="grid grid-cols-12 py-0.5 border-b border-zinc-200 text-zinc-700 font-sans">
                <span className="col-span-6 font-bold text-zinc-800">肌酸酐 CRTN</span>
                <span className="col-span-3 text-red-600 font-black text-right">*1.31</span>
                <span className="col-span-3 text-zinc-400 text-right">mg/dL</span>
              </div>
              <div className="grid grid-cols-12 py-0.5 text-zinc-700 font-sans">
                <span className="col-span-6 font-bold text-zinc-800">丙酮轉移脢 GPT</span>
                <span className="col-span-3 text-zinc-900 font-black text-right">16.0</span>
                <span className="col-span-3 text-zinc-400 text-right">IU/L</span>
              </div>
            </div>
          </div>

          {/* Laptop Keyboard Edge (Simulating photo from S__42344453_0) */}
          <div className="w-full max-w-[340px] mt-1.5 bg-zinc-800/90 rounded-md p-1 border border-zinc-700/80 flex items-center justify-center opacity-80">
            <span className="text-[8px] font-sans tracking-widest text-zinc-400 font-bold">ASUS Vivobook</span>
          </div>
        </div>

        {/* Viewfinder Target Reticle Lines (Active when not captured) */}
        {!photoCaptured && (
          <div className="absolute inset-6 border border-white/25 rounded-xl pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <div className="w-4 h-4 border-t-2 border-l-2 border-[#F26522]" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-[#F26522]" />
            </div>
            <div className="flex justify-between">
              <div className="w-4 h-4 border-b-2 border-l-2 border-[#F26522]" />
              <div className="w-4 h-4 border-b-2 border-r-2 border-[#F26522]" />
            </div>
          </div>
        )}
      </div>

      {/* Camera Controls Area */}
      {!photoCaptured ? (
        /* S__42344453_0: Live Camera Controls */
        <div className="px-6 py-4 flex flex-col items-center gap-3 shrink-0 bg-black">
          {/* Zoom Buttons: .5, 1x, 2, 3 */}
          <div className="flex items-center gap-4 bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 text-xs">
            {['.5', '1x', '2', '3'].map((zoom) => (
              <button
                key={zoom}
                onClick={() => setZoomLevel(zoom)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer font-bold ${
                  zoomLevel === zoom
                    ? 'bg-white text-black scale-105 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {zoom}
              </button>
            ))}
          </div>

          {/* Shutter & Cancel Row */}
          <div className="w-full flex items-center justify-between pt-1">
            {/* Close / Cancel */}
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700 active:scale-95 flex items-center justify-center text-white cursor-pointer transition-all"
            >
              <X className="w-6 h-6 stroke-[2.2]" />
            </button>

            {/* Big White Shutter Button */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => setPhotoCaptured(true)}
                className="w-18 h-18 rounded-full border-4 border-white p-1 flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-lg hover:border-orange-400 group"
              >
                <div className="w-full h-full rounded-full bg-white group-hover:bg-orange-50 transition-colors" />
              </button>
              <span className="text-[11px] text-white/90 font-bold tracking-wider">拍照</span>
            </div>

            {/* Lens Switch Icon */}
            <button className="w-12 h-12 rounded-full bg-zinc-800/80 hover:bg-zinc-700 active:scale-95 flex items-center justify-center text-white cursor-pointer transition-all">
              <RefreshCw className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      ) : (
        /* S__42344454_0: Photo Confirmation Controls */
        <div className="px-6 py-5 flex items-center justify-between shrink-0 bg-black border-t border-zinc-800">
          <button
            onClick={() => setPhotoCaptured(false)}
            className="text-white text-base font-bold hover:text-orange-400 active:scale-95 transition-all cursor-pointer px-2 py-2"
          >
            重新拍攝
          </button>

          <button
            onClick={onConfirm}
            className="text-white text-base font-black hover:text-orange-400 active:scale-95 transition-all cursor-pointer px-2 py-2"
          >
            使用照片
          </button>
        </div>
      )}
    </div>
  );
};
