const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const fallbackContentByLanguage = {
  English: {
    condition: "Unclear symptoms",
    adviceMedium:
      "Please monitor your symptoms. If symptoms are severe or getting worse, consult a doctor as soon as possible.",
    adviceHigh:
      "Your symptoms may be serious. Please seek urgent medical care immediately.",
  },
  Hindi: {
    condition: "लक्षण स्पष्ट नहीं हैं",
    adviceMedium:
      "कृपया अपने लक्षणों पर नज़र रखें। यदि लक्षण गंभीर हों या बढ़ें, तो जल्द से जल्द डॉक्टर से सलाह लें।",
    adviceHigh:
      "आपके लक्षण गंभीर हो सकते हैं। कृपया तुरंत आपातकालीन चिकित्सा सहायता लें।",
  },
  Telugu: {
    condition: "లక్షణాలు స్పష్టంగా లేవు",
    adviceMedium:
      "దయచేసి మీ లక్షణాలను గమనించండి. లక్షణాలు తీవ్రమైతే లేదా పెరిగితే వెంటనే వైద్యుడిని సంప్రదించండి.",
    adviceHigh:
      "మీ లక్షణాలు తీవ్రమై ఉండవచ్చు. దయచేసి వెంటనే అత్యవసర వైద్య సహాయం పొందండి.",
  },
};

const getLanguageContent = (language) => fallbackContentByLanguage[language] || fallbackContentByLanguage.English;

const buildLocalizedFallback = (language, risk = "MEDIUM") => {
  const content = getLanguageContent(language);

  return {
    risk,
    condition: content.condition,
    advice: risk === "HIGH" ? content.adviceHigh : content.adviceMedium,
  };
};

const allowedRisk = new Set(["LOW", "MEDIUM", "HIGH"]);

const normalizeSymptoms = (text) =>
  text
    .toLowerCase()
    .replace(/[.,!?;:()\[\]{}"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const highRiskKeywords = [
  "chest pain",
  "chest tightness",
  "shortness of breath",
  "breathing issue",
  "difficulty breathing",
  "cannot breathe",
  "trouble breathing",
  "सीने में दर्द",
  "छाती में दर्द",
  "सांस लेने में दिक्कत",
  "साँस लेने में दिक्कत",
  "सांस फूलना",
  "साँस फूलना",
  "श्वास लेने में कठिनाई",
  "seene me dard",
  "saans lene me dikkat",
  "sans lene me dikkat",
  "saans phoolna",
  "ఛాతి నొప్పి",
  "ఉపిరి తీసుకోవడంలో ఇబ్బంది",
  "శ్వాస తీసుకోవడంలో ఇబ్బంది",
  "శ్వాసకోశ ఇబ్బంది",
  "శ్వాస తీసుకోవడం కష్టం",
  "శ్వాస తీసుకోవడం కష్టంగా ఉంది",
  "chaati noppi",
  "upiri teesukovadamlō ibbandi",
  "upiri teesukovadamlo ibbandi",
  "swaasa teesukovadam kashtam",
];

const lowRiskKeywords = [
  "mild cold",
  "cold",
  "runny nose",
  "sneezing",
  "headache",
  "mild headache",
  "हल्का जुकाम",
  "सर्दी",
  "नाक बहना",
  "छींक",
  "हल्का सिरदर्द",
  "सिरदर्द",
  "halka jukam",
  "sardi",
  "sirdard",
  "తేలికపాటి జలుబు",
  "జలుబు",
  "ముక్కు కారడం",
  "తుమ్ములు",
  "తలనొప్పి",
  "తేలికపాటి తలనొప్పి",
  "jalubu",
  "talanoppi",
];

const detectRuleBasedRisk = (symptoms) => {
  const text = normalizeSymptoms(symptoms);

  if (highRiskKeywords.some((keyword) => text.includes(keyword))) {
    return "HIGH";
  }

  if (lowRiskKeywords.some((keyword) => text.includes(keyword))) {
    return "LOW";
  }

  return "MEDIUM";
};

const sanitizeAIResponse = (value, language) => {
  const localizedFallback = buildLocalizedFallback(language, "MEDIUM");

  if (!value || typeof value !== "object") {
    return localizedFallback;
  }

  const risk = typeof value.risk === "string" ? value.risk.toUpperCase().trim() : "MEDIUM";
  const condition =
    typeof value.condition === "string" ? value.condition.trim() : localizedFallback.condition;
  const advice = typeof value.advice === "string" ? value.advice.trim() : localizedFallback.advice;

  return {
    risk: allowedRisk.has(risk) ? risk : "MEDIUM",
    condition: condition || localizedFallback.condition,
    advice: advice || localizedFallback.advice,
  };
};

const extractJSONObject = (text) => {
  const trimmed = text.trim();

  if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
    const cleaned = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
    return cleaned;
  }

  return trimmed;
};

exports.getAIResponse = async (symptoms, language = "English") => {
  const ruleBasedRisk = detectRuleBasedRisk(symptoms);
  const riskAwareFallback = buildLocalizedFallback(language, ruleBasedRisk);

  const prompt = `
You are an AI healthcare assistant.

Task:
- Analyze the user symptoms.
- Return risk, possible condition, and simple advice.

Rules:
- If chest pain or breathing issues are present, set risk to HIGH.
- If mild cold or simple headache symptoms are present, set risk to LOW.
- Otherwise set risk to MEDIUM.
- Do NOT give an exact medical diagnosis.
- Suggest consulting a doctor for serious or worsening symptoms.
- Output must be in ${language} language.
- Input symptoms can be in English, Hindi, or Telugu.

Accuracy policy:
- Follow these rules exactly and prioritize symptom safety.
- If multiple symptoms conflict, choose the higher risk.
- Keep condition general (e.g., "possible respiratory issue").
- Advice must be short, practical, and non-diagnostic.

Respond ONLY in JSON format:

{
  "risk": "LOW | MEDIUM | HIGH",
  "condition": "Possible condition",
  "advice": "Simple advice in ${language}"
}

Symptoms: ${symptoms}

Required risk based on rules: ${ruleBasedRisk}
`;

  if (!process.env.GROQ_API_KEY) {
    return riskAwareFallback;
  }

  let jsonText = "";

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a careful medical triage assistant. Never provide definitive diagnosis. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const text = response?.choices?.[0]?.message?.content || "";
    jsonText = extractJSONObject(text);
  } catch (error) {
    return riskAwareFallback;
  }

  try {
    const parsed = sanitizeAIResponse(JSON.parse(jsonText), language);

    if (parsed.risk !== ruleBasedRisk) {
      return {
        ...parsed,
        risk: ruleBasedRisk,
      };
    }

    return parsed;
  } catch (err) {
    return riskAwareFallback;
  }
};