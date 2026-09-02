import React, { useState } from 'react';
import { Search, MessageSquare, Plus, Check } from 'lucide-react';
import { ScreenId } from '../types';
import { BottomNavBar } from './BottomNavBar';
import { aimeeAvatar, blissAvatar } from '../constants/avatars';

interface Props {
  onNavigate: (screen: ScreenId) => void;
  onSelectExpert: (expertId: 'aimee' | 'bliss') => void;
  step1Authorized: boolean;
  authorizedExpert: 'aimee' | 'bliss' | null;
  followedExperts: string[];
  onToggleFollow: (expertId: string) => void;
}

export const Scr04ExpertList: React.FC<Props> = ({
  onNavigate,
  onSelectExpert,
  step1Authorized,
  authorizedExpert,
  followedExperts,
  onToggleFollow,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 全專家資料庫 (對應影片 IMG_8676 / Video 畫面內容)
  const allExperts = [
    {
      id: 'wa-bunny',
      name: 'Wa 邦尼人工智慧',
      type: '健康服務',
      followers: '106,412 位追蹤者',
      posts: '11,243 篇發問數',
      avatarBg: 'bg-amber-100 border-2 border-amber-300 text-amber-700',
      avatarLabel: 'AI 邦尼',
      avatarEmoji: '🤖',
      isSelectable: false,
    },
    {
      id: 'all-silver',
      name: '全銀運動',
      type: '健康服務',
      followers: '26,270 位追蹤者',
      posts: '28,087 篇發問數',
      avatarBg: 'bg-purple-700 text-white',
      avatarLabel: '全銀 運動',
      avatarEmoji: '🏃‍♂️',
      isSelectable: false,
    },
    {
      id: 'wa-longterm',
      name: 'Wa 長照積分專業課程',
      type: '健康服務',
      followers: '26,243 位追蹤者',
      posts: '13,781 篇發問數',
      avatarBg: 'bg-amber-800 text-white',
      avatarLabel: '長照 積分',
      avatarEmoji: '📚',
      isSelectable: false,
    },
    {
      id: 'star-children',
      name: '守護星兒愛無限',
      type: '健康服務',
      followers: '9,441 位追蹤者',
      posts: '8,172 篇發問數',
      avatarBg: 'bg-amber-200 text-amber-900',
      avatarLabel: '守護 星兒',
      avatarEmoji: '🌟',
      isSelectable: false,
    },
    {
      id: 'hypertension-assoc',
      name: '社團法人台灣高血壓學會',
      type: '法人機構',
      followers: '2,556 位追蹤者',
      posts: '1,108 篇發問數',
      avatarBg: 'bg-rose-100 border border-rose-200 text-rose-600',
      avatarLabel: '高血壓',
      avatarEmoji: '❤️',
      isSelectable: false,
    },
    {
      id: 'aimee',
      name: 'Aimee(艾咪) 血壓衛教助理',
      type: '健康服務',
      followers: '4,242 位追蹤者',
      posts: '730 篇發問數',
      avatarBg: 'bg-teal-500 text-white',
      avatarLabel: 'Aimee',
      avatarEmoji: '👩‍⚕️',
      avatarImg: aimeeAvatar,
      isSelectable: true,
      expertId: 'aimee' as const,
    },
    {
      id: 'bliss',
      name: 'Bliss(比莉) 血壓衛教助理',
      type: '健康服務',
      followers: '4,363 位追蹤者',
      posts: '224 篇發問數',
      avatarBg: 'bg-rose-500 text-white',
      avatarLabel: 'Bliss',
      avatarEmoji: '🩺',
      avatarImg: blissAvatar,
      isSelectable: true,
      expertId: 'bliss' as const,
    },
  ];

  // 判斷專家是否被追蹤 (包括活動頁授權與預設追蹤)
  const isExpertFollowed = (expId: string) => {
    if (followedExperts.includes(expId)) return true;
    if (step1Authorized && authorizedExpert === expId) return true;
    return false;
  };

  // 搜尋與篩選邏輯：
  // 1. 若無輸入搜尋詞：預設只顯示已追蹤的專家 (預設自動追蹤 Wa 邦尼人工智慧)
  // 2. 若輸入搜尋詞：搜尋所有專家
  const displayedExperts = allExperts.filter((exp) => {
    if (searchTerm.trim() !== '') {
      return exp.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    // 未搜尋時，只顯示已追蹤的專家
    return isExpertFollowed(exp.id);
  });

  return (
    <div className="min-h-full bg-slate-100 flex flex-col justify-between select-none relative">
      {/* Top Header Bar (Matching Video: 專家名單 Title) */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200/80 sticky top-0 z-20 shadow-2xs">
        <div className="text-center relative mb-3">
          <h1 className="text-base font-black text-slate-800">專家名單</h1>
        </div>

        {/* Search Bar (Matching Video: 搜尋更多專家) */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋更多專家"
            className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-full text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 text-slate-800"
          />
        </div>
      </div>

      {/* Expert List Content */}
      <div className="flex-1 p-3.5 space-y-2.5 overflow-y-auto">
        {searchTerm.trim() === '' && (
          <div className="px-1 flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
            <span>已追蹤之專家 ({displayedExperts.length})</span>
            <span className="text-[10px] font-normal text-slate-400">輸入關鍵字可搜尋更多專家</span>
          </div>
        )}

        {displayedExperts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-slate-400 space-y-2 my-4 border border-slate-200/60">
            <p className="text-sm font-bold text-slate-600">查無此專家</p>
            <p className="text-xs">請嘗試搜尋其他關鍵字，或搜尋您想關注的專家！</p>
          </div>
        ) : (
          displayedExperts.map((exp) => {
            const followed = isExpertFollowed(exp.id);
            const isAuthorized = step1Authorized && authorizedExpert === exp.id;

            return (
              <div
                key={exp.id}
                onClick={() => {
                  if (exp.isSelectable && exp.expertId) {
                    onSelectExpert(exp.expertId);
                  }
                }}
                className={`bg-white rounded-2xl p-3.5 border transition-all shadow-2xs hover:shadow-xs flex items-center justify-between gap-3 ${
                  isAuthorized ? 'border-emerald-300 ring-1 ring-emerald-300/50' : 'border-slate-200/80'
                } ${exp.isSelectable ? 'cursor-pointer' : ''}`}
              >
                {/* Left: Avatar Circle */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {exp.avatarImg ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                      <img src={exp.avatarImg} alt={exp.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full ${exp.avatarBg} shrink-0 flex flex-col items-center justify-center text-center p-1 leading-none shadow-2xs relative`}
                    >
                      <span className="text-xs font-black tracking-tighter leading-tight">
                        {exp.avatarLabel}
                      </span>
                      <span className="text-[10px] mt-0.5">{exp.avatarEmoji}</span>
                    </div>
                  )}

                  {/* Middle: Expert Name, Type Badge, and Stats */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 text-sm truncate">{exp.name}</h3>
                      {isAuthorized && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.2 rounded-full shrink-0">
                          已授權
                        </span>
                      )}
                    </div>

                    <div className="mt-0.5">
                      <span className="text-[10px] text-slate-500 bg-slate-100 font-bold px-1.5 py-0.5 rounded-xs inline-block">
                        {exp.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-1">
                      <span>{exp.followers}</span>
                      <span className="text-sky-600 font-bold">{exp.posts}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Action Button (Matching Video: 訊息 Button) */}
                <div className="shrink-0 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {followed ? (
                    <button
                      onClick={() => onNavigate('MESSAGES')}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-2xs flex items-center gap-1 active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>訊息</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleFollow(exp.id)}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>追蹤</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Shared Bottom Navigation Bar */}
      <BottomNavBar activeTab="expert" onNavigate={onNavigate} />
    </div>
  );
};
