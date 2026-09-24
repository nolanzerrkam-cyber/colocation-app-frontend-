function updateClock()
{
    var tdy = new Date();
    document.getElementById('hour').innerHTML = tdy.toLocaleTimeString();
}

updateClock();
setInterval(updateClock, 1000);