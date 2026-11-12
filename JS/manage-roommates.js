import {getApiUrl} from "./api.js";
const MAX_ROOMMATES = 30;

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
const limitRoommates = document.getElementById("limitRoommates");
const pswrdLabel = document.getElementById("rawPassword");


addBtn.addEventListener("click", openModal);
if(closeButton)
    closeButton.addEventListener("click", closeModal);
if(roommateForm)
    roommateForm.addEventListener("submit", handleSubmitForm);

window.addEventListener('load', async () => 
{
    const roommatesList = await getAllRoommates();
    limitRoommates.innerText = MAX_ROOMMATES;
    refreshRoommateComponents(roommatesList);
})

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

    info.append(nameSpan, detailsDiv);

    const actions = document.createElement('div');
    actions.className = 'roommate-actions';

    const resetPwdBtn = document.createElement('button');
    resetPwdBtn.type = 'button';
    resetPwdBtn.className = 'resetPwdBtn';
    resetPwdBtn.textContent = 'Reset password';
    resetPwdBtn.addEventListener('click', () => openResetPasswordModal(roommate));

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn red-button btn-delete';
    deleteBtn.textContent = 'x';
    deleteBtn.addEventListener('click', () => openDeleteModal(roommate));

    actions.append(resetPwdBtn, deleteBtn);

    roommateComponent.append(info, actions);
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

// here's for closing the modal when you are click outside the form
modalOverlay.addEventListener("click", (event) => {
    if(event.target === modalOverlay)
        closeModal();
});


/*
    To make the pop up window for creating new roommates.
    FLEX => showing to the user, NONE => invisible.
*/
function openModal() {
    const notifError = document.getElementById("error-section");

    if(list.children.length >= MAX_ROOMMATES)
    {
        notifError.innerHTML = "There are too much roommates ! Please respect the maximum size of the roomshare.";
        setTimeout(() =>
        {
            notifError.innerHTML = "";
        }, 5000);
        return;
    }

    notifError.innerHTML = "";
    modalOverlay.style.display = "flex";
}

function closeModal() {
    modalOverlay.style.display = "none";
}

/*
    This method is for handling the form for the roommate creation.
    @param event : event is here to prevent the default behaviour from the submit event.
    This method is making sure that there is no error, by checking if there is a error in message.
    Then creating if there are no errors, and stoping the loading animation.
*/
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

/*
    This method is made to create a single roommate.
    @param roommateData : roommateData is going to contain all the data for creating the roommate : firstname, lastname, password, phonenumber and email.
*/
async function createRoommate(roommateData) 
{
    const url = getApiUrl("/api/user/register");
    try
    {
        const response = await fetch(url, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "firstname": roommateData.get("firstname"),
                "lastname": roommateData.get("lastname"),
                "email": roommateData.get("email"),
                "phonenumber": roommateData.get("phoneNumber"),
                "rawPassword" : roommateData.get("rawPassword"),
            })
        });
        if(!response.ok)
        {
            console.error("Error from the backend : failed to get a response.");
        }

        roommateForm.reset();
        setNotifier("SUCCESS : the user was created ! Don't forget to change the password.");

        const roommates = await getAllRoommates();
        refreshRoommateComponents(roommates);
    }
    catch(error)
    {
        setNotifier("An error has occured : " + error.message, true);
    }
}

/**
 * Remove the roommate component and remove the roommate from database
 * @param roommateEmail - roommate's email !
 */
async function deleteRoommate(roommateEmail)
{
    const url = getApiUrl(`/api/user/${roommateEmail}`);
    try
    {
        const response = await fetch(url, {
            method : 'DELETE'
        });
        if(!response.ok)
        {
            console.error("Error from the backend, please call the administrator");
            return false;
        }
        return true;
    }
    catch(error)
    {
        console.error("ERROR : " + error.message);
        return false;    
    }
}

// Just for debug if we need it
// function deleteRoommate(roommate, roommateComponent) {
//     roommateComponent.remove();
//     // todo delete from db
//     roommatesNumber.innerText = `${list.children.length}`
// }

function openDeleteModal(roommate)
{
    const modal = document.getElementById("deleteModal");
    const confirmBtn = document.getElementById("confirmDeleteBtn");
    const cancelBtn = document.getElementById("cancelDeleteBtn");

    modal.style.display = "flex";

    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    newCancelBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    newConfirmBtn.addEventListener("click", async () => {
        modal.style.display = "none";
        const success = await deleteRoommate(roommate.email);
        if(success)
        {
            const roommates = await getAllRoommates();
            refreshRoommateComponents(roommates);
        }
    });
}
/*
    This method is for returning errors when the owner didn't respect the rules for the creation of the account.
    @param formData : simply getting the information from the submitted form. Contains email, first and lastname, phonenumber and password
*/
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

    if(formData.get("email").length > 64)
    {
        errorMessage.push("The email is above 64 characters.");
        errorCounter++;
    }

    let email = formData.get("email");
    let emailRegex = /^[A-Za-z0-9._@-]+$/
    if(!emailRegex.test(email))
    {
        errorMessage.push("Only letters numbers underscores and hash and dot and hash are accepted.");
        errorCounter++;
    }

    let domainRegex = /[.]{1,1}[a-z]{2,}$/

    if(!domainRegex.test(email))
    {
        errorMessage.push("You need to have a domain that has at least two characters.");
        errorCounter++;
    }
    let arbRegex = /@/;

    if(!arbRegex.test(email))
    {
        errorMessage.push("You need a hash in your email.");
        errorCounter++;
    }

    if (!formData.get("phoneNumber") || formData.get("phoneNumber").length < 8) {
        errorMessage.push("A phoneNumber is required or the email needs to have at least 8 numbers.");
        errorCounter++;
    }

    if(!formData.get("email") || formData.get("rawPassword").length < 8)
    {
        errorMessage.push("The password needs at least to be 8 characters long.");
        errorCounter++;
    }

    return {
        isError: errorCounter > 0,
        message: "Error: " + errorMessage.join("\n")
    };
}

/*
    This little method is for the error message under the submit button.
    @param message : all the error message.
    @param isError : to change the color of the text : if true, its red (error), if not its green (account created)
*/

function setNotifier(message, isError) {
    notifier.innerText = message;
    notifier.style.color = isError ? "red" : "green";
}

/*
    This method is a simple animation so the user understand and sees when the account is created or not.
    @param isLoading : boolean value to determine if the loading is starting or not.
*/
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

/*
    This method is going to take the value of each labels, to check if each condition are respected for the creation of the account.
    This could be optimised I think, but for now its working.
*/

function setConditions()
{
    // fn = first name, ln = last name, pn = phone number.
    const fn = document.getElementById("fnCondition");
    const ln = document.getElementById("lnCondition");
    const pn = document.getElementById("pnCondition");
    const pswd = document.getElementById("pswrdCondition");
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

    pswrdLabel.addEventListener("input", (e) => {
        const validation = e.target.value.trim().length >= 8;

        pswd.classList.toggle("valid", validation);
    });
}

setConditions();

const DEFAULT_PASSWORD = "changeme";

/**
 * Ask the landlord's password, then reset the roommate's password to "changeme"
 * @param roommate - [email, firstname, lastname, phonenumber]
 */
function openResetPasswordModal(roommate) {
    if (document.getElementById("pwdOverlay")) return;

    const landlord = JSON.parse(sessionStorage.getItem("user") ?? "null");
    if (!landlord) return;

    const overlay = document.createElement("div");
    overlay.id = "pwdOverlay";
    overlay.className = "modal-overlay open";

    overlay.innerHTML = `
        <div class="modal-card">
            <button type="button" class="close-btn" id="closePwdBtn">&times;</button>
            <span class="subtitle">Reset password</span>
            <h2 class="title">${roommate.firstname} ${roommate.lastname}</h2>
            <p class="conditions" style="color:#718096; margin-bottom:18px;">
                The password will be reset to "<b>${DEFAULT_PASSWORD}</b>".
                Tell ${roommate.firstname} to change it after logging in.
            </p>

            <form id="pwdForm">
                <div class="form-group">
                    <label for="landlordPwd">Confirm with your password</label>
                    <input type="password" id="landlordPwd" placeholder="••••••••" required>
                </div>
                <button type="submit" class="submit-btn" id="changePwdSubmit">Reset password</button>
                <p id="changePwdMessage"></p>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);
    document.getElementById("landlordPwd").focus();

    const close = () => overlay.remove();
    document.getElementById("closePwdBtn").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

    document.getElementById("pwdForm").addEventListener("submit",
        (event) => resetPasswordByLandlord(event, landlord.email, roommate.email, close));
}

async function resetPasswordByLandlord(event, landlordEmail, roommateEmail, close) {
    event.preventDefault();

    const landlordPassword = document.getElementById("landlordPwd").value;
    const messageEl = document.getElementById("changePwdMessage");
    const submitBtn = document.getElementById("changePwdSubmit");

    const showMessage = (text, isError) => {
        messageEl.textContent = text;
        messageEl.style.color = isError ? "red" : "green";
    };

    submitBtn.disabled = true;
    try {
        const response = await fetch(getApiUrl("/api/user/newPassword/landlord"), {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                landlordEmail,
                landlordPassword,
                roommateEmail,
                newPassword: DEFAULT_PASSWORD
            })
        });

        const text = await response.text();

        if (response.ok) {
            showMessage(`Password reset to "${DEFAULT_PASSWORD}".`, false);
            setTimeout(close, 1500); // close the modal after a short confirmation
        } else {
            showMessage(text || `Error ${response.status}`, true);
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error(error);
        showMessage("Server connection error.", true);
        submitBtn.disabled = false;
    }
}