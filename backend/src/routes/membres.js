const express = require("express");
const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");
const { authRequired, pasteurOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Normalise le champ groupes venant du client (array, string JSON, ou CSV)
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

router.use(authRequired);

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM membres WHERE statut = 'valide' ORDER BY nom ASC, prenom ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM membres WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Membre introuvable" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

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
    const [result] = await pool.query(
      `INSERT INTO membres
       (nom, prenom, departement, groupes, profession, telephone, date_naissance, adresse, photo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    const [rows] = await pool.query("SELECT * FROM membres WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/:id", upload.single("photo"), async (req, res) => {
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

  try {
    const [existing] = await pool.query(
      "SELECT * FROM membres WHERE id = ?",
      [req.params.id]
    );
    if (existing.length === 0)
      return res.status(404).json({ message: "Membre introuvable" });

    let photo = existing[0].photo;
    if (req.file) {
      if (photo) {
        await cloudinary.uploader.destroy(photo).catch(() => {});
      }
      photo = req.file.filename;
    }

    await pool.query(
      `UPDATE membres SET
         nom = ?, prenom = ?, departement = ?, groupes = ?,
         profession = ?, telephone = ?, date_naissance = ?, adresse = ?, photo = ?
       WHERE id = ?`,
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
        req.params.id,
      ]
    );
    const [rows] = await pool.query("SELECT * FROM membres WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Attribution / retrait d'une fonction dans le comite (pasteur uniquement)
router.put("/:id/fonction", pasteurOnly, async (req, res) => {
  const fonctionsValides = [
    "president",
    "vice_president",
    "secretaire",
    "tresorier",
    "organisateur",
  ];
  const { fonction } = req.body;

  if (fonction !== null && fonction !== "" && !fonctionsValides.includes(fonction)) {
    return res.status(400).json({ message: "Fonction invalide" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT departement, statut FROM membres WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Membre introuvable" });
    if (rows[0].statut !== "valide")
      return res
        .status(400)
        .json({ message: "Le membre doit etre valide" });

    const nouvelleFonction = fonction && fonction !== "" ? fonction : null;

    if (nouvelleFonction) {
      const [dejaPrise] = await pool.query(
        "SELECT id, nom, prenom FROM membres WHERE departement = ? AND fonction = ? AND id <> ?",
        [rows[0].departement, nouvelleFonction, req.params.id]
      );
      if (dejaPrise.length > 0) {
        const occupant = dejaPrise[0];
        return res.status(409).json({
          message: `Cette fonction est deja occupee par ${occupant.prenom} ${occupant.nom} dans ce departement`,
        });
      }
    }

    await pool.query("UPDATE membres SET fonction = ? WHERE id = ?", [
      nouvelleFonction,
      req.params.id,
    ]);
    const [updated] = await pool.query("SELECT * FROM membres WHERE id = ?", [
      req.params.id,
    ]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT photo FROM membres WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Membre introuvable" });

    if (rows[0].photo) {
      await cloudinary.uploader.destroy(rows[0].photo).catch(() => {});
    }

    await pool.query("DELETE FROM membres WHERE id = ?", [req.params.id]);
    res.json({ message: "Membre supprime" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
