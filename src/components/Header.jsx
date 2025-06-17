const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#18A2BA] to-[#296377]">
      <div className="flex items-center">
        <img src="src/assets/pln-logo.svg" alt="iMeeting Logo" className="h-8 w-auto" />
        <span className="text-xl font-semibold text-white ml-2">iMeeting</span>
      </div>
      <div className="flex items-center">
        <div className="flex items-center">
          <img className="h-8 w-8 rounded-full object-cover border border-white" src="src/assets/avatar.svg" alt="User avatar" />
          <span className="ml-2 text-sm font-medium text-white">Farhan Alwahid</span>
        </div>
      </div>
    </header>
  );
};

export default Header;