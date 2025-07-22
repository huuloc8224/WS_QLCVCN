import React, { useState, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/l2dd2.jpg';
import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserIcon,
  LockClosedIcon
} from '@heroicons/react/24/solid';
import { UserContext } from '../context/UserContext';

const Menutrai = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    `px-3 py-1 rounded transition ${
      isActive(path)
        ? 'bg-white/20 border-b-2 border-yellow-300 font-semibold text-yellow-300'
        : 'hover:text-yellow-300'
    }`;

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-900 to-blue-600 text-white shadow z-50 px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
        <span className="text-lg font-bold">Quản Lý Công Việc</span>
      </div>

      {/* Menu Navigation */}
      <div className="flex gap-6 text-sm font-medium">
        <button onClick={() => navigate('/tongquan')} className={navItemClass('/tongquan')}>
          Tổng Quan
        </button>
        <button onClick={() => navigate('/loaicongviec')} className={navItemClass('/loaicongviec')}>
          Loại Công Việc
        </button>
        <button onClick={() => navigate('/congviec')} className={navItemClass('/congviec')}>
          Công Việc
        </button>
        <button onClick={() => navigate('/lichsu')} className={navItemClass('/lichsu')}>
          Nhật Ký Thay Đổi
        </button>
      </div>

      {/* User Dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:text-yellow-300"
        >
          <UserIcon className="w-5 h-5" />
          {userName || 'Người dùng'}
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
    </div>
  );
};

export default Menutrai;
