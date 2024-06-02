//controlleur api
const produitController = {};
const helperUtils = require('../../helperFolder/helpers');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const port = 3000; //port 

//page d'accueil avec les derniers nouveaux produits
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
                    //appel de la fonction pour afficher les 5 derniers produits
                    const limite = 5;
                    helperUtils.getLastestProducts(connection, limite, (erreur, derniersProduits) => {
                        if (erreur) {
                            console.log(erreur);
                        } else {
                            // Ajustement  des chemins d'image pour correspondre à l'URL de l'API
                            resultats.forEach(produit => {
                                produit.images_paths = produit.images_paths.split(',').map(path => `http://localhost:${port}/api/${path.replace(/\\/g, '/')}`);
                            });
                            derniersProduits.forEach(produit => {
                                produit.images_paths = produit.images_paths.split(',').map(path => `http://localhost:${port}/api/${path.replace(/\\/g, '/')}`);
                            });
                            res.json({ produits: resultats, lastProducts: derniersProduits });
                        }
                    });
                }
            });
        }
    });
};

// Rechercher un produit par son nom
produitController.searchProduct = (req, res) => {
    const search = req.query.search;

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
            return res.status(500).json({ error: "Erreur de connexion à la base de données" });
        }
        helperUtils.searchFunction(connection, search, (erreur, resultats) => {
            if (erreur) {
                console.log(erreur);
                return res.status(500).json({ error: "Erreur lors de la récupération des produits" });
            }
            res.json({ produits: resultats, search: search });
        });
    });
};

// Afficher tous les produits et pouvoir filtrer || pagination comprise
produitController.catalogue = (req, res) => {
    const { gender, type, page = 1, limit = 10 } = req.query;

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
            return res.status(500).json({ error: "Erreur de connexion à la base de données" });
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

            let whereQuery = "";
            if (whereClauses.length > 0) {
                whereQuery = "WHERE " + whereClauses.join(" AND ");
            }

            // Count total number of products
            const countQuery = `SELECT COUNT(*) as totalCount FROM (${baseQuery} ${whereQuery} GROUP BY p.idProduct) as total`;

            connection.query(countQuery, queryParams, (err, countResult) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Erreur lors du comptage des produits" });
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
                            return res.status(500).json({ error: "Erreur lors de la récupération des produits" });
                        } else {
                            // Ajustement  des chemins d'image pour correspondre à l'URL de l'API
                            resultats.forEach(produit => {
                                produit.images_paths = produit.images_paths.split(',').map(path => `http://localhost:${port}/api/${path.replace(/\\/g, '/')}`);
                            });
                            res.json({
                                produits: resultats,
                                currentPage: parseInt(page),
                                totalPages: totalPages,
                                limit: parseInt(limit)
                            });
                        };
                    });
                }
            });
        }
    });
};

// Afficher les détails d'un produit
produitController.getProduit = (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
            res.status(500).json({ error: "Erreur de connexion à la base de données" });
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
                    res.status(500).json({ error: "Erreur lors de la récupération des données" });
                } else {
                    if (resultats.length === 0) {
                        res.status(404).json({ error: "Produit non trouvé" });
                        return;
                    }
                    const produit = resultats[0];
                    const imagesPaths = produit.images_paths ? produit.images_paths.split(',') : [];
                    const baseUrl = `http://localhost:${port}/api`;
                    const formattedImagePaths = imagesPaths.map(path => `${baseUrl}/${path.replace(/\\/g, '/')}`);
                    res.json({ produit, imagesPaths: formattedImagePaths });
                }
            });
        }
    });
};
// Function to create directory if it doesn't exist
function createDirectoryIfNotExist(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};
// Function pour sauvegarder chaque image dans le bon dossier
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const color = file.fieldname.split('_')[0];
        const imgNumber = file.fieldname.split('_')[2];
        const dir = path.join(__dirname, '..', '..', 'public', 'Images_BD', color, `Img${imgNumber}`);
        createDirectoryIfNotExist(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Creer l'instance multer pour la sauvegarde de fichier
const upload = multer({ storage: storage });

// Ajouter des produits dans la base de données
produitController.postAjouter = (req, res) => {
    upload.any()(req, res, function (err) {
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

        if (!name || !quantity || !price || !reduction || !description || !gender || !type || !devise) {
            return res.status(400).send("All form fields are required.");
        }

        req.getConnection((erreur, connection) => {
            if (erreur) {
                return res.status(500).send("Database connection error.");
            }

            connection.beginTransaction((erreur) => {
                if (erreur) {
                    return res.status(500).send("An error occurred during the transaction.");
                }

                const insertCaracterQuery = 'INSERT INTO caracteristiques (gender, type, colors, size) VALUES (?, ?, ?, ?)';
                const insertProduitQuery = 'INSERT INTO produits (name, quantity, price, devise, reduction, description, idCaracter) VALUES (?, ?, ?, ?, ?, ?, ?)';

                const caracterParams = [gender, type, colors, size];

                connection.query(insertCaracterQuery, caracterParams, (erreur, results) => {
                    if (erreur) {
                        return connection.rollback(() => {
                            return res.status(500).send("An error occurred while inserting the product characteristics.");
                        });
                    }

                    const caracterId = results.insertId;
                    const produitParams = [name, quantity, price, devise, reduction, description, caracterId];

                    connection.query(insertProduitQuery, produitParams, (erreur, results) => {
                        if (erreur) {
                            return connection.rollback(() => {
                                return res.status(500).send("An error occurred while inserting the product.");
                            });
                        }

                        const produitId = results.insertId;
                        const images = req.files;

                        if (!images) {
                            return connection.rollback(() => {
                                return res.status(400).send("No images were uploaded.");
                            });
                        }

                        const insertImageQuery = 'INSERT INTO images (idProduct, color, path) VALUES (?, ?, ?)';

                        const imagePromises = images.map(image => {
                            const color = image.fieldname.split('_')[0];
                            return new Promise((resolve, reject) => {
                                connection.query(insertImageQuery, [produitId, color, image.path], (erreur) => {
                                    if (erreur) {
                                        reject(erreur);
                                    } else {
                                        resolve();
                                    }
                                });
                            });
                        });

                        Promise.all(imagePromises)
                            .then(() => {
                                connection.commit((erreur) => {
                                    if (erreur) {
                                        return connection.rollback(() => {
                                            return res.status(500).send("An error occurred during the transaction commit.");
                                        });
                                    }

                                    res.redirect('/backoffice');
                                });
                            })
                            .catch(erreur => {
                                connection.rollback(() => {
                                    return res.status(500).send("An error occurred while inserting images.");
                                });
                            });
                    });
                });
            });
        });
    });
};

module.exports = produitController;
