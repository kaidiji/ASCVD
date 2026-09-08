import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  MoreVertical,
  Camera,
  X,
  Activity,
  Smile,
  CheckCircle2,
  Droplets,
  Gauge,
  Footprints,
  Wind,
  FileText,
  UserCheck
} from 'lucide-react';
import { ScreenId, UserProfile } from '../types';
import { BottomNavBar } from './BottomNavBar';
import { BloodPressureDetailScreen } from './heartCare/BloodPressureDetailScreen';
import { OxygenDetailScreen } from './heartCare/OxygenDetailScreen';
import { WeightDetailScreen } from './heartCare/WeightDetailScreen';
import { RespiratoryRateDetailScreen } from './heartCare/RespiratoryRateDetailScreen';
import { TemperatureDetailScreen } from './heartCare/TemperatureDetailScreen';
import { RiskPredictionDetailScreen, SavedPreventRecord } from './heartCare/RiskPredictionDetailScreen';
import { HeartCareState, INITIAL_HEART_CARE_STATE } from './heartCare/heartCareData';
import { DEFAULT_OLD_LAB_RECORD, LabDataHomeScreen, LabRecord } from './LabDataHomeScreen';

interface Props {
  onNavigate: (screen: ScreenId) => void;
  nickname?: string;
  userProfile?: UserProfile;
}

const WheelColumn: React.FC<{
  options: number[];
  value: number;
  onChange: (val: number) => void;
  unit: string;
}> = ({ options, value, onChange, unit }) => {
  const currentIndex = options.indexOf(value) !== -1 ? options.indexOf(value) : 0;
  const visibleOffsets = [-3, -2, -1, 0, 1, 2, 3];

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY > 0) {
      if (currentIndex < options.length - 1) {
        onChange(options[currentIndex + 1]);
      }
    } else if (e.deltaY < 0) {
      if (currentIndex > 0) {
        onChange(options[currentIndex - 1]);
      }
    }
  };

  return (
    <div
      onWheel={handleWheel}
      className="flex flex-col items-center justify-center relative h-[210px] overflow-hidden select-none"
    >
      {visibleOffsets.map((offset) => {
        const itemIndex = currentIndex + offset;
        const exists = itemIndex >= 0 && itemIndex < options.length;
        const itemVal = exists ? options[itemIndex] : null;

        let opacityClass = 'opacity-0 pointer-events-none';
        let textScaleClass = 'text-xs font-normal';
        let textColorClass = 'text-slate-300';

        if (offset === 0) {
          opacityClass = 'opacity-100';
          textScaleClass = 'text-[1.25rem] font-bold';
          textColorClass = 'text-slate-900';
        } else if (Math.abs(offset) === 1) {
          opacityClass = 'opacity-80';
          textScaleClass = 'text-[1rem] font-medium';
          textColorClass = 'text-slate-500';
        } else if (Math.abs(offset) === 2) {
          opacityClass = 'opacity-50';
          textScaleClass = 'text-sm font-normal';
          textColorClass = 'text-slate-400';
        } else if (Math.abs(offset) === 3) {
          opacityClass = 'opacity-25';
          textScaleClass = 'text-xs font-normal';
          textColorClass = 'text-slate-300';
        }

        return (
          <div
            key={offset}
            onClick={() => {
              if (itemVal !== null) {
                onChange(itemVal);
              }
            }}
            className={`h-[30px] flex items-center justify-center w-full transition-all duration-150 cursor-pointer ${textColorClass} ${textScaleClass} ${opacityClass}`}
          >
            {itemVal !== null ? `${itemVal}${unit}` : ''}
          </div>
        );
      })}
    </div>
  );
};

export const HealthDataScreen: React.FC<Props> = ({ onNavigate, nickname = '陳小明', userProfile }) => {
  const [activeTab, setActiveTab] = useState<'my' | 'family'>('my');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Date picker wheel state
  const [tempYear, setTempYear] = useState<number>(currentDate.getFullYear());
  const [tempMonth, setTempMonth] = useState<number>(currentDate.getMonth() + 1);
  const [tempDay, setTempDay] = useState<number>(currentDate.getDate());

  const handleOpenDatePicker = () => {
    setTempYear(currentDate.getFullYear());
    setTempMonth(currentDate.getMonth() + 1);
    setTempDay(currentDate.getDate());
    setShowDatePicker(true);
  };

  // Wheel picker arrays
  const years = Array.from({ length: 11 }, (_, i) => 2021 + i); // 2021 to 2031
  const months = Array.from({ length: 12 }, (_, i) => 1 + i);
  const maxDaysInTempMonth = new Date(tempYear, tempMonth, 0).getDate();
  const days = Array.from({ length: maxDaysInTempMonth }, (_, i) => 1 + i);
  const [showBloodPressureScreen, setShowBloodPressureScreen] = useState(false);
  const [showOxygenScreen, setShowOxygenScreen] = useState(false);
  const [showWeightScreen, setShowWeightScreen] = useState(false);
  const [showRespiratoryRateScreen, setShowRespiratoryRateScreen] = useState(false);
  const [showTemperatureScreen, setShowTemperatureScreen] = useState(false);
  const [showRiskPredictionScreen, setShowRiskPredictionScreen] = useState(false);
  const [showLabDataScreen, setShowLabDataScreen] = useState(false);
  const [labRecords, setLabRecords] = useState<LabRecord[]>(() => [{ ...DEFAULT_OLD_LAB_RECORD, data: { ...DEFAULT_OLD_LAB_RECORD.data } }]);
  // DEMO ONLY：由健康數據父層暫存，讓使用者往返子頁時紀錄不消失；重新整理後仍恢復預設。
  const [riskPredictionRecords, setRiskPredictionRecords] = useState<SavedPreventRecord[]>([]);
  const [heartCareState, setHeartCareState] = useState<HeartCareState>({
    ...INITIAL_HEART_CARE_STATE,
    vitals: {
      ...INITIAL_HEART_CARE_STATE.vitals,
      spO2: 95,
      heartRate: 61,
    },
  });

  // Health data states
  const [photoAdded, setPhotoAdded] = useState(false);
  const [taskPercent, setTaskPercent] = useState<number>(0);
  const [weight, setWeight] = useState<string>('92');
  const [oxygen, setOxygen] = useState<string>('95');
  const [sysBP, setSysBP] = useState<string>('120');
  const [diaBP, setDiaBP] = useState<string>('80');
  const [bloodSugar, setBloodSugar] = useState<string>('95');
  const [sugarMealState, setSugarMealState] = useState<'before' | 'after'>('before');
  const [heartRate, setHeartRate] = useState<string>('61');
  const [steps, setSteps] = useState<number>(4250);

  // Format week day: e.g. 週二
  const formatWeekDay = (date: Date) => {
    const weekDays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    return weekDays[date.getDay()];
  };

  // Format month and day: e.g. 9月02
  const formatMonthDay = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}月${day}`;
  };

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  if (showLabDataScreen) {
    return <LabDataHomeScreen onBack={() => setShowLabDataScreen(false)} records={labRecords} onRecordsChange={setLabRecords} />;
  }

  if (showBloodPressureScreen) {
    return (
      <BloodPressureDetailScreen
        onBack={() => setShowBloodPressureScreen(false)}
        nickname={nickname}
        currentVitals={heartCareState.vitals}
        onUpdateVitals={(newVitals) => {
          if (newVitals.sysBP) setSysBP(String(newVitals.sysBP));
          if (newVitals.diaBP) setDiaBP(String(newVitals.diaBP));
          if (newVitals.heartRate) setHeartRate(String(newVitals.heartRate));
          setHeartCareState((prev) => ({
            ...prev,
            vitals: {
              ...prev.vitals,
              ...newVitals,
            },
          }));
        }}
      />
    );
  }

  if (showOxygenScreen) {
    return (
      <OxygenDetailScreen
        onBack={() => setShowOxygenScreen(false)}
        nickname={nickname}
        currentVitals={heartCareState.vitals}
        onUpdateVitals={(newVitals) => {
          if (newVitals.spO2 !== undefined) setOxygen(String(newVitals.spO2));
          if (newVitals.heartRate !== undefined) setHeartRate(String(newVitals.heartRate));
          setHeartCareState((prev) => ({
            ...prev,
            vitals: {
              ...prev.vitals,
              ...newVitals,
            },
          }));
        }}
      />
    );
  }

  if (showWeightScreen) {
    return (
      <WeightDetailScreen
        onBack={() => setShowWeightScreen(false)}
        nickname={nickname}
        currentVitals={heartCareState.vitals}
        onUpdateVitals={(newVitals) => {
          if (newVitals.weight !== undefined) setWeight(String(newVitals.weight));
          setHeartCareState((prev) => ({
            ...prev,
            vitals: {
              ...prev.vitals,
              ...newVitals,
            },
          }));
        }}
      />
    );
  }

  if (showRespiratoryRateScreen) {
    return (
      <RespiratoryRateDetailScreen
        onBack={() => setShowRespiratoryRateScreen(false)}
        nickname={nickname}
        currentVitals={heartCareState.vitals}
        onUpdateVitals={(newVitals) => {
          setHeartCareState((prev) => ({
            ...prev,
            vitals: {
              ...prev.vitals,
              ...newVitals,
            },
          }));
        }}
      />
    );
  }

  if (showTemperatureScreen) {
    return (
      <TemperatureDetailScreen
        onBack={() => setShowTemperatureScreen(false)}
        nickname={nickname}
        currentVitals={heartCareState.vitals}
        onUpdateVitals={(newVitals) => {
          setHeartCareState((prev) => ({
            ...prev,
            vitals: {
              ...prev.vitals,
              ...newVitals,
            },
          }));
        }}
      />
    );
  }

  if (showRiskPredictionScreen) {
    return (
      <RiskPredictionDetailScreen
        onBack={() => setShowRiskPredictionScreen(false)}
        records={riskPredictionRecords}
        onRecordsChange={setRiskPredictionRecords}
        labRecords={labRecords}
        userProfile={userProfile}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative font-sans antialiased text-slate-900 select-none">
      {/* 1. Top Navigation Bar (AppBar) */}
      <header className="pt-2 px-3 bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between min-h-[3rem] relative">
          {/* Left: User Profile Avatar with status dot */}
          <button
            onClick={() => onNavigate('REAL-NAME')}
            className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 active:scale-95 cursor-pointer"
            title="查看個人檔案"
          >
            <div className="relative">
              <div className="w-[36px] h-[36px] rounded-full bg-orange-100 border-2 border-orange-400 flex items-center justify-center overflow-hidden">
                <span className="text-[1.125rem]">👤</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-[14px] h-[14px] bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="w-[6px] h-[6px] bg-white rounded-full"></span>
              </span>
            </div>
          </button>

          {/* Center Title: "健康數據" (Bold, 1.25rem) */}
          <h1 className="text-[1.25rem] font-black text-slate-900 tracking-tight leading-snug">
            健康數據
          </h1>

          {/* Right: Overflow Menu Icon (⋮) - Disabled per user request */}
          <button
            disabled
            className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-400 cursor-not-allowed opacity-50 rounded-full focus:outline-none"
            aria-label="更多選單（不可點擊）"
          >
            <MoreVertical className="w-[1.5rem] h-[1.5rem]" />
          </button>
        </div>

        {/* 2. Tab Segment */}
        <nav className="flex text-center mt-1 border-b border-slate-100 font-bold">
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 min-h-[48px] flex items-center justify-center text-[1rem] transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              activeTab === 'my'
                ? 'text-orange-600 font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            我的健康
            {activeTab === 'my' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('family')}
            className={`flex-1 min-h-[48px] flex items-center justify-center text-[1rem] transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              activeTab === 'family'
                ? 'text-orange-600 font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            親友健康
            {activeTab === 'family' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-600 rounded-full" />
            )}
          </button>
        </nav>
      </header>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'my' ? (
          <div>
            {/* 3. Date Selector Header (Matching image.png: centered `< 週三 9月02 ▼ >`) */}
            <div className="flex items-center justify-center py-2.5 text-slate-900 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevDay}
                  className="p-1 text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors focus:outline-none active:scale-95"
                  aria-label="前一天"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
                </button>

                <button
                  onClick={handleOpenDatePicker}
                  className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors text-slate-900 focus:outline-none active:scale-98"
                >
                  <span className="font-bold text-slate-900 text-[1.05rem]">
                    {formatWeekDay(currentDate)}
                  </span>
                  <span className="font-bold text-slate-900 text-[1.05rem]">
                    {formatMonthDay(currentDate)}
                  </span>
                  <span className="text-[0.65rem] text-slate-900 ml-0.5">▼</span>
                </button>

                <button
                  onClick={handleNextDay}
                  className="p-1 text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors focus:outline-none active:scale-95"
                  aria-label="後一天"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* 4. Scrollable Health Data List (12 Cards Inventory) */}
            <div className="divide-y divide-slate-200 text-slate-900 font-bold text-[0.9375rem]">
              
              {/* 1. 相簿 */}
              <div className="flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors">
                <span className="font-black text-slate-900 text-[1rem]">相簿</span>
                <div className="flex items-center gap-2">
                  {photoAdded && (
                    <span className="text-[0.8125rem] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      已上傳 1 張
                    </span>
                  )}
                  <button
                    onClick={() => setActiveModal('photo')}
                    className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="新增相簿"
                  >
                    <Plus className="w-[1.5rem] h-[1.5rem]" />
                  </button>
                </div>
              </div>

              {/* 2. 任務 */}
              <div className="flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-black text-slate-900 text-[1rem]">任務 {taskPercent}%</span>
                  <div className="w-[6.5rem] sm:w-[9rem] bg-slate-200 h-[0.5rem] rounded-full overflow-hidden border border-slate-300">
                    <div
                      className="bg-orange-500 h-full transition-all duration-300"
                      style={{ width: `${taskPercent}%` }}
                    />
                  </div>
                </div>
                <button
                  className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-400 rounded-full focus:outline-none"
                  aria-label="任務"
                >
                  <Plus className="w-[1.5rem] h-[1.5rem]" />
                </button>
              </div>

              {/* 3. 血氧 */}
              <div
                onClick={() => setShowOxygenScreen(true)}
                className="flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="font-black text-slate-900 text-[1rem]">血氧</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-900 text-[0.875rem] font-black">
                    {oxygen ? `${oxygen} %` : '無資料'}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[0.8125rem] font-extrabold border ${
                      oxygen
                        ? Number(oxygen) >= 95
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : Number(oxygen) >= 90
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    {oxygen
                      ? Number(oxygen) >= 95
                        ? '正常'
                        : Number(oxygen) >= 90
                        ? '留意'
                        : '緊急'
                      : '無'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOxygenScreen(true);
                    }}
                    className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="記錄血氧"
                  >
                    <Plus className="w-[1.5rem] h-[1.5rem]" />
                  </button>
                </div>
              </div>

              {/* 4. 血壓 */}
              <div
                onClick={() => setShowBloodPressureScreen(true)}
                className="flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="font-black text-slate-900 text-[1rem]">血壓</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-900 text-[0.875rem] font-black">
                    {sysBP && diaBP ? `${sysBP}/${diaBP} mmHg` : '無資料'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[0.8125rem] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    正常
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBloodPressureScreen(true);
                    }}
                    className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="記錄血壓"
                  >
                    <Plus className="w-[1.5rem] h-[1.5rem]" />
                  </button>
                </div>
              </div>

              {/* 5. 血糖 */}
              <div className="flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors">
                <span className="font-black text-slate-900 text-[1rem]">血糖</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-900 text-[0.875rem] font-black">
                    {bloodSugar} mg/dL
                  </span>
                  <span className="px-3 py-1 rounded-full text-[0.8125rem] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {sugarMealState === 'before' ? '飯前正常' : '飯後正常'}
                  </span>
                  <button
                    onClick={() => setActiveModal('blood_sugar')}
                    className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="記錄血糖"
                  >
                    <Plus className="w-[1.5rem] h-[1.5rem]" />
                  </button>
                </div>
              </div>

              {/* 7. 活動量 */}
              <div className="flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors">
                <span className="font-black text-slate-900 text-[1rem]">活動量</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-900 text-[0.875rem] font-black">
                    {steps.toLocaleString()} 步
                  </span>
                  <span className="px-3 py-1 rounded-full text-[0.8125rem] font-extrabold bg-orange-100 text-orange-800 border border-orange-300">
                    目標 {Math.round((steps / 7000) * 100)}%
                  </span>
                  <button
                    onClick={() => setActiveModal('activity')}
                    className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="記錄活動量"
                  >
                    <Plus className="w-[1.5rem] h-[1.5rem]" />
                  </button>
                </div>
              </div>

              {/* 8. 檢驗燈 */}
              <button
                type="button"
                onClick={() => setShowLabDataScreen(true)}
                className="w-full flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors text-left cursor-pointer active:scale-99 focus:outline-none focus:ring-2 focus:ring-orange-500 border-t border-slate-100"
              >
                <span className="font-black text-slate-900 text-[1rem]">檢驗燈</span>
                <span className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-500"><ChevronRight className="w-[1.5rem] h-[1.5rem]" /></span>
              </button>

              {/* 9. 體重 (MOVED) */}
              <div
                onClick={() => setShowWeightScreen(true)}
                className="flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="font-black text-slate-900 text-[1rem]">體重</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-900 text-[0.875rem] font-black">
                    {weight ? `${weight} kg` : '無資料'}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[0.8125rem] font-extrabold border ${
                      weight
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    {weight ? '輕度肥胖' : '無'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWeightScreen(true);
                    }}
                    className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="記錄體重"
                  >
                    <Plus className="w-[1.5rem] h-[1.5rem]" />
                  </button>
                </div>
              </div>

              {/* 風險預測燈 (對應 IMG_9044) */}
              <button
                onClick={() => setShowRiskPredictionScreen(true)}
                className="w-full flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors text-left cursor-pointer active:scale-99 focus:outline-none focus:ring-2 focus:ring-orange-500 border-t border-slate-100"
              >
                <span className="font-black text-slate-900 text-[1rem]">風險預測燈</span>
                <div className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-500">
                  <ChevronRight className="w-[1.5rem] h-[1.5rem]" />
                </div>
              </button>

              {/* 9. 數位社會處方燈 (MOVED) */}
              <button
                onClick={() => setActiveModal('prescription')}
                className="w-full flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors text-left cursor-pointer active:scale-99 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <span className="font-black text-slate-900 text-[1rem]">數位社會處方燈</span>
                <div className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-500">
                  <ChevronRight className="w-[1.5rem] h-[1.5rem]" />
                </div>
              </button>

              {/* 10. 空汙 */}
              <div className="flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors">
                <span className="font-black text-slate-900 text-[1rem]">空汙</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-900 text-[0.875rem] font-black">AQI 30</span>
                  <span className="px-3 py-1 rounded-full text-[0.8125rem] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    良好
                  </span>
                  <button
                    onClick={() => setActiveModal('aqi')}
                    className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="空汙詳細資訊"
                  >
                    <Plus className="w-[1.5rem] h-[1.5rem]" />
                  </button>
                </div>
              </div>

              {/* 11. 問卷燈 */}
              <div className="flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors">
                <span className="font-black text-slate-900 text-[1rem]">問卷燈</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-600 text-[0.875rem] font-bold">無資料</span>
                  <span className="px-3 py-1 rounded-full text-[0.8125rem] font-extrabold bg-slate-100 text-slate-600 border border-slate-300">
                    無
                  </span>
                  <button
                    onClick={() => setActiveModal('questionnaire')}
                    className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="填寫問卷"
                  >
                    <Plus className="w-[1.5rem] h-[1.5rem]" />
                  </button>
                </div>
              </div>

              {/* 12. 巴金森 */}
              <button
                onClick={() => setActiveModal('parkinsons')}
                className="w-full flex items-center justify-between px-4 py-3 min-h-[3.75rem] hover:bg-slate-50 transition-colors text-left cursor-pointer active:scale-99 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <span className="font-black text-slate-900 text-[1rem]">巴金森</span>
                <div className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-500">
                  <ChevronRight className="w-[1.5rem] h-[1.5rem]" />
                </div>
              </button>

            </div>
          </div>
        ) : (
          /* 親友健康 Tab */
          <div className="p-8 text-center space-y-4 text-slate-600">
            <div className="w-[4rem] h-[4rem] rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
              <Smile className="w-[2.25rem] h-[2.25rem]" />
            </div>
            <p className="text-[1.125rem] font-black text-slate-900">尚無親友授權健康數據</p>
            <p className="text-[0.875rem] text-slate-600 leading-relaxed max-w-xs mx-auto">
              點擊邀請親友分享健康量測紀錄，共同關心長輩與家人的身體狀態。
            </p>
            <button
              onClick={() => alert('已發送親友邀請連結！')}
              className="min-h-[48px] px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[1rem] rounded-2xl shadow-md cursor-pointer active:scale-95 transition-all"
            >
              + 邀請親友加入
            </button>
          </div>
        )}
      </div>

      {/* Senior-Friendly Modal Dialogs */}
      {activeModal && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-[1.125rem]">
                {activeModal === 'blood_pressure' && '新增血壓紀錄'}
                {activeModal === 'heart_rate' && '新增心率紀錄'}
                {activeModal === 'blood_sugar' && '新增血糖紀錄'}
                {activeModal === 'activity' && '新增活動量步數'}
                {activeModal === 'weight' && '新增體重紀錄'}
                {activeModal === 'oxygen' && '新增血氧紀錄'}
                {activeModal === 'photo' && '上傳照片至相簿'}
                {activeModal === 'prescription' && '數位社會處方燈'}
                {activeModal === 'aqi' && '今日空汙與環境'}
                {activeModal === 'questionnaire' && '填寫問卷燈'}
                {activeModal === 'parkinsons' && '巴金森氏症評估'}
                {activeModal === 'overflow_menu' && '健康數據功能選單'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="min-w-[48px] min-h-[48px] flex items-center justify-center text-slate-500 hover:text-slate-800 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="關閉"
              >
                <X className="w-[1.5rem] h-[1.5rem]" />
              </button>
            </div>

            {/* Modal Body Forms */}
            {activeModal === 'blood_pressure' && (
              <div className="space-y-4">
                <p className="text-[0.875rem] text-slate-600 font-bold">請輸入血壓測量數值：</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[0.8125rem] text-slate-700 font-extrabold block mb-1">收縮壓 (高壓)</label>
                    <input
                      type="number"
                      value={sysBP}
                      onChange={(e) => setSysBP(e.target.value)}
                      className="w-full h-[48px] px-3 border-2 border-slate-300 rounded-xl text-[1.125rem] font-black focus:outline-none focus:border-orange-500 text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[0.8125rem] text-slate-700 font-extrabold block mb-1">舒張壓 (低壓)</label>
                    <input
                      type="number"
                      value={diaBP}
                      onChange={(e) => setDiaBP(e.target.value)}
                      className="w-full h-[48px] px-3 border-2 border-slate-300 rounded-xl text-[1.125rem] font-black focus:outline-none focus:border-orange-500 text-center"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onNavigate('SCR-08');
                      setActiveModal(null);
                    }}
                    className="flex-1 min-h-[48px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[0.875rem] rounded-2xl cursor-pointer"
                  >
                    開啟大數字鍵盤
                  </button>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="flex-1 min-h-[48px] bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[0.875rem] rounded-2xl cursor-pointer shadow-md"
                  >
                    快速儲存
                  </button>
                </div>
              </div>
            )}

            {activeModal === 'blood_sugar' && (
              <div className="space-y-4">
                <label className="text-[0.875rem] text-slate-700 font-extrabold block">血糖數值 (mg/dL)</label>
                <input
                  type="number"
                  value={bloodSugar}
                  onChange={(e) => setBloodSugar(e.target.value)}
                  className="w-full h-[48px] px-4 border-2 border-slate-300 rounded-xl text-[1.125rem] font-black focus:outline-none focus:border-orange-500 text-center"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setSugarMealState('before')}
                    className={`flex-1 min-h-[44px] rounded-xl font-extrabold text-[0.875rem] border ${
                      sugarMealState === 'before'
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    飯前血糖
                  </button>
                  <button
                    onClick={() => setSugarMealState('after')}
                    className={`flex-1 min-h-[44px] rounded-xl font-extrabold text-[0.875rem] border ${
                      sugarMealState === 'after'
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    飯後血糖
                  </button>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full min-h-[48px] bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[1rem] rounded-2xl cursor-pointer shadow-md"
                >
                  儲存血糖紀錄
                </button>
              </div>
            )}

            {activeModal === 'activity' && (
              <div className="space-y-4">
                <label className="text-[0.875rem] text-slate-700 font-extrabold block">今日累積步數</label>
                <input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full h-[48px] px-4 border-2 border-slate-300 rounded-xl text-[1.125rem] font-black focus:outline-none focus:border-orange-500 text-center"
                />
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full min-h-[48px] bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[1rem] rounded-2xl cursor-pointer shadow-md"
                >
                  更新活動量
                </button>
              </div>
            )}

            {activeModal === 'weight' && (
              <div className="space-y-4">
                <label className="text-[0.875rem] text-slate-700 font-extrabold block">請輸入體重 (kg)</label>
                <input
                  type="number"
                  placeholder="例如: 65.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full h-[48px] px-4 border-2 border-slate-300 rounded-xl text-[1.125rem] font-black focus:outline-none focus:border-orange-500 text-center"
                />
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full min-h-[48px] bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[1rem] rounded-2xl cursor-pointer shadow-md"
                >
                  儲存體重資料
                </button>
              </div>
            )}

            {activeModal === 'oxygen' && (
              <div className="space-y-4">
                <label className="text-[0.875rem] text-slate-700 font-extrabold block">請輸入血氧濃度 (%)</label>
                <input
                  type="number"
                  placeholder="例如: 98"
                  value={oxygen}
                  onChange={(e) => setOxygen(e.target.value)}
                  className="w-full h-[48px] px-4 border-2 border-slate-300 rounded-xl text-[1.125rem] font-black focus:outline-none focus:border-orange-500 text-center"
                />
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full min-h-[48px] bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[1rem] rounded-2xl cursor-pointer shadow-md"
                >
                  儲存血氧紀錄
                </button>
              </div>
            )}

            {activeModal === 'photo' && (
              <div className="text-center space-y-4 py-2">
                <div className="w-[4.5rem] h-[4.5rem] bg-orange-100 rounded-2xl mx-auto flex items-center justify-center text-orange-600">
                  <Camera className="w-[2.5rem] h-[2.5rem]" />
                </div>
                <p className="text-[0.875rem] text-slate-700 font-bold leading-relaxed">
                  選擇生活照、健康餐食或藥包照片上傳至今日健康相簿
                </p>
                <button
                  onClick={() => {
                    setPhotoAdded(true);
                    setActiveModal(null);
                  }}
                  className="w-full min-h-[48px] bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[1rem] rounded-2xl cursor-pointer shadow-md"
                >
                  模擬選擇上傳照片
                </button>
              </div>
            )}

            {(activeModal === 'prescription' || activeModal === 'parkinsons' || activeModal === 'questionnaire' || activeModal === 'aqi') && (
              <div className="space-y-4 text-center py-2">
                <p className="text-[0.9375rem] text-slate-800 font-bold leading-relaxed">
                  {activeModal === 'prescription' && '數位社會處方包含運動、社交與心靈健康指引，協助長者預防延緩失能與健康維護。'}
                  {activeModal === 'parkinsons' && '巴金森氏症早期檢測：觀察手指敲擊、走路姿勢及身體震顫變化。'}
                  {activeModal === 'questionnaire' && '完成每日生活品質問卷，讓專業護理團隊即時了解您的身體健康動態。'}
                  {activeModal === 'aqi' && '今日戶外空氣品質良好 (AQI 30)，非常適合前往公園散步與適度體能活動。'}
                </p>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full min-h-[48px] bg-slate-900 text-white font-extrabold text-[1rem] rounded-2xl cursor-pointer"
                >
                  我知道了
                </button>
              </div>
            )}

            {activeModal === 'overflow_menu' && (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveModal(null);
                    onNavigate('REAL-NAME');
                  }}
                  className="w-full min-h-[48px] px-4 bg-slate-50 hover:bg-slate-100 text-left font-extrabold text-slate-800 rounded-xl flex items-center justify-between"
                >
                  <span>個人實名認證資料</span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
                <button
                  onClick={() => {
                    setActiveModal(null);
                    alert('已匯出今日健康報告 (PDF)');
                  }}
                  className="w-full min-h-[48px] px-4 bg-slate-50 hover:bg-slate-100 text-left font-extrabold text-slate-800 rounded-xl flex items-center justify-between"
                >
                  <span>匯出健康數據報告</span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full min-h-[48px] mt-2 bg-orange-600 text-white font-extrabold text-[1rem] rounded-2xl"
                >
                  關閉選單
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Date Picker Bottom Sheet Modal (Matching IMG_9047.PNG) */}
      {showDatePicker && (
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-xs z-50 flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setShowDatePicker(false)}
        >
          <div
            className="bg-white rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 border-t border-slate-100 pb-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: 取消 on left, 確認 on right */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-white">
              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="text-[#F08327] hover:text-[#C0691F] font-bold text-[1.05rem] cursor-pointer active:scale-95 transition-transform"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  const newD = new Date(tempYear, tempMonth - 1, tempDay);
                  setCurrentDate(newD);
                  setShowDatePicker(false);
                }}
                className="text-[#F08327] hover:text-[#C0691F] font-bold text-[1.05rem] cursor-pointer active:scale-95 transition-transform"
              >
                確認
              </button>
            </div>

            {/* Wheel Picker Body */}
            <div className="relative py-4 px-4 bg-white">
              {/* Selected Row Background Pill Bar */}
              <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-[38px] bg-[#EFEFEF] rounded-2xl pointer-events-none z-0" />

              {/* 3 Columns */}
              <div className="grid grid-cols-3 relative z-10">
                <WheelColumn
                  options={years}
                  value={tempYear}
                  onChange={setTempYear}
                  unit="年"
                />
                <WheelColumn
                  options={months}
                  value={tempMonth}
                  onChange={(m) => {
                    setTempMonth(m);
                    const maxD = new Date(tempYear, m, 0).getDate();
                    if (tempDay > maxD) setTempDay(maxD);
                  }}
                  unit="月"
                />
                <WheelColumn
                  options={days}
                  value={tempDay}
                  onChange={setTempDay}
                  unit="日"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Fixed Bottom Navigation Bar */}
      <BottomNavBar activeTab="data" onNavigate={onNavigate} unreadCount={1} />
    </div>
  );
};
