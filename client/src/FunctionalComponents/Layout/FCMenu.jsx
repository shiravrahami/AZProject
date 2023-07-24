import React from 'react';
import { CDBSidebar, CDBSidebarContent, CDBSidebarFooter, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from 'cdbreact';
import { NavLink } from 'react-router-dom';
import '../../Styles/Layout.css';
import { useUserContext } from '../UserContext';

export default function FCMenu() {
    const { user } = useUserContext();

    const renderEmployeesMenuItem = () => {
        if (user.EmployeeEmail === "anat@gmail.com") {
            return (
                <NavLink exact to="/employees" activeClassName="activeClicked">
                    <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="chart-line" textStyle={{ textAlign: 'right' }}>עובדים</CDBSidebarMenuItem>
                </NavLink>
            );
        }
        return <></>; // Return null if user ID is not 6
    };
console.log("user",user);
    return (
        <div>
            <div style={{fontSize:'20px', marginTop: '30px', direction: 'rtl', display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
                <CDBSidebar textColor="black" backgroundColor="white">
                    <CDBSidebarHeader className="text-decoration-none" style={{fontSize:'20px', color: 'black', textalign: 'right' }} prefix={<i className="fa fa-bars fa-large"></i>}>
                        <a href='http://localhost:3000/cgroup95/prod/build' style={{ fontSize: '20px', fontStyle: 'normal', color: 'gray' }}>התנתק/י</a><br />
                        שלום {user.EmployeeName}
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
                                <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="users" textStyle={{ textalign: 'right' }}>לקוחות</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink exact to="/tasks" activeclassname="activeClicked">
                                <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="chart-line" textStyle={{ textalign: 'right' }}>משימות</CDBSidebarMenuItem>
                            </NavLink>
                            <NavLink exact to="/projects" activeclassname="activeClicked">
                                <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="chart-line" textStyle={{ textalign: 'right' }}>פרויקטים</CDBSidebarMenuItem>
                            </NavLink>
                            
                            <NavLink exact to="/notes" activeclassname="activeClicked">
                                <CDBSidebarMenuItem style={{ justifyContent: 'flex-end' }} icon="chart-line" textStyle={{ textalign: 'right' }}>פתקים</CDBSidebarMenuItem>
                            </NavLink>
                            {renderEmployeesMenuItem()}
                        </CDBSidebarMenu>
                    </CDBSidebarContent>
                    <CDBSidebarFooter style={{ textalign: 'center' }}>
                    </CDBSidebarFooter>
                </CDBSidebar>
            </div>
        </div>
    )
}
