import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Row, Col } from 'react-bootstrap';
import '../../Styles/Layout.css';

export default function FCHeader() {
  return (
    <div >
      <div style={{marginRight:"280px",marginTop:'15px', alignContent: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img height={'100px'} src={process.env.PUBLIC_URL + '/‏‏LogoNoText.jpg'} alt="Logo" onClick={() => (window.location.href = 'http://localhost:3000/cgroup95/prod/build/home')} />
      </div>

      {/* <Row>
        <Col lg={1}>
          <div >
            <div style={{ alignItems: 'left', textalign: 'left', height: '30px', margin: '15px', display: 'flex' }}>
              <FontAwesomeIcon icon={faSignOutAlt} onClick={() => (window.location.href = 'https://proj.ruppin.ac.il/cgroup95/prod/build/')} title="התנתק/י" />
            </div>
          </div>
        </Col>
        <Col lg={11}>
          <div>
            <div  style={{  alignContent: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img height={'100px'} src={process.env.PUBLIC_URL + '/‏‏LogoNoText.jpg'} alt="Logo" onClick={() => (window.location.href = '/home')} />
            </div>
          </div>
        </Col>
      </Row> */}
    </div >
  );
}
