import React from 'react'
import { Table } from 'react-bootstrap'
import './OffSeasonCard.css'

interface OffSeasonCardProps {
    totalNights: number
    nightsUsed: number
    nightsBooked: number
    holidays: {
        total: number
        used: number
        booked: number
        remaining: number
    }
}

const OffSeasonCard: React.FC<OffSeasonCardProps> = ({
    totalNights,
    nightsUsed,
    nightsBooked,
    holidays,
}) => {
    return (
        <div className="season-card">
            <h3 className="off">OFF-SEASON 2024</h3>
            <p>Dec 31 - May 29 & Sept 20 - Dec 30</p>
            <Table bordered>
                <tbody className="offseason">
                    <tr>
                        <td className="nights">
                            <strong>TOTAL NIGHTS</strong>
                        </td>
                        <td className="nights num">{totalNights}</td>
                    </tr>

                    <tr>
                        <td>NIGHTS USED</td>
                        <td className="nights num">{nightsUsed}</td>
                    </tr>
                    <tr>
                        <td>NIGHTS BOOKED</td>
                        <td className="nights num">{nightsBooked}</td>
                    </tr>
                    <tr>
                        <td>NIGHTS REMAINING</td>
                        <td className="nights num">
                            {totalNights - nightsUsed - nightsBooked}
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Table bordered>
                <tbody className="offseason">
                    <tr>
                        <td className="nights">
                            <strong>TOTAL HOLIDAYS</strong>
                        </td>
                        <td className="nights num">{holidays.total}</td>
                    </tr>
                    <tr>
                        <td>HOLIDAYS USED</td>
                        <td className="nights num">{holidays.used}</td>
                    </tr>
                    <tr>
                        <td>HOLIDAYS BOOKED</td>
                        <td className="nights num">{holidays.booked}</td>
                    </tr>
                    <tr>
                        <td>HOLIDAYS REMAINING</td>
                        <td className="nights num">{holidays.remaining}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default OffSeasonCard
