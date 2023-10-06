const express = require('express');
const app = express();
const port = 3060; // You can change the port as needed
const { Pool } = require('pg');

// Replace 'YOUR_CONNECTION_STRING' with your actual PostgreSQL connection string
const connectionString = 'postgres://juldtech:ZJamvr3shwaranxptqsCMGRL99czBiPs@dpg-ciu5a75gkuvoigfd1sj0-a.oregon-postgres.render.com/learnplatform?ssl=true';

// Create a connection pool
const pool = new Pool({
  connectionString: connectionString,
});

// Middleware to allow all forms of access (CORS)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Define SQL commands
const dropTableSQL = `DROP TABLE IF EXISTS content;`;
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS content (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );
`;

// Connect to the database and perform table operations
pool.connect()
  .then(client => {
    return client.query(dropTableSQL)
      .then(() => client.query(createTableSQL))
      .then(() => client.release())
      .catch(error => {
        console.error('Error creating table:', error);
        client.release();
      });
  })
  .catch(error => {
    console.error('Error connecting to PostgreSQL:', error);
  });

// GET request handler
app.get('/name', (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).send('Missing "name" parameter');
  }

  // Insert the provided name into the "content" table
  pool.query('INSERT INTO content (name) VALUES ($1) RETURNING id', [name])
    .then(result => {
      const lastInsertId = result.rows[0].id;
      res.send(String(lastInsertId));
    })
    .catch(error => {
      console.error('Error inserting data into PostgreSQL:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
