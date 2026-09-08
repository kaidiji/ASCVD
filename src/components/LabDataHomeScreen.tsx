import React, { useState } from 'react';
import { ArrowLeft, Plus, ChevronDown, ChevronUp, ChevronRight, X, Droplet, Eye, Calendar, FileText } from 'lucide-react';
import { LabDataAddScreen } from './LabDataAddScreen';
import { LabDataDetailScreen } from './LabDataDetailScreen';

interface LabDataHomeScreenProps {
  onBack: () => void;
  onSubScreenChange?: (isSub: boolean) => void;
  records?: LabRecord[];
  onRecordsChange?: React.Dispatch<React.SetStateAction<LabRecord[]>>;
}

export interface LabRecord {
  id: string;
  date: string;
  createdAt: number;
  source: 'default' | 'ai' | 'manual';
  itemCount: number;
  data: Record<string, string>;
}

export const formatLocalLabDate = (date: Date) =>
  `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

export const createDefaultLabRecord = (now = new Date()): LabRecord => ({
  id: `default-lab-${now.getTime()}`,
  date: formatLocalLabDate(now),
  createdAt: now.getTime(),
  source: 'default',
  itemCount: 13,
  data: { height: '158.1', weight: '66.3', waist: '95', sbp: '151', dbp: '76', heartRate: '94', GluAC: '103', CHOL: '178', HLD_C: '56', LDL_C: '112', TG: '122', CREA: '1.31', GPT: '16' },
});

export const DEFAULT_OLD_LAB_RECORD: LabRecord = {
  id: 'default-old-lab-2025-01-20',
  date: '2025/1/20',
  createdAt: new Date(2025, 0, 20).getTime(),
  source: 'default',
  itemCount: 13,
  data: {
    height: '158.1', weight: '66.3', waist: '95', sbp: '151', dbp: '76', heartRate: '94',
    GluAC: '103', CHOL: '178', HLD_C: '56', LDL_C: '112', TG: '122', CREA: '1.31', GPT: '16',
  },
};
export const DEFAULT_LAB_RECORD = DEFAULT_OLD_LAB_RECORD;

interface ItemCategory {
  id: string;
  title: string;
  items: string[];
}

const ITEM_CATEGORIES: ItemCategory[] = [
  {
    id: 'general',
    title: '一般檢驗',
    items: ['身高', '體重', '腰圍', '收縮壓', '舒張壓', '心律'],
  },
  {
    id: 'diabetes',
    title: '糖尿病檢查',
    items: ['GluAC飯前血糖', 'GluPC飯後血糖', 'HbA1C糖化血色素'],
  },
  {
    id: 'lipid',
    title: '血脂肪檢查',
    items: ['CHOL膽固醇', 'HLD-C高密度脂蛋白膽固醇', 'LDL-C低密度脂蛋白膽固醇', 'TG三酸甘油脂'],
  },
  {
    id: 'liver',
    title: '肝臟功能檢查',
    items: [
      'ALB白蛋白',
      'ALK-P鹼性磷酸脢',
      'D-BIL直接膽血素',
      'GGT麩胺酸轉移脢',
      'GLO球蛋白',
      'GOT麩胺酸草酸轉移脢',
      'GPT丙酮轉移脢',
      'T-BIL總膽血素',
      'TP總蛋白',
    ],
  },
  {
    id: 'kidney',
    title: '腎臟功能檢查',
    items: ['BUN尿素氮', 'CREA肌酸酐', 'UA尿酸'],
  },
  {
    id: 'pancreas',
    title: '胰臟功能檢查',
    items: ['AMY澱粉脢', 'LIPASE脂脢'],
  },
  {
    id: 'other',
    title: '其他',
    items: [
      'Aspirin最近一個月內有無服用阿斯匹林',
      'Aspirinfreq過去是否規律服用阿斯匹林藥物',
      'AspirinFreq3times過去是否規律服用阿斯匹林藥物每周>=3次',
      'Hep肝功能的指標',
    ],
  },
  {
    id: 'fundus_left',
    title: '眼底鏡-左眼球病徵',
    items: ['視網膜病變', '黃斑部病變', '青光眼', '白內障'],
  },
  {
    id: 'fundus_right',
    title: '眼底鏡-右眼球病徵',
    items: ['視網膜病變', '黃斑部病變', '青光眼', '白內障'],
  },
];

export const LabDataHomeScreen: React.FC<LabDataHomeScreenProps> = ({ onBack, onSubScreenChange, records, onRecordsChange }) => {
  const [activeTab, setActiveTab] = useState<'date' | 'item'>('date');
  const [showAddSheet, setShowAddSheet] = useState<boolean>(false);
  const [currentSubView, setCurrentSubView] = useState<'home' | 'add_general'>('home');
  const [selectedRecord, setSelectedRecord] = useState<LabRecord | null>(null);
  const [localSavedRecords, setLocalSavedRecords] = useState<LabRecord[]>([
    {
      id: 'record-2026-09-04',
      date: '2025/1/20',
      createdAt: new Date(2026, 8, 4, 16, 10).getTime(),
      source: 'ai',
      itemCount: 13,
      data: {
        height: '158.1',
        weight: '66.3',
        waist: '95',
        sbp: '151',
        dbp: '76',
        heartRate: '94',
        GluAC: '103',
        CHOL: '178',
        HLD_C: '56',
        LDL_C: '112',
        TG: '122',
        CREA: '1.31',
        GPT: '16',
      },
    },
  ]);
  const savedRecords = records ?? localSavedRecords;
  const setSavedRecords = onRecordsChange ?? setLocalSavedRecords;
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthKey]: !prev[monthKey],
    }));
  };

  const handleOpenAdd = () => {
    setShowAddSheet(true);
  };

  const handleCloseAdd = () => {
    setShowAddSheet(false);
  };

  const handleSelectGeneralLab = () => {
    setShowAddSheet(false);
    setCurrentSubView('add_general');
  };

  const handleSaveLabRecord = (newRecord: LabRecord) => {
    setSavedRecords((prev) => [newRecord, ...prev]);
    setActiveTab('date');
    setCurrentSubView('home');
  };

  // Subview 1: Add General Lab Screen
  if (currentSubView === 'add_general') {
    return (
      <LabDataAddScreen
        onBack={() => setCurrentSubView('home')}
        onSave={handleSaveLabRecord}
      />
    );
  }

  // Subview 2: Detail Record Screen
  if (selectedRecord) {
    return (
      <LabDataDetailScreen
        record={selectedRecord}
        onBack={() => setSelectedRecord(null)}
      />
    );
  }

  // Helper to format date into "X 月 X 日"
  const formatDateTitle = (dateStr: string) => {
    const match = dateStr.match(/\d{4}[\/-](\d{1,2})[\/-](\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/);
    if (match) {
      return `${match[1]} 月 ${match[2]} 日${match[3] ? ` ${String(match[3]).padStart(2, '0')}:${match[4]}` : ''}`;
    }
    return dateStr;
  };

  return (
    <div className="relative w-full h-full bg-white text-gray-900 font-sans select-none flex flex-col overflow-hidden">
      {/* 1. APP Header (Matches S__41959427_0 & S__42344461_0) */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-30 shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-black text-gray-900 tracking-tight">檢驗數據</h1>

        <button
          onClick={handleOpenAdd}
          className="w-7 h-7 rounded-full bg-[#F26522] flex items-center justify-center text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* 2. Tabs: 檢驗日期 / 檢驗項目 */}
      <div className="flex border-b border-gray-100 text-sm font-bold bg-white shrink-0">
        <button
          onClick={() => setActiveTab('date')}
          className={`flex-1 py-3 text-center transition-colors relative cursor-pointer ${
            activeTab === 'date' ? 'text-[#F26522] font-black' : 'text-gray-800'
          }`}
        >
          檢驗日期
          {activeTab === 'date' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F26522]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('item')}
          className={`flex-1 py-3 text-center transition-colors relative cursor-pointer ${
            activeTab === 'item' ? 'text-[#F26522] font-black' : 'text-gray-800'
          }`}
        >
          檢驗項目
          {activeTab === 'item' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F26522]" />
          )}
        </button>
      </div>

      {/* Tab 1: 檢驗日期 (Simple List Structure - Matches Official App) */}
      {activeTab === 'date' && (
        <div className="flex-1 overflow-y-auto bg-white no-scrollbar divide-y divide-gray-100">
          {(Object.entries(savedRecords.reduce<Record<string, LabRecord[]>>((groups, record) => {
            const match = record.date.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/);
            const key = match ? `${match[1]}-${String(match[2]).padStart(2, '0')}` : 'unknown';
            (groups[key] ??= []).push(record);
            return groups;
          }, {})) as Array<[string, LabRecord[]]>).sort(([a], [b]) => b.localeCompare(a)).map(([monthKey, monthRecords]) => {
            const [year, month] = monthKey.split('-');
            const expanded = expandedMonths[monthKey] ?? true;
            const sorted = [...monthRecords].sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()) || (b.createdAt - a.createdAt));
            return <div key={monthKey} className="bg-white">
              <button onClick={() => toggleMonth(monthKey)} className="w-full px-5 py-3.5 flex items-center justify-between border-b border-gray-100">
                <span className="text-base font-extrabold text-gray-900">{monthKey === 'unknown' ? '其他日期' : `${year} 年 ${Number(month)} 月`}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${expanded ? 'rotate-0' : '-rotate-90'}`} />
              </button>
              {expanded && <div className="divide-y divide-gray-100">{sorted.map((record) => <button key={record.id} onClick={() => setSelectedRecord(record)} className="w-full px-5 py-3.5 flex items-center justify-between text-left"><span className="text-sm font-bold text-gray-900">{formatDateTitle(record.date)}</span><ChevronRight className="w-4 h-4 text-gray-400" /></button>)}</div>}
            </div>;
          })}
        </div>
      )}

      {/* Tab 2: 檢驗項目 */}
      {activeTab === 'item' && (
        <div className="flex-1 overflow-y-auto bg-white divide-y divide-gray-100 no-scrollbar">
          {ITEM_CATEGORIES.map((category) => {
            const isExpanded = !!expandedCategories[category.id];
            return (
              <div key={category.id} className="bg-white">
                {/* Category Header Row (Accordion trigger) */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left cursor-pointer"
                >
                  <span className="text-sm font-black text-gray-900 tracking-tight">
                    {category.title}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 stroke-[2]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 stroke-[2]" />
                  )}
                </button>

                {/* Category Expanded Items List */}
                {isExpanded && (
                  <div className="divide-y divide-gray-100 border-t border-gray-100 bg-white">
                    {category.items.map((itemName) => (
                      <div
                        key={itemName}
                        className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/60 transition-colors cursor-pointer"
                      >
                        <span className="text-sm text-gray-800 font-medium">
                          {itemName}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 stroke-[2]" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Bottom Sheet: 新增數據 (Matches S__41959428_0) */}
      {showAddSheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden touch-none select-none">
          {/* Gray semi-transparent backdrop */}
          <div
            onClick={handleCloseAdd}
            className="absolute inset-0 bg-black/40 transition-opacity"
          />

          {/* Bottom Sheet Modal strictly constrained inside viewport */}
          <div className="relative z-10 bg-white rounded-t-2xl shadow-2xl pt-4 pb-8 px-5 pointer-events-auto shrink-0">
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-4">
              <button
                onClick={handleCloseAdd}
                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
              <h2 className="text-base font-black text-gray-900 tracking-tight">新增數據</h2>
              <div className="w-8" />
            </div>

            {/* Options List */}
            <div className="divide-y divide-gray-100 mt-1">
              {/* 一般檢驗 Option */}
              <button
                onClick={handleSelectGeneralLab}
                className="w-full py-4.5 flex items-center gap-3.5 hover:bg-gray-50 rounded-lg px-2 text-left cursor-pointer transition-colors"
              >
                <Droplet className="w-5 h-5 text-gray-900 stroke-[1.8]" />
                <span className="text-base font-black text-gray-900">一般檢驗</span>
              </button>

              {/* 眼底鏡檢查 Option */}
              <button
                onClick={() => {
                  alert('眼底鏡檢查功能即將推出');
                  handleCloseAdd();
                }}
                className="w-full py-4.5 flex items-center gap-3.5 hover:bg-gray-50 rounded-lg px-2 text-left cursor-pointer transition-colors"
              >
                <Eye className="w-5 h-5 text-gray-900 stroke-[1.8]" />
                <span className="text-base font-black text-gray-900">眼底鏡檢查</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
