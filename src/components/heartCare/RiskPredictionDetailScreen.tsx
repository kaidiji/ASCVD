import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Plus, X, LockKeyhole, HeartPulse, ClipboardList, CalendarDays } from 'lucide-react';
import { calculatePrevent, PreventInput, PreventResult } from './preventCalculator';
import type { LabRecord } from '../LabDataHomeScreen';
import type { UserProfile } from '../../types';

interface Props {
  onBack: () => void;
  records: SavedPreventRecord[];
  onRecordsChange: React.Dispatch<React.SetStateAction<SavedPreventRecord[]>>;
  labRecords?: LabRecord[];
  medicalVisitRecords?: MedicalVisitRecord[];
  userProfile?: UserProfile;
}
type View = 'records' | 'form' | 'result';

export interface MedicalVisitRecord {
  id?: string;
  date: string;
  createdAt?: number;
  data: Record<string, string | number | boolean | null | undefined>;
}

export interface SavedPreventRecord {
  id: string;
  createdAt: string;
  module: '10 年心血管高風險預測';
  input: PreventInput;
  result: PreventResult;
}

type FormInput = {
  sex: '' | 0 | 1;
  age: string; tc: string; hdl: string; sbp: string; bmi: string; creatinine: string;
  dm: '' | 0 | 1; smoking: '' | 0 | 1; bptreat: '' | 0 | 1; statin: '' | 0 | 1;
};

const emptyInput: FormInput = {
  sex: '', age: '', tc: '', hdl: '', sbp: '', bmi: '', creatinine: '',
  dm: '', smoking: '', bptreat: '', statin: '',
};

export function calculateAge(birthday: string, referenceDate = new Date()): number {
  const birthDate = new Date(`${birthday}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return 0;
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const birthdayHasPassed = referenceDate.getMonth() > birthDate.getMonth() ||
    (referenceDate.getMonth() === birthDate.getMonth() && referenceDate.getDate() >= birthDate.getDate());
  if (!birthdayHasPassed) age -= 1;
  return age;
}
const mapGenderToPreventSex = (gender?: string): '' | 0 | 1 => gender === '男' || gender === '男性' ? 0 : gender === '女' || gender === '女性' ? 1 : '';

const ranges = {
  age: [30, 79], tc: [130, 320], hdl: [20, 100], sbp: [90, 200],
  bmi: [18.5, 39.9], creatinine: [0.1, 15],
} as const;

const Field = ({ label, name, value, unit, min, max, step = 1, onChange }: {
  label: string; name: keyof FormInput; value: string; unit?: string;
  min: number; max: number; step?: number; onChange: (name: keyof FormInput, value: string | number) => void;
}) => (
  <label className="block">
    <span className="mb-2 block text-[14px] font-bold text-[var(--text-base-default)]">{label}</span>
    <div className="relative">
      <input required type="number" inputMode="decimal" min={min} max={max} step={step} value={value}
        placeholder="請輸入"
        onChange={(e) => onChange(name, e.target.value)}
        className="h-12 w-full rounded-[8px] border border-[var(--border-base-tertiary)] bg-[var(--bg-base-default)] px-3 pr-20 text-[16px] text-[var(--text-base-default)] outline-none focus:border-[var(--border-brand-default)]" />
      {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--text-base-secondary)]">{unit}</span>}
    </div>
    <span className="mt-1 block text-[12px] text-[var(--text-base-secondary)]">適用範圍：{min}–{max}</span>
  </label>
);

const YesNo = ({ label, name, value, onChange }: {
  label: string; name: keyof FormInput; value: '' | 0 | 1;
  onChange: (name: keyof FormInput, value: string | number) => void;
}) => (
  <div>
    <p className="mb-2 text-[14px] font-bold text-[var(--text-base-default)]">{label}</p>
    <div className="grid grid-cols-2 gap-2">
      {[
        { v: 1, t: name === 'dm' ? '有' : '是' },
        { v: 0, t: name === 'dm' ? '無' : '否' },
      ].map(({ v, t }) => (
        <button type="button" key={v} onClick={() => onChange(name, v)}
          className={`h-11 rounded-[8px] border text-[16px] font-bold ${value === v
            ? 'border-[var(--border-brand-default)] bg-[var(--bg-brand-tertiary)] text-[var(--text-brand-on-tertiary)]'
            : 'border-[var(--border-base-tertiary)] bg-[var(--bg-base-default)] text-[var(--text-base-secondary)]'}`}>
          {t}
        </button>
      ))}
    </div>
  </div>
);

const FACTOR_ADVICE: Record<string, string> = {
  '目前吸菸': '戒菸是降低心血管風險最有效的單一行動：戒菸一年後，心血管疾病風險約可下降一半。',
  '血壓偏高': '減少鹽分攝取、規律有氧運動、控制體重、充足睡眠皆有助血壓控制。',
  '血脂待改善': '建議減少飽和脂肪與精緻食品，多攝取蔬果好油，規律運動有助提升好膽固醇。',
  '體重管理': '建議規律運動與均衡飲食，體重每減少 5% 即可明顯改善血壓、血糖與血脂。',
  '糖尿病管理': '建議規律服藥、監測血糖並控制醣類攝取，定期回診追蹤糖化血色素（HbA1c）。',
  '腎功能追蹤': '建議控制血壓與血糖以減緩腎臟負擔，並定期監測腎功能，與醫師討論追蹤計畫。',
};

const categoryFor = (risk: number) => risk < 5
  ? { label: '低風險', tone: 'positive' as const, description: '目前屬於低風險（<5%）。持續規律運動、均衡飲食與不吸菸，是維持心血管健康的重要方式。' }
  : risk < 7.5
    ? { label: '臨界風險', tone: 'warning' as const, description: '目前屬於臨界風險（5–7.5%）。建議積極調整生活型態，並在健檢時與醫師討論。' }
    : risk < 20
      ? { label: '中度風險', tone: 'brand' as const, description: '目前屬於中度風險（7.5–20%）。建議與醫師討論整體風險與是否需要進一步治療。' }
      : { label: '高風險', tone: 'danger' as const, description: '目前屬於高風險（≥20%）。建議儘快就醫，由專業人員進一步評估。' };

function Header({ title, onBack, action }: { title: string; onBack: () => void; action?: React.ReactNode }) {
  return <header className="sticky top-0 z-20 grid h-[46px] min-h-[46px] grid-cols-[48px_1fr_48px] items-center border-b border-[var(--border-base-tertiary)] bg-[var(--bg-base-default)]">
    <button onClick={onBack} className="flex h-11 w-11 items-center justify-center" aria-label="返回"><ChevronLeft size={24} /></button>
    <h1 className="text-center text-[18px] font-bold text-[var(--text-base-default)]">{title}</h1>
    <div className="flex items-center justify-center">{action}</div>
  </header>;
}

export const RiskPredictionDetailScreen: React.FC<Props> = ({ onBack, records, onRecordsChange, labRecords = [], medicalVisitRecords = [], userProfile }) => {
  const [view, setView] = useState<View>('records');
  const [showModuleMenu, setShowModuleMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [input, setInput] = useState<FormInput>(() => ({
    ...emptyInput,
    sex: userProfile?.gender === '男' ? 0 : userProfile?.gender === '女' ? 1 : '',
    age: userProfile?.birthday ? String(calculateAge(userProfile.birthday)) : '',
  }));
  const [submittedInput, setSubmittedInput] = useState<PreventInput | null>(null);
  const [result, setResult] = useState<PreventResult | null>(null);
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  useEffect(() => {
    if (view !== 'form' || (labRecords.length === 0 && medicalVisitRecords.length === 0)) return;
    const cutoff = new Date(); cutoff.setFullYear(cutoff.getFullYear() - 3);
    const parseDate = (value: string, createdAt?: number) => {
      const match = value.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/);
      if (match) {
        const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4] ?? 0), Number(match[5] ?? 0));
        if (!Number.isNaN(date.getTime())) return date;
      }
      if (createdAt !== undefined) { const createdDate = new Date(createdAt); if (!Number.isNaN(createdDate.getTime())) return createdDate; }
      return null;
    };
    const sources = [...labRecords, ...medicalVisitRecords];
    const validSources = sources.map((record) => ({ record, date: parseDate(record.date, record.createdAt) }))
      .filter(({ date }) => date && date <= new Date() && date >= cutoff)
      .sort((a, b) => b.date!.getTime() - a.date!.getTime() || (b.record.createdAt ?? 0) - (a.record.createdAt ?? 0));
    const find = (...keys: string[]) => validSources.map(({ record, date }) => ({ value: keys.map((key) => record.data[key]).find((value) => value !== undefined && value !== null && value !== ''), date }))
      .find(({ value }) => value !== undefined);
    const toBinary = (value: unknown): 0 | 1 | null => {
      if (value === true || value === 1) return 1;
      if (value === false || value === 0) return 0;
      if (typeof value !== 'string') return null;
      const normalized = value.trim().toLowerCase();
      if (['1', '是', '有', 'yes', 'true'].includes(normalized)) return 1;
      if (['0', '否', '無', 'no', 'false'].includes(normalized)) return 0;
      return null;
    };
    setInput((current) => {
      const next = { ...current };
      const assign = (name: keyof FormInput, keys: string[], min: number, max: number) => { if (next[name] !== '') return; const found = find(...keys); const n = Number(found?.value); if (Number.isFinite(n) && n >= min && n <= max) next[name] = String(n); };
      assign('tc', ['CHOL', 'TC', 'tc'], 130, 320); assign('hdl', ['HDL_C', 'HLD_C', 'HDL-C', 'hdl'], 20, 100); assign('creatinine', ['CREA', 'creatinine', 'Scr'], 0.1, 15); assign('sbp', ['SBP', 'sbp'], 90, 200);
      const bmi = find('BMI', 'bmi'); if (next.bmi === '' && bmi) next.bmi = String(Number(bmi.value).toFixed(1));
      if (next.bmi === '') { const height = find('height'); const weight = find('weight'); const h = Number(height?.value); const w = Number(weight?.value); if (h > 0 && w > 0) { const value = w / Math.pow(h / 100, 2); if (value >= 18.5 && value <= 39.9) next.bmi = value.toFixed(1); } }
      const assignBinary = (name: 'dm' | 'smoking' | 'bptreat' | 'statin', keys: string[]) => { if (next[name] !== '') return; const value = toBinary(find(...keys)?.value); if (value !== null) next[name] = value; };
      assignBinary('dm', ['dm', 'diabetes', 'diabetesHistory', '糖尿病史']);
      assignBinary('smoking', ['smoking', 'currentSmoking', '目前吸菸']);
      assignBinary('bptreat', ['bptreat', 'hypertensionTreatment', 'antihypertensive', '高血壓治療中']);
      assignBinary('statin', ['statin', 'statinUse', 'lipidLoweringTreatment', '使用降血脂statin']);
      return next;
    });
  }, [view, labRecords, medicalVisitRecords]);
  const update = (name: keyof FormInput, value: string | number) => setInput((prev) => ({ ...prev, [name]: value }));
  const valid = Object.entries(ranges).every(([key, [min, max]]) => {
    const raw = input[key as keyof typeof ranges];
    const value = Number(raw);
    return raw !== '' && Number.isFinite(value) && value >= min && value <= max;
  }) && input.sex !== '' && input.dm !== '' && input.smoking !== '' && input.bptreat !== '' && input.statin !== '';
  const toPreventInput = (): PreventInput => ({
    sex: input.sex as 0 | 1, age: Number(input.age), tc: Number(input.tc), hdl: Number(input.hdl),
    sbp: Number(input.sbp), bmi: Number(input.bmi), creatinine: Number(input.creatinine),
    dm: input.dm as 0 | 1, smoking: input.smoking as 0 | 1,
    bptreat: input.bptreat as 0 | 1, statin: input.statin as 0 | 1,
  });

  if (view === 'form') return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[var(--bg-base-secondary)] font-sans">
      <Header title="10 年心血管風險預測" onBack={() => setView('records')} />
      <form className="flex-1 overflow-y-auto px-4 py-4" onSubmit={(e) => {
        e.preventDefault(); if (!valid) return;
        setShowConfirm(true);
      }}>
        <section className="space-y-4 rounded-[12px] bg-[var(--bg-base-default)] p-4 shadow-[var(--shadow-sm)]">
          <div><h2 className="text-[18px] font-bold">基本資料</h2><p className="mt-1 text-[12px] leading-[1.5] text-[var(--text-base-secondary)]">請依最近一次健檢或量測結果填寫。所有資料僅用於本次試算。</p></div>
          <div><p className="mb-2 text-[14px] font-bold">性別</p><div className="grid grid-cols-2 gap-2">
            {[{ v: 0, t: '男性' }, { v: 1, t: '女性' }].map(({ v, t }) => <button type="button" key={v} onClick={() => update('sex', v)} className={`h-11 rounded-[8px] border text-[16px] font-bold ${input.sex === v ? 'border-[var(--border-brand-default)] bg-[var(--bg-brand-tertiary)] text-[var(--text-brand-on-tertiary)]' : 'border-[var(--border-base-tertiary)] text-[var(--text-base-secondary)]'}`}>{t}</button>)}
          </div></div>
          <Field label="年齡" name="age" value={input.age} min={30} max={79} unit="歲" onChange={update} />
          <Field label="總膽固醇 TC" name="tc" value={input.tc} min={130} max={320} step={0.1} unit="mg/dL" onChange={update} />
          <Field label="高密度脂蛋白 HDL" name="hdl" value={input.hdl} min={20} max={100} step={0.1} unit="mg/dL" onChange={update} />
          <Field label="收縮壓 SBP" name="sbp" value={input.sbp} min={90} max={200} unit="mmHg" onChange={update} />
          <Field label="身體質量指數 BMI" name="bmi" value={input.bmi} min={18.5} max={39.9} step={0.1} unit="kg/m²" onChange={update} />
          <Field label="肌酸酐 CREA" name="creatinine" value={input.creatinine} min={0.1} max={15} step={0.01} unit="mg/dL" onChange={update} />
          <YesNo label="糖尿病史" name="dm" value={input.dm} onChange={update} />
          <YesNo label="目前吸菸" name="smoking" value={input.smoking} onChange={update} />
          <YesNo label="高血壓治療中" name="bptreat" value={input.bptreat} onChange={update} />
          <YesNo label="使用降血脂 statin" name="statin" value={input.statin} onChange={update} />
        </section>
        <p className="my-4 text-[12px] leading-[1.5] text-[var(--text-base-secondary)]">本工具依 AHA PREVENT 方程式估算，僅供衛教參考，不構成醫療診斷或治療建議。</p>
        <button disabled={!valid} className="h-12 w-full rounded-full bg-[var(--bg-brand-default)] text-[16px] font-bold text-[var(--text-brand-on)] disabled:bg-[var(--bg-disabled)] disabled:text-[var(--text-disabled-on)]">計算</button>
      </form>
      {showConfirm && <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--bg-scrim)] p-4">
        <div className="w-full rounded-[16px] bg-[var(--bg-base-default)] p-5 shadow-[var(--shadow-lg)]">
          <div className="flex items-center justify-between"><h2 className="text-[20px] font-bold">提交後將無法修改</h2><button type="button" onClick={() => setShowConfirm(false)} className="flex h-10 w-10 items-center justify-center" aria-label="關閉"><X size={24} /></button></div>
          <p className="mt-5 text-[16px] leading-[1.5]">是否確定要提交您的資料？</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setShowConfirm(false)} className="h-12 rounded-[8px] text-[16px] font-bold text-[var(--text-base-default)]">檢查</button>
            <button type="button" onClick={() => {
              const nextInput = toPreventInput();
              const nextResult = calculatePrevent(nextInput);
              const now = new Date();
              setSubmittedInput(nextInput); setResult(nextResult); setSubmittedAt(now);
              onRecordsChange((prev) => [{ id: `prevent-${now.getTime()}`, createdAt: now.toISOString(), module: '10 年心血管高風險預測', input: nextInput, result: nextResult }, ...prev]);
              setShowConfirm(false); setView('result');
            }} className="h-12 rounded-[8px] bg-[var(--bg-brand-default)] text-[16px] font-bold text-[var(--text-brand-on)]">確定提交</button>
          </div>
        </div>
      </div>}
    </div>
  );

  if (view === 'result' && result && submittedInput) {
    const category = categoryFor(result.risk.ASCVD10);
    const factors = [submittedInput.smoking ? '目前吸菸' : null, submittedInput.sbp >= 130 ? '血壓偏高' : null,
      submittedInput.tc >= 200 || submittedInput.hdl < (submittedInput.sex === 1 ? 50 : 40) ? '血脂待改善' : null,
      submittedInput.bmi >= 24 ? '體重管理' : null, submittedInput.dm ? '糖尿病管理' : null, result.egfr < 60 ? '腎功能追蹤' : null].filter(Boolean) as string[];
    const toneClass = { positive: 'bg-[var(--bg-positive-default)] text-[var(--text-positive-on)]', warning: 'bg-[var(--bg-warning-default)] text-[var(--text-warning-on)]', brand: 'bg-[var(--bg-brand-default)] text-[var(--text-brand-on)]', danger: 'bg-[var(--bg-danger-default)] text-[var(--text-danger-on)]' }[category.tone];
    const cells = ['', '10 年', '30 年', '總心血管疾病 (CVD)', `${result.risk.CVD10.toFixed(2)}%`, result.risk.CVD30 == null ? 'N/A' : `${result.risk.CVD30.toFixed(2)}%`, '動脈粥樣硬化性心血管疾病 (ASCVD)', `${result.risk.ASCVD10.toFixed(2)}%`, result.risk.ASCVD30 == null ? 'N/A' : `${result.risk.ASCVD30.toFixed(2)}%`, '心臟衰竭 (HF)', `${result.risk.HF10.toFixed(2)}%`, result.risk.HF30 == null ? 'N/A' : `${result.risk.HF30.toFixed(2)}%`];
    const dateText = new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(submittedAt ?? new Date()).replaceAll('/', '/');
    const inputRows = [
      ['性別', submittedInput.sex === 1 ? '女性' : '男性'], ['年齡', `${submittedInput.age} 歲`],
      ['總膽固醇 TC', `${submittedInput.tc} mg/dL`], ['高密度脂蛋白 HDL', `${submittedInput.hdl} mg/dL`],
      ['收縮壓 SBP', `${submittedInput.sbp} mmHg`], ['身體質量指數 BMI', `${submittedInput.bmi} kg/m²`],
      ['肌酸酐 CREA', `${submittedInput.creatinine} mg/dL`], ['糖尿病史', submittedInput.dm ? '有' : '無'],
      ['目前吸菸', submittedInput.smoking ? '是' : '否'], ['高血壓治療中', submittedInput.bptreat ? '是' : '否'],
      ['使用降血脂 statin', submittedInput.statin ? '是' : '否'],
    ];
    return <div className="flex h-full flex-col overflow-hidden bg-[var(--bg-base-secondary)] font-sans"><Header title="預測結果" onBack={() => setView('records')} />
      <main className="flex-1 space-y-3 overflow-y-auto">
        <section className="bg-[var(--bg-base-default)] p-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><CalendarDays className="text-[var(--text-brand-default)]" size={24} /><h2 className="text-[18px] font-bold">填寫日期</h2></div><time className="text-[14px] font-bold">{dateText}</time></div>
        </section>
        <section className="bg-[var(--bg-base-default)] p-4">
          <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-3"><HeartPulse className="text-[var(--text-brand-default)]" size={24} /><h2 className="text-[18px] font-bold">您的輸入數據</h2></div><ChevronDown className="text-[var(--text-base-tertiary)]" size={20} /></div>
          <dl className="space-y-3">{inputRows.map(([label, value]) => <div key={label} className="grid grid-cols-[1.25fr_1fr] items-center gap-3"><dt className="text-[14px] font-bold">{label}</dt><dd><span className="inline-block rounded-full border border-[var(--border-base-tertiary)] bg-[var(--bg-base-secondary)] px-3 py-1 text-[14px]">{value}</span></dd></div>)}</dl>
        </section>
        <section className="overflow-hidden bg-[var(--bg-base-default)]">
          <div className="flex items-center justify-between p-4"><div className="flex items-center gap-3"><HeartPulse className="text-[var(--text-brand-default)]" size={24} /><h2 className="text-[18px] font-bold">總體風險評估</h2></div><ChevronDown className="text-[var(--text-base-tertiary)]" size={20} /></div>
          <p className="px-4 pb-4 text-[14px] font-bold text-[var(--text-brand-default)]">使用的 eGFR：{result.egfr.toFixed(1)} mL/min/1.73m²</p>
          <div className="grid grid-cols-[1.65fr_1fr_1fr] border-t border-[var(--border-base-tertiary)] text-[12px]">{cells.map((cell, i) => <div key={i} className={`flex min-h-12 items-center border-b border-r border-[var(--border-base-tertiary)] p-2 ${i < 3 ? 'justify-center bg-[var(--bg-brand-default)] font-bold text-[var(--text-brand-on)]' : i % 3 === 0 ? 'bg-[var(--bg-base-secondary)] font-bold' : 'justify-center font-bold text-[var(--text-brand-default)]'}`}>{cell}</div>)}</div>
          <p className="p-4 text-[12px] leading-[1.5] text-[var(--text-base-secondary)]">30 年風險僅適用於 30–59 歲；N/A 代表不在適用年齡。eGFR 由肌酸酐依 2021 CKD‑EPI 公式推算。</p>
        </section>
        <section className="space-y-4 bg-[var(--bg-base-default)] p-4">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><ClipboardList className="text-[var(--text-brand-default)]" size={24} /><h2 className="text-[18px] font-bold">個人化健康報告</h2></div><ChevronDown className="text-[var(--text-base-tertiary)]" size={20} /></div>
          <div className={`rounded-[12px] p-4 ${toneClass}`}><p className="text-[20px] font-bold">{category.label}</p><p className="mt-1 text-[16px] font-bold">10 年 ASCVD 風險 {result.risk.ASCVD10.toFixed(2)}%</p></div>
          <div className="grid grid-cols-4 overflow-hidden rounded-[4px] text-center text-[12px] font-bold text-[var(--text-on-image)]"><span className="bg-[var(--bg-positive-default)] p-2">低風險</span><span className="bg-[var(--bg-warning-default)] p-2">臨界</span><span className="bg-[var(--bg-brand-default)] p-2">中度</span><span className="bg-[var(--bg-danger-default)] p-2">高風險</span></div>
          <p className="text-[14px] leading-[1.5] text-[var(--text-base-secondary)]">{category.description}</p>
          <div><h3 className="mb-2 text-[16px] font-bold">健康建議</h3>{factors.length ? <div className="space-y-2">{factors.map((factor) => <div key={factor} className="rounded-[8px] border-l-4 border-[var(--border-brand-default)] bg-[var(--bg-brand-tertiary)] p-3"><p className="text-[14px] font-bold text-[var(--text-brand-on-tertiary)]">{factor}</p><p className="mt-1 text-[12px] leading-[1.5] text-[var(--text-base-secondary)]">{FACTOR_ADVICE[factor] ?? '建議與醫師討論適合您的個人目標，並持續追蹤相關指標。'}</p></div>)}</div> : <div className="rounded-[8px] bg-[var(--bg-positive-tertiary)] p-3 text-[14px] text-[var(--text-positive-on-tertiary)]">目前主要風險因子控制良好，請繼續維持健康生活型態。</div>}</div>
          <p className="text-[12px] leading-[1.5] text-[var(--text-base-secondary)]">本報告由規則式邏輯自動產生，僅供衛教參考，不構成醫療診斷或治療建議。</p>
        </section>
        <section aria-labelledby="cardiovascular-references" className="bg-[var(--bg-base-secondary)] px-4 py-5">
          <h2 id="cardiovascular-references" className="text-[14px] font-bold text-[var(--text-base-secondary)]">Reference</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-[12px] leading-[1.6] text-[var(--text-base-secondary)]">
            <li>
              D&apos;Agostino, R. B., Sr., Vasan, R. S., Pencina, M. J., Wolf, P. A., Cobain, M., Massaro, J. M., &amp; Kannel, W. B. (2008). General cardiovascular risk profile for use in primary care: The Framingham Heart Study. <i>Circulation, 117</i>(6), 743–753.
            </li>
            <li>
              World Health Organization. (2007). <i>Prevention of cardiovascular disease: Guidelines for assessment and management of cardiovascular risk</i>. World Health Organization.
            </li>
            <li>
              World Health Organization. (2007). <i>WHO/ISH risk prediction charts for 14 WHO epidemiological sub-regions</i>. World Health Organization.
            </li>
          </ol>
        </section>
      </main>
    </div>;
  }

  const groupedRecords = records.reduce((groups: Record<string, SavedPreventRecord[]>, record: SavedPreventRecord) => {
    const date = new Date(record.createdAt);
    const key = `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
    (groups[key] ??= []).push(record);
    return groups;
  }, {} as Record<string, SavedPreventRecord[]>);

  return <div className="relative flex h-full flex-col overflow-hidden bg-[var(--bg-base-default)] font-sans">
    <Header title="風險預測" onBack={onBack} action={<button onClick={() => setShowModuleMenu(true)} className="flex h-10 w-10 items-center justify-center" aria-label="新增風險預測"><Plus className="text-[var(--text-brand-default)]" size={24} /></button>} />
    <main className="flex-1 overflow-y-auto">
      {records.length === 0 ? <div className="px-4 py-20 text-center"><HeartPulse className="mx-auto text-[var(--text-base-tertiary)]" size={40} /><p className="mt-4 text-[16px] text-[var(--text-base-secondary)]">目前尚無風險預測紀錄</p><p className="mt-2 text-[12px] text-[var(--text-base-tertiary)]">點擊右上角新增預測</p></div> : (Object.entries(groupedRecords) as Array<[string, SavedPreventRecord[]]>).map(([month, monthRecords], groupIndex) => <section key={month} className="border-b border-[var(--border-base-tertiary)]">
        <div className="flex items-center justify-between px-4 py-4"><h2 className="text-[20px] font-bold">{month}</h2><ChevronDown className={`text-[var(--text-base-tertiary)] ${groupIndex === 0 ? '' : 'rotate-180'}`} size={24} /></div>
        {monthRecords.map((record) => {
          const date = new Date(record.createdAt);
          return <button key={record.id} onClick={() => { setSubmittedInput(record.input); setResult(record.result); setSubmittedAt(date); setView('result'); }} className="flex w-full items-center justify-between border-t border-[var(--border-base-tertiary)] px-4 py-4 text-left">
            <div className="flex items-center gap-3"><span className="text-[16px] font-bold text-[var(--text-base-secondary)]">{date.getMonth() + 1}月{date.getDate()}日</span><span className="text-[16px] font-bold">{record.module}</span></div><ChevronRight className="text-[var(--text-base-tertiary)]" size={24} />
          </button>;
        })}
      </section>)}
    </main>
    {showModuleMenu && <div className="absolute inset-0 z-50 flex items-end bg-[var(--bg-scrim)]" onClick={() => setShowModuleMenu(false)}><div className="w-full rounded-t-[16px] bg-[var(--bg-base-default)] p-4 pb-6 shadow-[var(--shadow-lg-up)]" onClick={(e) => e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-[18px] font-bold">選擇風險預測模組</h2><button onClick={() => setShowModuleMenu(false)} className="flex h-10 w-10 items-center justify-center"><X size={24} /></button></div>
      <div aria-disabled="true" className="mb-2 flex min-h-16 items-center gap-3 rounded-[12px] border border-[var(--border-disabled)] bg-[var(--bg-disabled)] p-3 text-[var(--text-disabled)]"><LockKeyhole size={20} /><div><p className="text-[16px] font-bold">DCSI 糖尿病風險預測</p><p className="text-[12px]">此功能目前無法使用</p></div></div>
      <button onClick={() => { setInput({ ...emptyInput, sex: mapGenderToPreventSex(userProfile?.gender), age: userProfile?.birthday ? String(calculateAge(userProfile.birthday)) : '' }); setResult(null); setSubmittedInput(null); setSubmittedAt(null); setShowModuleMenu(false); setView('form'); }} className="flex min-h-16 w-full items-center gap-3 rounded-[12px] border border-[var(--border-brand-tertiary)] bg-[var(--bg-brand-tertiary)] p-3 text-left"><HeartPulse className="text-[var(--text-brand-default)]" size={20} /><div className="flex-1"><p className="text-[16px] font-bold text-[var(--text-brand-on-tertiary)]">10 年心血管高風險預測模組</p><p className="text-[12px] text-[var(--text-base-secondary)]">AHA PREVENT 心血管疾病風險試算</p></div><ChevronRight className="text-[var(--text-brand-default)]" size={20} /></button>
    </div></div>}
  </div>;
};
