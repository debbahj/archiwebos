import storage from "./libs/storage.js"

const userToken = storage.getItem("token")
const loginEmail = document.querySelector("#login-email")
const loginPassword = document.querySelector("#login-password")
const loginForm = document.querySelector(".login-form")

// Login - Si deja logué, redirige vers page d'accueil
if (userToken) {
    window.location.href = "index.html"
} else { // Sinon, procedure de loging
    loginForm.onsubmit = (event) => {
        // 'preventDefault()' empêche le comportement de soumission par défaut du formulaire.
        //    Cela signifie que le navigateur ne lui enverra pas les données du formulaire au serveur et ne se rechargera pas.
        // 'stopPropagation()' empêche l'événement de se propager jusqu'au haut de l'arborescence DOM.
        //    Cela signifie que les autres gestionnaires d'événements plus haut dans l'arborescence DOM ne les recevront pas.
        event.preventDefault()
        event.stopPropagation()

        fetch("http://localhost:5678/api/users/login", { // Envoie de la requête
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ // Envoie du corps de la requête
                email: loginEmail.value,
                password: loginPassword.value
            })
        })
            .then(response => response.json()) // Réponse de la requête
            .then(data => {

                if (data.token) { // Si la requête a fonctionné
                    storage.setItem("token", data.token) // Enregistre le token dans le localStorage
                    window.location.href = "index.html" // Redirige vers page d'accueil
                } else {
                    alert("Erreur dans l’identifiant ou le mot de passe")
                    console.log("Erreur dans l’identifiant ou le mot de passe")
                }
            })
            .catch(error => console.log("ERROR :", error))
    }
}