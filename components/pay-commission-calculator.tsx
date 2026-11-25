"use client";

import { useState } from "react";
import "./pay-commission-calculator.css";

const presets = [1.98, 2.57, 3, 3.83];
const formatCurrency = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export function PayCommissionCalculator() {
  const [basicPay, setBasicPay] = useState(30000);
  const [factor, setFactor] = useState(2.57);
  const revisedPay = Math.max(0, basicPay) * Math.max(0, factor);
  const increase = revisedPay - Math.max(0, basicPay);

  return <section className="pay-calculator" aria-labelledby="pay-calculator-title"><div><p className="eyebrow">Estimate tool</p><h2 id="pay-calculator-title">8वां वेतन आयोग वेतन कैलकुलेटर</h2><p>वर्तमान basic pay और अपनी अनुमानित fitment factor डालकर सांकेतिक revised basic pay देखें।</p></div><div className="calculator-grid"><label>वर्तमान Basic Pay<input type="number" min="0" step="1" inputMode="numeric" value={basicPay || ""} onChange={event => setBasicPay(Number(event.target.value))} /></label><label>अनुमानित Fitment Factor<input type="number" min="0" step="0.01" value={factor || ""} onChange={event => setFactor(Number(event.target.value))} /></label></div><div className="factor-options" aria-label="Fitment factor suggestions">{presets.map(value => <button key={value} type="button" className={factor === value ? "active" : ""} onClick={() => setFactor(value)}>× {value}</button>)}</div><div className="calculator-result" aria-live="polite"><span>सांकेतिक Revised Basic Pay</span><strong>{formatCurrency(revisedPay)}</strong><small>मौजूदा basic pay से अंतर: {formatCurrency(increase)}</small></div><p className="calculator-note"><strong>महत्वपूर्ण:</strong> यह केवल अनुमान है। 8वें वेतन आयोग का कोई आधिकारिक fitment factor या लागू वेतन आदेश घोषित नहीं माना गया है। वास्तविक वेतन सरकार के अंतिम नियम, pay matrix और अन्य लागू प्रावधानों से तय होगा।</p></section>;
}
