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
    displayExpenseComponent(expenses)
});

// Calculate the total expenses amount of the colocation
function getTotalExpenses(expensesList) {
    let total = 0;
    expensesList.forEach(e => total += e.price);
    return total;
}

// Calculate the balance of the current user based on expenses
function getBalance(expensesList) {
    const currentUser = "test@test.com"; // TODO get current user email
    let balance = 0;
    expensesList.filter(e => e.coloc === currentUser).forEach(e => balance += e.price); // TODO update
    return balance;
}

// TODO: implement a pagination system
async function getAllExpenses() {
    const url = "http://localhost:8080/api/expense";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Error from backend")
            return;
        }

        return response.json();
    } catch (error) {
        console.error(error.message);
        return []
    }
}

function createExpenseComponent(expenseJson) {
    const expense = document.createElement('div');
    expense.classList.add('expense');

    const expenseDetails = document.createElement('div');

    const expenseCheck = document.createElement('div');
    expenseCheck.classList.add('expense-check');
    expenseCheck.textContent = '💰';

    const expenseContent = document.createElement('div');
    expenseContent.classList.add('expense-content');

    const title = document.createElement('h3');
    title.textContent = expenseJson.libele; // TODO update

    const expenseSpender = document.createElement('div');
    expenseSpender.classList.add('expense-sender');

    const sender = document.createElement('p');
    sender.textContent = "Paid by " + expenseJson.coloc; // TODO update

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
    amount.textContent = expenseJson.price+'€';

    expenseAmount.appendChild(amount);

    expense.appendChild(expenseDetails);
    expense.appendChild(expenseAmount);

    expensesList.appendChild(expense)
}

// Remove all child of the tasks list div
function removeExpenseComponent() {
    while (expensesList.firstChild)
        expensesList.removeChild(expensesList.lastChild)
}

function createSeparatorComponent() {
    const separator = document.createElement('hr');
    separator.classList.add('expense-separator');
    expensesList.appendChild(separator)
}

function displayExpenseComponent(expenses) {
    removeExpenseComponent();

    const expensesLength = expenses.length;
    expenses.forEach((e, index) => {
        createExpenseComponent(e)
        if (index !== expensesLength - 1)
            createSeparatorComponent()
    })
}