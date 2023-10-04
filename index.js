const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3060; // Define the port for your server

// Middleware to parse JSON data
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Define a route to handle the JSON data sent from the Arduino GSM module
app.post('/data', (req, res) => {
  const jsonData = req.body; // JSON data sent in the request body

  // Handle the JSON data as needed (e.g., store it in a database)
  console.log('Received JSON data:', jsonData);

  // Send a response back to the Arduino module (optional)
  res.status(200).json({ message: 'Data received successfully' });
});

app.get('/sensor', (req, res) => {
  const receivedData = req.query; // This will contain the data from the GET request parameters

  // You can use the receivedData object in your application logic if needed
  // For demonstration purposes, we're sending it back as a JSON response
  res.json(receivedData);
  console.log(receivedData)
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
