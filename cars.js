const express = require('express');
const app = express();
const PORT = 3000;
const { faker } = require('@faker-js/faker');

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Generate fake car data
const carData = Array.from({ length: 50 }, () => ({
  make: faker.vehicle.manufacturer(),
  model: faker.vehicle.model(),
  year: faker.number.int({ min: 2000, max: 2024 }),
  miles: faker.number.int({ min: 0, max: 200000 }),
  price: faker.number.int({ min: 5000, max: 50000 }), // Fixed: actual price range
  distance: faker.number.int({ min: 1, max: 500 }), // miles away
}));

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Serve the HTML file at root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
const filterCars = (filters) => {
  let results = [...carData];
  const { make, model, year, miles, price, distance } = filters;

  if (make) results = results.filter(car => car.make.toLowerCase() === make.toLowerCase());
  if (model) results = results.filter(car => car.model.toLowerCase() === model.toLowerCase());
  if (year) results = results.filter(car => car.year == year);
  if (miles) results = results.filter(car => car.miles <= parseInt(miles));
  if (price) results = results.filter(car => car.price <= parseInt(price));
  if (distance) results = results.filter(car => car.distance <= parseInt(distance));

  return results;
};

// GET /api/cars endpoint with optional filters
app.get('/api/cars', (req, res) => {
  const results = filterCars(req.query);
  res.json({ count: results.length, data: results });
});

// POST /api/cars endpoint with filters in body
app.post('/api/cars', (req, res) => {
  const results = filterCars(req.body);
  res.json({ count: results.length, data: results });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚗 Car API running at http://localhost:${PORT}/api/cars`);
});