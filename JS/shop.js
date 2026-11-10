import {getApiUrl} from "./api.js";

let shoppingItems;

const shoppingItemsList = document.getElementById("shopping-items-list");
const submitButton = document.getElementById("submit-button");
const notifier = document.getElementById("notifier");
const shoppingItemsForm = document.getElementById("shoppingItemsForm");
shoppingItemsForm.addEventListener('submit', handleSubmitForm)

window.addEventListener("load", async () => {
    await refreshPage();
})

const addShoppingItem = document.getElementById("add-shopping-item");
addShoppingItem.addEventListener('click', openModal);

const modalOverlay = document.getElementById('modalOverlay');
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay)
        closeModal();
});

const closeButton = document.getElementById("closeBtn");
closeButton.addEventListener('click', closeModal);

// Retrieve all shopping items from the backend
async function getAllShoppingItems() {
    const url = getApiUrl("/api/shoppingItem");
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Error from backend");
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

// Refresh the page elements dynamically without a real refresh
async function refreshPage() {
    closeModal();
    shoppingItems = await getAllShoppingItems();
    displayShoppingItemsComponents();
}

// Create a separator HTML element between shopping items
function createSeparatorComponent() {
    const separator = document.createElement('hr');
    separator.classList.add('shopping-items-separator');
    shoppingItemsList.appendChild(separator);
}

// Remove and recreate shopping items list component
function displayShoppingItemsComponents() {
    removeShoppingItemsComponent();

    const shoppingItemsLength = shoppingItems.length;
    shoppingItems.forEach((item, index) => {
        createShoppingItemComponent(item);
        if (index !== shoppingItemsLength - 1) {
            createSeparatorComponent();
        }
    });
}

// Create a shopping item HTML component
function createShoppingItemComponent(item) {
    const shoppingItem = document.createElement('div');
    shoppingItem.classList.add('shopping-item');

    const shoppingItemDetails = document.createElement('div');

    const shoppingItemCheck = document.createElement('div');
    shoppingItemCheck.classList.add('shopping-items-check');
    shoppingItemCheck.textContent = '✔';

    const shoppingItemContent = document.createElement('div');
    shoppingItemContent.classList.add('shopping-items-content');

    const title = document.createElement('h3');
    title.textContent = item.quantity + "x " + item.label;

    const shoppingItemCreator = document.createElement('div');
    shoppingItemCreator.classList.add('shopping-items-creator');

    shoppingItemContent.appendChild(title);
    shoppingItemDetails.appendChild(shoppingItemCheck);
    shoppingItemDetails.appendChild(shoppingItemContent);

    shoppingItem.appendChild(shoppingItemDetails);

    shoppingItemsList.appendChild(shoppingItem);
}

// Remove all child of the shopping list div
function removeShoppingItemsComponent() {
    while (shoppingItemsList.firstChild)
        shoppingItemsList.removeChild(shoppingItemsList.lastChild);
}


function openModal() {
    modalOverlay.style.display = 'flex';
}

function closeModal() {
    modalOverlay.style.display = 'none';
}

async function handleSubmitForm(event) {
    event.preventDefault();
    setLoading(true);
    setNotifier("", false);

    const formData = new FormData(shoppingItemsForm);
    const {isError, message} = validateInput(formData);

    if (isError) {
        setNotifier(message, true);
        setLoading(false);
        return;
    }

    await createShoppingItem(formData)

    setLoading(false);

    await refreshPage();
}

function validateInput(formData) {
    let errorCounter = 0;
    let errorMessage = [];

    if (!formData.get("label") || formData.get("label").length < 1) {
        errorMessage.push("Label is required")
        errorCounter++;
    }

    if (!formData.get("quantity") || formData.get("quantity") < 1) {
        errorMessage.push("Quantity is required")
        errorCounter++;
    }

    return {
        isError: errorCounter > 0,
        message: "Error: " + errorMessage.join("\n")
    };
}

// Persist a new shopping item in database through the API
async function createShoppingItem(shoppingItemData) {
    const currentUserEmail = JSON.parse(sessionStorage.getItem("user")).email;

    if (!currentUserEmail)
        setNotifier("Error: user email is invalid", true);

    try {
        const url = getApiUrl("/api/shoppingItem");
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "label": shoppingItemData.get("label"),
                "quantity": shoppingItemData.get("quantity"),
                "roommateId": currentUserEmail,
            })
        });

        if (!response.ok) throw new Error('Error: network error');
        return true;
    } catch (e) {
        return false;
    }
}

// Display a message below the form
function setNotifier(message, isError) {
    notifier.innerText = message;
    notifier.style.color = isError ? "red" : "green";
}

// Disable or enable the submit button
function setLoading(isLoading) {
    if (isLoading) {
        submitButton.innerHTML = "Loading...";
        submitButton.disabled = true;
    } else {
        submitButton.innerText = "Create task";
        submitButton.disabled = false;
    }
}