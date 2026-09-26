function updateClock() {
    var tdy = new Date();
    var hourElement = document.getElementById('hour');
    if (hourElement) {
        hourElement.innerHTML = tdy.toLocaleTimeString();
    }
}

updateClock();
setInterval(updateClock, 1000);

const list = document.getElementById('roommatesList');
const addBtn = document.getElementById('addRoommateBtn');

list.addEventListener('click', (e) => 
{
    if (e.target.classList.contains('btn-delete')) 
    {
        e.target.closest('.roommate-item').remove();
    }
});

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