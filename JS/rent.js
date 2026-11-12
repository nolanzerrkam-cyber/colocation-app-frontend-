import {getApiUrl} from "./api.js";

let rent;
let roommateRent;

const rentBtn = document.getElementById("payRentBtn");
const rentStatus = document.getElementById("rentStatus");
const rentShare = document.getElementById("rent-share");
const rentTotal = document.getElementById("rent-total");
const rentDeadline = document.getElementById("rent-deadline");
const rentStatus = document.getElementById("rent-status");

rentBtn.addEventListener("click", payRent);

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
    checkRentPaid();
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

function getUserEmail() {
    const user = JSON.parse(sessionStorage.getItem("user") ?? "null");
    return user?.email ?? null;
}

function getCurrentPeriod() {
    const today = new Date();
    return {month: today.getMonth() + 1, year: today.getFullYear()};
}

function setStatus(message, color) {
    rentStatus.textContent = message;
    rentStatus.style.color = color;
}

// Show or hide the button depending on whether the rent is paid
function displayRentState(isPaid, month, year) {
    if (isPaid) {
        rentBtn.style.display = "none";
        setStatus(`✓ Rent for ${month}/${year} is paid`, "green");
    } else {
        rentBtn.style.display = "";
        setStatus(`Rent for ${month}/${year} is not paid yet`, "red");
    }
}

// Ask the backend if the current user has paid this month's rent
async function checkRentPaid() {
    const email = getUserEmail();
    rentBtn.style.display = "none";

    const {month, year} = getCurrentPeriod();
    const params = new URLSearchParams({month, year});

    try {
        const response = await fetch(`${getApiUrl("/api/rent/isRentPaid")}?${params}`);
        if (!response.ok)
            throw new Error(`HTTP ${response.status} : ${await response.text()}`);

        const paidByEmail = await response.json();

        if (!(email in paidByEmail)) {
            setStatus("You are not a roommate of this flatshare", "red");
            return;
        }

        displayRentState(paidByEmail[email] === true, month, year);
    } catch (error) {
        console.error(error);
        setStatus("Unable to check your rent status", "red");
    }
}

async function payRent() {
    const email = getUserEmail();
    if (!email) {
        alert("You need to be logged in");
        return;
    }

    const {month, year} = getCurrentPeriod();
    const params = new URLSearchParams({email, month, year});

    rentBtn.disabled = true;
    try {
        const response = await fetch(`${getApiUrl("/api/rent/payRent")}?${params}`, {
            method: "GET"
        });

        if (response.ok) {
            displayRentState(true, month, year);
        } else {
            const message = await response.text();
            alert(`Error ${response.status} : ${message}`);
        }
    } catch (error) {
        console.error(error);
        alert("Network error, please try again");
    } finally {
        rentBtn.disabled = false;
    }
}