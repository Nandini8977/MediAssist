const riskVisualizationLabels = {
  English: {
    riskLevel: "Risk Level",
    severity: "Severity",
    recommended: "Recommended Action",
    timeToSeekCare: "Time to Seek Care",
  },
  Hindi: {
    riskLevel: "जोखिम स्तर",
    severity: "गंभीरता",
    recommended: "अनुशंसित कार्रवाई",
    timeToSeekCare: "देखभाल लेने का समय",
  },
  Telugu: {
    riskLevel: "ప్రమాద స్థాయి",
    severity: "తీవ్రత",
    recommended: "సిఫారసు చేసిన చర్య",
    timeToSeekCare: "సంరక్షణ కోసం సময়",
  },
};

const riskDetails = {
  HIGH: {
    severity: 95,
    color: "#dc2626",
    icon: "🚨",
    actions: ["Call emergency (108)", "Go to hospital immediately", "Inform family members"],
    timeframe: "Immediately (< 30 minutes)",
  },
  MEDIUM: {
    severity: 60,
    color: "#ea580c",
    icon: "⚠️",
    actions: ["Schedule doctor appointment", "Monitor symptoms closely", "Take prescribed medication"],
    timeframe: "Today (< 24 hours)",
  },
  LOW: {
    severity: 25,
    color: "#16a34a",
    icon: "✓",
    actions: ["Monitor symptoms", "Stay hydrated", "Rest well", "Follow-up in 3-5 days if needed"],
    timeframe: "Within 3-5 days",
  },
};

export function RiskVisualization({ risk, language = "English" }) {
  if (!risk) return null;

  const labels = riskVisualizationLabels[language];
  const details = riskDetails[risk] || riskDetails.MEDIUM;

  return (
    <div className="risk-visualization">
      <div className="risk-header">
        <span className="risk-icon">{details.icon}</span>
        <div className="risk-title-section">
          <h2 className="risk-title">{labels.riskLevel}</h2>
          <p className="risk-level" style={{ color: details.color }}>
            {risk}
          </p>
        </div>
      </div>

      <div className="severity-meter">
        <div className="meter-background">
          <div
            className="meter-fill"
            style={{
              width: `${details.severity}%`,
              backgroundColor: details.color,
            }}
          ></div>
        </div>
        <p className="meter-label">{labels.severity}: {details.severity}%</p>
      </div>

      <div className="risk-actions-section">
        <h3 className="section-title">{labels.recommended}</h3>
        <div className="actions-list">
          {details.actions.map((action, idx) => (
            <div key={idx} className="action-item">
              <span className="action-icon">→</span>
              <span className="action-text">{action}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="timeframe-section">
        <h3 className="section-title">{labels.timeToSeekCare}</h3>
        <p className="timeframe-text" style={{ color: details.color }}>
          {details.timeframe}
        </p>
      </div>
    </div>
  );
}
