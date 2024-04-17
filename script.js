import storage from "./libs/storage.js"

const userToken = storage.getItem("token")
const logIn = document.querySelector('.login')
const logOut = document.querySelector('.logout')
const editionBox = document.querySelector(".edition__box")


const portfolioTitle = document.querySelector("#portfolio h2")
const gallery = document.querySelector("#portfolio .gallery")
gallery.innerHTML = ""

// Recupere les projets et les cree dans le DOM
fetch("http://localhost:5678/api/works")
.then(response => response.json())
    .then(data => {
        data.map(projet => {
            const element = document.createElement("figure")
            element.innerHTML = `<img src="${projet.imageUrl}" alt="${projet.title}"> <figcaption>${projet.title}</figcaption>`
            gallery.appendChild(element)
        })
    })
    .catch(error => console.log("WORKS ERROR :", error))
    
    fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(data => {
        const containerElement = document.createElement("div")
        containerElement.classList.add("menu-filter")

        data.forEach(categorie => {
            const element = document.createElement("button")
            element.classList.add("filter")
            // element.setAttribute("data-filter", categorie.name)
            element.innerHTML = categorie.name
            containerElement.appendChild(element)
        })
        portfolioTitle.insertAdjacentElement("afterend", containerElement)
    })
    .catch(error => console.log("CATEGORIES ERROR :", error))

if (userToken) {

    // Affiche bouton logout + mode edition
    logIn.style.display = "none"
    logOut.style.display = "block"
    editionBox.style.display = "flex"

    // Vide token dans storage seulement si click sur "Logout"
    logOut.onclick = () => {
        storage.clear()
        window.location.href = "index.html"
    }
}
// Comment git mes dossiers ?
// probleme login ne marche pas la premniere fois
// mode edition pas assez d'espace
// filtres