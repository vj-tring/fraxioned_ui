// import React from 'react';
// import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './basic-range-shortcuts.css';
import { DatePickerWithRange } from '../calender';
// import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
// import { DateRange } from '@mui/x-date-pickers-pro/models';

// const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
//   {
//     label: 'This Week',
//     getValue: () => {
//       const today = dayjs();
//       return [today.startOf('week'), today.endOf('week')];
//     },
//   },
//   {
//     label: 'Last Week',
//     getValue: () => {
//       const today = dayjs();
//       const prevWeek = today.subtract(7, 'day');
//       return [prevWeek.startOf('week'), prevWeek.endOf('week')];
//     },
//   },
//   {
//     label: 'Last 7 Days',
//     getValue: () => {
//       const today = dayjs();
//       return [today.subtract(7, 'day'), today];
//     },
//   },
//   {
//     label: 'Current Month',
//     getValue: () => {
//       const today = dayjs();
//       return [today.startOf('month'), today.endOf('month')];
//     },
//   },
//   {
//     label: 'Next Month',
//     getValue: () => {
//       const today = dayjs();
//       const startOfNextMonth = today.endOf('month').add(1, 'day');
//       return [startOfNextMonth, startOfNextMonth.endOf('month')];
//     },
//   },
//   { label: 'Reset', getValue: () => [null, null] },
// ];

export default function BasicRangeShortcuts() {
  return (    
  
    <LocalizationProvider dateAdapter={AdapterDayjs}>
<div className="custom-calendar-page">
<h6 className='mt-4 basicRangeHead' >Select checkIn date</h6 >

<div className="d-flex  " style={{color:'grey'}}>
<p className='pr-5'>Minimum stay: 3 nights</p>
<p className='ml-5'>Maximum stay: 14 nights</p>
</div>
<br />
<DatePickerWithRange />
<br />
</div>
    </LocalizationProvider>
  );
}
