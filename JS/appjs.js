let sumExpenses;
let sumShop;
let sumRent;
let sumChores;
let boxes;
let sumRentOwner;
let sumRoomates;
let submitLoginBtn

onload = function() {
    const currentUser = sessionStorage.getItem("user");
    if (!currentUser) {
        window.location.replace("login.html");
    }
    sumExpenses = document.getElementById("sumExpenses");
    sumShop = document.getElementById("sumShop");
    sumRent = document.getElementById("sumRent");
    sumChores = document.getElementById("sumChores");
    sumRentOwner = document.getElementById("sumRentOwner");
    sumRoomates = document.getElementById("sumRoomates");
    submitLoginBtn = document.getElementById("submitLogin");
    boxes = Array.from(document.getElementsByClassName("sum"));

    if (submitLoginBtn) {
        submitLoginBtn.addEventListener('click', login);
    }


    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            boxes.forEach(box => {
                box.classList.remove('clicked');
                box.style.transform = '';
            });
        }
    });

    if (sumShop) sumShop.addEventListener("click", () => morph.call(sumShop, "shop.html"));
    if (sumRent) sumRent.addEventListener("click", () => morph.call(sumRent, "rent.html"));
    if (sumChores) sumChores.addEventListener("click", () => morph.call(sumChores, "chores.html"));
    if (sumExpenses) sumExpenses.addEventListener("click", () => morph.call(sumExpenses, "expenses.html"));
    if (sumRentOwner) sumRentOwner.addEventListener("click", function() { morph.call(this, "manage-rent.html"); });
    if (sumRoomates) sumRoomates.addEventListener("click", function() { morph.call(this, "manage-roomates.html"); });
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
    const url = "http://localhost:8080/api/test/1";
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

const list = document.getElementById('roommatesList');
const addBtn = document.getElementById('addRoommateBtn');
const numberRoomates = document.getElementById('numberOfRoomates');

if (numberRoomates && list) {
    numberRoomates.innerHTML = list.children.length;
}

if (list) {
    list.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const errorSection = document.getElementById("error-section");
            if (list.children.length === 30 && errorSection) {
                errorSection.innerHTML = "";
            }
            e.target.closest('.roommate-item').remove();
            if (numberRoomates) {
                numberRoomates.innerHTML = list.children.length;
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
            if (numberRoomates) {
                numberRoomates.innerHTML = list.children.length;
            }
        }
    });
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
        const response = await fetch('http://localhost:8080/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email, password })
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
            window.location.replace("index.html");
        } else {
            window.location.replace("owner.html");
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
