import {getApiUrl} from "./api.js";
const list = document.getElementById('roommatesList');
const addBtn = document.getElementById('addRoommateBtn');
const roommatesNumber = document.getElementById('roommatesNumber');

const closeButton = document.getElementById("closeBtn");
const modalOverlay = document.getElementById("modalOverlay");
const roommateForm = document.getElementById("roommateForm");
const submitButton = document.getElementById("submit-button"); 
const notifier = document.getElementById("notifier"); 
const firstNameLabel = document.getElementById("roommateFirstName");
const lastNameLabel = document.getElementById("roommateLastName");
const emailLabel = document.getElementById("roommateEmail");
const phoneLabel = document.getElementById("roommatePhoneNumber");


addBtn.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);

roommateForm.addEventListener("submit", handleSubmitForm);

window.addEventListener('load', async () => {
    const roommatesList = await getAllRoommates();
    refreshRoommateComponents(roommatesList);
})

if (list) {
    list.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const errorSection = document.getElementById("error-section");
            if (list.children.length === 30 && errorSection) {
                errorSection.innerHTML = "";
            }
        }
    });
}

if (addBtn) {
    addBtn.addEventListener('click', () => {
        const count = list.children.length + 1;
        const error = document.getElementById("error-section");
        if (count === 31) {
            if (error) {
                error.innerHTML = "There are too much roomates on the shared home !";
            }
        } else {
            if (error) {
                error.innerHTML = "";
            }
            const item = document.createElement('div');
            item.className = 'roommate-item';
            item.innerHTML = `
                <div class="roommate-info">
                    <span class="roommate-name">Roomate n°${count}</span>
                    <div class="roommate-details">Room n°${count} — email@exemple.com</div>
                </div>
                <button class="btn btn-delete">- Delete</button>`;
            list.appendChild(item);
            if (roommatesNumber) {
                roommatesNumber.innerHTML = list.children.length;
            }
        }
    });
}

/**
 * Remove old Roommate components and render them again
 * @param roommates - list of roommate [email, firstname, lastname, phonenumber]
 */
function refreshRoommateComponents(roommates) {
    removeRoommateComponents();
    roommates.forEach((r) => createRoommateComponent(r));
    roommatesNumber.innerText = `${list.children.length}`
}

/**
 * Create the roommate HTML UI element
 * @param roommate - [email, firstname, lastname, phonenumber]
 */
function createRoommateComponent(roommate) {
    const roommateComponent = document.createElement('div');
    roommateComponent.className = 'roommate-item';

    const info = document.createElement('div');
    info.className = 'roommate-info';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'roommate-name';
    nameSpan.textContent = `${roommate.firstname} ${roommate.lastname}`;

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'roommate-details';
    detailsDiv.textContent = roommate.email;

    info.appendChild(nameSpan);
    info.appendChild(detailsDiv);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.textContent = '- Delete';

    deleteBtn.addEventListener('click', () => deleteRoommate(roommate, roommateComponent));

    roommateComponent.appendChild(info);
    roommateComponent.appendChild(deleteBtn);

    list.append(roommateComponent);
}

/**
 * Remove each roommate component from the list
 */
function removeRoommateComponents() {
    while (list.firstChild)
        list.removeChild(list.lastChild)
}

/**
 * Retrieve all roommates from database
 * @returns {Promise<any|*[]>}
 */
async function getAllRoommates() {
    const url = getApiUrl("/api/roommate");
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Error from backend");
            return [];
        }

        return response.json();
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

/**
 * Remove the roommate component and remove the roommate from database
 * @param roommate - roommate
 * @param roommateComponent - roommate HTML component
 */
function deleteRoommate(roommate, roommateComponent) {
    roommateComponent.remove();
    // todo delete from db
    roommatesNumber.innerText = `${list.children.length}`
}

// here's for closing the modal when you are click outside the form
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

function handleSubmitForm(event) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(roommateForm);
    const {isError, message} = validateInput(formData);

    if (isError) {
        setNotifier(message, true);
        setLoading(false);
        return;
    }

    createRoommate(formData);

    setLoading(false);
}

async function createRoommate(roommateData) 
{
    const url = getApiUrl("/api/roommate/register");
    try
    {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "firstname": roommateData.get("firstname"),
                "lastname": roommateData.get("lastname"),
                "email": roommateData.get("email"),
                "phonenumber": roommateData.get("phoneNumber"),
            })
        });

        if(!response.ok)
        {
            console.error("Error from the backend : failed to get a response.");
        }

        roommateForm.reset();
        setNotifier("SUCCESS : the user was created ! Don't forget to change the password.");
    }
    catch(error)
    {
        setNotifier("An error has occured : " + error.message, true);
    }
}

function validateInput(formData) {
    let errorCounter = 0;
    let errorMessage = [];

    if (!formData.get("firstname") || formData.get("firstname").length < 1) {
        errorMessage.push("The firstname is required");
        errorCounter++;
    }

    if (!formData.get("lastname") || formData.get("lastname").length < 1) {
        errorMessage.push("The lastname is required");
        errorCounter++;
    }

    if (!formData.get("email") || formData.get("email").length < 10) {
        errorMessage.push("The email is required or has to be at least 10 characters long.");
        errorCounter++;
    }

    if (!formData.get("phoneNumber") || formData.get("phoneNumber").length < 8) {
        errorMessage.push("A phoneNumber is required or the email needs to have at least 8 numbers.");
        errorCounter++;
    }

    return {
        isError: errorCounter > 0,
        message: "Error: " + errorMessage.join("\n")
    };
}

function setNotifier(message, isError) {
    notifier.innerText = message;
    notifier.style.color = isError ? "red" : "green";
}

function setLoading(isLoading) {
    if (isLoading) {
        submitButton.innerText = "Loading...";
        submitButton.disabled = true;
    } else {
        submitButton.innerText = "Roommate created !";
        submitButton.disabled = false;
        setTimeout(() => 
        {
            submitButton.innerText = "Confirm the creation";
            submitButton.disabled = false;
            notifier.innerText = "";
        }, 5000);
    }
}

function setConditions()
{
    // fn = first name, ln = last name, pn = phone number.
    const fn = document.getElementById("fnCondition");
    const ln = document.getElementById("lnCondition");
    const pn = document.getElementById("pnCondition");
    const emailLength = document.getElementById("emailLength");
    const emailFormat = document.getElementById("emailFormat");
    const domainEmailCheck = document.getElementById("domainEmailCheck");
    const checkAt = document.getElementById("checkAt");

    firstNameLabel.addEventListener("input", (e) => {
        const validation = e.target.value.trim().length;
        fn.classList.toggle("valid", validation);
    });

    lastNameLabel.addEventListener("input", (e) =>{
        const validation = e.target.value.trim().length;
        ln.classList.toggle("valid", validation)
    });

    phoneLabel.addEventListener("input", (e) => {
        const validation = e.target.value.trim().length >= 8;
        pn.classList.toggle("valid", validation);
    });

    roommateEmail.addEventListener("input", (e) => 
    {
        const validation = e.target.value.trim().length >= 10 && e.target.value.trim().length <= 64;
        emailLength.classList.toggle("valid", validation);
    });

    roommateEmail.addEventListener("input", (e) => {
        const input = e.target.value.trim();
        const regex = /^[A-Za-z0-9.\\_\\-\\@]*$/;
        const validation = regex.test(input);
        emailFormat.classList.toggle("valid", validation);
    });

    roommateEmail.addEventListener("input", (e) => {
        const input = e.target.value.trim();
        const regex = /[.]{1,1}[a-z]{2,}$/;
        const validation = regex.test(input);
        domainEmailCheck.classList.toggle("valid", validation);
    });

    roommateEmail.addEventListener("input", (e) => {
        const input = e.target.value.trim();
        const regex = /@/
        const validation = regex.test(input);

        checkAt.classList.toggle("valid", validation);
    });

}

setConditions();