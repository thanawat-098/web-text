const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();
const port = 3200;
dotenv.config();

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล:", err);
    throw err;
  }
  console.log("เชื่อมต่อฐานข้อมูลสำเร็จ");
});

// login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  const query = "SELECT * FROM users WHERE username = ?";
  db.execute(query, [username], async (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล" });

    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }
    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }
    res.json({ message: "ล็อคอินสำเร็จ" });
  });
});

//register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" });
  }
  //ตรวจสอบว่ามีผู้ใช้อยู่แล้ว
  const checkQuery = "SELECT * FROM users WHERE username = ?";
  db.execute(checkQuery, [username], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.status(400).json({ message: "ชื่อผู้ใช้นี้มีอยู่แล้ว" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertQuery = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.execute(insertQuery, [username, hashedPassword], (err) => {
      if (err) throw err;
      res.json({ message: "ลงทะเบียนสำเร็จ" });
    });
  });
});

//อัพไฟล์
const upload = multer({ dest: "uploads/" });

// อัปโหลด CSV
app.post("/upload", upload.single("file"), (req, res) => {
  const filePath = `uploads/${req.file.filename}`;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      // ใส่ข้อมูลลงในตาราง
      const insertQuery = `
        INSERT INTO user_data (username, department, license, installed, brand, model, serial)
        VALUES ?
      `;
      const values = results.map((row) => [
        row.username,
        row.department,
        row.license,
        row.Installed,
        row.brand,
        row.model,
        row.serial,
      ]);
      db.query(insertQuery, [values], (err) => {
        if (err) throw err;
        res.send("CSV data imported successfully.");
      });
    });
});

// ดึงข้อมูลจากฐานข้อมูล
app.get("/data", (req, res) => {
  db.query("SELECT * FROM user_data", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// export to JSON
app.get("/export", (req, res) => {
  db.query("SELECT * FROM user_data", (err, results) => {
    if (err) throw err;
    res.header("Content-Type", "application/json");
    res.attachment("data.json");
    res.send(JSON.stringify(results));
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
