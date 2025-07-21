import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';

// 1. Definisikan tipe data untuk objek reservasi
interface IReservation {
  _id: string;
  pilihanLapangan: string;
  waktuReservasi: string;
  lamaReservasi: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  // 2. Buat state untuk menampung data reservasi
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Gunakan useEffect untuk mengambil data saat komponen dimuat
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/reservations/myreservations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReservations(data);
      } catch (err) {
        setError('Gagal memuat data reservasi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []); // Array kosong berarti efek ini hanya berjalan sekali

  const handleNewReservation = () => navigate('/reservasi');

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div>
      <Header />
      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Selamat Datang di Dashboard Anda!</h2>
          <p>Atur semua kebutuhan reservasi Anda di sini dengan mudah.</p>
          <button className="reserve-button" onClick={handleNewReservation}>
            Buat Reservasi Baru
          </button>
        </div>

        <div className="reservation-list">
          <h3>Riwayat Reservasi Anda</h3>
          {loading && <p>Memuat data...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            <table className="reservation-table">
              <thead>
                <tr>
                  <th>Lapangan</th>
                  <th>Waktu Reservasi</th>
                  <th>Durasi</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length > 0 ? (
                  reservations.map((item) => (
                    <tr key={item._id}>
                      <td>Lapangan {item.pilihanLapangan}</td>
                      <td>{formatDate(item.waktuReservasi)}</td>
                      <td>{item.lamaReservasi} jam</td>
                      <td>
                        <span className={`status-badge status-${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center' }}>
                      Anda belum memiliki reservasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;