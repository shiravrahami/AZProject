import React, { useState, useEffect } from 'react';
import { Accordion, Button, InputGroup, FormControl, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Projects.css';
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

import { useUserContext } from './UserContext';

const label = { inputProps: { 'aria-label': 'Color switch demo' } };

export default function FCprojects() {

    const [projects, setprojects] = useState([]);
    const [projectsDel, setprojectsDel] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [switchon, setswitchon] = useState(false);
    const [projectsDay, setprojectsDay] = useState([]);


    const { user } = useUserContext();

    const handleSearch = (event) => {
        setSearchValue(event.target.value);
    };

    function deleteprojects(projectID) {
        try {
            const response = fetch(
                `http://194.90.158.74/cgroup95/prod/api/Listprojects/${projectID}`,
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
    }

    useEffect(() => {
        async function fetchprojects() {
            try {
                const response = await fetch(`http://194.90.158.74/cgroup95/prod/api/ListProjects`, {
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


    console.log(projects);

    async function SwitchChange() {
        setswitchon(!switchon);
        try {
            const response = await fetch(`http://194.90.158.74/cgroup95/prod/api/ListProjectsNextDay`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            const json = await response.json();
            setprojectsDay(json || []); // make sure projects is always an array
        } catch (error) {
            console.error(error);
        }

        console.log("second get" + projectsDay);
    }


    function passproject() {
    }

    return (
        <div className='custtable'>
            <Row>
                <Form className='projclass' style={{ width: '1250px', borderRadius: '20px ', margin: '20px', padding: '20px' }}>
                    <Accordion defaultActiveKey={['0']} alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }} flush>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header style={{ backgroundColor: '#f7f7f7', alignItems: 'left', fontSize: '20px' }}>פרויקטים</Accordion.Header>
                            <Accordion.Body style={{ backgroundColor: '#f7f7f7' }}>
                                <Row>
                                    {/* <Col className="col-auto">
                                        <Button className='btn-filter'>סנן</Button>
                                    </Col> */}
                                    <Col className="col-auto">
                                        <Form.Group style={{ textalign: 'right', width: '150px', backgroundColor: 'none' }} controlId="CustType">
                                            {/* <Form.Label>סוג לקוח</Form.Label> */}
                                            <Form.Select style={{ fontSize: '20px', textalign: 'right' }}>
                                                <option value="1">הכי חדש</option>
                                                <option value="2">לפי שם</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col className='switch'>
                                    <FormControlLabel
                                            value="end"
                                            control={<Switch {...label} color="secondary" />}
                                            label="הסר פרויקטים שעבר זמנם מהרשימה"
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
                                                <Form.Control type="text" placeholder="חיפוש פרויקט" className='serachinput' style={{ backgroundColor: '#f7f7f7' }} onChange={handleSearch} />
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
            <Row className='titles'>
                <Col lg={6}>
                    שם הפרויקט
                </Col>
                <Col lg={5}>
                    תאריך הגשה
                </Col>
                <Col lg={1}>
                </Col>
            </Row>
            <Row className='contentProjects'>
                {switchon && projectsDay
                    .filter((project) => project.ProjectName.includes(searchValue))
                    .map((project) => (
                        <Row className="project-row" key={project.ProjectName}>
                            <Col lg={6} className="custname" onClick={() => passproject(project)}>
                                {project.ProjectName}
                            </Col>
                            <Col lg={5}>{new Date(project.Deadline).toLocaleDateString('en-GB')}</Col>
                            <Col lg={1}>
                                <Button className="trash" onClick={() => {
                                    deleteprojects(project.ProjectID);
                                    setprojectsDay(projectsDay.filter((c) => c.ProjectID !== project.ProjectID));
                                }}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </Col>
                        </Row>
                    ))}
                {!switchon && projects
                    .filter((project) => project.ProjectName.includes(searchValue))
                    .map((project) => (
                        <Row className="project-row" key={project.ProjectName}>
                            <Col lg={6} className="projname" onClick={() => passproject(project)}>
                                {project.ProjectName}
                            </Col>
                            <Col lg={5}>{new Date(project.Deadline).toLocaleDateString('en-GB')}</Col>
                            <Col lg={1}>
                                <Button className="trash" onClick={() => {
                                    deleteprojects(project.ProjectID);
                                    setprojects(projects.filter((c) => c.ProjectID !== project.ProjectID));
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

