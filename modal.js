const modalManager = []

export const closeModals = () => {
    modalManager.forEach(element => {
        element.style.display = "none"
    })
    document.body.style.overflowY = "auto"
}

export const openModal = (modal) => {
    closeModals()
    modal.style.display = "flex"
    document.body.style.overflowY = "hidden"
}

export const createModal = ({
    title,
    parent=null,
    useHistory=false,
    modalHistory=null,
   validateText
}) => {
    const div = document.createElement("div")
    div.classList.add("modal")
    div.innerHTML = `<div class="modal__container">
        <div class="modal__header">
            ${useHistory ? `<div class="modal__prev">
                <i class="fa fa-arrow-left modal__prev"></i>
            </div>` : ''}
            <div class="modal__title">${title}</div>
            <div class="modal__close">
                <i class="fas fa-close"></i>
            </div>
        </div>

        <div class="modal__main">
        </div>

        <div class="modal__footer">
			<div class="modal__separator"></div>
			<input type="submit" class="modal__submit" value="${validateText}">
		</div>
    </div>`
    
    const closeBtn = div.querySelector(".modal__close")
    closeBtn.addEventListener("click", closeModals)
    div.addEventListener("click", closeModals)
    const container = div.querySelector(".modal__container")
    container.addEventListener("click", (event) => {
        event.stopPropagation()
    })

    if (useHistory && modalHistory) {
        const navBtn = div.querySelector(".modal__prev")
        navBtn.addEventListener("click", () => {
            openModal(modalHistory)
        })
    }
    
    if (parent) parent.appendChild(div)
    console.log("MODAL : ", div, title, parent)

    modalManager.push(div)
    return div
}

export const getModalMain = (modal) => {
    return modal.querySelector(".modal__main")
}
export const getModalSubmit = (modal) => {
    return modal.querySelector(".modal__submit")
}
