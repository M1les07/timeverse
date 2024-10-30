// Global Variables
let earnings = parseFloat(localStorage.getItem('earnings')) || 0;
let startTime = null;
let timerInterval = null;
let dailyBonusAmount = parseFloat(localStorage.getItem('dailyBonusAmount')) || 50;
let lastLoginDate = localStorage.getItem('lastLoginDate') || null;
let tasksCompleted = JSON.parse(localStorage.getItem('tasksCompleted')) || { task1: false, task2: false, task3: false };

// Function to update the earnings display
function updateEarnings() {
    const earningsElements = document.querySelectorAll('#earnings, #earnings-tasks');
    earningsElements.forEach(element => {
        if (element) element.textContent = `$${earnings.toFixed(2)}`;
    });
    localStorage.setItem('earnings', earnings.toFixed(2));
}

// Function to update the daily bonus display
function updateDailyBonusAmount() {
    const dailyBonusElement = document.getElementById('daily-bonus-amount');
    if (dailyBonusElement) dailyBonusElement.textContent = `$${dailyBonusAmount.toFixed(2)}`;
}

// Function to claim daily bonus
function claimBonus() {
    const claimButton = document.getElementById('claimBonusButton');
    claimButton.innerText = "Claimed";
    const today = new Date().toISOString().split('T')[0];
    
    if (lastLoginDate !== today) {
        earnings += dailyBonusAmount;
        updateEarnings();
        dailyBonusAmount += 50; // Increment for the next day
        updateDailyBonusAmount();
        lastLoginDate = today;
        localStorage.setItem('lastLoginDate', lastLoginDate);
        localStorage.setItem('dailyBonusAmount', dailyBonusAmount);
        // alert(`You've received your daily bonus of $${dailyBonusAmount.toFixed(2)}!`);
    } else {
        // alert("You've already claimed your daily bonus today. Come back tomorrow!");
    }
}

// Function to handle task completion
function completeTask(taskId, reward, taskUrl) {
    if (!tasksCompleted[taskId]) {
        earnings += reward;
        updateEarnings();
        tasksCompleted[taskId] = true;
        localStorage.setItem('tasksCompleted', JSON.stringify(tasksCompleted));
        alert(`Task completed! You've earned $${reward.toFixed(2)}`);

        // Navigate to the task URL
        window.location.href = taskUrl;

        // Update the task item to indicate it's completed
        const taskElement = document.getElementById(taskId);
        if (taskElement) {
            taskElement.classList.add('completed');
            const button = taskElement.querySelector('button');
            if (button) {
                button.disabled = true;
                button.textContent = 'Completed';
            }
        }
    } else {
        alert("Task already completed!");
    }
}

// Function to load saved data
function loadSavedData() {
    const savedEarnings = localStorage.getItem('earnings');
    const savedDailyBonusAmount = localStorage.getItem('dailyBonusAmount');
    const savedLastLoginDate = localStorage.getItem('lastLoginDate');
    const savedTasksCompleted = localStorage.getItem('tasksCompleted');

    if (savedEarnings) earnings = parseFloat(savedEarnings);
    if (savedDailyBonusAmount) dailyBonusAmount = parseFloat(savedDailyBonusAmount);
    if (savedLastLoginDate) lastLoginDate = savedLastLoginDate;
    if (savedTasksCompleted) tasksCompleted = JSON.parse(savedTasksCompleted);

    updateEarnings();
    updateDailyBonusAmount();

    // Update the UI for completed tasks
    Object.keys(tasksCompleted).forEach(taskId => {
        if (tasksCompleted[taskId]) {
            const taskElement = document.getElementById(taskId);
            if (taskElement) {
                taskElement.classList.add('completed');
                const button = taskElement.querySelector('button');
                if (button) {
                    button.disabled = true;
                    button.textContent = 'Completed';
                }
            }
        }
    });
}

// Function to update the time spent online
function updateTimeOnline() {
    if (startTime) {
        const timeSpentElement = document.getElementById('time-spent');
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - startTime;
        const seconds = Math.floor(timeDifference / 1000);
        if (timeSpentElement) timeSpentElement.textContent = `${seconds}s`;
    }
}

// Start timer function
function startTimer() {
    if (!timerInterval) {
        startTime = new Date().getTime();
        timerInterval = setInterval(() => {
            earnings += 0.01; // Increment earnings by $0.01 per second
            updateEarnings();
            updateTimeOnline();
        }, 1000);
    }
}

// Navigation function
function navigateTo(url) {
    window.location.href = url;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load initial earnings and time online
    loadSavedData();
    updateEarnings();
    updateTimeOnline();

    // Set up start button click event
    document.getElementById('start-button')?.addEventListener('click', startTimer);

    // Navigation buttons
    document.getElementById('home')?.addEventListener('click', () => navigateTo('index.html'));
    document.getElementById('tasks')?.addEventListener('click', () => navigateTo('tasks.html'));
    document.getElementById('referral')?.addEventListener('click', () => navigateTo('referral.html'));
    document.getElementById('wallet')?.addEventListener('click', () => navigateTo('wallet.html'));

    // Task buttons with specified rewards and URLs
    document.getElementById('task1')?.addEventListener('click', () => completeTask('task1', 50, 'https://x.com/Timeverse_earn')); // Reward for task 1
    document.getElementById('task2')?.addEventListener('click', () => completeTask('task2', 70, 'https://t.me/timeverse_coin')); // Reward for task 2
    document.getElementById('task3')?.addEventListener('click', () => completeTask('task3', 150, '"https://www.youtube.com/@Timeverse-official')); // Reward for task 3

    // Daily bonus button
    document.getElementById('claim-bonus')?.addEventListener('click', claimBonus);
});

// Example MetaMask connection functionality
document.getElementById('connect-metamask')?.addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = accounts[0];

            // Display the user's wallet address
            document.getElementById('wallet-address').textContent = userAddress;
            localStorage.setItem('userWallet', userAddress);
        } catch (error) {
            console.error('User denied account access or other error', error);
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this feature.');
    }
});

// Load wallet address from localStorage if already connected
document.addEventListener('DOMContentLoaded', () => {
    const savedAddress = localStorage.getItem('userWallet');
    if (savedAddress) {
        document.getElementById('wallet-address').textContent = savedAddress;
    }
});

// MetaMask Connection Function
async function connectMetaMask() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];

            // Store the wallet address and update display
            localStorage.setItem('walletAddress', walletAddress);
            alert(`MetaMask Wallet Connected: ${walletAddress}`);

            // Update UI to show as "Linked"
            const metaMaskButton = document.getElementById('connect-metamask');
            metaMaskButton.textContent = "MetaMask Linked";
            metaMaskButton.disabled = true;
        } catch (error) {
            console.error("User rejected connection or an error occurred:", error);
        }
    } else {
        alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
}

// Event listener for the new MetaMask button
document.getElementById('connect-metamask').addEventListener('click', connectMetaMask);
