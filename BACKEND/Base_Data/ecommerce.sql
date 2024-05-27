.-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 27 mai 2024 à 06:45
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.13

CREATE DATABASE ecommerce;
use ecommerce;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ecommerce`
--

-- --------------------------------------------------------

--
-- Structure de la table `caracteristiques`
--

DROP TABLE IF EXISTS `caracteristiques`;
CREATE TABLE IF NOT EXISTS `caracteristiques` (
  `idCaracter` int NOT NULL AUTO_INCREMENT,
  `gender` varchar(50) NOT NULL,
  `type` varchar(100) NOT NULL,
  `colors` varchar(50) NOT NULL,
  `size` varchar(50) NOT NULL,
  PRIMARY KEY (`idCaracter`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `caracteristiques`
--

INSERT INTO `caracteristiques` (`idCaracter`, `gender`, `type`, `colors`, `size`) VALUES
(1, 'femme', 'pantalon', 'black', 'm,l'),
(6, 'Femme', 'Maillot', 'black,white', 'xs,s,m,l,xl,2xl,3xl'),
(5, 'Femme', 'Maillot', 'black,white', 'xs,s,m,l,xl,2xl');

-- --------------------------------------------------------

--
-- Structure de la table `images`
--

DROP TABLE IF EXISTS `images`;
CREATE TABLE IF NOT EXISTS `images` (
  `idImage` int NOT NULL AUTO_INCREMENT,
  `path` varchar(150) NOT NULL,
  `idProduct` int NOT NULL,
  PRIMARY KEY (`idImage`),
  KEY `idProduct` (`idProduct`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `images`
--

INSERT INTO `images` (`idImage`, `path`, `idProduct`) VALUES
(1, 'Images_BD\\black\\Img1\\1714941148423icons8-heart-hands-94.png', 1),
(2, 'Images_BD\\black\\Img2\\2786a0bfec3a7893de10385c13a1770d.jpg', 1),
(3, 'Images_BD\\black\\Img3\\bureau_etude.jpeg', 1),
(4, 'Images_BD\\white\\Img1\\manutention.jpeg', 1),
(5, 'Images_BD\\white\\Img2\\LOGISTIC_TRANSPORT.jpeg', 1),
(6, 'Images_BD\\white\\Img3\\maintenance.jpeg', 1),
(22, 'Images_BD\\white\\Img1\\Maillot_Domicile_Real_Madrid_23-24_Blanc_IB0016_HM4.avif', 4),
(19, 'Images_BD\\black\\Img1\\Maillot_Exterieur_Real_Madrid_23-24_Bleu_IB0005_HM5.avif', 4),
(20, 'Images_BD\\black\\Img2\\Maillot_Exterieur_Real_Madrid_23-24_Bleu_IB0005_HM1.avif', 4),
(21, 'Images_BD\\black\\Img3\\Maillot_Exterieur_Real_Madrid_23-24_Bleu_IB0005_HM5.avif', 4),
(25, 'Images_BD\\black\\Img1\\Maillot_Exterieur_Arsenal_23-24_Jaune_HZ2104_HM3_hover.avif', 5),
(24, 'Images_BD\\white\\Img3\\Maillot_Domicile_Real_Madrid_23-24_Blanc_IB0016_HM1.avif', 4),
(23, 'Images_BD\\white\\Img2\\Maillot_Domicile_Real_Madrid_23-24_Blanc_IB0016_HM3_hover.avif', 4),
(26, 'Images_BD\\black\\Img2\\Maillot_Exterieur_Arsenal_23-24_Jaune_HZ2104_HM1.avif', 5),
(27, 'Images_BD\\black\\Img3\\Maillot_Exterieur_Arsenal_23-24_Jaune_HZ2104_HM5.avif', 5),
(28, 'Images_BD\\white\\Img1\\Maillot_Domicile_Arsenal_23-24_Rouge_HZ2086_HM3_hover.avif', 5),
(29, 'Images_BD\\white\\Img2\\Maillot_Domicile_Arsenal_23-24_Rouge_HZ2086_HM5.avif', 5),
(30, 'Images_BD\\white\\Img3\\Maillot_Domicile_Arsenal_23-24_Rouge_HZ2086_HM1.avif', 5);

-- --------------------------------------------------------

--
-- Structure de la table `produits`
--

DROP TABLE IF EXISTS `produits`;
CREATE TABLE IF NOT EXISTS `produits` (
  `idProduct` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `devise` varchar(10) NOT NULL,
  `reduction` decimal(15,2) NOT NULL,
  `description` varchar(500) NOT NULL,
  `idCaracter` int NOT NULL,
  PRIMARY KEY (`idProduct`),
  KEY `idCaracter` (`idCaracter`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `produits`
--

INSERT INTO `produits` (`idProduct`, `name`, `quantity`, `price`, `devise`, `reduction`, `description`, `idCaracter`) VALUES
(1, 'MAILLOT REAL DE MADRID', 4, 120.00, 'EURO', 12.00, 'Le maillot Homme du Real Madrid revisite la tradition avec une touche dorée. Conservant une base blanc immaculé, ce maillot unique perpétue un héritage iconique, avec un design élégant inspiré de l\'histoire d\'un club de football légendaire.', 1),
(4, 'MAILLOT REAL DE MADRID', 12, 110.00, 'EURO', 2.00, 'Le maillot femme du Real Madrid : un symbole de passion et d’élégance. Confortable, stylé et représentatif de l’histoire prestigieuse du club. Un choix incontournable pour les supportrices qui veulent afficher leur amour pour le football et leur équipe préférée.', 5),
(5, 'MAILLOT  ARSENAL 23/24', 15, 150.20, 'DOLLARS', 4.99, 'Le maillot pour femme d’Arsenal : une fusion parfaite entre style et performance. Affichez votre soutien avec ce vêtement emblématique, conçu pour les passionnées de football. Confortable et élégant, il vous accompagnera avec fierté dans chaque match.', 6);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
