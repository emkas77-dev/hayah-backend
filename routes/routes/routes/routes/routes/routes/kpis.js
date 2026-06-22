// routes/kpis.js
const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", (req, res) => {
  const stations = db.prepare("SELECT * FROM stations").all();

  const waterStations = stations.filter((s) => s.type === "water");
  const sewageStations = stations.filter((s) => s.type === "sewage");
  const online = stations.filter((s) => s.status === "online").length;
  const offline = stations.filter((s) => s.status === "offline").length;
  const warning = stations.filter((s) => s.status === "warning").length;

  const openComplaints = db.prepare("SELECT COUNT(*) n FROM complaints WHERE status != 'closed'").get().n;
  const activeFaults = db.prepare("SELECT COUNT(*) n FROM faults WHERE created_at >= datetime('now','-1 day')").get().n;

  res.json({
    total_stations: stations.length,
    water_stations: waterStations.length,
    sewage_stations: sewageStations.length,
    online,
    offline,
    warning,
    open_complaints: openComplaints,
    active_faults: activeFaults,
  });
});

module.exports = router;
