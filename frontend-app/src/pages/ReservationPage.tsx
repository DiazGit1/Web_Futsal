import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/ReservationForm.css';

// 1. Tipe data untuk error API yang lebih spesifik
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const ReservationPage: React.FC = () => {
  // State untuk setiap input form
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [waktuReservasi, setWaktuReservasi] = useState('');
  const [lamaReservasi, setLamaReservasi] = useState(1);
  const [pilihanLapangan, setPilihanLapangan] = useState('A');
  const [metodePembayaran, setMetodePembayaran] = useState('Full');
  const [buktiPembayaran, setBuktiPembayaran] = useState<File | null>(null);

  // State untuk loading dan error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Hitung total harga secara dinamis
  const HARGA_PER_JAM = 50000;
  const totalHarga = lamaReservasi * HARGA_PER_JAM;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBuktiPembayaran(e.target.files[0]);
    }
  };

  // 2. Menentukan tanggal minimum untuk input waktu (hari ini)
  const getTodayString = () => {
    const today = new Date();
    // Format YYYY-MM-DDTHH:MM
    return today.toISOString().substring(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buktiPembayaran) {
      setError('Bukti pembayaran wajib di-upload!');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('noHp', noHp);
    formData.append('alamat', alamat);
    formData.append('waktuReservasi', waktuReservasi);
    formData.append('lamaReservasi', lamaReservasi.toString());
    formData.append('pilihanLapangan', pilihanLapangan);
    formData.append('metodePembayaran', metodePembayaran);
    formData.append('totalHarga', totalHarga.toString()); // 3. Menambahkan totalHarga ke FormData
    formData.append('buktiPembayaran', buktiPembayaran);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Autentikasi tidak ditemukan. Silakan login kembali.');
        setLoading(false);
        return; // Hentikan proses jika tidak ada token
      }

      await api.post('/reservations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      alert('Reservasi berhasil dibuat! Menunggu konfirmasi dari admin.');
      navigate('/dashboard');
      
    } catch (err) {
      // Perbaikan penanganan error dengan tipe yang jelas
      const apiError = err as ApiError;
      const errorMessage = apiError.response?.data?.message || 'Terjadi kesalahan saat membuat reservasi.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="reservation-container">
        <h2>Formulir Reservasi Lapangan Futsal</h2>
        <form onSubmit={handleSubmit} className="reservation-form">
          {/* Gunakan grid untuk layout yang lebih rapi */}
          <div className="form-grid">
            {/* Grup untuk input yang memenuhi lebar penuh */}
            <div className="form-group full-width">
              <label htmlFor="nama">Nama Lengkap</label>
              <input id="nama" type="text" placeholder="Masukkan nama lengkap Anda" value={nama} onChange={(e) => setNama(e.target.value)} required />
            </div>

            <div className="form-group full-width">
              <label htmlFor="noHp">Nomor HP</label>
              <input id="noHp" type="tel" placeholder="Contoh: 081234567890" value={noHp} onChange={(e) => setNoHp(e.target.value)} required />
            </div>

            <div className="form-group full-width">
              <label htmlFor="alamat">Alamat</label>
              <textarea id="alamat" placeholder="Masukkan alamat lengkap Anda" value={alamat} onChange={(e) => setAlamat(e.target.value)} required />
            </div>

            {/* Grup untuk input 2 kolom */}
            <div className="form-group">
              <label htmlFor="waktuReservasi">Waktu Reservasi</label>
              <input id="waktuReservasi" type="datetime-local" value={waktuReservasi} min={getTodayString()} onChange={(e) => setWaktuReservasi(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="lamaReservasi">Lama Reservasi (Jam)</label>
              <input id="lamaReservasi" type="number" min="1" value={lamaReservasi} onChange={(e) => setLamaReservasi(Number(e.target.value))} required />
            </div>

            <div className="form-group">
              <label htmlFor="pilihanLapangan">Pilihan Lapangan</label>
              <select id="pilihanLapangan" value={pilihanLapangan} onChange={(e) => setPilihanLapangan(e.target.value)}>
                <option value="A">Lapangan A</option>
                <option value="B">Lapangan B</option>
                <option value="C">Lapangan C</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="metodePembayaran">Metode Pembayaran</label>
              <select id="metodePembayaran" value={metodePembayaran} onChange={(e) => setMetodePembayaran(e.target.value)}>
                <option value="Full">Bayar Full</option>
                <option value="DP">Bayar DP</option>
              </select>
            </div>
            
            <div className="form-group full-width total-harga">
              <strong>Total Harga: Rp {totalHarga.toLocaleString('id-ID')}</strong>
            </div>

            <div className="form-group full-width">
              <label>Upload Bukti Pembayaran</label>
              <div className="file-input-wrapper">
                <span className="file-name">{buktiPembayaran ? buktiPembayaran.name : 'Pilih file (JPG/PNG)...'}</span>
                <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} required />
              </div>
            </div>
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center', gridColumn: '1 / -1' }}>{error}</p>}
          
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Mengirim...' : 'Kirim Reservasi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationPage;