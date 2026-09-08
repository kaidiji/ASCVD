export interface MockRecognizedItem { id: string; name: string; value: string; unit: string; category: string; }
export const MOCK_RECOGNIZED_LAB_ITEMS: MockRecognizedItem[] = [
  ['height','身高','158.1','cm','一般檢查'],['weight','體重','66.3','kg','一般檢查'],['waist','腰圍','95','cm','一般檢查'],['sbp','收縮壓','151','mmHg','一般檢查'],['dbp','舒張壓','76','mmHg','一般檢查'],['heartRate','心律','94','bpm','一般檢查'],['GluAC','GluAC飯前血糖','103','mg/dL','生化檢驗'],['CHOL','CHOL膽固醇','178','mg/dL','生化檢驗'],['HLD_C','HDL-C高密度脂蛋白膽固醇','56','mg/dL','生化檢驗'],['LDL_C','LDL-C低密度脂蛋白膽固醇','112','mg/dL','生化檢驗'],['TG','TG三酸甘油脂','122','mg/dL','生化檢驗'],['CREA','CREA肌酸酐','1.31','mg/dL','生化檢驗'],['GPT','GPT丙酮轉移酶','16','IU/L','生化檢驗'],
].map(([id,name,value,unit,category]) => ({ id, name, value, unit, category }));
