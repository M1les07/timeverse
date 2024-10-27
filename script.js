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
    // Change the button text to "Claimed"
    const claimButton = document.getElementById('claimBonusButton');
    claimButton.innerText = "Claimed";
}
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

// Function to handle task completion
function completeTask(taskId, reward) {
    if (!tasksCompleted[taskId]) {
        earnings += reward;
        updateEarnings();
        tasksCompleted[taskId] = true;
        localStorage.setItem('tasksCompleted', JSON.stringify(tasksCompleted));
        alert(`Task completed! You've earned $${reward.toFixed(2)}`);
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

    // Task buttons with rewards (example rewards are given, adjust as necessary)
    document.getElementById('task1')?.addEventListener('click', () => completeTask('task1', 10)); // Example reward
    document.getElementById('task2')?.addEventListener('click', () => completeTask('task2', 20)); // Example reward
    document.getElementById('task3')?.addEventListener('click', () => completeTask('task3', 30)); // Example reward

    // Daily bonus button
    document.getElementById('claim-bonus')?.addEventListener('click', claimDailyBonus);
});

function completeTask(taskId, reward) {
    if (!tasksCompleted[taskId]) {
        earnings += reward;
        updateEarnings();
        tasksCompleted[taskId] = true;
        localStorage.setItem('tasksCompleted', JSON.stringify(tasksCompleted));
        alert(`Task completed! You've earned $${reward.toFixed(2)}`);

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

function loadSavedData() {
    // Existing code to load earnings, daily bonus, etc.

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

document.addEventListener('DOMContentLoaded', () => {
    // Copy referral code to clipboard
    const copyCodeButton = document.getElementById('copy-code-button');
    const referralCode = document.getElementById('referral-code').innerText;

    if (copyCodeButton) {
        copyCodeButton.addEventListener('click', () => {
            navigator.clipboard.writeText(referralCode).then(() => {
                alert('Referral code copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Load saved referral data
    let referralCount = parseInt(localStorage.getItem('referralCount')) || 0;
    let referralRewards = parseFloat(localStorage.getItem('referralRewards')) || 0;
    let userReferralCode = localStorage.getItem('userReferralCode') || generateReferralCode();

    // Update the UI with referral data
    document.getElementById('referral-count').textContent = referralCount;
    document.getElementById('referral-rewards').textContent = `$${referralRewards.toFixed(2)}`;
    document.getElementById('referral-code').textContent = userReferralCode;

    // Handle copy referral code button
    document.getElementById('copy-code').addEventListener('click', () => {
        navigator.clipboard.writeText(userReferralCode).then(() => {
            alert('Referral code copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });
});

// Function to generate a unique referral code
function generateReferralCode() {
    let code = 'REF' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    localStorage.setItem('userReferralCode', code);
    return code;
}

// Function to simulate a successful referral
function simulateReferral() {
    let referralCount = parseInt(localStorage.getItem('referralCount')) || 0;
    let referralRewards = parseFloat(localStorage.getItem('referralRewards')) || 0;

    referralCount += 1;
    referralRewards += 5.00; // Reward of 5 $TIME tokens per referral

    localStorage.setItem('referralCount', referralCount);
    localStorage.setItem('referralRewards', referralRewards);

    document.getElementById('referral-count').textContent = referralCount;
    document.getElementById('referral-rewards').textContent = `$${referralRewards.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ton-wallet').addEventListener('click', () => {
        window.open('https://ton.org/wallet', '_blank');
    });

    document.getElementById('telegram-wallet').addEventListener('click', () => {
        window.open('https://t.me/Theamazingtimeversebot', '_blank');
    });
});

document.getElementById('ton-wallet-button').addEventListener('click', function() {
    document.getElementById('wallet-linking-section').style.display = 'block';
  });
  
  document.getElementById('link-wallet-button').addEventListener('click', function() {
    var walletAddress = document.getElementById('ton-wallet-address').value;
    // Send the wallet address to the backend to link it with the user's account
    // Example using fetch:
    fetch('/link-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ walletAddress: walletAddress })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Wallet linked successfully!');
        window.location.href = '/referral'; // Redirect to the referral page
      } else {
        alert('Failed to link wallet. Please try again.');
      }
    });
  });
  
  // Function to generate a unique referral code if not already present
function generateReferralCode() {
    let userReferralCode = localStorage.getItem('userReferralCode');
    if (!userReferralCode) {
        userReferralCode = 'REF' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        localStorage.setItem('userReferralCode', userReferralCode);
    }
    return userReferralCode;
}

// Function to update the referral code on both the Home and Referral pages
function updateReferralCodeDisplay() {
    const userReferralCode = generateReferralCode(); // Ensure the referral code is generated or retrieved
    const referralCodeElements = document.querySelectorAll('#referral-code-home, #referral-code-referral'); // Adjust selectors to match IDs

    referralCodeElements.forEach(element => {
        if (element) element.textContent = userReferralCode;
    });
}

// Event listener to handle DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Call updateReferralCodeDisplay on both pages
    updateReferralCodeDisplay();

    // Other existing code for handling different features...

    // Example: Copy referral code to clipboard
    const copyCodeButton = document.getElementById('copy-code');
    if (copyCodeButton) {
        copyCodeButton.addEventListener('click', () => {
            const userReferralCode = localStorage.getItem('userReferralCode');
            navigator.clipboard.writeText(userReferralCode).then(() => {
                alert('Referral code copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // Existing code for task completion, daily bonus, etc.
});

// Example script.js to update user name
document.addEventListener('DOMContentLoaded', () => {
    // Replace this with your method to get the user's name
    const userName = localStorage.getItem('userName') || 'User';

    // Update the user name in the HTML
    document.getElementById('user-name').textContent = userName;

    // Additional code to update earnings and time online if needed
});

// Task Completion Logic
function completeTask(taskId, reward) {
    const taskElement = document.getElementById(`${taskId}-btn`);
    taskElement.innerText = `Task Completed - Earned ${reward} $TIME`;
    taskElement.classList.add('task-completed');
    taskElement.disabled = true; // Disable the button
}

// Event listeners for tasks
document.getElementById('task1-btn').addEventListener('click', () => {
    completeTask('task1', 10);
});

document.getElementById('task2-btn').addEventListener('click', () => {
    completeTask('task2', 20);
});

document.getElementById('task3-btn').addEventListener('click', () => {
    completeTask('task3', 30);
});

// Login Bonus Logic
let loginBonus = 50; // Starting Bonus
let lastClaimed = localStorage.getItem('lastClaimed') || null; // Last claimed timestamp

function claimBonus() {
    const now = new Date().getTime();
    const claimedToday = lastClaimed && (now - lastClaimed) < 24 * 60 * 60 * 1000; // Check if claimed today

    if (!claimedToday) {
        // Bonus Claim
        document.getElementById('daily-bonus').innerText = `$${loginBonus}.00`;
        document.getElementById('claim-bonus').innerText = 'Completed';
        document.getElementById('claim-bonus').disabled = true;
        localStorage.setItem('lastClaimed', now);

        // Prepare for next bonus
        loginBonus += 50; // Increase by $50 for next day
        if (loginBonus > 1000) loginBonus = 50; // Prevent it from increasing too high

    } else {
        alert("You've already claimed today's bonus!");
    }
}

function resetBonusIfMissed() {
    const now = new Date().getTime();
    const lastClaim = localStorage.getItem('lastClaimed');

    // Reset to $50 if 24 hours passed without claim
    if (lastClaim && (now - lastClaim) > 48 * 60 * 60 * 1000) {
        loginBonus = 50;
        localStorage.removeItem('lastClaimed');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    resetBonusIfMissed(); // Resets if missed a day
    document.getElementById('claim-bonus').addEventListener('click', claimBonus);
});

// Check if the Telegram WebApp is available
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;

    // Wait for the WebApp to be ready
    tg.ready();

    // Get the user's first name and username
    const firstName = tg.initDataUnsafe.user.first_name;
    const username = tg.initDataUnsafe.user.username;

    // Display the user's name on the webpage
    const userGreeting = document.getElementById('user-greeting');
    userGreeting.textContent = `Welcome, ${firstName || username}!`;

    // Example: Show the WebApp's theme color (optional)
    console.log(`WebApp color scheme: ${tg.colorScheme}`);
} else {
    console.error("Telegram WebApp API not available.");
}
