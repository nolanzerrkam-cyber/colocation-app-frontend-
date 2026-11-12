import {getApiUrl} from "./api.js";

const rentBtn = document.getElementById("payRentBtn");
const rentStatus = document.getElementById("rentStatus");

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

rentBtn.addEventListener("click", payRent);
checkRentPaid();