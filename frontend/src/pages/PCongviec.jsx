import React from 'react'
import Menutrai from '../components/Menutrai'
import Congviec from '../components/Congviec'

const PCongviec = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Menutrai />
      <div className="px-6 py-4 mt-16">
        <Congviec />
      </div>
    </div>
  )
}

export default PCongviec
