import React from 'react';
import Menutrai from '../components/Menutrai';
import Tongquan from '../components/Tongquan';
import Trangthai from '../components/Trangthai';
import Thongbao from '../components/Thongbao';
import Lich from '../components/Lich';

const Ptongquan = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar ngang */}
      <Menutrai />

      {/* Nội dung chính */}
      <div className="px-6 py-4 mt-16"> {/* mt-16 = đúng chiều cao của navbar (64px) */}
        <Tongquan />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Trangthai />
          <Thongbao />
        </div>

        <div className="mt-6">
          <Lich />
        </div>
      </div>
    </div>
  );
};

export default Ptongquan;
