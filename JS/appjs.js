let sumPayement;
let sumShop;
let sumRent;
let sumChores;
let boxes;

onload = function()
{
    sumPayement = document.getElementById("sumPayement");
    sumShop = document.getElementById("sumShop");
    sumRent = document.getElementById("sumRent");
    sumChores = document.getElementById("sumChores");
    boxes = Array.from(document.getElementsByClassName("sum"));

    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            boxes.forEach(box => {
                box.classList.remove('clicked');
                box.style.transform = '';
            });
        }
    });

    // Visual transitions on click
    sumShop.addEventListener("click", function() { morph.call(this, "shop.html"); });
    sumRent.addEventListener("click", function() { morph.call(this, "rent.html"); });
    sumChores.addEventListener("click", function() { morph.call(this, "chores.html"); });
    sumPayement.addEventListener("click", function() { morph.call(this, "payement.html"); });
}

const list = document.getElementById('roommatesList');
const addBtn = document.getElementById('addRoommateBtn');

if(list)
{
    list.addEventListener('click', (e) => 
    {
        if (e.target.classList.contains('btn-delete')) 
        {
            e.target.closest('.roommate-item').remove();
        }
    });
}

if(addBtn)
{
    addBtn.addEventListener('click', () => 
    {
        const count = list.children.length + 1;
        const item = document.createElement('div');
        item.className = 'roommate-item';
        item.innerHTML = `
            <div class="roommate-info">
                <span class="roommate-name">Colocataire ${count}</span>
                <div class="roommate-details">Chambre 0${count} — email@exemple.com</div>
            </div>
            <button class="btn btn-delete">Supprimer</button>`;
        list.appendChild(item);
    });
}

function updateClock()
{
    var tdy = new Date();
    var hourElement = document.getElementById('hour');
    if (hourElement) {
        hourElement.innerHTML = tdy.toLocaleTimeString();
    }
}

updateClock();
setInterval(updateClock, 1000);


//Login
const submitLoginBtn = document.getElementById("submitLogin");

async function login(event)
{
    event?.preventDefault();
    document.getElementById("error").style.display = "none";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email)
    {
        alert("Email cannot be empty or only spaces");
        return;
    }

    if (!password.trim())
    {
        alert("Password cannot be empty or only spaces");
        return;
    }

        const response = await fetch('http://localhost:8080/api/user/login',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({email,password})
            });

        if (!response.ok)
        {
            let errorText = await response.text();
            let el = document.getElementById("error");
            el.textContent = errorText;
            el.style.display = "block";
        }

        const result = await response.json();
        sessionStorage.setItem("user", JSON.stringify(result));

        window.location.replace("owner.html");

}

submitLoginBtn.addEventListener('click',login);