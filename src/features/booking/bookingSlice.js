import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { getMasterUnit, getMasterRooms, getMasterKonsumsi, postBooking } from '../../services/api';

// Async Thunk for fetching master data
export const fetchMasterData = createAsyncThunk(
  'booking/fetchMasterData',
  async (_, { rejectWithValue }) => {
    try {
      const [units, rooms, konsumsi] = await Promise.all([
        getMasterUnit(),
        getMasterRooms(),
        getMasterKonsumsi(),
      ]);
      return { units, rooms, konsumsi };
    } catch (error) {
        return rejectWithValue(error.toString());
    }
  }
);

// Async Thunk for submitting the booking
export const submitBooking = createAsyncThunk(
  'booking/submitBooking',
  async (formData, { rejectWithValue }) => {
    try {
        return await postBooking(formData);
    } catch (error) {
        return rejectWithValue(error.message || 'Terjadi kesalahan saat menyimpan.');
    }
  }
);

const initialState = {
  formData: {
    unitId: '',
    roomId: '',
    tanggalRapat: new Date().toISOString().split('T')[0],
    waktuMulai: '09:00',
    waktuSelesai: '10:00',
    jumlahPeserta: '1',
  },
  masterData: {
    units: [],
    rooms: [],
    konsumsi: [],
  },
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  submissionStatus: 'idle', // idle | loading | succeeded | failed
  submissionError: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      const { id, value } = action.payload;
      state.formData[id] = value;
      // Reset room if unit changes
      if (id === 'unitId') {
        state.formData.roomId = '';
      }
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.submissionStatus = 'idle';
      state.submissionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Master Data
      .addCase(fetchMasterData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMasterData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { units, rooms, konsumsi } = action.payload;
        state.masterData = {
          units: (units || []).map(unit => ({ ...unit, name: unit.officeName })),
          rooms: (rooms || []).map(room => ({ ...room, name: room.roomName })),
          konsumsi: konsumsi || [],
        };
      })
      .addCase(fetchMasterData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Submit Booking
      .addCase(submitBooking.pending, (state) => {
        state.submissionStatus = 'loading';
      })
      .addCase(submitBooking.fulfilled, (state) => {
        state.submissionStatus = 'succeeded';
      })
      .addCase(submitBooking.rejected, (state, action) => {
        state.submissionStatus = 'failed';
        state.submissionError = action.payload;
      });
  },
});

export const { updateFormData, resetForm } = bookingSlice.actions;

// Base Selectors
const selectBooking = (state) => state.booking;
export const selectFormData = createSelector([selectBooking], (booking) => booking.formData);
export const selectMasterData = createSelector([selectBooking], (booking) => booking.masterData);
export const selectStatus = createSelector([selectBooking], (booking) => booking.status);
export const selectSubmissionStatus = createSelector([selectBooking], (booking) => booking.submissionStatus);

// Derived Data Selectors
export const selectFilteredRooms = createSelector(
  [selectMasterData, selectFormData],
  (masterData, formData) => {
    const rooms = masterData?.rooms || [];
    const unitId = formData?.unitId;
    if (!unitId) return [];
    return rooms.filter(room => room.officeId === unitId);
  }
);

export const selectRoomCapacity = createSelector(
  [selectMasterData, selectFormData],
  (masterData, formData) => {
    const rooms = masterData?.rooms || [];
    const roomId = formData?.roomId;
    if (!roomId) return 0;
    const selectedRoom = rooms.find(room => room.id === roomId);
    return selectedRoom ? selectedRoom.capacity : 0;
  }
);

export const selectConsumptionData = createSelector(
  [selectFormData, selectMasterData],
  (formData, masterData) => {
    const { waktuMulai, waktuSelesai, jumlahPeserta } = formData;
    const konsumsi = masterData?.konsumsi || [];

    if (!waktuMulai || !waktuSelesai || !jumlahPeserta || parseInt(jumlahPeserta, 10) <= 0 || konsumsi.length === 0) {
      return { selectedKonsumsi: [], nominalKonsumsi: 0 };
    }

    const start = parseInt(waktuMulai.split(':')[0], 10);
    const end = parseInt(waktuSelesai.split(':')[0], 10);
    const peserta = parseInt(jumlahPeserta, 10);

    let determinedKonsumsi = [];
    const snackPagi = konsumsi.find(k => k.name.toLowerCase().includes('snack pagi'));
    const makanSiang = konsumsi.find(k => k.name.toLowerCase().includes('makan siang'));
    const snackSore = konsumsi.find(k => k.name.toLowerCase().includes('snack sore'));

    if (end <= 11 && snackPagi) determinedKonsumsi.push(snackPagi);
    if (((start < 14 && end > 11) || (start >= 11 && start < 14)) && makanSiang) determinedKonsumsi.push(makanSiang);
    if (end > 14 && snackSore) determinedKonsumsi.push(snackSore);

    const uniqueKonsumsi = [...new Set(determinedKonsumsi)];
    const totalCost = uniqueKonsumsi.reduce((acc, curr) => acc + curr.maxPrice, 0) * peserta;

    return { selectedKonsumsi: uniqueKonsumsi, nominalKonsumsi: totalCost };
  }
);

export const selectFormErrors = createSelector(
  [selectFormData, selectRoomCapacity],
  (formData, kapasitas) => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];

    if (formData.tanggalRapat < today) newErrors.tanggalRapat = 'Tanggal rapat tidak boleh di masa lalu.';
    if (formData.waktuSelesai <= formData.waktuMulai) newErrors.waktuSelesai = 'Waktu selesai harus setelah waktu mulai.';
    if (kapasitas > 0 && parseInt(formData.jumlahPeserta, 10) > kapasitas) {
        newErrors.jumlahPeserta = `Jumlah peserta tidak boleh melebihi kapasitas (${kapasitas}).`;
    }
    if (parseInt(formData.jumlahPeserta, 10) <= 0) newErrors.jumlahPeserta = 'Jumlah peserta harus lebih dari 0.';

    return newErrors;
  }
);

export default bookingSlice.reducer;
