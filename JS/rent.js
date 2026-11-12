import {getApiUrl} from "./api.js";

let rent;
let roommateRent;

const rentShare = document.getElementById("rent-share");
const rentTotal = document.getElementById("rent-total");
const rentDeadline = document.getElementById("rent-deadline");
const rentStatus = document.getElementById("rent-status");

window.addEventListener("load", async () => {
    await refreshPage();
})

async function refreshPage() {
    const isRentLoaded = await getRent();
    const isRoommateRentLoaded = await getRoommateRent();

    if (!isRentLoaded || !isRoommateRentLoaded) {
        displayError();
        return;
    }

    displayRent();
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

async function getRoommateRent() {
    const email = JSON.parse(sessionStorage.getItem("user")).email;

    try {
        const response = await fetch(getApiUrl(`/api/rent/${email}`));

        if (!response.ok) {
            console.error("Error from backend");
            return false;
        }

        roommateRent = await response.json();
        return true;
    }
    catch (error) {
        console.error(error.message);
        return false;
    }
}

function displayRent() {
    rentShare.textContent = roommateRent.rent.toFixed(2);
    rentTotal.textContent = rent.price.toFixed(2) + " €";
    rentDeadline.textContent = formatDeadline(rent.deadlineDay);
    displayStatus(roommateRent.paid);
}

function displayStatus(paid) {
    rentStatus.textContent = paid ? "Paid" : "To pay";
    rentStatus.className = paid ? "rent-badge paid" : "rent-badge unpaid";
}

function displayError() {
    rentShare.textContent = "--";
    rentTotal.textContent = "--";
    rentDeadline.textContent = "--";
    rentStatus.textContent = "Unavailable rent ; please contact your landlord.";
}

function formatDeadline(day) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), day).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}