-- ============================================================
-- قاعدة بيانات منصة "حياه" - المياه والصرف الذكية
-- ============================================================

CREATE TABLE users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name     TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL,
    phone         TEXT,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL CHECK (role IN ('citizen','employee','admin')),
    created_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stations (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    type        TEXT NOT NULL DEFAULT 'water' CHECK (type IN ('water','sewage')),
    capacity_m3 REAL,
    status      TEXT NOT NULL CHECK (status IN ('online','offline','warning')),
    created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bills (
    id         TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id),
    amount     REAL NOT NULL,
    due_date   TEXT NOT NULL,
    status     TEXT NOT NULL CHECK (status IN ('paid','unpaid')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE consumption_readings (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id  INTEGER NOT NULL REFERENCES users(id),
    month    TEXT NOT NULL,
    year     INTEGER NOT NULL,
    liters   REAL NOT NULL
);

CREATE TABLE complaints (
    id          TEXT PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    type        TEXT NOT NULL CHECK (type IN ('leakage','noWater','lowPressure','sewage','ضعف مياه','انقطاع مياه','صرف صحي','أخرى')),
    location    TEXT,
    description TEXT,
    priority    TEXT NOT NULL CHECK (priority IN ('high','med','low','عالي','متوسط','منخفض')),
    status      TEXT NOT NULL CHECK (status IN ('open','inProgress','closed')),
    created_at  TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at  TEXT
);

CREATE TABLE faults (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id  INTEGER NOT NULL REFERENCES users(id),
    station_id   TEXT NOT NULL REFERENCES stations(id),
    type         TEXT NOT NULL,
    notes        TEXT,
    photo_url    TEXT,
    created_at   TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL REFERENCES users(id),
    title_ar    TEXT NOT NULL,
    title_en    TEXT NOT NULL,
    done        INTEGER NOT NULL DEFAULT 0,
    task_date   TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE work_orders (
    id          TEXT PRIMARY KEY,
    asset       TEXT NOT NULL,
    station_id  TEXT REFERENCES stations(id),
    status      TEXT NOT NULL CHECK (status IN ('open','inProgress','closed')),
    assignee_id INTEGER REFERENCES users(id),
    created_at  TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE energy_readings (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    station_id TEXT NOT NULL REFERENCES stations(id),
    reading_date TEXT NOT NULL,
    kwh        REAL NOT NULL
);

CREATE TABLE notifications (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id),
    message    TEXT NOT NULL,
    is_read    INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- بيانات تجريبية
-- ============================================================

INSERT INTO users (full_name, email, phone, password_hash, role) VALUES
('Mohamed K.', 'mohamed@example.com', '0100000001', 'hash1', 'citizen'),
('Sara A.',    'sara@example.com',    '0100000002', 'hash2', 'citizen'),
('Yara M.',    'yara@example.com',    '0100000003', 'hash3', 'citizen'),
('Omar S.',    'omar@example.com',    '0100000004', 'hash4', 'citizen'),
('Hassan T.',  'hassan@example.com',  '0100000005', 'hash5', 'employee'),
('Mona R.',    'mona@example.com',    '0100000006', 'hash6', 'employee'),
('Admin User', 'admin@example.com',   '0100000007', 'hash7', 'admin');

INSERT INTO stations (id, name, type, capacity_m3, status) VALUES
('ST-01', 'المفتي', 'water', 12000, 'online'),
('ST-02', 'سيدي سالم شرق', 'water', 8500, 'online'),
('ST-03', 'سيدي سالم غرب', 'water', 9200, 'online'),
('ST-04', 'الرياض', 'water', 5000, 'offline'),
('ST-05', 'محطة معالجة سيدي سالم', 'sewage', 9200, 'online'),
('ST-06', 'محطة معالجة كفر السلام', 'sewage', 5000, 'offline');

INSERT INTO bills (id, user_id, amount, due_date, status) VALUES
('B-2201', 1, 184.50, '2026-07-05', 'unpaid'),
('B-2188', 1, 162.00, '2026-06-05', 'paid'),
('B-2170', 1, 171.25, '2026-05-05', 'paid');

INSERT INTO complaints (id, user_id, type, priority, status) VALUES
('C-441', 1, 'ضعف مياه', 'عالي', 'open'),
('C-439', 2, 'انقطاع مياه', 'متوسط', 'open'),
('C-432', 3, 'صرف صحي', 'منخفض', 'closed'),
('C-428', 4, 'أخرى', 'عالي', 'open');

INSERT INTO tasks (employee_id, title_ar, title_en, done) VALUES
(5, 'فحص مضخة المحطة المركزية', 'Inspect central station pump', 0),
(5, 'تسجيل قراءة الكلور - الشمالية', 'Log chlorine reading - North plant', 0),
(5, 'متابعة بلاغ تسرب C-441', 'Follow up leak report C-441', 1);

INSERT INTO work_orders (id, asset, station_id, status, assignee_id) VALUES
('WO-118', 'Pump #3 - North', 'ST-01', 'inProgress', 5),
('WO-115', 'Valve - Central', 'ST-02', 'open', NULL),
('WO-109', 'Filter unit - East', 'ST-03', 'closed', 6);

INSERT INTO consumption_readings (user_id, month, year, liters) VALUES
(1, 'Jan', 2026, 18), (1, 'Feb', 2026, 22), (1, 'Mar', 2026, 19),
(1, 'Apr', 2026, 26), (1, 'May', 2026, 24), (1, 'Jun', 2026, 28);

INSERT INTO energy_readings (station_id, reading_date, kwh) VALUES
('ST-01', '2026-06-01', 1200),
('ST-02', '2026-06-01', 980),
('ST-03', '2026-06-01', 1430),
('ST-04', '2026-06-01', 600);
