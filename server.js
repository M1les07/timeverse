const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Sample user data (replace with your actual data source or database)
const users = {
  'user1': { name: '', balance: 0, referralCode: 'ABC123' },
  'user2': { name: '', balance: 0, referralCode: 'XYZ456' },
  // Add more users as needed
};

// Serve static files from the 'public' directory
app.use(express.static('public'));

// API to get user data
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  const user = users[userId];
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
