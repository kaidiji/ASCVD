import React, { useState, useEffect } from 'react';
import { Images } from 'lucide-react';

interface MockAIScanningModalProps {
  onComplete: () => void;
}

export const MockAIScanningModal: React.FC<MockAIScanningModalProps> = ({ onComplete }) => {
  // Phase 1 (S__42344455_0) -> Phase 2 (S__42344456_0)
  const [phase, setPhase] = useState<1 | 2>(1);

  useEffect(() => {
    // Switch from Phase 1 (gray) to Phase 2 (orange scanner) at 1000ms
    const timer1 = setTimeout(() => {
      setPhase(2);
    }, 1100);

    // Complete scan at 2400ms
    const timer2 = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-6 select-none animate-in fade-in duration-200">
      {/* Centered Modal Card (Matches S__42344455_0 & S__42344456_0) */}
      <div className="w-full max-w-[310px] bg-white rounded-3xl p-7 flex flex-col items-center shadow-2xl border border-gray-100 transition-all duration-300 transform scale-100">
        {/* Top Accent Orange Bar */}
        <div className="w-16 h-1.5 bg-[#F26522] rounded-full mb-6" />

        {/* Dynamic Image / Scanner Icon */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-5">
          {phase === 1 ? (
            /* Phase 1: S__42344455_0 (Neutral Gray Image Outline) */
            <div className="relative text-gray-400 animate-in fade-in">
              <Images className="w-20 h-20 stroke-[1.4]" />
            </div>
          ) : (
            /* Phase 2: S__42344456_0 (Vibrant Orange Active AI Scanning) */
            <div className="relative text-[#F26522] animate-in zoom-in-95 duration-300">
              <Images className="w-20 h-20 stroke-[1.8] text-[#F26522]" />

              {/* Animated Glowing Laser Scanning Beam */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#F26522] to-transparent animate-bounce opacity-80" />
              <div className="absolute -inset-1 rounded-2xl bg-orange-400/15 blur-sm -z-10 animate-pulse" />
            </div>
          )}
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">
          處理中...
        </h3>
        <p className="text-xs text-gray-500 font-bold tracking-wide text-center">
          AI影像辨識中，請耐心等候
        </p>
      </div>
    </div>
  );
};
