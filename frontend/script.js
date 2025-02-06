//Se connecter et entrer en mode édition
function verifyAuthenticationStatus() {
  document.addEventListener('DOMContentLoaded', function () {
    // Si token présent alors afficher admin-mode
    if (sessionStorage.getItem('token') != null) {
      displayAdminMode()
    }

    document.getElementById('logout').addEventListener('click', function (event) {
      sessionStorage.removeItem('token');
    })
  })
}

function displayAdminMode() {
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
}


// Récupération des données
/**
 * Appel du backend pour récupérer les projets et les catégories
 * 
 * La fonction afficherTravaux s'occupe de générer les travaux sur la page
 */
async function recupererDonneesWorksEtCategories() {
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

console.log("token", sessionStorage.getItem("token"))


//Ouvrir la modale
function gererModales() {
  const modal = document.getElementById('modal');
  document.addEventListener('DOMContentLoaded', function () {
    // Sélection du lien "mode-edition" et du lien 'modifier'
    const modeModifier = document.getElementById('modifier');

    // Sélection de la modale
    const modalAjouter = document.querySelector('.modal-ajouter-photo')
    const modalEditer = document.querySelector('.edit-modal')

    // Afficher modale
    modeModifier.addEventListener('click', function (event) {
      event.preventDefault();
      modal.removeAttribute('style')
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('aria-modal', 'true')
      modalAjouter.setAttribute('style', 'display:none')
      modalEditer.removeAttribute('style');


      //Afficher les travaux dans la modale
      afficherTravauxModal()
      gererModaleAjout()
    })
  });

  //Fermer la modale avec un clic en dehors
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal(event, modal)
    }
  });

  //Fermer la modale avec un clic sur la croix
  document.getElementById('cross').addEventListener('click', function (event) {
    closeModal(event, modal)
  })
  //Fermer la modale avec un clic sur la croix de la page 2
  document.getElementById('close-modal-2').addEventListener('click', function (event) {
    closeModal(event, modal)
  })

  //Retour
  document.getElementById('arrow-return').addEventListener('click', function (event) {
    event.stopPropagation()
    const modal1 = document.querySelector('.edit-modal')
    const modal2 = document.querySelector('.modal-ajouter-photo')
    modal2.setAttribute('style', 'display:none')
    modal1.removeAttribute('style')
  })

}


function closeModal(event, modal) {
  event.stopPropagation()
  modal.setAttribute('style', 'display:none')
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal')
}



//Affiche les travaux dans la modale
async function afficherTravauxModal() {

  const modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = ''; // Réinitialise la galerie avant d'ajouter les nouveaux travaux

  const reponseTravaux = await fetch("http://localhost:5678/api/works");
  const travauxModal = await reponseTravaux.json();

  //Création et intégration des éléments
  for (let i = 0; i < travauxModal.length; i++) {
    const elementContainer = document.createElement('div');
    const elementModal = document.createElement('img');
    elementModal.src = travauxModal[i].imageUrl;
    const iconLink = document.createElement('a');
    const iconElementModal = document.createElement('i');
    iconElementModal.setAttribute('class', 'fa-solid fa-trash-can');
    iconElementModal.dataset.id = travauxModal[i].id; //Associe l'id du travail à l'icône correspondante

    //Supression
    iconElementModal.addEventListener('click', async function (event) {
      event.preventDefault();

      const travailId = this.dataset.id; //this.dataset.id = icône sur laquelle on clique + son id pour éviter d'écrire une ligne pour chaque icône

      //Requête au serveur pour supprimer un travail
      const response = await fetch(`http://localhost:5678/api/works/${travailId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        // Supprime visuellement l'élément
        elementContainer.remove(); //fonction qui supprime totalement l'objet cible du code HTML et actualise l'affichage sans recharger la page
        const closeModal = document.getElementById('modal');
        closeModal.setAttribute('style', 'display:none');
        closeModal.setAttribute('aria-hidden', 'true');
        recupererDonneesWorksEtCategories();
        console.log(`Travail ${travailId} supprimé.`);
      } else {
        console.error("Erreur lors de la suppression du travail.");
      }
    })

    elementContainer.appendChild(elementModal);
    elementContainer.appendChild(iconLink);
    iconLink.appendChild(iconElementModal);
    modalContent.appendChild(elementContainer);

  }

}



//Afficher modal page 2
function gererModaleAjout() {
  const afficherModal2 = document.querySelector('.btn-modal-add')
  afficherModal2.addEventListener('click', function (event) {
    event.preventDefault();
    const modal1 = document.querySelector('.edit-modal')
    modal1.setAttribute('style', 'display:none')
    const croix = document.getElementById('cross')
    croix.setAttribute('style', 'display:none')
    const modal2 = document.querySelector('.modal-ajouter-photo')
    modal2.removeAttribute('style')
  })

  //Ajout photo
  const btnAjoutPhoto = document.getElementById('input-photo')
  btnAjoutPhoto.addEventListener('change', function (event) {
    event.preventDefault();

    const icone = document.querySelector('.encadrement-ajouter i')
    icone.setAttribute('style', 'display:none')
    const label = document.getElementById('nouvelle-image')
    label.setAttribute('style', 'display:none')
    const paragraphe = document.querySelector('.encadrement-ajouter p')
    paragraphe.setAttribute('style', 'display:none')

    const photo = document.querySelector('.encadrement-ajouter')

    // Vérifie s'il y a déjà une image dans .encadrement-ajouter
    const image = photo.querySelector('img');
    if (image) {
      image.remove(); // Supprime l'image existante avant d'en ajouter une nouvelle
    }

    // Crée et ajoute la nouvelle image
    const nouvellePhoto = document.createElement('img');
    // @ts-ignore
    const file = event.target.files[0];
    const inputImg = document.getElementById('input-photo')
    const imgMaxSize = 4 * 1024 * 1024;

    //Vérification de la taille du fichier
    if(inputImg.files[0].size > imgMaxSize) {

      document.getElementById('input-photo').value = '';
      const icone = document.querySelector('.encadrement-ajouter i')
      icone.removeAttribute('style')
      const label = document.getElementById('nouvelle-image')
      label.removeAttribute('style')
      const paragraphe = document.querySelector('.encadrement-ajouter p')
      paragraphe.removeAttribute('style')
      alert('Le fichier est trop volumineux.')
    }

    else {
      nouvellePhoto.src = URL.createObjectURL(file); // Génère un aperçu de l'image sélectionnée
      photo.appendChild(nouvellePhoto);
    }


  });
}

// Génère la sélection des catégories pour le formulaire d'envoi
async function categoriesModal() {
  const reponseCategories = await fetch("http://localhost:5678/api/categories");
  const categoriesModal = await reponseCategories.json();
  const select = document.querySelector('.form-titre-categorie select')

  for (let i = 0; i < categoriesModal.length; i++) {
    const option = document.createElement('option')
    option.innerText = categoriesModal[i].name;
    option.value = categoriesModal[i].id;
    select.appendChild(option)
  }
}


// Formulaire d'envoi
async function formValider() {
  document.addEventListener('DOMContentLoaded', function () {
    //On récupère les infos à envoyer
    const form = document.getElementById('form-ajouter-photo')
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const titleInput = document.getElementById('form-titre');
      const image = document.getElementById('input-photo');
      const title = titleInput.value.trim();
      const category = document.getElementById('choix-categorie').value;

      // Créer un objet FormData pour envoyer l'image et les autres données
      const formData = new FormData();
      const imageFile = image.files[0];  // Récupère le fichier sélectionné
      formData.append('image', imageFile);    // Ajoute le fichier à FormData
      formData.append('title', title);
      formData.append('category', category);

      // Requête POST
        const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: formData
        })

        if (response.ok) {
         console.log('Travail ajouté avec succès.');
         const closeModal = document.getElementById('modal');
         closeModal.setAttribute('style', 'display:none');
         closeModal.setAttribute('aria-hidden', 'true');
          recupererDonneesWorksEtCategories();
          document.getElementById('modal-content').innerHTML = '';
        } else {
          alert('Erreur, travail non ajouté.');
        }
      });
    })
  }





verifyAuthenticationStatus();
recupererDonneesWorksEtCategories();
gererModales();
categoriesModal();
formValider();