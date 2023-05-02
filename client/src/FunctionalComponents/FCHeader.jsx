import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Row, Col } from 'react-bootstrap';
import '../Styles/Layout.css';

import { CDBSidebar, CDBSidebarContent, CDBSidebarFooter, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from './UserContext';

export default function FCHeader() {
  const { userDetails } = useContext(UserContext);

  console.log(userDetails);
  return (
    <div >
      <Row>
        <Col lg={1}>
          <div >
            <div  style={{ alignItems: 'left', textalign: 'left', height: '30px', margin: '15px', display: 'flex' }}>
              <FontAwesomeIcon icon={faSignOutAlt} onClick={() => (window.location.href = 'cgroup95/prod/build/')} title="התנתק/י" />
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
      </Row>
    </div >
  );
}
