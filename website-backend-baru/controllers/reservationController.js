const asyncHandler = require('express-async-handler');
const Reservation = require('../models/Reservation');
const multer = require('multer');
const path = require('path');

// --- Konfigurasi Multer (Sudah Benar) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/proofs/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung! Hanya file gambar.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter,
});


// --- FUNGSI CONTROLLER YANG DIPERBAIKI ---

// @desc    Membuat reservasi baru
// @route   POST /api/reservations
// @access  Private
const createReservation = asyncHandler(async (req, res) => {
  const {
    nama,
    noHp,
    alamat,
    waktuReservasi,
    lamaReservasi,
    pilihanLapangan,
    metodePembayaran,
  } = req.body;

  // **PERBAIKAN KUNCI:** Periksa keberadaan req.user SEBELUM melanjutkan
  if (!req.user) {
    res.status(401); // Unauthorized
    throw new Error('Autentikasi gagal. Anda harus login untuk membuat reservasi.');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Bukti pembayaran wajib di-upload.');
  }

  // Validasi field lainnya
  if (!nama || !noHp || !alamat || !waktuReservasi || !lamaReservasi || !pilihanLapangan || !metodePembayaran) {
    res.status(400);
    throw new Error('Mohon lengkapi semua field yang wajib diisi.');
  }

  // Lakukan perhitungan totalHarga HANYA di backend untuk keamanan
  const HARGA_PER_JAM = 50000;
  const totalHargaDihitung = Number(lamaReservasi) * HARGA_PER_JAM;

  // Sekarang aman untuk membuat reservasi
  const reservation = await Reservation.create({
    nama,
    noHp,
    alamat,
    waktuReservasi,
    lamaReservasi: Number(lamaReservasi),
    pilihanLapangan,
    metodePembayaran,
    totalHarga: totalHargaDihitung,
    buktiPembayaran: req.file.path,
    user: req.user._id, // Aman untuk diakses karena sudah diperiksa
  });

  res.status(201).json({
    message: 'Reservasi berhasil dibuat dan sedang menunggu konfirmasi.',
    data: reservation,
  });
});

// @desc    Mendapatkan reservasi milik pengguna yang login
// @route   GET /api/reservations/myreservations
// @access  Private
const getMyReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(reservations);
});

// @desc    Mendapatkan semua data reservasi (untuk Admin)
// @route   GET /api/reservations
// @access  Private/Admin
const getReservations = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });
    res.status(200).json(reservations);
});

module.exports = {
  createReservation,
  getMyReservations,
  getReservations,
  upload,
};