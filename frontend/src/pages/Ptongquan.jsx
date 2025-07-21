import React from 'react';
import Menutrai from '../components/Menutrai';
import Tongquan from '../components/Tongquan';
import Trangthai from '../components/Trangthai';
import Thongbao from '../components/Thongbao';
import Lich from '../components/Lich';

const Ptongquan = () => {
  return (
    <div className='flex flex-col-2'>
      <div className='w-[20%] fixed'>
        <Menutrai />
      </div>

      <div className='w-[79.5%] ml-[20%]'>
        <Tongquan />

        <div className="flex gap-4 p-4">
          <div className="w-1/2">
            <Trangthai />
          </div>
          <div className="w-1/2">
            <Thongbao />
          </div>
          
        </div>
        <div className="flex-1 overflow-auto">
          <Lich />
        </div>

        <div className="h-15" />
      </div>
    </div>
  );
};

export default Ptongquan;
