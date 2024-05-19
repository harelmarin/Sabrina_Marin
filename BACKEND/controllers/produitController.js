const produitController ={};
const multer = require('multer');
const fs = require('fs');
const port = 8000;
// Function to create directory if it doesn't exist
function createDirectoryIfNotExist(dir) {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });}}
//function pour sauvegarder chaque image dans le bon dossier
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const color = file.fieldname.split('_')[0]; // Extract color from fieldname
        const imgNumber = file.fieldname.split('_')[2]; // Extract img number from fieldname
        const dir = path.join(__dirname, 'Images_BD', color, `Img${imgNumber}`);
        createDirectoryIfNotExist(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
// Fonction pour obtenir les derniers produits ajoutés
const getLastestProducts = (connection, limit, callback) => {
    connection.query(
      `SELECT p.*, c.gender, c.type, c.colors, c.size,
       GROUP_CONCAT(i.path) AS images_paths
      FROM produits p
      JOIN caracteristiques c ON p.idCaracter = c.idCaracter
      LEFT JOIN images i ON p.idProduct = i.idProduct
      GROUP BY p.idProduct
      ORDER BY p.dateAjout DESC
      LIMIT ?;
      `,
      [limit],
      (erreur, resultats) => {
        if (erreur) {
          console.log(erreur);
          callback(erreur, null);
        } else {
          callback(null, resultats);
        }
      }
    );
  };





  //
  //
  //
  //

//page admin
produitController.admin = (req,res)=>{
    res.render('admin');
}

produitController.getIndex=(req,res)=> {
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
                    } }); }  });
};


produitController.getProduit = (req,res) =>{
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
                    WHERE p.idProduct = ?`, [req.params.id], (erreur, resultats) => {
                        if (erreur) {
                            console.log(erreur);
                            } else {
                                const baseUrl = req.app.get('baseUrl') || `http://localhost:${port}`; // Set default if not configured
                                const imagesPaths = resultats[0].images_paths.split(',');
                                const formattedImagePaths = imagesPaths.map(path => `${baseUrl}/${path}`);
                                console.log(formattedImagePaths);
                                res.render('produit', { produit: resultats[0],imagesPaths:formattedImagePaths });
                             } }); }  });
};


produitController.postAjouter = (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: err.message });
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

                        connection.query(insertProduitQuery, [name, quantity, price, devise, reduction, description, idCaracter], (erreur, resultatsProduit) => {
                            if (erreur) {
                                connection.rollback(() => {
                                    console.log(erreur);
                                    return res.status(500).send("Une erreur est survenue lors de l'insertion du produit.");
                                });
                            } else {
                                const idProduct = resultatsProduit.insertId;

                                // Stockage des images dans la table images
                                const imageQueries = [];
                                req.files.forEach(file => {
                                    const color = file.fieldname.split('_')[0];
                                    const imgNumber = file.fieldname.split('_')[2]; // Extract img number from fieldname
                                    const dir = path.join(__dirname, 'Images_BD', color, `Img${imgNumber}`);
                                  
                                    const imgPath = path.join('Images_BD', color,`Img${imgNumber}`, file.filename);
                                    imageQueries.push(new Promise((resolve, reject) => {
                                        connection.query('INSERT INTO images (idProduct, path) VALUES (?, ?)', [idProduct, imgPath], (erreur) => {
                                            if (erreur) {
                                                return reject(erreur);
                                            }
                                            resolve();
                                        });
                                    }));
                                });

                                Promise.all(imageQueries).then(() => {
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
                                }).catch(erreur => {
                                    connection.rollback(() => {
                                        console.log(erreur);
                                        return res.status(500).send("Une erreur est survenue lors de l'insertion des images.");
                                    });
                                });
                            }
                        });
                    }
                });
            });
        });
    });
};

module.exports = produitController;