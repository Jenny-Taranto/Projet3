// Récupération des données
async function recupererDonnees() {
  const reponseTravaux = await fetch("http://localhost:5678/api/works");
  const travaux = await reponseTravaux.json();

  const reponseCategories = await fetch("http://localhost:5678/api/categories");
  const categories = await reponseCategories.json();

  afficherTravaux(travaux);
  genererCategories(categories, travaux); // On passe aussi les travaux pour filtrer
}

// Génération des travaux
function afficherTravaux(travaux) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ''; // Réinitialise la galerie avant d'ajouter les nouveaux travaux

  for (let i = 0; i < travaux.length; i++) {
    const elementTravail = document.createElement('figure');
    const imgTravail = document.createElement('img');
    imgTravail.src = travaux[i].imageUrl;

    const nomTravail = document.createElement('p');
    nomTravail.innerText = travaux[i].title;

    gallery.appendChild(elementTravail);
    elementTravail.appendChild(imgTravail);
    elementTravail.appendChild(nomTravail);
  }
}

// Génération des catégories
function genererCategories(categories, travaux) {
  const barreDesCategories = document.getElementById('filterbar');
  barreDesCategories.innerHTML = ''; // Réinitialise la barre des catégories

  // Bouton "Tous"
  const btnTous = document.createElement('button');
  btnTous.innerText = 'Tous';
  btnTous.dataset.id = 'Tous';
  barreDesCategories.appendChild(btnTous);

  // Ajout d'un event listener pour afficher tous les travaux
  btnTous.addEventListener('click', () => afficherTravaux(travaux));

  // Boutons pour chaque catégorie
  for (let i = 0; i < categories.length; i++) {
    const btn = document.createElement('button');
    btn.innerText = categories[i].name;
    btn.dataset.id = categories[i].id; // Utilise l'ID unique de la catégorie

    // Ajout d'un event listener pour filtrer les travaux
    btn.addEventListener('click', () => {
      const travauxFiltres = travaux.filter(
        (travail) => travail.categoryId === categories[i].id
      );
      afficherTravaux(travauxFiltres);
    });

    barreDesCategories.appendChild(btn);
  }
}

recupererDonnees();

console.log("token", sessionStorage.getItem ("token"))

logIn();
logOut();
openModal();

//Se connecter et entrer en mode édition
function logIn() {
document.addEventListener('DOMContentLoaded', function() {
  //Si token présent alors afficher admin-mode
  if(sessionStorage.getItem('token') != null) {
    const adminModeHeader = document.querySelector('.mode-edition')
    adminModeHeader.removeAttribute('style')
    //Même chose à faire pour le modifier du titre Mes projets
    const adminModeTitle = document.getElementById('span-icone-h2')
    adminModeTitle.removeAttribute('style')
    //Remplacer le lien login par logout
    const login = document.getElementById('login')
    login.setAttribute('style', 'display:none')
    const logout = document.getElementById('logout')
    logout.removeAttribute('style')
  }})
}

//Se déconnecter
function logOut() {
document.addEventListener("DOMContentLoaded", function () {
  //On supprime le token du sessionStorage
  document.getElementById('logout').addEventListener('click', function(event) {
    sessionStorage.removeItem('token');

})})
}

//Ouvrir la modale
function openModal() {
  document.addEventListener('DOMContentLoaded', function () {
    // Sélection du lien "mode-edition" et du lien 'modifier'
    const modeEditionLink = document.querySelector('.mode-edition');
    const modeModifier = document.getElementById('modifier');

    // Sélection de la modale
    const modal = document.getElementById('modal');

    // Gestion des évènements
    modeEditionLink.addEventListener('click', function (event) {
      event.preventDefault(); // Empêche le comportement par défaut du lien
      modal.removeAttribute('style')
      modal.setAttribute('aria-hidden', 'false'); // Met à jour l'accessibilité
      modal.setAttribute('aria-modal', 'true')
    });

    modeModifier.addEventListener('click', function (event) {
      event.preventDefault();
      modal.removeAttribute('style')
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('aria-modal', 'true')
    });

    modal.addEventListener('click', function (event) {
      console.log(event.target)
      if (event.target === modal) {
        event.stopPropagation()
        modal.setAttribute('style', 'display:none')
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal')
        console.log("toto2")
      }
      });

  });
}
  function closeModal() {
    //Fermer la modale
    console.log("toto")
    const close = document.getElementById('modal')
      modal.setAttribute('style', 'display:none')
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal')
      console.log("toto2")
    }
  