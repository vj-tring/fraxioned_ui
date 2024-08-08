//@ts-nocheck
import React, { useState, useEffect } from 'react'
import { Popover, Paper } from '@mui/material'

import {
  ORIENTATION,
  StatefulCalendar as StatefulCalendarType,
} from 'baseui/datepicker'
import Box from '@mui/material/Box'

import './calender.css'

interface DatepickerProps {
  onChange: ({ date }: { date: Date | Date[] }) => void
  orientation: typeof ORIENTATION.horizontal
  monthsShown: number
  range: boolean
  filterDate: (date: Date) => boolean
  minDate: Date
  maxDate: Date
  overrides: {
    Day: {
      style: ({ $date }: { $date: Date }) => {
        color?: string
        textDecoration?: string
        pointerEvents?: string
        tooltip?: string
      }
    }
    MonthYearSelectStatefulMenu: {
      component: () => null
    }
  }
}

const StatefulCalendar: React.FC<DatepickerProps> = ({ ...props }) => {
  return <StatefulCalendarType {...props} />
}

const Calendar: React.FC = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const twoYearsFromToday = new Date()
  twoYearsFromToday.setFullYear(today.getFullYear() + 2)
  twoYearsFromToday.setMonth(11)
  twoYearsFromToday.setDate(31)
  twoYearsFromToday.setHours(0, 0, 0, 0)

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const id = open ? 'calendar-popover' : undefined

  const bookedDates = [
    new Date(2024, 9, 15),
    new Date(2024, 9, 16),
    new Date(2024, 9, 17),
    new Date(2024, 8, 25),
    new Date(2024, 8, 26),
    new Date(2024, 8, 27),
  ]

  const unavailableDates = [
    new Date(2024, 7, 4),
    new Date(2024, 7, 2),
    new Date(2024, 7, 3),
  ]

  const colorCodes = {
    '2024-08-12': '#F4B76A',
    '2024-08-13': '#F4B76A',
    '2024-08-22': '#C7EAEE',
    '2024-08-23': '#C7EAEE',
    '2024-08-24': '#C7EAEE',
  }

  const isBookedDate = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        date.getFullYear() === bookedDate.getFullYear() &&
        date.getMonth() === bookedDate.getMonth() &&
        date.getDate() === bookedDate.getDate()
    )
  }

  const isUnavailableDate = (date: Date) => {
    return unavailableDates.some(
      (unavailableDate) =>
        date.getFullYear() === unavailableDate.getFullYear() &&
        date.getMonth() === unavailableDate.getMonth() &&
        date.getDate() === unavailableDate.getDate()
    )
  }

  const isDayBeforeBookedDate = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        date.getFullYear() === bookedDate.getFullYear() &&
        date.getMonth() === bookedDate.getMonth() &&
        date.getDate() === bookedDate.getDate() - 1
    )
  }

  const isDayBeforeUnavailableDate = (date: Date) => {
    return unavailableDates.some(
      (unavailableDate) =>
        date.getFullYear() === unavailableDate.getFullYear() &&
        date.getMonth() === unavailableDate.getMonth() &&
        date.getDate() === unavailableDate.getDate() - 1
    )
  }

  const getFirstBookedDateAfterCheckIn = (checkInDate: Date) => {
    return bookedDates.find((bookedDate) => bookedDate > checkInDate)
  }

  const getFirstUnavailableDateAfterCheckIn = (checkInDate: Date) => {
    return unavailableDates.find(
      (unavailableDate) => unavailableDate > checkInDate
    )
  }

  const getLastCheckOutDate = (checkInDate: Date) => {
    const sortedBookedDates = bookedDates
      .slice()
      .sort((a, b) => b.getTime() - a.getTime())
    return sortedBookedDates.find((bookedDate) => bookedDate < checkInDate)
  }

  const isLastMinuteBooking = (checkInDate: Date) => {
    const diffInDays =
      (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    return diffInDays <= 3
  }

  const handleDateChange = ({ date }: { date: Date | Date[] }) => {
    if (Array.isArray(date)) {
      const [start, end] = date
      setStartDate(start)
      setEndDate(end)

      if (isDayBeforeBookedDate(start)) {
        setErrorMessage('Checkout only')
      } else if (isDayBeforeUnavailableDate(start)) {
        setErrorMessage('Checkout only')
      } else if (end) {
        const nightsSelected =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        const lastMinute = isLastMinuteBooking(start)

        const lastCheckOutDate = getLastCheckOutDate(start)
        const minNightsBetween = lastCheckOutDate
          ? (start.getTime() - lastCheckOutDate.getTime()) /
            (1000 * 60 * 60 * 24)
          : null

        if (lastCheckOutDate && minNightsBetween < 5) {
          setErrorMessage(
            'Minimum 5 nights required between previous check-out and current check-in'
          )
        } else if (lastMinute) {
          if (nightsSelected < 1 || nightsSelected > 3) {
            setErrorMessage(
              'Minimum 1 night is required for Last-Minute Booking'
            )
          } else {
            setErrorMessage(null)
          }
        } else {
          if (nightsSelected < 3) {
            setErrorMessage('Minimum three nights required')
          } else if (nightsSelected >= 14) {
            setErrorMessage('Maximum nights exceeded')
          } else {
            setErrorMessage(null)
          }
        }
      } else {
        setErrorMessage(null)
      }
    } else {
      setStartDate(date)
      setEndDate(null)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        handleClose()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [open])

  return (
    <Box>
      <div className="calendar ">
        <div className="card-item " onClick={handleClick}>
          <span className="DateHead">Check in</span>
          <p className="property">Add Dates</p>
        </div>

        <Popover
          sx={{
            position: 'relative',
          }}
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            style: {
              borderRadius: 10,
              position: 'fixed',
              marginTop: 20,
              marginLeft: -300,
            },
          }}
        >
          <Paper
            disableRipple
            sx={{
              display: 'flex',
              flexDirection: 'column',
              background: 'white',
              backgroundColor: 'white',
            }}
          >
            <StatefulCalendar
              onChange={handleDateChange}
              orientation={ORIENTATION.horizontal}
              monthsShown={2}
              range
              filterDate={(date) => {
                if (startDate && !endDate) {
                  const firstBookedDate =
                    getFirstBookedDateAfterCheckIn(startDate)
                  const lastMinute = isLastMinuteBooking(startDate)

                  return (
                    date >= startDate &&
                    date <= twoYearsFromToday &&
                    !isBookedDate(date) &&
                    !isUnavailableDate(date) &&
                    (!firstBookedDate || date <= firstBookedDate) &&
                    (!lastMinute ||
                      (lastMinute &&
                        date <=
                          new Date(
                            startDate.getTime() + 3 * 24 * 60 * 60 * 1000
                          )))
                  )
                }
                return (
                  date >= today &&
                  date <= twoYearsFromToday &&
                  !isBookedDate(date) &&
                  !isUnavailableDate(date)
                )
              }}
              minDate={today}
              maxDate={twoYearsFromToday}
              overrides={{
                Day: {
                  style: ({ $date }) => {
                    const dateString = `${$date.getFullYear()}-${String($date.getMonth() + 1).padStart(2, '0')}-${String(
                      $date.getDate()
                    ).padStart(2, '0')}`
                    const firstBookedDate =
                      startDate && !endDate
                        ? getFirstBookedDateAfterCheckIn(startDate)
                        : null
                    const firstUnavailableDate =
                      startDate && !endDate
                        ? getFirstUnavailableDateAfterCheckIn(startDate)
                        : null

                    if (colorCodes[dateString]) {
                      return {
                        backgroundColor: colorCodes[dateString],
                        pointerEvents: 'none',
                      }
                    } else if (isBookedDate($date)) {
                      return {
                        color: 'gray',
                        textDecoration: 'line-through',
                        pointerEvents: 'none',
                      }
                    } else if (isUnavailableDate($date)) {
                      return {
                        color: 'gray',
                        pointerEvents: 'none',
                      }
                    } else if (
                      startDate &&
                      firstBookedDate &&
                      $date > firstBookedDate
                    ) {
                      return {
                        color: 'gray',
                        textDecoration: 'line-through',
                        pointerEvents: 'none',
                      }
                    } else if (
                      startDate &&
                      firstUnavailableDate &&
                      $date > firstUnavailableDate
                    ) {
                      return {
                        color: 'gray',
                        pointerEvents: 'none',
                        textDecoration: 'line-through',
                      }
                    }
                    return {}
                  },
                },
                MonthYearSelectStatefulMenu: {
                  component: () => null,
                },
              }}
            />

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            <div className="stay-length ">
              <div className="misl">Minimum Stay Length : 3 Nights</div>
              <div className="masl">Maximum Stay Length : 14 Nights</div>
              <div className="season">
                Peak-Season Nights: June 1 - September 30
              </div>
            </div>
          </Paper>
        </Popover>
      </div>
    </Box>
  )
}

export default Calendar
