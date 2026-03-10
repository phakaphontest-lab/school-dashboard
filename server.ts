import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock data for initial development
  // In a real scenario, this would fetch from Google Sheets API
  app.get("/api/supervision-data", (req, res) => {
    const mockData = [
      { id: 1, teacher: "สมชาย ใจดี", department: "คณิตศาสตร์", date: "2024-03-01", score: 4.5, observer: "ผอ.วิชาการ", status: "เสร็จสิ้น" },
      { id: 2, teacher: "สมหญิง รักเรียน", department: "ภาษาไทย", date: "2024-03-02", score: 3.8, observer: "หัวหน้ากลุ่มสาระ", status: "เสร็จสิ้น" },
      { id: 3, teacher: "วิชัย ก้าวหน้า", department: "วิทยาศาสตร์", date: "2024-03-05", score: 4.2, observer: "ผอ.วิชาการ", status: "เสร็จสิ้น" },
      { id: 4, teacher: "นภา สดใส", department: "ภาษาอังกฤษ", date: "2024-03-07", score: 4.8, observer: "หัวหน้ากลุ่มสาระ", status: "เสร็จสิ้น" },
      { id: 5, teacher: "มานะ อดทน", department: "สังคมศึกษา", date: "2024-03-10", score: 3.5, observer: "ผอ.วิชาการ", status: "รอดำเนินการ" },
    ];
    res.json(mockData);
  });

  app.get("/api/stats", (req, res) => {
    res.json({
      total: 45,
      completed: 38,
      pending: 7,
      averageScore: 4.2,
      departmentStats: [
        { name: "คณิตศาสตร์", count: 12, avg: 4.1 },
        { name: "วิทยาศาสตร์", count: 10, avg: 4.3 },
        { name: "ภาษาไทย", count: 8, avg: 3.9 },
        { name: "ภาษาอังกฤษ", count: 15, avg: 4.5 },
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
