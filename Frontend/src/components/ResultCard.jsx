const resultLabels = {
  English: {
    riskLevel: "Risk Level",
    condition: "Possible Condition",
    advice: "Advice",
  },
  Hindi: {
    riskLevel: "जोखिम स्तर",
    condition: "संभावित स्थिति",
    advice: "सलाह",
  },
  Telugu: {
    riskLevel: "ఝామ స్థాయి",
    condition: "సంభవ్య పరिస్థితి",
    advice: "సూచన",
  },
};

function ResultCard({ result, language = "English" }) {
  if (!result) return null;

  const normalizedRisk = (result.risk || "MEDIUM").toUpperCase();

  const riskClassMap = {
    HIGH: "risk-high",
    MEDIUM: "risk-medium",
    LOW: "risk-low",
  };

  const riskClass = riskClassMap[normalizedRisk] || "risk-medium";
  const labels = resultLabels[language];

  return (
    <div className="result-card">
      <h3 className={`risk-title ${riskClass}`}>
        {labels.riskLevel}: {normalizedRisk}
      </h3>

      <p>
        <strong>{labels.condition}:</strong> {result.condition}
      </p>
      <p>
        <strong>{labels.advice}:</strong> {result.advice}
      </p>
    </div>
  );
}

export default ResultCard;