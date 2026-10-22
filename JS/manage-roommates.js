const openButton = document.getElementById("openRoommateModal");
const closeButton = document.getElementById("closeBtn");
const modalOverlay = document.getElementById("modalOverlay");

openButton.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);

// here's for closing the modal when you are click outside the card
modalOverlay.addEventListener("click", (event) => {
    if(event.target === modalOverlay)
        closeModal();
});

function openModal() {
    modalOverlay.style.display = "flex";
}

function closeModal() {
    modalOverlay.style.display = "none";
}