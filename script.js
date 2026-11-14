
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseCategoryInput = document.getElementById('expense-category');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseDateInput = document.getElementById('expense-date');
const expenseDescInput = document.getElementById('expense-desc');
const errorMessage = document.getElementById('error-message');

const totalAmountDisplay = document.getElementById('total-amount');
const totalCountDisplay = document.getElementById('total-count');
const expenseTableBody = document.getElementById('expense-table-body');
const noExpensesMessage = document.getElementById('no-expenses');
const filterCategoryInput = document.getElementById('filter-category');
const categorySummaryGrid = document.getElementById('category-summary-grid');


let expenses = JSON.parse(localStorage.getItem('expenses')) || [];


const categories = ['Food', 'Transportation', 'Shopping', 'Education', 'Entertainment', 'Healthcare', 'Bills', 'Others'];


expenseDateInput.valueAsDate = new Date();


expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    
    const name = expenseNameInput.value.trim();
    const category = expenseCategoryInput.value;
    const amount = parseFloat(expenseAmountInput.value);
    const date = expenseDateInput.value;
    const description = expenseDescInput.value.trim();

    if (!name) {
        showError('Please enter a valid expense name.');
        return;
    }
    if (!category) {
        showError('Please select a category.');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        showError('Please enter an amount greater than zero.');
        return;
    }
    if (!date) {
        showError('Please select a valid date.');
        return;
    }

    clearError();

    const newExpense = {
        id: Date.now(),
        name,
        category,
        amount,
        date,
        description
    };

    
    expenses.unshift(newExpense);

    
    saveAndRefresh();

    
    expenseForm.reset();
    expenseDateInput.valueAsDate = new Date();
});


function showError(message) {
    errorMessage.textContent = message;
}


function clearError() {
    errorMessage.textContent = '';
}


function saveAndRefresh() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderApp();
}


function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveAndRefresh();
}


function renderApp() {
    const selectedFilter = filterCategoryInput.value;
    
    
    const filteredExpenses = selectedFilter === 'All' 
        ? expenses 
        : expenses.filter(exp => exp.category === selectedFilter);

    
    expenseTableBody.innerHTML = '';
    if (filteredExpenses.length === 0) {
        noExpensesMessage.classList.remove('hidden');
    } else {
        noExpensesMessage.classList.add('hidden');
        filteredExpenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.date}</td>
                <td>
                    <strong>${escapeHTML(expense.name)}</strong>
                    ${expense.description ? `<br><small style="color: #6b7280;">${escapeHTML(expense.description)}</small>` : ''}
                </td>
                <td>${expense.category}</td>
                <td>₹${expense.amount.toFixed(2)}</td>
                <td><button class="btn-delete" onclick="deleteExpense(${expense.id})">Delete</button></td>
            `;
            expenseTableBody.appendChild(row);
        });
    }


    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    totalAmountDisplay.textContent = `₹${totalSpent.toFixed(2)}`;
    totalCountDisplay.textContent = expenses.length;

    
    renderCategorySummary();
}


function renderCategorySummary() {
    categorySummaryGrid.innerHTML = '';
    categories.forEach(cat => {
        const catTotal = expenses
            .filter(exp => exp.category === cat)
            .reduce((sum, exp) => sum + exp.amount, 0);

        const pill = document.createElement('div');
        pill.className = 'category-pill';
        pill.innerHTML = `
            <span>${cat}</span>
            <strong>₹${catTotal.toFixed(2)}</strong>
        `;
        categorySummaryGrid.appendChild(pill);
    });
}


function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}


filterCategoryInput.addEventListener('change', renderApp);


renderApp();