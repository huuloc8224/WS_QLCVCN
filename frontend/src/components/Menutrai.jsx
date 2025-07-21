import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/l2dd2.jpg';
import {
  HomeIcon,
  ClipboardDocumentIcon,
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  TagIcon,
  ClockIcon,
  UserIcon,
  LockClosedIcon
} from '@heroicons/react/24/solid';
import { UserContext } from '../context/UserContext';

const Menutrai = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-gray-100 pr-2 w-[100%]">
      <div className="bg-gradient-to-br from-blue-950 to-blue-700 shadow-md w-[100%] text-white h-screen">
        <div>
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>

        <div className="p-2 space-y-2 h-fit max-h-[70vh] overflow-auto">
          <p className="cursor-pointer hover:bg-white/80 p-2 rounded hover:text-black flex items-center" onClick={() => navigate('/tongquan')}>
            <HomeIcon className="w-5 h-5 mr-2" />
            Tổng Quan
          </p>
          <p className="cursor-pointer hover:bg-white/80 p-2 rounded hover:text-black flex items-center" onClick={() => navigate('/loaicongviec')}>
            <TagIcon className="w-5 h-5 mr-2" />
            Loại Công Việc
          </p>
          <p className="cursor-pointer hover:bg-white/80 p-2 rounded hover:text-black flex items-center" onClick={() => navigate('/congviec')}>
            <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
            Công Việc
          </p>
          <p className="cursor-pointer hover:bg-white/80 p-2 rounded hover:text-black flex items-center" onClick={() => navigate('/lichsu')}>
            <ClockIcon className="w-5 h-5 mr-2" />
            Lịch sử thay đổi
          </p>
        </div>

        <div className="relative p-2" ref={menuRef}>
          <hr className="border-t-2 border-gray-300/60 my-2" />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded w-full flex text-white cursor-pointer"
          >
            <UserIcon className="w-5 h-5 mr-2" />
            {userName || 'Người dùng'}
            <ChevronDownIcon className="w-5 h-5 ml-1 mt-1" />
          </button>
          {isOpen && (
            <div className="absolute w-auto mt-2 bg-white border rounded shadow-lg text-black z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex" onClick={() => navigate('/doimatkhau')}>
                <LockClosedIcon className="w-5 h-5 mr-2" />
                Đổi mật khẩu
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer flex" onClick={handleLogout}>
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menutrai;
