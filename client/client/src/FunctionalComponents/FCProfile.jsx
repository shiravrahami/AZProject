import React, { useState, useEffect } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/SignIn.css';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap';
import FCLayout from './FCLayout';

export default function FCProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState({
        EmployeeName: '',
        EmployeeEmail: '',
        EmployeeID: '',
        EmployeePhone: ''
    });

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };


    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            const response = await fetch('http://194.90.158.74/cgroup95/prod/api/EmployeeDetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setEmployeeDetails(data);
            }
        };

        fetchEmployeeDetails();
    }, []);

    return (
        <div className='container'>
            <Row>
                <Col style={{ borderRadius: '30px ', margin: '20px', padding: '20px', backgroundColor: 'rgb(247, 247, 247)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                    <Form>

                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ textAlign: 'right', fontSize: 30 }}>
                            <Form.Label className='labelemail'> שם עובד</Form.Label>
                            <InputGroup>
                                <FormControl className='input' disabled={!isEditing} type="text" placeholder="שם עובד" style={{ textAlign: 'right', fontSize: 20 }} value={employeeDetails.EmployeeName} onChange={(e) => setEmployeeDetails({ ...employeeDetails, EmployeeName: e.target.value })} />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ textAlign: 'right', fontSize: 30 }}>
                            <Form.Label className='labelemail'> Email</Form.Label>
                            <InputGroup>
                                <FormControl className='input' disabled={!isEditing} type="email" style={{ textAlign: 'right', fontSize: 20 }} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" value={employeeDetails.EmployeeEmail} onChange={(e) => setEmployeeDetails({ ...employeeDetails, EmployeeEmail: e.target.value })} />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ textAlign: 'right', fontSize: 30 }}>
                            <Form.Label className='labelemail'> תעודת זהות</Form.Label>
                            <InputGroup>
                                <FormControl className='input' disabled={!isEditing} type="tel" placeholder="תעודת זהות" style={{ textAlign: 'right', fontSize: 20 }} value={employeeDetails.EmployeeID} onChange={(e) => setEmployeeDetails({ ...employeeDetails, EmployeeID: e.target.value })} />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ textAlign: 'right', fontSize: 30 }}>
                            <Form.Label className='labelemail'>מספר טלפון</Form.Label>
                            <InputGroup>
                                <FormControl className='input' disabled={!isEditing} type="tel" placeholder="מספר טלפון" style={{ textAlign: 'right', fontSize: 20 }} value={employeeDetails.EmployeePhone} onChange={(e) => setEmployeeDetails({ ...employeeDetails, EmployeePhone: e.target.value })} />
                            </InputGroup>
                        </Form.Group>

                    </Form>
                </Col>
                <Col style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src={process.env.PUBLIC_URL + '/WhatsApp Image 2023-03-30 at 13.37.30.jpeg'}
                            alt='profile_picture'
                            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                        />
                        <label style={{ marginTop: '10px', fontSize: '30px' }}>Hello Anat</label>
                    </div>
                </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Button className='btn-gradient-purple' type="button" onClick={handleEditClick}>
                    {isEditing ? "שמירה" : "עריכה"}
                </Button>

            </Row>
        </div>
    )
}
