import React, { useState } from 'react';
import { Accordion, Button, InputGroup, FormControl, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Customer.css';
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';


export default function FCCustomer() {
    return (
        <div className='fccust'>
            <Row>
                <Col className='imgLogo' style={{ display: 'flex', justifyContent: 'center' }}>
                    <img style={{ width: '20%' }} src={process.env.PUBLIC_URL + '/LogoWithoutDesc.jpg'} alt="Logo" /><br /><br />
                </Col>
            </Row>
            {/* <Row>
                <Col className='projclass' style={{ borderRadius: '30px ', margin: '20px', padding: '20px' }}>
                    <Row className="align-items-center">
                        <Col xs={4}>
                            <Form style={{ textAlign: 'right' }}>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicEmail">
                                    <Form.Label style={{ textAlign: 'right' }}>כתובת אי-מייל</Form.Label>
                                    <InputGroup>
                                        <FormControl className='input' type="email" placeholder="Email" />
                                    </InputGroup>
                                </Form.Group>

                                <Form.Label>מספר טלפון</Form.Label>
                                <InputGroup>
                                    <FormControl className='input' type="tel" placeholder="050-0000000" onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }} />
                                </InputGroup><br />
                                <Form.Group controlId="CustType">
                                    <Form.Select style={{ textAlign: 'right', paddingTop: '14.3px' }}>
                                        <option value="1">סוג לקוח</option>
                                        <option value="2">ניהול</option>
                                        <option value="3">עיצוב</option>
                                        <option value="3">פיתוח</option>
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col xs={4}>
                            <Form style={{ textAlign: 'right' }}>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicEmail">
                                    <Form.Label >שם הלקוח</Form.Label>
                                    <InputGroup>
                                        <FormControl style={{ textAlign: 'right' }} className='input' type="text" placeholder="שם הלקוח" />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                    <Form.Label className='id' >ח"פ/ ת"ז</Form.Label>
                                    <InputGroup>
                                        <FormControl style={{ textAlign: 'right' }} className='input' type="tel" placeholder='ח"פ/ ת"ז' onKeyPress={(event) => {
                                            if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }} />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                    <Form.Label>כתובת</Form.Label>
                                    <InputGroup>
                                        <FormControl style={{ textAlign: 'right' }} className='input' type="text" placeholder="כתובת" />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col xs={4} style={{ textAlign: 'left' }}>
                            <Button className='btn-contract' type="button">עותק חוזה</Button>
                            <br />
                            <Button className='btn-price' type="button">עותק הצעת מחיר</Button>
                            <br />
                            <Button className='btn-gradient-purple' type="button">עדכן</Button>
                        </Col>
                    </Row>
                </Col>
            </Row > */}
            <Form className='projclass' style={{ borderRadius: '20px ', margin: '20px', padding: '20px' }}>
                <Accordion defaultActiveKey={['0']} alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header style={{ alignItems: 'left', fontSize: '20px' }}>פרטי לקוח</Accordion.Header>
                        <Accordion.Body >
                            <Row >
                                <Col >
                                    <Form.Group style={{ textAlign: 'right' }}>
                                        <Form.Label >כתובת אי-מייל</Form.Label>
                                        <InputGroup>
                                            <FormControl className='input' type="email" placeholder="Email" />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }}>
                                        <Form.Label>מספר טלפון</Form.Label>
                                        <InputGroup style={{ textAlign: 'right' }}>
                                            <FormControl className='input' type="tel" placeholder="050-0000000" onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }} />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                        <Form.Label>סוג לקוח</Form.Label>
                                        <Form.Select style={{ fontSize: '20px', textAlign: 'right' }}>
                                            <option value="1">פיתוח</option>
                                            <option value="2">ניהול</option>
                                            <option value="3">עיצוב</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicEmail">
                                        <Form.Label >שם הלקוח</Form.Label>
                                        <InputGroup>
                                            <FormControl style={{ textAlign: 'right' }} className='input' type="text" placeholder="שם הלקוח" />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                        <Form.Label className='id' >ח"פ/ ת"ז</Form.Label>
                                        <InputGroup>
                                            <FormControl style={{ textAlign: 'right' }} className='input' type="tel" placeholder='ח"פ/ ת"ז' onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }} />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                        <Form.Label>כתובת</Form.Label>
                                        <InputGroup>
                                            <FormControl style={{ textAlign: 'right' }} className='input' type="text" placeholder="כתובת" />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>

                            </Row>
                            <Row>
                                <Col>
                                    <Button className='btn-contract' type="button">עותק חוזה</Button>
                                </Col>
                                <Col style={{textAlign: "center"}}>
                                    <Button className='btn-gradient-purple_Customer' type="button">עדכן</Button>
                                </Col>
                                <Col style={{ textAlign: 'left' }}>
                                    <Button className='btn-price' type="button">עותק הצעת מחיר</Button>
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Form>
            <Row>
                <Col className='projclass' style={{ borderRadius: '20px ', margin: '20px', padding: '20px' }}>
                    פרויקטים
                    <Accordion className="accordionProj" style={{ direction: 'rtl' }}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header >
                                <span style={{ textAlign: 'right' }}>פרויקט 1</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <span>פרויקט 1</span>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>פרויקט 2</Accordion.Header>
                            <Accordion.Body>
                                פרויקט 2
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>פרויקט 2</Accordion.Header>
                            <Accordion.Body>
                                פרויקט 2
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>פרויקט 2</Accordion.Header>
                            <Accordion.Body>
                                פרויקט 2
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>פרויקט 2</Accordion.Header>
                            <Accordion.Body>
                                פרויקט 2
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>

            </Row>
        </div >

    )
}
