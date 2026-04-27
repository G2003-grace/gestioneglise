const express = require("express");
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");
const { authRequired } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

function normaliserGroupes(val) {
  if (!val) return "";
  if (Array.isArray(val)) return val.join(",");
  if (typeof val === "string") {
    const trim = val.trim();
    if (trim.startsWith("[")) {
      try {
        const arr = JSON.parse(trim);
        if (Array.isArray(arr)) return arr.join(",");
      } catch {
        // ignorer
      }
    }
    return trim;
  }
  return "";
}

// PUBLIC : auto-inscription d'un membre
router.post("/", upload.single("photo"), async (req, res) => {
  const {
    nom,
    prenom,
    departement,
    profession,
    telephone,
    date_naissance,
    adresse,
  } = req.body;
  const groupes = normaliserGroupes(req.body.groupes);

  if (!nom || !prenom || !departement || !groupes) {
    return res.status(400).json({
      message: "Nom, prenom, departement et au moins un groupe sont requis",
    });
  }

  const photo = req.file ? req.file.filename : null;

  try {
    await pool.query(
      `INSERT INTO membres
       (nom, prenom, departement, groupes, profession, telephone, date_naissance, adresse, photo, statut)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'en_attente')`,
      [
        nom,
        prenom,
        departement,
        groupes,
        profession || null,
        telephone || null,
        date_naissance || null,
        adresse || null,
        photo,
      ]
    );
    res.status(201).json({
      message:
        "Votre inscription a ete enregistree. Elle sera validee par un administrateur.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ADMIN : liste des inscriptions en attente
router.get("/", authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM membres WHERE statut = 'en_attente' ORDER BY date_ajout DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ADMIN : valider une inscription
router.put("/:id/valider", authRequired, async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE membres SET statut = 'valide' WHERE id = ? AND statut = 'en_attente'",
      [req.params.id]
    );
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ message: "Inscription introuvable ou deja traitee" });
    res.json({ message: "Inscription validee" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ADMIN : rejeter (supprimer) une inscription
router.delete("/:id", authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT photo FROM membres WHERE id = ? AND statut = 'en_attente'",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Inscription introuvable" });

    if (rows[0].photo) {
      const photoPath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        rows[0].photo
      );
      if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
    }

    await pool.query("DELETE FROM membres WHERE id = ?", [req.params.id]);
    res.json({ message: "Inscription rejetee" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
