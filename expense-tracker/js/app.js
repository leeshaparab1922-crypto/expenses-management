/**
 * app.js
 * Main Application Controller
 */
import { Store } from './store.js';
import { Auth } from './auth.js';
import { Storage } from './storage.js';
import { LoginUI } from './login.js';

const App = {
    init: () => {
        // Initialize UI Modules
        LoginUI.init();
        Auth.init();

        // Subscribe to Store changes
        Store.subscribe(App.render);

        // Setup Dashboard Events
        App.setupEvents();

        // Initial Render
        App.render(Store.getState());
    },

    setupEvents: () => {
        const logoutBtn = document.getElementById('logout-btn');
        const expenseForm = document.getElementById('expense-form');

        logoutBtn.addEventListener('click', () => Auth.logout());

        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const desc = document.getElementById('expense-desc').value;
            const amount = parseFloat(document.getElementById('expense-amount').value);
            const category = document.getElementById('expense-category').value;
            const date = document.getElementById('expense-date').value;

            App.addExpense({ desc, amount, category, date, id: Date.now() });
            expenseForm.reset();
        });
    },

    addExpense: (expense) => {
        const { currentUser, expenses } = Store.getState();
        const updatedExpenses = [expense, ...expenses];
        
        Storage.saveExpenses(currentUser.id, updatedExpenses);
        Store.setState({ expenses: updatedExpenses });
    },

    deleteExpense: (id) => {
        const { currentUser, expenses } = Store.getState();
        const updatedExpenses = expenses.filter(e => e.id !== id);
        
        Storage.saveExpenses(currentUser.id, updatedExpenses);
        Store.setState({ expenses: updatedExpenses });
    },

    render: (state) => {
        const authContainer = document.getElementById('auth-container');
        const dashboardContainer = document.getElementById('dashboard-container');
        const userDisplay = document.getElementById('user-display');

        if (state.view === 'auth') {
            authContainer.classList.remove('hidden');
            dashboardContainer.classList.add('hidden');
        } else {
            authContainer.classList.add('hidden');
            dashboardContainer.classList.remove('hidden');
            userDisplay.innerText = state.currentUser.email;
            App.renderExpenses(state.expenses);
            App.updateTotal(state.expenses);
        }
    },

    renderExpenses: (expenses) => {
        const list = document.getElementById('expense-list');
        list.innerHTML = expenses.map(e => `
            <li class="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                <div class="flex items-center">
                    <div class="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
                        <svg class="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 8V7m0 1v1m0 0H11m1 0h1m-1 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-indigo-600">${e.desc}</p>
                        <p class="text-xs text-gray-500">${e.category} • ${e.date}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-sm font-bold text-gray-900">$${e.amount.toFixed(2)}</span>
                    <button onclick="window.deleteExpense(${e.id})" class="text-red-400 hover:text-red-600">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </li>
        `).join('');

        // Expose delete to window for the onclick handler
        window.deleteExpense = (id) => App.deleteExpense(id);
    },

    updateTotal: (expenses) => {
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
        document.getElementById('total-balance').innerText = `$${total.toFixed(2)}`;
    }
};

// Start the app
App.init();
