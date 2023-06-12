import React, { useState, useContext } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/SignIn.css';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import UserContext from './UserContext';
import { useUserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'


function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useContext(UserContext);
  const { signinUser } = useUserContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const user = {
    Email: email,
    Password: password
  }

  const handleSubmit = () => {
    setIsLoading(true);
    fetch('https://proj.ruppin.ac.il/cgroup95/prod/api/signin', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: new Headers({
        'Accept': 'application/json; charset=UTF-8',
        'Content-type': 'application/json; charset=UTF-8'
      })
    })
      .then(res => {
        console.log('res=', res);
        console.log(res.status);
        if (res.status === 200) {
          return res.json(); // Parse response body as JSON
        }
        else {
          setErrorMessage("אחד מהפרטים אינו נכון");
          setIsLoading(false);
          throw new Error("Server returned status " + res.status);
        }
      })
      .then(data => {
        // Create a new object with the response data
        const userDetails = {
          EmployeePK: data.ID,
          EmployeeID: data.EmployeeID,
          EmployeeName: data.EmployeeName,
          EmployeeEmail: data.EmployeeEmail,
          EmployeePhone: data.EmployeePhone,
          EmployeeTitle: data.EmployeeTitle,
          EmployeePassword: data.EmployeePassword,
          EmployeePhoto: data.EmployeePhoto
          // Add more properties as needed
        };
        console.log("userDetails =", userDetails);
        signinUser(userDetails); // Set the user object in context
        navigate('/home', { state: userDetails }); // Navigate to the home screen

      })
      .catch(error => {
        console.log("Error fetching user data: ", error);
      });
  };
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    setPassword(event.target.value)
  };

  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/building1.png)`,
          backgroundPosition: "center bottom",
          backgroundSize: "cover",
          minHeight: "100vh",
          width: '100%',
          position: "relative",
        }}>

      </div>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.864)",
        zIndex: 1,
      }} />
      <div className='mainsignin' style={{
        backgroundColor: "transparent",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
      }}>
        <img height={'250px'} src={process.env.PUBLIC_URL + '/LogoWithoutDesc.jpg'} alt="Logo" /><br /><br />
        <Form className='signinBox'
          style={{
            borderRadius: '50px',
            padding: '50px',
            backgroundColor: 'white',
            background: "white",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
          }}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            {/* <Form.Label className='labelemail' style={{textAlign: 'right'}}> Email כתובת</Form.Label> */}
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon fontSize={25} className='iconenv' icon={faEnvelope} />
              </InputGroup.Text>
              <FormControl className='input' type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <InputGroup >
              <InputGroup.Text>
                <FontAwesomeIcon fontSize={25} className='iconlock' icon={faLock} />
              </InputGroup.Text>
              <FormControl className='input' type={values.showPassword ? "text" : "password"} placeholder="Password" onChange={handlePasswordChange("password")}
                value={values.password}
                style={{ backgroundColor: 'transparent' }} />
              <InputGroup.Text style={{ padding: '0px' }}>
                <FontAwesomeIcon
                  fontSize={25}
                  className='iconeye'
                  icon={values.showPassword ? faEyeSlash : faEye}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword} />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          {errorMessage && <p style={{ fontSize: '23px', color: 'red' }}>{errorMessage}</p>}
          <div>
            {isLoading ? (
              <div style={{ textAlign: 'center' }} className="loading-icon-container">
                <FontAwesomeIcon icon={faSpinner} spin />
              </div>
            ) : (
              <Button className='btn-gradient-purple' type="button" onClick={handleSubmit}>התחבר</Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
export default SignInScreen;