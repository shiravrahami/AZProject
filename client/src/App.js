import './App.css';
import SignInScreen from './FunctionalComponents/FCSignin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FCHome from './FunctionalComponents/FCHome';
import FCCustomer from './FunctionalComponents/FCCustomer';
import FCCustomers from './FunctionalComponents/FCCustomers';
import FCProfile from './FunctionalComponents/FCProfile';
import FCLayout from './FunctionalComponents/FCLayout';
import UserContext from './FunctionalComponents/UserContext';
import React, { useState } from 'react';


function App() {
  const [user, setUser] = useState(null);
  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<FCLayout><SignInScreen /></FCLayout>} />
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
