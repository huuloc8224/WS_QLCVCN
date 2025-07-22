import React, { useState, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/l2dd2.jpg';
import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserIcon,
  LockClosedIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { UserContext } from '../context/UserContext';

const Menutrai = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, setUserName } = useContext(UserContext);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUserName('');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navItemClass = (path) =>
    `px-3 py-2 rounded-md transition ${
      isActive(path)
        ? 'bg-white/20 border-b-2 border-yellow-300 font-semibold text-yellow-300'
        : 'hover:text-yellow-300'
    }`;

  const menuItems = [
    { label: 'Tổng Quan', path: '/tongquan' },
    { label: 'Loại Công Việc', path: '/loaicongviec' },
    { label: 'Công Việc', path: '/congviec' },
    { label: 'Nhật Ký Thay Đổi', path: '/lichsu' },
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-900 to-blue-600 text-white shadow z-50 px-4 md:px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
        <span className="text-lg font-bold hidden sm:inline">Quản Lý Công Việc</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 text-sm font-medium">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={navItemClass(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* User Dropdown */}
      <div className="relative ml-4" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:text-yellow-300"
        >
          <UserIcon className="w-5 h-5" />
          <span className="hidden sm:inline">{userName || 'Người dùng'}</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-48 z-50">
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
              onClick={() => navigate('/doimatkhau')}
            >
              <LockClosedIcon className="w-4 h-4 mr-2" />
              Đổi mật khẩu
            </button>
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
              onClick={handleLogout}
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Đăng xuất
            </button>
          </div>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {showMobileMenu && (
        <div className="absolute top-16 left-0 w-full bg-blue-800 text-white shadow-md z-40 flex flex-col items-start px-4 py-2 md:hidden">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setShowMobileMenu(false);
              }}
              className={`${navItemClass(item.path)} w-full text-left`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menutrai;
