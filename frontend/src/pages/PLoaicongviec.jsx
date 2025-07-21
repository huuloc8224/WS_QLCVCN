import React from 'react'
import Menutrai from '../components/Menutrai'
import Loaicongviec from '../components/Loaicongviec'


const PLoaicongviec = () => {
  return (
    <div className='flex flex-col-2'>
        <div className='w-[20%] fixed'>
            <Menutrai />
        </div>
        <div className='w-[79.5%] ml-[20%]'>
            <Loaicongviec />
        </div>

    </div>
  )
}

export default PLoaicongviec