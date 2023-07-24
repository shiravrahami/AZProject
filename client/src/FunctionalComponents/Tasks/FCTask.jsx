import React, { useState, useEffect } from 'react';
import { useUserContext } from '../UserContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Accordion, Button, InputGroup, FormControl, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../Styles/Task.css';
import Toast from 'react-bootstrap/Toast';


export default function FCTask() {
    const { user, path } = useUserContext();
    const [taskTypes, setTaskTypes] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [actHours, setActHours] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [settasksDel] = useState([]);
    const location = useLocation();
    const task = location.state;
    console.log(task.CustomerName, task.EmployeeName);
    const [taskUpdate, setTaskUpdate] = useState(task);
    const [isChecked, setIsChecked] = useState(false);
    const [taskID, settaskID] = useState(task.TaskID);
    const [taskName, settaskName] = useState(task.TaskName);
    const [projectID, setprojectID] = useState(task.ProjectID);
    const [taskType, settaskType] = useState(task.TaskType);
    const [customer, setCustomer] = useState(task.CustomerName);
    const [employee, setEmployee] = useState(task.EmployeeName);
    const [show, setShow] = useState(false);
    const [taskDescription, settaskDescription] = useState(task.TaskDescription);
    const [insertTaskDate, setinsertTaskDate] = useState(task.InsertTaskDate);
    const [deadline, setdeadline] = useState(task.Deadline);
    const [isDone, setisDone] = useState(task.isDone);
    const [isDeleted, setisDeleted] = useState(task.isDeleted);

    const defaultDateD = new Date(task.Deadline);
    const deadlineString = defaultDateD.toISOString().substring(0, 10);

    const defaultDateI = new Date(task.InsertTaskDate);
    const InsertTaskDateString = defaultDateI.toISOString().substring(0, 10);



    const [addedRows, setAddedRows] = useState([]);

    const addRow = () => {
        const newRow = {
            activityStartDate: '', // Initialize with empty string
            activityEndDate: '',   // Initialize with empty string
        };
        setAddedRows(prevRows => [...prevRows, newRow]);
    };
    const handleDeleteRow = (index) => {
        const updatedRows = [...addedRows];
        updatedRows.splice(index, 1);
        setAddedRows(updatedRows);
    };
    const handleChange = (index, property, value) => {
        setAddedRows(prevRows => {
            const updatedRows = [...prevRows];
            updatedRows[index][property] = value;
            return updatedRows;
        });
    };


    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [activity, setActivity] = useState(null);


    useEffect(() => {
        let intervalId;
        if (isRunning) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning]);

    const handleStart = () => {
        setIsRunning(true);
        setStartTime(Date.now());
    };

    const handleStop = () => {
        setIsRunning(false);
        const currentTime = Date.now();
        setEndTime(currentTime); // Update endTime with the current time.
        console.log("handle stop - current time:", currentTime);
        insertActivity();
    };


    const insertActivity = async () => {
        const NewActivity = {
            TaskID: task.TaskID,
            EmployeePK: task.EmployeeID,
            Description: "",
            StartDate: startTime,
            EndDate: Date.now()
        };
        console.log(NewActivity);

        try {
            const response = await fetch(`${path}Activity`, {
                method: "POST",
                body: JSON.stringify(NewActivity),
                headers: new Headers({
                    'Accept': 'application/json; charset=UTF-8',
                    'Content-type': 'application/json; charset=UTF-8'
                })
            });
            const json = await response.json();
            setActivity(json);
        } catch (error) {
            console.log("error", error);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

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

        //TaskDetailsHour/{id}
        const fetchTaskDetailsHour = async () => {
            try {
                const response = await fetch(`${path}TaskDetailsHour/${task.TaskID}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });
                const json = await response.json();
                setActHours(json.TotalWorkHours || []);
            } catch (error) {
                console.error(error);
            }
        }
        fetchTaskDetailsHour();


        const fetchActivities = async () => {
            try {
                const response = await fetch(`${path}GetActivity_Task_CusName/${task.TaskID}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });
                const json = await response.json();
                setActivities(json || []);
                console.log("activities:", activities);
            } catch (error) {
                console.error(error);
            }
        }
        fetchActivities();
    }, []);
    // function deleteTasks(TaskID) {
    //     try {
    //         const response = fetch(
    //             `${path}ListTasks/${TaskID}`,
    //             {
    //                 method: "PUT",
    //                 headers: {
    //                     "Content-type": "application/json; charset=UTF-8",
    //                 },
    //             }
    //         );
    //         const json = response.json();
    //         settasksDel(json);
    //     } catch (error) {
    //         console.log("error");
    //     }
    //     window.location.href = '/cgroup95/prod/build/tasks'
    // };
    const deleteActivity = (activityID) => {
        console.log("deleteactity", activityID);
        try {
            const response = fetch(
                `${path}DeleteActivity/${activityID}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            const json = response.json();
        } catch (error) {
            console.log("error");
        }

    };
    function updateTask(updatedTask, task) {
        try {
            const response = fetch(`${path}TaskUpdate/${task.TaskID}`, {
                method: "PUT",
                body: JSON.stringify(updatedTask),
                headers: new Headers({
                    'Accept': 'application/json; charset=UTF-8',
                    'Content-type': 'application/json; charset=UTF-8'
                })
            });
            const json = response.json();
            setTaskUpdate(json);
        } catch (error) {
            console.log("error", error);
        }
    }
   

    async function updateTask(updatedTask, task) {
        try {
            const response = await fetch(`${path}TaskUpdate/${task.TaskID}`, {
                method: "PUT",
                body: JSON.stringify(updatedTask),
                headers: new Headers({
                    'Accept': 'application/json; charset=UTF-8',
                    'Content-type': 'application/json; charset=UTF-8'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update task'); // You can handle the error accordingly
            }

            const json = await response.json();
            setShow(true);
            setTaskUpdate(json);
        } catch (error) {
            console.log("error", error);
        }
    }

    const handleTaskTypeChange = (e) => {
        settaskType(e.target.value);
    };

    const handleTaskDescriptionChange = (e) => {
        settaskDescription(e.target.value);
    };

    const handleInsertTaskDateChange = (e) => {
        setinsertTaskDate(e.target.value);
    };

    const handleDeadlineChange = (e) => {
        setdeadline(e.target.value);
    };
    const handleEditClick = () => {
        const updatedTask = {
            TaskName: taskName,
            ProjectID: projectID,
            TaskType: taskType,
            TaskDescription: taskDescription,
            InsertTaskDate: insertTaskDate,
            Deadline: deadline,
            isDone: isChecked,
            isDeleted: isDeleted,
            EmployeeID: employee
        };
        setIsEditing(!isEditing);
        console.log("shir", updatedTask);
        if (isEditing) {

            updateTask(updatedTask, task);
        }
    };
    return (
        <div>
            <Row>
                <Col lg={12}>
                    <Toast style={{ marginBottom: '20px', width: '100%', justifyContent: 'center' }} onClose={() => setShow(false)} show={show} delay={3000} autohide>
                        <Toast.Body style={{ backgroundColor: '#d3ffdf' }}>
                            <FontAwesomeIcon icon={faCheck} />
                            {"  "}המשימה נשמרה בהצלחה
                        </Toast.Body>
                    </Toast>
                </Col>
            </Row>
            <Form className='taskclass' style={{ borderRadius: '20px ', margin: '20px', padding: '20px', width: '95%', fontSize: '20px' }}>
                <Accordion defaultActiveKey={['0']} alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header id="task-header" style={{ alignItems: 'left' }}>פרטי משימה- {task.TaskName} </Accordion.Header>
                        <Accordion.Body >
                            <Row >
                                <Col >
                                    <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                        <Form.Label>לקוח</Form.Label>
                                        <Form.Control disabled type="text" value={customer} />
                                        {/* <Form.Select onChange={(e) => setCustomer(e.target.value)} disabled={!isEditing} style={{ fontSize: '20px', textAlign: 'right' }} value={customer}>
                                        {customers.map(customer => (
                                            <option key={customer.CustomerID} value={customer.CustomerName} >{customer.CustomerName}</option>
                                        ))}
                                    </Form.Select> */}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                        <Form.Label>סוג משימה</Form.Label>
                                        <Form.Select
                                            onChange={handleTaskTypeChange}
                                            disabled={!isEditing}
                                            style={{ fontSize: '20px', textAlign: 'right' }}
                                            value={taskType} // Update this line
                                        >
                                            {taskTypes.map(taskType => (
                                                <option key={taskType.TaskTypeID} value={taskType.TaskTypeID}>{taskType.TaskKind}</option>
                                            ))}
                                        </Form.Select>

                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                        <Form.Label>שם עובד</Form.Label>
                                        <Form.Select onChange={(e) => setEmployee(e.target.value)} disabled={!isEditing} style={{ fontSize: '20px', textAlign: 'right' }} value={employee}>
                                            {employees.map(employee => (
                                                <option key={employee.EmployeeID} value={employee.EmployeeName}>{employee.EmployeeName}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                </Col>

                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                        <Form.Label>תאריך הגשה</Form.Label>
                                        <Form.Control onChange={handleDeadlineChange} disabled={!isEditing} className='datePicker' type="date" name="dob" defaultValue={deadlineString} />
                                    </Form.Group>

                                </Col>
                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                        <Form.Label>תאריך הכנסה</Form.Label>
                                        <Form.Control onChange={handleInsertTaskDateChange} disabled={!isEditing} className='datePicker' type="date" name="dob" defaultValue={InsertTaskDateString} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                        <Form.Label>תיאור
                                        </Form.Label>
                                        <Form.Control onChange={handleTaskDescriptionChange} disabled={!isEditing} as="textarea" rows={4} defaultValue={task.TaskDescription} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                            </Row>
                            <Row style={{ paddingTop: "15px" }}>
                                <Col lg={1} style={{ width: "50px" }}>
                                    <Form.Check
                                        disabled={!isEditing}
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                    />
                                </Col>
                                <Col lg={10} style={{ padding: "0px" }}>
                                    <Form.Label padding="0px">בוצע </Form.Label>
                                </Col>
                            </Row >
                            <Row>
                                <Col style={{ textAlign: 'right' }}>
                                    <Button className='btn-play' type="button" onClick={handleStart} >
                                        <FontAwesomeIcon icon={faPlay} />
                                    </Button>

                                    <Button className='btn-play' type="button" onClick={handleStop}>
                                        <FontAwesomeIcon icon={faPause} />
                                    </Button>
                                    {/* Button to add a new row */}
                                    <Button className='btn-play' type="button" onClick={addRow}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                    {/* Your existing file input */}
                                </Col>

                            </Row>
                            <Row>
                                <Col>{formatTime(time)}</Col></Row>
                            <Row>
                                <Col style={{ fontSize: '25px', color: '#A827AB' }}>
                                    פירוט שעות עבודה
                                </Col>
                            </Row>
                            <Row style={{ fontSize: '23px' }}>
                                <Col lg={3}> <Form.Label>תאריך </Form.Label></Col>
                                <Col lg={3}> <Form.Label>שעת התחלה וסיום </Form.Label></Col>
                            </Row>

                            {activities.map((activity) => (
                                <>
                                    <Row className="activity-row">

                                        <Col lg={3} >
                                            {new Date(activity.EndDate).toLocaleDateString('en-GB')}
                                        </Col>
                                        <Col style={{ textAlign: 'right' }} key={activity.ActivityID} lg={8}>
                                            {new Date(activity.StartDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                            -
                                            {new Date(activity.EndDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </Col>
                                        <Col lg={1} style={{ display: 'flex', justifyItems: 'start' }}>
                                            <Button className="trash" onClick={() => { deleteActivity(activity.ActivityID) }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                        </Col>
                                    </Row>
                                </>
                            ))}


                            {/* Dynamically added rows */}
                            {addedRows.map((row, index) => (
                                <Row key={index}>
                                    {/* Input fields for activity start date and end date */}
                                    <Col lg={3}>
                                        <Form.Group style={{ textAlign: 'right' }}>

                                            <InputGroup>
                                                <FormControl
                                                    className='input'
                                                    type="datetime-local"
                                                    value={row.activityStartDate}
                                                    onChange={(e) => setStartTime(e.target.value)}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={3}>
                                        <Form.Group style={{ textAlign: 'right' }}>

                                            <InputGroup>
                                                <FormControl
                                                    className='input'
                                                    type="datetime-local"
                                                    value={row.activityEndDate}
                                                    onChange={(e) => setEndTime(e.target.value)}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={1}>
                                        <Button
                                            className="trash"
                                            onClick={insertActivity()}
                                        >
                                            <FontAwesomeIcon icon={faCheck} />
                                        </Button>
                                    </Col>
                                    <Col lg={1}>
                                        <Button className="trash" onClick={() => handleDeleteRow(index)}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </Button>
                                    </Col>
                                </Row>
                            ))}


                            <Row style={{ textalign: 'right' }}>

                            </Row>
                            <Row>
                                <Col style={{ textAlign: 'right', fontSize: '25px', color: '#A827AB' }}> סה"כ שעות עבודה - {actHours}</Col>

                            </Row>
                            <Row>
                                <Col lg={12} style={{ textAlign: 'center' }}>
                                    <Button className='btn-gradient-purple' type="button" onClick={handleEditClick} style={{ marginTop: 0, marginRight: 500 }} >
                                        {isEditing ? "שמירה" : "עריכה"}
                                    </Button>
                                </Col>
                                {/* <Col lg={1}>
                                <Button className="trash" onClick={() => {
                                    deleteTasks(task.TaskID);
                                }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </Col> */}
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Form >
        </div>
    )
}