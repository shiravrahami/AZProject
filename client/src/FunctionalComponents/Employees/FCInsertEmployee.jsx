import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Accordion, Button, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Toast from 'react-bootstrap/Toast';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import '../../Styles/Task.css';
import { useUserContext } from '../UserContext';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default function FCInsertEmployee() {
    const { path } = useUserContext();
    const [setemployee] = useState(null);
    const [EmployeeIDInput, setEmployeeIDInput] = useState();
    const [EmployeeNameInput, setEmployeeNameInput] = useState();
    const [EmployeeEmailInput, setEmployeeEmailInput] = useState();
    const [EmployeePhoneInput, setEmployeePhoneInput] = useState();
    const [EmployeeTitleInput, setEmployeeTitleInput] = useState();
    const [EmployeePasswordInput, setEmployeePasswordInput] = useState();
    const [EmployeePhotoInput, setEmployeePhotoInput] = useState('user.png');
    const [show, setShow] = useState(false);

    const InsertEmployee = async () => {
        const NewEmployee = {
            EmployeeID: EmployeeIDInput,
            EmployeeName: EmployeeNameInput,
            EmployeeEmail: EmployeeEmailInput,
            EmployeePhone: EmployeePhoneInput,
            EmployeeTitle: EmployeeTitleInput,
            EmployeePassword: EmployeePasswordInput,
            EmployeePhoto: "user.png",
        };
        console.log(NewEmployee);

        try {
            const response = await fetch(`${path}InsertEmployee`, {
                method: "PUT",
                body: JSON.stringify(NewEmployee),
                headers: new Headers({
                    'Accept': 'application/json; charset=UTF-8',
                    'Content-type': 'application/json; charset=UTF-8'
                })
            });
            const json = await response.json();
            setemployee(json);
        } catch (error) {
            console.log("error", error);
        }
        setShow(true);
    };

    function generatePassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$_';
        const passwordLength = 8;
        let password = '';

        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        setEmployeePasswordInput(password);
    }

    return (
        <div>
            <Row>
                <Col lg={12}>
                    <Toast style={{ marginBottom: '20px', width: '100%', justifyContent: 'center' }} onClose={() => setShow(false)} show={show} delay={3000} autohide>
                        <Toast.Body style={{ backgroundColor: '#d3ffdf' }}>
                            <FontAwesomeIcon icon={faCheck} />
                            {"  "}העובד נוסף בהצלחה
                        </Toast.Body>
                    </Toast>
                </Col>
            </Row>
            <Form className='taskclass' style={{ borderRadius: '20px ', margin: '20px', padding: '20px', width: '95%' }}>
                <Accordion alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
                    <Accordion.Item>
                        <Accordion.Header style={{ alignItems: 'left', fontSize: '20px' }}>עובד חדש </Accordion.Header>
                        <Accordion.Body >
                            <Row >
                                <Form.Group style={{ textAlign: 'right' }}>
                                    <Form.Label >שם העובד</Form.Label>
                                    <InputGroup>
                                        <FormControl className='input' type="text" onChange={(e) => setEmployeeNameInput(e.target.value)} />
                                    </InputGroup>
                                </Form.Group>
                            </Row >
                            <Row >
                                <Form.Group style={{ textAlign: 'right' }}>
                                    <Form.Label >ת"ז</Form.Label>
                                    <InputGroup>
                                        <FormControl className='input' type="text" onChange={(e) => setEmployeeIDInput(e.target.value)} />
                                    </InputGroup>
                                </Form.Group>
                            </Row >
                            <Row >
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicEmail">
                                    <Form.Label >אימייל</Form.Label>
                                    <InputGroup>
                                        <FormControl style={{ textAlign: 'right' }} className='input' type="email" onChange={(e) => setEmployeeEmailInput(e.target.value)} />
                                    </InputGroup>
                                </Form.Group>
                            </Row >
                            <Row >
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                    <Form.Label>תפקיד</Form.Label>
                                    <Form.Control className='input' type="text" onChange={(e) => setEmployeeTitleInput(e.target.value)} />
                                </Form.Group>
                            </Row >
                            <Row >
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                    <Form.Label>מס' טלפון</Form.Label>
                                    <Form.Control className='input' type="tel" onChange={(e) => setEmployeePhoneInput(e.target.value)} />
                                </Form.Group>
                            </Row >
                            <Row>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                    <Button className='btn-contract' onClick={generatePassword}>צור סיסמה ראשונית</Button>
                                    <Form.Control className='input' type="text" defaultValue={EmployeePasswordInput} />
                                </Form.Group>
                            </Row >
                            <br />
                            <Row>
                                {/* <FloatingLabel
                                    controlId="floatingInput"
                                    label="Email address"
                                    className="mb-3"
                                    style={{textAlign:'right'}}
                                >
                                    <Form.Control type="email" placeholder="name@example.com" />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingPassword" label="Password">
                                    <Form.Control type="password" placeholder="Password" />
                                </FloatingLabel> */}
                            </Row>
                            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button className='btn-gradient-purple' type="button" onClick={InsertEmployee}>הוסף</Button>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Form >
        </div>
    )
}

