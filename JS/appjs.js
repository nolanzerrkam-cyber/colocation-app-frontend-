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

    sumPayement.addEventListener("click", function (){
        sumPayement.classList.add('clicked');

        setTimeout(function() {
            location.href = 'payement.html';
        }, 300);
    });
    sumShop.addEventListener("click", function (){
        sumShop.classList.add('clicked');

        setTimeout(function() {
            location.href = 'shop.html';
        }, 300);
    });
    sumRent.addEventListener("click", function (){
        sumRent.classList.add('clicked');

        setTimeout(function() {
            location.href = 'rent.html';
        }, 300);
    });
    sumChores.addEventListener("click", function (){
        sumChores.classList.add('clicked');

        setTimeout(function() {
            location.href = 'chores.html';
        }, 300);
    });

    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            boxes.forEach(box => {
                box.classList.remove('clicked');
            });
        }
    });
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