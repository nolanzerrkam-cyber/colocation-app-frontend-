import {getApiUrl} from "./api.js";

const rentTitle = document.getElementById("rent-title");
rentTitle.textContent = "All the rents for -> " + new Date().toLocaleDateString("en-GB", {month: "long", year: "numeric"});

let rent;
let roommates;
let rentStatuses;

const roommatesRentList = document.getElementById("roommates-rent-list");

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


function displayRoommatesRent() {
    removeRoommatesRentComponents();

    const share = rent.price / roommates.length;

    roommates.forEach(roommate => {
        createRoommateRentComponent(roommate, share, rentStatuses[roommate.email]);
    });
}

function createRoommateRentComponent(roommate, share, paid) {
    const roommateItem = document.createElement('div');
    roommateItem.classList.add('roommate-item');

    const name = document.createElement('span');
    name.textContent = roommate.firstname + " " + roommate.lastname;

    const amount = document.createElement('strong');
    amount.textContent = share.toFixed(2) + " € (" + (paid ? "Paid" : "Pending") + ")";

    roommateItem.appendChild(name);
    roommateItem.appendChild(amount);

    roommatesRentList.appendChild(roommateItem);
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