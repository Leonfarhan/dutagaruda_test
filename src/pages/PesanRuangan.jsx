import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import {
  fetchMasterData,
  submitBooking,
  updateFormData,
  resetForm,
  selectFormData,
  selectMasterData,
  selectStatus,
  selectSubmissionStatus,
  selectFilteredRooms,
  selectRoomCapacity,
  selectConsumptionData,
  selectFormErrors,
} from '../features/booking/bookingSlice';

import Input from '../components/Input';
import Select from '../components/Select';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import CircularProgress from '../components/CircularProgress';

const PesanRuangan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State from Redux
  const formData = useSelector(selectFormData);
  const { units: masterUnit, rooms: masterRooms, konsumsi: masterKonsumsi } = useSelector(selectMasterData);
  const dataStatus = useSelector(selectStatus);
  const submissionStatus = useSelector(selectSubmissionStatus);

  // Derived data from Redux
  const filteredRooms = useSelector(selectFilteredRooms);
  const kapasitas = useSelector(selectRoomCapacity);
  const { selectedKonsumsi, nominalKonsumsi } = useSelector(selectConsumptionData);
  const validationErrors = useSelector(selectFormErrors);
  
  // Local state for submission-specific errors
  const [submissionErrors, setSubmissionErrors] = useState({});

  // Fetch master data on component mount
  useEffect(() => {
    if (dataStatus === 'idle') {
      dispatch(fetchMasterData());
    }
  }, [dataStatus, dispatch]);
  
  useEffect(() => {
    if (submissionStatus === 'succeeded') {
      alert('Pemesanan berhasil disimpan!');
      dispatch(resetForm());
      navigate(-1);
    }
    if (submissionStatus === 'failed') {
        alert('Gagal menyimpan pemesanan. Silakan coba lagi.');
    }
  }, [submissionStatus, dispatch, navigate]);

  const handleChange = (e) => {
    dispatch(updateFormData({ id: e.target.id, value: e.target.value }));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newSubmissionErrors = {};
    if (!formData.unitId) newSubmissionErrors.unitId = 'Unit harus dipilih.';
    if (!formData.roomId) newSubmissionErrors.roomId = 'Ruang meeting harus dipilih.';
    setSubmissionErrors(newSubmissionErrors);

    const allErrors = { ...validationErrors, ...newSubmissionErrors };

    if (Object.keys(allErrors).length > 0) {
      alert('Harap perbaiki kesalahan pada formulir.');
      return;
    }

    const selectedUnit = masterUnit.find(u => u.id === formData.unitId);
    const selectedRoom = masterRooms.find(r => r.id === formData.roomId);

    const bookingData = {
      unit_id: formData.unitId,
      unit_name: selectedUnit ? selectedUnit.name : 'Unknown Unit',
      room_id: formData.roomId,
      room_name: selectedRoom ? selectedRoom.name : 'Unknown Room',
      meeting_date: formData.tanggalRapat,
      start_time: formData.waktuMulai,
      end_time: formData.waktuSelesai,
      participant_count: parseInt(formData.jumlahPeserta, 10),
      capacity: kapasitas,
      consumption: selectedKonsumsi.map(k => k.name).join(', '),
      consumption_cost: nominalKonsumsi,
    };

    dispatch(submitBooking(bookingData));
  };

  if (dataStatus === 'loading') {
    return <CircularProgress />;
  }

  if (dataStatus === 'failed') {
    return <div>Gagal memuat data. Silakan coba lagi.</div>;
  }

  const isSubmitting = submissionStatus === 'loading';
  const errors = { ...validationErrors, ...submissionErrors };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={handleCancel} className="p-2 rounded-xl bg-[#4A8394] cursor-pointer">
          <ChevronLeft size={24} color='white'/>
        </button>
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-gray-800">Pesan Ruangan</h1>
          <p className="text-sm text-gray-500">Ruang Meeting &gt; Pesan Ruangan</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informasi Ruang Meeting</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select id="unitId" label="Unit" value={formData.unitId} onChange={handleChange} required>
                <option value="">Pilih Unit</option>
                {(masterUnit || []).map(unit => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
              </Select>
              <Select id="roomId" label="Ruang Meeting" value={formData.roomId} onChange={handleChange} required disabled={!formData.unitId}>
                <option value="">Pilih Ruang Meeting</option>
                {(filteredRooms || []).map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
              </Select>
              <Input id="kapasitas" label="Kapasitas" value={kapasitas} disabled />
            </div>
             {errors.unitId && <p className="text-red-500 text-sm mt-1">{errors.unitId}</p>}
             {errors.roomId && <p className="text-red-500 text-sm mt-1">{errors.roomId}</p>}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Informasi Rapat</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input id="tanggalRapat" label="Tanggal Rapat" type="date" value={formData.tanggalRapat} onChange={handleChange}/>
              <Input id="waktuMulai" label="Waktu Mulai" type="time" value={formData.waktuMulai} onChange={handleChange} required />
              <Input id="waktuSelesai" label="Waktu Selesai" type="time" value={formData.waktuSelesai} onChange={handleChange} required />
            </div>
            {errors.tanggalRapat && <p className="text-red-500 text-sm mt-1">{errors.tanggalRapat}</p>}
            {errors.waktuSelesai && <p className="text-red-500 text-sm mt-1">{errors.waktuSelesai}</p>}
            <div className="mt-6">
              <Input id="jumlahPeserta" label="Jumlah Peserta" type="number" value={formData.jumlahPeserta} onChange={handleChange} placeholder="Masukkan Jumlah Peserta" required min="1" />
              {errors.jumlahPeserta && <p className="text-red-500 text-sm mt-1">{errors.jumlahPeserta}</p>}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Konsumsi Rapat</h2>
            <div className="flex flex-col space-y-2">
              {(masterKonsumsi || []).map(k => (
                <Checkbox key={k.id} id={k.id} label={k.name} checked={selectedKonsumsi.some(sc => sc.id === k.id)} disabled />
              ))}
            </div>
            <div className="mt-6">
              <Input id="nominalKonsumsi" label="Nominal Konsumsi" value={nominalKonsumsi.toLocaleString('id-ID')} disabled icon={<span className="text-gray-500">Rp.</span>} iconPosition="left" />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="secondary" type="button" onClick={handleCancel} disabled={isSubmitting}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PesanRuangan;