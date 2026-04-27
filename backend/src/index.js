require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const administrateursRoutes = require("./routes/administrateurs");
const membresRoutes = require("./routes/membres");
const inscriptionsRoutes = require("./routes/inscriptions");
const galerieRoutes = require("./routes/galerie");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`Origine non autorisee: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/administrateurs", administrateursRoutes);
app.use("/api/membres", membresRoutes);
app.use("/api/inscriptions", inscriptionsRoutes);
app.use("/api/galerie", galerieRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Erreur serveur" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API AD AKASSATO demarree sur le port ${PORT}`);
});
