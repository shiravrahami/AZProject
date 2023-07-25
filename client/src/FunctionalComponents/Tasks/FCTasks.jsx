import React, { useState, useEffect } from 'react';
import { Accordion, Button, InputGroup, FormControl, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Styles/Tasks.css';
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../UserContext';
import { faPlus } from '@fortawesome/free-solid-svg-icons';



const label = { inputProps: { 'aria-label': 'Color switch demo' } };

export default function FCTasks() {

    const [tasks, settasks] = useState([]);
    const [tasksName, settasksName] = useState([]);
    const [tasksDay, settasksDay] = useState([]);
    const [settasksDel] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [switchon, setswitchon] = useState(false);
    const navigate = useNavigate();
    const { user , path} = useUserContext();

    const handleSearch = (event) => {
        setSearchValue(event.target.value);
    };

    function deleteTasks(TaskID) {
        try {
            const response = fetch(
                `${path}ListTasks/${TaskID}`,
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
    }

    useEffect(() => {
        async function fetchtasks() {
            try {
                const response = await fetch(`${path}ListTasks/${user.EmployeePK}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });
                const json = await response.json();
                settasks(json || []); // make sure tasks is always an array
                console.log( tasks[0]);
            } catch (error) {
                console.error(error);
            }
        }
        fetchtasks();
    }, [user]);


    console.log("first get" + tasks);

    async function fetchTasksByName(){
        try {
            const response = await fetch(`${path}ListTasksNameDesc/${user.EmployeePK}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            const json = await response.json();
            settasksName(json || []); // make sure tasks is always an array
        } catch (error) {
            console.error(error);
        }
    }

    async function SwitchChange() {
        setswitchon(!switchon);
        try {
            const response = await fetch(`${path}ListTasksNextDay/${user.EmployeePK}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            const json = await response.json();
            settasksDay(json || []); // make sure tasks is always an array
        } catch (error) {
            console.error(error);
        }

        console.log("second get" + tasksDay);
    }

    const passTask = (task) => {
        navigate('/task', { state: task });
    }
    function newTask() {
        navigate('/newTask')
    }


    return (
        <div className='custtable'>
              <Button className="floating-button"
                onClick={newTask}>
                <FontAwesomeIcon icon={faPlus} title="הוספת משימה" />
            </Button>
            <Row>
                <Form className='projclass' style={{ width: '95%', borderRadius: '20px ', margin: '20px', padding: '20px' }}>
                    <Accordion defaultActiveKey={['0']} alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }} flush>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header style={{ backgroundColor: '#f7f7f7', alignItems: 'left', fontSize: '20px' }}>משימות</Accordion.Header>
                            <Accordion.Body style={{ backgroundColor: '#f7f7f7' }}>
                                <Row>
                                    {/* <Col className="col-auto">
                                        <Button className='btn-filter'>סנן</Button>
                                    </Col> */}
                                    <Col className="col-auto">
                                        <Form.Group style={{ textalign: 'right', width: '150px', backgroundColor: 'none' }} controlId="CustType">
                                            <Form.Select style={{backgroundColor:'transparent', fontSize: '20px', textAlign: 'right' }} onChange={(event) => {
                                                if (event.target.value === '2') {
                                                    fetchTasksByName();
                                                }}}>
                                                <option value="1">הכי חדש</option>
                                                <option value="2">לפי שם</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col className='switch'>
                                        <FormControlLabel
                                            value="end"
                                            control={<Switch {...label} color="secondary" />}
                                            label="הסר משימות שעבר זמנן מהרשימה"
                                            labelPlacement="start"
                                            className='switch'
                                            style={{ fontFamily: 'Calibri, sans-serif' }}
                                            onChange={SwitchChange}
                                            checked={switchon}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="search-bar">
                                            <div className="input-group">
                                                <Form.Control type="text" placeholder="חיפוש משימה" className='serachinput' style={{ backgroundColor: '#f7f7f7' }} onChange={handleSearch} />
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
            <Row className='titles' style={{ fontSize: '23px'}}>
                <Col lg={6}>
                    שם משימה
                </Col>
                <Col lg={5}>
                    תאריך הגשה
                </Col>
                <Col lg={1}>
                </Col>
            </Row>
            <Row className='contentTasks' style={{ fontSize: '20px'}}>
                {switchon && tasksDay
                    .filter((task) => task.TaskName.includes(searchValue))
                    .map((task) => (
                        <Row className="task-row" key={task.TaskName}>
                            <Col lg={6} className="custname" onClick={() => passTask(task)}>
                                {task.TaskName}
                            </Col>
                            <Col lg={5}>{new Date(task.Deadline).toLocaleDateString('en-GB')}</Col>
                            <Col lg={1}>
                                <Button className="trash" onClick={() => {
                                    deleteTasks(task.TaskID);
                                    settasksDay(tasksDay.filter((c) => c.TaskID !== task.TaskID));
                                }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </Col>
                        </Row>
                    ))}
                {!switchon && tasks
                    .filter((task) => task.TaskName.includes(searchValue))
                    .map((task) => (
                        <Row className="task-row" key={task.TaskName}>
                            <Col lg={6} className="custname" onClick={() => passTask(task)}>
                                {task.TaskName}
                            </Col>
                            <Col lg={5}>{new Date(task.Deadline).toLocaleDateString('en-GB')}</Col>
                            <Col lg={1}>
                                <Button className="trash" onClick={() => {
                                    deleteTasks(task.TaskID);
                                    settasks(tasks.filter((c) => c.TaskID !== task.TaskID));
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



