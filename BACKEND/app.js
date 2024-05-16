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
            connection.query(
                `SELECT p.*, c.gender, c.type, c.colors, c.size,
                 GROUP_CONCAT(i.path) AS images_paths
                FROM produits p
                JOIN caracteristiques c ON p.idCaracter = c.idCaracter
                LEFT JOIN images i ON p.idProduct = i.idProduct
                GROUP BY p.idProduct;
                `, (erreur, resultats) => {
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
        cb(null, '/Images_BD');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

  
  const upload = multer({ storage: storage }).any();
 
  app.post('/ajouter', (req, res) => {
    upload(req, res, (erreur) => {
        if (erreur) {
            console.log(erreur);
            return res.status(500).send("Une erreur est survenue lors du téléchargement des images.");
        }
        
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

        // Valider les données du formulaire
        if (!name || !quantity || !price || !reduction || !description || !gender || !type || !devise) {
            return res.status(400).send("Tous les champs du formulaire sont requis.");
        }

        req.getConnection((erreur, connection) => {
            if (erreur) {
                console.log(erreur);
                return res.status(500).send("Erreur de connexion à la base de données.");
            }

            connection.beginTransaction((erreur) => {
                if (erreur) {
                    console.log(erreur);
                    return res.status(500).send("Une erreur est survenue lors de la transaction.");
                }

                const insertCaracterQuery = 'INSERT INTO caracteristiques (gender, type, colors, size) VALUES (?, ?, ?, ?)';
                const insertProduitQuery = 'INSERT INTO produits (name, quantity, price, devise, reduction, description, idCaracter) VALUES (?, ?, ?, ?, ?, ?, ?)';

                const colorsArray = colors ? colors.join(',') : '';
                const sizeArray = size ? size.join(',') : '';

                connection.query(insertCaracterQuery, [gender, type, colorsArray, sizeArray], (erreur, resultatsCaracter) => {
                    if (erreur) {
                        connection.rollback(() => {
                            console.log(erreur);
                            return res.status(500).send("Une erreur est survenue lors de l'insertion des caractéristiques.");
                        });
                    } else {
                        const idCaracter = resultatsCaracter.insertId;

                        // Stockage des images
                        colors.forEach(color => {
                            for (let j = 1; j <= 3; j++) {
                                const imgPath = `Images_BD/${color}/Img${j}/${req.files[`img_${color}_${j}`][0].filename}`;
                                connection.query('INSERT INTO images (idProduct, path) VALUES (?, ?)', [idCaracter, imgPath], (erreur) => {
                                    if (erreur) {
                                        connection.rollback(() => {
                                            console.log(erreur);
                                            return res.status(500).send("Une erreur est survenue lors de l'insertion de l'image.");
                                        });
                                    }
                                });
                            }
                        });

                        connection.query(insertProduitQuery, [name, quantity, price, devise, reduction, description, idCaracter], (erreur, resultatsProduit) => {
                            if (erreur) {
                                connection.rollback(() => {
                                    console.log(erreur);
                                    return res.status(500).send("Une erreur est survenue lors de l'insertion du produit.");
                                });
                            } else {
                                connection.commit((erreur) => {
                                    if (erreur) {
                                        connection.rollback(() => {
                                            console.log(erreur);
                                            return res.status(500).send("Une erreur est survenue lors de la validation de la transaction.");
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
            });
        });
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