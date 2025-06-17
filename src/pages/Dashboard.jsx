import { useState, useEffect } from 'react';
import { getSummaryBooking } from '../services/api';
import SummaryCard from '../components/SummaryCard';

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedData, setGroupedData] = useState({});
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await getSummaryBooking();
        setSummaryData(data);
        if (data && data.length > 0) {
          const availablePeriods = data.map(item => item.period);
          setPeriods(availablePeriods);
          setSelectedPeriod(availablePeriods[0]);
        }
      } catch (err) {
        setError('Gagal memuat data ringkasan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    if (!summaryData || summaryData.length === 0 || !selectedPeriod) {
      setGroupedData({});
      return;
    }

    const periodData = summaryData.find(p => p.period === selectedPeriod);
    const offices = periodData?.data || [];

    const flattenedData = offices.flatMap(office => 
      office.detailSummary.map(room => {
        const consumption = room.totalConsumption.reduce((acc, item) => {
          const key = item.name.replace(/\s+/g, '');
          acc[key] = parseInt(item.totalPackage, 10) || 0;
          acc.totalPrice = (acc.totalPrice || 0) + (parseInt(item.totalPrice, 10) || 0);
          return acc;
        }, {});

        return {
          id: `${office.officeName}-${room.roomName}`,
          unitInduk: office.officeName,
          namaRuangan: room.roomName,
          persentasePemakaian: parseFloat(room.averageOccupancyPerMonth) || 0,
          nominalKonsumsi: consumption.totalPrice || 0,
          snackSiang: consumption['SnackSiang'] || 0,
          makanSiang: consumption['MakanSiang'] || 0,
          snackSore: consumption['SnackSore'] || 0,
        };
      })
    );

    const groupByUnit = (data) => {
      return data.reduce((acc, room) => {
        const unit = room.unitInduk;
        if (!acc[unit]) {
          acc[unit] = [];
        }
        acc[unit].push(room);
        return acc;
      }, {});
    };

    setGroupedData(groupByUnit(flattenedData));
  }, [summaryData, selectedPeriod]);

  return (
    <div>
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="mb-6">
        <label htmlFor="periode" className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
        <select 
          id="periode" 
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          disabled={loading || periods.length === 0}
        >
          {periods.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {loading && <p>Memuat data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="space-y-8">
        {Object.entries(groupedData).map(([unit, rooms]) => (
          <div key={unit}>
            <div className="flex items-center mb-4">
              <img src="src/assets/vector.svg" alt="vector-icon" className="text-gray-500 mr-2"/>
              <h2 className="text-xl font-semibold text-gray-700">{unit}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <SummaryCard key={room.id} room={room} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
