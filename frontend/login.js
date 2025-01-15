//Envoi des nouvelles données d'identifiants
    //On écoute l'évènement submit sur le formulaire et on empêche le rechargement de la page
    const logInForm = document.getElementById("logInForm")
    logInForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        //On récupère les valeurs des champs pour l'objet de la requête
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validation des champs
        if (!email || !password) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        const identifiants = { email, password }
    
        //Requête au serveur en gérant les erreurs
        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(identifiants)
        });
    
        //Traiter la réponse
        if (response.ok) {
            const result = await response.json();
            console.log('Connexion réussie :', result);
            window.location.href = "http://127.0.0.1:5500/FrontEnd/index.html"
        } else {
            const errorData = await response.json();
            console.error('Erreur lors de la connexion :', errorData.message);
            alert(`Erreur : ${errorData.message || "Connexion échouée"}`);
        }
    } catch (error) {
        console.error('Erreur réseau ou serveur :', error);
        alert("Une erreur réseau s'est produite. Veuillez réessayer.");
        }
    });