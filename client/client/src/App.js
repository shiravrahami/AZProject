import './App.css';
import SignInScreen from './FunctionalComponents/FCSignin';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FCHome from './FunctionalComponents/FCHome';
import FCProfile from './FunctionalComponents/FCProfile';
import FCLayout from './FunctionalComponents/FCLayout';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignInScreen />} />
          <Route path="/home" element={<FCHome />} />
          <Route path="/profile" element={<FCLayout><FCProfile /></FCLayout>} />
     

        </Routes>
      </BrowserRouter>
      {/* <SignInScreen/> */}
      {/* </header> */}
 {/* <FCLayout/> */}
    </div>
  );
}

export default App;
