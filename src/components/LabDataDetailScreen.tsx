import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { LabRecord } from './LabDataHomeScreen';

interface LabDataDetailScreenProps {
  record: LabRecord;
  onBack: () => void;
}

interface CategoryGroup {
  id: string;
  title: string;
  items: { id: string; name: string; unit?: string }[];
}

const CATEGORY_DEFINITIONS: CategoryGroup[] = [
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
      { id: 'GluAC', name: 'GluAC飯前血糖', unit: 'mg/dL' },
      { id: 'GluPC', name: 'GluPC飯後血糖', unit: 'mg/dL' },
      { id: 'HbA1C', name: 'HbA1C糖化血色素', unit: '%' },
    ],
  },
  {
    id: 'lipid',
    title: '血脂肪檢查',
    items: [
      { id: 'CHOL', name: 'CHOL膽固醇', unit: 'mg/dL' },
      { id: 'HLD_C', name: 'HLD-C高密度脂蛋白膽固醇', unit: 'mg/dL' },
      { id: 'LDL_C', name: 'LDL-C低密度脂蛋白膽固醇', unit: 'mg/dL' },
      { id: 'TG', name: 'TG三酸甘油脂', unit: 'mg/dL' },
    ],
  },
  {
    id: 'liver',
    title: '肝臟功能檢查',
    items: [
      { id: 'ALB', name: 'ALB白蛋白', unit: 'g/dL' },
      { id: 'ALK_P', name: 'ALK-P鹼性磷酸脢', unit: 'U/L' },
      { id: 'D_BIL', name: 'D-BIL直接膽血素', unit: 'mg/dL' },
      { id: 'GGT', name: 'GGT麩胺酸轉移脢', unit: 'U/L' },
      { id: 'GLO', name: 'GLO球蛋白', unit: 'g/dL' },
      { id: 'GOT', name: 'GOT麩胺酸草酸轉移脢', unit: 'U/L' },
      { id: 'GPT', name: 'GPT丙酮轉移脢', unit: 'U/L' },
      { id: 'T_BIL', name: 'T-BIL總膽血素', unit: 'mg/dL' },
      { id: 'TP', name: 'TP總蛋白', unit: 'g/dL' },
    ],
  },
  {
    id: 'kidney',
    title: '腎臟功能檢查',
    items: [
      { id: 'BUN', name: 'BUN尿素氮', unit: 'mg/dL' },
      { id: 'CREA', name: 'CREA肌酸酐', unit: 'mg/dL' },
      { id: 'UA', name: 'UA尿酸', unit: 'mg/dL' },
    ],
  },
  {
    id: 'pancreas',
    title: '胰臟功能檢查',
    items: [
      { id: 'AMY', name: 'AMY澱粉脢', unit: 'U/L' },
      { id: 'LIPASE', name: 'LIPASE脂脢', unit: 'U/L' },
    ],
  },
  {
    id: 'other',
    title: '其他',
    items: [
      { id: 'Aspirin', name: 'Aspirin最近一個月內有無服用阿斯匹林' },
      { id: 'Aspirinfreq', name: 'Aspirinfreq過去是否規律服用阿斯匹林藥物' },
      { id: 'AspirinFreq3times', name: 'AspirinFreq3times過去是否規律服用阿斯匹林藥物每周>=3次' },
      { id: 'Hep', name: 'Hep肝功能的指標' },
    ],
  },
];

export const LabDataDetailScreen: React.FC<LabDataDetailScreenProps> = ({ record, onBack }) => {
  return (
    <div className="relative w-full h-full bg-white text-gray-900 font-sans select-none flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-30 shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <h1 className="text-base font-black text-gray-900 tracking-tight">檢驗數據</h1>
        <div className="w-8 h-8" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white no-scrollbar pb-10">
        {/* Date Row */}
        <div className="p-4 space-y-2">
          <div className="text-sm font-black text-gray-900">檢驗日期</div>
          <div className="border border-gray-200 rounded-lg px-3.5 py-2.5 bg-gray-50/50 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800">{record.date}</span>
          </div>
        </div>

        {/* Categories */}
        {CATEGORY_DEFINITIONS.map((cat) => {
          // Check which items have values in this category
          const itemsWithVal = cat.items.filter(
            (item) => record.data[item.id] !== undefined && record.data[item.id] !== ''
          );

          if (itemsWithVal.length === 0) return null;

          return (
            <div key={cat.id} className="p-4 space-y-3">
              <div className="text-sm font-black text-gray-900">{cat.title}</div>
              <div className="space-y-3">
                {itemsWithVal.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="text-xs font-semibold text-gray-600">{item.name}</div>
                    <div className="border border-gray-200 rounded-lg px-3.5 py-2.5 bg-gray-50 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">
                        {record.data[item.id]}
                      </span>
                      {item.unit && (
                        <span className="text-xs text-gray-400 font-medium">{item.unit}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
