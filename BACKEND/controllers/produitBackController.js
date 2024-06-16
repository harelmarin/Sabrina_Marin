const axios = require('axios');
const { response } = require('express');

const produitBackController = {};

// Configuration de l'URL de base de l'API
const apiBaseUrl = 'http://localhost:3000/api/produits';

produitBackController.renderPaymentPage = async (req, res) => {
    try {
        // Vérifier si l'utilisateur est connecté
        if (!req.session.userId) {
            return res.redirect('/backend/login');
        }
        const userId = req.session.userId;
        console.log('l id récupré est :  ' + userId);
        console.log(`${apiBaseUrl}/user/${userId}`);
        const response = await axios.get(`${apiBaseUrl}/user/${userId}`);

        if (response.data.success) {
            const { name, firstname, email } = response.data.user;
            console.log(name+ "   " +firstname+ "   "+ email );
            res.render('payment', { name, firstname, email });
        } else {
            return res.status(500).json({ success: false, error: "Impossible de récupérer les informations de l'utilisateur" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: "Erreur lors de la récupération des informations de l'utilisateur" });
    }
};
// Requête pour inscrire un utilisateur
produitBackController.inscription = async (req, res) => {
    try {
        const response = await axios.post(`${apiBaseUrl}/InscriptionUser`, req.body);
        req.session.userId = response.data.userId;
        console.log("inscription réussie  du user "+req.session.userId);
            res.redirect('/backend/payment');
    } catch (error) {
        return res.status(500).json({ success: false, error: "Erreur lors de la requête à l'API" });
 
        // Redirige vers la page d'inscription en cas d'erreur
    }
};

// Requête pour la connexion d'un utilisateur
produitBackController.connection = async (req, res) => {
    try {
        const response = await axios.post(`${apiBaseUrl}/connectionUser`, req.body);
        if (response.data.success) {
            req.session.userId = response.data.userId;
            console.log("connexion réussie  du user "+req.session.userId);
            res.redirect('/backend/payment');
        } else {
            return res.status(400).json({ success: false, error: response.data.error });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: "Erreur lors de la requête à l'API" });
    }
};




// Page d'accueil avec les derniers nouveaux produits
produitBackController.getIndex = async (req, res) => {
    try {
        const response = await axios.get(`${apiBaseUrl}/`);
        const produits = response.data.lastProducts;
        
        res.render('home', { produits });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).render('security', { errorMessage: "Erreur lors de la récupération des produits" });
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
    const { gender, type, page = 1 } = req.query;
    try {
        const response = await axios.get(`${apiBaseUrl}/catalogue`, {
            params: { gender, type, page, limit:8 }
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
        res.status(500).render('security', { errorMessage: "Erreur lors de la récupération du produit" });
    }
};

//afficher les commande du user
produitBackController.displayCommand = async (req, res) => {
    // Vérifier si l'utilisateur est connecté
    if (!req.session.userId) {
        return res.redirect('/backend/login');
    }
    const userId = req.session.userId;
    try {
        const response = await axios.get(`${apiBaseUrl}/user/${userId}/commands`);
        const commands = response.data.orders;
        console.log(commands)
        res.render('commands', { commands });
    } catch (error) {
        console.error(error);
        res.status(500).render('security', { errorMessage: "Erreur lors de la récupération des commandes" });
    }
};
module.exports = produitBackController;
