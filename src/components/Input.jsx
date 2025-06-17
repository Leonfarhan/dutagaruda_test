const Input = ({ label, id, type = 'text', value, onChange, placeholder, disabled = false, required = false, icon, iconPosition = 'left' }) => {
  const inputClasses = `w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`;

  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>}
      <div className="relative">
        {icon && iconPosition === 'left' && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${inputClasses} ${icon && iconPosition === 'left' ? 'pl-10' : ''} ${icon && iconPosition === 'right' ? 'pr-10' : ''}`}
        />
        {icon && iconPosition === 'right' && <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">{icon}</div>}
      </div>
    </div>
  );
};

export default Input;
