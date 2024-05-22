const axios = require('axios');
const API_KEY = 'yot66w2T8JzN47jkGmjhQ8ngrfTgOIQDFFS1TKPOdykf3l5W'; // Remplacez cela par votre clé API Neutrino
const ENDPOINT = 'https://neutrinoapi.net/geocode-address';

async function geocodeAddress() {
  try {
    const response = await axios.post(ENDPOINT, null, {
      params: {
        address: '23 rue espariat',
        'house-number': '',
        street: '',
        city: '',
        county: '',
        state: '',
        'postal-code': '',
        'country-code': '',
        'language-code': 'en',
        'fuzzy-search': false
      },
      headers: {
        'User-ID': 'kaporal77@sabrina', // Remplacez cela par votre ID utilisateur si nécessaire
        'API-Key': API_KEY
      }
    });

    const data = response.data;
    if (data.found > 0) {
      console.log('Adresse géocodée trouvée:');
      console.log(data.locations[0]); // Afficher les détails de l'adresse
    } else {
      console.log('Aucune adresse géocodée trouvée.');
    }
  } catch (error) {
    console.error('Erreur lors de la requête API:', error.message);
  }
}

geocodeAddress();