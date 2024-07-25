import React from 'react'
import { Table, Button } from 'react-bootstrap'
import './PeakSeasonCard.css'

interface PeakSeasonCardProps {
    totalNights: number
    nightsStaying: number
    nightsRenting: number
}

const PeakSeasonCard: React.FC<PeakSeasonCardProps> = ({
    totalNights,
    nightsStaying,
    nightsRenting,
}) => {
    return (
        <div className="season-card2">
            <h3 className="peak">PEAK-SEASON 2024</h3>
            <p>May 30 - Sept 19</p>
            <Table bordered className="peaktable">
                <tbody className="PeakSeason">
                    <tr>
                        <td className="nights">
                            <strong>TOTAL NIGHTS</strong>
                        </td>
                        <td className="nights num">{totalNights}</td>
                    </tr>
                    <tr>
                        <td>NIGHTS STAYING</td>
                        <td className="nights num">{nightsStaying}</td>
                    </tr>
                    <tr>
                        <td>NIGHTS RENTING</td>
                        <td className="nights num">{nightsRenting}</td>
                    </tr>
                    <tr>
                        <td>NIGHTS UNDECIDED</td>
                        <td className="nights num">
                            {totalNights - nightsStaying - nightsRenting}
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Button variant="warning" className="peak-season-btn">
                MY 2024 PEAK-SEASON
            </Button>
        </div>
    )
}

export default PeakSeasonCard
