import storage from "./libs/storage.js"
import { removeModals } from "./modal.js"
import {loadModals} from "./modalEdition.js"

const userToken = storage.getItem("token")
const logIn = document.querySelector('.login')
const logOut = document.querySelector('.logout')
const editionBox = document.querySelector(".edition__box")
const editionBtn = document.querySelector(".modify")
const gallery = document.querySelector("#portfolio .gallery")

const reloadGallery = async () => {
    removeModals()
    gallery.innerHTML = ""

    // #region - GALLERY
        // Récuperation des projets et les affiches dans le DOM
    return (fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            data.map(projet => { // Boucle sur les projets
                const element = document.createElement("figure") // Crée l'element figure
                element.setAttribute("data-filter", projet.categoryId) // Attribue le data-filter avec l'id de la categorie
                element.innerHTML = `
                    <img src="${projet.imageUrl}"
                    alt="${projet.title}">
                    <figcaption>${projet.title}</figcaption>` // Ajoute l'image et le titre
                gallery.appendChild(element) // Ajoute l'element figure dans le DOM (emplacement de la gallery)
            })
            if (userToken) loadModals(data, reloadGallery)
        })
        .catch(error => console.log("WORKS ERROR :", error)))
}
// #endregion

// #region - FILTRES
const loadFilters = async () => {
    /*
    Recuperation des categories depuis l'API
    Pour chaque categorie, on crée un bouton dans un conteneur
    Chaque bouton va filtrer les images en fonction de son id
    On ajoute le bouton dans le conteneur
    On ajoute le conteneur après le titre du portfolio
    */
    return (fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const containerElement = document.createElement("div") // Créel le conteneur
            containerElement.classList.add("menu-filter") // lui donne une classe 'menu-filter'
            data = [{ name: "Tous", id: -1 }, ...data] // Ajoute l'element 'tous' dans le tableau puis les autres categories
            data.forEach(categorie => { // Boucle sur les categories
                const categoryId = "" + categorie.id // Convertit l'id de la categorie en string
                const element = document.createElement("button") // Crée le bouton
                element.classList.add("filter") // lui donne une classe 'filter'
                element.setAttribute("data-filter", categorie.id) // lui donne l'id de la categorie
                element.textContent = categorie.name // Ajoute le nom de la categorie
                categorie.id === -1 ? element.classList.add("active") : null // Si l'id de la categorie est -1, ajoute la classe 'active'
                element.onclick = (event) => { // Evenement au clique du filtre
                    console.log(categorie.id) // Affiche l'id de la categorie
                    console.log(event.target.textContent) // Affiche le nom de la categorie

                    const figures = [...gallery.querySelectorAll("figure")] // Recupere tous les projets dans un tableau
                    figures.forEach(figure => { // Boucle sur les projets
                        const figureId = figure.getAttribute("data-filter") // Recupere l'id du projet
                        if (categoryId === "-1" || categoryId === figureId) { // Si l'id du projet correspond a celui du filtre
                            figure.style.display = "block" // Affiche le projet
                        } else {
                            figure.style.display = "none" // Masque le projet
                        }
                    })

                    const filterButtons = containerElement.querySelectorAll(".filter") // Recupere tous les filtres
                    filterButtons.forEach(button => {
                        if (button === event.target) { // Si le bouton cliqué correspond à celui du filtre
                            button.classList.add("active")
                        } else {
                            button.classList.remove("active")
                        }
                    })
                }
                if (userToken) {
                    containerElement.removeChild(element)
                }
                containerElement.appendChild(element) // Ajoute le bouton dans le conteneur
            })
            gallery.insertAdjacentElement("beforebegin", containerElement) // Ajoute le conteneur à la fin du titre
        })
        .catch(error => console.log("CATEGORIES ERROR :", error)))
    }
// #endregion

await loadFilters()
await reloadGallery()

// #region - LOGIN
    /*
    Ce bloc de code vérifie si le token de l'utilisateur existe dans le storage.
    S'il existe, il effectue les actions suivantes:
        - Cache le bouton "Login"
        - Affiche le bouton "Logout"
        - Affiche le mode édition

    Si le token existe, le bouton "Logout" efface le token du storage et redirige vers la page d'accueil.
    */
    if (userToken) {

        logIn.style.display = "none" // Masque le bouton 'Login'
        logOut.style.display = "block" // Affiche le bouton 'Logout'
        editionBox.style.display = "flex" // Affiche le bandeau édition
        editionBtn.style.display = "flex" // Affiche le bouton 'Edition'

        // On clique sur "Logout", on efface le token du storage et on redirige vers la page d'accueil
        logOut.onclick = () => {

            storage.clear() // Efface le token du storage
            window.location.href = "index.html" // Redirige vers la page d'accueil
        }
    }
// #endregion