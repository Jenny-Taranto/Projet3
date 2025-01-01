// Requête serveur pour récupérer les catégories //

async function fetchcategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const categories = await response.json(); // Les données récupérées
    genererCategories(categories); // Appel de la fonction pour afficher les données
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
}

// Requête serveur pour récupérer les "travaux" //

async function fetchworks() {
    try {
      const response = await fetch("http://localhost:5678/api/works");
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
  
      const works = await response.json(); // Les données récupérées
      genererTravaux(works); // Appel de la fonction pour afficher les données
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  }

// Génération des catégories //

function genererCategories(categories) {
  const barreDesFiltres = document.getElementById("filterbar");

    // Création du bouton "Tous" //
    const btnFiltreTous = document.createElement("button");
    btnFiltreTous.textContent = "Tous";
    barreDesFiltres.appendChild(btnFiltreTous);

    // Génération des boutons pour chaque catégorie //
    for (let i = 0; i < categories.length; i++) {

    const categorie = categories[i];

    // Création des autres boutons //

    const btnFiltre = document.createElement("button");
    btnFiltre.textContent = categorie.name;

    barreDesFiltres.appendChild(btnFiltre);
    }
  };


fetchcategories();

// Génération de la liste des travaux //

function genererTravaux(works){
    for (let i = 0; i < works.length; i++) {

        const travail = works[i];

        // Récupération de l'élément "parent" //
        const sectionTravaux = document.getElementById("gallery");

        // Création d'une balise dédiée à un travail //
        const travailElement = document.createElement("figure");

        // Création des balises de contenu pour chaque travail //
        const imageTravail = document.createElement("img");
        imageTravail.src = travail.imageUrl;
        imageTravail.alt = travail.title;

        const nomTravail = document.createElement("figcaption");
        nomTravail.textContent = travail.title;
        
        // Ajout de l'image et du titre dans la balise figure //
        travailElement.appendChild(imageTravail);
        travailElement.appendChild(nomTravail);

        // Ajout de la figure dans la section "parent" //
        sectionTravaux.appendChild(travailElement);
    }
}

fetchworks();


