// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// تأكد من وجود قاعدة البيانات، لو مش موجودة شغّل init تلقائيًا
const DB_FILE = path.join(__dirname, "db", "hayah.db");
if (!fs.existsSync(DB_FILE)) {
  console.log("قاعدة البيانات غير موجودة، يتم إنشاؤها الآن...");
  require("./db/init.js");
}

app.use("/api/stations", require("./routes/stations"));
app.use("/api/complaints", require("./routes/complaints"));
app.use("/api/alerts", require("./routes/alerts"));
app.use("/api/faults", require("./routes/faults"));
app.use("/api/bills", require("./routes/bills"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/work-orders", require("./routes/workOrders"));
app.use("/api/kpis", require("./routes/kpis"));

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "hayah-backend" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Hayah backend running at http://localhost:${PORT}`);
});
