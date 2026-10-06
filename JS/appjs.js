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