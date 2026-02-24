import { useState } from "react";

const healthTipsLabels = {
  English: {
    title: "Health Tips & Wellness",
    allTips: "All Tips",
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
    respiratoryTips: "శ్వాసన ఆరోగ్యం",
    digestiveTips: "జీర్ణక ఆరోగ్యం",
    immunityTips: "రోగనిరోధక శక్తి",
    mentalHealthTips: "మానసిక సుస్థిరత",
    readMore: "మరిన్ని చదవండి",
    category: "వర్గం",
  },
};

const healthTips = [
  {
    id: 1,
    title: "Stay Hydrated Daily",
    category: "General",
    description: "Drink at least 8-10 glasses of water daily to maintain proper hydration and support body functions.",
    tips: ["Drink water before meals", "Keep a water bottle with you", "Avoid excessive caffeine"],
    icon: "💧",
  },
  {
    id: 2,
    title: "Deep Breathing Exercises",
    category: "Respiratory",
    description: "Practice deep breathing to improve lung capacity and reduce stress.",
    tips: ["Breathe in for 4 counts", "Hold for 4 counts", "Exhale for 4 counts", "Repeat 5-10 times"],
    icon: "🫁",
  },
  {
    id: 3,
    title: "Balanced Diet",
    category: "Digestive",
    description: "Eat a variety of fruits, vegetables, and whole grains for digestive health.",
    tips: ["Add fiber-rich foods", "Eat slowly and chew well", "Avoid heavy meals at night"],
    icon: "🥗",
  },
  {
    id: 4,
    title: "Regular Exercise",
    category: "General",
    description: "Exercise for at least 30 minutes daily to maintain fitness and prevent diseases.",
    tips: ["Walking for 30 minutes", "Stretching exercises", "Yoga or swimming"],
    icon: "🏃",
  },
  {
    id: 5,
    title: "Boost Immunity",
    category: "Immunity",
    description: "Strengthen your immune system with vitamin C, D, and zinc-rich foods.",
    tips: ["Eat citrus fruits", "Get sunlight exposure", "Sleep 7-8 hours", "Reduce stress"],
    icon: "💪",
  },
  {
    id: 6,
    title: "Meditation & Mindfulness",
    category: "Mental",
    description: "Practice meditation to reduce stress and improve mental clarity.",
    tips: ["Start with 5 minutes", "Find a quiet place", "Focus on your breathing"],
    icon: "🧘",
  },
];

export function HealthTipsTab({ language = "English" }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const labels = healthTipsLabels[language];

  const categories = ["All", "General", "Respiratory", "Digestive", "Immunity", "Mental"];
  
  const filteredTips = activeCategory === "All" 
    ? healthTips 
    : healthTips.filter(tip => tip.category === activeCategory);

  return (
    <div className="health-tips-container">
      <h1 className="tab-title">{labels.title}</h1>

      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-button ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="tips-grid">
        {filteredTips.map((tip) => (
          <div key={tip.id} className="tip-card">
            <div className="tip-icon">{tip.icon}</div>
            <h3 className="tip-title">{tip.title}</h3>
            <p className="tip-category">{tip.category}</p>
            <p className="tip-description">{tip.description}</p>
            
            <ul className="tip-list">
              {tip.tips.map((item, idx) => (
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
