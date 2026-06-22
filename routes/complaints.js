// routes/complaints.js
const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT c.*, u.full_name AS customer_name
    FROM complaints c JOIN users u ON u.id = c.user_id
    ORDER BY c.created_at DESC
  `).all();
  res.json(rows);
});

router.post("/", (req, res) => {
  const { user_id, type, location, description, priority } = req.body;
  if (!user_id || !type || !priority) {
    return res.status(400).json({ error: "user_id, type, priority مطلوبين" });
  }
  const id = "C-" + Math.floor(400 + Math.random() * 9599);
  db.prepare(`
    INSERT INTO complaints (id, user_id, type, location, description, priority, status)
    VALUES (?, ?, ?, ?, ?, ?, 'open')
  `).run(id, user_id, type, location || null, description || null, priority);
  const row = db.prepare("SELECT * FROM complaints WHERE id = ?").get(id);
  res.status(201).json(row);
});

router.patch("/:id", (req, res) => {
  const { status } = req.body;
  if (!["open", "inProgress", "closed"].includes(status)) {
    return res.status(400).json({ error: "حالة غير صحيحة" });
  }
  db.prepare("UPDATE complaints SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .run(status, req.params.id);
  const row = db.prepare("SELECT * FROM complaints WHERE id = ?").get(req.params.id);
  res.json(row);
});

module.exports = router;
