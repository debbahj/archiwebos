export const loadModal = (projects) => {
    const editionBtn = document.querySelector(".modify")
    const editionModal = document.querySelector(".modal")
    const editionModal2 = document.querySelector(".modal2")
    const editionClose = editionModal.querySelector(".modal__close")
    const editionClose2 = editionModal2.querySelector(".modal__close")
    const editionPrev = editionModal2.querySelector(".modal__prev")
    const editionSubmit = editionModal.querySelector(".modal__submit")
    const editionContainer = editionModal.querySelector(".modal__container")
    const editionContainer2 = editionModal2.querySelector(".modal__container2")

    function closeModal () { // Function fermant la modale
            editionModal.style.display = "none"
            editionModal2.style.display = "none"
            document.body.style.overflowY = "auto"
    }
    const reload = () => {
        editionModal.style.display = "flex"
        const gallery = editionContainer.querySelector(".modal__content--container")
        gallery.innerHTML = ""
        projects.map(project => {
            const elementDiv = document.createElement("div")
            elementDiv.classList.add("modal__content--img")
            elementDiv.innerHTML = `<img src="${project.imageUrl}" alt="${project.title}">
            <i class="fas fa-trash-can trash"></i>` // Ajoute l'image et le titre
            gallery.appendChild(elementDiv)
            const deleteBtn = elementDiv.querySelector(".trash")

            // ! *********** DELETE WORKS ***********

            const onDelete = (event) => {
                event.stopPropagation()
                const token = sessionStorage.getItem("token")

                fetch(`http://localhost:5678/api/works/${project.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `${token}`
                    }
                })
                .then(response => response.json())
                .then(() => {
                    // window.location.reload()
                    // alert(`L'element ${project.id} à été supprimé`)
                })
                .catch(error => console.log("DELETE ERROR :", error))
            }
            deleteBtn.addEventListener ("click", onDelete)
        })
    }

    //! *********** MODAL UPLOAD PHOTO ***********

    const uploadPhoto = editionModal2.querySelector("#upload-photo")
    const uploadPhotoTitle = editionModal2.querySelector("#title-photo")
    const uploadPhotoCategory = editionModal2.querySelector("#filter-photo")

    editionSubmit.addEventListener("click", event => {
        event.preventDefault()

        
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: JSON.stringify({
                "imageUrl": uploadPhoto.value,
                "title": uploadPhotoTitle.value,
                "categoryId": uploadPhotoCategory.value,
            })
        })
        .then(response => response.json())
        .then(data => console.log("DATA : ", data))
        .catch(error => console.log("UPLOAD ERROR : ", error))
    })


    //! AFFICHAGE ET FERMETURE DES MODALES

    editionBtn.onclick = () => { // On clique sur le bouton 'Edition', on ouvre la modale
        document.body.style.overflowY = "hidden"
        reload()
    }

    editionClose.onclick = () => { // On clique sur le bouton 'X', on ferme la modale
        closeModal()
    }

    editionClose2.onclick = () => { // On clique sur le bouton 'X', on ferme la modale
        closeModal()
    }

    editionModal.addEventListener("click", (event) => { // On clique en dehors de la modale pour la fermer
        closeModal()
    })

    editionContainer.addEventListener("click", (event) => {
        event.stopPropagation()
    })

    editionSubmit.addEventListener("click", (event) => {
        editionModal.style.display = "none"
        editionModal2.style.display = "flex"
    })

    editionPrev.addEventListener("click", (event) => {
        editionModal2.style.display = "none"
        editionModal.style.display = "flex"
    })

    editionModal2.addEventListener("click", (event) => {
        closeModal()
    })

    editionContainer2.addEventListener("click", (event) => {
        event.stopPropagation()
    })
}