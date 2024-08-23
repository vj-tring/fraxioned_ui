import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { DatePickerWithRange } from '.';
import { addDays } from 'date-fns';
import '@testing-library/jest-dom';

jest.mock('@/lib/utils', () => ({
  cn: jest.fn(),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/calendar', () => ({
    Calendar: ({ onSelect, disabled }: { onSelect: (range: { from: Date; to: Date }) => void, disabled: (date: Date) => boolean }) => (
      <div data-testid="mock-calendar">
        <button onClick={() => onSelect({ from: new Date(), to: addDays(new Date(), 5) })}>
          Select Date Range
        </button>
        <span data-testid="disabled-prop">{disabled.toString()}</span>
      </div>
    ),
}));

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/store/slice/auth/property-slice', () => ({
  fetchProperties: jest.fn(),
  selectSelectedPropertyDetails: jest.fn(),
}));

const mockData = {
    bookedDates: [
      "2024-08-20",
      "2024-08-21",
      "2024-08-22"
    ],
    unavailableDates: [
      "2024-11-04",
      "2024-11-05",
      "2024-11-06"
    ],
    blueDates: [
      "2024-09-12",
      "2024-09-13",
      "2024-09-14"
    ],
    bookingRules: {
      lastMinuteBooking: {
        maxDays: 3,
        minNights: 1,
        maxNights: 3
      },
      regularBooking: {
        minNights: 3,
        maxNights: 14
      }
    },
    locale: {
      code: "en-US",
      days: ["S", "M", "T", "W", "T", "F", "S"],
      months: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
      dateFormat: "yyyy-MM-dd"
    }
  };
  
  const isBookedDate = (date: Date) => {
    return mockData.bookedDates.includes(date.toISOString().split('T')[0]);
  };
  
  const isUnavailableDate = (date: Date) => {
    return mockData.unavailableDates.includes(date.toISOString().split('T')[0]);
  };

// describe('DatePickerWithRange', () => {
//   it('renders without crashing', () => {
//     render(<DatePickerWithRange />);
//     expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
//   });

//   it('render the clear button', () => {
//     render(<DatePickerWithRange />);
//     expect(screen.getByText('Clear')).toBeInTheDocument();
//   });
  
//   it('displays error message for invalid date selections', () => {
//     render(<DatePickerWithRange />);    
//     fireEvent.click(screen.getByText('Select Date Range'));
//     expect(screen.getByText(/Cannot select over booked dates/)).toBeInTheDocument();
//   });

//   it('clears selected dates when clear button is clicked', () => {
//     const mockOnSelect = jest.fn();
//     render(<DatePickerWithRange onSelect={mockOnSelect} />);
//     fireEvent.click(screen.getByText('Select Date Range'));
//     fireEvent.click(screen.getByText('Clear'));
//     expect(mockOnSelect).toHaveBeenCalledWith(undefined);
//   });


//   it('calls onSelect callback with undefined if it exists', () => {
//     const onSelectMock = jest.fn();
//     const { getByText } = render(<DatePickerWithRange onSelect={onSelectMock} />);
//     const clearButton = getByText('Clear');
//     act(() => {
//       fireEvent.click(clearButton);
//     });
//     expect(onSelectMock).toHaveBeenCalledTimes(1);
//     expect(onSelectMock).toHaveBeenCalledWith(undefined);
//   });

//   it('does not throw an error if onSelect is not provided', () => {
//     const { getByText } = render(<DatePickerWithRange />);
//     const clearButton = getByText('Clear');
//     act(() => {
//       fireEvent.click(clearButton);
//     });
//     expect(getByText('Select Date Range')).toBeInTheDocument();
//   });

//   it('handles start date selection', () => {
//     const { getByText } = render(<DatePickerWithRange />);
//     act(() => {
//       fireEvent.click(getByText('Select Date Range'));
//     });
//     expect(screen.queryByText(/Minimum 5 nights required between bookings/)).not.toBeInTheDocument();
//   });

//   it('displays error for invalid date selection', () => {
//     const { getByText } = render(<DatePickerWithRange />);
//     act(() => {
//       fireEvent.click(getByText('Select Date Range'));
//     });
//     expect(screen.getByText('Cannot select over booked dates. Please clear and try again.')).toBeInTheDocument();
//   });

//   it('displays error for maximum stay violation', () => {
//     const mockDate = {
//       from: new Date('2024-01-01'),
//       to: new Date('2024-01-20'),
//     }; 
//     jest.spyOn(React, 'useState').mockImplementationOnce(() => [mockDate, jest.fn()]); 
//     render(<DatePickerWithRange />);
//   });
  
//   it('handles last-minute booking rules', () => {
//     jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));
//     const { getByText } = render(<DatePickerWithRange />);
//     act(() => {
//       fireEvent.click(getByText('Select Date Range'));
//     });
//     // expect(screen.getByText(/Minimum \d+ night\(s\) required for last-minute bookings/)).toBeInTheDocument();
//     jest.useRealTimers();
//   });

//   it('handles locale settings', () => {
//     render(<DatePickerWithRange />);
//     expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
//   });

//   it('applies custom styles', () => {
//     render(<DatePickerWithRange />);
//     const styles = document.querySelector('style');
//     expect(styles).not.toBeNull();
//     expect(styles?.textContent).toContain('.booked-date');
//     expect(styles?.textContent).toContain('.unavailable-date');
//   });

//   it('displays stay length information', () => {
//     render(<DatePickerWithRange />);
//     expect(screen.getByText(/Minimum Stay Length/)).toBeInTheDocument();
//     expect(screen.getByText(/Maximum Stay Length/)).toBeInTheDocument();
//   });

//   it('handles date spanning booked dates', () => {
//     const { getByText } = render(<DatePickerWithRange />);
//     act(() => {
//       fireEvent.click(getByText('Select Date Range'));
//     });
//     expect(screen.getByText('Cannot select over booked dates. Please clear and try again.')).toBeInTheDocument();
//   });

//   it('handles check-out only dates', () => {
//     const { getByText } = render(<DatePickerWithRange />);
//     act(() => {
//       fireEvent.click(getByText('Select Date Range'));
//     });
//     expect(screen.getByText(/Cannot select over booked dates|Check out only/)).toBeInTheDocument();
//   });

//   it('keeps calendar open when only start date is selected', () => {
//     const { getByText } = render(<DatePickerWithRange />);   
//     act(() => {
//       fireEvent.click(getByText('Select Date Range'));
//     });
//     expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
//   });
// });

describe('Date Functions', () => {
    it('should return true for booked dates', () => {
      const bookedDate = new Date('2024-08-20');
      expect(isBookedDate(bookedDate)).toBe(true);
    });
  
    it('should return false for non-booked dates', () => {
      const nonBookedDate = new Date('2024-08-23');
      expect(isBookedDate(nonBookedDate)).toBe(false);
    });
  
    it('should return true for unavailable dates', () => {
      const unavailableDate = new Date('2024-11-04');
      expect(isUnavailableDate(unavailableDate)).toBe(true);
    });
  
    it('should return false for available dates', () => {
      const availableDate = new Date('2024-11-07');
      expect(isUnavailableDate(availableDate)).toBe(false);
    });
  });
