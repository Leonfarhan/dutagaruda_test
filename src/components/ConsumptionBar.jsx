const ConsumptionBar = ({ label, value, maxValue }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <span>{label}</span>
      <div className="flex items-center">
        <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
};

export default ConsumptionBar;
