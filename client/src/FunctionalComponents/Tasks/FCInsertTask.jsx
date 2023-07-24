import React, { useState, useEffect } from 'react';
import { Accordion, Button, Form, Row, Col } from 'react-bootstrap';
import { useUserContext } from '../UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../Styles/Task.css';
import Toast from 'react-bootstrap/Toast';

export default function FTCInsertTask() {
    const [taskTypes, setTaskTypes] = useState([]);
    const { user, path } = useUserContext();
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [projects, setprojects] = useState([]);
    const [setTask] = useState(null);
    const [show, setShow] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [selectedProjectID, setSelectedProjectID] = useState('');
    const [selectedTaskType, setSelectedTaskType] = useState('');
    const [selectedEmployeeID, setSelectedEmployeeID] = useState('');
    const [submissionDate, setSubmissionDate] = useState('');
    const [insertionDate, setInsertionDate] = useState('');
    const [taskDescription, settaskDescription] = useState('');

    useEffect(() => {
        const fetchTaskTypes = async () => {
            try {
                const response = await fetch(`${path}TaskTypes`);
                const data = await response.json();
                setTaskTypes(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchTaskTypes();
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`${path}ListCustomers`);
                const data = await response.json();
                setCustomers(data);
                console.log("cust arr" + data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCustomers();
        const fetchEmployees = async () => {
            try {
                const response = await fetch(`${path}ListEmployees`);
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        async function fetchprojects() {
            try {
                const response = await fetch(`${path}ListProjects`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });
                const json = await response.json();
                setprojects(json || []); // make sure projects is always an array
            } catch (error) {
                console.error(error);
            }
        }
        fetchprojects();
    }, []);
    const handleTaskNameChange = (e) => {
        setTaskName(e.target.value);
    };

    const handleProjectIDChange = (e) => {
        setSelectedProjectID(e.target.value);
    };

    const handleTaskTypeChange = (e) => {
        setSelectedTaskType(e.target.value);
    };

    const handleEmployeeIDChange = (e) => {
        setSelectedEmployeeID(e.target.value);
    };

    const handleSubmissionDateChange = (e) => {
        setSubmissionDate(e.target.value);
    };

    const handleInsertionDateChange = (e) => {
        setInsertionDate(e.target.value);
    };

    const handleTaskDescriptionChange = (e) => {
        settaskDescription(e.target.value);
    };

    const InsertTask = async () => {
      
        const NewTask = {
            TaskName: taskName,
            ProjectID: selectedProjectID,
            TaskType: selectedTaskType,
            TaskDescription: taskDescription,
            InsertTaskDate: insertionDate,
            Deadline: submissionDate,
            isDone: false,
            isDeleted: false
        };
        console.log(NewTask);


        try {
            console.log("????????????????????")
            const response = await fetch(`${path}AddTask/${selectedEmployeeID}`, {
                method: "POST",
                body: JSON.stringify(NewTask),
                headers: new Headers({
                    'Accept': 'application/json; charset=UTF-8',
                    'Content-type': 'application/json; charset=UTF-8'
                })
            });
            const json = await response.json();
            //setTask(json);
            
        } catch (error) {
            console.log("error", error);
        }
        setShow(true);
    };



    return (
        <div> <Row>
            <Col lg={12}>
                <Toast style={{ marginBottom: '20px', width: '100%', justifyContent: 'center' }} onClose={() => setShow(false)} show={show} delay={3000} autohide>
                    <Toast.Body style={{ backgroundColor: '#d3ffdf' }}>
                        <FontAwesomeIcon icon={faCheck} />
                        {"  "}המשימה נוספה בהצלחה
                    </Toast.Body>
                </Toast>
            </Col>
        </Row>
            <Form className='taskclass' style={{ borderRadius: '20px ', margin: '20px', padding: '20px', width: '95%' }}>
                <Accordion defaultActiveKey={['0']} alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header style={{ alignItems: 'left', fontSize: '20px' }}> הכנסת משימה חדשה </Accordion.Header>
                        <Accordion.Body >
                            <Row>
                                <Col>

                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                        <Form.Label>שם משימה</Form.Label>
                                        <Form.Control type="text" onChange={handleTaskNameChange} />

                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col >
                                    <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                        <Form.Label>פרויקט</Form.Label>
                                        <Form.Select style={{ fontSize: '20px', textAlign: 'right' }} onChange={handleProjectIDChange}>
                                            {projects.map((project) => (
                                                <option key={project.ProjectID} value={project.ProjectID}>
                                                    {project.ProjectName}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                        <Form.Label>סוג משימה</Form.Label>
                                        <Form.Select style={{ fontSize: '20px', textAlign: 'right' }} onChange={handleTaskTypeChange}>
                                            {taskTypes.map(taskType => (
                                                <option key={taskType.TaskTypeID} value={taskType.TaskTypeID}>{taskType.TaskKind}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                        <Form.Label>שם עובד</Form.Label>
                                        <Form.Select style={{ fontSize: '20px', textAlign: 'right' }} onChange={handleEmployeeIDChange}>
                                            {employees.map(employee => (
                                                <option key={employee.ID} value={employee.ID}>{employee.EmployeeName}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                        <Form.Label>תאריך הגשה</Form.Label>
                                        <Form.Control className='datePicker' type="date" name="dob" onChange={handleSubmissionDateChange} />
                                    </Form.Group>

                                </Col>
                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                        <Form.Label>תאריך הכנסה</Form.Label>
                                        <Form.Control className='datePicker' type="date" name="dob" onChange={handleInsertionDateChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                        <Form.Label>תיאור</Form.Label>
                                        <Form.Control as="textarea" rows={4} onChange={handleTaskDescriptionChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                            </Row>

                            <Row>
                                <Col lg={11} style={{ textAlign: 'center' }}>
                                    <Button className='btn-gradient-purple' type="button" onClick={InsertTask}>
                                        שמירה
                                    </Button>
                                </Col>

                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Form>
        </div>
    )
}
