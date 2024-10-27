const axios = require('axios');

const BOT_TOKEN = '7713345123:AAEHVY_vBsr3MR2L0teGLtemaUKLhF4L5oU';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;

async function getUserInfo() {
    try {
        const response = await axios.get(TELEGRAM_API_URL);
        const updates = response.data.result;
        // Process updates to extract user information
        // Example: return updates[0].message.from.username;
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

getUserInfo().then(userName => {
    // Send userName to your front-end, for example, using an API endpoint
});
