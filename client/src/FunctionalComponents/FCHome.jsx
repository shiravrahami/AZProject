import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Home.css';
import { Button, Container } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import UserContext from './UserContext';
import { useUserContext } from './UserContext';
import { storage } from '../firebase';

function HomeScreen(props) {

  const { user, path } = useUserContext();
  console.log('home: ' + user.EmployeeName);
  console.log('path: ' + path);

  const GoToSignIn = () => {
    window.location.href = '/';
  }

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (image) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get the upload progress
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // Handle any upload errors
          console.log(error);
        },
        () => {
          // Handle successful upload
          storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              // Do something with the image URL
              console.log(url);
            });
        }
      );
    }
  };


  return (
    <div>
      <br />
      <br />
      <h1 style={{ fontSize: "100px" }} >:) בשיפוצים</h1>
      <div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      {/* <img height={'350px'} src={process.env.PUBLIC_URL + '/LogoWithoutDesc.jpg'} alt="Logo" /><br /><br />
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
      </Container> */}
    </div>
  );
}
export default HomeScreen;