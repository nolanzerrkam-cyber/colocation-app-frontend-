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

    sumShop.addEventListener("click", shopMorph);
    sumRent.addEventListener("click", rentMorph);
    sumChores.addEventListener("click", choresMorph);
    sumPayement.addEventListener("click", payementMorph);
}

function updateClock()
{
    var tdy = new Date();
    document.getElementById('hour').innerHTML = tdy.toLocaleTimeString();
}

updateClock();
setInterval(updateClock, 1000);
async function getHelloWorld() {
    const url = "http://localhost:8080/api/test/2";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Error from backend")
            return;
        }

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
}

function payementMorph() {
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
        location.href = "payement.html";
    }, 380);
}
function choresMorph() {
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
        location.href = "chores.html";
    }, 380);
}

function shopMorph() {
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
        location.href = "shop.html";
    }, 380);
}

function rentMorph() {
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
        location.href = "rent.html";
    }, 380);
}