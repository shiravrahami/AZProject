import React from 'react';
import { CDBSidebar, CDBSidebarContent, CDBSidebarFooter, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
import { NavLink } from 'react-router-dom';

export default function FCMenu() {
    return (
        <div style={{marginTop:'30px', direction: 'rtl', display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
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
    );
};
