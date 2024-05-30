const produitController = {};
const helperUtils = require('../helperFolder/helpers');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { error } = require('console');
const port = 8000;

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
        const dir = path.join(__dirname, '..', 'Images_BD', color, `Img${imgNumber}`);
        createDirectoryIfNotExist(dir);
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Create multer instance
const upload = multer({ storage: storage });

// Function to add a product to the database
produitController.postAjouter = (req, res) => {
    console.log("Access to the function");
    upload.any()(req, res, function (err) { // Make sure to call upload.any()
        if (err instanceof multer.MulterError) {
            console.log("Multer error:", err.message);
            return res.status(500).json({ error: err.message });
        } else if (err) {
            console.log("Other error:", err.message);
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
        console.log("Request body: ", req.body);
        // Validate form data
        if (!name || !quantity || !price || !reduction || !description || !gender || !type || !devise) {
            return res.status(400).send("All form fields are required.");
        }

        req.getConnection((erreur, connection) => {
            if (erreur) {
                console.log(erreur);
                return res.status(500).send("Database connection error.");
            }

            connection.beginTransaction((erreur) => {
                if (erreur) {
                    console.log(erreur);
                    return res.status(500).send("An error occurred during the transaction.");
                }

                const insertCaracterQuery = 'INSERT INTO caracteristiques (gender, type, colors, size) VALUES (?, ?, ?, ?)';
                const insertProduitQuery = 'INSERT INTO produits (name, quantity, price, devise, reduction, description, idCaracter) VALUES (?, ?, ?, ?, ?, ?, ?)';

                const colorsArray = colors ? colors.join(',') : '';
                const sizeArray = size ? size.join(',') : '';

                connection.query(insertCaracterQuery, [gender, type, colorsArray, sizeArray], (erreur, resultatsCaracter) => {
                    if (erreur) {
                        connection.rollback(() => {
                            console.log(erreur);
                            return res.status(500).send("An error occurred while inserting characteristics.");
                        });
                    } else {
                        const idCaracter = resultatsCaracter.insertId;

                        connection.query(insertProduitQuery, [name, quantity, price, devise, reduction, description, idCaracter], (erreur, resultatsProduit) => {
                            if (erreur) {
                                connection.rollback(() => {
                                    console.log(erreur);
                                    return res.status(500).send("An error occurred while inserting the product.");
                                });
                            } else {
                                const idProduct = resultatsProduit.insertId;

                                // Store images in the images table
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
                                                return res.status(500).send("An error occurred during transaction commit.");
                                            });
                                        } else {
                                            console.log('Product added successfully');
                                            res.redirect('/admin');
                                        }
                                    });
                                }).catch(erreur => {
                                    connection.rollback(() => {
                                        console.log(erreur);
                                        return res.status(500).send("An error occurred while inserting images.");
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
//
//
//
//
//
//
//page d'acceuil

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
                    const limite = 5; //Limiter les résultats à 3
                    helperUtils.getLastestProducts(connection, limite, (erreur, derniersProduits) => {
                        if (erreur) {
                            console.log(erreur);
                        } else {
                            console.log("les derniers produits", derniersProduits);
                            res.render('acceuil', { produits: resultats, lastProducts: derniersProduits });
                        };
                    });
                };
            });
        }
    });
};
produitController.home = (req, res) => {
    res.render('index');
};
//page admin et hgestion de produit
produitController.admin = (req, res) => {
    res.render('admin');
};
//page paier d'achat
produitController.cartPage = (req, res) => {
    res.render('panier')
};
//afficher tous les produits et pouvoir filtrer || pagination comprise
produitController.catalogue = (req, res) => {
    const { gender, type, colors, page = 1, limit =10, api = false } = req.query;

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
            const errorResponse = { error: "Erreur de connexion à la base de données" };
            return api ? res.status(500).json(errorResponse) : res.status(500).render('error', errorResponse);
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
                    const errorResponse = { error: "Erreur lors du comptage des produits" };
                    return api ? res.status(500).json(errorResponse) : res.status(500).render('error', errorResponse);
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
                            const errorResponse = { error: "Erreur lors de la récupération des produits" };
                            return api ? res.status(500).json(errorResponse) : res.status(500).render('error', errorResponse);
                        } else {
                            const responseData = {
                                produits: resultats,
                                currentPage: parseInt(page),
                                totalPages: totalPages,
                                limit: parseInt(limit)
                            };
                            return api ? res.json(responseData) : res.render('catalogue', responseData);
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
    const api = false;

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
            const errorResponse = { error: "Erreur lors de la récupération des produits" };
            return api ? res.status(500).json(errorResponse) : res.status(500).render('error', errorResponse);

        } else {
            //appel de lma fonction pour chercher le produit 
            helperUtils.searchFunction(connection, search, (erreur, resultats) => {
                if (erreur) {
                    console.log(erreur);
                    const errorResponse = { error: "Erreur lors de la récupération des produits" };
                    return api ? res.status(500).json(errorResponse) : res.status(500).render('error', errorResponse);

                }
                else {
                    const responseData = {
                        produits: resultats,
                        search: search
                    }
                    return api ? res.json(responseData) : res.render('search', responseData)

                }

            }
            );
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
                    const imagesPaths = resultats[0].images_paths.split(',');
                    const baseUrl = req.app.get('baseUrl') || `http://localhost:${port}`; // Set default if not configured
                    const formattedImagePaths = imagesPaths.map(path => `${baseUrl}/${path}`);
                    console.log(formattedImagePaths);
                    res.render('produit', { produit: resultats[0], imagesPaths: formattedImagePaths });
                }
            });
        }
    });
};


module.exports = produitController;