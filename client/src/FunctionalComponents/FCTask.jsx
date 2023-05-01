import React, { useState, useEffect } from 'react';
import { useUserContext } from './UserContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Accordion, Button, InputGroup, FormControl, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../Styles/Customer.css';
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Task.css';


export default function FCTask() {

    const { user } = useUserContext();
    // const [deadlineDate, setDeadlineDate] = useState('');
    const [taskTypes, setTaskTypes] = useState([]);
    const [activities, setActivities] = useState([]);

    const [settasksDel] = useState([]);

    const location = useLocation();
    const task = location.state;
    console.log(task.TaskName);

    useEffect(() => {
        const fetchTaskTypes = async () => {
            try {
                const response = await fetch('http://194.90.158.74/cgroup95/prod/api/TaskTypes');
                const data = await response.json();
                setTaskTypes(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTaskTypes();

        const fetchActivities = async () => {
            try {
                const response = await fetch(`https://proj.ruppin.ac.il/cgroup95/prod/api/GetActivity_Task_CusName/${task.TaskID}`, {                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });
                const json = await response.json();
                setActivities(json || []); // make sure tasks is always an array
            } catch (error) {
                console.error(error);
            }
        }
        fetchActivities();
    }, []);
    function deleteTasks(TaskID) {
        try {
            const response = fetch(
                `https://194.90.158.74/cgroup95/prod/api/ListTasks/${TaskID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            const json = response.json();
            settasksDel(json);
        } catch (error) {
            console.log("error");
        }
    };

    return (
        <Form className='projclass' style={{ borderRadius: '20px ', margin: '20px', padding: '20px' , width: '85%'}}>
            <Accordion defaultActiveKey={['0']} alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header style={{ alignItems: 'left', fontSize: '20px' }}>פרטי משימה</Accordion.Header>
                    <Accordion.Body >
                        <Row >
                            <Col >
                                <Form.Group style={{ textAlign: 'right' }}>
                                    <Form.Label >לקוח</Form.Label>
                                    <InputGroup>
                                        <FormControl className='input' type="text" defaultValue="לקוח1" />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                    <Form.Label>סוג משימה</Form.Label>
                                    <Form.Select style={{ fontSize: '20px', textAlign: 'right' }}>
                                        {taskTypes.map(taskType => (
                                            <option key={taskType.TaskTypeID} value={taskType.TaskTypeID}>{taskType.TaskKind}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicEmail">
                                    <Form.Label >שם עובד</Form.Label>
                                    <InputGroup>
                                        <FormControl style={{ textAlign: 'right' }} className='input' type="text" defaultValue={user.EmployeeName} />
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                    <Form.Label>תאריך הגשה</Form.Label>
                                    <Form.Control className='datePicker' type="date" name="dob" placeholder="Date of Birth" />
                                </Form.Group>
                             
                            </Col>

                        </Row>
                        <Row>
                            <Col>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">

                                    <Form.Label>תיאור
                                    </Form.Label>
                                    <Form.Control as="textarea" rows={4} defaultValue={task.TaskDescription} />

                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ textalign: 'left' }}>
                                <Button className='btn-file' type="button"> ספריית קבצים</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ textAlign: 'right' }}>
                                <Button className='btn-play' type="button">
                                    <FontAwesomeIcon icon={faPlay} />
                                </Button>

                                <Button className='btn-play' type="button">
                                    <FontAwesomeIcon icon={faPause} />
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                פירוט שעות עבודה
                            </Col>
                        </Row>
                        <Row className="activity-row" >
                            <Col lg={6}> activity
                            </Col>
                            <Col lg={5}> activity
                            </Col>
                            <Col lg={1}>
                                <Button className="trash" onClick={() => {
                                    // deleteTasks(task.TaskID);
                                    // settasks(tasks.filter((c) => c.TaskID !== task.TaskID));
                                }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </Col>
                        </Row>
                        <Row style={{ textalign: 'right' }}>
                            <Col style={{ textalign: 'right' }}>
                                <Button className='btn-add-hour' type="button" style={{ textalign: 'right' }}> הוספת שעות עבודה</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ textAlign: 'right' }}> סה"כ שעות עבודה </Col>
                            <Col style={{ textAlign: 'left' }}>10.5</Col>
                        </Row>
                        <Row>
                            <Col lg={11} style={{ textAlign: 'center' }}>
                            <Button className='btn-gradient-purple' type="button" style={{marginTop: 0, marginRight:170 }} >שמירה</Button>
                            </Col>
                            <Col lg={1}>
                            <Button className="trash" onClick={() => {
                                    // deleteTasks(task.TaskID);
                                    // settasks(tasks.filter((c) => c.TaskID !== task.TaskID));
                                }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Form >
    )
}
