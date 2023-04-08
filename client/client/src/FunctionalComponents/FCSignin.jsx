import React, { useState } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/SignIn.css';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const user = {
        Email: email,
        Password: password
    }
    // // useEffect(() => {
    // //     if (user) {
    // //         console.log('user', user);
    // //     }
    // // }, [user]);

    const handleSubmit = () => {
        fetch('http://194.90.158.74/cgroup95/prod/api/signin', {
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
                    console.log("good");
                    window.location.href = '/home';
                    //const { history, user } = this.props;
                    // history.push({
                    //     pathname: '/home',
                    //     state: { user }
                    // }
                    // )
                    ;
                 //   navigation.navigate("HomeScreen",{email})
                }
                else {
                    setErrorMessage("אחד מהפרטים אינו נכון");
                }
                // return res.json()
            })
            .then(
                (result) => {
                    console.log("fetch POST= ", result);
                    //   alert("Login Very Good :) ");
                },
                (error) => {
                    console.log("err post=", error);
                    // alert("Login Very Bad :( ");
                });
    }
    return (
        <div>
            <img height={'350px'} src={process.env.PUBLIC_URL + '/LogoWithoutDesc.jpg'} alt="Logo" /><br /><br />
            <Form >
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
                    {/* <Form.Label style={{textAlign: 'right'}}>סיסמה</Form.Label> */}
                    <InputGroup>
                        <InputGroup.Text>
                            <FontAwesomeIcon fontSize={25} className='iconlock' icon={faLock} />
                        </InputGroup.Text>
                        <FormControl className='input' type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </InputGroup>
                </Form.Group>

                {errorMessage && <p style={{ fontSize: '23px', color: 'red' }}>{errorMessage}</p>}
                {/* <Link to={{
                    pathname: '/home',
                    state: {
                        user: {
                            Email: email,
                            Password: password
                        }
                    }
                }}>
            </Link> */}
            <Button className='btn-gradient-purple' type="button" onClick={handleSubmit}>התחבר</Button>
            </Form>
        </div>
    );
}
export default SignInScreen;