-- Base de données AD AKASSATO
CREATE DATABASE IF NOT EXISTS ad_akassato
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ad_akassato;

-- Table des administrateurs (pasteur + diacres)
CREATE TABLE IF NOT EXISTS administrateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL,
  role ENUM('pasteur', 'diacre') NOT NULL,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table des membres
CREATE TABLE IF NOT EXISTS membres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  departement ENUM('JAD', 'ASC', 'AHC', 'Enfants et ados') NOT NULL,
  groupes SET(
    'Groupe musical',
    'EDL',
    'Chorale fon',
    'Chorale francaise',
    'Groupe de netoyage',
    'Evangelisation',
    'Mission'
  ) NOT NULL,
  fonction ENUM(
    'president',
    'vice_president',
    'secretaire',
    'tresorier',
    'organisateur'
  ) DEFAULT NULL,
  profession VARCHAR(150),
  telephone VARCHAR(20),
  date_naissance DATE,
  adresse VARCHAR(255),
  photo VARCHAR(255),
  statut ENUM('en_attente', 'valide') NOT NULL DEFAULT 'valide',
  date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table de la galerie (photos et videos)
CREATE TABLE IF NOT EXISTS galerie (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('image', 'video') NOT NULL,
  fichier VARCHAR(255) NOT NULL,
  titre VARCHAR(255),
  uploade_par INT,
  date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploade_par) REFERENCES administrateurs(id) ON DELETE SET NULL
) ENGINE=InnoDB;
