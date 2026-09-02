import React, { useState } from 'react';
import { ArrowLeft, FolderCheck, Check, AlertCircle, Lightbulb } from 'lucide-react';
import { ScreenId } from '../types';
import { aimeeAvatar, blissAvatar } from '../constants/avatars';

interface Props {
  expertId: 'aimee' | 'bliss';
  onNavigate: (screen: ScreenId) => void;
  onAuthorizeSuccess: (expId: 'aimee' | 'bliss') => void;
}

export const DataAuthorizationScreen: React.FC<Props> = ({
  expertId,
  onNavigate,
  onAuthorizeSuccess,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Checkbox states
  const [scopes, setScopes] = useState({
    profile: true,
    advice: true,
    weight: true,
    questionnaire: true,
    bloodPressure: true,
    activity: true,
    medicalRecord: true,
  });

  const expertInfo = {
    aimee: {
      name: 'Aimee(艾咪) 血壓衛教助理',
      bgClass: 'bg-teal-500',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      avatarImg: aimeeAvatar,
      itemsList: '個人檔案、體重燈、問卷燈、血壓、活動量、筆記',
      lightBoxItems: ['體重燈', '問卷燈'],
    },
    bliss: {
      name: 'Bliss(比莉) 血壓衛教助理',
      bgClass: 'bg-rose-500',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      avatarImg: blissAvatar,
      itemsList: '個人檔案、體重燈、血壓、活動量、就醫紀錄、血糖',
      lightBoxItems: ['體重燈', '血壓'],
    },
  }[expertId];

  const handleToggle = (key: keyof typeof scopes) => {
    setScopes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveAndConsent = () => {
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    setShowConfirmModal(false);
    onAuthorizeSuccess(expertId);
    onNavigate('SCR-04');
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col justify-between select-none relative">
      {/* Top Header Bar */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => onNavigate('SCR-04')}
          className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 font-black text-slate-800 text-sm">
          <FolderCheck className="w-4 h-4 text-slate-500" />
          <span>分享健康數據給專家</span>
        </div>

        <div className="w-9" />
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto max-w-md mx-auto w-full pb-24">
        {/* Nurse Avatar & Info */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-md border-4 border-white bg-slate-100">
            <img src={expertInfo.avatarImg} alt={expertInfo.name} className="w-full h-full object-cover" />
          </div>

          <h2 className="text-lg font-black text-slate-900 tracking-tight">{expertInfo.name}</h2>

          <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            成功關注專家！
          </span>

          <p className="text-xs text-slate-500 leading-relaxed px-2">
            同意專家瀏覽您的資料，給予您實質的健康照顧，您可以隨時取消分享健康數據。（其他健康資料會陸續開放分享）
          </p>
        </div>

        {/* Authorization Scope Checkbox List */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-4 text-xs">
          {/* 1. 個人檔案 */}
          <div className="space-y-1 pb-2 border-b border-slate-100">
            <label
              onClick={() => handleToggle('profile')}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <span className="text-slate-400">👤</span>
                <span>個人檔案</span>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  scopes.profile ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {scopes.profile && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </label>
            <p className="text-[11px] text-slate-400 leading-normal pl-6">
              請注意，您將分享個人檔案，包含出生年月日、身分證字號等個人機敏資訊，請再次做確認。
            </p>
          </div>

          {/* 2. 專家建議 */}
          <div className="pb-2 border-b border-slate-100">
            <label
              onClick={() => handleToggle('advice')}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>專家建議</span>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  scopes.advice ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {scopes.advice && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </label>
          </div>

          {/* Lightbox hint box */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 leading-relaxed">
            當出現「您尚未開啟」的健康燈項目，在您同意授權專家時系統將一併幫您開啟
          </div>

          {/* 3. 體重燈 */}
          <div className="pb-2 border-b border-slate-100">
            <label
              onClick={() => handleToggle('weight')}
              className="flex items-center justify-between cursor-pointer group"
            >
              <span className="font-bold text-slate-800 text-sm pl-1">體重燈</span>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  scopes.weight ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {scopes.weight && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </label>
          </div>

          {/* 4. 問卷燈 / 血壓 */}
          <div className="pb-1">
            <label
              onClick={() => handleToggle('questionnaire')}
              className="flex items-center justify-between cursor-pointer group"
            >
              <span className="font-bold text-slate-800 text-sm pl-1">
                {expertId === 'aimee' ? '問卷燈' : '血壓'}
              </span>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  scopes.questionnaire
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {scopes.questionnaire && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Action Buttons */}
      <div className="p-4 bg-white border-t border-slate-200 sticky bottom-0 left-0 right-0 z-20 flex items-center gap-3 shadow-lg">
        <button
          onClick={() => onNavigate('SCR-04')}
          className="flex-1 py-3 border border-orange-500 text-orange-600 font-bold text-sm rounded-full hover:bg-orange-50 transition-colors cursor-pointer text-center"
        >
          取消
        </button>
        <button
          onClick={handleSaveAndConsent}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-full shadow-md shadow-orange-500/20 transition-all cursor-pointer text-center active:scale-98"
        >
          儲存並同意
        </button>
      </div>

      {/* Confirmation Modal ("確認授權" Popup matching screenshots) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-amber-600 tracking-tight">確認授權</h3>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>再次確認是否</p>
              <p className="font-bold text-slate-900">
                授權分享健康數據給 {expertInfo.name}
              </p>
              <div className="pt-1">
                <span className="text-amber-600 font-bold block mb-1">健康服務：</span>
                <p className="text-slate-700 bg-amber-50 p-2 rounded-xl border border-amber-200/60 font-medium">
                  {expertInfo.itemsList}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 border border-orange-500 text-orange-600 font-bold text-xs rounded-full hover:bg-orange-50 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleFinalConfirm}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-full shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                儲存授權
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
