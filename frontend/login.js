document.addEventListener("DOMContentLoaded", function () {
    //Envoi des nouvelles données d'identifiants
    //On écoute l'évènement submit sur le formulaire et on empêche le rechargement de la page
    const logInForm = document.getElementById("logInForm")
    logInForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        //On récupère les valeurs des champs pour l'objet de la requête
        const email = document.getElementById('email').value.trim(); //trim supprime les espaces inutiles
        const password = document.getElementById('password').value.trim();
        // Validation des champs
        if (!email || !password) {
            alert("Veuillez remplir tous les champs !"); // Affiche un message d'alerte
            return;
        }
        const identifiants = { email, password }
        //Requête au serveur
        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(identifiants)
            });
            //Traiter la réponse en gérant les erreurs
            if (response.ok) {
                const result = await response.json();
                sessionStorage.setItem("token", result.token) // Ajoute le token généré dans le sessionStorage
                window.location.href = "/" // Redirige en cas de succès de la connexion
            } else {
                const errorData = await response.json();
                console.error('Erreur lors de la connexion :', errorData.message);
                alert('Erreur dans l’identifiant ou le mot de passe');
            }
        } catch (error) {
            console.error('Erreur réseau ou serveur :', error);
            alert("Une erreur réseau s'est produite. Veuillez réessayer.");
        }
    });
})