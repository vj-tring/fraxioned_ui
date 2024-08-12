import React from 'react'
import '../../Home/DatesContainer/Date.css'
import Region from '../../Home/DatesContainer/Region'
import BasicSelect from './PropertyItem'
import MultipleSelect from './MultipleSelect'
import Calendar from '../../Calender/Calender'

const Date: React.FC = () => {
  return (
    <div className="MainCard">
      <div className="card">
        <BasicSelect />
        <div className="vl p-2"></div>
        <Calendar />
        <div className="vl p-2"></div>
        <Region />
        <div className="vl"></div>
        <MultipleSelect />
      </div>
    </div>
  )
}

export default Date
