const express = require("express");
const router = express.Router();

const {
  getHighRiskRegions,
  getDiseaseTrends,
  getRiskDistribution,
  getTotalSubmissions,
} = require("../services/analyticsService");

router.get("/high-risk-regions", (req, res) => {
  const regions = getHighRiskRegions();
  res.json({
    status: "ok",
    data: regions,
  });
});

router.get("/disease-trends", (req, res) => {
  const trends = getDiseaseTrends();
  res.json({
    status: "ok",
    data: trends,
  });
});

router.get("/risk-distribution", (req, res) => {
  const distribution = getRiskDistribution();
  res.json({
    status: "ok",
    data: distribution,
  });
});

router.get("/summary", (req, res) => {
  res.json({
    status: "ok",
    totalSubmissions: getTotalSubmissions(),
    regions: getHighRiskRegions(),
    trends: getDiseaseTrends(),
    distribution: getRiskDistribution(),
  });
});

module.exports = router;
