import { useState, useEffect } from "react";
import InputBox from "./components/InputBox";
import ResultCard from "./components/ResultCard";
import Dashboard from "./components/Dashboard";
import { HospitalsTab } from "./components/HospitalsTab";
import { HealthTipsTab } from "./components/HealthTipsTab";
import { EmergencyAlert } from "./components/EmergencyAlert";
import { RiskVisualization } from "./components/RiskVisualization";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useOfflineMode } from "./hooks/useOffline";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const translations = {
  English: {
    title: "MediAssist",
    subtitle: "Enter symptoms to get AI-powered triage guidance.",
    analyzing: "Analyzing...",
    disclaimer:
      "This is not a medical diagnosis tool. Please consult a doctor.",
    triageTab: "Triage",
    dashboardTab: "Analytics",
    hospitalsTab: "Hospitals",
    healthTipsTab: "Health Tips",
    offline: "🔴 You are offline - Limited functionality available",
    online: "🟢 Online - Full functionality available",
  },
  Hindi: {
    title: "MediAssist",
    subtitle: "एआई-संचालित ट्रिएज सहायता पाने के लिए लक्षण दर्ज करें।",
    analyzing: "विश्लेषण जारी है...",
    disclaimer:
      "यह एक चिकित्सा निदान उपकरण नहीं है। कृपया डॉक्टर से सलाह लें।",
    triageTab: "ट्रिएज",
    dashboardTab: "विश्लेषण",
    hospitalsTab: "अस्पताल",
    healthTipsTab: "स्वास्थ्य सुझाव",
    offline: "🔴 आप ऑफलाइन हैं - सीमित कार्यक्षमता उपलब्ध है",
    online: "🟢 ऑनलाइन - पूर्ण कार्यक्षमता उपलब्ध है",
  },
  Telugu: {
    title: "MediAssist",
    subtitle:
      "AI-ఆధారిత ట్రిేజ్ సూచనను పొందడానికి లక్షణాలను నమోదు చేయండి.",
    analyzing: "విశ్లేషించబడుతోంది...",
    disclaimer:
      "ఇది వైద్య నిర్ధారణ సాధనం కాదు. దయచేసి డాక్టర్‌ను సంప్రదించండి.",
    triageTab: "ట్రిేజ్",
    dashboardTab: "విశ్లేషణ",
    hospitalsTab: "ఆసుపత్రులు",
    healthTipsTab: "ఆరోగ్య సూచనలు",
    offline: "🔴 మీరు ఆఫ్‌లైన్‌లో ఉన్నారు - సీమిత విధులు లభ్యం",
    online: "🟢 ఆన్‌లైన్ - పూర్ణ విధులు లభ్యం",
  },
};

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("English");
  const [view, setView] = useState("triage");
  const isOnline = useOfflineMode();
  const t = translations[language];

  // Register service worker for offline mode
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registered"))
        .catch((err) => console.log("Service Worker registration failed:", err));
    }
  }, []);

  const analyzeSymptoms = async ({ symptoms, region }) => {
    if (!isOnline) {
      const errMsg =
        language === "Hindi"
          ? "ऑफलाइन मोड में विश्लेषण उपलब्ध नहीं है।"
          : language === "Telugu"
          ? "ఆఫ్‌లైన్ మోడ్‌లో విశ్లేషణ అందుబాటులో లేదు."
          : "Analysis not available in offline mode.";
      setError(errMsg);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/triage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms, language, region }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const errorMsg =
          language === "Hindi"
            ? "इस समय लक्षणों का विश्लेषण नहीं किया जा सका।"
            : language === "Telugu"
            ? "ఇప్పుడు లక్షణాలను విశ్లేషించడం సాధ్యం కాలేదు."
            : "Unable to analyze symptoms right now.";
        throw new Error(payload.error || errorMsg);
      }

      const data = await res.json();
      setResult(data);
    } catch (error) {
      const errMsg =
        language === "Hindi"
          ? "కుछ गलत हुआ। कृपया फिर से प्रयास करें।"
          : language === "Telugu"
          ? "ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి."
          : "Something went wrong. Please try again.";
      setError(error.message || errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      {/* Offline/Online Status Indicator */}
      <div className={`status-banner ${isOnline ? "online" : "offline"}`}>
        {isOnline ? t.online : t.offline}
      </div>

      <div className="app-card">
        <h1 className="app-title">{t.title}</h1>

        {/* Tab Navigation */}
        <div className="view-tabs">
          <button
            className={`tab-button ${view === "triage" ? "active" : ""}`}
            onClick={() => setView("triage")}
          >
            {t.triageTab}
          </button>
          <button
            className={`tab-button ${view === "dashboard" ? "active" : ""}`}
            onClick={() => setView("dashboard")}
          >
            {t.dashboardTab}
          </button>
          <button
            className={`tab-button ${view === "hospitals" ? "active" : ""}`}
            onClick={() => setView("hospitals")}
          >
            {t.hospitalsTab}
          </button>
          <button
            className={`tab-button ${view === "health-tips" ? "active" : ""}`}
            onClick={() => setView("health-tips")}
          >
            {t.healthTipsTab}
          </button>
        </div>

        {/* Triage View */}
        {view === "triage" && (
          <>
            {/* Emergency Alert if HIGH risk */}
            {result?.risk && <EmergencyAlert risk={result.risk} language={language} />}

            <p className="app-subtitle">{t.subtitle}</p>

            <InputBox
              onSubmit={analyzeSymptoms}
              disabled={loading || !isOnline}
              language={language}
              onLanguageChange={setLanguage}
            />

            {loading && <LoadingSpinner message={t.analyzing} />}

            {error && <p className="error-text">{error}</p>}

            {/* Risk Visualization */}
            {result?.risk && <RiskVisualization risk={result.risk} language={language} />}

            {/* Result Card */}
            <ResultCard result={result} language={language} />
          </>
        )}

        {/* Dashboard View */}
        {view === "dashboard" && <Dashboard language={language} />}

        {/* Hospitals View */}
        {view === "hospitals" && <HospitalsTab language={language} />}

        {/* Health Tips View */}
        {view === "health-tips" && <HealthTipsTab language={language} />}

        <p className="disclaimer">{t.disclaimer}</p>
      </div>
    </div>
  );
}

export default App;
