const produitController = {};
const helperUtils = require('../helperFolder/helpers');
const multer = require('multer');
const fs = require('fs');
const connection = require('express-myconnection');
const port = 8000;

//const  API NEUTRINO
const NEUTRINO_API_KEY = 'yot66w2T8JzN47jkGmjhQ8ngrfTgOIQDFFS1TKPOdykf3l5W';
const NEUTRINO_ENDPOINT = 'https://neutrinoapi.net/geocode-address';

//
//
//
//



//neutrino pour la géolocalisation
produitController.neutrinoApiRequest = async (req, res) => {
    const { address } = req.body;

    try {
        // Importation dynamique de node-fetch
        const fetch = await import('node-fetch');

        const response = await fetch.default(NEUTRINO_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-ID': 'kaporal77@sabrina',
                'API-Key': NEUTRINO_API_KEY
            },
            body: new URLSearchParams({
                address: address,
                'fuzzy-search': true
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from Neutrino:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//page admin et hgestion de produit
produitController.admin = (res) => {
    res.render('admin');
}
//page paier d'achat
produitController.cartPage=(req, res)=>{
    res.render('panier')
} 

//afficher tous les produits et pouvoir filtrer || pagination comprise
produitController.catalogue = (req, res) => {
    const { gender, type, colors, page = 1, limit = 2 } = req.query;

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
            return res.status(500).send("Erreur de connexion à la base de données");
        } else {
            const offset = (page - 1) * limit;

            const baseQuery = `
                SELECT p.*, c.gender, c.type, c.colors, c.size,
                       GROUP_CONCAT(i.path) AS images_paths
                FROM produits p
                JOIN caracteristiques c ON p.idCaracter = c.idCaracter
                LEFT JOIN images i ON p.idProduct = i.idProduct
            `;

            let whereClauses = [];
            let queryParams = [];

            if (gender) {
                whereClauses.push("c.gender = ?");
                queryParams.push(gender);
            }
            if (type) {
                whereClauses.push("c.type = ?");
                queryParams.push(type);
            }
            if (colors) {
                whereClauses.push("c.colors = ?");
                queryParams.push(colors);
            }

            let whereQuery = "";
            if (whereClauses.length > 0) {
                whereQuery = "WHERE " + whereClauses.join(" AND ");
            }

            // Count total number of products
            const countQuery = `SELECT COUNT(*) as totalCount FROM (${baseQuery} ${whereQuery} GROUP BY p.idProduct) as total`;

            connection.query(countQuery, queryParams, (err, countResult) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Erreur lors du comptage des produits");
                } else {
                    const totalCount = countResult[0].totalCount;
                    const totalPages = Math.ceil(totalCount / limit);

                    const query = `
                        ${baseQuery} ${whereQuery}
                        GROUP BY p.idProduct
                        LIMIT ? OFFSET ?
                    `;
                    queryParams.push(parseInt(limit), parseInt(offset));

                    connection.query(query, queryParams, (err, resultats) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send("Erreur lors de la récupération des produits");
                        } else {
                            res.render('catalogue', {
                                produits: resultats,
                                currentPage: parseInt(page),
                                totalPages: totalPages,
                                limit: parseInt(limit)
                            });
                        }
                    });
                }
            });
        }
    });
};



//rechercher un produit  par son nom
produitController.searchProduct = (req, res) => {
    const search = req.query.search;
    req.getConnection((erreur,connection)=>{
        if(erreur){
            console.log(erreur);
            }else{
//fappel de lma fonction pour chercher le produit 
      helperUtils.searchFunction(connection, search, (erreur, resultats) => {
        if (erreur) {
            console.log(erreur);
        }
        else {
            console.log(resultats, search)
            res.render('search', { produits: resultats ,search:search});
        }
    }
    );
}});
};

produitController.getIndex = (req, res) => {
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
                    //appel de la fonction pour afficher les3 derniers produits
                    const limite = 1; //Limiter les résultats à 3
                    helperUtils.getLastestProducts(connection, limite, (erreur, derniersProduits) => {
                        if (erreur) {
                            console.log(erreur);
                        } else {
                            console.log("les derniers produits", derniersProduits);
                            res.render('index', { produits: resultats, lastProducts: derniersProduits });
                        };
                    });
                };
            });
        }
    });
};

//afficher les détails d'un produit
produitController.getProduit = (req, res) => {
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
                    res.render('produit', { produit: resultats[0], imagesPaths: formattedImagePaths });
                }
            });
        }
    });
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

                                    const imgPath = path.join('Images_BD', color, `Img${imgNumber}`, file.filename);
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
// Function to create directory if it doesn't exist
function createDirectoryIfNotExist(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
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
module.exports = produitController;