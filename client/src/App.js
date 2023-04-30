import './App.css';
import SignInScreen from './FunctionalComponents/FCSignin';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import FCHome from './FunctionalComponents/FCHome';
import FCCustomer from './FunctionalComponents/FCCustomer';
import FCCustomers from './FunctionalComponents/FCCustomers';
import FCProfile from './FunctionalComponents/FCProfile';
import FCLayout from './FunctionalComponents/FCLayout';
import UserContext from './FunctionalComponents/UserContext';
import {UserProvider} from './FunctionalComponents/UserContext';
import React, { useState } from 'react';
import FCMenu from './FunctionalComponents/FCMenu';
import FCTasks from './FunctionalComponents/FCTasks';
import FCProjects from './FunctionalComponents/FCProjects';
import FCemployees from './FunctionalComponents/FCEmployees';
import FCTest from './FunctionalComponents/FCTest';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignInScreen />} />
            <Route path="/home" element={<FCLayout><FCHome /></FCLayout>} />
            <Route path="/customer" element={<FCLayout><FCCustomer /></FCLayout>} />
            <Route path="/profile" element={<FCLayout><FCProfile /></FCLayout>} />
            <Route path="/customers" element={<FCLayout><FCCustomers /></FCLayout>} />
            <Route path="/tasks" element={<FCLayout><FCTasks /></FCLayout>} />
            <Route path="/projects" element={<FCLayout><FCProjects /></FCLayout>} />
            <Route path="/employees" element={<FCLayout><FCemployees /></FCLayout>} />
            <Route path="/test" element={<FCTest />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>

    </div>
  );
}

export default App;
