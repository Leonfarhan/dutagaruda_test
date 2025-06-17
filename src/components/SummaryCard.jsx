import CircularProgress from './CircularProgress';
import ConsumptionBar from './ConsumptionBar';

const SummaryCard = ({ room }) => {
  const snackSore = room.snackSore ?? 0;
  const snackSiang = room.snackSiang ?? 0;
  const makanSiang = room.makanSiang ?? 0;
  const persentase = room.persentasePemakaian ?? 0;

  const maxConsumption = Math.max(snackSore, snackSiang, makanSiang) || 1;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-gray-800 mb-2">{room.namaRuangan}</h3>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500">Persentase Pemakaian</p>
          <p className="text-2xl font-bold text-gray-800">{persentase}%</p>
          <p className="text-xs text-gray-500 mt-2">Nominal Konsumsi</p>
          <p className="text-lg font-bold text-blue-600">Rp {(room.nominalKonsumsi ?? 0).toLocaleString('id-ID')}</p>
        </div>

        <div className="w-24 h-24 relative">
          <CircularProgress percentage={persentase} />
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-blue-600">
            {`${persentase}%`}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <ConsumptionBar label="Snack Siang" value={snackSiang} maxValue={maxConsumption} />
        <ConsumptionBar label="Makan Siang" value={makanSiang} maxValue={maxConsumption} />
        <ConsumptionBar label="Snack Sore" value={snackSore} maxValue={maxConsumption} />
      </div>
    </div>
  );
};

export default SummaryCard;
