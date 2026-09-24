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