//Cette fonction gère l'affichage de la page en fonction de la connexion (ou non) de l'utilisateur

function verifierIdentificationStatut() {
  document.addEventListener('DOMContentLoaded', function () {

    if (sessionStorage.getItem('token') != null) {
      entrerModeEdition()
    }

    document.getElementById('logout').addEventListener('click', function (event) {
      sessionStorage.removeItem('token');
    })
  })
}


//Cette fonction affiche le mode édition en cas de connexion de l'utilisateur

function entrerModeEdition() {
  const adminModeHeader = document.querySelector('.mode-edition')
  adminModeHeader.removeAttribute('style')

  const adminModeTitle = document.getElementById('span-icone-h2')
  adminModeTitle.removeAttribute('style')

  const login = document.getElementById('login')
  login.setAttribute('style', 'display:none')
  const logout = document.getElementById('logout')
  logout.removeAttribute('style')
}





// Cette fonction récupère les données des travaux et des catégories avec une requête serveur

async function recupererTravauxEtCategories() {
  const reponseTravaux = await fetch("http://localhost:5678/api/works");
  const travaux = await reponseTravaux.json();

  const reponseCategories = await fetch("http://localhost:5678/api/categories");
  const categories = await reponseCategories.json();

  genererTravaux(travaux);
  gererBarreDesCategories(categories, travaux); // On passe aussi les travaux pour filtrer
}



//Cette fonction génère l'affichage des travaux du portfolio

function genererTravaux(travaux) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

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


//Cette fonction génère la barre des catégories et gère son filtrage

function gererBarreDesCategories(categories, travaux) {
  const barreDesCategories = document.getElementById('filterbar');
  barreDesCategories.innerHTML = '';

  const btnTous = document.createElement('button');
  btnTous.innerText = 'Tous';
  btnTous.dataset.id = 'Tous';
  barreDesCategories.appendChild(btnTous);

  btnTous.addEventListener('click', () => genererTravaux(travaux));



  for (let i = 0; i < categories.length; i++) {
    const btn = document.createElement('button');
    btn.innerText = categories[i].name;
    btn.dataset.id = categories[i].id;


    btn.addEventListener('click', () => {
      const travauxFiltres = travaux.filter(
        (travail) => travail.categoryId === categories[i].id
      );
      genererTravaux(travauxFiltres);
    });

    barreDesCategories.appendChild(btn);
  }
}



//Cette fonction affiche la modale, appelle sa fermeture et gère le retour arrière

function gererModale() {
  const modal = document.getElementById('modal');
  document.addEventListener('DOMContentLoaded', function () {

    const modeModifier = document.getElementById('modifier');
    const modalAjouter = document.querySelector('.modal-ajouter-photo')
    const modalEditer = document.querySelector('.edit-modal')

    modeModifier.addEventListener('click', function (event) {
      event.preventDefault();
      modal.removeAttribute('style')
      modal.setAttribute('aria-hidden', 'false');
      modal.setAttribute('aria-modal', 'true')
      modalAjouter.setAttribute('style', 'display:none')
      modalEditer.removeAttribute('style');

      recupererTravauxModale()
      gererAjoutTravauxModal()
    })
  });

  //Fermer la modale avec un clic en dehors
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      fermerModal(event, modal)
    }
  });

  document.getElementById('cross').addEventListener('click', function (event) {
    fermerModal(event, modal)
  })

  document.getElementById('close-modal-2').addEventListener('click', function (event) {
    fermerModal(event, modal)
  })

  document.getElementById('arrow-return').addEventListener('click', function (event) {
    event.stopPropagation()
    const modal1 = document.querySelector('.edit-modal')
    const modal2 = document.querySelector('.modal-ajouter-photo')
    modal2.setAttribute('style', 'display:none')
    modal1.removeAttribute('style')
  })

}




//Cette fonction récupère les données des travaux et les affiche dans la modale, et gère la suppression d'un travail

async function recupererTravauxModale() {

  const modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = '';

  const reponseTravaux = await fetch("http://localhost:5678/api/works");
  const travauxModal = await reponseTravaux.json();

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

      const response = await fetch(`http://localhost:5678/api/works/${travailId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        elementContainer.remove();
        const closeModal = document.getElementById('modal');
        closeModal.setAttribute('style', 'display:none');
        closeModal.setAttribute('aria-hidden', 'true');
        recupererTravauxEtCategories();
        console.log(`Travail ${travailId} supprimé.`);
      } else {
        alert("Erreur lors de la suppression du travail.");
      }
    })

    elementContainer.appendChild(elementModal);
    elementContainer.appendChild(iconLink);
    iconLink.appendChild(iconElementModal);
    modalContent.appendChild(elementContainer);

  }

}



//Cette fonction affiche le formulaire d'ajout d'un travail et gère la sélection d'une image

function gererAjoutTravauxModal() {
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

    const icon = document.querySelector('.encadrement-ajouter i')
    icon.setAttribute('style', 'display:none')
    const label = document.getElementById('nouvelle-image')
    label.setAttribute('style', 'display:none')
    const paragraph = document.querySelector('.encadrement-ajouter p')
    paragraph.setAttribute('style', 'display:none')

    const photo = document.querySelector('.encadrement-ajouter')

    // Vérifie s'il y a déjà une image dans .encadrement-ajouter
    const image = photo.querySelector('img');
    if (image) {
      image.remove(); // Supprime l'image existante avant d'en ajouter une nouvelle
    }

    const nouvellePhoto = document.createElement('img');
    const file = event.target.files[0];
    const inputImg = document.getElementById('input-photo')
    const imgMaxSize = 4 * 1024 * 1024;

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




//Cette fonction génère la liste des catégories lors de la sélection de celles-ci pour l'ajout d'un travail

async function genererSelectionCategoriesModale() {
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



//Cette fonction gère l'envoi des données du formulaire

async function gererFormulaireAjoutTravaux() {
  document.addEventListener('DOMContentLoaded', function () {
    //On récupère les infos à envoyer
    const form = document.getElementById('form-ajouter-photo')
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const titleInput = document.getElementById('form-titre');
      const image = document.getElementById('input-photo');
      const title = titleInput.value.trim();
      const category = document.getElementById('choix-categorie').value;

      const formData = new FormData();
      const imageFile = image.files[0];
      formData.append('image', imageFile);
      formData.append('title', title);
      formData.append('category', category);

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
        recupererTravauxEtCategories();
        document.getElementById('modal-content').innerHTML = '';
      } else {
        alert('Erreur, travail non ajouté.');
      }
      });
    })
}




//Cette fonction ferme la modale

function fermerModal(event, modal) {
  event.stopPropagation()
  modal.setAttribute('style', 'display:none')
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal')
}




verifierIdentificationStatut();
recupererTravauxEtCategories();
gererModale();
genererSelectionCategoriesModale();
gererFormulaireAjoutTravaux();