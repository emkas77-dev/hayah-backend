// routes/faults.js
const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT f.*, s.name AS station_name, u.full_name AS employee_name
    FROM faults f
    JOIN stations s ON s.id = f.station_id
    JOIN users u ON u.id = f.employee_id
    ORDER BY f.created_at DESC
  `).all();
  res.json(rows);
});

router.post("/", (req, res) => {
  const { employee_id, station_id, type, notes, photo_url } = req.body;
  if (!employee_id || !station_id || !type) {
    return res.status(400).json({ error: "employee_id, station_id, type مطلوبين" });
  }
  const result = db.prepare(`
    INSERT INTO faults (employee_id, station_id, type, notes, photo_url)
    VALUES (?, ?, ?, ?, ?)
  `).run(employee_id, station_id, type, notes || null, photo_url || null);
  const row = db.prepare("SELECT * FROM faults WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(row);
});

module.exports = router;
