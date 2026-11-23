try {
  process.loadEnvFile();
} catch {
  // .env is optional
}

const express = require("express");
const { connectDB, closeDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ success: true, message: "Saloone API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok", uptime: process.uptime() });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

async function start() {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const shutdown = async () => {
    server.close();
    await closeDB();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start();
