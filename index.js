const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3060; // Define the port for your server

// Middleware to parse JSON data
app.use(bodyParser.json());

// Define a route to handle the JSON data sent from the Arduino GSM module
app.post('/data', (req, res) => {
  const jsonData = req.body; // JSON data sent in the request body

  // Handle the JSON data as needed (e.g., store it in a database)
  console.log('Received JSON data:', jsonData);

  // Send a response back to the Arduino module (optional)
  res.status(200).json({ message: 'Data received successfully' });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
