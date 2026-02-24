import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const dashboardLabels = {
  English: {
    title: "Analytics Dashboard",
    highRiskRegions: "High-Risk Regions",
    diseaseTrends: "Top Disease Symptoms",
    riskDistribution: "Risk Level Distribution",
    totalSubmissions: "Total Submissions",
    loading: "Loading analytics...",
    error: "Failed to load analytics data.",
    noData: "No data available yet.",
  },
  Hindi: {
    title: "विश्लेषण डैशबोर्ड",
    highRiskRegions: "उच्च जोखिम वाले क्षेत्र",
    diseaseTrends: "शीर्ष रोग लक्षण",
    riskDistribution: "जोखिम स्तर वितरण",
    totalSubmissions: "कुल सबमिशन",
    loading: "विश्लेषण लोड हो रहा है...",
    error: "विश्लेषण डेटा लोड करने में विफल।",
    noData: "अभी कोई डेटा उपलब्ध नहीं है।",
  },
  Telugu: {
    title: "విశ్లేషణ డ్యాష్‌బోర్డ్",
    highRiskRegions: "అధిక ప్రమాద ప్రాంతాలు",
    diseaseTrends: "అగ్ర వ్యాధి లక్షణాలు",
    riskDistribution: "ప్రమాద స్థాయి పంపిణీ",
    totalSubmissions: "మొత్తం సమర్పణలు",
    loading: "విశ్లేషణ లోడ్ అవుతోంది...",
    error: "విశ్లేషణ డేటా లోడ్ చేయడం విఫలమైంది.",
    noData: "ఇంకా డేటా లేదు.",
  },
};

const COLORS = ["#ef4444", "#f97316", "#22c55e"];

function Dashboard({ language = "English" }) {
  const [regions, setRegions] = useState([]);
  const [trends, setTrends] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const labels = dashboardLabels[language];

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/api/analytics/summary`);

      if (!res.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const data = await res.json();
      setRegions(data.regions || []);
      setTrends(data.trends || []);
      setDistribution(data.distribution || []);
      setTotalSubmissions(data.totalSubmissions || 0);
    } catch (err) {
      setError(labels.error);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="status-text">{labels.loading}</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (totalSubmissions === 0) {
    return <p className="status-text">{labels.noData}</p>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">{labels.title}</h1>

      <div className="stats-card">
        <h3>{labels.totalSubmissions}</h3>
        <p className="stat-value">{totalSubmissions}</p>
      </div>

      <div className="dashboard-grid">
        {/* High-Risk Regions */}
        <div className="chart-container">
          <h2>{labels.highRiskRegions}</h2>
          {regions.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={regions}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="region"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="high" stackId="a" fill={COLORS[0]} name="HIGH" />
                <Bar
                  dataKey="medium"
                  stackId="a"
                  fill={COLORS[1]}
                  name="MEDIUM"
                />
                <Bar dataKey="low" stackId="a" fill={COLORS[2]} name="LOW" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>{labels.noData}</p>
          )}
        </div>

        {/* Disease Trends */}
        <div className="chart-container">
          <h2>{labels.diseaseTrends}</h2>
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={trends}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="symptom"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  name="Total Cases"
                />
                <Line
                  type="monotone"
                  dataKey="highRiskCount"
                  stroke="#ef4444"
                  name="High Risk"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>{labels.noData}</p>
          )}
        </div>

        {/* Risk Distribution Pie Chart */}
        <div className="chart-container">
          <h2>{labels.riskDistribution}</h2>
          {distribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index] || "#gray"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>{labels.noData}</p>
          )}
        </div>
      </div>

      <button onClick={fetchAnalytics} className="refresh-button">
        Refresh
      </button>
    </div>
  );
}

export default Dashboard;
