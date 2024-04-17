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

                console.log("data", data)

                if (data.token) { // Si la requête a fonctionné
                    storage.setItem("token", data.token) // Enregistre le token dans le localStorage
                    window.location.href = "index.html" // Redirige vers page d'accueil
                } else {
                    alert("Mauvais ID")
                    console.log("Mauvais ID")
                }
            })
            .catch(error => console.log("ERROR :", error))
    }
}