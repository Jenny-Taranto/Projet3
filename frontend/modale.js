//Création de la fonction à l'évènement clic et empêchement du rechargement de la page
const openModal = function (e) {
    e.preventDefault()
    //On récupère la balise lien de la modale
    const target = document.querySelector(e.target.getAttribute('href'))
    //On désactive le display none du HTML
    target.style.display = null
    target.removeAttribute('aria-hidden', false)
    target.setAttribute('aria-modal', 'true')
}

// On écoute l'évènement clic sur le lien de la modale
document.querySelectorAll("modal").forEach(a => {
    a.addEventListener('click', openModal)

})