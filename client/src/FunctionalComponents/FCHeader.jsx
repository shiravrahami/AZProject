import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Row, Col } from 'react-bootstrap';

import { CDBSidebar, CDBSidebarContent, CDBSidebarFooter, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
import { NavLink } from 'react-router-dom';

export default function FCHeader() {
  return (
    <div>
      <Row className='blah' style={{ display: 'flex', boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.25)' }} >
        <Col>
          <div >
            <div style={{ alignItems: 'left', textAlign: 'left', height: '30px', margin: '15px', display: 'flex' }}>
              <FontAwesomeIcon
                icon={faSignOutAlt}
                onClick={() => (window.location.href = '/')}
                title="התנתק/י"
              />
            </div>
          </div>
        </Col>
        <Col>
          <div>
            <div style={{ alignContent: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                height={'100px'}
                src={process.env.PUBLIC_URL + '/‏‏LogoNoText.jpg'}
                alt="Logo"
                onClick={() => (window.location.href = '/home')}
              />
            </div>
          </div>
        </Col>
        <Col>
          <div>
            <div style={{ direction: 'rtl', display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
              <CDBSidebar textColor="black" backgroundColor="white">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                  <a href="/" className="text-decoration-none" style={{ color: 'black' }}> תפריט </a>
                </CDBSidebarHeader>
                <CDBSidebarContent className="sidebar-content" textColor="black" direction='rtl'>
                  <CDBSidebarMenu direction='rtl'>
                    <NavLink direction='rtl' exact to="/home" activeClassName="activeClicked">
                      <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="home" textStyle={{ textAlign: 'right' }}>בית</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/profile" activeClassName="activeClicked">
                      <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="user" textStyle={{ textAlign: 'right' }}>פרופיל אישי</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/customers" activeClassName="activeClicked">
                      <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="user" textStyle={{ textAlign: 'right' }}>לקוחות</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/" activeClassName="activeClicked">
                      <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="chart-line" textStyle={{ textAlign: 'right' }}>עובדים</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/" activeClassName="activeClicked">
                      <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="chart-line" textStyle={{ textAlign: 'right' }}>דו"חות</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink exact to="/" activeClassName="activeClicked">
                      <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="chart-line" textStyle={{ textAlign: 'right' }}>פתקים</CDBSidebarMenuItem>
                    </NavLink>
                  </CDBSidebarMenu>
                </CDBSidebarContent>
                <CDBSidebarFooter style={{ textAlign: 'center' }}>
                  <div style={{ padding: '20px 5px' }} > Sidebar Footer </div>
                </CDBSidebarFooter>
              </CDBSidebar>
            </div>
          </div>
        </Col>
      </Row>
    </div >
  );
}
