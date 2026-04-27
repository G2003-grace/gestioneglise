const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { authRequired, pasteurOnly } = require("../middleware/auth");

const router = express.Router();

router.use(authRequired);

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nom, prenom, email, role, date_creation FROM administrateurs ORDER BY role DESC, nom ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/", pasteurOnly, async (req, res) => {
  const { nom, prenom, email, mot_de_passe, role } = req.body;

  if (!nom || !prenom || !email || !mot_de_passe || !role) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }
  if (!["pasteur", "diacre"].includes(role)) {
    return res.status(400).json({ message: "Role invalide" });
  }

  try {
    if (role === "diacre") {
      const [[{ total }]] = await pool.query(
        "SELECT COUNT(*) AS total FROM administrateurs WHERE role = 'diacre'"
      );
      if (total >= 5) {
        return res
          .status(400)
          .json({ message: "Le nombre maximum de 5 diacres est atteint" });
      }
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);
    const [result] = await pool.query(
      "INSERT INTO administrateurs (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)",
      [nom, prenom, email, hash, role]
    );
    res.status(201).json({ id: result.insertId, nom, prenom, email, role });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Cet email existe deja" });
    }
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete("/:id", pasteurOnly, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT role FROM administrateurs WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Introuvable" });
    if (rows[0].role === "pasteur") {
      return res
        .status(400)
        .json({ message: "Le compte pasteur ne peut pas etre supprime" });
    }

    await pool.query("DELETE FROM administrateurs WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ message: "Administrateur supprime" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
