import './App.css';
import SignInScreen from './FunctionalComponents/FCSignin';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import FCHome from './FunctionalComponents/FCHome';
import FCCustomer from './FunctionalComponents/FCCustomer';
import FCCustomers from './FunctionalComponents/FCCustomers';
import FCProfile from './FunctionalComponents/FCProfile';
import FCLayout from './FunctionalComponents/FCLayout';
import {UserProvider} from './FunctionalComponents/UserContext';
import React, { useState } from 'react';
import FCTasks from './FunctionalComponents/FCTasks';
import FCemployees from './FunctionalComponents/FCEmployees';
import FCTest from './FunctionalComponents/FCTest';
import FCProjects from './FunctionalComponents/FCProjects';
import FCProject from './FunctionalComponents/FCProject';
import FCTask from './FunctionalComponents/FCTask';


function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
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
            <Route path="/test" element={<FCTest />} />
            <Route path="/project" element={<FCLayout><FCProject /></FCLayout>} />

          </Routes>
        </BrowserRouter>
      </UserProvider>

    </div>
  );
}

export default App;
