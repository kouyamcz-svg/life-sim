import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const STEPS = ["基本情報", "収支入力", "将来イベント", "リスク確認", "結果"];

const formatMan = (v) => {
  if (Math.abs(v) >= 10000) return `${(v / 10000).toFixed(0)}億円`;
  return `${v.toFixed(0)}万円`;
};

const Slider = ({ label, value, min, max, step = 1, unit = "", onChange, color = "#2563eb" }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const adjust = (delta) => {
    const next = Math.min(max, Math.max(min, Math.round((value + delta) / step) * step));
    onChange(next);
  };
  return (
    <div style={{ marginBottom: 24 }}>
      {/* ラベル行 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 14, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>{label}</span>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: "-0.5px" }}>
          {value.toLocaleString()}<span style={{ fontSize: 13, fontWeight: 600, marginLeft: 2 }}>{unit}</span>
        </span>
      </div>
      {/* ±ボタン＋スライダー */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* マイナスボタン */}
        <button
          onPointerDown={e => { e.preventDefault(); adjust(-step); }}
          style={{
            width: 44, height: 44, borderRadius: 12, border: "2px solid #e2e8f0",
            background: "white", fontSize: 22, fontWeight: 700, color: "#475569",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, userSelect: "none", WebkitUserSelect: "none", touchAction: "manipulation"
          }}>−</button>
        {/* カスタムスライダートラック */}
        <div style={{ flex: 1, position: "relative", height: 44, display: "flex", alignItems: "center" }}>
          {/* トラック背景 */}
          <div style={{ position: "absolute", width: "100%", height: 14, borderRadius: 7, background: "#e2e8f0" }} />
          {/* 塗りつぶし部分 */}
          <div style={{ position: "absolute", width: `${pct}%`, height: 14, borderRadius: 7, background: color, transition: "width 0.05s" }} />
          {/* ネイティブinput（透明・タッチ判定用） */}
          <input
            type="range" min={min} max={max} step={step} value={value}
            onChange={e => onChange(Number(e.target.value))}
            style={{
              position: "absolute", width: "100%", height: 44,
              opacity: 0, cursor: "pointer", margin: 0, padding: 0,
              WebkitAppearance: "none", touchAction: "manipulation"
            }}
          />
          {/* つまみ */}
          <div style={{
            position: "absolute",
            left: `calc(${pct}% - 22px)`,
            width: 44, height: 44, borderRadius: "50%",
            background: "white", border: `3px solid ${color}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            pointerEvents: "none", transition: "left 0.05s"
          }} />
        </div>
        {/* プラスボタン */}
        <button
          onPointerDown={e => { e.preventDefault(); adjust(step); }}
          style={{
            width: 44, height: 44, borderRadius: 12, border: "none",
            background: color, fontSize: 22, fontWeight: 700, color: "white",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, userSelect: "none", WebkitUserSelect: "none", touchAction: "manipulation"
          }}>＋</button>
      </div>
      {/* 最小・最大ラベル */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingLeft: 54, paddingRight: 54 }}>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{min.toLocaleString()}{unit}</span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{max.toLocaleString()}{unit}</span>
      </div>
    </div>
  );
};

// 教育費カード内など狭い場所用のコンパクト版スライダー
const MiniSlider = ({ label, value, min, max, step = 1, unit = "", onChange, color = "#2563eb" }) => {
  const pct = ((value - min) / (max - min)) * 100;
  const adjust = (delta) => {
    const next = Math.min(max, Math.max(min, Math.round((value + delta) / step) * step));
    onChange(next);
  };
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>{value.toLocaleString()}{unit}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onPointerDown={e => { e.preventDefault(); adjust(-step); }} style={{
          width: 38, height: 38, borderRadius: 10, border: "2px solid #e2e8f0",
          background: "white", fontSize: 20, fontWeight: 700, color: "#475569",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, touchAction: "manipulation"
        }}>−</button>
        <div style={{ flex: 1, position: "relative", height: 38, display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", width: "100%", height: 10, borderRadius: 5, background: "#e2e8f0" }} />
          <div style={{ position: "absolute", width: `${pct}%`, height: 10, borderRadius: 5, background: color }} />
          <input type="range" min={min} max={max} step={step} value={value}
            onChange={e => onChange(Number(e.target.value))}
            style={{ position: "absolute", width: "100%", height: 38, opacity: 0, cursor: "pointer", margin: 0, touchAction: "manipulation" }} />
          <div style={{
            position: "absolute", left: `calc(${pct}% - 19px)`,
            width: 38, height: 38, borderRadius: "50%",
            background: "white", border: `3px solid ${color}`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)", pointerEvents: "none"
          }} />
        </div>
        <button onPointerDown={e => { e.preventDefault(); adjust(step); }} style={{
          width: 38, height: 38, borderRadius: 10, border: "none",
          background: color, fontSize: 20, fontWeight: 700, color: "white",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, touchAction: "manipulation"
        }}>＋</button>
      </div>
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", ...style }}>
    {children}
  </div>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 20 }}>
    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>{children}</h3>
    {sub && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>{sub}</p>}
  </div>
);

const Toggle = ({ label, value, onChange }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
    <span style={{ fontSize: 14, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>{label}</span>
    <div onClick={() => onChange(!value)} style={{
      width: 48, height: 26, borderRadius: 13, background: value ? "#2563eb" : "#cbd5e1",
      cursor: "pointer", position: "relative", transition: "background 0.2s"
    }}>
      <div style={{
        position: "absolute", top: 3, left: value ? 25 : 3,
        width: 20, height: 20, borderRadius: "50%", background: "white",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s"
      }} />
    </div>
  </div>
);

export default function LifeSimulator() {
  const [step, setStep] = useState(0);

  // Step1: 基本情報
  const [age, setAge] = useState(32);
  const [spouseAge, setSpouseAge] = useState(30);
  const [hasSpouse, setHasSpouse] = useState(true);
  const [children, setChildren] = useState(1);
  const [retireAge, setRetireAge] = useState(65);

  // Step2: 収支
  const [income, setIncome] = useState(45); // 万円/月
  const [bonus, setBonus] = useState(80); // ボーナス年額（万円）
  const [spouseIncome, setSpouseIncome] = useState(20);
  const [spouseBonus, setSpouseBonus] = useState(30); // 配偶者ボーナス年額
  const [living, setLiving] = useState(25); // 生活費/月
  const [loanAmount, setLoanAmount] = useState(4000); // 万円
  const [loanYears, setLoanYears] = useState(35);
  const [loanRate, setLoanRate] = useState(0.5); // %
  const [savings, setSavings] = useState(500); // 現在の貯蓄
  const [retirement, setRetirement] = useState(1500); // 退職金（万円）
  const [spouseRetirement, setSpouseRetirement] = useState(500); // 配偶者退職金

  // Step3: 将来イベント
  // 子ども別の教育設定（最大4人分）
  const defaultChildEdu = () => ({ currentAge: 0, elementary: "公立", juniorHigh: "公立", highSchool: "公立", university: "国立", extracurricular: 1, juku: 0 });
  const [childEduSettings, setChildEduSettings] = useState([defaultChildEdu()]);
  const [carPurchase, setCarPurchase] = useState(true);
  const [inflationRate, setInflationRate] = useState(1.0); // インフレ率 %/年
  const [renovation, setRenovation] = useState(true);
  const [renovationCost, setRenovationCost] = useState(400); // リフォーム1回あたり万円
  const [renovationCount, setRenovationCount] = useState(2); // リフォーム回数
  const [fixedAssetTax, setFixedAssetTax] = useState(true);
  const [fixedAssetTaxCost, setFixedAssetTaxCost] = useState(12); // 固定資産税 万円/年
  const [fireInsurance, setFireInsurance] = useState(true);
  const [fireInsuranceCost, setFireInsuranceCost] = useState(3); // 火災・地震保険 万円/年
  const [largeRepair, setLargeRepair] = useState(true);
  const [largeRepairCost, setLargeRepairCost] = useState(200); // 外壁・屋根修繕 万円/回
  const [retirementTravel, setRetirementTravel] = useState(true);
  const [familyTrip, setFamilyTrip] = useState(true);
  const [familyTripCost, setFamilyTripCost] = useState(20);

  // 教育費単価（文科省データ準拠・万円/年）
  const EDU_COSTS = {
    elementary: { 公立: 32, 私立: 166 },   // 小学校6年間 → 年額
    juniorHigh:  { 公立: 49, 私立: 141 },   // 中学3年間
    highSchool:  { 公立: 51, 私立: 105 },   // 高校3年間
    university:  { 国立: 82, 私立: 131 },   // 大学4年間（入学金含む）
  };

  const updateChildEdu = (idx, key, val) => {
    setChildEduSettings(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: val };
      return next;
    });
  };

  // 子ども数が変わったらsettingsを同期
  useEffect(() => {
    setChildEduSettings(prev => {
      const next = [...prev];
      while (next.length < children) next.push(defaultChildEdu());
      return next.slice(0, Math.max(children, 1));
    });
  }, [children]);

  // 年金設定
  const [nenkinStartAge, setNenkinStartAge] = useState(65); // 年金受給開始年齢
  const [kosei_years, setKoseiYears] = useState(15); // 現在までの厚生年金加入年数
  const [spouseType, setSpouseType] = useState("会社員"); // 配偶者の就業形態（会社員 / 専業主婦(夫) / パート）

  // 年金額計算（万円/年）
  // 老齢厚生年金: 平均標準報酬月額 × 5.481/1000 × 加入月数（報酬比例部分）
  // 老齢基礎年金: 81.6万円 × 加入月数 / 480（満額81.6万円）
  const calcNenkin = (monthlyIncome, currentAge, retAge, pastYears) => {
    // 手取り→額面に逆換算（おおよそ×1.25）
    const grossMonthly = monthlyIncome * 1.25;
    const futureYears = retAge - currentAge;
    const totalMonths = Math.min((pastYears + futureYears) * 12, 480); // 上限40年
    const koseiMonths = Math.min((pastYears + futureYears) * 12, 480);
    const kosei = grossMonthly * 5.481 / 1000 * koseiMonths; // 万円/年
    const kiso = 81.6 * Math.min(totalMonths, 480) / 480; // 万円/年
    return Math.round((kosei + kiso) * 10) / 10;
  };

  const calcSpouseNenkin = (sIncome, sAge, retAge) => {
    if (spouseType === "専業主婦(夫)") return 81.6; // 基礎年金のみ満額想定
    if (spouseType === "パート") {
      const kiso = 81.6 * 0.7; // 加入期間少なめ想定
      return Math.round(kiso * 10) / 10;
    }
    // 会社員
    const grossMonthly = sIncome * 1.25;
    const years = Math.max(retAge - sAge, 0);
    const months = Math.min(years * 12, 480);
    const kosei = grossMonthly * 5.481 / 1000 * months;
    const kiso = 81.6;
    return Math.round((kosei + kiso) * 10) / 10;
  };

  // Step4: リスク
  const [withInsurance, setWithInsurance] = useState(false);
  const [disabledAge, setDisabledAge] = useState(40);
  const [hasDansin, setHasDansin] = useState(true); // 団体信用生命保険

  // 遺族年金計算
  // 遺族厚生年金: 老齢厚生年金（報酬比例部分）の3/4
  // 遺族基礎年金: 子のある配偶者のみ（子1人：102万円、2人：128万円、3人目以降+6万円）
  // ※ 子のない配偶者には遺族基礎年金は支給されない
  const calcIzokuNenkin = (deceasedIncome, deceasedAge, pastYrs, childCount) => {
    const grossMonthly = deceasedIncome * 1.25;
    // 300ヶ月みなし規定（実加入月数が300未満の場合は300として計算）
    const actualMonths = (pastYrs + Math.max(retireAge - deceasedAge, 0)) * 12;
    const calcMonths = Math.max(actualMonths, 300);
    const koseiBase = grossMonthly * 5.481 / 1000 * Math.min(calcMonths, 480);
    const izokuKosei = koseiBase * 0.75; // 遺族厚生年金
    // 遺族基礎年金（子ありのみ）
    let izokuKiso = 0;
    if (childCount >= 1) {
      izokuKiso = 102; // 1人目：子のある配偶者の加算額含む
      if (childCount >= 2) izokuKiso += 26; // 2人目加算
      if (childCount >= 3) izokuKiso += (childCount - 2) * 6; // 3人目以降
    }
    // 中高齢寡婦加算（40歳以上・子なし配偶者）
    const chukoRei = childCount === 0 ? 59.7 : 0; // 万円/年（令和6年度）
    return {
      izokuKosei: Math.round(izokuKosei * 10) / 10,
      izokuKiso: Math.round(izokuKiso * 10) / 10,
      chukoRei: Math.round(chukoRei * 10) / 10,
      total: Math.round((izokuKosei + izokuKiso) * 10) / 10,
    };
  };

  const [chartData, setChartData] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [summary, setSummary] = useState({});
  const [requiredCoverage, setRequiredCoverage] = useState(null);

  // ローン月返済計算
  const calcMonthlyLoan = () => {
    const r = loanRate / 100 / 12;
    const n = loanYears * 12;
    if (r === 0) return loanAmount / n;
    return loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  };

  useEffect(() => {
    generateData();
  }, [age, spouseAge, hasSpouse, children, retireAge, income, bonus, spouseIncome, spouseBonus, living, loanAmount, loanYears, loanRate, savings, retirement, spouseRetirement, nenkinStartAge, kosei_years, spouseType, inflationRate, childEduSettings, carPurchase, renovation, renovationCost, renovationCount, fixedAssetTax, fixedAssetTaxCost, fireInsurance, fireInsuranceCost, largeRepair, largeRepairCost, retirementTravel, familyTrip, familyTripCost, withInsurance, disabledAge]);

  const generateData = () => {
    const monthlyLoan = calcMonthlyLoan();
    const data = [];
    const rData = [];
    let asset = savings;
    let riskAsset = savings;
    const endAge = 90;

    // 年金額を事前計算
    const myNenkin = calcNenkin(income, age, retireAge, kosei_years); // 万円/年（65歳基準）
    const spNenkin = hasSpouse ? calcSpouseNenkin(spouseIncome, spouseAge, retireAge) : 0;
    // 繰上げ(60〜64歳): 1ヶ月あたり0.4%減 / 繰下げ(66〜75歳): 1ヶ月あたり0.7%増
    const nenkinAdj = (() => {
      const diffMonths = (nenkinStartAge - 65) * 12;
      if (diffMonths < 0) return 1 + diffMonths * 0.004; // 繰上げ
      if (diffMonths > 0) return 1 + diffMonths * 0.007; // 繰下げ
      return 1;
    })();
    const adjMyNenkin = Math.round(myNenkin * nenkinAdj * 10) / 10;
    const adjSpNenkin = Math.round(spNenkin * nenkinAdj * 10) / 10;

    for (let a = age; a <= endAge; a++) {
      const year = a - age;
      // インフレ係数（支出側に年複利で乗算、ローン返済額は固定のため除外）
      const inflFactor = Math.pow(1 + inflationRate / 100, year);
      let annualIncome = 0;
      let annualExpense = (living * inflFactor + monthlyLoan) * 12;

      // 収入の切り替え
      if (a < retireAge) {
        // 現役：月収＋ボーナス
        annualIncome = (income + (hasSpouse ? spouseIncome : 0)) * 12
          + bonus + (hasSpouse ? spouseBonus : 0);
      } else if (a < nenkinStartAge) {
        // 退職後〜年金受給開始前：収入ゼロ（退職金は別途一括加算）
        annualIncome = 0;
      } else {
        // 年金受給開始以降：年金収入のみ
        annualIncome = adjMyNenkin + (hasSpouse ? adjSpNenkin : 0);
      }
      // 退職金（退職年に一括加算）
      if (a === retireAge) {
        asset += retirement + (hasSpouse ? spouseRetirement : 0);
        riskAsset += retirement + (hasSpouse ? spouseRetirement : 0);
      }
      // ローン終了
      if (year >= loanYears) annualExpense -= monthlyLoan * 12;

      // イベント支出
      let eventCost = 0;
      // 教育費（学校段階別・子ども別）
      if (children > 0) {
        for (let c = 0; c < Math.min(children, childEduSettings.length); c++) {
          const cs = childEduSettings[c];
          const childBirthYear = age - (cs.currentAge || 0);
          const childAgeThisYear = a - childBirthYear;
          if (childAgeThisYear >= 6  && childAgeThisYear <= 11) eventCost += EDU_COSTS.elementary[cs.elementary] * inflFactor;
          if (childAgeThisYear >= 12 && childAgeThisYear <= 14) eventCost += EDU_COSTS.juniorHigh[cs.juniorHigh] * inflFactor;
          if (childAgeThisYear >= 15 && childAgeThisYear <= 17) eventCost += EDU_COSTS.highSchool[cs.highSchool] * inflFactor;
          if (childAgeThisYear >= 18 && childAgeThisYear <= 21) eventCost += EDU_COSTS.university[cs.university] * inflFactor;
          if (childAgeThisYear >= 3  && childAgeThisYear <= 17) eventCost += (cs.extracurricular || 0) * 12 * inflFactor;
          if (childAgeThisYear >= 10 && childAgeThisYear <= 17) eventCost += (cs.juku || 0) * 12 * inflFactor;
        }
      }
      // 車購入
      if (carPurchase && (year === 5 || year === 15 || year === 25)) eventCost += 300 * inflFactor;
      // リフォーム
      if (renovation && renovationCount > 0) {
        const interval = Math.floor(40 / renovationCount);
        for (let r = 1; r <= renovationCount; r++) {
          if (year === interval * r) eventCost += renovationCost * inflFactor;
        }
      }
      // 固定資産税（毎年）
      if (fixedAssetTax) eventCost += fixedAssetTaxCost * inflFactor;
      // 火災・地震保険（毎年）
      if (fireInsurance) eventCost += fireInsuranceCost * inflFactor;
      // 外壁・屋根の大規模修繕（築15年・30年）
      if (largeRepair && (year === 15 || year === 30)) eventCost += largeRepairCost * inflFactor;
      // 家族旅行
      if (familyTrip) {
        const hasChildAtHome = children > 0 && childEduSettings.some(cs => {
          const childBirthYear = age - (cs.currentAge || 0);
          const childAgeThisYear = a - childBirthYear;
          return childAgeThisYear >= 0 && childAgeThisYear <= 22;
        });
        if (hasChildAtHome) eventCost += familyTripCost * inflFactor;
        else if (a < retireAge) eventCost += familyTripCost * 0.6 * inflFactor;
      }
      // 退職旅行
      if (retirementTravel && a === retireAge) eventCost += 200 * inflFactor;
      // 老後医療費
      if (a >= 75) eventCost += 100 * inflFactor;

      const netNormal = annualIncome - annualExpense - eventCost;
      asset += netNormal;

      // リスクシナリオ: 就業不能（保険なし）
      let riskNet = netNormal;
      if (a >= disabledAge && a < retireAge) {
        riskNet = annualIncome * (withInsurance ? 0.8 : 0.3) - annualExpense - eventCost;
      }
      riskAsset += riskNet;

      data.push({ age: a, 資産残高: Math.round(asset), ローン残債: Math.round(Math.max(0, loanAmount - (monthlyLoan * 12 * year))) });
      rData.push({ age: a, 通常: Math.round(asset), リスク時: Math.round(riskAsset) });
    }
    setChartData(data);
    setRiskData(rData);

    const peakAsset = Math.max(...data.map(d => d.資産残高));
    const finalAsset = data[data.length - 1].資産残高;
    const negativeAge = data.find(d => d.資産残高 < 0);

    // 必要保障額計算: 就業不能時の収入減少分を補填するために必要な月額
    // 現在収入の70%が就業不能給付の一般的な水準。現状30%しかない場合の不足分を算出
    const monthlyIncome = income + (hasSpouse ? spouseIncome : 0);
    const monthlyExpense = living + monthlyLoan;
    const incomeAfterDisabled = monthlyIncome * 0.3; // 障害年金等で約30%残る想定
    const monthlyShortfall = monthlyExpense - incomeAfterDisabled; // 毎月の不足額
    const yearsToRecover = Math.max(0, retireAge - disabledAge); // 就業不能〜退職までの年数
    const totalShortfall = Math.max(0, monthlyShortfall * 12 * yearsToRecover);
    // 必要月額給付: 不足額をそのまま補填する月額
    const requiredMonthly = Math.max(0, monthlyShortfall);

    setRequiredCoverage({ monthlyShortfall: Math.round(requiredMonthly * 10) / 10, totalShortfall: Math.round(totalShortfall), yearsToRecover });
    setSummary({ peakAsset, finalAsset, negativeAge: negativeAge?.age, monthlyLoan, adjMyNenkin, adjSpNenkin, nenkinAdj });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 13, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>{label}歳</p>
        {payload.map((p, i) => (
          <p key={i} style={{ margin: "2px 0", fontSize: 12, color: p.color, fontFamily: "'Noto Sans JP', sans-serif" }}>
            {p.name}: {formatMan(p.value)}
          </p>
        ))}
      </div>
    );
  };

  // 結果プレビューモーダル
  const [showPreview, setShowPreview] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // プレビューと共通のデータ計算
  const calcReportData = () => {
    const totalNenkin = Math.round(((summary.adjMyNenkin||0) + (hasSpouse ? (summary.adjSpNenkin||0) : 0)) * 10) / 10;
    const intervals = chartData.filter(d => (d.age - age) % 10 === 0);
    const maxVal = Math.max(...intervals.map(d => Math.abs(d.資産残高)), 1);
    const monthlyLoanAmt = calcMonthlyLoan();
    const fullIncome = income + (hasSpouse ? spouseIncome : 0);
    const expTotal = living + monthlyLoanAmt;
    const disShort = Math.max(0, Math.round((expTotal - fullIncome * 0.3)*10)/10);
    const disYrs = Math.max(0, retireAge - disabledAge);
    const disTotal = Math.round(disShort * 12 * disYrs);
    const izoku = calcIzokuNenkin(income, age, kosei_years, children);
    const izokuM = Math.round(izoku.total/12*10)/10;
    const expDeath = hasDansin ? living : living + monthlyLoanAmt;
    const deathShort = Math.max(0, Math.round((expDeath - izokuM)*10)/10);
    const deathYrs = Math.max(0, children > 0 ? 18 - (childEduSettings[0]?.currentAge||0) + (retireAge-age) : retireAge-age);
    const deathTotal = Math.round(deathShort * 12 * deathYrs);
    return { totalNenkin, intervals, maxVal, monthlyLoanAmt, disShort, disYrs, disTotal, izokuM, deathShort, deathYrs, deathTotal, izoku };
  };

  const generatePDF = () => {
    setPdfLoading(true);
    const { totalNenkin, intervals, maxVal, monthlyLoanAmt, disShort, disYrs, disTotal, izokuM, deathShort, deathYrs, deathTotal, izoku } = calcReportData();

    const pageBreak = `<div style="page-break-before:always"></div>`;

    const html = `<!DOCTYPE html><html lang="ja"><head>
    <meta charset="UTF-8"/>
    <title>ライフシミュレーション結果</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;800&display=swap" rel="stylesheet"/>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Noto Sans JP',sans-serif;background:white;color:#1e293b;font-size:11px}
      @media print{.no-print{display:none} @page{margin:8mm} .page{padding:8px}}
      .print-btn{position:fixed;bottom:16px;right:16px;background:#2563eb;color:white;border:none;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(37,99,235,0.4);z-index:999}
      .page{padding:16px;max-width:480px;margin:0 auto}
      .header{background:linear-gradient(135deg,#1e3a5f,#2563eb);color:white;padding:14px 16px;border-radius:10px;margin-bottom:12px}
      .header h1{font-size:17px;font-weight:800}
      .header .sub{font-size:8px;opacity:0.7;letter-spacing:2px;margin-bottom:3px}
      .header .date{font-size:9px;opacity:0.8;margin-top:2px}
      .section{margin-bottom:14px}
      .section-title{font-size:11px;font-weight:800;color:#475569;border-bottom:2px solid #e2e8f0;padding-bottom:3px;margin-bottom:8px}
      .grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}
      .card{border-radius:8px;padding:10px;text-align:center}
      .card .lbl{font-size:8px;color:#64748b;margin-bottom:3px}
      .card .val{font-size:14px;font-weight:800}
      .bar-row{display:flex;align-items:center;gap:6px;margin-bottom:5px}
      .bar-lbl{font-size:9px;color:#64748b;width:28px;flex-shrink:0}
      .bar-track{flex:1;background:#e2e8f0;border-radius:3px;height:11px}
      .bar-fill{height:11px;border-radius:3px}
      .bar-val{font-size:9px;font-weight:700;width:52px;text-align:right;flex-shrink:0}
      table{width:100%;border-collapse:collapse}
      td{padding:4px 6px;font-size:9px;border-bottom:1px solid #f1f5f9}
      td:first-child{color:#64748b;width:38%}
      td:last-child{font-weight:700}
      .comment{border-radius:8px;padding:10px;font-size:10px;line-height:1.7;margin-bottom:10px}
      .footer{font-size:8px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:6px;display:flex;justify-content:space-between;margin-top:10px}
      .risk-box{border-radius:8px;padding:10px;margin-bottom:8px}
      .svg-wrap{background:white;border-radius:8px;padding:8px;margin-top:8px}
    </style></head><body>
    <button class="print-btn no-print" onclick="window.print()">🖨️ PDFとして保存</button>

    <!-- ページ1 -->
    <div class="page">
      <div class="header">
        <div class="sub">ResOne × ライフプランニング</div>
        <h1>住宅購入ライフシミュレーション結果</h1>
        <div class="date">作成日：${new Date().toLocaleDateString("ja-JP")}　　1 / 2</div>
      </div>

      <div class="section">
        <div class="section-title">📊 試算サマリー</div>
        <div class="grid2" style="margin-bottom:8px">
          <div class="card" style="background:${summary.finalAsset>0?"#eff6ff":"#fef2f2"}">
            <div class="lbl">90歳時点の資産</div>
            <div class="val" style="color:${summary.finalAsset>0?"#2563eb":"#dc2626"}">${formatMan(summary.finalAsset)}</div>
          </div>
          <div class="card" style="background:#f0fdf4">
            <div class="lbl">ピーク資産</div>
            <div class="val" style="color:#10b981">${formatMan(summary.peakAsset)}</div>
          </div>
          <div class="card" style="background:#fffbeb">
            <div class="lbl">月々のローン返済</div>
            <div class="val" style="color:#f59e0b">${summary.monthlyLoan?.toFixed(1)}万円</div>
          </div>
          <div class="card" style="background:${summary.negativeAge?"#fef2f2":"#f0fdf4"}">
            <div class="lbl">資産マイナス転落</div>
            <div class="val" style="color:${summary.negativeAge?"#dc2626":"#16a34a"}">${summary.negativeAge?`${summary.negativeAge}歳〜`:"なし ✓"}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">🏛️ 年金受給額（試算）　${nenkinStartAge}歳から受給</div>
        <div class="${hasSpouse?"grid3":"grid2"}">
          <div class="card" style="background:#f0f9ff"><div class="lbl">ご自身</div><div class="val" style="color:#0369a1;font-size:12px">${summary.adjMyNenkin}万円/年</div></div>
          ${hasSpouse?`<div class="card" style="background:#f0f9ff"><div class="lbl">配偶者（${spouseType}）</div><div class="val" style="color:#0369a1;font-size:12px">${summary.adjSpNenkin}万円/年</div></div>`:""}
          <div class="card" style="background:#eff6ff"><div class="lbl">世帯合計</div><div class="val" style="color:#2563eb;font-size:12px">${totalNenkin}万円/年</div></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">📈 資産推移（10年刻み）</div>
        ${intervals.map(d=>{
          const w=Math.round(Math.abs(d.資産残高)/maxVal*100);
          const isPos=d.資産残高>=0;
          return `<div class="bar-row">
            <div class="bar-lbl">${d.age}歳</div>
            <div class="bar-track"><div class="bar-fill" style="width:${w}%;background:${isPos?"#2563eb":"#dc2626"}"></div></div>
            <div class="bar-val" style="color:${isPos?"#2563eb":"#dc2626"}">${formatMan(d.資産残高)}</div>
          </div>`;
        }).join("")}
      </div>

      <div class="section">
        <div class="section-title">📋 入力条件</div>
        <table>
          <tr><td>年齢 / 定年</td><td>${age}歳 / ${retireAge}歳</td></tr>
          <tr><td>月収（手取り）</td><td>${income}万円 ＋ボーナス${bonus}万円/年</td></tr>
          ${hasSpouse?`<tr><td>配偶者収入</td><td>${spouseIncome}万円 ＋ボーナス${spouseBonus}万円/年（${spouseType}）</td></tr>`:""}
          <tr><td>住宅ローン</td><td>${loanAmount}万円 / ${loanYears}年 / 金利${loanRate}%</td></tr>
          <tr><td>現在の貯蓄 / 退職金</td><td>${savings}万円 / ${retirement+(hasSpouse?spouseRetirement:0)}万円</td></tr>
          <tr><td>子ども / 年金受給開始</td><td>${children}人 / ${nenkinStartAge}歳</td></tr>
          <tr><td>インフレ率</td><td>${inflationRate}%/年</td></tr>
        </table>
      </div>

      <div class="comment" style="background:${summary.finalAsset>0?"#eff6ff":"#fef2f2"};color:${summary.finalAsset>0?"#1e40af":"#991b1b"}">
        ${summary.finalAsset>0
          ?`✅ このプランでは老後まで資産がプラスを維持できる見込みです。月々${summary.monthlyLoan?.toFixed(1)}万円の返済も現在の収支から無理なく対応できます。`
          :`⚠️ ${summary.negativeAge}歳頃に資産がマイナスになる可能性があります。保険や貯蓄の見直しで対策できます。`}
      </div>
      <div class="footer">
        <span>※本シミュレーションは概算です。実際のプランニングはFPや専門家にご相談ください。</span>
        <span>ResOne Life Simulator</span>
      </div>
    </div>

    ${pageBreak}

    <!-- ページ2 -->
    <div class="page">
      <div class="header">
        <div class="sub">ResOne × ライフプランニング</div>
        <h1>住宅購入ライフシミュレーション結果</h1>
        <div class="date">作成日：${new Date().toLocaleDateString("ja-JP")}　　2 / 2</div>
      </div>

      <div class="section">
        <div class="section-title">🛡️ 必要保障額の目安</div>

        <!-- 就業不能 -->
        <div class="risk-box" style="background:#fffbeb;border:1px solid #fde68a;margin-bottom:10px">
          <div style="font-size:11px;font-weight:800;color:#92400e;margin-bottom:8px">🏥 就業不能・収入保障保険（${disabledAge}歳で就業不能の場合）</div>
          <div class="grid3" style="margin-bottom:8px">
            <div class="card" style="background:white">
              <div class="lbl">必要月額給付</div>
              <div class="val" style="color:#dc2626;font-size:13px">${disShort>0?`${disShort}万円`:"不要"}</div>
            </div>
            <div class="card" style="background:white">
              <div class="lbl">補填期間</div>
              <div class="val" style="color:#f59e0b;font-size:13px">${disYrs}年間</div>
            </div>
            <div class="card" style="background:white">
              <div class="lbl">総不足額</div>
              <div class="val" style="color:#1e293b;font-size:13px">${disTotal>0?`約${formatMan(disTotal)}`:"-"}</div>
            </div>
          </div>
          <!-- 就業不能グラフ -->
          <div class="svg-wrap">
            <div style="font-size:9px;font-weight:700;color:#92400e;text-align:center;margin-bottom:4px">月次キャッシュフロー比較</div>
            ${(()=>{
              const mi = income+(hasSpouse?spouseIncome:0);
              const di = Math.round(mi*0.3*10)/10;
              const ex = Math.round((living+monthlyLoanAmt)*10)/10;
              const mv = Math.max(mi,ex)*1.1;
              const sc = v=>(v/mv*80);
              const bw=52;const gap=18;const bY=100;const x1=30;const x2=x1+bw+gap;const x3=x2+bw+gap;
              return `<svg viewBox="0 0 260 115" style="width:100%;height:auto">
                <rect x="${x1}" y="${bY-sc(mi)}" width="${bw}" height="${sc(mi)}" rx="3" fill="#2563eb" opacity="0.85"/>
                <text x="${x1+bw/2}" y="${bY-sc(mi)-3}" text-anchor="middle" font-size="8" fill="#1e40af" font-weight="700">${mi}万</text>
                <text x="${x1+bw/2}" y="${bY+10}" text-anchor="middle" font-size="7" fill="#64748b">就業前収入</text>
                <rect x="${x2}" y="${bY-sc(di)}" width="${bw}" height="${sc(di)}" rx="3" fill="#f59e0b" opacity="0.85"/>
                ${disShort>0?`<rect x="${x2}" y="${bY-sc(di)-sc(disShort)}" width="${bw}" height="${sc(disShort)}" rx="3" fill="#dc2626" opacity="0.5"/>
                <text x="${x2+bw/2}" y="${bY-sc(di)-sc(disShort)-3}" text-anchor="middle" font-size="7" fill="#dc2626" font-weight="700">不足${disShort}万</text>`:""}
                <text x="${x2+bw/2}" y="${bY-sc(di)-3}" text-anchor="middle" font-size="8" fill="#92400e" font-weight="700">${di}万</text>
                <text x="${x2+bw/2}" y="${bY+10}" text-anchor="middle" font-size="7" fill="#64748b">障害年金等</text>
                <rect x="${x3}" y="${bY-sc(ex)}" width="${bw}" height="${sc(ex)}" rx="3" fill="#475569" opacity="0.7"/>
                <text x="${x3+bw/2}" y="${bY-sc(ex)-3}" text-anchor="middle" font-size="8" fill="#1e293b" font-weight="700">${ex}万</text>
                <text x="${x3+bw/2}" y="${bY+10}" text-anchor="middle" font-size="7" fill="#64748b">月間支出</text>
                <line x1="10" y1="${bY}" x2="250" y2="${bY}" stroke="#e2e8f0" stroke-width="1.5"/>
              </svg>`;
            })()}
          </div>
          <div style="font-size:8px;color:#92400e;margin-top:4px">※障害年金（収入の約30%）を考慮済み</div>
        </div>

        <!-- 死亡 -->
        <div class="risk-box" style="background:#fff1f2;border:1px solid #fda4af">
          <div style="font-size:11px;font-weight:800;color:#9f1239;margin-bottom:8px">💐 死亡保険・収入保障保険（団信${hasDansin?"あり":"なし"}）</div>
          <div class="grid3" style="margin-bottom:8px">
            <div class="card" style="background:white">
              <div class="lbl">遺族年金（月）</div>
              <div class="val" style="color:#9f1239;font-size:13px">${izokuM}万円</div>
            </div>
            <div class="card" style="background:white">
              <div class="lbl">月間不足額</div>
              <div class="val" style="color:${deathShort>0?"#dc2626":"#16a34a"};font-size:13px">${deathShort>0?`-${deathShort}万円`:"不足なし"}</div>
            </div>
            <div class="card" style="background:white">
              <div class="lbl">総不足額</div>
              <div class="val" style="color:#1e293b;font-size:13px">${deathShort>0?`約${formatMan(Math.round(deathShort*12*deathYrs))}`:"-"}</div>
            </div>
          </div>
          <!-- 死亡グラフ -->
          <div class="svg-wrap">
            <div style="font-size:9px;font-weight:700;color:#9f1239;text-align:center;margin-bottom:4px">死亡後の月次収支比較</div>
            ${(()=>{
              const exp = Math.round(expDeath*10)/10;
              const mv = Math.max(izokuM,exp)*1.15;
              const sc = v=>(v/mv*80);
              const bw=52;const gap=18;const bY=100;const x1=30;const x2=x1+bw+gap;const x3=x2+bw+gap;
              return `<svg viewBox="0 0 260 115" style="width:100%;height:auto">
                <rect x="${x1}" y="${bY-sc(izokuM)}" width="${bw}" height="${sc(izokuM)}" rx="3" fill="#9f1239" opacity="0.8"/>
                <text x="${x1+bw/2}" y="${bY-sc(izokuM)-3}" text-anchor="middle" font-size="8" fill="#9f1239" font-weight="700">${izokuM}万</text>
                <text x="${x1+bw/2}" y="${bY+10}" text-anchor="middle" font-size="7" fill="#64748b">遺族年金</text>
                <rect x="${x2}" y="${bY-sc(living)}" width="${bw}" height="${sc(living)}" rx="3" fill="#475569" opacity="0.7"/>
                ${!hasDansin?`<rect x="${x2}" y="${bY-sc(living)-sc(monthlyLoanAmt)}" width="${bw}" height="${sc(monthlyLoanAmt)}" rx="3" fill="#f59e0b" opacity="0.7"/>`:""}
                <text x="${x2+bw/2}" y="${bY-sc(exp)-3}" text-anchor="middle" font-size="8" fill="#1e293b" font-weight="700">${exp}万</text>
                <text x="${x2+bw/2}" y="${bY+10}" text-anchor="middle" font-size="7" fill="#64748b">${hasDansin?"生活費":"生活費+ローン"}</text>
                ${deathShort>0
                  ?`<rect x="${x3}" y="${bY-sc(deathShort)}" width="${bw}" height="${sc(deathShort)}" rx="3" fill="#dc2626" opacity="0.85"/>
                    <text x="${x3+bw/2}" y="${bY-sc(deathShort)-3}" text-anchor="middle" font-size="8" fill="#dc2626" font-weight="700">${deathShort}万/月</text>
                    <text x="${x3+bw/2}" y="${bY+10}" text-anchor="middle" font-size="7" fill="#64748b">月間不足</text>`
                  :`<rect x="${x3}" y="${bY-sc(Math.abs(izokuM-exp))}" width="${bw}" height="${sc(Math.abs(izokuM-exp))}" rx="3" fill="#16a34a" opacity="0.7"/>
                    <text x="${x3+bw/2}" y="${bY-sc(Math.abs(izokuM-exp))-3}" text-anchor="middle" font-size="8" fill="#16a34a" font-weight="700">余剰あり</text>
                    <text x="${x3+bw/2}" y="${bY+10}" text-anchor="middle" font-size="7" fill="#64748b">月間余剰</text>`}
                <line x1="10" y1="${bY}" x2="250" y2="${bY}" stroke="#e2e8f0" stroke-width="1.5"/>
              </svg>`;
            })()}
          </div>
          <div style="font-size:8px;color:#9f1239;margin-top:4px">※${hasDansin?"団信によりローン残債は免除。":"団信なしのためローン返済継続。"}遺族厚生年金＋${children>0?"遺族基礎年金":"中高齢寡婦加算"}を考慮。</div>
        </div>
      </div>

      <div class="footer">
        <span>※本シミュレーションは概算です。実際のプランニングはFPや専門家にご相談ください。</span>
        <span>ResOne Life Simulator</span>
      </div>
    </div>
    </body></html>`;

    // 同ページのdocumentを直接書き換えて表示（Safari対応）
    document.open();
    document.write(html);
    document.close();
    setPdfLoading(false);
  };

  const [pdfUrl, setPdfUrl] = useState(null);
  const generatePDFPreview = () => setShowPreview(true);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <SectionTitle sub="お客様の基本的な状況を確認します">👤 基本情報</SectionTitle>
            <Slider label="現在の年齢" value={age} min={25} max={55} unit="歳" onChange={setAge} />
            <Toggle label="配偶者がいる" value={hasSpouse} onChange={setHasSpouse} />
            {hasSpouse && <Slider label="配偶者の年齢" value={spouseAge} min={20} max={55} unit="歳" onChange={setSpouseAge} color="#ec4899" />}
            <Slider label="お子様の人数" value={children} min={0} max={4} unit="人" onChange={setChildren} color="#10b981" />
            <Slider label="定年退職予定" value={retireAge} min={55} max={70} unit="歳" onChange={setRetireAge} color="#f59e0b" />

            <div style={{ height: 1, background: "#f1f5f9", margin: "4px 0 20px" }} />
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12, fontFamily: "'Noto Sans JP', sans-serif" }}>🏛️ 年金設定</p>

            <Slider label="現在までの厚生年金加入年数" value={kosei_years} min={0} max={40} unit="年" onChange={setKoseiYears} color="#0891b2" />
            <Slider label="年金受給開始年齢" value={nenkinStartAge} min={60} max={75} unit="歳" onChange={setNenkinStartAge} color="#0891b2" />

            {/* 繰上げ/繰下げ表示 */}
            <div style={{ background: nenkinStartAge < 65 ? "#fef2f2" : nenkinStartAge > 65 ? "#f0fdf4" : "#f0f9ff", border: `1px solid ${nenkinStartAge < 65 ? "#fecaca" : nenkinStartAge > 65 ? "#86efac" : "#bae6fd"}`, borderRadius: 10, padding: 12, marginTop: -12, marginBottom: 16 }}>
              <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 700, color: nenkinStartAge < 65 ? "#dc2626" : nenkinStartAge > 65 ? "#16a34a" : "#0369a1", fontFamily: "'Noto Sans JP', sans-serif" }}>
                {nenkinStartAge < 65 ? `⚠️ 繰上げ受給（${(nenkinStartAge - 65) * 12}ヶ月）：${Math.round((1 + (nenkinStartAge - 65) * 12 * 0.004) * 100 - 100)}%減額`
                  : nenkinStartAge > 65 ? `✅ 繰下げ受給（+${(nenkinStartAge - 65) * 12}ヶ月）：+${Math.round((nenkinStartAge - 65) * 12 * 0.7)}%増額`
                  : "📌 標準受給（65歳）"}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#475569", fontFamily: "'Noto Sans JP', sans-serif" }}>
                試算年金額：<strong>{calcNenkin(income, age, retireAge, kosei_years)}万円/年</strong>
                　→ 受給額：<strong style={{ color: "#0369a1" }}>
                  {Math.round(calcNenkin(income, age, retireAge, kosei_years) * (() => { const d = (nenkinStartAge - 65) * 12; return d < 0 ? 1 + d * 0.004 : 1 + d * 0.007; })() * 10) / 10}万円/年
                </strong>
                {hasSpouse && <span>　配偶者：<strong style={{ color: "#db2777" }}>{Math.round(calcSpouseNenkin(spouseIncome, spouseAge, retireAge) * (() => { const d = (nenkinStartAge - 65) * 12; return d < 0 ? 1 + d * 0.004 : 1 + d * 0.007; })() * 10) / 10}万円/年</strong></span>}
              </p>
            </div>

            {hasSpouse && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontFamily: "'Noto Sans JP', sans-serif" }}>配偶者の就業形態</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {["会社員", "パート", "専業主婦(夫)"].map(t => (
                    <button key={t} onClick={() => setSpouseType(t)} style={{
                      flex: 1, padding: "8px 4px", borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: "pointer",
                      border: spouseType === t ? "2px solid #ec4899" : "2px solid #e2e8f0",
                      background: spouseType === t ? "#fdf2f8" : "white",
                      color: spouseType === t ? "#db2777" : "#94a3b8",
                      fontFamily: "'Noto Sans JP', sans-serif"
                    }}>{t}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div>
            <SectionTitle sub="現在の収支と住宅ローンを入力します">💰 収支・ローン情報</SectionTitle>
            <Slider label="月収（手取り）" value={income} min={15} max={100} unit="万円" onChange={setIncome} />
            <Slider label="ボーナス（年額・手取り）" value={bonus} min={0} max={300} step={5} unit="万円" onChange={setBonus} color="#2563eb" />
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: 10, marginTop: -12, marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 12, color: "#1d4ed8", fontFamily: "'Noto Sans JP', sans-serif" }}>
                年収（手取り）：<strong>{(income * 12 + bonus).toLocaleString()}万円</strong>
                {hasSpouse && <span>　配偶者：<strong>{(spouseIncome * 12 + spouseBonus).toLocaleString()}万円</strong></span>}
              </p>
            </div>
            {hasSpouse && <>
              <Slider label="配偶者の月収（手取り）" value={spouseIncome} min={0} max={60} unit="万円" onChange={setSpouseIncome} color="#ec4899" />
              <Slider label="配偶者のボーナス（年額・手取り）" value={spouseBonus} min={0} max={200} step={5} unit="万円" onChange={setSpouseBonus} color="#ec4899" />
            </>}
            <Slider label="月々の生活費" value={living} min={10} max={60} unit="万円" onChange={setLiving} color="#10b981" />
            <div style={{ height: 1, background: "#f1f5f9", margin: "20px 0" }} />
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12, fontFamily: "'Noto Sans JP', sans-serif" }}>🏠 住宅ローン</p>
            <Slider label="借入額" value={loanAmount} min={1000} max={8000} step={100} unit="万円" onChange={setLoanAmount} color="#f59e0b" />
            <Slider label="返済期間" value={loanYears} min={10} max={50} unit="年" onChange={setLoanYears} color="#f59e0b" />
            <Slider label="金利（変動）" value={loanRate} min={0.1} max={3.0} step={0.1} unit="%" onChange={setLoanRate} color="#f59e0b" />
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 12, marginTop: 8 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#92400e", fontFamily: "'Noto Sans JP', sans-serif" }}>
                月々の返済額：<strong>{Math.round(calcMonthlyLoan()).toLocaleString()}万円</strong>
              </p>
            </div>
            <Slider label="現在の貯蓄" value={savings} min={0} max={3000} step={50} unit="万円" onChange={setSavings} color="#6366f1" />
            <div style={{ height: 1, background: "#f1f5f9", margin: "4px 0 20px" }} />
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12, fontFamily: "'Noto Sans JP', sans-serif" }}>🎁 退職金（定年時に一括受取）</p>
            <Slider label="ご自身の退職金" value={retirement} min={0} max={5000} step={100} unit="万円" onChange={setRetirement} color="#6366f1" />
            {hasSpouse && <Slider label="配偶者の退職金" value={spouseRetirement} min={0} max={3000} step={100} unit="万円" onChange={setSpouseRetirement} color="#ec4899" />}
            <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 10, padding: 12 }}>
              <p style={{ margin: 0, fontSize: 12, color: "#5b21b6", fontFamily: "'Noto Sans JP', sans-serif" }}>
                退職時受取合計：<strong>{(retirement + (hasSpouse ? spouseRetirement : 0)).toLocaleString()}万円</strong>
                　（{retireAge}歳時に資産へ一括加算）
              </p>
            </div>

            <div style={{ height: 1, background: "#f1f5f9", margin: "20px 0" }} />
            <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12, fontFamily: "'Noto Sans JP', sans-serif" }}>📈 インフレ率</p>
            <Slider label="年間インフレ率" value={inflationRate} min={0} max={5} step={0.1} unit="%" onChange={setInflationRate} color="#dc2626" />
            <div style={{ background: inflationRate === 0 ? "#f8fafc" : inflationRate <= 1 ? "#fff7ed" : inflationRate <= 2 ? "#fef2f2" : "#fef2f2", border: `1px solid ${inflationRate === 0 ? "#e2e8f0" : inflationRate <= 1 ? "#fed7aa" : "#fecaca"}`, borderRadius: 10, padding: 12 }}>
              <p style={{ margin: 0, fontSize: 12, color: inflationRate === 0 ? "#64748b" : "#92400e", fontFamily: "'Noto Sans JP', sans-serif" }}>
                {inflationRate === 0 ? "インフレなし（名目値で計算）" : `年${inflationRate}%のインフレを想定 — 30年後の支出は現在の約${(Math.pow(1 + inflationRate / 100, 30) * 100).toFixed(0)}%に`}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                ※ 生活費・教育費・各イベント支出に反映。ローン返済額は固定のため除外。
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <SectionTitle sub="将来の大きな支出を設定してください">📅 ライフイベント</SectionTitle>

            {/* 教育費セクション */}
            {children > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 800, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  🎒 教育費の設定
                </p>
                {Array.from({ length: children }).map((_, idx) => {
                  const cs = childEduSettings[idx] || defaultChildEdu();
                  const totalEdu =
                    EDU_COSTS.elementary[cs.elementary] * 6 +
                    EDU_COSTS.juniorHigh[cs.juniorHigh] * 3 +
                    EDU_COSTS.highSchool[cs.highSchool] * 3 +
                    EDU_COSTS.university[cs.university] * 4 +
                    (cs.extracurricular * 12 * 14) + // 3〜17歳の14年
                    (cs.juku * 12 * 8); // 小4〜高3の8年
                  return (
                    <div key={idx} style={{ background: "#f8faff", border: "1px solid #dbeafe", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontWeight: 800, fontSize: 14, color: "#2563eb", fontFamily: "'Noto Sans JP', sans-serif" }}>
                          第{idx + 1}子
                        </span>
                        <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                          教育費合計：<strong style={{ color: "#dc2626" }}>約{Math.round(totalEdu).toLocaleString()}万円</strong>
                        </span>
                      </div>

                      {/* 現在の年齢 */}
                      <MiniSlider label="現在の年齢" value={cs.currentAge} min={0} max={17} unit="歳"
                        onChange={v => updateChildEdu(idx, "currentAge", v)} color="#2563eb" />

                      {/* 学校種別グリッド */}
                      {[
                        { key: "elementary", label: "小学校", opts: ["公立", "私立"], costs: EDU_COSTS.elementary, years: 6 },
                        { key: "juniorHigh",  label: "中学校", opts: ["公立", "私立"], costs: EDU_COSTS.juniorHigh, years: 3 },
                        { key: "highSchool",  label: "高　校", opts: ["公立", "私立"], costs: EDU_COSTS.highSchool, years: 3 },
                        { key: "university",  label: "大　学", opts: ["国立", "私立"], costs: EDU_COSTS.university, years: 4 },
                      ].map(({ key, label, opts, costs, years }) => (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 12, color: "#475569", width: 40, flexShrink: 0, fontFamily: "'Noto Sans JP', sans-serif" }}>{label}</span>
                          <div style={{ display: "flex", gap: 6, flex: 1 }}>
                            {opts.map(opt => (
                              <button key={opt} onClick={() => updateChildEdu(idx, key, opt)} style={{
                                flex: 1, padding: "10px 0", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                                border: cs[key] === opt ? "2px solid #2563eb" : "2px solid #e2e8f0",
                                background: cs[key] === opt ? "#eff6ff" : "white",
                                color: cs[key] === opt ? "#2563eb" : "#94a3b8",
                                fontFamily: "'Noto Sans JP', sans-serif"
                              }}>{opt}</button>
                            ))}
                          </div>
                          <span style={{ fontSize: 10, color: "#94a3b8", width: 54, textAlign: "right", flexShrink: 0, fontFamily: "'Noto Sans JP', sans-serif" }}>
                            年{costs[cs[key]]}万×{years}年
                          </span>
                        </div>
                      ))}

                      {/* 習い事・塾 */}
                      <div style={{ height: 1, background: "#dbeafe", margin: "12px 0" }} />
                      <MiniSlider label="🎵 習い事（月額）" value={cs.extracurricular} min={0} max={10} step={0.5} unit="万円"
                        onChange={v => updateChildEdu(idx, "extracurricular", v)} color="#10b981" />
                      <MiniSlider label="📚 塾（月額・小4〜高3）" value={cs.juku} min={0} max={15} step={0.5} unit="万円"
                        onChange={v => updateChildEdu(idx, "juku", v)} color="#f59e0b" />
                    </div>
                  );
                })}

                {/* 教育費合計サマリー */}
                <div style={{ background: "#eff6ff", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>子ども{children}人分の教育費総額（概算）</p>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#2563eb", fontFamily: "'Noto Sans JP', sans-serif" }}>
                    約{Math.round(Array.from({ length: children }).reduce((sum, _, idx) => {
                      const cs = childEduSettings[idx] || defaultChildEdu();
                      return sum +
                        EDU_COSTS.elementary[cs.elementary] * 6 +
                        EDU_COSTS.juniorHigh[cs.juniorHigh] * 3 +
                        EDU_COSTS.highSchool[cs.highSchool] * 3 +
                        EDU_COSTS.university[cs.university] * 4 +
                        cs.extracurricular * 12 * 14 +
                        cs.juku * 12 * 8;
                    }, 0)).toLocaleString()}万円
                  </p>
                </div>
              </div>
            )}

            <div style={{ height: 1, background: "#f1f5f9", margin: "4px 0 16px" }} />

            {/* 住宅維持費セクション */}
            <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>🏠 住宅維持費</p>

            {/* 固定資産税 */}
            <Toggle label="固定資産税（毎年）" value={fixedAssetTax} onChange={setFixedAssetTax} />
            {fixedAssetTax && (
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", margin: "-4px 0 8px" }}>
                <MiniSlider label="年額" value={fixedAssetTaxCost} min={5} max={40} step={1} unit="万円" onChange={setFixedAssetTaxCost} color="#64748b" />
              </div>
            )}

            {/* 火災・地震保険 */}
            <Toggle label="火災・地震保険（毎年）" value={fireInsurance} onChange={setFireInsurance} />
            {fireInsurance && (
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", margin: "-4px 0 8px" }}>
                <MiniSlider label="年額" value={fireInsuranceCost} min={1} max={15} step={0.5} unit="万円" onChange={setFireInsuranceCost} color="#f59e0b" />
              </div>
            )}

            {/* 外壁・屋根修繕 */}
            <Toggle label="外壁・屋根の大規模修繕（築15年・30年）" value={largeRepair} onChange={setLargeRepair} />
            {largeRepair && (
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", margin: "-4px 0 8px" }}>
                <MiniSlider label="1回あたり" value={largeRepairCost} min={50} max={500} step={50} unit="万円" onChange={setLargeRepairCost} color="#92400e" />
              </div>
            )}

            {/* リフォーム */}
            <Toggle label="室内リフォーム" value={renovation} onChange={setRenovation} />
            {renovation && (
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", margin: "-4px 0 8px" }}>
                <MiniSlider label="1回あたり" value={renovationCost} min={100} max={1000} step={50} unit="万円" onChange={setRenovationCost} color="#2563eb" />
                <MiniSlider label="回数" value={renovationCount} min={1} max={4} step={1} unit="回" onChange={setRenovationCount} color="#2563eb" />
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  合計：<strong>{renovationCost * renovationCount}万円</strong>（40年間に均等配置）
                </p>
              </div>
            )}

            <div style={{ height: 1, background: "#f1f5f9", margin: "12px 0 16px" }} />
            <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>🚗 その他</p>
            <Toggle label="自動車の買い替え（5年・15年・25年後）" value={carPurchase} onChange={setCarPurchase} />
            <Toggle label="退職後の旅行・趣味費用（200万円）" value={retirementTravel} onChange={setRetirementTravel} />
            <Toggle label="✈️ 家族旅行（毎年）" value={familyTrip} onChange={setFamilyTrip} />
            {familyTrip && (
              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "12px 14px", marginTop: 4 }}>
                <MiniSlider label="年間旅行予算" value={familyTripCost} min={5} max={100} step={5} unit="万円" onChange={setFamilyTripCost} color="#0ea5e9" />
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#0369a1", lineHeight: 1.5, fontFamily: "'Noto Sans JP', sans-serif" }}>
                  ※ お子様が独立後（23歳〜）は夫婦2人分として60%で計上
                </p>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <SectionTitle sub="万が一の場合にどうなるかを確認します">⚠️ リスクシナリオ</SectionTitle>

            {/* 就業不能シナリオ */}
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14, color: "#dc2626", fontFamily: "'Noto Sans JP', sans-serif" }}>
                シナリオ①：就業不能になった場合
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#7f1d1d", fontFamily: "'Noto Sans JP', sans-serif" }}>
                傷病等により収入が大幅に減少するケースを想定します（障害年金等で収入の約30%が残る前提）
              </p>
            </div>
            <Slider label="就業不能になる年齢" value={disabledAge} min={age + 1} max={retireAge - 1} unit="歳" onChange={setDisabledAge} color="#dc2626" />
            <Toggle label="就業不能保険・収入保障保険あり" value={withInsurance} onChange={setWithInsurance} />

            {/* 必要保障額ボックス */}
            {requiredCoverage && (
              <div style={{ marginTop: 20, background: withInsurance ? "#f0fdf4" : "#fffbeb", border: `1px solid ${withInsurance ? "#86efac" : "#fde68a"}`, borderRadius: 12, padding: 16 }}>
                <p style={{ margin: "0 0 10px", fontWeight: 800, fontSize: 14, color: withInsurance ? "#166534" : "#92400e", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  🛡️ 就業不能保険の必要保障額
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "white", borderRadius: 10, padding: 12, textAlign: "center" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 10, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>必要な月額給付</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#dc2626", fontFamily: "'Noto Sans JP', sans-serif" }}>
                      {requiredCoverage.monthlyShortfall > 0 ? `${requiredCoverage.monthlyShortfall.toFixed(1)}万円` : "不要"}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 10, color: "#94a3b8", fontFamily: "'Noto Sans JP', sans-serif" }}>／月</p>
                  </div>
                  <div style={{ background: "white", borderRadius: 10, padding: 12, textAlign: "center" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 10, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>補填が必要な期間</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#f59e0b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                      {requiredCoverage.yearsToRecover}年間
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 10, color: "#94a3b8", fontFamily: "'Noto Sans JP', sans-serif" }}>{disabledAge}歳〜{retireAge}歳</p>
                  </div>
                </div>
                <div style={{ marginTop: 10, background: "white", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 10, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>就業不能時の総不足額（累計）</p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {requiredCoverage.totalShortfall > 0 ? `約${formatMan(requiredCoverage.totalShortfall)}` : "カバー済み ✓"}
                  </p>
                </div>
                <p style={{ margin: "10px 0 0", fontSize: 11, color: "#64748b", lineHeight: 1.6, fontFamily: "'Noto Sans JP', sans-serif" }}>
                  ※ 月収・生活費・ローン返済額から算出。障害年金（収入の約30%）を考慮済み。
                </p>
              </div>
            )}

            {/* 遺族年金セクション */}
            {(() => {
              const izoku = calcIzokuNenkin(income, age, kosei_years, children);
              const monthlyTotal = Math.round(izoku.total / 12 * 10) / 10;
              const monthlyLoanAmt = calcMonthlyLoan();
              // 団信あり→死亡時はローン返済不要
              const monthlyExpense = hasDansin ? living : living + monthlyLoanAmt;
              const monthlyShortfall = Math.max(0, monthlyExpense - monthlyTotal);
              // ローン残債（現時点）
              const currentLoanBalance = Math.round(Math.max(0, loanAmount - monthlyLoanAmt * 12 * 0)); // 現時点残債≒借入額
              // 末子が18歳になるまでの年数
              const youngestChildAge = children > 0
                ? Math.min(...Array.from({ length: children }, (_, i) => childEduSettings[i]?.currentAge ?? 0))
                : 0;
              const izokuKisoYears = children > 0 ? Math.max(0, 18 - youngestChildAge) : 0;

              return (
                <div style={{ marginTop: 24 }}>
                  <div style={{ background: "#4c0519", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                    <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 14, color: "white", fontFamily: "'Noto Sans JP', sans-serif" }}>
                      シナリオ②：ご自身が亡くなった場合
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: "#fda4af", fontFamily: "'Noto Sans JP', sans-serif" }}>
                      残された家族が受け取れる遺族年金を試算します
                    </p>
                  </div>

                  {/* 団信トグル */}
                  <div style={{ background: hasDansin ? "#f0fdf4" : "#fef2f2", border: `1px solid ${hasDansin ? "#86efac" : "#fecaca"}`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ margin: "0 0 2px", fontWeight: 800, fontSize: 13, color: hasDansin ? "#166534" : "#991b1b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                          🏠 団体信用生命保険（団信）
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                          {hasDansin
                            ? `死亡時にローン残債（約${loanAmount.toLocaleString()}万円）が全額免除されます`
                            : "団信なしの場合、遺族がローンを引き継ぎます"}
                        </p>
                      </div>
                      <div onClick={() => setHasDansin(!hasDansin)} style={{
                        width: 48, height: 26, borderRadius: 13, background: hasDansin ? "#16a34a" : "#cbd5e1",
                        cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0, marginLeft: 12
                      }}>
                        <div style={{
                          position: "absolute", top: 3, left: hasDansin ? 25 : 3,
                          width: 20, height: 20, borderRadius: "50%", background: "white",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s"
                        }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "#fff1f2", border: "1px solid #fda4af", borderRadius: 12, padding: 16 }}>
                    <p style={{ margin: "0 0 12px", fontWeight: 800, fontSize: 14, color: "#9f1239", fontFamily: "'Noto Sans JP', sans-serif" }}>
                      💐 遺族年金の試算（配偶者が受取人）
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                      <div style={{ background: "white", borderRadius: 10, padding: 12, textAlign: "center" }}>
                        <p style={{ margin: "0 0 2px", fontSize: 10, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>遺族厚生年金</p>
                        <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#9f1239", fontFamily: "'Noto Sans JP', sans-serif" }}>{izoku.izokuKosei}万円</p>
                        <p style={{ margin: 0, fontSize: 9, color: "#94a3b8", fontFamily: "'Noto Sans JP', sans-serif" }}>年額（終身）</p>
                      </div>
                      <div style={{ background: "white", borderRadius: 10, padding: 12, textAlign: "center" }}>
                        <p style={{ margin: "0 0 2px", fontSize: 10, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                          {children > 0 ? "遺族基礎年金" : "中高齢寡婦加算"}
                        </p>
                        <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#be185d", fontFamily: "'Noto Sans JP', sans-serif" }}>
                          {children > 0 ? izoku.izokuKiso : izoku.chukoRei}万円
                        </p>
                        <p style={{ margin: 0, fontSize: 9, color: "#94a3b8", fontFamily: "'Noto Sans JP', sans-serif" }}>
                          {children > 0 ? `年額（末子18歳まで約${izokuKisoYears}年間）` : "年額（40〜65歳）"}
                        </p>
                      </div>
                    </div>

                    {/* 合計と月額 */}
                    <div style={{ background: "white", borderRadius: 10, padding: 12, marginBottom: 12, textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px", fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                        当面の受取合計（{children > 0 ? "末子18歳まで" : "中高齢加算含む"}）
                      </p>
                      <p style={{ margin: "0 0 2px", fontSize: 22, fontWeight: 800, color: "#9f1239", fontFamily: "'Noto Sans JP', sans-serif" }}>
                        {izoku.total}万円／年
                      </p>
                      <p style={{ margin: 0, fontSize: 13, color: "#475569", fontFamily: "'Noto Sans JP', sans-serif" }}>
                        月額換算：<strong>{monthlyTotal}万円／月</strong>
                      </p>
                    </div>

                    {/* 生活費との比較 */}
                    <div style={{ background: monthlyShortfall > 0 ? "#fef2f2" : "#f0fdf4", borderRadius: 10, padding: 12 }}>
                      <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 12, color: monthlyShortfall > 0 ? "#dc2626" : "#16a34a", fontFamily: "'Noto Sans JP', sans-serif" }}>
                        {monthlyShortfall > 0 ? "⚠️ 生活費との差額（毎月の不足）" : "✅ 生活費を遺族年金でカバーできます"}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                        <div style={{ textAlign: "center" }}>
                          <p style={{ margin: "0 0 2px", fontSize: 9, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                            月間生活費{hasDansin ? "" : "+ローン"}
                          </p>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>{Math.round(monthlyExpense * 10) / 10}万円</p>
                          {hasDansin && <p style={{ margin: 0, fontSize: 9, color: "#16a34a", fontFamily: "'Noto Sans JP', sans-serif" }}>団信でローン免除</p>}
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <p style={{ margin: "0 0 2px", fontSize: 9, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>遺族年金（月）</p>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#9f1239", fontFamily: "'Noto Sans JP', sans-serif" }}>{monthlyTotal}万円</p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <p style={{ margin: "0 0 2px", fontSize: 9, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>月間不足額</p>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: monthlyShortfall > 0 ? "#dc2626" : "#16a34a", fontFamily: "'Noto Sans JP', sans-serif" }}>
                            {monthlyShortfall > 0 ? `-${Math.round(monthlyShortfall * 10) / 10}万円` : "不足なし"}
                          </p>
                        </div>
                      </div>
                      {monthlyShortfall > 0 && (
                        <p style={{ margin: "8px 0 0", fontSize: 11, color: "#7f1d1d", lineHeight: 1.6, fontFamily: "'Noto Sans JP', sans-serif" }}>
                          → 月{Math.round(monthlyShortfall * 10) / 10}万円の不足を補うために、<strong>死亡保険（収入保障保険）</strong>の加入を検討してください。
                        </p>
                      )}
                    </div>

                    <p style={{ margin: "10px 0 0", fontSize: 10, color: "#94a3b8", lineHeight: 1.6, fontFamily: "'Noto Sans JP', sans-serif" }}>
                      ※ 厚生年金の300ヶ月みなし規定を適用。子は18歳年度末（高校卒業）まで対象。配偶者の年収が850万円未満の場合に受給可能。実際の金額は年金事務所にご確認ください。
                    </p>
                  </div>
                </div>
              );
            })()}

            <div style={{ height: 16 }} />
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={riskData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gNormal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="age" tick={{ fontSize: 10 }} tickFormatter={v => `${v}歳`} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 100).toFixed(0)}百万`} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="通常" stroke="#2563eb" strokeWidth={2} fill="url(#gNormal)" name="通常" />
                <Area type="monotone" dataKey="リスク時" stroke="#dc2626" strokeWidth={2} fill="url(#gRisk)" name="リスク時" />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 3, background: "#2563eb", borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>通常シナリオ</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 3, background: "#dc2626", borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>リスク時（{withInsurance ? "保険あり" : "保険なし"}）</span>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <SectionTitle sub="シミュレーション結果のまとめ">📊 ライフシミュレーション結果</SectionTitle>

            {/* サマリーカード */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: summary.finalAsset > 0 ? "#eff6ff" : "#fef2f2", borderRadius: 12, padding: 14, textAlign: "center" }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>90歳時点の資産</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: summary.finalAsset > 0 ? "#2563eb" : "#dc2626", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {formatMan(summary.finalAsset)}
                </p>
              </div>
              <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 14, textAlign: "center" }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>ピーク資産</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#10b981", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {formatMan(summary.peakAsset)}
                </p>
              </div>
              <div style={{ background: "#fffbeb", borderRadius: 12, padding: 14, textAlign: "center" }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>月々のローン返済</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#f59e0b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {summary.monthlyLoan ? `${summary.monthlyLoan.toFixed(1)}万円` : "-"}
                </p>
              </div>
              <div style={{ background: summary.negativeAge ? "#fef2f2" : "#f0fdf4", borderRadius: 12, padding: 14, textAlign: "center" }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>資産マイナス転落</p>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: summary.negativeAge ? "#dc2626" : "#10b981", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {summary.negativeAge ? `${summary.negativeAge}歳〜` : "なし ✓"}
                </p>
              </div>
            </div>

            {/* 年金サマリー */}
            <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: 14, marginBottom: 20 }}>
              <p style={{ margin: "0 0 10px", fontWeight: 800, fontSize: 13, color: "#0369a1", fontFamily: "'Noto Sans JP', sans-serif" }}>
                🏛️ 年金受給額（試算）　{nenkinStartAge}歳から受給
                {nenkinStartAge !== 65 && <span style={{ fontSize: 11, marginLeft: 6, color: nenkinStartAge < 65 ? "#dc2626" : "#16a34a" }}>
                  ({nenkinStartAge < 65 ? `${Math.round((1 - (65 - nenkinStartAge) * 12 * 0.004) * 100)}%` : `+${Math.round((nenkinStartAge - 65) * 12 * 0.7)}%`})
                </span>}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: hasSpouse ? "1fr 1fr 1fr" : "1fr 1fr", gap: 8 }}>
                <div style={{ background: "white", borderRadius: 10, padding: 10, textAlign: "center" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 10, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>ご自身</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0369a1", fontFamily: "'Noto Sans JP', sans-serif" }}>{summary.adjMyNenkin}万円</p>
                  <p style={{ margin: 0, fontSize: 9, color: "#94a3b8", fontFamily: "'Noto Sans JP', sans-serif" }}>年額</p>
                </div>
                {hasSpouse && <div style={{ background: "white", borderRadius: 10, padding: 10, textAlign: "center" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 10, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>配偶者（{spouseType}）</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#db2777", fontFamily: "'Noto Sans JP', sans-serif" }}>{summary.adjSpNenkin}万円</p>
                  <p style={{ margin: 0, fontSize: 9, color: "#94a3b8", fontFamily: "'Noto Sans JP', sans-serif" }}>年額</p>
                </div>}
                <div style={{ background: "#eff6ff", borderRadius: 10, padding: 10, textAlign: "center" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 10, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>世帯合計</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {Math.round(((summary.adjMyNenkin || 0) + (hasSpouse ? (summary.adjSpNenkin || 0) : 0)) * 10) / 10}万円
                  </p>
                  <p style={{ margin: 0, fontSize: 9, color: "#94a3b8", fontFamily: "'Noto Sans JP', sans-serif" }}>年額 / 月{Math.round(((summary.adjMyNenkin || 0) + (hasSpouse ? (summary.adjSpNenkin || 0) : 0)) / 12 * 10) / 10}万円</p>
                </div>
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 10, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>
                ※ 厚生年金（報酬比例部分）＋老齢基礎年金をもとに試算。実際の受給額はねんきん定期便でご確認ください。
              </p>
            </div>

            {/* メイングラフ */}
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gAsset" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="age" tick={{ fontSize: 10 }} tickFormatter={v => `${v}歳`} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 100).toFixed(0)}百万`} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#dc2626" strokeDasharray="4 4" label={{ value: "±0", fill: "#dc2626", fontSize: 10 }} />
                <Area type="monotone" dataKey="資産残高" stroke="#2563eb" strokeWidth={2.5} fill="url(#gAsset)" name="資産残高" />
              </AreaChart>
            </ResponsiveContainer>

            {/* コメント */}
            <div style={{ marginTop: 16, background: summary.finalAsset > 0 ? "#eff6ff" : "#fef2f2", borderRadius: 12, padding: 16 }}>
              <p style={{ margin: 0, fontSize: 13, color: summary.finalAsset > 0 ? "#1e40af" : "#991b1b", lineHeight: 1.7, fontFamily: "'Noto Sans JP', sans-serif" }}>
                {summary.finalAsset > 0
                  ? `✅ このプランでは老後まで資産がプラスを維持できる見込みです。月々${summary.monthlyLoan?.toFixed(1)}万円の返済も現在の収支から無理なく対応できます。`
                  : `⚠️ ${summary.negativeAge}歳頃に資産がマイナスになる可能性があります。保険や貯蓄の見直しで対策できます。`}
              </p>
            </div>

            {/* ボタン2つ */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={generatePDFPreview} style={{
                flex: 1, padding: "14px 0", borderRadius: 14, border: "2px solid #2563eb",
                background: "white", fontSize: 13, fontWeight: 700, color: "#2563eb",
                cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif",
              }}>📋 画面で確認</button>
              <button onClick={generatePDF} disabled={pdfLoading} style={{
                flex: 1, padding: "14px 0", borderRadius: 14, border: "none",
                background: pdfLoading ? "#e2e8f0" : "linear-gradient(135deg, #dc2626, #b91c1c)",
                fontSize: 13, fontWeight: 800, color: pdfLoading ? "#94a3b8" : "white",
                cursor: pdfLoading ? "not-allowed" : "pointer",
                boxShadow: pdfLoading ? "none" : "0 4px 14px rgba(220,38,38,0.35)",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}>{pdfLoading ? "⏳ 生成中..." : "📄 PDFで保存"}</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f0fdf4 100%)",
      fontFamily: "'Noto Sans JP', sans-serif",
      padding: "0 0 40px"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;800&display=swap" rel="stylesheet" />

      {/* 結果プレビューモーダル */}
      {showPreview && (() => {
        const totalNenkin = Math.round(((summary.adjMyNenkin || 0) + (hasSpouse ? (summary.adjSpNenkin || 0) : 0)) * 10) / 10;
        const intervals = chartData.filter(d => (d.age - age) % 10 === 0);
        const maxVal = Math.max(...intervals.map(d => Math.abs(d.資産残高)), 1);
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, overflowY: "auto" }}>
            <div style={{ background: "white", margin: "0 auto", maxWidth: 480, minHeight: "100vh" }}>
              {/* モーダルヘッダー */}
              <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", padding: "16px 20px", color: "white", position: "sticky", top: 0, zIndex: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: 9, opacity: 0.7, letterSpacing: 2, fontFamily: "'Noto Sans JP', sans-serif" }}>ResOne × ライフプランニング</p>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, fontFamily: "'Noto Sans JP', sans-serif" }}>試算結果レポート</h2>
                    <p style={{ margin: "2px 0 0", fontSize: 10, opacity: 0.8, fontFamily: "'Noto Sans JP', sans-serif" }}>{new Date().toLocaleDateString("ja-JP")} 作成</p>
                  </div>
                  <button onClick={() => setShowPreview(false)} style={{
                    width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.2)",
                    color: "white", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>✕</button>
                </div>
                <p style={{ margin: "10px 0 0", fontSize: 11, opacity: 0.85, background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 10px", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  📸 スクリーンショットで保存 または 上部メニュー「共有」からPDF出力できます
                </p>
              </div>

              <div style={{ padding: 16 }}>
                {/* サマリー */}
                <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: "#475569", borderBottom: "2px solid #e2e8f0", paddingBottom: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>📊 試算サマリー</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[
                    { label: "90歳時点の資産", value: formatMan(summary.finalAsset), bg: summary.finalAsset > 0 ? "#eff6ff" : "#fef2f2", color: summary.finalAsset > 0 ? "#2563eb" : "#dc2626" },
                    { label: "ピーク資産", value: formatMan(summary.peakAsset), bg: "#f0fdf4", color: "#10b981" },
                    { label: "月々のローン返済", value: `${summary.monthlyLoan?.toFixed(1)}万円`, bg: "#fffbeb", color: "#f59e0b" },
                    { label: "資産マイナス転落", value: summary.negativeAge ? `${summary.negativeAge}歳〜` : "なし ✓", bg: summary.negativeAge ? "#fef2f2" : "#f0fdf4", color: summary.negativeAge ? "#dc2626" : "#16a34a" },
                  ].map((c, i) => (
                    <div key={i} style={{ background: c.bg, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px", fontSize: 9, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>{c.label}</p>
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: c.color, fontFamily: "'Noto Sans JP', sans-serif" }}>{c.value}</p>
                    </div>
                  ))}
                </div>

                {/* 年金 */}
                <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: "#475569", borderBottom: "2px solid #e2e8f0", paddingBottom: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>🏛️ 年金受給額（{nenkinStartAge}歳〜）</p>
                <div style={{ display: "grid", gridTemplateColumns: hasSpouse ? "1fr 1fr 1fr" : "1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[
                    { label: "ご自身", value: `${summary.adjMyNenkin}万円/年` },
                    ...(hasSpouse ? [{ label: `配偶者（${spouseType}）`, value: `${summary.adjSpNenkin}万円/年` }] : []),
                    { label: "世帯合計", value: `${totalNenkin}万円/年` },
                  ].map((n, i) => (
                    <div key={i} style={{ background: "#f0f9ff", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px", fontSize: 9, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>{n.label}</p>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#0369a1", fontFamily: "'Noto Sans JP', sans-serif" }}>{n.value}</p>
                    </div>
                  ))}
                </div>

                {/* 資産推移バーグラフ */}
                <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: "#475569", borderBottom: "2px solid #e2e8f0", paddingBottom: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>📈 資産推移（10年刻み）</p>
                <div style={{ marginBottom: 16 }}>
                  {intervals.map((d, i) => {
                    const w = Math.round(Math.abs(d.資産残高) / maxVal * 100);
                    const isPos = d.資産残高 >= 0;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, color: "#64748b", width: 34, flexShrink: 0, fontFamily: "'Noto Sans JP', sans-serif" }}>{d.age}歳</span>
                        <div style={{ flex: 1, background: "#e2e8f0", borderRadius: 4, height: 14 }}>
                          <div style={{ width: `${w}%`, height: 14, background: isPos ? "#2563eb" : "#dc2626", borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: isPos ? "#2563eb" : "#dc2626", width: 58, textAlign: "right", flexShrink: 0, fontFamily: "'Noto Sans JP', sans-serif" }}>{formatMan(d.資産残高)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* 入力条件 */}
                <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: "#475569", borderBottom: "2px solid #e2e8f0", paddingBottom: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>📋 入力条件</p>
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12, marginBottom: 16 }}>
                  {[
                    ["年齢 / 定年", `${age}歳 / ${retireAge}歳`],
                    ["月収（手取り）", `${income}万円 + ボーナス${bonus}万円/年`],
                    ...(hasSpouse ? [["配偶者収入", `${spouseIncome}万円 + ボーナス${spouseBonus}万円/年（${spouseType}）`]] : []),
                    ["住宅ローン", `${loanAmount}万円 / ${loanYears}年 / ${loanRate}%`],
                    ["現在の貯蓄", `${savings}万円`],
                    ["退職金（合計）", `${retirement + (hasSpouse ? spouseRetirement : 0)}万円`],
                    ["子ども", `${children}人`],
                    ["年金受給開始", `${nenkinStartAge}歳`],
                    ["インフレ率", `${inflationRate}%/年`],
                  ].map(([label, val], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: 10, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>{label}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* 総評 */}
                <div style={{ borderRadius: 10, padding: 12, marginBottom: 16, background: summary.finalAsset > 0 ? "#eff6ff" : "#fef2f2" }}>
                  <p style={{ margin: 0, fontSize: 12, color: summary.finalAsset > 0 ? "#1e40af" : "#991b1b", lineHeight: 1.7, fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {summary.finalAsset > 0
                      ? `✅ このプランでは老後まで資産がプラスを維持できる見込みです。月々${summary.monthlyLoan?.toFixed(1)}万円の返済も現在の収支から無理なく対応できます。`
                      : `⚠️ ${summary.negativeAge}歳頃に資産がマイナスになる可能性があります。保険や貯蓄の見直しで対策できます。`}
                  </p>
                </div>

                {/* 必要保障額 */}
                {(() => {
                  // ── 就業不能 ──
                  const monthlyIncome = income + (hasSpouse ? spouseIncome : 0);
                  const monthlyLoanAmt = calcMonthlyLoan();
                  const monthlyExpenseTotal = living + monthlyLoanAmt;
                  const incomeAfterDisabled = monthlyIncome * 0.3;
                  const disabledShortfall = Math.max(0, Math.round((monthlyExpenseTotal - incomeAfterDisabled) * 10) / 10);
                  const disabledYears = Math.max(0, retireAge - disabledAge);
                  const disabledTotal = Math.round(disabledShortfall * 12 * disabledYears);

                  // ── 死亡 ──
                  const izoku = calcIzokuNenkin(income, age, kosei_years, children);
                  const izokuMonthly = Math.round(izoku.total / 12 * 10) / 10;
                  const expenseAfterDeath = hasDansin ? living : living + monthlyLoanAmt;
                  const deathShortfall = Math.max(0, Math.round((expenseAfterDeath - izokuMonthly) * 10) / 10);
                  // 末子独立まで or 配偶者65歳まで
                  const youngestAge = children > 0 ? Math.min(...Array.from({ length: children }, (_, i) => childEduSettings[i]?.currentAge ?? 0)) : 0;
                  const deathYears = Math.max(0, children > 0 ? 18 - youngestAge + (retireAge - age) : retireAge - age);
                  const deathTotal = Math.round(deathShortfall * 12 * deathYears);

                  return (
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: "#475569", borderBottom: "2px solid #e2e8f0", paddingBottom: 4, fontFamily: "'Noto Sans JP', sans-serif" }}>🛡️ 必要保障額の目安</p>

                      {/* 就業不能 */}
                      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 12, marginBottom: 8 }}>
                        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: "#92400e", fontFamily: "'Noto Sans JP', sans-serif" }}>
                          🏥 就業不能・収入保障保険　（{disabledAge}歳で就業不能の場合）
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
                          <div style={{ background: "white", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                            <p style={{ margin: "0 0 2px", fontSize: 9, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>必要月額給付</p>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#dc2626", fontFamily: "'Noto Sans JP', sans-serif" }}>{disabledShortfall > 0 ? `${disabledShortfall}万円` : "不要"}</p>
                          </div>
                          <div style={{ background: "white", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                            <p style={{ margin: "0 0 2px", fontSize: 9, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>補填期間</p>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#f59e0b", fontFamily: "'Noto Sans JP', sans-serif" }}>{disabledYears}年間</p>
                          </div>
                          <div style={{ background: "white", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                            <p style={{ margin: "0 0 2px", fontSize: 9, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>総不足額</p>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>{disabledTotal > 0 ? `約${formatMan(disabledTotal)}` : "不要"}</p>
                          </div>
                        </div>

                        {/* 就業不能グラフ：月収 vs 支出の積み上げ比較 */}
                        {(() => {
                          const fullIncome = income + (hasSpouse ? spouseIncome : 0);
                          const disabledIncome = Math.round(fullIncome * 0.3 * 10) / 10;
                          const maxV = Math.max(fullIncome, monthlyExpenseTotal) * 1.1;
                          const bw = 56; const gap = 20; const svgW = 300; const svgH = 130; const baseY = 110;
                          const scale = (v) => (v / maxV) * 95;
                          // 棒の中心X
                          const x1 = 50; const x2 = x1 + bw + gap; const x3 = x2 + bw + gap;
                          return (
                            <div style={{ background: "white", borderRadius: 8, padding: "10px 8px 4px" }}>
                              <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "#92400e", fontFamily: "'Noto Sans JP', sans-serif", textAlign: "center" }}>月次キャッシュフロー比較</p>
                              <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height: "auto" }}>
                                {/* 就業前収入 */}
                                <rect x={x1} y={baseY - scale(fullIncome)} width={bw} height={scale(fullIncome)} rx="4" fill="#2563eb" opacity="0.85" />
                                <text x={x1 + bw/2} y={baseY - scale(fullIncome) - 4} textAnchor="middle" fontSize="9" fill="#1e40af" fontWeight="700">{fullIncome}万円</text>
                                <text x={x1 + bw/2} y={baseY + 12} textAnchor="middle" fontSize="8" fill="#64748b">就業前収入</text>

                                {/* 就業不能後収入 */}
                                <rect x={x2} y={baseY - scale(disabledIncome)} width={bw} height={scale(disabledIncome)} rx="4" fill="#f59e0b" opacity="0.85" />
                                {disabledShortfall > 0 && (
                                  <>
                                    <rect x={x2} y={baseY - scale(disabledIncome) - scale(disabledShortfall)} width={bw} height={scale(disabledShortfall)} rx="4" fill="#dc2626" opacity="0.5"
                                      strokeDasharray="3,2" stroke="#dc2626" strokeWidth="1" />
                                    <text x={x2 + bw/2} y={baseY - scale(disabledIncome) - scale(disabledShortfall) - 4} textAnchor="middle" fontSize="8" fill="#dc2626" fontWeight="700">不足{disabledShortfall}万</text>
                                  </>
                                )}
                                <text x={x2 + bw/2} y={baseY - scale(disabledIncome) - 4} textAnchor="middle" fontSize="9" fill="#92400e" fontWeight="700">{disabledIncome}万円</text>
                                <text x={x2 + bw/2} y={baseY + 12} textAnchor="middle" fontSize="8" fill="#64748b">障害年金等</text>

                                {/* 月支出 */}
                                <rect x={x3} y={baseY - scale(monthlyExpenseTotal)} width={bw} height={scale(monthlyExpenseTotal)} rx="4" fill="#475569" opacity="0.7" />
                                <text x={x3 + bw/2} y={baseY - scale(monthlyExpenseTotal) - 4} textAnchor="middle" fontSize="9" fill="#1e293b" fontWeight="700">{Math.round(monthlyExpenseTotal * 10)/10}万円</text>
                                <text x={x3 + bw/2} y={baseY + 12} textAnchor="middle" fontSize="8" fill="#64748b">月間支出</text>

                                {/* 基線 */}
                                <line x1="10" y1={baseY} x2={svgW - 10} y2={baseY} stroke="#e2e8f0" strokeWidth="1.5" />
                              </svg>
                              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 2 }}>
                                {[["#2563eb","就業前収入"],["#f59e0b","障害年金等"],["#dc2626","不足分"],["#475569","月間支出"]].map(([c,l]) => (
                                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                                    <span style={{ fontSize: 8, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>{l}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                        <p style={{ margin: "8px 0 0", fontSize: 9, color: "#92400e", fontFamily: "'Noto Sans JP', sans-serif" }}>
                          ※障害年金（収入の約30%）を考慮。ローン返済{disabledShortfall > 0 ? "含む" : "除く"}。
                        </p>
                      </div>

                      {/* 死亡 */}
                      <div style={{ background: "#fff1f2", border: "1px solid #fda4af", borderRadius: 10, padding: 12 }}>
                        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: "#9f1239", fontFamily: "'Noto Sans JP', sans-serif" }}>
                          💐 死亡保険・収入保障保険　（団信{hasDansin ? "あり" : "なし"}）
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
                          <div style={{ background: "white", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                            <p style={{ margin: "0 0 2px", fontSize: 9, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>遺族年金（月）</p>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#9f1239", fontFamily: "'Noto Sans JP', sans-serif" }}>{izokuMonthly}万円</p>
                          </div>
                          <div style={{ background: "white", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                            <p style={{ margin: "0 0 2px", fontSize: 9, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>月間不足額</p>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: deathShortfall > 0 ? "#dc2626" : "#16a34a", fontFamily: "'Noto Sans JP', sans-serif" }}>{deathShortfall > 0 ? `-${deathShortfall}万円` : "不足なし"}</p>
                          </div>
                          <div style={{ background: "white", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                            <p style={{ margin: "0 0 2px", fontSize: 9, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>総不足額</p>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1e293b", fontFamily: "'Noto Sans JP', sans-serif" }}>{deathTotal > 0 ? `約${formatMan(deathTotal)}` : "不足なし"}</p>
                          </div>
                        </div>

                        {/* 死亡グラフ：遺族年金 vs 生活費の積み上げ比較 */}
                        {(() => {
                          const maxV = Math.max(izokuMonthly, expenseAfterDeath) * 1.15;
                          const bw = 56; const gap = 20; const svgW = 300; const svgH = 130; const baseY = 110;
                          const scale = (v) => (v / maxV) * 95;
                          const x1 = 50; const x2 = x1 + bw + gap; const x3 = x2 + bw + gap;
                          return (
                            <div style={{ background: "white", borderRadius: 8, padding: "10px 8px 4px" }}>
                              <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "#9f1239", fontFamily: "'Noto Sans JP', sans-serif", textAlign: "center" }}>死亡後の月次収支比較</p>
                              <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height: "auto" }}>
                                {/* 遺族年金 */}
                                <rect x={x1} y={baseY - scale(izokuMonthly)} width={bw} height={scale(izokuMonthly)} rx="4" fill="#9f1239" opacity="0.8" />
                                <text x={x1 + bw/2} y={baseY - scale(izokuMonthly) - 4} textAnchor="middle" fontSize="9" fill="#9f1239" fontWeight="700">{izokuMonthly}万円</text>
                                <text x={x1 + bw/2} y={baseY + 12} textAnchor="middle" fontSize="8" fill="#64748b">遺族年金</text>

                                {/* 生活費（団信考慮済み） */}
                                <rect x={x2} y={baseY - scale(living)} width={bw} height={scale(living)} rx="4" fill="#475569" opacity="0.7" />
                                {!hasDansin && (
                                  <rect x={x2} y={baseY - scale(living) - scale(calcMonthlyLoan())} width={bw} height={scale(calcMonthlyLoan())} rx="4" fill="#f59e0b" opacity="0.7" />
                                )}
                                <text x={x2 + bw/2} y={baseY - scale(expenseAfterDeath) - 4} textAnchor="middle" fontSize="9" fill="#1e293b" fontWeight="700">{Math.round(expenseAfterDeath*10)/10}万円</text>
                                <text x={x2 + bw/2} y={baseY + 12} textAnchor="middle" fontSize="8" fill="#64748b">{hasDansin ? "生活費" : "生活費+ローン"}</text>

                                {/* 不足分 */}
                                {deathShortfall > 0 && (
                                  <>
                                    <rect x={x3} y={baseY - scale(deathShortfall)} width={bw} height={scale(deathShortfall)} rx="4" fill="#dc2626" opacity="0.85" />
                                    <text x={x3 + bw/2} y={baseY - scale(deathShortfall) - 4} textAnchor="middle" fontSize="9" fill="#dc2626" fontWeight="700">{deathShortfall}万円/月</text>
                                  </>
                                )}
                                {deathShortfall === 0 && (
                                  <>
                                    <rect x={x3} y={baseY - scale(Math.abs(izokuMonthly - expenseAfterDeath))} width={bw} height={scale(Math.abs(izokuMonthly - expenseAfterDeath))} rx="4" fill="#16a34a" opacity="0.7" />
                                    <text x={x3 + bw/2} y={baseY - scale(Math.abs(izokuMonthly - expenseAfterDeath)) - 4} textAnchor="middle" fontSize="9" fill="#16a34a" fontWeight="700">余剰あり</text>
                                  </>
                                )}
                                <text x={x3 + bw/2} y={baseY + 12} textAnchor="middle" fontSize="8" fill="#64748b">{deathShortfall > 0 ? "月間不足" : "月間余剰"}</text>

                                {/* 基線 */}
                                <line x1="10" y1={baseY} x2={svgW - 10} y2={baseY} stroke="#e2e8f0" strokeWidth="1.5" />
                              </svg>
                              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 2 }}>
                                {[["#9f1239","遺族年金"],["#475569","生活費"],["#f59e0b","ローン返済"],["#dc2626","不足分"]].map(([c,l]) => (
                                  <div key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                                    <span style={{ fontSize: 8, color: "#64748b", fontFamily: "'Noto Sans JP', sans-serif" }}>{l}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                        <p style={{ margin: "8px 0 0", fontSize: 9, color: "#9f1239", fontFamily: "'Noto Sans JP', sans-serif" }}>
                          ※ {hasDansin ? "団信によりローン残債は免除。" : "団信なしのためローン返済継続。"}遺族厚生年金＋{children > 0 ? "遺族基礎年金" : "中高齢寡婦加算"}を考慮。
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <p style={{ fontSize: 9, color: "#94a3b8", lineHeight: 1.6, fontFamily: "'Noto Sans JP', sans-serif" }}>
                  ※本シミュレーションは概算です。実際のプランニングはFPや専門家にご相談ください。　ResOne Life Simulator
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* PDF iframeモーダル */}
      {pdfUrl && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#1e3a5f", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: 14, fontFamily: "'Noto Sans JP', sans-serif" }}>📄 試算結果レポート</span>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={pdfUrl} download={`LifeSim_${age}歳_${new Date().toLocaleDateString("ja-JP").replace(/\//g,"-")}.html`}
                style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "none", fontFamily: "'Noto Sans JP', sans-serif" }}>
                ⬇️ 保存
              </a>
              <button onClick={() => { URL.revokeObjectURL(pdfUrl); setPdfUrl(null); }} style={{
                background: "rgba(255,255,255,0.2)", color: "white", border: "none", padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif"
              }}>✕ 閉じる</button>
            </div>
          </div>
          <iframe src={pdfUrl} style={{ flex: 1, border: "none", background: "white" }} title="PDF Preview" />
        </div>
      )}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
        padding: "20px 24px 16px",
        color: "white"
      }}>
        <p style={{ margin: "0 0 2px", fontSize: 11, opacity: 0.7, letterSpacing: 2 }}>ResOne × ライフプランニング</p>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>住宅購入ライフシミュレーター</h1>
      </div>

      {/* ステップバー */}
      <div style={{ display: "flex", padding: "16px 24px 0", gap: 4 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: i <= step ? "pointer" : "default" }}
            onClick={() => i <= step && setStep(i)}>
            <div style={{
              width: "100%", height: 4, borderRadius: 2,
              background: i <= step ? "#2563eb" : "#e2e8f0",
              transition: "background 0.3s"
            }} />
            <span style={{ fontSize: 9, color: i === step ? "#2563eb" : "#94a3b8", fontWeight: i === step ? 700 : 400 }}>{s}</span>
          </div>
        ))}
      </div>

      {/* コンテンツ */}
      <div style={{ padding: "16px 24px 0" }}>
        <Card>{renderStep()}</Card>
      </div>

      {/* ナビゲーション */}
      <div style={{ display: "flex", gap: 12, padding: "16px 24px 0" }}>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} style={{
            flex: 1, padding: "14px 0", borderRadius: 12, border: "2px solid #e2e8f0",
            background: "white", fontSize: 15, fontWeight: 700, color: "#64748b", cursor: "pointer",
            fontFamily: "'Noto Sans JP', sans-serif"
          }}>← 戻る</button>
        )}
        {step < STEPS.length - 1 && (
          <button onClick={() => setStep(step + 1)} style={{
            flex: 2, padding: "14px 0", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            fontSize: 15, fontWeight: 800, color: "white", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(37,99,235,0.3)", fontFamily: "'Noto Sans JP', sans-serif"
          }}>次へ →</button>
        )}
        {step === STEPS.length - 1 && (
          <button onClick={() => setStep(0)} style={{
            flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg, #10b981, #059669)",
            fontSize: 14, fontWeight: 800, color: "white", cursor: "pointer",
            fontFamily: "'Noto Sans JP', sans-serif"
          }}>🔄 最初からやり直す</button>
        )}
      </div>
    </div>
  );
}
