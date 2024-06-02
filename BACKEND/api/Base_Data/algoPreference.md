**1. Collecte des données :** 
   - Produits : {id, genre, type, titre}
   - Préférences utilisateurs : {utilisateur_id, produit_id, note}

**2. Prétraitement des données :**
   - Créer un profil utilisateur pour chaque utilisateur basé sur les produits aimés.

**3. Calcul de similarité :**
   - Similarité produit (cosine similarity) :
     sim(produit1, produit2) = dot(produit1, produit2) / (norm(produit1) * norm(produit2))
   - Similarité utilisateur (cosine similarity) :
     sim(utilisateur1, utilisateur2) = dot(utilisateur1, utilisateur2) / (norm(utilisateur1) * norm(utilisateur2))

**4. Filtrage collaboratif basé sur les utilisateurs :**
   - Trouver les k utilisateurs les plus similaires à l'utilisateur cible.
   - Rassembler les produits aimés par ces utilisateurs similaires.
   - Calculer un score de recommandation pour chaque produit.

**5. Filtrage basé sur le contenu :**
   - Pour chaque produit aimé par l'utilisateur cible, trouver les produits les plus similaires.
   - Calculer un score de similarité basé sur les caractéristiques des produits.

**6. Combinaison des recommandations :**
   - Combiner les scores des deux approches pour chaque produit.
   - Trier les produits par score et retourner les meilleures recommandations.

**7. Exemple de sortie :**
   - Liste des produits recommandés : [produit1, produit2, produit3, ...]