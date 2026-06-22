// routes/alerts.js
const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM notifications ORDER BY created_at DESC").all();
  res.json(rows);
});

router.post("/", (req, res) => {
  const { user_id, message } = req.body;
  if (!user_id || !message) return res.status(400).json({ error: "user_id, message مطلوبين" });
  const result = db.prepare("INSERT INTO notifications (user_id, message) VALUES (?, ?)").run(user_id, message);
  const row = db.prepare("SELECT * FROM notifications WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(row);
});

router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM notifications WHERE id = ?").run(req.params.id);
  res.status(204).end();
});

module.exports = router;
