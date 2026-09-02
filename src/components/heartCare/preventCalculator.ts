export interface PreventInput {
  sex: 0 | 1;
  age: number;
  tc: number;
  hdl: number;
  sbp: number;
  bmi: number;
  creatinine: number;
  dm: 0 | 1;
  smoking: 0 | 1;
  bptreat: 0 | 1;
  statin: 0 | 1;
}

export interface PreventResult {
  egfr: number;
  risk: {
    CVD10: number;
    CVD30: number | null;
    ASCVD10: number;
    ASCVD30: number | null;
    HF10: number;
    HF30: number | null;
  };
}

const mmol = (value: number) => value * 0.02586;
const logisticPercent = (value: number) => 100 * Math.exp(value) / (1 + Math.exp(value));

// 2021 CKD-EPI creatinine equation without race coefficient.
export function calculateEgfr(sex: 0 | 1, age: number, creatinine: number) {
  const isFemale = sex === 1;
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const ratio = creatinine / kappa;
  return 142 * Math.pow(Math.min(ratio, 1), alpha) * Math.pow(Math.max(ratio, 1), -1.2)
    * Math.pow(0.9938, age) * (isFemale ? 1.012 : 1);
}

export function calculatePrevent(input: PreventInput): PreventResult {
  const { sex, age, tc, hdl, sbp, bmi, creatinine, dm, smoking, bptreat, statin } = input;
  const egfr = calculateEgfr(sex, age, creatinine);
  const a = (age - 55) / 10;
  const nonHdl = mmol(tc - hdl) - 3.5;
  const hdlTerm = (mmol(hdl) - 1.3) / 0.3;
  const sbpLow = (Math.min(sbp, 110) - 110) / 20;
  const sbpHigh = (Math.max(sbp, 110) - 130) / 20;
  const egfrLow = (Math.min(egfr, 60) - 60) / -15;
  const egfrHigh = (Math.max(egfr, 60) - 90) / -15;
  const bmiLow = (Math.min(bmi, 30) - 25) / 5;
  const bmiHigh = (Math.max(bmi, 30) - 30) / 5;

  let cvd10: number;
  let cvd30: number;
  let ascvd10: number;
  let ascvd30: number;
  let hf10: number;
  let hf30: number;

  if (sex === 1) {
    cvd10 = -3.307728 + 0.7939329*a + 0.0305239*nonHdl - 0.1606857*hdlTerm
      - 0.2394003*sbpLow + 0.360078*sbpHigh + 0.8667604*dm + 0.5360739*smoking
      + 0.6045917*egfrLow + 0.0433769*egfrHigh + 0.3151672*bptreat - 0.1477655*statin
      - 0.0663612*bptreat*sbpHigh + 0.1197879*statin*nonHdl - 0.0819715*a*nonHdl
      + 0.0306769*a*hdlTerm - 0.0946348*a*sbpHigh - 0.27057*a*dm
      - 0.078715*a*smoking - 0.1637806*a*egfrLow;
    cvd30 = -1.318827 + 0.5503079*a - 0.0928369*a*a + 0.0409794*nonHdl - 0.1663306*hdlTerm
      - 0.1628654*sbpLow + 0.3299505*sbpHigh + 0.6793894*dm + 0.3196112*smoking
      + 0.1857101*egfrLow + 0.0553528*egfrHigh + 0.2894*bptreat - 0.075688*statin
      - 0.056367*bptreat*sbpHigh + 0.1071019*statin*nonHdl - 0.0751438*a*nonHdl
      + 0.0301786*a*hdlTerm - 0.0998776*a*sbpHigh - 0.3206166*a*dm
      - 0.1607862*a*smoking - 0.1450788*a*egfrLow;
    ascvd10 = -3.819975 + 0.719883*a + 0.1176967*nonHdl - 0.151185*hdlTerm
      - 0.0835358*sbpLow + 0.3592852*sbpHigh + 0.8348585*dm + 0.4831078*smoking
      + 0.4864619*egfrLow + 0.0397779*egfrHigh + 0.2265309*bptreat - 0.0592374*statin
      - 0.0395762*bptreat*sbpHigh + 0.0844423*statin*nonHdl - 0.0567839*a*nonHdl
      + 0.0325692*a*hdlTerm - 0.1035985*a*sbpHigh - 0.2417542*a*dm
      - 0.0791142*a*smoking - 0.1671492*a*egfrLow;
    ascvd30 = -1.974074 + 0.4669202*a - 0.0893118*a*a + 0.1256901*nonHdl - 0.1542255*hdlTerm
      - 0.0018093*sbpLow + 0.322949*sbpHigh + 0.6296707*dm + 0.268292*smoking
      + 0.100106*egfrLow + 0.0499663*egfrHigh + 0.1875292*bptreat + 0.0152476*statin
      - 0.0276123*bptreat*sbpHigh + 0.0736147*statin*nonHdl - 0.0521962*a*nonHdl
      + 0.0316918*a*hdlTerm - 0.1046101*a*sbpHigh - 0.2727793*a*dm
      - 0.1530907*a*smoking - 0.1299149*a*egfrLow;
    hf10 = -4.310409 + 0.8998235*a - 0.4559771*sbpLow + 0.3576505*sbpHigh
      + 1.038346*dm + 0.583916*smoking - 0.0072294*bmiLow + 0.2997706*bmiHigh
      + 0.7451638*egfrLow + 0.0557087*egfrHigh + 0.3534442*bptreat
      - 0.0981511*bptreat*sbpHigh - 0.0946663*a*sbpHigh - 0.3581041*a*dm
      - 0.1159453*a*smoking - 0.003878*a*bmiHigh - 0.1884289*a*egfrLow;
    hf30 = -2.205379 + 0.6254374*a - 0.0983038*a*a - 0.3919241*sbpLow + 0.3142295*sbpHigh
      + 0.8330787*dm + 0.3438651*smoking + 0.0594874*bmiLow + 0.2525536*bmiHigh
      + 0.2981642*egfrLow + 0.0667159*egfrHigh + 0.333921*bptreat
      - 0.0893177*bptreat*sbpHigh - 0.0974299*a*sbpHigh - 0.404855*a*dm
      - 0.1982991*a*smoking - 0.0035619*a*bmiHigh - 0.1564215*a*egfrLow;
  } else {
    cvd10 = -3.031168 + 0.7688528*a + 0.0736174*nonHdl - 0.0954431*hdlTerm
      - 0.4347345*sbpLow + 0.3362658*sbpHigh + 0.7692857*dm + 0.4386871*smoking
      + 0.5378979*egfrLow + 0.0164827*egfrHigh + 0.288879*bptreat - 0.1337349*statin
      - 0.0475924*bptreat*sbpHigh + 0.150273*statin*nonHdl - 0.0517874*a*nonHdl
      + 0.0191169*a*hdlTerm - 0.1049477*a*sbpHigh - 0.2251948*a*dm
      - 0.0895067*a*smoking - 0.1543702*a*egfrLow;
    cvd30 = -1.148204 + 0.4627309*a - 0.0984281*a*a + 0.0836088*nonHdl - 0.1029824*hdlTerm
      - 0.2140352*sbpLow + 0.2904325*sbpHigh + 0.5331276*dm + 0.2141914*smoking
      + 0.1155556*egfrLow + 0.0603775*egfrHigh + 0.232714*bptreat - 0.0272112*statin
      - 0.0384488*bptreat*sbpHigh + 0.134192*statin*nonHdl - 0.0511759*a*nonHdl
      + 0.0165865*a*hdlTerm - 0.1101437*a*sbpHigh - 0.2585943*a*dm
      - 0.1566406*a*smoking - 0.1166776*a*egfrLow;
    ascvd10 = -3.500655 + 0.7099847*a + 0.1658663*nonHdl - 0.1144285*hdlTerm
      - 0.2837212*sbpLow + 0.3239977*sbpHigh + 0.7189597*dm + 0.3956973*smoking
      + 0.3690075*egfrLow + 0.0203619*egfrHigh + 0.2036522*bptreat - 0.0865581*statin
      - 0.0322916*bptreat*sbpHigh + 0.114563*statin*nonHdl - 0.0300005*a*nonHdl
      + 0.0232747*a*hdlTerm - 0.0927024*a*sbpHigh - 0.2018525*a*dm
      - 0.0970527*a*smoking - 0.1217081*a*egfrLow;
    ascvd30 = -1.736444 + 0.3994099*a - 0.0937484*a*a + 0.1744643*nonHdl - 0.120203*hdlTerm
      - 0.0665117*sbpLow + 0.2753037*sbpHigh + 0.4790257*dm + 0.1782635*smoking
      - 0.0218789*egfrLow + 0.0602553*egfrHigh + 0.1421182*bptreat + 0.0135996*statin
      - 0.0218265*bptreat*sbpHigh + 0.1013148*statin*nonHdl - 0.0312619*a*nonHdl
      + 0.020673*a*hdlTerm - 0.0920935*a*sbpHigh - 0.2159947*a*dm
      - 0.1548811*a*smoking - 0.0712547*a*egfrLow;
    hf10 = -3.946391 + 0.8972642*a - 0.6811466*sbpLow + 0.3634461*sbpHigh
      + 0.923776*dm + 0.5023736*smoking - 0.0485841*bmiLow + 0.3726929*bmiHigh
      + 0.6926917*egfrLow + 0.0251827*egfrHigh + 0.2980922*bptreat
      - 0.0497731*bptreat*sbpHigh - 0.1289201*a*sbpHigh - 0.3040924*a*dm
      - 0.1401688*a*smoking + 0.0068126*a*bmiHigh - 0.1797778*a*egfrLow;
    hf30 = -1.95751 + 0.5681541*a - 0.1048388*a*a - 0.4761564*sbpLow + 0.30324*sbpHigh
      + 0.6840338*dm + 0.2656273*smoking + 0.0833107*bmiLow + 0.26999*bmiHigh
      + 0.2541805*egfrLow + 0.0638923*egfrHigh + 0.2583631*bptreat
      - 0.0391938*bptreat*sbpHigh - 0.1269124*a*sbpHigh - 0.3273572*a*dm
      - 0.2043019*a*smoking - 0.0182831*a*bmiHigh - 0.1342618*a*egfrLow;
  }

  return {
    egfr,
    risk: {
      CVD10: logisticPercent(cvd10), CVD30: age <= 59 ? logisticPercent(cvd30) : null,
      ASCVD10: logisticPercent(ascvd10), ASCVD30: age <= 59 ? logisticPercent(ascvd30) : null,
      HF10: logisticPercent(hf10), HF30: age <= 59 ? logisticPercent(hf30) : null,
    },
  };
}
