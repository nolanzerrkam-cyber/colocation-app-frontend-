let greetingHolder = document.getElementById("greeting-message");
let user = JSON.parse(sessionStorage.getItem("user"));
let createRoommateButton = document.getElementById("createRoommateBtn");
let addRoommateButton = document.getElementById("addRoommateBtn");
let backRoommateButton = document.getElementById("backRoommateBtn");

//TODO: check with login
function start() {
    if (user) {
        greetingHolder.innerHTML =
            "Welcome " + user["firstname"] + ". Here you can manage all of the roommates in your house.";
    }
    else
    {
        greetingHolder.innerHTML =
            "Welcome [Owner]. Here you can manage all of the roommates in your house.";
    }
}
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
        password: "Changeme123",
        phonenumber: document.getElementById("phonenumber").value
    };

    try {
        const response = await fetch("https://dikkenek-backend.dev20.woogma.com/api/user/register", {
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
        document.getElementById("error-section").textContent = "Impossible de créer le roommate.";
    }
}

window.onload = start;
addRoommateButton.addEventListener("click", openForm);
backRoommateButton.addEventListener("click", closeForm);
createRoommateButton.addEventListener("click", createRoommate);