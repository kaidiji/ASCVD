import React, { useRef, useState } from 'react';
import { ArrowLeft, X, ChevronDown, ScanLine, Camera, Image as ImageIcon, FolderArchive, Check, Sparkles } from 'lucide-react';
import { formatLocalLabDate, LabRecord } from './LabDataHomeScreen';
import { MockCameraModal } from './MockCameraModal';
import { MockGalleryModal } from './MockGalleryModal';
import { MockFilesModal } from './MockFilesModal';
import { MockAIScanningModal } from './MockAIScanningModal';
import { MockAIResultSheet } from './MockAIResultSheet';

interface LabDataAddScreenProps {
  onBack: () => void;
  onSave: (record: LabRecord) => void;
}

interface CategoryItem {
  id: string;
  name: string;
  unit?: string;
  isSelect?: boolean;
  selectOptions?: string[];
}

interface CategoryGroup {
  id: string;
  title: string;
  items: CategoryItem[];
}

export const LabDataAddScreen: React.FC<LabDataAddScreenProps> = ({ onBack, onSave }) => {
  const [showPhotoSheet, setShowPhotoSheet] = useState<boolean>(false);
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);
  const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);
  const [showFilesModal, setShowFilesModal] = useState<boolean>(false);
  const [isScanningAI, setIsScanningAI] = useState<boolean>(false);
  const [showAIResultSheet, setShowAIResultSheet] = useState<boolean>(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);
  const aiResultSubmittedRef = useRef(false);

  const [dateValue, setDateValue] = useState<string>('2026/9/4');
  const [activeSelectModal, setActiveSelectModal] = useState<{ id: string; name: string; options: string[] } | null>(null);

  // Form values state
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  // Category collapse state (all default open)
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleInputChange = (id: string, val: string) => {
    setFormValues((prev) => {
      const updated = { ...prev };
      if (val.trim() === '') {
        delete updated[id];
      } else {
        updated[id] = val;
      }
      return updated;
    });
  };

  const handleSelectOption = (id: string, val: string) => {
    handleInputChange(id, val);
    setActiveSelectModal(null);
  };

  const categories: CategoryGroup[] = [
    {
      id: 'general',
      title: '一般檢查',
      items: [
        { id: 'height', name: '身高', unit: 'cm' },
        { id: 'weight', name: '體重', unit: 'kg' },
        { id: 'waist', name: '腰圍', unit: 'cm' },
        { id: 'sbp', name: '收縮壓', unit: 'mmHg' },
        { id: 'dbp', name: '舒張壓', unit: 'mmHg' },
        { id: 'heartRate', name: '心律', unit: 'bpm' },
      ],
    },
    {
      id: 'diabetes',
      title: '糖尿病檢查',
      items: [
        { id: 'GluAC', name: 'GluAC飯前血糖', unit: 'mg/dl' },
        { id: 'GluPC', name: 'GluPC飯後血糖', unit: 'mg/dl' },
        { id: 'HbA1C', name: 'HbA1C糖化血色素', unit: '%' },
      ],
    },
    {
      id: 'lipid',
      title: '血脂肪檢查',
      items: [
        { id: 'CHOL', name: 'CHOL膽固醇', unit: 'mg/dl' },
        { id: 'HLD_C', name: 'HLD-C高密度脂蛋白膽固醇', unit: 'mg/dl' },
        { id: 'LDL_C', name: 'LDL-C低密度脂蛋白膽固醇', unit: 'mg/dl' },
        { id: 'TG', name: 'TG三酸甘油脂', unit: 'mg/dl' },
      ],
    },
    {
      id: 'liver',
      title: '肝臟功能檢查',
      items: [
        { id: 'ALB', name: 'ALB白蛋白', unit: 'mg/dl' },
        { id: 'ALK_P', name: 'ALK-P鹼性磷酸脢', unit: 'IU/L' },
        { id: 'D_BIL', name: 'D-BIL直接膽血素', unit: 'mg/dl' },
        { id: 'GGT', name: 'GGT麩胺酸轉移脢', unit: 'IU/L' },
        { id: 'GLO', name: 'GLO球蛋白', unit: 'g/dl' },
        { id: 'GOT', name: 'GOT麩胺酸草酸轉移脢', unit: 'IU/L' },
        { id: 'GPT', name: 'GPT丙酮轉移脢', unit: 'IU/L' },
        { id: 'T_BIL', name: 'T-BIL總膽血素', unit: 'mg/dl' },
        { id: 'TP', name: 'TP總蛋白', unit: 'g/dl' },
      ],
    },
    {
      id: 'kidney',
      title: '腎臟功能檢查',
      items: [
        { id: 'BUN', name: 'BUN尿素氮', unit: 'mg/dl' },
        { id: 'CREA', name: 'CREA肌酸酐', unit: 'mg/dl' },
        { id: 'UA', name: 'UA尿酸', unit: 'mg/dl' },
      ],
    },
    {
      id: 'pancreas',
      title: '胰臟功能檢查',
      items: [
        { id: 'AMY', name: 'AMY澱粉脢', unit: 'Iu/L' },
        { id: 'LIPASE', name: 'LIPASE脂脢', unit: 'U/L' },
      ],
    },
    {
      id: 'other',
      title: '其他',
      items: [
        {
          id: 'Aspirin',
          name: 'Aspirin最近一個月內有無服用阿斯匹林',
          isSelect: true,
          selectOptions: ['無', '有', '不確定'],
        },
        {
          id: 'Aspirinfreq',
          name: 'Aspirinfreq過去是否規律服用阿斯匹林藥物',
          isSelect: true,
          selectOptions: ['無', '規律服用', '不規律', '不確定'],
        },
        {
          id: 'AspirinFreq3times',
          name: 'AspirinFreq3times過去是否規律服用阿斯匹林藥物每周>=3次',
          isSelect: true,
          selectOptions: ['否', '是', '不確定'],
        },
        {
          id: 'Hep',
          name: 'Hep肝功能的指標',
          isSelect: true,
          selectOptions: ['正常', 'B型肝炎帶原', 'C型肝炎帶原', '脂肪肝', '其他異常'],
        },
      ],
    },
  ];

  // Count filled items
  const filledCount = Object.keys(formValues).filter(
    (key) => formValues[key] !== undefined && formValues[key] !== ''
  ).length;

  // Step 3: Trigger common AI Scanning from any source
  const handleStartAIScan = () => {
    aiResultSubmittedRef.current = false;
    setShowCameraModal(false);
    setShowGalleryModal(false);
    setShowFilesModal(false);
    setShowPhotoSheet(false);
    setIsScanningAI(true);
  };

  // Step 4: Scanning finished -> Show AI Result Sheet (S__42344457_0)
  const handleAIScanComplete = () => {
    setIsScanningAI(false);
    setShowAIResultSheet(true);
  };

  // Step 5: Confirm Add from AI Result Sheet -> Fill fields (S__42344458_0) & show survey (S__42344459_0)
  const handleConfirmAIResult = (editedValues: Record<string, string>) => {
    if (aiResultSubmittedRef.current) return;
    aiResultSubmittedRef.current = true;

    const now = new Date();
    const recognizedDate = formatLocalLabDate(now);

    // Persist the recognition result (including any manual adjustments) immediately.
    onSave({
      id: `ai-lab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: formatLocalLabDate(new Date()),
      createdAt: now.getTime(),
      source: 'ai',
      itemCount: Object.keys(editedValues).length,
      data: editedValues,
    });
    setShowAIResultSheet(false);

    // Fill the same values shown in the recognition result sheet.
    setFormValues((prev) => ({
      ...prev,
      ...editedValues,
    }));

    setDateValue(recognizedDate);
    setScanSuccessMessage('已自動帶入 AI 辨識健檢報告數據，您可以手動調整確認');
    setTimeout(() => {
      setScanSuccessMessage(null);
    }, 4000);

  };

  const handleSave = () => {
    if (filledCount === 0) return;
    onSave({
      id: Date.now().toString(),
      date: dateValue,
      createdAt: Date.now(),
      source: 'manual',
      itemCount: filledCount,
      data: formValues,
    });
  };

  return (
    <div className="relative w-full h-full bg-white text-gray-900 font-sans select-none flex flex-col overflow-hidden">
      {/* 1. Header (Directly shows 掃描辨識 on the right) */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-30 shrink-0">
        {/* Left: Back Arrow */}
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Center Title */}
        <h1 className="text-base font-black text-gray-900 tracking-tight">檢驗數據</h1>

        {/* Right: 掃描辨識 in orange */}
        <button
          onClick={() => setShowPhotoSheet(true)}
          className="flex items-center gap-1 text-[#F26522] hover:opacity-85 font-black text-sm px-1 py-1 cursor-pointer transition-opacity"
        >
          <span>AI辨識</span>
          <ScanLine className="w-4 h-4 stroke-[2.4]" />
        </button>
      </div>

      {/* Success Notification Banner */}
      {scanSuccessMessage && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in slide-in-from-top duration-300 shrink-0">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{scanSuccessMessage}</span>
        </div>
      )}

      {/* 2. Scrollable Body containing all sections */}
      <div className="flex-1 overflow-y-auto pb-20 divide-y divide-gray-100 bg-white no-scrollbar">
        {/* Date Section (Matches S__41959429_0) */}
        <div className="p-4 space-y-2">
          <div className="text-sm font-black text-gray-900">檢驗日期</div>
          <div className="border border-gray-200 rounded-lg px-3 py-2.5 flex items-center justify-between bg-white cursor-pointer hover:border-gray-300 transition-colors">
            <input
              type="text"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="font-serif text-base text-gray-800 tracking-wide bg-transparent focus:outline-none w-full cursor-pointer"
            />
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-gray-500 ml-2 shrink-0 pointer-events-none" />
          </div>
        </div>

        {/* Categories (Collapsible list) */}
        {categories.map((category) => {
          const isCollapsed = !!collapsedCategories[category.id];

          return (
            <div key={category.id} className="bg-white border-t border-gray-100">
              {/* Category Header */}
              <div
                onClick={() => toggleCategory(category.id)}
                className="px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/70 transition-colors"
              >
                <h3 className="text-base font-black text-gray-900 tracking-tight">
                  {category.title}
                </h3>
                <div
                  className={`transition-transform duration-200 ${
                    isCollapsed ? '-rotate-90' : 'rotate-0'
                  }`}
                >
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-gray-500" />
                </div>
              </div>

              {/* Category Items */}
              {!isCollapsed && (
                <div className="divide-y divide-gray-100/80 px-4">
                  {category.items.map((item) => {
                    const val = formValues[item.id] || '';

                    return (
                      <div
                        key={item.id}
                        className="py-3 flex items-center justify-between gap-2"
                      >
                        {/* Item Label */}
                        <div className="text-sm font-black text-gray-700 leading-snug flex-1 pr-2">
                          {item.name}
                        </div>

                        {/* Item Input or Selection */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.isSelect ? (
                            <button
                              onClick={() =>
                                setActiveSelectModal({
                                  id: item.id,
                                  name: item.name,
                                  options: item.selectOptions || ['是', '否'],
                                })
                              }
                              className={`border border-gray-200 rounded-md px-3 py-1.5 text-sm font-bold text-center min-w-[80px] cursor-pointer hover:border-gray-400 transition-all ${
                                val ? 'text-gray-900 bg-orange-50/40 border-orange-200' : 'text-gray-400 bg-white'
                              }`}
                            >
                              {val || '請選擇'}
                            </button>
                          ) : (
                            <>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={val}
                                placeholder="請輸入"
                                onChange={(e) => handleInputChange(item.id, e.target.value)}
                                className={`w-20 py-1 px-2 border rounded-md text-right text-sm font-bold placeholder:text-gray-400 placeholder:font-normal focus:outline-none transition-colors ${
                                  val
                                    ? 'border-gray-300 text-gray-900 bg-orange-50/20'
                                    : 'border-gray-200 text-gray-900 bg-white'
                                } focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522]/30`}
                              />
                              <span className="w-12 text-left text-xs font-black text-gray-800 tracking-tight pl-1">
                                {item.unit}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Bottom Fixed Bar (Matches S__41959431_0) */}
      <div className="bg-white border-t border-gray-200 px-5 py-3 flex items-center justify-between z-20 shadow-md shrink-0">
        <div className="text-base font-bold text-gray-800">
          已填 <span className="text-[#F26522] font-black">{filledCount}</span>項
        </div>

        <button
          onClick={handleSave}
          disabled={filledCount === 0}
          className={`px-8 py-2.5 rounded-lg text-base font-black tracking-wide transition-all shadow-xs ${
            filledCount > 0
              ? 'bg-[#F26522] text-white hover:bg-[#d9531e] active:scale-95 cursor-pointer'
              : 'bg-gray-300 text-white cursor-not-allowed'
          }`}
        >
          完成
        </button>
      </div>

      {/* 4. Bottom Sheet: 請選擇照片 (3 Entrances - Matches Specifications) */}
      {showPhotoSheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden touch-none select-none">
          {/* Gray Backdrop */}
          <div
            onClick={() => setShowPhotoSheet(false)}
            className="absolute inset-0 bg-black/50 transition-opacity"
          />

          {/* Modal Container: Solidly docked at bottom, static and non-movable */}
          <div className="relative z-10 bg-white rounded-t-2xl shadow-2xl pt-6 pb-8 px-5 select-none pointer-events-auto shrink-0">
            <h2 className="text-lg font-black text-gray-900 tracking-tight">請選擇資料來源</h2>
            <p className="text-xs text-gray-500 mt-1 mb-5 leading-relaxed">
              提醒：掃描時若有其他數字、反光、太遠或太暗皆可能影響掃描結果。
            </p>

            {/* Row 1: 拍照上傳 | 檢視圖庫 (Side by Side) */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* 拍照上傳 */}
              <button
                onClick={() => {
                  setShowPhotoSheet(false);
                  setShowCameraModal(true);
                }}
                className="border-2 border-[#F26522] rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-white hover:bg-orange-50/50 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <Camera className="w-8 h-8 text-[#F26522] stroke-[1.8]" />
                <span className="text-base font-black text-[#F26522] tracking-wide">
                  拍照上傳
                </span>
              </button>

              {/* 檢視圖庫 */}
              <button
                onClick={() => {
                  setShowPhotoSheet(false);
                  setShowGalleryModal(true);
                }}
                className="border-2 border-[#F26522] rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-white hover:bg-orange-50/50 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <ImageIcon className="w-8 h-8 text-[#F26522] stroke-[1.8]" />
                <span className="text-base font-black text-[#F26522] tracking-wide">
                  檢視圖庫
                </span>
              </button>
            </div>

            {/* Row 2: 選取檔案 (Left Aligned with 拍照上傳, Right Side Empty) */}
            <div className="grid grid-cols-2 gap-3.5 mt-3.5">
              <button
                onClick={() => {
                  setShowPhotoSheet(false);
                  setShowFilesModal(true);
                }}
                className="border-2 border-[#F26522] rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-white hover:bg-orange-50/50 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <FolderArchive className="w-8 h-8 text-[#F26522] stroke-[1.8]" />
                <span className="text-base font-black text-[#F26522] tracking-wide">
                  上傳報告
                </span>
              </button>
              {/* Right side left empty */}
              <div />
            </div>
          </div>
        </div>
      )}

      {/* Mock Camera Modal (S__42344453_0 & S__42344454_0) */}
      {showCameraModal && (
        <MockCameraModal
          onClose={() => setShowCameraModal(false)}
          onConfirm={handleStartAIScan}
        />
      )}

      {/* Mock Gallery Modal (messageImage_1788510224642 / 1788510375909 - 2 clean lab reports) */}
      {showGalleryModal && (
        <MockGalleryModal
          onClose={() => setShowGalleryModal(false)}
          onConfirm={handleStartAIScan}
        />
      )}

      {/* Mock Files Modal (1788510533794 - clean lab report files) */}
      {showFilesModal && (
        <MockFilesModal
          onClose={() => setShowFilesModal(false)}
          onConfirm={handleStartAIScan}
        />
      )}

      {/* Shared Step 3: AI Scanning Animation (S__42344455_0 -> S__42344456_0) */}
      {isScanningAI && (
        <MockAIScanningModal onComplete={handleAIScanComplete} />
      )}

      {/* Shared Step 4: AI Result Sheet (S__42344457_0) */}
      {showAIResultSheet && (
        <MockAIResultSheet
          onClose={() => setShowAIResultSheet(false)}
          onRescan={() => {
            setShowAIResultSheet(false);
            setShowPhotoSheet(true);
          }}
          onConfirmAdd={handleConfirmAIResult}
        />
      )}

      {/* Step 5 Survey: Feedback Survey Modal (S__42344459_0) */}

      {/* 6. Option Select Picker Modal for choice items */}
      {activeSelectModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden touch-none select-none">
          <div
            onClick={() => setActiveSelectModal(null)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative z-10 bg-white rounded-t-2xl shadow-2xl p-5 pb-8 pointer-events-auto shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-2">
              <h3 className="text-base font-black text-gray-900 truncate pr-2">
                {activeSelectModal.name}
              </h3>
              <button
                onClick={() => setActiveSelectModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1 mt-2">
              {activeSelectModal.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(activeSelectModal.id, opt)}
                  className="w-full py-3 px-4 text-left font-bold text-gray-800 hover:bg-orange-50 hover:text-[#F26522] rounded-lg transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{opt}</span>
                  {formValues[activeSelectModal.id] === opt && (
                    <Check className="w-5 h-5 text-[#F26522]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
