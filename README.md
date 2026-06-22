# Hayah Backend — منصة حياه للمياه والصرف

باك إند حقيقي مبني بـ Node.js + Express + SQLite، يطابق بيانات تطبيق "حياه" ولوحة "غرفة العمليات الذكية".

## التشغيل (محتاج جهازك بس، مش هنا في الشات)

```bash
# 1. ادخل مجلد المشروع
cd hayah-backend

# 2. نزّل المكتبات
npm install

# 3. جهّز قاعدة البيانات (هتنشئ ملف db/hayah.db تلقائيًا)
npm run init-db

# 4. شغّل السيرفر
npm start
```

السيرفر هيشتغل على: `http://localhost:4000`

## أهم الـ Endpoints

| Method | Endpoint                  | الوصف                          |
|--------|----------------------------|---------------------------------|
| GET    | /api/stations               | كل المحطات                      |
| PATCH  | /api/stations/:id            | تغيير حالة محطة (online/offline/warning) |
| GET    | /api/complaints              | كل الشكاوى                      |
| POST   | /api/complaints              | إضافة شكوى جديدة                |
| PATCH  | /api/complaints/:id          | تغيير حالة شكوى                 |
| GET    | /api/alerts                  | الإشعارات/الإنذارات             |
| POST   | /api/alerts                  | إضافة إشعار                     |
| DELETE | /api/alerts/:id              | حذف إشعار                       |
| GET    | /api/faults                  | بلاغات الأعطال                  |
| POST   | /api/faults                  | إضافة بلاغ عطل                  |
| GET    | /api/bills?user_id=1         | فواتير مستخدم                   |
| PATCH  | /api/bills/:id                | تحديث حالة فاتورة (دفع)         |
| GET    | /api/tasks?employee_id=5     | مهام موظف                       |
| PATCH  | /api/tasks/:id                | تعليم مهمة كمكتملة               |
| GET    | /api/work-orders             | أوامر الصيانة                   |
| POST   | /api/work-orders             | إضافة أمر صيانة                 |
| PATCH  | /api/work-orders/:id          | تحديث حالة أمر صيانة            |
| GET    | /api/kpis                    | مؤشرات الأداء المجمّعة محسوبة لحظيًا |

## ربطه بالفرونت إند (React)

في الـ artifact التفاعلي اللي عملناه، بدّل استدعاءات `window.storage` بـ `fetch` على نفس العنوان، مثال:

```js
const res = await fetch("http://localhost:4000/api/stations");
const stations = await res.json();
```

ولتحديث حالة محطة:
```js
await fetch(`http://localhost:4000/api/stations/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status: "offline" }),
});
```

## ملاحظة مهمة

السيرفر ده لازم يتشغل على جهازك أو على هوستينج (مثل Render أو Railway)، مش جوه شات Claude — الشات مفيهوش وصول لقواعد بيانات أو سيرفرات خارجية.
