import React from 'react';
import '../../Home/DatesContainer/Date.css';
import Region from '../../Home/DatesContainer/Region';
import BasicSelect from './PropertyItem';
import MultipleSelect from './MultipleSelect';
// import AddDates from './AddDates';
import Calendar from 'Components/Calender/Calender';

const Date: React.FC = () => {
  return (
    <div className='MainCard'>
      <div className="card">
        <BasicSelect />
        <div className="vl"></div>
        <Calendar />
        <div className="vl"></div>
        <Region />
        <div className="vl"></div>
        <MultipleSelect />
      </div>
    </div>
  );
};

export default Date;


