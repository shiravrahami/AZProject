import React, { useState, useEffect , useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Home.css';
import { Button, Container } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import UserContext from './UserContext';
import { useUserContext } from './UserContext';

function HomeScreen(props) {

  const { user } = useUserContext();

  // const {state} = useLocation();
  // let userDetails = state;
    
  console.log('home: '+user.EmployeeName);

  const GoToSignIn = () => {
    window.location.href = '/';
  }
  return (
    <div>
      {/* <img height={'350px'} src={process.env.PUBLIC_URL + '/LogoWithoutDesc.jpg'} alt="Logo" /><br /><br /> */}
      <Container>
        <Row>
          <Col xs={12} md={6}>
            <h2>Hello, {user.EmployeeName}</h2>
            
          </Col>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Col className='dayBox' style={{ borderRadius: '50px', padding: '50px' }} xs={12}>
            <ul style={{ display: 'flex', listStyle: 'none', margin: '0', padding: '0' }}>
              <li>Monday</li>
              <li>Tuesday</li>
              <li>Wednesday</li>
              <li>Thursday</li>
              <li>Friday</li>
              <li>Saturday</li>
              <li>Sunday</li>
            </ul>
          </Col>
        </Row>
        <Row >
          <Col className='tasksBox' xs={12}>
            <p>task</p>
          </Col>
        </Row>
        <Row >
          <Col className='eventsBox' xs={12}>
            <p>event</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default HomeScreen;