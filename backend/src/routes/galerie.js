const express = require("express");
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const upload = require("../middleware/uploadMedia");

const router = express.Router();

router.use(authRequired);

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM galerie ORDER BY date_ajout DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/", upload.single("fichier"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier recu" });
  }

  const type = req.file.mimetype.startsWith("video/") ? "video" : "image";
  const titre = req.body.titre?.trim() || null;

  try {
    const [result] = await pool.query(
      `INSERT INTO galerie (type, fichier, titre, uploade_par)
       VALUES (?, ?, ?, ?)`,
      [type, req.file.filename, titre, req.user?.id || null]
    );
    const [rows] = await pool.query("SELECT * FROM galerie WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    const filePath = path.join(__dirname, "..", "..", "uploads", req.file.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT fichier FROM galerie WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Media introuvable" });

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "uploads",
      rows[0].fichier
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query("DELETE FROM galerie WHERE id = ?", [req.params.id]);
    res.json({ message: "Media supprime" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
