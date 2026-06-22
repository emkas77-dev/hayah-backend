// routes/stations.js
const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM stations ORDER BY id").all();
  res.json(rows);
});

router.patch("/:id", (req, res) => {
  const { status } = req.body;
  if (!["online", "offline", "warning"].includes(status)) {
    return res.status(400).json({ error: "حالة غير صحيحة" });
  }
  const result = db.prepare("UPDATE stations SET status = ? WHERE id = ?").run(status, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "المحطة غير موجودة" });
  const station = db.prepare("SELECT * FROM stations WHERE id = ?").get(req.params.id);
  res.json(station);
});

module.exports = router;
