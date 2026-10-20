import {getApiUrl} from "./api.js";

let user = JSON.parse(sessionStorage.getItem("user"));
let createRoommateButton = document.getElementById("createRoommateBtn");
let addRoommateButton = document.getElementById("addRoommateBtn");
let backRoommateButton = document.getElementById("backRoommateBtn");


function openForm() {
    document.querySelector(".roommateForm").classList.add("open");
}

function closeForm() {
    document.querySelector(".roommateForm").classList.remove("open");
}

async function createRoommate(event) {
    event?.preventDefault();

    const body = {
        email: document.getElementById("email").value,
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        phonenumber: document.getElementById("phonenumber").value
    };

    try {
        const response = await fetch(getApiUrl('/api/user/register'), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error("Erreur HTTP " + response.status + " : " + errorText);
        }

        closeForm();
    } catch (error)
    {
        console.error("Erreur lors de la création :", error);
        document.getElementById("error-section").textContent = "Cannot create roommate.";
    }
}

addRoommateButton.addEventListener("click", openForm);
backRoommateButton.addEventListener("click", closeForm);
createRoommateButton.addEventListener("click", createRoommate);