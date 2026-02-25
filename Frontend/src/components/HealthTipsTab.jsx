import { useState } from "react";

const healthTipsLabels = {
  English: {
    title: "Health Tips & Wellness",
    allTips: "All Tips",
    generalTips: "General",
    respiratoryTips: "Respiratory Health",
    digestiveTips: "Digestive Health",
    immunityTips: "Immunity Boost",
    mentalHealthTips: "Mental Wellness",
    readMore: "Read More",
    category: "Category",
  },
  Hindi: {
    title: "स्वास्थ्य सुझाव और कल्याण",
    allTips: "सभी सुझाव",
    generalTips: "सामान्य",
    respiratoryTips: "श्वसन स्वास्थ्य",
    digestiveTips: "पाचन स्वास्थ्य",
    immunityTips: "प्रतिरक्षा बूस्ट",
    mentalHealthTips: "मानसिक स्वास्थ्य",
    readMore: "अधिक पढ़ें",
    category: "श्रेणी",
  },
  Telugu: {
    title: "ఆరోగ్య సూచనలు & సుస్థిరత",
    allTips: "అన్ని చిట్కాలు",
    generalTips: "సాధారణ",
    respiratoryTips: "శ్వాసన ఆరోగ్యం",
    digestiveTips: "జీర్ణక ఆరోగ్యం",
    immunityTips: "రోగనిరోధక శక్తి",
    mentalHealthTips: "మానసిక సుస్థిరత",
    readMore: "మరిన్ని చదవండి",
    category: "వర్గం",
  },
};

const normalizeLanguage = (language) => {
  const value = String(language || "English").toLowerCase();
  if (value.includes("hindi") || value.includes("हिंदी")) return "Hindi";
  if (value.includes("telugu") || value.includes("తెలుగు")) return "Telugu";
  return "English";
};

const healthTips = [
  {
    id: 1,
    title: {
      English: "Stay Hydrated Daily",
      Hindi: "रोजाना पर्याप्त पानी पिएं",
      Telugu: "రోజూ తగినంత నీరు తాగండి",
    },
    category: "General",
    description: {
      English: "Drink at least 8-10 glasses of water daily to maintain proper hydration and support body functions.",
      Hindi: "सही हाइड्रेशन और शरीर की कार्यक्षमता के लिए रोज़ 8-10 गिलास पानी पिएं।",
      Telugu: "సరైన హైడ్రేషన్ మరియు శరీర కార్యకలాపాల కోసం రోజుకు కనీసం 8-10 గ్లాసుల నీరు తాగండి.",
    },
    tips: {
      English: ["Drink water before meals", "Keep a water bottle with you", "Avoid excessive caffeine"],
      Hindi: ["भोजन से पहले पानी पिएं", "अपने साथ पानी की बोतल रखें", "अधिक कैफीन से बचें"],
      Telugu: ["భోజనం ముందు నీరు తాగండి", "మీతో నీటి సీసా ఉంచుకోండి", "అధిక కేఫిన్‌ను నివారించండి"],
    },
    icon: "💧",
  },
  {
    id: 2,
    title: {
      English: "Deep Breathing Exercises",
      Hindi: "गहरी सांस के व्यायाम",
      Telugu: "లోతైన శ్వాస వ్యాయామాలు",
    },
    category: "Respiratory",
    description: {
      English: "Practice deep breathing to improve lung capacity and reduce stress.",
      Hindi: "फेफड़ों की क्षमता बढ़ाने और तनाव कम करने के लिए गहरी सांस का अभ्यास करें।",
      Telugu: "ఫెఫ్ఫుసుల సామర్థ్యాన్ని మెరుగుపరచడానికి మరియు ఒత్తిడి తగ్గించడానికి లోతైన శ్వాసను అభ్యసించండి.",
    },
    tips: {
      English: ["Breathe in for 4 counts", "Hold for 4 counts", "Exhale for 4 counts", "Repeat 5-10 times"],
      Hindi: ["4 गिनती तक सांस लें", "4 गिनती तक रोकें", "4 गिनती तक छोड़ें", "5-10 बार दोहराएं"],
      Telugu: ["4 కౌంట్ల వరకు శ్వాస తీసుకోండి", "4 కౌంట్ల వరకు ఉంచండి", "4 కౌంట్ల వరకు విడదీయండి", "5-10 సార్లు పునరావృతం చేయండి"],
    },
    icon: "🫁",
  },
  {
    id: 3,
    title: {
      English: "Balanced Diet",
      Hindi: "संतुलित आहार",
      Telugu: "సమతుల ఆహారం",
    },
    category: "Digestive",
    description: {
      English: "Eat a variety of fruits, vegetables, and whole grains for digestive health.",
      Hindi: "पाचन स्वास्थ्य के लिए फल, सब्जियां और साबुत अनाज का संतुलित सेवन करें।",
      Telugu: "జీర్ణక ఆరోగ్యానికి పండ్లు, కూరగాయలు, సంపూర్ణ ధాన్యాలు కలిగిన ఆహారం తీసుకోండి.",
    },
    tips: {
      English: ["Add fiber-rich foods", "Eat slowly and chew well", "Avoid heavy meals at night"],
      Hindi: ["फाइबर युक्त भोजन शामिल करें", "धीरे खाएं और अच्छी तरह चबाएं", "रात में भारी भोजन से बचें"],
      Telugu: ["ఫైబర్ ఉన్న ఆహారం తీసుకోండి", "నెమ్మదిగా తిని బాగా నమలండి", "రాత్రి భారమైన భోజనం నివారించండి"],
    },
    icon: "🥗",
  },
  {
    id: 4,
    title: {
      English: "Regular Exercise",
      Hindi: "नियमित व्यायाम",
      Telugu: "నియమిత వ్యాయామం",
    },
    category: "General",
    description: {
      English: "Exercise for at least 30 minutes daily to maintain fitness and prevent diseases.",
      Hindi: "फिटनेस बनाए रखने और बीमारियों से बचाव के लिए रोज़ कम से कम 30 मिनट व्यायाम करें।",
      Telugu: "ఫిట్‌నెస్ కోసం మరియు వ్యాధుల నివారణకు రోజూ కనీసం 30 నిమిషాలు వ్యాయామం చేయండి.",
    },
    tips: {
      English: ["Walking for 30 minutes", "Stretching exercises", "Yoga or swimming"],
      Hindi: ["30 मिनट टहलें", "स्ट्रेचिंग करें", "योग या तैराकी करें"],
      Telugu: ["30 నిమిషాలు నడవండి", "స్ట్రెచింగ్ వ్యాయామాలు చేయండి", "యోగ లేదా ఈత చేయండి"],
    },
    icon: "🏃",
  },
  {
    id: 5,
    title: {
      English: "Boost Immunity",
      Hindi: "प्रतिरक्षा बढ़ाएं",
      Telugu: "రోగనిరోధక శక్తి పెంచుకోండి",
    },
    category: "Immunity",
    description: {
      English: "Strengthen your immune system with vitamin C, D, and zinc-rich foods.",
      Hindi: "विटामिन C, D और जिंक युक्त आहार से अपनी प्रतिरक्षा मजबूत करें।",
      Telugu: "విటమిన్ C, D మరియు జింక్ ఉన్న ఆహారంతో రోగనిరోధక శక్తిని పెంచుకోండి.",
    },
    tips: {
      English: ["Eat citrus fruits", "Get sunlight exposure", "Sleep 7-8 hours", "Reduce stress"],
      Hindi: ["खट्टे फल खाएं", "धूप लें", "7-8 घंटे सोएं", "तनाव कम करें"],
      Telugu: ["సిట్రస్ పండ్లు తినండి", "సూర్యకాంతి పొందండి", "7-8 గంటలు నిద్రించండి", "ఒత్తిడి తగ్గించండి"],
    },
    icon: "💪",
  },
  {
    id: 6,
    title: {
      English: "Meditation & Mindfulness",
      Hindi: "ध्यान और माइंडफुलनेस",
      Telugu: "ధ్యానం & మైండ్‌ఫుల్‌నెస్",
    },
    category: "Mental",
    description: {
      English: "Practice meditation to reduce stress and improve mental clarity.",
      Hindi: "तनाव कम करने और मानसिक स्पष्टता बढ़ाने के लिए ध्यान का अभ्यास करें।",
      Telugu: "ఒత్తిడిని తగ్గించి మానసిక స్పష్టత కోసం ధ్యానం అభ్యసించండి.",
    },
    tips: {
      English: ["Start with 5 minutes", "Find a quiet place", "Focus on your breathing"],
      Hindi: ["5 मिनट से शुरू करें", "शांत स्थान चुनें", "अपनी सांस पर ध्यान दें"],
      Telugu: ["5 నిమిషాలతో ప్రారంభించండి", "నిశ్శబ్ద ప్రదేశం ఎంచుకోండి", "మీ శ్వాసపై దృష్టి పెట్టండి"],
    },
    icon: "🧘",
  },
];

export function HealthTipsTab({ language = "English" }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const normalizedLanguage = normalizeLanguage(language);
  const labels = healthTipsLabels[normalizedLanguage];

  const categories = [
    { key: "All", label: labels.allTips },
    { key: "General", label: labels.generalTips },
    { key: "Respiratory", label: labels.respiratoryTips },
    { key: "Digestive", label: labels.digestiveTips },
    { key: "Immunity", label: labels.immunityTips },
    { key: "Mental", label: labels.mentalHealthTips },
  ];

  const categoryLabels = {
    All: labels.allTips,
    General: labels.generalTips,
    Respiratory: labels.respiratoryTips,
    Digestive: labels.digestiveTips,
    Immunity: labels.immunityTips,
    Mental: labels.mentalHealthTips,
  };
  
  const filteredTips = activeCategory === "All" 
    ? healthTips 
    : healthTips.filter(tip => tip.category === activeCategory);

  return (
    <div className="health-tips-container">
      <h1 className="tab-title">{labels.title}</h1>

      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`category-button ${activeCategory === cat.key ? "active" : ""}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="tips-grid">
        {filteredTips.map((tip) => (
          <div key={tip.id} className="tip-card">
            <div className="tip-icon">{tip.icon}</div>
            <h3 className="tip-title">{tip.title[normalizedLanguage] || tip.title.English}</h3>
            <p className="tip-category">{categoryLabels[tip.category]}</p>
            <p className="tip-description">{tip.description[normalizedLanguage] || tip.description.English}</p>
            
            <ul className="tip-list">
              {(tip.tips[normalizedLanguage] || tip.tips.English).map((item, idx) => (
                <li key={idx}>✓ {item}</li>
              ))}
            </ul>

            <button className="expand-button">{labels.readMore}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
