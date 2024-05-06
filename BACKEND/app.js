const express = require('express');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const app = express();
const port = 8000;
require('dotenv').config();


//extraction des donnes du formulaire
app.use(express.urlencoded({ extended: false }));

//config de la connexion avec la bd
const optionBd = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 3306,
    database: 'ecommerce'
};

//def du midlerware pour connexion avec la bd
app.use(myConnection(mysql, optionBd, 'single'));

//config-gestion fichiers statiques
const path = require('path');
app.use("/Images_BD", express.static(path.join(__dirname, 'Images_BD')));

//definition du moteur de templates html
app.set('view engine', 'ejs');
//definition du dossier des vues
app.set('views', __dirname + '/../FRONTEND/templates');

//definition des fichiers statiques
app.use('/assets', express.static(path.join(__dirname, '../FRONTEND/assets')));


//page admin pour ajouté les profduits
app.get('/admin', (req, res) => {
    res.render('admin');
});
//page index pour afficher les produits 
app.get('/', (req, res) => {

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            connection.query('SELECT p.*,c.gender,c.type,c.colors,c.size FROM produits p JOIN caracteristiques c ON p.idCaracter= c.idCaracter',
                [], (erreur, resultats) => {
                    if (erreur) {
                        console.log(erreur);
                    } else {
                        console.log(resultats)
                        res.render('index', { produits: resultats });
                    }
                });
        }
    });
});


//gerer le telechargement des images
const multer = require('multer');

//config de multer pour specifier le dossier d'enregistrement des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'img_1') {
        cb(null, 'Images_BD/Img1');
      } else if (file.fieldname === 'img_2') {
        cb(null, 'Images_BD/Img2');
      } else if (file.fieldname === 'img_3') {
        cb(null, 'Images_BD/Img3');
      } else {
        cb(null, 'Images_BD');
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage }).fields([
    { name: 'img_1', maxCount: 1 },
    { name: 'img_2', maxCount: 1 },
    { name: 'img_3', maxCount: 1 }
  ]);
  
  // AJOUTER DES PRODUITS DANS LA BASE DE DONNÉES
  app.post('/ajouter', (req, res) => {
    upload(req, res, (erreur) => {
      if (erreur) {
        console.log(erreur);
      } else {
        // Récupérer les noms de fichiers téléchargés
        const img_1 = req.files['img_1'][0].filename;
        const img_2 = req.files['img_2'][0].filename;
        const img_3 = req.files['img_3'][0].filename;
  
        // Récupérer les données soumises à partir de la requête (req.body)
        const { 
          name, 
          quantity,
          price, 
          reduction,
          description,
          gender,
          type,
          size,
          colors,
          devise
        } = req.body;
  
        // Insérer les données dans la base de données
        req.getConnection((erreur, connection) => {
          if (erreur) {
            console.log(erreur);
          } else {
            const insertProduitQuery = 'INSERT INTO produits (name, quantity, price, devise, reduction, img_1, img_2, img_3, description, idCaracter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const insertCaracterQuery = 'INSERT INTO caracteristiques (gender, type, colors, size) VALUES (?, ?, ?, ?)';
  
            connection.beginTransaction((erreur) => {
              if (erreur) {
                console.log(erreur);
              } else {
                // Insérer les caractéristiques
                const colorsArray = colors ? colors.join(',') : [];
                const sizeArray = size ? size.join(',') : [];
                
                const caracteristiques = [gender, type, colorsArray.join(','), sizeArray.join(',')];
                connection.query(insertCaracterQuery, caracteristiques, (erreur, resultatsCaracter) => {
                  if (erreur) {
                    connection.rollback(() => {
                      console.log(erreur);
                    });
                  } else {
                    // Insérer le produit avec la référence à la caractéristique
                    const idCaracter = resultatsCaracter.insertId;
                    const produit = [name, quantity, price, devise, reduction, img_1, img_2, img_3, description, idCaracter];
                    connection.query(insertProduitQuery, produit, (erreur, resultatsProduit) => {
                      if (erreur) {
                        connection.rollback(() => {
                          console.log(erreur);
                        });
                      } else {
                        connection.commit((erreur) => {
                          if (erreur) {
                            connection.rollback(() => {
                              console.log(erreur);
                            });
                          } else {
                            console.log('Produit ajouté avec succès');
                            res.redirect('/admin');
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });



app.listen(port, () => {
    console.log('server listening on port 8000')
})
//page introuvable
app.use((req, res) => {
    res.status(404).render('pageIntrouvable')
});

//red