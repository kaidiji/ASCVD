import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Send, Gift, ChevronRight, MoreVertical, HeartPulse } from 'lucide-react';
import { ScreenId } from '../types';
import { BottomNavBar } from './BottomNavBar';
import { aimeeAvatar, blissAvatar } from '../constants/avatars';

interface Props {
  onNavigate: (screen: ScreenId) => void;
  followedExperts?: string[];
  step1Authorized?: boolean;
  authorizedExpert?: 'aimee' | 'bliss' | null;
}

interface ChatChannel {
  id: string;
  name: string;
  category: 'expert' | 'service' | 'friend';
  avatarBg: string;
  avatarText: string;
  avatarSubtext?: string;
  avatarType: 'nurse_bliss' | 'nurse_aimee' | 'badge_purple' | 'badge_gold' | 'badge_brown' | 'badge_red' | 'badge_ai' | 'friend_user';
  preview: string;
  time: string;
  timeColor?: string;
  hasUnreadDot?: boolean;
}

export const WaCareMessages: React.FC<Props> = ({
  onNavigate,
  followedExperts = ['wa-bunny'],
  step1Authorized = false,
  authorizedExpert = null,
}) => {
  // Start with selectedChat null so user visits the Message Center list first!
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'experts' | 'friends'>('all');
  const [chatInput, setChatInput] = useState('');
  const [messagesMap, setMessagesMap] = useState<Record<string, Array<{ id: string; sender: string; text?: string; type?: string; time: string }>>>({
    wabunny: [
      {
        id: '1',
        sender: 'wabunny',
        text: '量血壓是個好習慣，請記得養成定期記錄血壓的規律生活喔！',
        time: '07/23 10:15',
      },
      {
        id: '2',
        sender: 'wabunny',
        text: '親愛的會員您好！我是 Wa 邦尼 AI 衛教助手，很高興為您服務！如您有任何健康照護、血壓趨勢或衛教問題，歡迎隨時在此發問諮詢。',
        time: '07/23 10:16',
      },
    ],
    bliss: [
      {
        id: 'b1',
        sender: 'expert',
        text: '早安安!!^^ 來量血壓呦!!^^',
        time: '上午 09:00',
      },
      {
        id: 'b2',
        sender: 'expert',
        text: '記得每天早晚量血壓，養成習慣可協助我們更精準為您的健康把關喔！',
        time: '上午 09:01',
      },
    ],
    aimee: [
      {
        id: 'a1',
        sender: 'expert',
        text: '記得每天早晚各量一次血壓喔～',
        time: '上午 07:30',
      },
      {
        id: 'a2',
        sender: 'expert',
        text: '我是艾咪，若有任何血壓與衛教相關問題，隨時留言給我喔！',
        time: '上午 07:31',
      },
    ],
    sports: [
      {
        id: 's1',
        sender: 'expert',
        text: '🚨 你知道嗎？台灣 50 歲以上，每兩人就有一人有高血壓風險！適度運動配合血壓追蹤最有效。',
        time: '下午 04:00',
      },
    ],
    star_children: [
      {
        id: 'sc1',
        sender: 'expert',
        text: '低張力是什麼？歡迎關注星兒照護與心血管健康衛教知識。',
        time: '昨天',
      },
    ],
    longterm_care: [
      {
        id: 'lc1',
        sender: 'expert',
        text: '還有缺長照積分或是護理積分嗎？快來參加最新的線上護理課程！',
        time: '07/24',
      },
    ],
    hypertension: [
      {
        id: 'h1',
        sender: 'expert',
        text: '社團法人台灣高血壓學會提醒您：養成「722」血壓量測原則（連續7天、早晚各2次、每次量2遍取平均）。',
        time: '07/24',
      },
    ],
    friend_1: [
      {
        id: 'f1',
        sender: 'friend',
        text: '嗨～今天早上的血壓記錄了嗎？記得天天關注自己的血壓變化喔！',
        time: '07/25',
      },
    ],
  });

  // 判斷專家是否為已追蹤專家
  const isExpertFollowed = (channelId: string) => {
    if (channelId === 'wabunny' || channelId === 'wa-bunny') return true; // Wa 邦尼 人工智慧 預設追蹤 (1)
    if (followedExperts.includes(channelId)) return true;
    if (channelId === 'bliss' && (followedExperts.includes('bliss') || (step1Authorized && authorizedExpert === 'bliss'))) return true;
    if (channelId === 'aimee' && (followedExperts.includes('aimee') || (step1Authorized && authorizedExpert === 'aimee'))) return true;
    if (channelId === 'sports' && (followedExperts.includes('sports') || followedExperts.includes('all-silver'))) return true;
    if (channelId === 'star_children' && (followedExperts.includes('star_children') || followedExperts.includes('star-children'))) return true;
    if (channelId === 'longterm_care' && (followedExperts.includes('longterm_care') || followedExperts.includes('wa-longterm'))) return true;
    if (channelId === 'hypertension' && (followedExperts.includes('hypertension') || followedExperts.includes('hypertension-assoc'))) return true;
    return false;
  };

  // 對齊全專家資料庫 (對應 Scr04ExpertList 的專家與 WaCare 頻道)
  const channelList: ChatChannel[] = [
    {
      id: 'bliss',
      name: 'Bliss(比莉) 血壓衛教助理',
      category: 'expert',
      avatarBg: 'bg-rose-100',
      avatarText: 'Bliss',
      avatarType: 'nurse_bliss',
      preview: '早安安!!^^ 來量血壓呦!!^^',
      time: '上午 09:00',
      timeColor: 'text-orange-500 font-bold',
      hasUnreadDot: true,
    },
    {
      id: 'aimee',
      name: 'Aimee(艾咪) 血壓衛教助理',
      category: 'expert',
      avatarBg: 'bg-indigo-100',
      avatarText: 'Aimee',
      avatarType: 'nurse_aimee',
      preview: '記得每天早晚各量一次血壓喔～',
      time: '上午 07:30',
      timeColor: 'text-orange-500 font-bold',
      hasUnreadDot: true,
    },
    {
      id: 'sports',
      name: '全銀運動',
      category: 'service',
      avatarBg: 'bg-slate-700',
      avatarText: '全銀運動',
      avatarSubtext: 'WaCare',
      avatarType: 'badge_purple',
      preview: '🚨 你知道嗎？台灣 50 歲以上，...',
      time: '下午 04:00',
      timeColor: 'text-orange-500 font-bold',
      hasUnreadDot: true,
    },
    {
      id: 'star_children',
      name: '守護星兒愛無限',
      category: 'service',
      avatarBg: 'bg-amber-600',
      avatarText: '守護星兒',
      avatarSubtext: 'WaCare',
      avatarType: 'badge_gold',
      preview: '低張力是什麼？',
      time: '昨天',
      timeColor: 'text-orange-500 font-bold',
      hasUnreadDot: true,
    },
    {
      id: 'longterm_care',
      name: 'Wa 長照積分專業課程',
      category: 'service',
      avatarBg: 'bg-amber-800',
      avatarText: '長照積分',
      avatarSubtext: 'WaCare',
      avatarType: 'badge_brown',
      preview: '還有缺長照積分或是護理積分嗎？...',
      time: '07/24',
      timeColor: 'text-slate-400',
      hasUnreadDot: false,
    },
    {
      id: 'hypertension',
      name: '社團法人台灣高血壓學會',
      category: 'service',
      avatarBg: 'bg-red-700',
      avatarText: '高血壓學會',
      avatarSubtext: 'WaCare',
      avatarType: 'badge_red',
      preview: '社團法人台灣高血壓學會提醒您：養成 722 血壓原則...',
      time: '07/24',
      timeColor: 'text-orange-500 font-bold',
      hasUnreadDot: true,
    },
    {
      id: 'wabunny',
      name: 'Wa 邦尼 人工智慧',
      category: 'expert',
      avatarBg: 'bg-sky-100',
      avatarText: 'Wa邦尼',
      avatarSubtext: '24hr服務',
      avatarType: 'badge_ai',
      preview: '量血壓是個好習慣，請記得在血壓...',
      time: '07/23',
      timeColor: 'text-slate-400',
      hasUnreadDot: false,
    },
    {
      id: 'friend_1',
      name: '林小華',
      category: 'friend',
      avatarBg: 'bg-teal-100',
      avatarText: '華',
      avatarType: 'friend_user',
      preview: '嗨～今天早上的血壓記錄了嗎？...',
      time: '07/25',
      timeColor: 'text-slate-400',
      hasUnreadDot: false,
    },
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedChat) return;
    const newMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput,
      time: '剛剛',
    };
    
    setMessagesMap((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg],
    }));
    setChatInput('');

    const targetChat = selectedChat;
            setTimeout(() => {
      setMessagesMap((prev) => ({
        ...prev,
        [targetChat]: [
          ...(prev[targetChat] || []),
          {
            id: (Date.now() + 1).toString(),
            sender: 'expert',
            text: '好的！如果有任何血壓量測或健康相關問題，歡迎隨時在訊息中諮詢！',
            time: '剛剛',
          },
        ],
      }));
    }, 600);
  };

  const renderAvatar = (channel: ChatChannel) => {
    return (
      <div className="relative shrink-0">
        {/* Main Circle Avatar */}
        {channel.avatarType === 'nurse_bliss' && (
          <div className="w-12 h-12 rounded-full overflow-hidden border border-rose-200 shadow-xs bg-rose-50">
            <img src={blissAvatar} alt="Bliss" className="w-full h-full object-cover" />
          </div>
        )}

        {channel.avatarType === 'nurse_aimee' && (
          <div className="w-12 h-12 rounded-full overflow-hidden border border-purple-200 shadow-xs bg-purple-50">
            <img src={aimeeAvatar} alt="Aimee" className="w-full h-full object-cover" />
          </div>
        )}

        {channel.avatarType === 'badge_purple' && (
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-900 to-purple-900 text-white flex flex-col items-center justify-center p-1 text-center shadow-xs">
            <span className="text-[10px] font-black leading-tight tracking-tighter">全銀運動</span>
            <span className="text-[8px] opacity-80 scale-90">WaCare</span>
          </div>
        )}

        {channel.avatarType === 'badge_gold' && (
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-500 to-yellow-600 text-white flex flex-col items-center justify-center p-1 text-center shadow-xs">
            <span className="text-[10px] font-black leading-tight tracking-tighter">守護星兒</span>
            <span className="text-[8px] opacity-80 scale-90">WaCare</span>
          </div>
        )}

        {channel.avatarType === 'badge_brown' && (
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-800 to-amber-950 text-white flex flex-col items-center justify-center p-1 text-center shadow-xs">
            <span className="text-[10px] font-black leading-tight tracking-tighter">長照積分</span>
            <span className="text-[8px] opacity-80 scale-90">WaCare</span>
          </div>
        )}

        {channel.avatarType === 'badge_red' && (
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-red-600 to-rose-700 text-white flex flex-col items-center justify-center p-1 text-center shadow-xs">
            <span className="text-[9px] font-black leading-tight tracking-tighter">高血壓學會</span>
            <span className="text-[7px] opacity-80 scale-90">WaCare</span>
          </div>
        )}

        {channel.avatarType === 'badge_ai' && (
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-sky-100 via-teal-50 to-orange-100 border border-sky-200 text-slate-800 flex flex-col items-center justify-center p-1 text-center shadow-xs">
            <span className="text-[8px] font-bold text-sky-700 leading-none">AI人工智慧</span>
            <span className="text-[10px] font-black text-orange-600 leading-tight">Wa邦尼</span>
            <span className="text-[7px] text-slate-500 leading-none">24hr服務</span>
          </div>
        )}

        {channel.avatarType === 'friend_user' && (
          <div className="w-12 h-12 rounded-full bg-teal-100 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-base shadow-xs">
            {channel.avatarText}
          </div>
        )}

        {/* Bottom Left Orange Smiley Badge Overlay (WaCare signature branding) */}
        {channel.avatarType !== 'friend_user' && (
          <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-orange-500 text-white border-2 border-white flex items-center justify-center shadow-xs">
            <span className="text-[10px] leading-none">😊</span>
          </div>
        )}
      </div>
    );
  };

  const followedExpertsChannels = channelList.filter(
    (channel) => (channel.category === 'expert' || channel.category === 'service') && isExpertFollowed(channel.id)
  );

  const displayedChannels = channelList.filter((channel) => {
    // 專家或機構頻道：僅顯示使用者實際已追蹤者
    if (channel.category === 'expert' || channel.category === 'service') {
      if (!isExpertFollowed(channel.id)) return false;
    }

    if (activeSubTab === 'experts') return channel.category === 'expert' || channel.category === 'service';
    if (activeSubTab === 'friends') return channel.category === 'friend';
    return true; // 'all' (只呈現有追蹤的專家及朋友)
  });

  const totalUnreadCount = displayedChannels.filter((c) => c.hasUnreadDot).length;

  const activeChannel = channelList.find((c) => c.id === selectedChat);
  const currentMessages = selectedChat ? messagesMap[selectedChat] || messagesMap['wabunny'] : [];

  return (
    <div className="min-h-full bg-white flex flex-col justify-between select-none relative">
      {/* 1. CHAT MESSAGE CENTER LIST VIEW (Main View) */}
      {selectedChat === null && (
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          {/* Header Bar */}
          <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
            <div className="w-6" /> {/* Spacer */}
            <h1 className="text-base font-bold text-slate-900 tracking-tight text-center">
              聊天訊息
            </h1>
            <button
              disabled
              className="p-1 text-slate-400 cursor-not-allowed opacity-50"
              title="更多（不可點擊）"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-Tabs Bar (全部 / 專家 / 朋友) */}
          <div className="flex items-center border-b border-slate-200 text-sm font-medium bg-white">
            <button
              onClick={() => setActiveSubTab('all')}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer relative ${
                activeSubTab === 'all'
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              全部
              {activeSubTab === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('experts')}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer relative ${
                activeSubTab === 'experts'
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              專家 ({followedExpertsChannels.length})
              {activeSubTab === 'experts' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('friends')}
              className={`flex-1 py-2.5 text-center transition-colors cursor-pointer relative ${
                activeSubTab === 'friends'
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              朋友
              {activeSubTab === 'friends' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Channel Chat List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {displayedChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => setSelectedChat(channel.id)}
                className="px-4 py-3.5 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors active:bg-slate-100"
              >
                {renderAvatar(channel)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h2 className="text-sm font-bold text-slate-900 truncate">
                      {channel.name}
                    </h2>
                    <span className={`text-[11px] shrink-0 ${channel.timeColor || 'text-slate-400'}`}>
                      {channel.time}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 truncate leading-snug">
                    {channel.preview}
                  </p>
                </div>

                {/* Unread indicator orange dot */}
                {channel.hasUnreadDot && (
                  <span className="w-2.5 h-2.5 bg-orange-500 rounded-full shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CHAT CONVERSATION DETAIL VIEW */}
      {selectedChat !== null && (
        <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
          {/* Chat Top Header */}
          <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
                title="返回聊天訊息"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-1">
                    {activeChannel?.name || 'Wa 邦尼 人工智慧'}
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  </h3>
                  <p className="text-[10px] text-slate-400">WaCare 線上健康服務</p>
                </div>
              </div>
            </div>

            <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-2.5 py-1 rounded-full">
              線上諮詢
            </span>
          </div>

          {/* Chat Messages Thread Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {currentMessages.map((m) => {
              if (m.sender === 'user') {
                return (
                  <div key={m.id} className="flex justify-end">
                    <div className="bg-orange-500 text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-[80%] shadow-xs font-medium">
                      {m.text}
                    </div>
                  </div>
                );
              }

              return (
                <div key={m.id} className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    🐰
                  </div>
                  <div className="bg-white text-slate-800 p-3 rounded-2xl rounded-tl-none text-xs max-w-[80%] shadow-2xs border border-slate-100 leading-relaxed font-medium">
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <div className="bg-white p-3 border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`輸入訊息詢問 ${activeChannel?.name || 'Wa邦尼'}...`}
              className="flex-1 bg-slate-100 border-none px-4 py-2.5 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
            />
            <button
              onClick={handleSendMessage}
              className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Shared Bottom Navigation Bar */}
      <BottomNavBar activeTab="message" onNavigate={onNavigate} unreadCount={totalUnreadCount} />
    </div>
  );
};

