// db/init.js
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const DB_PATH = path.join(__dirname, "hayah.db");
const SQL_PATH = path.join(__dirname, "hayah_database.sql");

if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log("تم حذف قاعدة البيانات القديمة");
}

const db = new Database(DB_PATH);
const sql = fs.readFileSync(SQL_PATH, "utf-8");

db.exec(sql);
console.log("تم إنشاء قاعدة البيانات بنجاح في:", DB_PATH);

db.close();
