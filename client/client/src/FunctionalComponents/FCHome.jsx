import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Home.css';
import { useLocation } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';


function HomeScreen(props) {
  const location = useLocation();
  const [setName] = useState('');
  //const user=props.route.params.email;
  const user = location.state && location.state.user;

  const getEmployeeName = () => {
    fetch('http://194.90.158.74/cgroup95/prod/api/EmployeeName', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Accept': 'application/json; charset=UTF-8',
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then((res) => {
        if (res.ok) {
          return res.json() + 'good';
        } 
        else 
        {
          throw new Error('Network response was not ok.');
        }
      })
      .then((data) => {
        setName(data);
        console.log('good');
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };
  const Hello = () => {
    if (user) {
      const { Email, Password } = location.state.user;
      getEmployeeName({ Email, Password });
    } else {
      console.log(user);
      console.log('User not found');
    }
  };
  // const Hello = () => {
  //   if (!location.state || !location.state.user) {
  //     console.log('User not found');
  //     console.log(location.state.user);
  //     return;
  //   }
  //   fetch('http://194.90.158.74/cgroup95/prod/api/EmployeeName', {
  //     method: 'POST',
  //     body: JSON.stringify(location.state.user),
  //     headers: new Headers({
  //       'Accept': 'application/json; charset=UTF-8',
  //       'Content-type': 'application/json; charset=UTF-8'
  //     }),
  //   })
  //     .then((res) => {
  //       return res.json().then((data) => {
  //         // extract the name from the response data
  //         const name = data;
  //         console.log("Name:", name);
  //         // display the name in some way (e.g. set a state variable)
  //         setName(name);
  //       });

  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       // handle errors here
  //     });
  // };
  const GoToSignIn = () => {
    window.location.href = '/';
  }
  return (
    <div>
      <img height={'350px'} src={process.env.PUBLIC_URL + '/LogoWithoutDesc.jpg'} alt="Logo" /><br /><br />
      <button onClick={Hello}> hi </button><br /><br />

      <Button onClick={GoToSignIn}> התנתק </Button>
      <Container>
        <Row>
          <Col xs={12} md={6}>
            <h2>Hello</h2>
          </Col>
        </Row>
        <Row style={{ marginBottom:'10px'}}>
          <Col className='dayBox'style={{ borderRadius: '50px', padding: '50px' }} xs={12}>
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