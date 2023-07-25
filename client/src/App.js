import './App.css';
import SignInScreen from './FunctionalComponents/FCSignin';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import FCHome from './FunctionalComponents/FCHome';
import FCCustomer from './FunctionalComponents/Customers/FCCustomer';
import FCCustomers from './FunctionalComponents/Customers/FCCustomers';
import FCProfile from './FunctionalComponents/Employees/FCProfile';
import FCLayout from './FunctionalComponents/Layout/FCLayout';
import {UserProvider} from './FunctionalComponents/UserContext';
import React, { useState } from 'react';
import FCTasks from './FunctionalComponents/Tasks/FCTasks';
import FCemployees from './FunctionalComponents/Employees/FCEmployees';
import FCTest from './FunctionalComponents/FCTest';
import FCProjects from './FunctionalComponents/Projects/FCProjects';
import FCProject from './FunctionalComponents/Projects/FCProject';
import FCTask from './FunctionalComponents/Tasks/FCTask';
import FCInsertPriceQuote from './FunctionalComponents/Customers/FCInsertPriceQuote';
import FCInsertEmployee from './FunctionalComponents/Employees/FCInsertEmployee';
import FCInsertProject from './FunctionalComponents/Projects/FCInsertProject';
import FCNotes from './FunctionalComponents/FCNotes';
import PDFContent from './FunctionalComponents/Customers/PDFContent';
import FCInsertTask from './FunctionalComponents/Tasks/FCInsertTask';

//import Test from './FunctionalComponents/Customers/test';
function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter basename="/cgroup95/prod/build">
          <Routes>
            <Route path="/" element={<SignInScreen />} />
            <Route path="/home" element={<FCLayout><FCHome /></FCLayout>} />
            <Route path="/profile" element={<FCLayout><FCProfile /></FCLayout>} />
            <Route path="/customer" element={<FCLayout><FCCustomer /></FCLayout>} />
            <Route path="/customers" element={<FCLayout><FCCustomers /></FCLayout>} />
            <Route path="/tasks" element={<FCLayout><FCTasks /></FCLayout>} />
            <Route path="/task" element={<FCLayout><FCTask /></FCLayout>} />
            <Route path="/projects" element={<FCLayout><FCProjects /></FCLayout>} />
            <Route path="/employees" element={<FCLayout><FCemployees /></FCLayout>} />
            <Route path="/project" element={<FCLayout><FCProject /></FCLayout>} />
            <Route path="/newcustomer" element={<FCLayout><FCInsertPriceQuote /></FCLayout>} />
            <Route path="/newproject" element={<FCLayout><FCInsertProject /></FCLayout>} />
            <Route path="/newemployee" element={<FCLayout><FCInsertEmployee /></FCLayout>} />
            <Route path="/notes" element={<FCLayout><FCNotes /></FCLayout>} />
            <Route path="/pdfcontent" element={<FCLayout><PDFContent /></FCLayout>} />
            <Route path="/newTask" element={<FCLayout><FCInsertTask /></FCLayout>} />            
          </Routes>
        </BrowserRouter>
      </UserProvider>
      
    </div>
  );
}

export default App;
