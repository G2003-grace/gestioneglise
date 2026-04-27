require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const administrateursRoutes = require("./routes/administrateurs");
const membresRoutes = require("./routes/membres");
const inscriptionsRoutes = require("./routes/inscriptions");
const galerieRoutes = require("./routes/galerie");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

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
  console.log(`API AD AKASSATO demarree sur http://localhost:${PORT}`);
});
