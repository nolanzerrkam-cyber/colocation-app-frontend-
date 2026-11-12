import {getApiUrl} from "./api.js";

let sumExpenses;
let sumShop;
let sumRent;
let sumChores;
let boxes;
let sumRentOwner;
let sumRoomates;
let submitLoginBtn
let logoutBtn;
let changePwdBtn;

onload = function () {
    const userSession = JSON.parse(sessionStorage.getItem('user'));

    if (!userSession && !window.location.href.includes("login.html")) {
        window.location.href = "../html/login.html"
        return
    }


    logoutBtn = document.getElementById("logout");
    sumExpenses = document.getElementById("sumExpenses");
    sumShop = document.getElementById("sumShop");
    sumRent = document.getElementById("sumRent");
    sumChores = document.getElementById("sumChores");
    sumRentOwner = document.getElementById("sumRentOwner");
    sumRoomates = document.getElementById("sumRoomates");
    submitLoginBtn = document.getElementById("submitLogin");
    boxes = Array.from(document.getElementsByClassName("sum"));
    changePwdBtn = document.getElementById('changePwd');

    if (submitLoginBtn) {
        submitLoginBtn.addEventListener('click', login);
    }


    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            boxes.forEach(box => {
                box.classList.remove('clicked');
                box.style.transform = '';
            });
        }
    });

    if (sumShop) sumShop.addEventListener("click", () => morph.call(sumShop, "html/shop.html"));
    if (sumRent) sumRent.addEventListener("click", () => morph.call(sumRent, "html/rent.html"));
    if (sumChores) sumChores.addEventListener("click", () => morph.call(sumChores, "html/chores.html"));
    if (sumExpenses) sumExpenses.addEventListener("click", () => morph.call(sumExpenses, "html/expenses.html"));
    if (sumRentOwner) sumRentOwner.addEventListener("click", function() { morph.call(sumRentOwner, "manage-rent.html"); });
    if (sumRoomates) sumRoomates.addEventListener("click", function() { morph.call(sumRoomates, "manage-roommates.html"); });

    if(logoutBtn) logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("user");
        window.location.href = "../html/login.html"
    })
    if(changePwdBtn) changePwdBtn.addEventListener('click', displayChangePwdForm)
}

function updateClock() {
    var tdy = new Date();
    const hourElement = document.getElementById('hour');
    if (hourElement) {
        hourElement.innerHTML = tdy.toLocaleTimeString();
    }
}

updateClock();
setInterval(updateClock, 1000);

async function getHelloWorld() {
    const url = getApiUrl("/api/test/1");
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Error from backend");
            return;
        }

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
}

async function login(event) {
    event?.preventDefault();
    const errorEl = document.getElementById("error");
    if (errorEl) errorEl.style.display = "none";

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
        if (errorEl) {
            errorEl.textContent = "Email cannot be empty or white space !";
            errorEl.style.display = "block";
        }
        return;
    }

    if (!password.trim()) {
        if (errorEl) {
            errorEl.textContent = "Password cannot be empty or white space !";
            errorEl.style.display = "block";
        }
        return;
    }

    try {
        const response = await fetch(getApiUrl('/api/user/login'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify({email, password})
        });

        if (!response.ok) {
            let errorText = await response.text();
            if (errorEl) {
                errorEl.textContent = errorText || "Invalid credentials";
                errorEl.style.display = "block";
            }
            return;
        }

        const result = await response.json();
        sessionStorage.setItem("user", JSON.stringify(result));

        if (result["role"] === "ROOMMATE") {
            window.location.href = "../index.html";
        } else {
            window.location.href = "owner.html";
        }
    } catch (err) {
        console.error(err);
        if (errorEl) {
            errorEl.textContent = "Server connection error.";
            errorEl.style.display = "block";
        }
    }
}


function morph(redirect) {
    if (this.classList.contains('clicked')) return;
    this.classList.add('clicked');

    const startRect = this.getBoundingClientRect();

    const targetLeft = 15;
    const targetTop = (window.innerHeight * 0.1) + 15;
    const targetWidth = window.innerWidth - 30;
    const targetHeight = (window.innerHeight - (window.innerHeight * 0.17)) - 30;

    const deltaX = targetLeft - startRect.left;
    const deltaY = targetTop - startRect.top;

    const scaleX = targetWidth / startRect.width;
    const scaleY = targetHeight / startRect.height;

    this.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;

    setTimeout(function() {
        location.href = redirect;
    }, 380);
}

function displayChangePwdForm() {
    if (document.getElementById("pwdOverlay")) return;

    const user = JSON.parse(sessionStorage.getItem("user") ?? "null");
    const isRoommate = user && user.role === "ROOMMATE";

    const overlay = document.createElement("div");
    overlay.id = "pwdOverlay";
    overlay.className = "modal-overlay open";

    overlay.innerHTML = `
        <div class="modal-card">
            <button type="button" class="close-btn" id="closePwdBtn">&times;</button>
            <span class="subtitle">Account</span>
            <h2 class="title">Change password</h2>

            ${!isRoommate
        ? `<p class="conditions">Only roommates can change their password here.</p>`
        : `<form id="pwdForm">
                       <div class="form-group">
                           <label for="oldPwd">Current password</label>
                           <input type="password" id="oldPwd" placeholder="••••••••" required>
                       </div>
                       <div class="form-group">
                           <label for="newPwd">New password</label>
                           <input type="password" id="newPwd" minlength="8" placeholder="At least 8 characters" required>
                       </div>
                       <div class="form-group">
                           <label for="confirmPwd">Confirm new password</label>
                           <input type="password" id="confirmPwd" minlength="8" placeholder="Repeat the new password" required>
                       </div>
                       <button type="submit" class="submit-btn" id="changePwdSubmit">Change password</button>
                       <p id="changePwdMessage"></p>
                   </form>`}
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    document.getElementById("closePwdBtn").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

    const form = document.getElementById("pwdForm");
    if (form) form.addEventListener("submit", (event) => resetRoommatePassword(event, user.email));
}

async function resetRoommatePassword(event, email) {
    event.preventDefault();

    const form = event.target;
    const oldPassword = document.getElementById("oldPwd").value;
    const newPassword = document.getElementById("newPwd").value;
    const confirmPassword = document.getElementById("confirmPwd").value;
    const messageEl = document.getElementById("changePwdMessage");
    const submitBtn = document.getElementById("changePwdSubmit");

    const showMessage = (text, isError) => {
        messageEl.textContent = text;
        messageEl.style.color = isError ? "red" : "green";
    };

    if (!newPassword.trim()) {
        showMessage("The new password cannot be empty or white space!", true);
        return;
    }
    if (newPassword !== confirmPassword) {
        showMessage("The new passwords do not match.", true);
        return;
    }
    if (newPassword === oldPassword) {
        showMessage("The new password must be different from the current one.", true);
        return;
    }

    submitBtn.disabled = true;
    try {
        const response = await fetch(getApiUrl("/api/user/newPassword"), {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, oldPassword, newPassword})
        });

        const text = await response.text(); // backend returns plain text

        if (response.ok) {
            showMessage(text || "The password has been reset!", false);
            form.reset();
        } else if (response.status === 404) {
            showMessage("User not found.", true);
        } else {
            showMessage(text || `Error ${response.status}`, true);
        }
    } catch (error) {
        console.error(error);
        showMessage("Server connection error.", true);
    } finally {
        submitBtn.disabled = false;
    }
}