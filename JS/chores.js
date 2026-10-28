import {getApiUrl} from "./api.js";

let filter; // todo, mine, done
let tasks; // list of tasks

const todoButton = document.getElementById('todo-filter');
todoButton.addEventListener('click', () => applyFilter('todo'));

const mineButton = document.getElementById('mine-filter');
mineButton.addEventListener('click', () => applyFilter('mine'));

const doneButton = document.getElementById('done-filter');
doneButton.addEventListener('click', () => applyFilter('done'));

const tasksList = document.getElementById('tasks-list');

const modalOverlay = document.getElementById('modalOverlay');
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay)
        closeModal();
});

const closeButton = document.getElementById("closeBtn");
closeButton.addEventListener('click', closeModal);

const addChore1 = document.getElementById("add-chore-1");
addChore1.addEventListener('click', openModal);

const addChore2 = document.getElementById("add-chore-2");
addChore2.addEventListener('click', openModal);

const choreForm = document.getElementById("choreForm");
choreForm.addEventListener('submit', handleSubmitForm)

const formGroupDate = document.getElementById('form-group-date');

const repeatSelect = document.getElementById('repeat');
repeatSelect.addEventListener('change', handleRepeatSelectChange);

const submitButton = document.getElementById("submit-button");

const notifier = document.getElementById("notifier");

const confirmDialog = document.getElementById('confirm-dialog');
const confirmMessage = document.getElementById('confirm-message');

//confirm delete chores
document.getElementById('confirm-ok')
    .addEventListener('click', () => confirmDialog.close('ok'));

document.getElementById('confirm-cancel')
    .addEventListener('click', () => confirmDialog.close('cancel'));
confirmDialog.addEventListener('click', (event) => {
    if (event.target === confirmDialog)
        confirmDialog.close('cancel');
});

window.addEventListener('load', async () => {
    filter = "todo";
    tasks = await getTasks();
    applyFilter(filter);
})

//getall task from backend to display
async function getTasks() {
    try
    {
        const response = await fetch(getApiUrl('/api/task'), {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }

        const tasks = await response.json();
        console.log(tasks);
        return tasks;
    }
    catch(Error)
    {
        console.warn("Error : " + Error)
    }
}

// ask for confirm to delete
function askConfirmation(message) {
    confirmMessage.textContent = message;
    confirmDialog.returnValue = '';
    confirmDialog.showModal();

    return new Promise(resolve => {
        confirmDialog.addEventListener('close',
            () => resolve(confirmDialog.returnValue === 'ok'),
            {once: true});
    });
}

//delete task
async function deleteTask(id) {
    if (!(await askConfirmation("Delete this task?")))
        return;

    try {
        const response = await fetch(getApiUrl(`/api/task/${id}`), {
            method: 'DELETE'
        });

        if (!response.ok)
            throw new Error(`Erreur HTTP ${response.status}`);

        tasks = tasks.filter(t => t.id !== id);
        applyFilter(filter);
    }
    catch (error) {
        console.warn("Error : " + error);
    }
}

//create the visuals for task
function createTaskComponent(taskJson) {
    const task = document.createElement('div');
    task.classList.add('task');

    const taskDetails = document.createElement('div');
    taskDetails.classList.add('task-details');

    const taskCheck = document.createElement('div');
    taskCheck.classList.add('task-check', taskJson.isDone ? 'task-check-done' : 'task-check-todo');
    taskCheck.textContent = taskJson.isDone ? '✓' : '✗';

    const taskContent = document.createElement('div');
    taskContent.classList.add('task-content');

    const title = document.createElement('h3');
    title.textContent = taskJson.name;

    const taskTime = document.createElement('div');
    taskTime.classList.add('task-time');

    const options = {weekday: 'long', hour: '2-digit', minute: '2-digit'};
    const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(taskJson.date);
    const pTime = document.createElement('p');
    pTime.textContent = formattedDate;

    const pRepeat = document.createElement('p');
    pRepeat.textContent = taskJson.isRecurring ? "Repeat" : "Does not repeat";

    taskTime.append(pTime, pRepeat);
    taskContent.append(title, taskTime);
    taskDetails.append(taskCheck, taskContent);

    const taskAssignment = document.createElement('div');
    taskAssignment.classList.add('task-assignment');

    const avatar = document.createElement('div');
    avatar.classList.add('task-avatar');
    avatar.textContent = taskJson.roommateFullName.charAt(0);

    const pAssignee = document.createElement('p');
    pAssignee.textContent = taskJson.roommateFullName;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('task-delete');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(taskJson.id));

    taskAssignment.append(avatar, pAssignee, deleteButton);
    task.append(taskDetails, taskAssignment);

    if (taskJson.isDone)
        task.classList.add('task-done', 'grey-filter');

    tasksList.appendChild(task);
}
// Remove all child of the tasks list div
function removeTasksComponent() {
    while (tasksList.firstChild)
        tasksList.removeChild(tasksList.lastChild)
}

function createSeparatorComponent() {
    const separator = document.createElement('hr');
    separator.classList.add('task-separator');
    tasksList.appendChild(separator)
}

function createTask(taskData) {
    fetch(getApiUrl('api/task'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "name": taskData.get("name"),
            "description": "",
            "isDone": "false",
            "deadline": taskData.get("date"),
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('Error: network error');
            choreForm.reset();
            setNotifier("Success: The task has been created.", false)
        })
        .catch(error =>
            setNotifier("Error: " + error, true));
}

async function createRecurringTask(taskData) {
    // TODO
}

function applyFilter(filterName) {
    filter = filterName

    // Remove the black background of the button
    for (let el of document.getElementsByClassName("task-filter"))
        el.classList.remove("task-filter-selected")

    let filteredTasks = [];
    //filter tasks by todo, mine and done
    switch (filterName) {

        case 'todo':
            todoButton.classList.add("task-filter-selected")
            filteredTasks = tasks.filter(t => !t.isDone)
            break
        case 'mine': {
            mineButton.classList.add("task-filter-selected");
            const user = JSON.parse(sessionStorage.getItem("user") ?? "null");
            const name = user ? `${user.firstname} ${user.lastname}` : "";
            filteredTasks = tasks.filter(t => t.roommateFullName === name);
            break;
        }
        case 'done':
            doneButton.classList.add("task-filter-selected")
            filteredTasks = tasks.filter(t => t.isDone)
            break;
    }

    displayTasksComponent(filteredTasks);
}

function displayTasksComponent(tasks)
{
    removeTasksComponent();

    const tasksLength = tasks.length;
    tasks.forEach((t, index) => {
        createTaskComponent(t)
        if (index !== tasksLength - 1)
            createSeparatorComponent()
    })
}

function handleSubmitForm(event) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(choreForm);
    const {isError, message} = validateInput(formData);

    if (isError) {
        setNotifier(message, true);
        setLoading(false);
        return;
    }

    if (formData.get("repeat") === "none")
        createTask(formData)

    setLoading(false);
}

function validateInput(formData) {
    let errorCounter = 0;
    let errorMessage = [];

    if (formData.get("name").length < 1) {
        errorMessage.push("The name is required")
        errorCounter++;
    }

    if (formData.get("repeat") === "none" && !formData.get("date")) {
        errorMessage.push("The date is required if the task is not repeating")
        errorCounter++;
    }

    return {
        isError: errorCounter > 0,
        message: "Error: " + errorMessage.join("\n")
    };
}

function handleRepeatSelectChange() {
    // Display date input in the form if "Doesn't repeat" is selected
    formGroupDate.style.display = repeatSelect.value === 'none' ? 'block' : 'none';
}

function openModal() {
    modalOverlay.style.display = 'flex';
}

function closeModal() {
    modalOverlay.style.display = 'none';
}

function setNotifier(message, isError) {
    notifier.innerText = message;
    notifier.style.color = isError ? "red" : "green";
}

function setLoading(isLoading) {
    if (isLoading) {
        submitButton.innerText = "Loading...";
        submitButton.disabled = true;
    } else {
        submitButton.innerText = "Create task";
        submitButton.disabled = false;
    }
}