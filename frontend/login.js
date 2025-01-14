//Fonction qui gère la connexion
async function login() {

const login = {
    email: event.target.querySelector("[name=email]").value,
    password: event.target.querySelector("[name=password").value,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"
}

const chargeUtile = JSON.stringify(login);

await fetch("/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: chargeUtile
});

}



//Fonction qui vérifie le champ email
function verifierEmail (email) {
const emailRegExp = new RegExp("^[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+$");

email.addEventListener("change", (event) => {
    event.preventDefault()
    if (emailRegExp.test(email)) {
        return true
    } else {
        throw new Error(`L'email n'est pas valide`)
    }
})
}
const email = document.getElementById('email')

verifierEmail(email)

//Fonction qui vérifie le champ mot de passe
function verifierMotDePasse(motDePasse) {
    const motDePasseRegExp = new RegExp("[a-z0-9._-]+");
    
    email.addEventListener("change", (event) => {
        event.preventDefault()
        if (motDePasseRegExp.test(motDePasse)) {
            return true
        } else {
            throw new Error(`Mot de passe incorrect`)
        }
    })
    }

