import React, { useState, useEffect } from 'react';
import { Accordion, Button, InputGroup, FormControl, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Employees.css';
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import { useUserContext } from './UserContext';

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

export default function FCemployees() {

    const [employees, setemployees] = useState([]);
    const [employeesDay, setemployeesDay] = useState([]);
    const [setemployeesDel] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [switchon, setswitchon] = useState(false);

    const [password, setPassword] = useState('');

    const { user } = useUserContext();

    const handleSearch = (event) => {
        setSearchValue(event.target.value);
    };

    function deleteemployees(ID) {
        console.log("delete "+ ID);
        try {
            const response = fetch(
                `https://194.90.158.74/cgroup95/prod/api/Listemployees/${ID}`,
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
                const response = await fetch(`http://194.90.158.74/cgroup95/prod/api/ListEmployees`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });
                const json = await response.json();
                setemployees(json || []); // make sure employees is always an array
            } catch (error) {
                console.error(error);
            }
        }
        fetchemployees();
        //         console.log("first get" + " " +employees[1].EmployeeName+ " "+employees[1].EmployeeEmail+ " "+employees.EmployeePhone+ " "+employees.EmployeeTitle+ " "+employees.EmployeePassword)
    }, []);

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
        <div className='custtable'>
            <Row>
                <Form className='projclass' style={{ width: '1700px', borderRadius: '20px ', margin: '20px', padding: '20px' }}>
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
            <Row className='titles' style={{textAlign:'center'}}>
                <Col  style={{textAlign:'center'}}lg={2}>
                    שם העובד
                </Col>
                <Col   style={{textAlign:'center'}}lg={1}>
                    ת"ז
                </Col>
                <Col  style={{textAlign:'center'}}lg={3}>
                    אימייל
                </Col>
                <Col   style={{textAlign:'center'}}lg={2}>
                    מס' טלפון
                </Col>
                <Col  style={{textAlign:'center', marginLeft:'5px'}}lg={1}>
                    תפקיד
                </Col>
                <Col  style={{textAlign:'center'}}lg={2}>
                    סיסמה
                </Col>
                <Col   style={{textAlign:'center'}}lg={1}>
                </Col>
            </Row>
            <Row style={{textAlign:'right'}}>
                {employees
                    .filter((employee) => employee.EmployeeName.includes(searchValue))
                    .map((employee) => (
                        <Row className="employee-row" key={employee.EmployeeName}>
                            <Col className="empname employee-col" lg={2}> 
                                {employee.EmployeeName}
                            </Col>
                            <Col className="employee-col" lg={1}>{employee.EmployeeID}</Col>
                            <Col className="employee-col" style={{textAlign:'left'}} lg={3}>{employee.EmployeeEmail}</Col>
                            <Col className="employee-col" style={{textAlign:'center'}} lg={2}>{employee.EmployeePhone}</Col>
                            <Col className="employee-col"  lg={1}>{employee.EmployeeTitle}</Col>
                            <Col className="employee-col"  lg={2} style={{ marginLeft:'1px', width:'250px'}}>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <InputGroup >
                                        <FormControl className='input' type={values.showPassword ? "text" : "password"} onChange={handlePasswordChange("password")}
                                            value={employee.EmployeePassword} style={{ backgroundColor: 'transparent', textAlign: 'left' }} />
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
                            </Col>
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
    )
}

