import React, { useState, useEffect, useRef } from 'react';
import { useUserContext } from '../UserContext';
import 'react-datepicker/dist/react-datepicker.css';
import { Accordion, Button, InputGroup, FormControl, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../Styles/Project.css';
import ProgressBar from 'react-bootstrap/ProgressBar';

export default function FCproject() {
    const { user, path } = useUserContext();
    const [isEditing, setIsEditing] = useState(false);
    const [setprojectsDel] = useState([]);

    const location = useLocation();
    const project = location.state;
    console.log(project.ProjectName + ' ' + project.ProjectID);


    const [projectUpdate, setprojectUpdate] = useState();
    const [projectGet, setprojectGet] = useState({ CustomerName: '' });
    const [activity, setActivity] = useState([]);
    const [projectID, setprojectID] = useState();
    const [projectName, setprojectName] = useState(project.projectName);
    const [projectType, setprojectType] = useState();
    const [projectDescription, setprojectDescription] = useState(project.projectDescription);
    const [insertprojectDate, setinsertprojectDate] = useState(project.insertprojectDate);
    const [deadline, setdeadline] = useState(project.deadline);
    const [isDone, setisDone] = useState();
    const [isDeleted, setisDeleted] = useState();
    const [buttonColor, setButtonColor] = useState('primary');
    const contractFileInputRef = useRef(null);

    const now = 60;

    const Deadline = new Date(project.Deadline).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).split('/').reverse().join('-');

    const InsertDate = new Date(project.InsertDate).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).split('/').reverse().join('-');

    const contractButton = () => {
        contractFileInputRef.current.click();
    };

    const handleFileInputChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setButtonColor('secondary');
        }
    };
    useEffect(() => {
        async function fetchProject() {
            try {
                const response = await fetch(`${path}ProjectDetails/${project.ProjectID}`, {
                    method: "GET",
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                });
                const json = await response.json();
                setprojectGet(json);
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchActivity() {
            try {
                const response = await fetch(`${path}Projects/Tasks/${project.ProjectID}`, {
                    method: "GET",
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                });
                const json = await response.json();
                setActivity(json);
            } catch (error) {
                console.error(error);
            }
        }

        fetchProject();
        fetchActivity();
    }, [project]); // Add project to the dependency array if needed


    //     const [image, setImage] = useState('');

    //     const upload = () => {
    //         if (image == null)
    //             return;
    //         const imageref = storage.ref(`/images/${image.name}`).put(image)
    //         .on("state_changed", alert("succsess"), alert);

    //         imageref();
    // }

    function deleteprojects() {
        try {
            const response = fetch(
                `${path}ProjectDetails/${projectID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            const json = response.json();
            setprojectsDel(json);
        } catch (error) {
            console.log("error");
        }
        window.location.href = '/cgroup95/prod/build/projects'
    };

    const handleEditClick = () => {
        const updatedproject = {
            projectID: projectID,
            projectName: projectName,
            ProjectID: projectID,
            projectType: projectType,
            projectDescription: projectDescription,
            InsertprojectDate: insertprojectDate,
            Deadline: deadline,
            isDone: isDone,
            isDeleted: isDeleted
        };
        setIsEditing(!isEditing);
        if (isEditing) {

            async function updateproject(updatedproject, project) {
                try {
                    const response = await fetch(`${path}projectUpdate/${project.ProjectID}`, {
                        method: "PUT",
                        body: JSON.stringify(updatedproject),
                        headers: new Headers({
                            'Accept': 'application/json; charset=UTF-8',
                            'Content-type': 'application/json; charset=UTF-8'
                        })
                    });
                    const json = await response.json();
                    setprojectUpdate(json);
                } catch (error) {
                    console.log("error", error);
                }
            }
        }
    }
    return (
        <Form className='projectclass' style={{ borderRadius: '20px ', margin: '20px', padding: '20px', width: '95%' }}>
            <Accordion defaultActiveKey={['0']} alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header style={{ alignItems: 'left', fontSize: '20px' }}>פרטי פרויקט- {project.ProjectName} </Accordion.Header>
                    <Accordion.Body >
                        <Row >
                            <Col lg={8}>
                                <Form.Group style={{ textAlign: 'right' }}>
                                    <Form.Label >לקוח</Form.Label>
                                    <InputGroup>
                                        <FormControl disabled={!isEditing} className='input' type="text" defaultValue={projectGet.CustomerName || ''} />
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            <Col lg={2}>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                    <Form.Label>תאריך הכנסה</Form.Label>
                                    <Form.Control disabled={!isEditing} className='datePicker' type="date" defaultValue={InsertDate} />
                                </Form.Group>
                            </Col>
                            <Col lg={2}>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                    <Form.Label>תאריך הגשה</Form.Label>
                                    <Form.Control disabled={!isEditing} className='datePicker' type="date" defaultValue={Deadline} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                    <Form.Label>תיאור
                                    </Form.Label>
                                    <Form.Control disabled={!isEditing} as="textarea" rows={4} defaultValue={projectGet.Description} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <br />
                        <Row style={{ justifyContent: 'center' }}>
                            <Col lg={1} style={{ textAlign: "left" }}>
                                <Button onClick={contractButton} color={buttonColor} className='btn-contract' type="button">קבצים</Button>
                                <input
                                    type="file"
                                    ref={contractFileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileInputChange}
                                />
                            </Col>
                            <Col lg={10} style={{justifyContent: 'center', display: 'flex', textAlign: 'center' }}>
                                <Button className='btn-gradient-purple' type="button" style={{ marginTop: 0, marginRight: 170 }} onClick={handleEditClick} >
                                    {isEditing ? "שמירה" : "עריכה"}
                                </Button>
                            </Col>
                            <Col lg={1}>
                                <Button className="trash" onClick={() => { }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <br />
            <Accordion defaultActiveKey={['0']} alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
                <Accordion.Item eventKey="0">
                    <Accordion.Body >
                        <Row >
                            <Col >
                                <Form.Group style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    <Form.Label >פירוט שעות עבודה</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row >
                            <Col lg={4} >
                                <Form.Group style={{ textAlign: 'right'  ,textAlign:'center'}}>
                                    <Form.Label >שם משימה</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={4} >
                                <Form.Group style={{ textAlign: 'right' ,textAlign:'center' }}>
                                    <Form.Label >שעות פעילות</Form.Label>
                                </Form.Group>
                            </Col>
                            <Col lg={4} >
                                <Form.Group style={{ textAlign: 'right',textAlign:'center'}}>
                                    <Form.Label >סה"כ שעות</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        {activity
                            .map((act) => (
                                <Row className="project-row" key={act.TaskName}>
                                    <Col lg={4} className="custname"style={{textAlign:'right'}}>
                                        {act.TaskName}
                                    </Col>
                                    <Col lg={4} className="custname"style={{textAlign:'center'}}>
                                        {/* {act.TaskName} */}
                                        14:00-17:00
                                    </Col>
                                    <Col lg={4} className="custname" style={{textAlign:'center'}}>
                                        {/* {act.TaskName} */}
                                        5
                                    </Col>
                                </Row>
                            ))}
                        <br />
                        <ProgressBar className='progBar' now={now} label={`${now}%`} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Form >
    )
}
