import { useState } from "react";

const inputLabels = {
  English: {
    title: "Enter your symptoms",
    placeholder: "e.g. fever, headache, chest pain",
    languageLabel: "Language",
    regionLabel: "Region (Optional)",
    analyzeButton: "Analyze",
  },
  Hindi: {
    title: "अपने लक्षण दर्ज करें",
    placeholder: "जैसे बुखार, सिरदर्द, सीने में दर्द",
    languageLabel: "भाषा",
    regionLabel: "क्षेत्र (वैकल्पिक)",
    analyzeButton: "विश्लेषण करें",
  },
  Telugu: {
    title: "మీ లక్షణాలను నమోదు చేయండి",
    placeholder: "ఉ.దా. జ్వరం, తలనొప్పి, ఛాతి నొప్పి",
    languageLabel: "భాష",
    regionLabel: "ప్రాంతం (ఐచ్ఛికం)",
    analyzeButton: "విశ్లేషించు",
  },
};

const REGIONS = [
  "Andhra Pradesh",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Telangana",
  "Delhi",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
];

function InputBox({ onSubmit, disabled, language = "English", onLanguageChange }) {
  const [symptoms, setSymptoms] = useState("");
  const [region, setRegion] = useState("");
  const labels = inputLabels[language];

  const handleSubmit = () => {
    const trimmedSymptoms = symptoms.trim();
    if (!trimmedSymptoms || disabled) {
      return;
    }

    onSubmit({
      symptoms: trimmedSymptoms,
      region,
    });
  };

  const handleLanguageChange = (e) => {
    onLanguageChange(e.target.value);
  };

  return (
    <div className="input-section">
      <h2 className="section-title">{labels.title}</h2>
      <textarea
        rows="5"
        placeholder={labels.placeholder}
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        className="symptoms-textarea"
        disabled={disabled}
      />

      <div className="input-row">
        <label htmlFor="region" className="input-label">
          {labels.regionLabel}
        </label>
        <select
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="language-select"
          disabled={disabled}
        >
          <option value="">Select Region...</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="input-row">
        <label htmlFor="language" className="input-label">
          {labels.languageLabel}
        </label>
        <select
          id="language"
          value={language}
          onChange={handleLanguageChange}
          className="language-select"
          disabled={disabled}
        >
          <option value="English">English</option>
          <option value="Hindi">हिंदी</option>
          <option value="Telugu">తెలుగు</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="analyze-button"
        disabled={disabled || !symptoms.trim()}
      >
        {labels.analyzeButton}
      </button>
    </div>
  );
}

export default InputBox;