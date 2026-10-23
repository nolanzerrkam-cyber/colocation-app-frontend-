import {getApiUrl} from "./api.js";

const list = document.getElementById('roommatesList');
const addBtn = document.getElementById('addRoommateBtn');
const roommatesNumber = document.getElementById('roommatesNumber');

window.addEventListener('load', async () => {
    const roommatesList = await getAllRoommates();
    refreshRoommateComponents(roommatesList);
})

if (list) {
    list.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) {
            const errorSection = document.getElementById("error-section");
            if (list.children.length === 30 && errorSection) {
                errorSection.innerHTML = "";
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
            if (roommatesNumber) {
                roommatesNumber.innerHTML = list.children.length;
            }
        }
    });
}

/**
 * Remove old Roommate components and render them again
 * @param roommates - list of roommate [email, firstname, lastname, phonenumber]
 */
function refreshRoommateComponents(roommates) {
    removeRoommateComponents();
    roommates.forEach((r) => createRoommateComponent(r));
    roommatesNumber.innerText = `${list.children.length}`
}

/**
 * Create the roommate HTML UI element
 * @param roommate - [email, firstname, lastname, phonenumber]
 */
function createRoommateComponent(roommate) {
    const roommateComponent = document.createElement('div');
    roommateComponent.className = 'roommate-item';

    const info = document.createElement('div');
    info.className = 'roommate-info';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'roommate-name';
    nameSpan.textContent = `${roommate.firstname} ${roommate.lastname}`;

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'roommate-details';
    detailsDiv.textContent = roommate.email;

    info.appendChild(nameSpan);
    info.appendChild(detailsDiv);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-delete';
    deleteBtn.textContent = '- Delete';

    deleteBtn.addEventListener('click', () => deleteRoommate(roommate, roommateComponent));

    roommateComponent.appendChild(info);
    roommateComponent.appendChild(deleteBtn);

    list.append(roommateComponent);
}

/**
 * Remove each roommate component from the list
 */
function removeRoommateComponents() {
    while (list.firstChild)
        list.removeChild(list.lastChild)
}

/**
 * Retrieve all roommates from database
 * @returns {Promise<any|*[]>}
 */
async function getAllRoommates() {
    const url = getApiUrl("/api/roommate");
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Error from backend");
            return [];
        }

        return response.json();
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

/**
 * Remove the roommate component and remove the roommate from database
 * @param roommate - roommate
 * @param roommateComponent - roommate HTML component
 */
function deleteRoommate(roommate, roommateComponent) {
    roommateComponent.remove();
    // todo delete from db
    roommatesNumber.innerText = `${list.children.length}`
}