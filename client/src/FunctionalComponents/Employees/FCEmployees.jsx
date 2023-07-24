import React, { useState, useEffect } from 'react';
import { Accordion, Button, InputGroup, FormControl, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Styles/Employees.css';
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useUserContext } from '../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

export default function FCemployees() {
    const { path } = useUserContext();
    const [employees, setemployees] = useState([]);
    const [setemployeesDel] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [showPassword, setShowPassword] = useState({});
    const navigate = useNavigate();

    const togglePassword = (employeeId) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [employeeId]: !prevState[employeeId],
        }));
    };

    const handleSearch = (event) => {
        setSearchValue(event.target.value);
    };

    function deleteemployees(ID) {
        console.log("delete " + ID);
        try {
            const response = fetch(
                `${path}Listemployees/${ID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            const json = response.json();
            setemployeesDel(json);
        } catch (error) {
            console.log("error");
        }
    }

    useEffect(() => {
        async function fetchemployees() {
            try {
                const response = await fetch(`${path}ListEmployees`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });
                const json = await response.json();
                setemployees(json || []);
            } catch (error) {
                console.error(error);
            }
        }
        fetchemployees();
    }, []);

    function newEmp() {
        navigate('/newemployee')
    }

    return (
        <div>
            <Button className="floating-button"
                onClick={newEmp}>
                <FontAwesomeIcon icon={faPlus} title="הוספת עובד" />
            </Button>
            <div className='emptable'>
                <Row>
                    <Form
                        // style={{ width: '1250px', borderRadius: '20px ', margin: '20px', padding: '20px' }}
                        style={{ width: '95%', borderRadius: '30px ', margin: '20px', padding: '20px', backgroundColor: 'rgb(247, 247, 247)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
                    >
                        <Accordion defaultActiveKey={['0']} alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }} flush>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header style={{ backgroundColor: '#f7f7f7', alignItems: 'left', fontSize: '20px' }}>עובדים</Accordion.Header>
                                <Accordion.Body style={{ backgroundColor: '#f7f7f7' }}>
                                    <Row>
                                        <Col>
                                            <div className="search-bar">
                                                <div className="input-group">
                                                    <Form.Control type="text" placeholder="חיפוש עובד" className='serachinput' style={{ backgroundColor: '#f7f7f7' }} onChange={handleSearch} />
                                                    <div className="input-group-append" >
                                                        <span className="input-group-text" style={{ backgroundColor: '#f7f7f7' }}>
                                                            <FontAwesomeIcon icon={faSearch} />
                                                            {/* <Button className="btn-link">
                                                            <FontAwesomeIcon icon={faEllipsisV} />
                                                        </Button> */}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Form>
                </Row>
                <Row className='titles' style={{ textAlign: 'center', fontSize: '23px' }}>
                    <Col style={{ textAlign: 'center' }} lg={2}>
                        שם העובד
                    </Col>
                    <Col style={{ textAlign: 'center' }} lg={1}>
                        ת"ז
                    </Col>
                    <Col style={{ textAlign: 'center' }} lg={3}>
                        אימייל
                    </Col>
                    <Col style={{ textAlign: 'center' }} lg={2}>
                        מס' טלפון
                    </Col>
                    <Col style={{ textAlign: 'right', marginLeft: '5px' }} lg={2}>
                        תפקיד
                    </Col>
                    {/* <Col style={{ textAlign: 'center' }} lg={2}>
                        סיסמה
                    </Col> */}
                    <Col style={{ textAlign: 'center' }} lg={2}>
                    </Col>
                </Row>
                <Row style={{ textAlign: 'right', marginRight: '10px' ,fontSize: '20px' }}>
                    {employees
                        .filter((employee) => employee.EmployeeName.includes(searchValue))
                        .map((employee) => (
                            <Row className="employee-row" key={employee.EmployeeName}>
                                <Col lg={1}></Col>
                                <Col className="empname employee-col" lg={2}>
                                    {employee.EmployeeName}
                                </Col>
                                <Col className="employee-col" lg={1}>{employee.EmployeeID}</Col>
                                <Col className="employee-col" style={{ textAlign: 'center' }} lg={3}>{employee.EmployeeEmail}</Col>
                                <Col className="employee-col" style={{ textAlign: 'center' }} lg={2}>{employee.EmployeePhone}</Col>
                                <Col className="employee-col" lg={2}>{employee.EmployeeTitle}</Col>
                                {/* <Col className="employee-col" lg={2} style={{ marginLeft: '1px', width: '250px' }}>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <InputGroup style={{ textAlign: 'center' }}>
                                            <InputGroup.Text style={{ padding: '0px' }}>
                                                <FontAwesomeIcon
                                                    className='eyeicon'
                                                    icon={showPassword[employee.ID] ? faEyeSlash : faEye}
                                                    onClick={() => togglePassword(employee.ID)}
                                                />
                                            </InputGroup.Text>
                                            <FormControl className="passwordInput"
                                                style={{ fontSize: '28.74px', fontFamily: 'Calibri' }}
                                                type={showPassword[employee.ID] ? 'text' : 'password'}
                                                value={employee.EmployeePassword}
                                                readOnly />
                                        </InputGroup>
                                    </Form.Group>
                                </Col> */}
                                <Col className="employee-col" lg={1}>
                                    <Button className="trash" onClick={() => {
                                        deleteemployees(employee.ID);
                                        setemployees(employees.filter((c) => c.ID !== employee.ID));
                                    }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                </Row>
            </div >
        </div>

    )
}