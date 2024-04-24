export const loadModal = (projects) => {
    const editionBtn = document.querySelector(".modify")
    const editionModal = document.querySelector(".modal")
    const editionClose = editionModal.querySelector(".modal__close")
    const editionSubmit = editionModal.querySelector(".modal__submit")
    const editionContainer = editionModal.querySelector(".modal__container")

    /*
    COMMENTAIRES:
    */

    function closeModal () { // Function fermant la modale
        if (editionModal.style.display === "flex") {
            editionModal.style.display = "none"
        }
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
            const onDelete = (event) => {
                event.stopPropagation()
                console.log("delete");
            }
            deleteBtn.addEventListener ("click", onDelete)
        })
    }
    editionBtn.onclick = () => { // On clique sur le bouton 'Edition', on ouvre la modale
        reload()
    }

    editionClose.onclick = () => { // On clique sur le bouton 'X', on ferme la modale
        closeModal()
    }

    editionModal.addEventListener("click", (event) => { // On clique en dehors de la modale pour la fermer
            closeModal()
    })

    editionContainer.addEventListener("click", (event) => {
        event.stopPropagation()
        console.log(editionContainer);
    })
}