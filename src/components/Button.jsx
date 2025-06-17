const Button = ({ children, onClick, variant = 'primary', type = 'button' }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-[#4A8394] text-white hover:bg-teal-600 focus:ring-teal-500',
    secondary: 'bg-gray-200 text-red-500 hover:bg-gray-300 focus:ring-gray-500',
  };

  return (
    <button type={type} onClick={onClick} className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
};

export default Button;
