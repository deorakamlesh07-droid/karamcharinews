import "./da-chart.css";

const data = [
  { label: "6वां वेतन आयोग", value: 125, note: "DA merger स्तर" },
  { label: "राजस्थान का वर्तमान DA", value: 63, note: "1 जुलाई 2026 से लागू" },
];

export function DaChart() {
  const max = 140;
  return <section className="da-chart" aria-label="DA प्रतिशत तुलना चार्ट">
    <div className="da-chart-copy"><p className="eyebrow">Rajasthan DA tracker</p><h2>राजस्थान DA प्रतिशत एक नजर में</h2><p>राजस्थान में RCS (Revised Pay) Rules, 2017 के अंतर्गत DA 63% है, जो 1 जुलाई 2026 से लागू है।</p></div>
    <div className="chart-bars">{data.map((item) => <div className="chart-row" key={item.label}><div className="chart-label"><b>{item.label}</b><small>{item.note}</small></div><div className="chart-track"><div className="chart-fill" style={{ width: `${(item.value / max) * 100}%` }}><span>{item.value}%</span></div></div></div>)}</div>
    <p className="chart-footnote">स्रोत: राजस्थान वित्त विभाग (Rules Division), आदेश सं. F.6(3)FD(Rules)/2017, दिनांक 30 अक्टूबर 2026 — DA 60% से बढ़ाकर 63%। 125% यहां 6वें वेतन आयोग के DA merger संदर्भ के रूप में दिखाया गया है।</p>
  </section>;
}
