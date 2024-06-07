//controlleur api
const produitController = {};
const helperUtils = require('../../helperFolder/helpers');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const port = 3000; //port 

//update la qté des produits payés
produitController.deductQuantity = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
console.log("fonction open");

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Quantité invalide' });
    }

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
            return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
        } else {
            connection.query(
                'SELECT quantity FROM produits WHERE idProduct = ?',
                [id],
                (erreur, resultat) => {
                    if (erreur) {
                        console.log(erreur);
                        return res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
                    } else if (resultat.length === 0) {
                        return res.status(404).json({ error: 'Produit non trouvé' });
                    } else if (resultat[0].quantity < quantity) {
                        return res.status(400).json({ error: 'Quantité insuffisante en stock' });
                    } else {
                        connection.query(
                            'UPDATE produits SET quantity = quantity - ? WHERE idProduct = ?',
                            [quantity, id],
                            (erreur, resultat) => {
                                if (erreur) {
                                    console.log(erreur);
                                    return res.status(500).json({ error: 'Erreur lors de la mise à jour de la quantité' });
                                } else {
                                    console.log(" mise a jour  de la quantité ok");
                                    res.json({ success: true, message: 'Quantité mise à jour avec succès' });
                                }
                            }
                        );
                    }
                }
            );
        }
    });
};

produitController.admin= (req, res)=>{
    res.render('admin');
}
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

//ajout d'un user et de sa commande
produitController.addUserCommand=(req, res)=>{
    const {name, firstname, email, address, confirmationCode, cart} = req.body;
    if (!name || !firstname || !email || !address || !confirmationCode || !cart) {
        return res.status(400).json({ error: 'Champs requis manquants' });
    }

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
            return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
        } else {
            connection.beginTransaction(async (erreur) => {
                if (erreur) {
                    console.log(erreur);
                    return res.status(500).json({ error: 'Erreur lors de la transaction' });
                }

                try {
                    // Enregistrer l'utilisateur dans la base de données
                    //verifier si le user est déjà present
                    const userExist =  helperUtils.getUserByEmail(connection, email);
                  
                    if (userExist.length > 0) {
                        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
                    }else{
                    // Enregistrer l'utilisateur dans la base de données
                    const user = await helperUtils.insertUser(connection, name, firstname, email, address, confirmationCode);
                    console.log("user", user);

                    // Lier l'utilisateur et les produits achetés
                    for (let product of cart) {
                        await helperUtils.insertBuy(connection, product.id, user.insertId, product.quantity);
                    }
                }
                    connection.commit((erreur) => {
                        if (erreur) {
                            connection.rollback(() => {
                                console.log(erreur);
                                return res.status(500).json({ error: 'Erreur lors de la confirmation de la transaction' });
                            });
                        } else {
                            console.log('Commande ajoutée avec succès');
                            res.json({ success: true, message: 'Commande ajoutée avec succès' });
                        }
                    });
                } catch (error) {
                    connection.rollback(() => {
                        console.log(error);
                        return res.status(500).json({ error: 'Erreur lors de l\'ajout de la commande' });
                    });
                }
            });
        }
    });
}



module.exports = produitController;
