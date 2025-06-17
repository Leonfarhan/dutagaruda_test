const Checkbox = ({ label, id, checked, onChange, disabled, ...props }) => {
  return (
    <div className="flex items-center my-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        {...props}
      />
      <label htmlFor={id} className={`ml-3 block text-sm text-gray-900 ${disabled ? 'text-gray-400' : ''}`}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
