const axios = require('axios');
const { response } = require('express');

const produitBackController = {};

// Configuration de l'URL de base de l'API
const apiBaseUrl = 'http://localhost:3000/api/produits';

// Page d'accueil avec les derniers nouveaux produits
produitBackController.getIndex = async (req, res) => {
    try {
        const response = await axios.get(`${apiBaseUrl}/`);
        const produits = response.data.lastProducts;
        res.render('acceuil', { produits });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).render('error', { errorMessage: "Erreur lors de la récupération des produits" });
    }
};
// Rechercher un produit par son nom
produitBackController.searchProduct = async (req, res) => {
    const search = req.query.search;
    try {
        const response = await axios.get(`${apiBaseUrl}/search`, { params: { search } });
        const produits = response.data.produits;
        res.render('search', { produits, search });
    } catch (error) {
        console.log(error);
        res.status(500).render('security', { errorMessage: "Erreur lors de la recherche de produits" });
    }
};

// Afficher tous les produits avec filtre et pagination
produitBackController.catalogue = async (req, res) => {
    const { gender, type, colors, page = 1 } = req.query;
    try {
        const response = await axios.get(`${apiBaseUrl}/catalogue`, {
            params: { gender, type, colors, page, limit:2 }
        });

        // Accès direct aux données de la réponse
        const produits = response.data.produits;
        const currentPage = response.data.currentPage;
        const totalPages = response.data.totalPages;
        const limit = response.data.limit;

        res.render('catalogue', { produits, currentPage, totalPages, limit });
    } catch (error) {
        console.error(error);
        res.status(500).render('security', { errorMessage: "Erreur lors de la récupération du catalogue" });
    }
};

// Afficher les détails d'un produit
produitBackController.getProduit = async (req, res) => {
    const id = req.params.id;
    try {
        const response = await axios.get(`${apiBaseUrl}/${id}`);
        const produit = response.data.produit;
        const imagesPaths = response.data.imagesPaths;
        res.render('produit', { produit, imagesPaths });
    } catch (error) {
        console.log(error);
        res.status(500).render('error', { errorMessage: "Erreur lors de la récupération du produit" });
    }
};


// Ajouter un produit (pour admin)
produitBackController.postAjouter = async (req, res) => {
    try {
        await axios.post(`${apiBaseUrl}/ajouter`, req.body);
        res.redirect('/backend/admin');
    } catch (error) {
        console.log(error);
        res.status(500).render('error', { errorMessage: "Erreur lors de l'ajout du produit" });
    }
};

module.exports = produitBackController;
