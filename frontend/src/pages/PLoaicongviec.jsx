import React from 'react';
import Menutrai from '../components/Menutrai';
import Loaicongviec from '../components/Loaicongviec';

const PLoaicongviec = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar ngang cố định */}
      <Menutrai />

      {/* Nội dung chính */}
      <div className="mt-16 px-6 py-4">
        <Loaicongviec />
      </div>
    </div>
  );
};

export default PLoaicongviec;
