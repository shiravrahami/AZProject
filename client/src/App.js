import './App.css';
import SignInScreen from './FunctionalComponents/FCSignin';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import FCHome from './FunctionalComponents/FCHome';
import FCCustomer from './FunctionalComponents/FCCustomer';
import FCCustomers from './FunctionalComponents/FCCustomers';
import FCProfile from './FunctionalComponents/FCProfile';
import FCLayout from './FunctionalComponents/FCLayout';
import UserContext from './FunctionalComponents/UserContext';
import { UserProvider } from './FunctionalComponents/UserContext';
import React, { useState } from 'react';
import FCMenu from './FunctionalComponents/FCMenu';
import FCTask from './FunctionalComponents/FCTask';
import FCTasks from './FunctionalComponents/FCTasks';
import FCProjects from './FunctionalComponents/FCProjects';
import FCProject from './FunctionalComponents/FCProject';

function App() {
  const [user, setUser] = useState(null);
  return (
    <div className="App">
      <UserProvider >
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
            <Route path="/project" element={<FCLayout><FCProject /></FCLayout>} />

          </Routes>
        </BrowserRouter>
      </UserProvider>

    </div>
  );
}

export default App;
