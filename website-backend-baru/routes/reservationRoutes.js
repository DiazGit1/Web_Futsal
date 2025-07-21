const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getReservations,
  upload // Impor middleware upload dari controller
} = require('../controllers/reservationController');

const { protect, admin } = require('../middleware/authMiddleware'); // (Opsional) Jika perlu proteksi

// Rute untuk membuat reservasi baru
// Middleware 'upload.single('buktiPembayaran')' akan menangani upload 1 file
// dari field form yang bernama 'buktiPembayaran'
router.post('/', protect, upload.single('buktiPembayaran'), createReservation);

// Rute untuk mendapatkan reservasi milik pengguna yang login
router.get('/myreservations', protect, getMyReservations);

// Rute untuk melihat semua reservasi (contoh: hanya bisa diakses admin)
// router.get('/', protect, admin, getReservations);
router.get('/', getReservations); // Untuk sementara kita buat publik

module.exports = router;