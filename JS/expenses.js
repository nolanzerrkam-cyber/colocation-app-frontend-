import {getApiUrl} from "./api.js";

let expenses;

const expensesList = document.getElementById("expenses-list");
const total = document.getElementById("total-expenses");
const balance = document.getElementById("balance");

window.addEventListener('load', async () => {
    expenses = await getAllExpenses();
    const totalAmount = getTotalExpenses(expenses);
    total.innerText = totalAmount + "€";
    const balanceAmount = getBalance(expenses);
    balance.innerText = balanceAmount + "€";
    displayExpenseComponent(expenses);
});

// Calculate the total expenses amount of the colocation
function getTotalExpenses(expensesList) {
    let total = 0;
    expensesList.forEach(e => total += e.price);
    return total;
}

// To update the total balance and the total cost
function updateDashboard(expenseList) {
    const totalAmount = getTotalExpenses(expenseList);
    total.innerText = totalAmount + "€";
    const balanceAmount = getBalance(expenseList);
    balance.innerText = balanceAmount + "€";
}

// Calculate the balance of the current user based on expenses
function getBalance(expensesList) {
    const userSession = sessionStorage.getItem("user");
    const currentUser = userSession ? JSON.parse(userSession).email : "";
    let balance = 0;
    expensesList.filter(e => e.email === currentUser).forEach(e => balance += e.price);
    return balance;
}

// TODO: implement a pagination system
async function getAllExpenses() {
    const url = getApiUrl("/api/expense");
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

    const amount = document.createElement('p');
    amount.textContent = expenseJson.price + '€';

    expenseAmount.appendChild(amount);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.style.border = 'none';
    deleteBtn.style.backgroundColor = '#ffebee';
    deleteBtn.style.color = '#c62828';
    deleteBtn.style.padding = '6px 10px';
    deleteBtn.style.borderRadius = '4px';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.style.fontWeight = 'bold';

    deleteBtn.addEventListener('mouseenter', () => {
        deleteBtn.style.backgroundColor = '#ffcdd2';
    });
    deleteBtn.addEventListener('mouseleave', () => {
        deleteBtn.style.backgroundColor = '#ffebee';
    });

    deleteBtn.addEventListener('click', async () => 
    {
        if(confirm(`Are you sure you want to delete ${expenseJson.label} from the list of expense?`));
        {
            const success = await deleteExpense(expenseJson.id);
            if (success)
            {
                expenses = await getAllExpenses();
                updateDashboard(expenses);
                displayExpenseComponent(expenses);
            }
        }
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
