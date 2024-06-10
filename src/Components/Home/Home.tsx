import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import './Home.css';
import homeImage from '../../assets/building.jpg';

const Home: React.FC = () => {
  return (
    <div className="home-content">
     

      <Card className="home-card">
        <h1 className="welcome-owner">WELCOME OWNER!</h1>
      <h2 className="your-homes">YOUR HOMES</h2>
          <div className="home-grid">
            <div className="home-info">
              <div className="home-image-container">
                <img src={homeImage} alt="Blue Bear Lake" className="home-image" />
              </div>
              <div className="home-details">
                <h3>BLUE BEAR LAKE</h3>
                <p className='address'>537 Blue Lake St, Garden City, UT 84078</p>
                <p className='address'>YOU OWN 1/8 SHARE</p>
                <Button variant="warning" className="book-stay-btn">BOOK A STAY</Button>
              </div>
            </div>

            <div className="season-card">
                <h3>OFF-SEASON 2024</h3>
                <p>Dec 31 - May 29 & Sept 20 - Dec 30</p>
                <Table bordered >
                  <tbody>
                    <tr>
                      <td><strong>TOTAL NIGHTS</strong></td>
                      <td>30</td>
                    </tr>
                    <tr>
                      <td>NIGHTS USED</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>NIGHTS BOOKED</td>
                      <td>7</td>
                    </tr>
                    <tr>
                      <td>NIGHTS REMAINING</td>
                      <td>23</td>
                    </tr>
                  </tbody>
                </Table>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td><strong>TOTAL HOLIDAYS</strong></td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>HOLIDAYS USED</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>HOLIDAYS BOOKED</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>HOLIDAYS REMAINING</td>
                      <td>1</td>
                    </tr>
                  </tbody>
                </Table>
            </div>

            <div className="season-card2">
                <h3>PEAK-SEASON 2024</h3>
                <p>May 30 - Sept 19</p>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td><strong>TOTAL NIGHTS</strong></td>
                      <td>14</td>
                    </tr>
                    <tr>
                      <td>NIGHTS STAYING</td>
                      <td>5</td>
                    </tr>
                    <tr>
                      <td>NIGHTS RENTING</td>
                      <td>9</td>
                    </tr>
                    <tr>
                      <td>NIGHTS UNDECIDED</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </Table>
                <Button variant="warning" className="peak-season-btn">MY 2024 PEAK-SEASON</Button>
            </div>
          </div>
      </Card>
    </div>
  );
};

export default Home;
