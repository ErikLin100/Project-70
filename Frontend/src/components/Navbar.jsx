import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AiOutlineHome, AiOutlineCalendar, AiOutlineBarChart, AiOutlineFolder, AiOutlineSetting } from 'react-icons/ai';
import { MdLogout } from 'react-icons/md';
import PropTypes from 'prop-types';

const NavItem = ({ icon: Icon, text, to }) => (
  <Link to={to} className="flex items-center p-4 text-white hover:bg-gray-700 transition-colors duration-200">
    <Icon size={24} className="min-w-[24px]" />
    <span className="ml-4 whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">{text}</span>
  </Link>
);

NavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-gray-800 fixed top-0 left-0 h-full w-16 hover:w-64 transition-all duration-300 ease-in-out group overflow-hidden z-50">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <Link to="/home" className="text-white font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">HiLight.AI</Link>
        </div>
        <div className="flex-grow">
          <NavItem icon={AiOutlineHome} text="Home" to="/home" />
          <NavItem icon={AiOutlineCalendar} text="Scheduled" to="/clips" />
          <NavItem icon={AiOutlineBarChart} text="Analytics" to="/story" />
          <NavItem icon={AiOutlineFolder} text="Saved" to="/saved" />
        </div>
        <div className="mb-4">
          <NavItem icon={AiOutlineSetting} text="Settings" to="/settings" />
        </div>
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={user.photoURL || 'https://via.placeholder.com/40'}
                alt="User"
                className="w-8 h-8 rounded-full min-w-[32px]"
              />
              <div className="ml-3 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
                <p className="text-xs text-gray-300 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100"
              title="Logout"
            >
              <MdLogout size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
