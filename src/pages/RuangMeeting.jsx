import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getBookings } from '../services/api';

const RuangMeeting = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings();
        setBookings(data);
      } catch (err) {
        setError('Gagal memuat data pemesanan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Pemesanan Ruangan</h1>
          <p className="text-sm text-gray-500">Ruang Meeting &gt; Daftar Pemesanan</p>
        </div>
        <Link to="/pesan-ruangan" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#4A8394] rounded-lg hover:bg-opacity-90 transition-colors">
          <Plus size={16} className="mr-2" />
          Pesan Ruangan
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruang Meeting</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peserta</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Konsumsi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Memuat data...</td></tr>
              ) : error ? (
                <tr><td colSpan="6" className="text-center py-4 text-red-500">{error}</td></tr>
              ) : bookings.length > 0 ? (
                bookings.map(booking => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{booking.unit_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{booking.room_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{new Date(booking.meeting_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{`${booking.start_time} - ${booking.end_time}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">{booking.participant_count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{Array.isArray(booking.consumption) ? booking.consumption.join(', ') : booking.consumption}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-4">Belum ada pemesanan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RuangMeeting;
