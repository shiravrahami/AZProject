import './App.css';
import SignInScreen from './FunctionalComponents/FCSignin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FCHome from './FunctionalComponents/FCHome';
import FCProfile from './FunctionalComponents/FCProfile';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
      <BrowserRouter>
        <Routes>
          <Route path="/Noam" element={<SignInScreen />} />
          <Route path="/" element={<SignInScreen />} />
          <Route path="/home" element={<FCHome />} />
          <Route path="/profile" element={<FCProfile />} />
        </Routes>
      </BrowserRouter>
      {/* <SignInScreen/> */}
      {/* </header> */}

    </div>
  );
}

export default App;
