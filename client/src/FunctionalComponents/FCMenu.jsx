import React from 'react';
import { CDBSidebar, CDBSidebarContent, CDBSidebarFooter, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
import { NavLink } from 'react-router-dom';
import '../Styles/Layout.css';

export default function FCMenu() {
    return (
                <div>
                    <div style={{ marginTop:'30px',direction: 'rtl', display: 'flex', height: '100vh', overflow: 'scroll initial'}}>
                        <CDBSidebar textColor="black" backgroundColor="white">
                            <CDBSidebarHeader className="text-decoration-none" style={{ color: 'black' }} prefix={<i className="fa fa-bars fa-large"></i>}>
                                תפריט
                            </CDBSidebarHeader>
                            <CDBSidebarContent className="sidebar-content" textColor="black" direction='rtl'>
                                <CDBSidebarMenu className="sidebar-menu" direction='rtl'>
                                    <NavLink textalign='right' direction='rtl' exact to="/home" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem icon="home">
                                            <span className='text' textalign='right'>בית</span>
                                        </CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink exact to="/profile" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="user" textStyle={{ textalign: 'right' }}>פרופיל אישי</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink exact to="/customers" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="user" textStyle={{ textalign: 'right' }}>לקוחות</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink exact to="/tasks" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="chart-line" textStyle={{ textalign: 'right' }}>משימות</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink exact to="/projects" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="chart-line" textStyle={{ textalign: 'right' }}>פרויקטים</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink exact to="/employees" activeclassname="activeClicked">
                                        <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="chart-line" textStyle={{ textalign: 'right' }}>עובדים</CDBSidebarMenuItem>
                                    </NavLink>
                                </CDBSidebarMenu>
                            </CDBSidebarContent>
                            <CDBSidebarFooter style={{ textalign: 'center' }}>
                                <div style={{ padding: '20px 5px' }} > Sidebar Footer </div>
                            </CDBSidebarFooter>
                        </CDBSidebar>
                    </div>
                </div>
    )
}
