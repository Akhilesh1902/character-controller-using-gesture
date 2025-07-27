import React from 'react';
import VideoStream from './VideoStream';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ThreejsWrapper from './ThreejsWrapper';
import palm from './img/palm.png';
import victory from './img/victory.png';
import yoo from './img/yoo.png';
import thumbs_up from './img/thumb.png';

function GestureWrapper() {
  return (
    <div>
      <div className='app_container'>
        <Link
          style={{ padding: '10px 36px' }}
          to='/'
          className='backArrow'>
          <i className='bx bx-arrow-back'></i>
        </Link>
        <ToastContainer />
        <div className='instruction'>
          <h1>Instructions :</h1>
          <ul>
            <li>
              <img
                src={palm}
                alt=''
              />
              <p>Palm : Front</p>
            </li>
            <li>
              <img
                src={victory}
                alt=''
              />
              <p>Victory : Back</p>
            </li>
            <li>
              <img
                src={thumbs_up}
                alt=''
              />
              <p>Thumbs Up : left or right</p>
            </li>
          </ul>
        </div>
        <div className='CanvasContainer'>
          <ThreejsWrapper />
        </div>
        <VideoStream />
      </div>
    </div>
  );
}

export default GestureWrapper;
