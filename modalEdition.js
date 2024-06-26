import { createModal, closeModals, getModalMain, getModalSubmit, openModal } from "./modal.js"
import storage from "./libs/storage.js"

export const loadModals = (projects, reloadGallery) => {
    const f = new FormData()
    f.append("image", "image")
    f.append("title", "title")

    console.log("LOAD MODAL")

    const editionModal = createModal({
        title: "Galerie photo",
        parent: document.body,
        validateText: "Ajouter une photo",
        validateSubmit: false
    })

    getModalMain(editionModal).innerHTML = `
        <div class="modal__main--container"></div>
    `

    const editionModal2 = createModal({
        title: "Ajout Photo",
        parent: document.body,
        useHistory: true,
        modalHistory: editionModal,
        validateText: "Valider"
    })

    getModalMain(editionModal2).innerHTML = `
        <form action="#" method="post" class="modal__form">

            <div class="modal__input--img">
                <div class="form-empty">
                    <i class="far fa-image form-preview-icon"></i>
                    <label for="image" class="button file-requester-button" tabIndex="0">+ Ajouter photo</label>
                    <input type="file" id="image" accept="image/png, image/jpeg" hidden>
                    <p class="note">jpg, png : 4Mo max</p>
                </div>
                <img class="form-preview-img">
            </div>

            <div class="modal__input--title label-input">
                <label class="modal__label" for="photo-title">Titre</label>
                <input type="text" name="title" id="photo-title" class="modal__input">
            </div>

            <div class="modal__input--category label-input">
                <label class="modal__label" for="photo-filter" id="photo-filter-label">Catégorie</label>
                <select name="photo-filter" id="photo-filter" class="modal__input">
                    <option value="filtre 1"> </option>
                    <option value="1">Objets</option>
                    <option value="2">Appartements</option>
                    <option value="3">Hotels &amp; restaurants</option>
                </select>
            </div>

        </form>
    `

    const reloadGalleryContent = () => {
        console.log("reload gallery content")
        openModal(editionModal)
        const gallery = getModalMain(editionModal).querySelector(".modal__main--container")
        gallery.innerHTML = ""
        projects.map(project => {
            const elementDiv = document.createElement("div")
            elementDiv.classList.add("modal__main--img")
            elementDiv.innerHTML = `
                <img src="${project.imageUrl}"
                alt="${project.title}">
                <i class="fas fa-trash-can trash"></i>
            ` // Ajoute l'image et le titre
            gallery.appendChild(elementDiv)
            const deleteBtn = elementDiv.querySelector(".trash")

            // ! *********** DELETE WORKS ***********

            const onDelete = (event) => {
                event.stopPropagation()
                const token = sessionStorage.getItem("token")

                fetch(`http://localhost:5678/api/works/${project.id}`,
                    {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "content-type": "application/json"
                        }
                    })
                    .then(response => {
                        if (!response.ok && response.status !== 204) {
                            throw new Error("HTTP error " + response.status)
                        }
                    })
                    .then(() => {
                        closeModals()
                        reloadGallery()
                    })
                    .catch(error => console.log("DELETE ERROR :", error))
            }
            deleteBtn.addEventListener("click", onDelete)
        })
    }

    //! *********** MODAL UPLOAD PHOTO ***********
    getModalSubmit(editionModal).addEventListener("click", event => {
        event.preventDefault()
        openModal(editionModal2)
    })

    const submitAddPhoto = getModalSubmit(editionModal2)
    submitAddPhoto.disabled = true
    const uploadForm = editionModal2.querySelector(".modal__form")
    const uploadPhoto = editionModal2.querySelector("#image")
    const uploadPreviewEmpty = editionModal2.querySelector(".form-empty")
    const uploadPreviewImg = editionModal2.querySelector(".form-preview-img")
    const uploadPhotoTitle = editionModal2.querySelector("#photo-title")
    const uploadPhotoCategory = editionModal2.querySelector("#photo-filter")

    const validateForm = () => {
        const disabled = (
            !uploadPhoto || uploadPhoto.files.length < 1 || !uploadPhoto.files[0] ||
            uploadPhotoTitle.value.length < 3 ||
            uploadPhotoCategory.value.length < 1 || uploadPhotoCategory.value === "filtre 1"
        )

        submitAddPhoto.disabled = disabled
        return !disabled
    }

    uploadForm.onsubmit = (e) => {
        e.preventDefault()
        e.stopPropagation()
        validateForm()
    }

    uploadPhotoTitle.oninput = validateForm
    uploadPhotoCategory.onchange = validateForm

    uploadPhoto.onchange = (e) => {
        if (e.target.files.length < 1) {
            uploadPreviewEmpty.style.display = "block"
            uploadPreviewImg.style.display = "none"
        } else {
            uploadPreviewEmpty.style.display = "none"
            uploadPreviewImg.style.display = "block"
            const fileReader = new FileReader()
            fileReader.onload = (event) => {
                uploadPreviewImg.src = event.target.result
            }
            fileReader.readAsDataURL(e.target.files[0])
        }
        validateForm()
    }

    submitAddPhoto.addEventListener("click", event => {
        event.preventDefault()
        if (!validateForm()) return
        console.log("UPLOAD PHOTO : ",
            uploadPhoto.value,
            uploadPhotoTitle.value,
            uploadPhotoCategory.value
        )

        const token = storage.getItem("token")
        const formData = new FormData()
        formData.append("image", uploadPhoto.files[0])
        formData.append("title", uploadPhotoTitle.value)
        formData.append("category", +uploadPhotoCategory.value)

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`, },
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status)
                }
                closeModals()
                reloadGallery()
                console.log("DATA : ", response)
            })
            .catch(err => {
                console.log("UPLOAD ERROR : ", err)
            })
    })


    //! AFFICHAGE ET FERMETURE DES MODALES
    // On clique sur le bouton 'Edition', on ouvre la modale
    document.querySelector(".modify").onclick = reloadGalleryContent
}