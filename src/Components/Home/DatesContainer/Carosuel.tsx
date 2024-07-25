
import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../DatesContainer/Carosuel.css';
export function Carosuel() {
  return (
    <Carousel>
      <Carousel.Item className='Carosel_item'>
        <img
          className="d-block w-50  bg-primary"
          src="../../../assets/360_F_618250056_g38let6mZ4nPHPVp9YE33XNFAyP2cHSP.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className='Carosel_item'>
        <img
          className="d-block w-50  bg-secondary"
          src="holder.js/800x400?text=Second slide"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className='Carosel_item'>
        <img
          className="d-block w-50  bg-success"
          src="holder.js/800x400?text=Third slide"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Carosuel;

