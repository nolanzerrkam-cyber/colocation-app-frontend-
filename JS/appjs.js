let sumPayement;
let sumShop;
let sumRent;
let sumChores;
let boxes;
let sumRentOwner;
let sumRoomates;
let sumSupport;

onload = function()
{
    sumPayement = document.getElementById("sumPayement");
    sumShop = document.getElementById("sumShop");
    sumRent = document.getElementById("sumRent");
    sumChores = document.getElementById("sumChores");
    sumRentOwner = document.getElementById("sumRentOwner");
    sumRoomates = document.getElementById("sumRoomates");
    sumSupport = document.getElementById("sumSupport");
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
    // Change from the 6th october : since we use the same js file for everything, I had to put validation so the translation actually work on the owner page too.
    if (sumShop) sumShop.addEventListener("click", function() { morph.call(this, "shop.html"); });
    if (sumRent) sumRent.addEventListener("click", function() { morph.call(this, "rent.html"); });
    if (sumChores) sumChores.addEventListener("click", function() { morph.call(this, "chores.html"); });
    if (sumPayement) sumPayement.addEventListener("click", function() { morph.call(this, "payement.html"); });
    
    // Éléments de la page Owner
    if (sumRentOwner) sumRentOwner.addEventListener("click", function() { morph.call(this, "manage-rent.html"); });
    if (sumRoomates) sumRoomates.addEventListener("click", function() { morph.call(this, "manage-roomates.html"); });
    if (sumSupport) sumSupport.addEventListener("click", function() { morphCircle.call(this, "support.html"); });
}

const list = document.getElementById('roommatesList');
const addBtn = document.getElementById('addRoommateBtn');
const numberRoomates = document.getElementById('numberOfRoomates');

if(numberRoomates)
{
    numberRoomates.innerHTML = list.children.length;
}
if(list)
{
    list.addEventListener('click', (e) => 
    {
        if (e.target.classList.contains('btn-delete')) 
        {
            if(list.children.length === 30)
            {
                document.getElementById("error-section").innerHTML = "";
            }
            e.target.closest('.roommate-item').remove();
            numberRoomates.innerHTML = list.children.length;
        }
    });
}

if(addBtn)
{
    addBtn.addEventListener('click', () => 
    {
        const count = list.children.length + 1;
        if(count === 31)
        {
            const error = document.getElementById("error-section");
            error.innerHTML = "There are too much roomates on the shared home !";
        }
        else
        {
            const item = document.createElement('div');
            item.className = 'roommate-item';
            item.innerHTML = `
                <div class="roommate-info">
                    <span class="roommate-name">Roomate n°${count}</span>
                    <div class="roommate-details">Room n°${count} — email@exemple.com</div>
                </div>
                <button class="btn btn-delete">- Delete</button>`;
            list.appendChild(item);
            numberRoomates.innerHTML = list.children.length;
        }
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

// This method is used to do the animation, when click on the button support on owner.html.
function morphCircle(redirect) 
{
    if (this.classList.contains('clicked')) return;
    this.classList.add('clicked');

    // I need to calculate the space that I need on the screen
    const maxDimension = Math.max(window.innerWidth, window.innerHeight);
    const scaleFactor = (maxDimension * 0.5) / this.offsetWidth;

    this.style.borderColor = "transparent";

    // then i put the correct format for the animation
    this.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;

    setTimeout(() => {
        location.href = redirect;
    }, 380);
}