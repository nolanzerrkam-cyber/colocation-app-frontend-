let sumExpenses;
let sumShop;
let sumRent;
let sumChores;
let boxes;

onload = function()
{
    sumExpenses = document.getElementById("sumExpenses");
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
    sumShop.addEventListener("click", () => morph("shop.html", sumShop));
    sumRent.addEventListener("click",() => morph("rent.html", sumRent));
    sumChores.addEventListener("click", () => morph("chores.html", sumChores));
    sumPayement.addEventListener("click", () => morph("payement.html", sumPayement));
}

function updateClock()
{
    var tdy = new Date();
    document.getElementById('hour').innerHTML = tdy.toLocaleTimeString();
}

updateClock();
setInterval(updateClock, 1000);
async function getHelloWorld() {
    const url = "http://localhost:8080/api/test/1";
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

function morph(redirect, element) {
    if (element.classList.contains('clicked')) return;
    element.classList.add('clicked');

    const startRect = element.getBoundingClientRect();

    const targetLeft = 15;
    const targetTop = (window.innerHeight * 0.1) + 15;
    const targetWidth = window.innerWidth - 30;
    const targetHeight = (window.innerHeight - (window.innerHeight * 0.17)) - 30;

    const deltaX = targetLeft - startRect.left;
    const deltaY = targetTop - startRect.top;

    const scaleX = targetWidth / startRect.width;
    const scaleY = targetHeight / startRect.height;

    element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;

    setTimeout(function() {
        location.href = redirect;
    }, 380);
}