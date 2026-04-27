require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("./config/db");

async function seed() {
  const email = "pasteur@adakassato.com";
  const motDePasseClair = "pasteur123";

  try {
    const [rows] = await pool.query(
      "SELECT id FROM administrateurs WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      console.log("Le compte pasteur existe deja. Aucune action.");
      process.exit(0);
    }

    const hash = await bcrypt.hash(motDePasseClair, 10);
    await pool.query(
      "INSERT INTO administrateurs (nom, prenom, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?)",
      ["Pasteur", "Principal", email, hash, "pasteur"]
    );
    console.log("Compte pasteur cree :");
    console.log(`  Email    : ${email}`);
    console.log(`  Mot de passe : ${motDePasseClair}`);
    console.log("IMPORTANT : changez ce mot de passe apres la premiere connexion.");
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors du seed :", err);
    process.exit(1);
  }
}

seed();
