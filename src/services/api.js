import { supabase } from '../config/supabaseClient';

const masterUnitUrl = 'https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterOffice';
const masterRoomsUrl = 'https://6666c7aea2f8516ff7a4e261.mockapi.io/api/dummy-data/masterMeetingRooms';
const masterKonsumsiUrl = 'https://6686cb5583c983911b03a7f3.mockapi.io/api/dummy-data/masterJenisKonsumsi';
const summaryBookingUrl = 'https://6686cb5583c983911b03a7f3.mockapi.io/api/dummy-data/summaryBookings';

export const getMasterUnit = async () => {
  try {
    const response = await fetch(masterUnitUrl);
    return await response.json();
  } catch (error) {
    console.error('API Error fetching units:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getMasterRooms = async () => {
  try {
    const response = await fetch(masterRoomsUrl);
    return await response.json();
  } catch (error) {
    console.error('API Error fetching rooms:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getSummaryBooking = async () => {
  try {
    const response = await fetch(summaryBookingUrl);
    return await response.json();
  } catch (error) {
    console.error('API Error fetching summary booking:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getMasterKonsumsi = async () => {
  try {
    const response = await fetch(masterKonsumsiUrl);
    return await response.json();
  } catch (error) {
    console.error('API Error fetching konsumsi:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase Error:', error);
    throw new Error(error.message);
  }

  return data;
};

export const postBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select();

  if (error) {
    console.error('Supabase Error:', error);
    throw new Error(error.message);
  }

  return data;
};
