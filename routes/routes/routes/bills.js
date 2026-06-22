// routes/bills.js
const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", (req, res) => {
  const { user_id } = req.query;
  const rows = user_id
    ? db.prepare("SELECT * FROM bills WHERE user_id = ? ORDER BY due_date DESC").all(user_id)
    : db.prepare("SELECT * FROM bills ORDER BY due_date DESC").all();
  res.json(rows);
});

router.patch("/:id", (req, res) => {
  const { status } = req.body;
  if (!["paid", "unpaid"].includes(status)) return res.status(400).json({ error: "حالة غير صحيحة" });
  db.prepare("UPDATE bills SET status = ? WHERE id = ?").run(status, req.params.id);
  const row = db.prepare("SELECT * FROM bills WHERE id = ?").get(req.params.id);
  res.json(row);
});

module.exports = router;
