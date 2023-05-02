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
    const [taskTypes, setTaskTypes] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [settasksDel] = useState([]);
    
    
    const location = useLocation();
    const task = location.state;
    console.log(task.TaskName);
    const [taskUpdate, setTaskUpdate] = useState(task);
    
    const [taskID, settaskID] = useState(task.TaskID);
    const [taskName, settaskName] = useState(task.TaskName);
    const [projectID, setprojectID] = useState(task.ProjectID);
    const [taskType, settaskType] = useState(task.TaskType);
    const [taskDescription, settaskDescription] = useState(task.TaskDescription);
    const [insertTaskDate, setinsertTaskDate] = useState(task.InsertTaskDate);
    const [deadline, setdeadline] = useState(task.Deadline);
    const [isDone, setisDone] = useState(task.isDone);
    const [isDeleted, setisDeleted] = useState(task.isDeleted);
     



    const defaultDateD = new Date(task.Deadline);
    const deadlineString = defaultDateD.toISOString().substring(0, 10);


    const defaultDateI = new Date(task.InsertTaskDate);
    const InsertTaskDateString = defaultDateI.toISOString().substring(0, 10);

    useEffect(() => {
        const fetchTaskTypes = async () => {
            try {
                const response = await fetch('https://proj.ruppin.ac.il/cgroup95/prod/api/TaskTypes');
                const data = await response.json();
                setTaskTypes(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTaskTypes();

        const fetchActivities = async () => {
            try {
                const response = await fetch(`https://proj.ruppin.ac.il/cgroup95/prod/api/GetActivity_Task_CusName/${task.TaskID}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });
                const json = await response.json();
                setActivities(json || []);
            } catch (error) {
                console.error(error);
            }
        }
        fetchActivities();
    }, []);
    function deleteTasks(TaskID) {
        try {
            const response = fetch(
                `https://proj.ruppin.ac.il/cgroup95/prod/api/ListTasks/${TaskID}`,
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
        window.location.href = '/cgroup95/prod/build/tasks'
    };

    const handleEditClick = () => {
        const updatedTask = {
            TaskID: taskID,
            TaskName: taskName,
            ProjectID: projectID,
            TaskType: taskType,
            TaskDescription: taskDescription,
            InsertTaskDate: insertTaskDate,
            Deadline: deadline,
            isDone: isDone,
            isDeleted: isDeleted
        };
        setIsEditing(!isEditing);
        if (isEditing) {

            async function updateUser(updatedTask, task) {
                try {
                    const response = await fetch(`https://proj.ruppin.ac.il/cgroup95/prod/api/TaskUpdate/${user.EmployeePK}`, {
                        method: "PUT",
                        body: JSON.stringify(updatedTask),
                        headers: new Headers({
                            'Accept': 'application/json; charset=UTF-8',
                            'Content-type': 'application/json; charset=UTF-8'
                        })
                    });
                    const json = await response.json();
                    setTaskUpdate(json);
                } catch (error) {
                    console.log("error", error);
                }
            }
        }
    }
    return (
        <Form className='projclass' style={{ borderRadius: '20px ', margin: '20px', padding: '20px', width: '85%' }}>
            <Accordion defaultActiveKey={['0']} alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header style={{ alignItems: 'left', fontSize: '20px' }}>פרטי משימה- {task.TaskName} </Accordion.Header>
                    <Accordion.Body >
                        <Row >
                            <Col >
                                <Form.Group style={{ textAlign: 'right' }}>
                                    <Form.Label >לקוח</Form.Label>
                                    <InputGroup>
                                        <FormControl disabled={!isEditing} className='input' type="text" defaultValue='לקוח עשיר' />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                    <Form.Label>סוג משימה</Form.Label>
                                    <Form.Select onChange={(e) => settaskType(e.target.value)} disabled={!isEditing} style={{ fontSize: '20px', textAlign: 'right' }} defaultValue={task.TaskType}>
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
                                        <FormControl disabled={!isEditing} style={{ textAlign: 'right' }} className='input' type="text" defaultValue={user.EmployeeName} />
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                    <Form.Label>תאריך הגשה</Form.Label>
                                    <Form.Control onChange={(e) => setdeadline(e.target.value)} disabled={!isEditing} className='datePicker' type="date" name="dob" defaultValue={deadlineString} />
                                </Form.Group>

                            </Col>
                            <Col>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                    <Form.Label>תאריך הכנסה</Form.Label>
                                    <Form.Control onChange={(e) => setinsertTaskDate(e.target.value)} disabled={!isEditing} className='datePicker' type="date" name="dob" defaultValue={InsertTaskDateString} />
                                </Form.Group>

                            </Col>

                        </Row>
                        <Row>
                            <Col>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">

                                    <Form.Label>תיאור
                                    </Form.Label>
                                    <Form.Control onChange={(e) => settaskDescription(e.target.value)} disabled={!isEditing} as="textarea" rows={4} defaultValue={task.TaskDescription} />

                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            {/* <Col style={{ textalign: 'left' }}>
                                <Button className='btn-file' type="button"> ספריית קבצים</Button>
                            </Col> */}
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
                        <Row className="activity-row" style={{ fontSize: 20 }}>
                            {activities.map((activity) => (
                                <>
                                    <Col key={activity.Activity_ID} lg={5}>{new Date(activity.Start_Date).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}</Col>
                                    <Col lg={5}>{activity.EndHour && new Date(activity.EndHour).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}</Col>
                                    <Col lg={2}>
                                        <Button className="trash" onClick={() => { }}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </Col>
                                </>
                            ))}
                        </Row>

                        <Row style={{ textalign: 'right' }}>
                            {/* <Col style={{ textalign: 'right' }}>
                                <Button className='btn-add-hour' type="button" style={{ textalign: 'right' }}> הוספת שעות עבודה</Button>
                            </Col> */}
                        </Row>
                        <Row>
                            <Col style={{ textAlign: 'right' }}> סה"כ שעות עבודה </Col>
                            <Col style={{ textAlign: 'left' }}>10.5</Col>
                        </Row>
                        <Row>
                            <Col lg={11} style={{ textAlign: 'center' }}>
                                <Button className='btn-gradient-purple' type="button" onClick={handleEditClick} style={{ marginTop: 0, marginRight: 170 }} >
                                    {isEditing ? "שמירה" : "עריכה"}
                                </Button>
                            </Col>
                            <Col lg={1}>
                                <Button className="trash" onClick={() => {
                                    deleteTasks(task.TaskID);
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
