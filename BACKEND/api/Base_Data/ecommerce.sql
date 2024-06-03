-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 03 juin 2024 à 06:53
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
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `caracteristiques`
--

INSERT INTO `caracteristiques` (`idCaracter`, `gender`, `type`, `colors`, `size`) VALUES
(10, 'Homme', 'Maillot', 'black,white', 'xs,s,m,l,xl'),
(6, 'Femme', 'Maillot', 'black,white', 'xs,s,m,l,xl,2xl,3xl'),
(5, 'Femme', 'Maillot', 'black,white', 'xs,s,m,l,xl,2xl'),
(8, 'Homme', 'Maillot', 'black,white', 'xs,s,l,xl,2xl'),
(11, 'Femme', 'Maillot', 'black,white', 's,m,l,xl'),
(12, 'Femme', 'Short', 'black', 'xs,s,m,l'),
(13, 'Homme', 'Short', 'black', 'xs,s,2xl,3l'),
(14, 'Homme', 'Maillot', 'black,white', 's,m,l,3l'),
(15, 'Homme', 'Maillot', 'black,white', 'xs,s,l,2xl'),
(16, 'Homme', 'Maillot', 'black,white', 's,l,xl,3l'),
(17, 'Homme', 'Maillot', 'black', 's,l,xl,3l');

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
) ENGINE=MyISAM AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `images`
--

INSERT INTO `images` (`idImage`, `path`, `idProduct`) VALUES
(45, 'Images_BD\\black\\Img3\\Maillot_Exterieur_Real_Madrid_23-24_Bleu_IJ5901_HM3_hover.avif', 9),
(44, 'Images_BD\\black\\Img2\\Maillot_Exterieur_Real_Madrid_23-24_Bleu_IJ5901_HM5.avif', 9),
(43, 'Images_BD\\black\\Img1\\Maillot_Exterieur_Real_Madrid_23-24_Bleu_IJ5901_HM1.avif', 9),
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
(30, 'Images_BD\\white\\Img3\\Maillot_Domicile_Arsenal_23-24_Rouge_HZ2086_HM1.avif', 5),
(41, 'Images_BD\\white\\Img2\\Maillot_Domicile_FC_Bayern_23-24_Blanc_IJ7442_HM4.avif', 8),
(40, 'Images_BD\\white\\Img1\\Maillot_Domicile_FC_Bayern_23-24_Blanc_IJ7442_HM5.avif', 8),
(39, 'Images_BD\\black\\Img3\\Maillot_Exterieur_FC_Bayern_23-24_Noir_HR3719_HM3_hover.avif', 8),
(38, 'Images_BD\\black\\Img2\\Maillot_Exterieur_FC_Bayern_23-24_Noir_HR3719_HM1.avif', 8),
(37, 'Images_BD\\black\\Img1\\Maillot_Exterieur_FC_Bayern_23-24_Noir_HR3719_HM4.avif', 8),
(42, 'Images_BD\\white\\Img3\\Maillot_Domicile_FC_Bayern_23-24_Blanc_IJ7442_HM3_hover.avif', 8),
(46, 'Images_BD\\white\\Img1\\Maillot_Domicile_Real_Madrid_23-24_Blanc_HR3796_HM4.avif', 9),
(47, 'Images_BD\\white\\Img2\\Maillot_Domicile_Real_Madrid_23-24_Blanc_HR3796_HM1.avif', 9),
(48, 'Images_BD\\white\\Img3\\Maillot_Domicile_Real_Madrid_23-24_Blanc_HR3796_HM3_hover.avif', 9),
(49, 'Images_BD\\black\\Img1\\Maillot_Exterieur_Espagne_24_Jaune_IP9340_25_model.avif', 10),
(50, 'Images_BD\\black\\Img2\\Maillot_Exterieur_Espagne_24_Jaune_IP9340_21_model.avif', 10),
(51, 'Images_BD\\black\\Img3\\Maillot_Exterieur_Espagne_24_Jaune_IP9340_23_hover_model.avif', 10),
(52, 'Images_BD\\white\\Img1\\Maillot_Domicile_Espagne_24_Rouge_IP9352_21_model.avif', 10),
(53, 'Images_BD\\white\\Img2\\Maillot_Domicile_Espagne_24_Rouge_IP9352_25_model.avif', 10),
(54, 'Images_BD\\white\\Img3\\Maillot_Domicile_Espagne_24_Rouge_IP9352_23_hover_model.avif', 10),
(55, 'Images_BD\\black\\Img1\\Short_Essentials_3-Stripes_Bike_Noir_GR3866_01_laydown.avif', 11),
(56, 'Images_BD\\black\\Img2\\Short_Essentials_3-Stripes_Bike_Noir_GR3866_21_model.avif', 11),
(57, 'Images_BD\\black\\Img3\\Short_Essentials_3-Stripes_Bike_Noir_GR3866_23_hover_model.avif', 11),
(58, 'Images_BD\\black\\Img1\\Short_Adicolor_3_bandes_Noir_IU2337_21_model.avif', 12),
(59, 'Images_BD\\black\\Img2\\Short_Adicolor_3_bandes_Noir_IU2337_25_model.avif', 12),
(60, 'Images_BD\\black\\Img3\\Short_Adicolor_3_bandes_Noir_IU2337_23_hover_model.avif', 12),
(61, 'Images_BD\\black\\Img1\\Maillot_Exterieur_Italie_24_Blanc_IN0656_25_model.avif', 13),
(62, 'Images_BD\\black\\Img2\\Maillot_Exterieur_Italie_24_Blanc_IN0656_21_model.avif', 13),
(63, 'Images_BD\\black\\Img3\\Maillot_Exterieur_Italie_24_Blanc_IN0656_23_hover_model.avif', 13),
(64, 'Images_BD\\white\\Img1\\Maillot_Domicile_Italie_24_Bleu_IN0657_01_laydown.avif', 13),
(65, 'Images_BD\\white\\Img2\\Maillot_Domicile_Italie_24_Bleu_IN0657_21_model.avif', 13),
(66, 'Images_BD\\white\\Img3\\Maillot_Domicile_Italie_24_Bleu_IN0657_23_hover_model.avif', 13),
(67, 'Images_BD\\black\\Img1\\Maillot_Exterieur_Manchester_United_23-24_Vert_HR3675_HM1.avif', 14),
(68, 'Images_BD\\black\\Img2\\Maillot_Exterieur_Manchester_United_23-24_Vert_HR3675_HM5.avif', 14),
(69, 'Images_BD\\black\\Img3\\Maillot_Exterieur_Manchester_United_23-24_Vert_HR3675_HM3_hover.avif', 14),
(70, 'Images_BD\\white\\Img1\\Maillot_Domicile_Manchester_United_23-24_Rouge_IP1726_HM1.avif', 14),
(71, 'Images_BD\\white\\Img2\\Maillot_Domicile_Manchester_United_23-24_Rouge_IP1726_HM5.avif', 14),
(72, 'Images_BD\\white\\Img3\\Maillot_Domicile_Manchester_United_23-24_Rouge_IP1726_HM3_hover.avif', 14),
(73, 'Images_BD\\black\\Img1\\Maillot_Exterieur_Argentine_24_Bleu_IP8413_21_model.avif', 15),
(74, 'Images_BD\\black\\Img2\\Maillot_Exterieur_Argentine_24_Bleu_IP8413_25_model.avif', 15),
(75, 'Images_BD\\black\\Img3\\Maillot_Exterieur_Argentine_24_Bleu_IP8413_23_hover_model.avif', 15),
(76, 'Images_BD\\white\\Img1\\Maillot_Argentine_24_Domicile_Blanc_IP8409_21_model.avif', 15),
(77, 'Images_BD\\white\\Img2\\Maillot_Argentine_24_Domicile_Blanc_IP8409_25_model.avif', 15),
(78, 'Images_BD\\white\\Img3\\Maillot_Argentine_24_Domicile_Blanc_IP8409_23_hover_model.avif', 15),
(79, 'Images_BD\\black\\Img1\\Maillot_Domicile_FC_Bayern_24-25_Rouge_IT8511_HM6.avif', 16),
(80, 'Images_BD\\black\\Img2\\Maillot_Domicile_FC_Bayern_24-25_Rouge_IT8511_HM1.avif', 16),
(81, 'Images_BD\\black\\Img3\\Maillot_Domicile_FC_Bayern_24-25_Rouge_IT8511_HM3_hover.avif', 16);

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
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `produits`
--

INSERT INTO `produits` (`idProduct`, `name`, `quantity`, `price`, `devise`, `reduction`, `description`, `idCaracter`) VALUES
(1, 'MAILLOT REAL DE MADRID', 4, 120.00, 'EURO', 12.00, 'Le maillot Homme du Real Madrid revisite la tradition avec une touche dorée. Conservant une base blanc immaculé, ce maillot unique perpétue un héritage iconique, avec un design élégant inspiré de l\'histoire d\'un club de football légendaire.', 1),
(4, 'MAILLOT REAL DE MADRID', 12, 110.00, 'EURO', 2.00, 'Le maillot femme du Real Madrid : un symbole de passion et d’élégance. Confortable, stylé et représentatif de l’histoire prestigieuse du club. Un choix incontournable pour les supportrices qui veulent afficher leur amour pour le football et leur équipe préférée.', 5),
(5, 'MAILLOT  ARSENAL 23/24', 15, 150.20, 'DOLLARS', 4.99, 'Le maillot pour femme d’Arsenal : une fusion parfaite entre style et performance. Affichez votre soutien avec ce vêtement emblématique, conçu pour les passionnées de football. Confortable et élégant, il vous accompagnera avec fierté dans chaque match.', 6),
(8, 'MAILLOT FC BAYERN 23/24', 154, 157.00, 'EURO', 0.00, 'Le maillot FC Bayern 23/24 incarne l\'élégance et la tradition de l\'un des clubs les plus prestigieux d\'Europe. Conçu avec un design moderne et épuré, il arbore les couleurs emblématiques du club bavarois : le rouge vibrant et le blanc éclatant. Fabriqué avec des matériaux de haute qualité, il offre un confort optimal et une grande respirabilité, idéal pour les performances sportives.', 8),
(9, 'MAILLOT REAL DE MADRID 23/24', 75, 200.00, 'EURO', 59.00, 'Découvrez le maillot Real Madrid 23/24, un incontournable pour tous les fans des Merengues. Arborant les couleurs emblématiques blanc et or, ce maillot signé Adidas est conçu en tissu AEROREADY pour une évacuation optimale de la transpiration, assurant confort et performance. Les détails soignés, tels que l\'écusson brodé et les bandes Adidas, ajoutent une touche de qualité et de style. Disponible en plusieurs tailles, il convient à tous les supporters, petits et grands.', 10),
(10, 'MAILLOT ESPAGNE 23/24', 68, 250.00, 'EURO', 30.00, 'Découvrez le maillot officiel de l\'équipe d\'Espagne pour femme, saison 23/24. Ce maillot emblématique est conçu pour les vraies passionnées de football. Fabriqué avec des matériaux de haute qualité, il offre un confort optimal et une durabilité exceptionnelle. Sa coupe féminine épouse parfaitement les formes pour un look élégant sur et en dehors du terrain. Doté des dernières technologies, il garantit une évacuation rapide de la transpiration pour vous garder au sec et à l\'aise pendant les match', 11),
(11, 'SHORT  ESSENTIALS 3', 25, 50.00, 'EURO', 0.00, 'Découvrez le short Essentials 3 pour femme, parfait pour vos séances d\'entraînement et moments de détente. Conçu avec des matériaux de haute qualité, il offre un confort exceptionnel et une grande liberté de mouvement. Sa coupe ajustée et son design moderne en font un choix idéal pour rester active tout en restant stylée. La taille élastique avec cordon de serrage assure un ajustement parfait, tandis que les poches latérales ajoutent une touche pratique.', 12),
(12, 'SHORT ADICOLOR 3 BANDES', 20, 40.00, 'EURO', 0.00, 'Un classique réinventé. Ce short adidas revisite une silhouette classique avec des détails tendance. Le molleton doux assure un maximum de confort tout au long de la journée. Un logo Trèfle brodé reste fidèle à l\'héritage adidas, tout comme les 3 bandes sur les côtés.\r\n\r\nLe coton de ce produit a été sourcé via Better Cotton. Cette organisation utilise une approche de traçabilité appelée « Mass Balance ».', 13),
(16, 'MAILLOT FC BAYERN 24/25', 10, 130.00, 'EURO', 0.00, 'Un maillot domicile rayé classique revisité. Créés à partir de trois nuances de rouge, les rayures sinueuses de ce maillot FC Bayern adidas sont formées de minuscules losanges pour une touche signature du club. Conçu pour offrir un maximum de confort aux fans de football et leur permettre de montrer leur soutien, il est équipé de la technologie AEROREADY qui évacue la transpiration et orné d\'un blason du club brodé.', 17),
(13, 'MAILLOT ITALIE 24', 14, 150.00, 'EURO', 0.00, 'Joue pour le drapeau. Le rouge, le blanc et le vert du drapeau « il Tricolore » occupent une place de choix dans le design unique de ce maillot extérieur adidas de l\'Italie. Un blason de l\'équipe tissé sur la poitrine ajoute une touche d\'inspiration football. La technologie AEROREADY évacue la transpiration pour que tu puisses porter ce t-shirt sur le terrain, mais son principal objectif est de rendre chaque fan fier de sa nation.\r\n\r\nCe produit est conçu avec des matériaux 100 % recyclés. ', 14),
(14, 'MAILLOT MANCHESTER UNITED 23/24', 20, 100.00, 'EURO', 0.00, 'Un club, une ville. Affiche fièrement les couleurs de ton équipe avec le maillot domicile 23/24 de Manchester United.\r\n\r\nCe maillot est un clin d\'œil à l\'influence internationale de Manchester United. Reprenant les éléments d\'un pont voisin datant de la Révolution industrielle, il affiche un motif géométrique répété inspiré de la Rose de Lancashire à l\'avant. La technologie thermorégulatrice HEAT.', 15),
(15, 'MAILLOT ARGENTINE 24', 10, 140.00, 'EURO', 0.00, 'Arbore les couleurs de l\'Argentine avec ce maillot extérieur adidas inspiré de la scène musicale nationale. Affichant des éléments métallisés et une nuance de bleu unique, ce maillot de football est conçu pour offrir un maximum de confort aux fans avec ses inserts en mesh et la technologie AEROREADY qui évacue la transpiration. Un blason de l\'équipe tissé occupe le devant de la scène lorsque tu chantes pour encourager les joueurs.', 16);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
