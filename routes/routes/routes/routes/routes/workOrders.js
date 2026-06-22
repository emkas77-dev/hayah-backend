// routes/workOrders.js
const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT w.*, u.full_name AS assignee_name
    FROM work_orders w LEFT JOIN users u ON u.id = w.assignee_id
    ORDER BY w.created_at DESC
  `).all();
  res.json(rows);
});

router.post("/", (req, res) => {
  const { id, asset, station_id, assignee_id } = req.body;
  if (!id || !asset) return res.status(400).json({ error: "id, asset مطلوبين" });
  db.prepare(`
    INSERT INTO work_orders (id, asset, station_id, status, assignee_id)
    VALUES (?, ?, ?, 'open', ?)
  `).run(id, asset, station_id || null, assignee_id || null);
  const row = db.prepare("SELECT * FROM work_orders WHERE id = ?").get(id);
  res.status(201).json(row);
});

router.patch("/:id", (req, res) => {
  const { status } = req.body;
  if (!["open", "inProgress", "closed"].includes(status)) return res.status(400).json({ error: "حالة غير صحيحة" });
  db.prepare("UPDATE work_orders SET status = ? WHERE id = ?").run(status, req.params.id);
  const row = db.prepare("SELECT * FROM work_orders WHERE id = ?").get(req.params.id);
  res.json(row);
});

module.exports = router;
