import React from 'react'
import Menutrai from '../components/Menutrai'
import Congviec from '../components/Congviec'


const PCongviec = () => {
  return (
    <div className='flex flex-col-2'>
        <div className='w-[20%] fixed'>
            <Menutrai />
        </div>
        <div className='w-[79.5%] ml-[20%]'>
            <Congviec />
        </div>

    </div>
  )
}

export default PCongviec