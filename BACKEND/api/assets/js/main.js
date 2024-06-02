// Fonction pour ajouter dynamiquement des champs d'images pour chaque couleur sélectionnée
function gestionImages() {
  var container = document.getElementById('images_container');
  container.innerHTML = ''; // Clear the container

  var colors = document.getElementsByName('colors[]');
  for (var i = 0; i < colors.length; i++) {
      var color = colors[i];
      if (color.checked) {
    
          var colorImages = document.createElement('div');
          colorImages.classList.add('color_images');

          colorImages.innerHTML += '<h3>' + color.value + '</h3>';
          for (var j = 1; j <= 3; j++) {
              colorImages.innerHTML += `
                 <label for="${color.value}_img_${j}">Image ${j} (${color.value}) :</label>
                  <input type="file" id="${color.value}_img_${j}" name="${color.value}_img_${j}"> <br>
              `;
              console.log(color.value);
              colorImages.style.display = "flex";
              colorImages.style.flexDirection = "column";
              colorImages.style.justifyContent = "space-around";
          }

          container.appendChild(colorImages);
      }
  }

  // Display the container if it contains images
  container.style.display = container.innerHTML.trim() !== '' ? 'block' : 'none';
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