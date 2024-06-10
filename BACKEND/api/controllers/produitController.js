//controlleur api
const produitController = {};
const helperUtils = require('../../helperFolder/helpers');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt= require('bcrypt');
const saltRounds=10;
const port = 3000; //port 

//connexion du user
produitController.userConnection=(req, res)=>{
    
    console.log("connection function open ");
    const {email , password}= req.body;
    if(!email|| !password){
        return res.status(400).send({ error: "TOUS LES CHAMPS SONT RECQUIS "})
    }
    req.getConnection((erreur, connection)=>{
        if(erreur){
            return res.status(500).json({error:"erreur lors de la connexion a la base de données"});
        }
        helperUtils.getUserByEmail(connection, email, (erreur,resultats)=>{
    
            if (erreur|| resultats.length === 0){
                console.log("Utilisateur non trouvé ");
                return res.status(400).json({error: "Utilisateur non trouvé "});
            }
            const user= resultats[0];
            bcrypt.compare(password, user.password, (err, isMatch)=>{
                if(err|| !isMatch){
                    
                console.log("MOT DE PASSE INCORECTE");
                    return res.status(400).json({error:"Mot de passe incorrect"});
           }
           console.log("connexion réussie  du user   "+ user.idUser);
           res.status(200).json({success:"true", message:"connexion réussie", userId: user.idUser})
            })
        })
    })
}


//inscription d'un user 
produitController.userInscription=(req, res)=>{
    console.log("userInscription function open");
    const {name, firstname, email, password}= req.body;

    if (!name || !firstname || !email || !password ) {
        console.log("Champ incomplet");
        return res.status(400).send({ error: 'Champs requis manquants' });
    }
    req.getConnection((erreur, connection)=>{
        if(erreur){s
            return res.status(500).json({ error: "Erreur de connexion à la base de données" });
        }
        helperUtils.getUserByEmail(connection, email,(erreur, resultats)=>{
            if(resultats.length>0){
                console.log("L'utilisateur existe déjà");
                return res.status(400).json({error:"L'utilisateur existe déjà"});
            }else {
                bcrypt.hash(password, saltRounds,(err,hash)=>{
                    if(err){
                        return res.status(500).json({error:"ERREUR LORS DU HASHAGE DU MOT DE PASSE "});
                }
            helperUtils.insertUser(connection, name , firstname, email,hash,(erreur,userResultats)=>{
                if(erreur){
                    return res.status(500).json({error:"ERREUR LORS DE L AJOUT DE L UTILISATEUR "});
                }
                console.log("Utilisateur ajouté avec succès")
                res.status(200).json({success:true, message:"Utilisateur ajouté avec succès"});
            });
            });
            }
        });
    });
};

//afficher un user a partir de son id
produitController.getUserById = (req, res) => {
    console.log("getUserById function open");
    const id = req.params.id; 
    req.getConnection((erreur, connection) => {
        if (erreur) {
            return res.status(500).json({ error: "Erreur de connexion à la base de données" });
        }

        helperUtils.getUserById(connection, id, (erreur, resultats) => {
            if (erreur) {
                return res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
            }

            if (resultats.length === 0) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }
console.log("utilisateur est:  "+resultats[0])
            res.json({ success: true, user: resultats[0] }); // Ajoutez success: true
        });
    });
};


//ajout de la commande dun user
produitController.addUserCommand = (req, res) => {
    const { userId, address, cart } = req.body;
    console.log("addUserCommand  lid d de la session    " + userId);
    req.getConnection((erreur, connection) => {
        if (erreur) {
            return res.status(500).json({ error: "Erreur de connexion à la base de données" });
        }

        // Mettre à jour l'adresse de l'utilisateur
        helperUtils.updateAddress(connection, userId, address, (erreur, resultats) => {
            if (erreur) {
                return res.status(500).json({ error: "Erreur lors de la mise à jour de l'adresse" });
            }

            // Ajouter les produits à la commande
            addProductsToOrder(connection, userId, cart, res);
        });
    });
};

// Fonction pour ajouter les produits à la commande
const addProductsToOrder = (connection, userId, cart, res) => {
    const promises = cart.map(product => {
        return new Promise((resolve, reject) => {
            helperUtils.insertBuy(connection, product.id, userId, product.quantity, (erreur, resultats) => {
                if (erreur) {
                    console.log(erreur);
                    reject(erreur);
                } else {
                    resolve(resultats);
                }
            });
        });
    });

    Promise.all(promises)
    .then(() => {
        console.log('Commande ajoutée avec succès  '+userId);
        res.json({ success: true, message: 'Commande ajoutée avec succès', userId:userId });
   })
        .catch((erreur) => {
            console.log(erreur);
            res.status(500).json({ error: 'Erreur lors de l\'ajout de la commande' });
        });
};



    


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
//update la qté des produits payés
produitController.deductQuantity = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
console.log("deductQuantity         fonction open");

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



module.exports = produitController;
