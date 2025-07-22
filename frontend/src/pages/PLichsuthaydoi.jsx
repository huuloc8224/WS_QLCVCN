import React from 'react'
import Menutrai from '../components/Menutrai'
import Lichsu from '../components/Lichsu'

const PLichsu = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Menutrai />
      <div className="px-6 py-4 mt-16">
        <Lichsu />
      </div>
    </div>
  )
}

export default PLichsu
