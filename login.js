import storage from "./libs/storage.js"

const userToken = storage.getItem("token")
const loginEmail = document.querySelector("#login-email")
const loginPassword = document.querySelector("#login-password")
const loginForm = document.querySelector(".login-form")

if (userToken) {
    window.location.href = "index.html"
}
else {

    console.log("allo");

    loginForm.onsubmit = (event) => {
        event.preventDefault()
        event.stopPropagation()

        console.log("click");

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

                console.log("data", data);

                if (data.token) {
                    storage.setItem("token", data.token)
                    window.location.href = "index.html"
                } else {
                    console.log("Mauvais ID")
                    alert("Mauvais ID")
                }
            })
            .catch(error => console.log("ERROR :", error))
    }
}