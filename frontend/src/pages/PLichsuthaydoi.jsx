import React from 'react'
import Menutrai from '../components/Menutrai'
import Lichsu from '../components/Lichsu'


const PLichsu = () => {
  return (
    <div className='flex flex-col-2'>
        <div className='w-[20%] fixed'>
            <Menutrai />
        </div>
        <div className='w-[79.5%] ml-[20%]'>
            <Lichsu />
        </div>

    </div>
  )
}

export default PLichsu