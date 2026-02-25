const OpenAI = require("openai").default;

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

const localizedResultByLanguage = {
  English: {
    HIGH: {
      condition: "Possible serious cardiac or respiratory issue",
      advice: "Seek emergency medical care immediately and call 108 if needed.",
    },
    MEDIUM: {
      condition: "Possible moderate health concern requiring medical review",
      advice: "Consult a doctor within 24 hours and monitor symptoms closely.",
    },
    LOW: {
      condition: "Possible mild, non-urgent condition",
      advice: "Rest, stay hydrated, and monitor symptoms for 3-5 days.",
    },
  },
  Hindi: {
    HIGH: {
      condition: "संभावित गंभीर हृदय या श्वसन संबंधी समस्या",
      advice: "तुरंत आपातकालीन चिकित्सा सहायता लें और आवश्यकता हो तो 108 पर कॉल करें।",
    },
    MEDIUM: {
      condition: "संभावित मध्यम स्वास्थ्य समस्या, चिकित्सकीय जांच आवश्यक",
      advice: "24 घंटों के भीतर डॉक्टर से मिलें और लक्षणों की करीबी निगरानी करें।",
    },
    LOW: {
      condition: "संभावित हल्की, गैर-आपातकालीन स्थिति",
      advice: "आराम करें, पर्याप्त पानी पिएं और 3-5 दिनों तक लक्षणों पर नज़र रखें।",
    },
  },
  Telugu: {
    HIGH: {
      condition: "సంభావ్య తీవ్రమైన గుండె లేదా శ్వాసకోశ సమస్య",
      advice: "వెంటనే అత్యవసర వైద్య సహాయం పొందండి మరియు అవసరమైతే 108కి కాల్ చేయండి.",
    },
    MEDIUM: {
      condition: "సంభావ్య మధ్యస్థ ఆరోగ్య సమస్య, వైద్య పరీక్ష అవసరం",
      advice: "24 గంటల్లో డాక్టర్‌ను సంప్రదించి లక్షణాలను జాగ్రత్తగా గమనించండి.",
    },
    LOW: {
      condition: "సంభావ్య తేలికపాటి, అత్యవసరం కాని పరిస్థితి",
      advice: "విశ్రాంతి తీసుకోండి, తగినంత నీరు తాగండి, 3-5 రోజుల పాటు లక్షణాలను గమనించండి.",
    },
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

const localizeResponseContent = (response, language) => {
  if (!response || typeof response !== "object") {
    return buildLocalizedFallback(language, "MEDIUM");
  }

  const selectedLanguage = fallbackContentByLanguage[language] ? language : "English";
  const risk = allowedRisk.has(response.risk) ? response.risk : "MEDIUM";

  if (selectedLanguage === "English") {
    return {
      risk,
      condition: response.condition,
      advice: response.advice,
    };
  }

  const localized = localizedResultByLanguage[selectedLanguage][risk];

  return {
    risk,
    condition: localized.condition,
    advice: localized.advice,
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
    const enforcedRisk = parsed.risk !== ruleBasedRisk ? ruleBasedRisk : parsed.risk;
    const normalized = {
      ...parsed,
      risk: enforcedRisk,
    };
    return localizeResponseContent(normalized, language);
  } catch (err) {
    return riskAwareFallback;
  }
};