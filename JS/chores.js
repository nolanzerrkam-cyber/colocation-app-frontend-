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

window.addEventListener('load', () => {
    filter = "todo";
    tasks = getTasks();
    applyFilter(filter);
})

function getTasks() {
    // TODO: retrieve from the backend
    return [
        {
            taskName: "task1",
            date: new Date(),
            isRecurring: false,
            assignee: "You",
            isDone: false
        },
        {
            taskName: "task2",
            date: new Date(),
            isRecurring: false,
            assignee: "You",
            isDone: true
        },
        {
            taskName: "task3",
            date: new Date(),
            isRecurring: false,
            assignee: "You",
            isDone: true
        }
    ]
}

function createTaskComponent(taskJson) {
    //taskName, date, isRecurring, assigneeName, isDone
    const task = document.createElement('div');
    task.classList.add('task');

    const taskDetails = document.createElement('div');

    const taskCheck = document.createElement('div');
    taskCheck.id = 'task-check';
    taskCheck.textContent = '✓';

    const taskContent = document.createElement('div');
    taskContent.id = 'task-content';

    const title = document.createElement('h3');
    title.textContent = taskJson.taskName;

    const taskTime = document.createElement('div');
    taskTime.className = 'task-time';

    const options = {weekday: 'long', hour: '2-digit', minute: '2-digit'};
    const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(taskJson.date);
    const pTime = document.createElement('p');
    pTime.textContent = formattedDate;

    const pRepeat = document.createElement('p');
    pRepeat.textContent = taskJson.isRecurring ? "Repeat" : "Does not repeat";

    taskTime.appendChild(pTime);
    taskTime.appendChild(pRepeat);
    taskContent.appendChild(title);
    taskContent.appendChild(taskTime);
    taskDetails.appendChild(taskCheck);
    taskDetails.appendChild(taskContent);

    const taskAssignment = document.createElement('div');
    taskAssignment.id = 'task-assignment';

    const avatar = document.createElement('div');
    avatar.textContent = taskJson.assignee.charAt(0);

    const pAssignee = document.createElement('p');
    pAssignee.textContent = taskJson.assignee;

    taskAssignment.appendChild(avatar);
    taskAssignment.appendChild(pAssignee);

    task.appendChild(taskDetails);
    task.appendChild(taskAssignment);

    if (taskJson.isDone) {
        task.classList.add("grey-filter")
        title.style.textDecoration = "line-through"
    }

    tasksList.appendChild(task)
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
    fetch('http://localhost:8080/api/task', {
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
    switch (filterName) {
        case 'todo':
            todoButton.classList.add("task-filter-selected")
            filteredTasks = tasks.filter(t => !t.isDone)
            break
        case 'mine':
            mineButton.classList.add("task-filter-selected")
            filteredTasks = tasks.filter(t => t.assignee === "You")
            break;
        case 'done':
            doneButton.classList.add("task-filter-selected")
            filteredTasks = tasks.filter(t => t.isDone)
            break;
    }

    displayTasksComponent(filteredTasks);
}

function displayTasksComponent(tasks) {
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