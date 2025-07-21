const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // Agar bisa menerima body JSON
app.use(express.urlencoded({ extended: true })); // Penting untuk menerima data form

app.get('/', (req, res) => {
  res.send('API sedang berjalan...');
});

// Gunakan rute user
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);

// Gunakan middleware error
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server berjalan di port ${PORT}`));