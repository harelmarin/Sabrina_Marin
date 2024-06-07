// helpers.js

const helperUtils = {};
const port = 3000;

// Fonction pour obtenir les derniers produits ajoutés
helperUtils.getLastestProducts = (connection, limit, callback) => {
  connection.query(
      `SELECT p.*, c.gender, c.type, c.colors, c.size,
     GROUP_CONCAT(i.path) AS images_paths
    FROM produits p
    JOIN caracteristiques c ON p.idCaracter = c.idCaracter
    LEFT JOIN images i ON p.idProduct = i.idProduct
    GROUP BY p.idProduct
    ORDER BY p.idProduct DESC
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

//afficher  un produit par cractéristiques  (gender , type , colors) 
helperUtils.displayByCategory = (connection, query, callback) => {
  let sql = `SELECT p.*, c.gender, c.type, c.colors, c.size,
             GROUP_CONCAT(i.path) AS images_paths
             FROM produits p
             JOIN caracteristiques c ON p.idCaracter = c.idCaracter
             LEFT JOIN images i ON p.idProduct = i.idProduct
             WHERE 1 = 1`;

  let conditions = [];
  let values = [];

  if (query.gender) {
      conditions.push("c.gender = ?");
      values.push(query.gender);
  }
  if (query.type) {
      conditions.push("c.type = ?");
      values.push(query.type);
  }
  if (query.colors) {
      conditions.push("c.colors = ?");
      values.push(query.colors);
  }

  if (conditions.length > 0) {
      sql += " AND " + conditions.join(" AND ");
  }

  sql += " GROUP BY p.idProduct";

  connection.query(sql, values, (erreur, resultats) => {
      if (erreur) {
          console.log(erreur);
          callback(erreur, null);
      } else {
          callback(null, resultats);
      }
  });
};

//rechercher un produit
helperUtils.searchFunction = (connection, query, callback) => {
  let sql = `
    SELECT p.*, c.gender, c.type, c.colors, c.size, i.path AS image_path
    FROM produits p
    JOIN caracteristiques c ON p.idCaracter = c.idCaracter
    LEFT JOIN images i ON p.idProduct = i.idProduct
    WHERE 1 = 1`;
  let values = [];

  if (query.name) {
    let searchTerm = "%" + query.name.toLowerCase() + "%";
    sql += " AND LOWER(p.name) LIKE ?";
    values.push(searchTerm);
  }

  connection.query(sql, values, (erreur, resultats) => {
    if (erreur) {
      console.log(erreur);
      callback(erreur, null);
    } else {
      // Regrouper les résultats par produit en utilisant un objet Map
      const produitsMap = new Map();
      resultats.forEach((row) => {
        const produit = produitsMap.get(row.idProduct);

        if (!produit) {
          // Nouveau produit, ajouter toutes les informations
          produitsMap.set(row.idProduct, {
            idProduct: row.idProduct,
            name: row.name,
            quantity: row.quantity,
            price: row.price,
            devise: row.devise,
            reduction: row.reduction,
            description: row.description,
            idCaracter: row.idCaracter,
            gender: row.gender,
            type: row.type,
            colors: row.colors,
            size: row.size,
            images: [],
          });
        }
     // Ajouter l'image au produit correspondant
                if (row.image_path) {
                    const imagePath = `http://localhost:${port}/api/${row.image_path.replace(/\\/g, '/')}`;
                    produitsMap.get(row.idProduct).images.push(imagePath);
                }
            });

      // Convertir l'objet Map en tableau de produits
      const produits = Array.from(produitsMap.values());

      callback(null, produits);
    }
  });
};
//enregistre un user dans la base de donées
helperUtils.saveUser = (connection, user, callback) => {
  connection.query(
      'INSERT INTO users (name, firstname, email, address, code) VALUES (?, ?, ?, ?, ?)',
      [user.name, user.firstname, user.email, user.address, user.code],
      (erreur, resultats) => {
          if (erreur) {
              console.log(erreur);
              callback(erreur, null);
          } else {
              callback(null, resultats);
          }
      }
  );
}
//getUserByEmail : verfi si un user est déjà enregistré
helperUtils.getUserByEmail = (connection, email, callback) => {
  connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (erreur, resultats) => {
          if (erreur) {
              console.log(erreur);
              callback(erreur, null);
          } else {
              callback(null, resultats);
          }
      }
  );  
}
//lier un user et les produit ataché insertBuy(connection, product.id, user.insertId, product.quantity)
helperUtils.insertBuy = (connection, idProduct, idUser, quantity, callback) => {
  connection.query(
      'INSERT INTO buy (idProduct, idUser, quantity) VALUES (?, ?, ?)',
      [idProduct, idUser, quantity],
      (erreur, resultats) => {
          if (erreur) {
              console.log(erreur);
              callback(erreur, null);
          } else {
              callback(null, resultats);
          }
      }
  );
}

 module.exports = helperUtils;