// helpers.js

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
  
  module.exports = {
    getLastestProducts
  };