function remplirDonnees(id, titre, desc) {
    document.getElementById('id').value = id;
    document.getElementById('titre').value = titre;
    document.getElementById('description').value = desc;
    document.getElementById('image').value = image;
}
function supprimer(id) {
    let pointFinal = "/ajouter/" + id;
    fetch(pointFinal, {
        method: 'DELETE'
    }
    ).then(
        (response) => response.json()
    ).then(
        (donnee) => window.location.href = donnee.routeRacine
    ).catch(
        (error) => console.log(error)
    )
}

//valider le formulaire et verifier toutes les données
function ValidateForm() {
    // Vérification du champ "Nom du Produit"
    var name = document.getElementById("name").value;
    if (name === "") {
      alert("Veuillez entrer un nom de produit.");
      return false;
    }
  
    // Vérification du champ "Quantité"
    var quantity = document.getElementById("quantity").value;
    if (quantity === "") {
      alert("Veuillez entrer une quantité.");
      return false;
    }
  
    // Vérification du champ "Prix"
    var price = document.getElementById("price").value;
    if (price === "") {
      alert("Veuillez entrer un prix.");
      return false;
    }
  
    // Vérification du champ "Réduction"
    var reduction = document.getElementById("reduction").value;
    if (reduction === "") {
      alert("Veuillez entrer une réduction.");
      return false;
    }
  
    // Vérification des champs d'images
    var img1 = document.getElementById("img_1").value;
    var img2 = document.getElementById("img_2").value;
    var img3 = document.getElementById("img_3").value;
    if (img1 === "" || img2 === "" || img3 === "") {
      alert("Veuillez sélectionner les trois images.");
      return false;
    }
  
    // Vérification du champ "Devise"
    var devise = document.querySelector('input[name="devise"]:checked');
    if (devise === null) {
      alert("Veuillez sélectionner une devise.");
      return false;
    }
  
    // Vérification du champ "Description"
    var description = document.getElementById("description").value;
    if (description === "") {
      alert("Veuillez entrer une description.");
      return false;
    }
  
    // Vérification du champ "Genre"
    var gender = document.getElementById("gender").value;
    if (gender === "") {
      alert("Veuillez sélectionner un genre.");
      return false;
    }
  
    // Vérification du champ "Type"
    var type = document.querySelector('input[name="type"]:checked');
    if (type === null) {
      alert("Veuillez sélectionner un type.");
      return false;
    }
  
    // Vérification du champ "Couleurs"
   
  
    // Toutes les vérifications sont passées, le formulaire est valide
    return true;
  }