import {getApiUrl} from "./api.js";

let shoppingItems;

const shoppingItemsList = document.getElementById("shopping-items-list");

window.addEventListener("load", async () => {
    await refreshPage();
})

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