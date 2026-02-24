require("dotenv").config();
const express = require("express");
const cors = require("cors");

const triageRoute = require("./routes/triage");
const analyticsRoute = require("./routes/analytics");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/triage", triageRoute);
app.use("/api/analytics", analyticsRoute);

app.get("/", (req, res) => {
  res.json({
    message: "MediAssist API running",
    status: "ok",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});