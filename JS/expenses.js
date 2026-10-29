import {getApiUrl} from "./api.js";

let expenses;
let totalRoomateExpense;

const expensesList = document.getElementById("expenses-list");
const total = document.getElementById("total-expenses");
const balance = document.getElementById("balance");

const addExpense = document.getElementById("add-expense");
addExpense.addEventListener('click', openModal);

const modalOverlay = document.getElementById('modalOverlay');
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay)
        closeModal();
});


const closeButton = document.getElementById("closeBtn");
closeButton.addEventListener('click', closeModal);

const expenseForm = document.getElementById("expenseForm");
expenseForm.addEventListener('submit', handleSubmitForm)

const submitButton = document.getElementById("submit-button");

const notifier = document.getElementById("notifier");

window.addEventListener('load', async () => {
    const currentUser = JSON.parse(sessionStorage.getItem('user')); // get user data from session
    if(!currentUser) {
        window.location.href = "login.html"
        return;
    }

    expenses = await getAllExpenses();
    totalRoomateExpense = await getBalance(currentUser.email)

    const totalAmount = expenses.totalExpense
    total.innerText = totalAmount + "€";

    balance.innerText = totalRoomateExpense + "€";

    displayExpenseComponent(expenses.expensesdto);
});

async function getBalance(currentUserEmail) {
    const url = getApiUrl("/api/expense/total?email=" + currentUserEmail);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Error from backend");
            return 0;
        }

        return response.json();
    } catch (error) {
        console.error(error.message);
        return 0;
    }
}

// TODO: implement a pagination system
async function getAllExpenses() {
    const url = getApiUrl("/api/expense");
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Error from backend");
            return {expenses: [], totalExpense: 0 };
        }

        return response.json();
    } catch (error) {
        console.error(error.message);
        return {expenses: [], totalExpense: 0 };    }
}

async function deleteExpense(expenseId) {
    const url = getApiUrl(`/api/expense/${expenseId}`);
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });
        if (!response.ok) {
            console.error("Error deleting expense from backend");
            return false;
        }
        return true;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

function createExpenseComponent(expenseJson) {
    console.log(expenseJson);
    const expense = document.createElement('div');
    expense.classList.add('expense');

    const expenseDetails = document.createElement('div');

    const expenseCheck = document.createElement('div');
    expenseCheck.classList.add('expense-check');
    expenseCheck.textContent = '💰';

    const expenseContent = document.createElement('div');
    expenseContent.classList.add('expense-content');

    const title = document.createElement('h3');
    title.textContent = expenseJson.label;

    const expenseSpender = document.createElement('div');
    expenseSpender.classList.add('expense-sender');

    const sender = document.createElement('p');
    sender.textContent = "Paid by " + expenseJson.firstname + " " + expenseJson.lastname;

    const pTime = document.createElement('p');
    pTime.textContent = expenseJson.date_expense;

    expenseSpender.appendChild(sender);
    expenseSpender.appendChild(pTime);
    expenseContent.appendChild(title);
    expenseContent.appendChild(expenseSpender);
    expenseDetails.appendChild(expenseCheck);
    expenseDetails.appendChild(expenseContent);

    const expenseAmount = document.createElement('div');
    expenseAmount.classList.add('expense-amount');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.classList.add("red-button");

    const amount = document.createElement('p');
    amount.textContent = expenseJson.price + '€';

    expenseAmount.appendChild(amount);

    deleteBtn.addEventListener('click', () => 
    {
        const modal = document.getElementById("deleteModal");
        const confirmBtn = document.getElementById("confirmDeleteBtn");
        const cancelBtn = document.getElementById("cancelDeleteBtn");

        modal.style.display = "flex";

        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
            modal.style.display = 'none';
            const success = await deleteExpense(expenseJson.id);
            if (success) {
                expenses = await getAllExpenses();
                displayExpenseComponent(expenses.expensesdto);
            }
        });
    });

    expenseAmount.appendChild(deleteBtn);

    expense.appendChild(expenseDetails);
    expense.appendChild(expenseAmount);

    expensesList.appendChild(expense);
}

// Remove all child of the tasks list div
function removeExpenseComponent() {
    while (expensesList.firstChild)
        expensesList.removeChild(expensesList.lastChild);
}

function createSeparatorComponent() {
    const separator = document.createElement('hr');
    separator.classList.add('expense-separator');
    expensesList.appendChild(separator);
}

function displayExpenseComponent(expenses) {
    removeExpenseComponent();

    const expensesLength = expenses.length;
    expenses.forEach((e, index) => {
        createExpenseComponent(e);
        if (index !== expensesLength - 1) {
            createSeparatorComponent();
        }
    });
}

function openModal() {
    modalOverlay.style.display = 'flex';
}

function closeModal() {
    modalOverlay.style.display = 'none';
}

function handleSubmitForm(event) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(expenseForm);
    const {isError, message} = validateInput(formData);

    if (isError) {
        setNotifier(message, true);
        setLoading(false);
        return;
    }

    createExpense(formData);

    setLoading(false);
}

// Persist a new expense in database through the API
function createExpense(expenseData) {
    const currentUserEmail = JSON.parse(sessionStorage.getItem("user")).email;

    if (!currentUserEmail)
        setNotifier("Error: user email is invalid", true);

    fetch('http://localhost:8080/api/expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "label": expenseData.get("name"),
            "price": expenseData.get("price"),
            "email": currentUserEmail,
            "dateExpense": expenseData.get("date"),
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('Error: network error');
            expenseForm.reset();
            setNotifier("Success: The expense has been created.", false)
        })
        .catch(error =>
            setNotifier("Error: " + error, true));
}

function validateInput(formData) {
    let errorCounter = 0;
    let errorMessage = [];

    if (!formData.get("name") || formData.get("name").length < 1) {
        errorMessage.push("The name is required")
        errorCounter++;
    }

    if (!formData.get("date")) {
        errorMessage.push("The date is required")
        errorCounter++;
    }

    if (!formData.get("price") || formData.get("price") <= 0) {
        errorMessage.push("A price greater than 0 is required")
        errorCounter++;
    }

    return {
        isError: errorCounter > 0,
        message: "Error: " + errorMessage.join("\n")
    };
}


// Display error message
function setNotifier(message, isError) {
    notifier.innerText = message;
    notifier.style.color = isError ? "red" : "green";
}

function setLoading(isLoading) {
    if (isLoading) {
        submitButton.innerText = "Loading...";
        submitButton.disabled = true;
    } else {
        submitButton.innerText = "Create expense";
        submitButton.disabled = false;
    }
}