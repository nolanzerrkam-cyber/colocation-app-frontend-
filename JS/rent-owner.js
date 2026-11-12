import {getApiUrl} from "./api.js";

let rent;
let roommates;
let rentStatuses;

const rentTitle = document.getElementById("rent-title");
const roommatesRentList = document.getElementById("roommates-rent-list");
const rentSummary = document.getElementById("rent-summary");

window.addEventListener("load", async () => {
    await refreshPage();
})

async function refreshPage() {
    const isRentLoaded = await getRent();
    const isRoommatesLoaded = await getRoommates();
    const isStatusesLoaded = await getRentStatuses();

    if (!isRentLoaded || !isRoommatesLoaded || !isStatusesLoaded) {
        displayError();
        return;
    }

    displayRentTitle();
    displayRentSummary();
    displayRoommatesRent();
}

async function getRent() {
    try {
        const response = await fetch(getApiUrl("/api/rent"));

        if (!response.ok) {
            console.error("Error from backend");
            return false;
        }

        rent = await response.json();
        return true;
    }
    catch (error) {
        console.error(error.message);
        return false;
    }
}

async function getRoommates() {
    try {
        const response = await fetch(getApiUrl("/api/roommate"));

        if (!response.ok) {
            console.error("Error from backend");
            return false;
        }

        roommates = await response.json();
        return true;
    }
    catch (error) {
        console.error(error.message);
        return false;
    }
}

async function getRentStatuses() {
    try {
        const response = await fetch(getApiUrl("/api/rent/isRentPaid"));

        if (!response.ok) {
            console.error("Error from backend");
            return false;
        }

        rentStatuses = await response.json();
        return true;
    }
    catch (error) {
        console.error(error.message);
        return false;
    }
}

function displayRentTitle() {
    rentTitle.textContent = "All the rents for → " + new Date().toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric"
    });
}

function displayRoommatesRent() {
    removeRoommatesRentComponents();

    const share = rent.price / roommates.length;

    roommates.forEach(roommate => {
        createRoommateRentComponent(roommate, share, rentStatuses[roommate.email]);
    });
}

function createRoommateRentComponent(roommate, share, paid) {
    const rentItem = document.createElement('div');
    rentItem.classList.add('rent-item');

    const name = document.createElement('span');
    name.classList.add('rent-name');
    name.textContent = roommate.firstname + " " + roommate.lastname;

    const details = document.createElement('div');
    details.classList.add('rent-details');

    const amount = document.createElement('strong');
    amount.textContent = share.toFixed(2) + " €";

    const badge = document.createElement('span');
    badge.textContent = paid ? "Paid" : "Pending";
    badge.className = paid ? "rent-badge paid" : "rent-badge unpaid";

    details.appendChild(amount);
    details.appendChild(badge);

    rentItem.appendChild(name);
    rentItem.appendChild(details);

    roommatesRentList.appendChild(rentItem);
}

function removeRoommatesRentComponents() {
    while (roommatesRentList.firstChild)
        roommatesRentList.removeChild(roommatesRentList.lastChild);
}

function displayError() {
    removeRoommatesRentComponents();

    const error = document.createElement('span');
    error.textContent = "Unavailable";

    roommatesRentList.appendChild(error);
}

function displayRentSummary() {
    const share = rent.price / roommates.length;
    const paidCount = roommates.filter(roommate => rentStatuses[roommate.email]).length;

    rentSummary.textContent = "Total of the rent gained : " + (share * paidCount).toFixed(2) + " € / " + rent.price.toFixed(2) + " €";
}