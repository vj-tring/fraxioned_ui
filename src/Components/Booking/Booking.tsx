import React, { useState } from 'react'
import './Booking.css' // Assuming your custom styles are defined here
import buildingImage from '../../assets/building.jpg'
import unsplashImage1 from '../../assets/building1.jpg'
import unsplashImage2 from '../../assets/building2.jpg'
import unsplashImage3 from '../../assets/buildingnew.jpg'
import unsplashImage4 from '../../assets/buildingnew.jpg'
import LocationOnIcon from '@mui/icons-material/LocationOn'

const images = [
    {
        src: buildingImage,
        alt: 'Exterior of Blue Bear Lake home',
    },
    {
        src: unsplashImage1,
        alt: 'Aerial view of Blue Bear Lake home',
    },
    {
        src: unsplashImage2,
        alt: 'Living room in Blue Bear Lake home',
    },
    {
        src: unsplashImage3,
        alt: 'Game room in Blue Bear Lake home',
    },
    {
        src: unsplashImage4,
        alt: 'Game room in Blue Bear Lake home',
    },
]

const Booking = () => {
    const [currentImage, setCurrentImage] = useState(0)

    return (
        <div className="container mt-5">
            <div className="Booking-row">
                <div className="col d-flex justify-content-between">
                    <h1 className="Book-heading">BLUE BEAR LAKE</h1>
                    <h4 className="location">
                        <LocationOnIcon /> GARDEN CITY, UT
                    </h4>
                </div>
            </div>

            <div className="img-row mt-4">
                <div className="col-md-6">
                    <img
                        src={images[0].src}
                        alt={images[0].alt}
                        className={`img-fluid img1 cornertop ${currentImage === 0 ? 'active' : ''}`}
                        onClick={() => setCurrentImage(0)}
                    />
                </div>
                <div className="col-md-3">
                    <img
                        src={images[1].src}
                        alt={images[1].alt}
                        className={`img-fluid image ${currentImage === 1 ? 'active' : ''}`}
                        onClick={() => setCurrentImage(1)}
                    />
                    <img
                        src={images[2].src}
                        alt={images[2].alt}
                        className={`img-fluid image mt-1 ${currentImage === 2 ? 'active' : ''}`}
                        onClick={() => setCurrentImage(2)}
                    />
                </div>
                <div className="col-md-3">
                    <img
                        src={images[3].src}
                        alt={images[3].alt}
                        className={`img-fluid image cornertopright ${currentImage === 3 ? 'active' : ''}`}
                        onClick={() => setCurrentImage(3)}
                    />
                    <img
                        src={images[4].src}
                        alt={images[4].alt}
                        className={`img-fluid image mt-1 cornerbottomright ${currentImage === 4 ? 'active' : ''}`}
                        onClick={() => setCurrentImage(4)}
                    />
                </div>
            </div>

            <h4 className="mt-4">BLUE BEAR LAKE</h4>

            <div className="Blue-row mt-3">
                <div>
                    <p>9 guests</p>
                </div>
                <div>
                    <p>3 bedrooms</p>
                </div>
                <div>
                    <p>7 beds</p>
                </div>
                <div>
                    <p>3 bathrooms</p>
                </div>
            </div>

            <div className="Blue-row mt-3">
                <div className="col-md-3">
                    <p>My Share</p>
                </div>
                <div className="col-md-3">
                    <p>Rooms</p>
                </div>
                <div className="col-md-3">
                    <p>Amenities</p>
                </div>
                <div className="col-md-3">
                    <p>Location</p>
                </div>
                <div className="col-md-3">
                    <p>Info</p>
                </div>
            </div>

            <hr />

            <div className="row mt-3">
                <div className="col-md-6">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Animi consequuntur sint reprehenderit amet libero. Animi
                        alias, dignissimos mollitia nesciunt nisi nobis
                        accusamus dolore illo laboriosam facere upiditate
                        similique pariatur odio ut voluptatum dolore, quae
                        beatae alias ad et, neque , quo optio recusandae
                        voluptatibus?
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing it.
                        Maxime neque similique, , tenetur doloremque suscipit?
                    </p>
                </div>
                <div className="col-md-6">
                    <div className="card bg-light p-3">
                        <h3>Select Dates</h3>
                        <table className="table table-bordered mt-3">
                            <thead>
                                <tr>
                                    <th>Check-in</th>
                                    <th>Check-out</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Guest</td>
                                    <td>Guest</td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="btn btn-primary mt-3">
                            <h5>Check Availability</h5>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Booking
