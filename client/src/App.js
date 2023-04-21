import './App.css';
import SignInScreen from './FunctionalComponents/FCSignin';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import FCHome from './FunctionalComponents/FCHome';
import FCCustomer from './FunctionalComponents/FCCustomer';
import FCCustomers from './FunctionalComponents/FCCustomers';
import FCProfile from './FunctionalComponents/FCProfile';
import FCLayout from './FunctionalComponents/FCLayout';
import UserContext from './FunctionalComponents/UserContext';
import React, { useState } from 'react';
import FCMenu from './FunctionalComponents/FCMenu';

function App() {
  const [user, setUser] = useState(null);
  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignInScreen />} />
            <Route path="/home" element={<FCLayout><FCHome /></FCLayout>} />
            <Route path="/customer" element={<FCLayout><FCCustomer /></FCLayout>} />
            <Route path="/profile" element={<FCLayout><FCProfile /></FCLayout>} />
            <Route path="/customers" element={<FCLayout><FCCustomers /></FCLayout>} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>

    </div>
  );
}

export default App;
