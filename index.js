const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3881; // You can change the port as needed

// Create a connection pool for PostgreSQL using the environment variable
const pool = new Pool({
  connectionString: "postgres://juldtech:ZJamvr3shwaranxptqsCMGRL99czBiPs@dpg-ciu5a75gkuvoigfd1sj0-a.oregon-postgres.render.com/learnplatform?ssl=true",
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a table if it doesn't already exist
async function createTableIfNotExists() {
  const createTableQuery = `
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sensor_data') THEN
        CREATE TABLE sensor_data (
          id SERIAL PRIMARY KEY,
          pm1 NUMERIC,
          pm2_5 NUMERIC,
          pm10 NUMERIC,
          temperature NUMERIC,
          pressure NUMERIC,
          humidity NUMERIC,
          gas NUMERIC,
          altitude NUMERIC,
          lux NUMERIC,
          sound INT,
          ultraviolet INT,
          battery_level INT,
          timestamp BIGINT
        );
      END IF;
    END $$;
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

createTableIfNotExists();

// Handle POST requests to store JSON data in the database
// app.post('/storeData', async (req, res) => {
//   try {
//     const data = req.body;
//     const insertQuery = `
//       INSERT INTO sensor_data (pm1, pm2_5, pm10, temperature, pressure, humidity, gas, altitude, lux, sound, ultraviolet, battery_level, timestamp)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
//     `;
//     const values = [
//       data.PM1,
//       data.PM2_5,
//       data.PM10,
//       data.Temperature,
//       data.Pressure,
//       data.Humidity,
//       data.Gas,
//       data.Altitude,
//       data.Lux,
//       data.Sound,
//       data.Ultraviolet,
//       data.Batterylevel,
//       data.timestamp,
//     ];

//     await pool.query(insertQuery, values);
//     res.status(200).json({ message: 'Data stored successfully' });
//   } catch (error) {
//     console.error('Error storing data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


app.get('/storeData', async (req, res) => {
    try {
      // Extract data from query parameters
      const {
        temperature,
        humidity,
        pressure,
        altitude,
        gas,
        lux,
        ultraviolet,
        pm1,
        pm25,
        pm10,
        battery,
        sound,
        timestamp,
      } = req.query;
  
      // Check if any of the parameters are missing or invalid
      if (
        !temperature ||
        !humidity ||
        !pressure ||
        !altitude ||
        !gas ||
        !lux ||
        !ultraviolet ||
        !pm1 ||
        !pm25 ||
        !pm10 ||
        !battery ||
        !sound ||
        !timestamp
      ) {
        return res.status(400).json({ error: 'Invalid sensor data' });
      }
  
      // Insert data into the PostgreSQL database
      const insertQuery = `
        INSERT INTO sensor_data (
          temperature, humidity, pressure, altitude, gas, lux,
          ultraviolet, pm1, pm25, pm10, battery, sound, timestamp
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `;
      const values = [
        temperature,
        humidity,
        pressure,
        altitude,
        gas,
        lux,
        ultraviolet,
        pm1,
        pm25,
        pm10,
        battery,
        sound,
        timestamp,
      ];
  
      await pool.query(insertQuery, values);
  
      // You can optionally send the data to another service
      // Example: Send data to an external URL using Axios
    //   const externalUrl = 'https://example.com/storeData'; // Replace with the actual URL
    //   const response = await axios.get(externalUrl, {
    //     params: req.query, // Send the same query parameters to the external URL
    //   });
  
      res.status(200).json({ message: 'Data stored successfully' });
    } catch (error) {
      console.error('Error storing data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// Handle GET request to retrieve all sensor data
app.get('/getAllSensorData', async (req, res) => {
  try {
    const selectQuery = 'SELECT * FROM sensor_data';
    const { rows } = await pool.query(selectQuery);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/clearData', async (req, res) => {
    try {
      const deleteQuery = 'DELETE FROM sensor_data';
      await pool.query(deleteQuery);
      res.status(200).json({ message: 'Database cleared successfully' });
    } catch (error) {
      console.error('Error clearing data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Handle GET request to retrieve the latest sensor data
app.get('/getLatestSensorData', async (req, res) => {
    try {
      const selectLatestQuery = 'SELECT * FROM sensor_data ORDER BY timestamp ASC LIMIT 1';
      const { rows } = await pool.query(selectLatestQuery);
      res.status(200).json(rows[0] || {}); // Return the latest data or an empty object
    } catch (error) {
      console.error('Error retrieving latest data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
