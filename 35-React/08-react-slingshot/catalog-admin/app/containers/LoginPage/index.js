import React from 'react';

import OwlCarousel from 'react-owl-carousel';
import Login from '../../components/Login';
import { redirectToDashboard, isUserLoggedIn } from '../../common/helpers';

import '../../../node_modules/owl.carousel/dist/assets/owl.carousel.css';
import '../../../node_modules/owl.carousel/dist/assets/owl.theme.default.css';

import Slide1 from '../../images/login/slide1.svg';
import Slide2 from '../../images/login/slide2.svg';
import Slide3 from '../../images/login/slide3.svg';

// Import Component Specific Styling
import './LoginPage.scss';

const LoginPage = () => (
  <div className="login-container d-flex">
    <div className="login-container-left d-flex align-items-center justify-content-center">
      <div className="flex-wrapper position-relative">
        <OwlCarousel
          loop
          center
          autoplay
          items={1}
          mouseDrag
          touchDrag
          margin={40}
          nav={false}
          autoplaySpeed={1000}
          autoplayTimeout={5000}
          dotsContainer=".slider-navigation"
        >
          <div className="item">
            <img className="d-block" src={Slide1} alt="First slide" />
            <h3>
              Beautiful representation of
              <br />
              <strong> client specifications</strong>
            </h3>
          </div>
          <div className="item">
            <img className="d-block" src={Slide2} alt="Second slide" />
            <h3>
              The place where you can manage
              <br />
              <strong> your schedule</strong>
            </h3>
          </div>
          <div className="item">
            <img className="d-block" src={Slide3} alt="Third slide" />
            <h3>
              A simple board for viewing
              <br />
              <strong> your work for the day</strong>
            </h3>
          </div>
        </OwlCarousel>
        <div className="slider-navigation" />
      </div>
    </div>
    <div className="login-container-right d-flex align-items-center justify-content-center">
      {isUserLoggedIn() ? redirectToDashboard() : <Login />}
    </div>
  </div>
);

export default LoginPage;
