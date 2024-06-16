### WETHEFOOT - Boutique en ligne de vente de maillots

## Introduction

WETHEFOOT est une boutique en ligne de vente de maillots de football. Ce projet comporte deux serveurs principaux : un serveur pour l'API et un serveur pour le backend. Ce guide vous expliquera comment configurer et lancer ces deux serveurs.

## Prérequis

- Node.js (version 14 ou ultérieure)
- MySQL
- npm (gestionnaire de paquets Node.js)

## Installation

### Étape 1: Cloner le dépôt

Cloner le dépôt de notre projet WETHEFOOT:

bash
git clone https://github.com/votre-utilisateur/wethefoot.git
cd wethefoot


### Étape 2: Installer les dépendances

Accédez aux dossiers du serveur API et du backend pour installer les dépendances nécessaires.

Pour le serveur API :

bash
cd API
npm install


Pour le serveur backend :

bash
cd ../backend
npm install


### Étape 3: Configuration de l'environnement

Créer un fichier .env à la racine du projet (au même niveau que les dossiers API et backend) et y ajouter les configurations suivantes:


DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce
PORT=3000


### Étape 4: Configuration de la base de données

Assurez-vous d'avoir MySQL installé et configuré sur votre machine. Créez une base de données nommée ecommerce et importez-y les tables nécessaires.

### Étape 5: Lancer les serveurs

Pour le serveur API :

bash
cd API
node server.js


Pour le serveur backend :

bash
cd ../backend
node app.js


## Arborescence des fichiers

Voici une vue d'ensemble de l'arborescence des fichiers :


wethefoot/
├── API/
│   ├── routes/
│   │   ├── produitRoutes.js
│   │   ├── viewRoutes.js
│   ├── server.js
│   ├── .env
│   ├── Images_BD/
│   ├── assets/
│   ├── views/
├── backend/
│   ├── routes/
│   │   ├── backofficeRoutes.js
│   ├── app.js
│   ├── .env
│   ├── ../FRONTEND/
│   │   ├── assets/
│   │   ├── templates/
└── .env


## Utilisation

- *API Server*: Le serveur API est accessible via le port spécifié dans votre fichier .env (par défaut, 3000). Les endpoints principaux sont /api/produits pour les produits et / pour les vues.
- *Backend Server*: Le serveur backend est accessible via le port 8000. Les endpoints principaux sont /backend pour le back-office.

## Conclusion

Votre projet WETHEFOOT est maintenant configuré et prêt à être utilisé. Vous pouvez étendre les fonctionnalités en ajoutant de nouvelles routes, en améliorant l'interface utilisateur, ou en optimisant la base de données. Bon développement !