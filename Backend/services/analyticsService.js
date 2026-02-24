// Simple in-memory storage and analytics for triage submissions

let submissions = [];

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

exports.REGIONS = REGIONS;

exports.addSubmission = (symptoms, risk, region, language) => {
  const submission = {
    id: submissions.length + 1,
    timestamp: new Date(),
    symptoms,
    risk,
    region: region || "Unknown",
    language,
  };
  submissions.push(submission);
  return submission;
};

exports.getHighRiskRegions = () => {
  const regionStats = {};

  submissions.forEach((sub) => {
    if (!regionStats[sub.region]) {
      regionStats[sub.region] = {
        region: sub.region,
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
      };
    }
    regionStats[sub.region].total += 1;
    if (sub.risk === "HIGH") {
      regionStats[sub.region].high += 1;
    } else if (sub.risk === "MEDIUM") {
      regionStats[sub.region].medium += 1;
    } else if (sub.risk === "LOW") {
      regionStats[sub.region].low += 1;
    }
  });

  return Object.values(regionStats)
    .map((stat) => ({
      ...stat,
      highRiskRatio: stat.total > 0 ? ((stat.high / stat.total) * 100).toFixed(2) : 0,
    }))
    .sort((a, b) => b.high - a.high);
};

exports.getDiseaseTrends = () => {
  const trends = {};

  submissions.forEach((sub) => {
    const words = sub.symptoms.toLowerCase().split(/\s+/);
    words.forEach((word) => {
      if (word.length > 3) {
        if (!trends[word]) {
          trends[word] = { symptom: word, count: 0, highRiskCount: 0 };
        }
        trends[word].count += 1;
        if (sub.risk === "HIGH") {
          trends[word].highRiskCount += 1;
        }
      }
    });
  });

  return Object.values(trends)
    .filter((t) => t.count >= 2)
    .map((t) => ({
      ...t,
      riskPercentage: ((t.highRiskCount / t.count) * 100).toFixed(2),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
};

exports.getRiskDistribution = () => {
  const dist = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  submissions.forEach((sub) => {
    dist[sub.risk] = (dist[sub.risk] || 0) + 1;
  });
  return [
    { name: "HIGH", value: dist.HIGH },
    { name: "MEDIUM", value: dist.MEDIUM },
    { name: "LOW", value: dist.LOW },
  ];
};

exports.getTotalSubmissions = () => submissions.length;

exports.getSubmissions = () => submissions;
