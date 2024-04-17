import storage from "./libs/storage.js"

const userToken = storage.getItem("token")
const loginEmail = document.querySelector("#login-email")
const loginPassword = document.querySelector("#login-password")
const loginSubmit = document.querySelector("#login-submit")

if (userToken) {
    window.location.href = "index.html"
}
else {


    loginSubmit.onclick = (event) => {

        fetch("http://localhost:5678/api/users/login", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email: loginEmail.value,
                password: loginPassword.value
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    storage.setItem("token", data.token)
                    window.location.href = "index.html"
                } else {
                    console.log("Mauvais ID")
                    alert("Mauvais ID")
                    event.preventDefault()
                }
            })
            .catch(error => console.log("ERROR :", error))
    }
}