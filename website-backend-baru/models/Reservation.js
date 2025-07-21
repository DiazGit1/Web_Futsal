const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, 'Nama pemesan wajib diisi'],
    },
    noHp: {
      type: String,
      required: [true, 'Nomor HP wajib diisi'],
    },
    alamat: {
      type: String,
      required: [true, 'Alamat wajib diisi'],
    },
    waktuReservasi: {
      type: Date,
      required: [true, 'Waktu reservasi wajib diisi'],
    },
    lamaReservasi: {
      type: Number, // dalam jam
      required: [true, 'Durasi sewa wajib diisi'],
    },
    pilihanLapangan: {
      type: String,
      required: [true, 'Pilihan lapangan wajib diisi'],
      enum: ['A', 'B', 'C'], // Hanya menerima nilai ini
    },
    totalHarga: {
      type: Number,
      required: true,
    },
    metodePembayaran: {
      type: String,
      required: [true, 'Metode pembayaran wajib dipilih'],
      enum: ['Full', 'DP'],
    },
    buktiPembayaran: {
      type: String, // Path ke file gambar yang di-upload
      required: [true, 'Bukti pembayaran wajib di-upload'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
    user: { // Opsional: untuk melacak siapa yang memesan jika sistem memiliki user login
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);