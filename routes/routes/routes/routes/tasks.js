// routes/tasks.js
const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", (req, res) => {
  const { employee_id } = req.query;
  const rows = employee_id
    ? db.prepare("SELECT * FROM tasks WHERE employee_id = ? ORDER BY task_date DESC").all(employee_id)
    : db.prepare("SELECT * FROM tasks ORDER BY task_date DESC").all();
  res.json(rows);
});

router.patch("/:id", (req, res) => {
  const { done } = req.body;
  db.prepare("UPDATE tasks SET done = ? WHERE id = ?").run(done ? 1 : 0, req.params.id);
  const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
  res.json(row);
});

module.exports = router;
