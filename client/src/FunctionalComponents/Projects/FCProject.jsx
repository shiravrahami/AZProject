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
import { storage } from '../../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import Toast from 'react-bootstrap/Toast';
import { TextField } from '@mui/material';

export default function FCproject() {
    const { user, path } = useUserContext();
    const [isEditing, setIsEditing] = useState(false);
    const [setprojectsDel] = useState([]);

    const location = useLocation();
    const project = location.state;
    console.log(project.ProjectName + ' ' + project.ProjectID);

console.log("desc",project.ProjectDescription, project.Deadline);

    const [projectUpdate, setprojectUpdate] = useState();
    const [projectGet, setprojectGet] = useState({ CustomerName: '' });
    const [activity, setActivity] = useState([]);
    const [projectDescription, setprojectDescription] = useState(project.projectDescription);
    const [insertprojectDate, setinsertprojectDate] = useState(project.insertprojectDate);
    const [deadline, setdeadline] = useState(project.Deadline);
    const [isDone, setisDone] = useState();
    const [buttonColor, setButtonColor] = useState('primary');
    const contractFileInputRef = useRef(null);
    const [setProjDel] = useState([]);
    const [imageURLs, setImageURLs] = useState([]);
    const [now, setnow] = useState(0);
    const [show, setShow] = useState(false);
    const [totalTimeDiff, setTotalTimeDiff] = useState(false);
    console.log(project);

    const InsertDate = new Date(project.InsertprojectDate).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).split('/').reverse().join('-');

    const Deadline = new Date(project.Deadline).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).split('/').reverse().join('-');

    console.log("insertdate");
    console.log(project.InsertprojectDate);
    console.log("dead");
    console.log(project.Deadline);

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
                        "Content-type": "application/json; charset=UTF-8",
                    },
                });
                const json = await response.json();

                // Modify the activity data by adding a new property for time difference
                const modifiedActivity = json.map((act) => {
                    const startTime = new Date(act.StartDate);
                    const endTime = new Date(act.EndDate);
                    const timeDiff = Math.floor(((endTime - startTime) / (1000 * 60)) / 60); // Difference in minutes
                    return {
                        ...act,
                        timeDiff,
                    };
                });

                // Calculate the total time difference
                const totalTimeDiff = modifiedActivity.reduce((total, act) => total + act.timeDiff, 0);

                // Set the modifiedActivity and totalTimeDiff in state
                setActivity(modifiedActivity);
                setTotalTimeDiff(totalTimeDiff);
                console.log("totaltime");
                console.log(totalTimeDiff);
            } catch (error) {
                console.error(error);
            }
        }
        fetchProject();
        fetchActivity();
        setTotalTimeDiff(totalTimeDiff);
        setnow(handleProgressBar(totalTimeDiff));
    }, [project, totalTimeDiff]); // Add project to the dependency array if needed


    //     const [image, setImage] = useState('');

    //     const upload = () => {
    //         if (image == null)
    //             return;
    //         const imageref = storage.ref(`/images/${image.name}`).put(image)
    //         .on("state_changed", alert("succsess"), alert);

    //         imageref();
    // }

    function deleteProject(projectID) {
        try {
            const response = fetch(
                `${path}ListProjects/${projectID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            const json = response.json();
            setProjDel(json);
        } catch (error) {
            console.log("error");
        }
    };



    console.log("deadline in ",deadline);

    const handleEditClick = async () => {
        const updatedproject = {
          Description: projectDescription,
          Deadline: deadline,
          isDone: false
        };
        setIsEditing(!isEditing);
        if (isEditing) {
          try {
            console.log("////////////////////////////////////");
            console.log("updatedproject", updatedproject);
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
            console.log("json", json);
          } catch (error) {
            console.log("error", error);
          }
          setShow(true);
        }
      };
      
    function handleProgressBar(totalTimeDiff) {
        if (totalTimeDiff) {
            const total = 15;
            const result = (totalTimeDiff / total * 100).toFixed(0);
            console.log("result");
            console.log(result);
            return result;
        } else {
            return 0;
        }
    }

    const handleShowImages = () => {
        const storageRef = firebase.storage().ref();
        const imagesRef = storageRef.child('images');

        imagesRef.listAll().then((res) => {
            const urls = [];
            res.items.forEach((itemRef) => {
                itemRef.getDownloadURL().then((url) => {
                    urls.push(url);
                });
            });
            setImageURLs(urls);
        });
    };
    const getPhotosFromStorage = async () => {
        const storageRef = storage.ref();
        const imagesRef = storageRef.child('images');

        const imagesSnapshot = await imagesRef.listAll();

        const imageUrls = await Promise.all(
            imagesSnapshot.items.map(async (itemRef) => {
                const url = await itemRef.getDownloadURL();
                return url;
            })
        );

        return imageUrls;
    };
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [photos, setPhotos] = useState([]);

    const openPopup = async () => {
        const imageUrls = await getPhotosFromStorage();
        setPhotos(imageUrls);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const Popup = ({ photos, onClose }) => {
        const [hoveredImage, setHoveredImage] = useState(null);

        const handleImageHover = (imageUrl) => {
            setHoveredImage(imageUrl);
        };

        const handleImageLeave = () => {
            setHoveredImage(null);
        };

        const deleteImage = async (imageUrl, event) => {
            event.preventDefault();
            try {
                // Delete the image from Firebase storage
                const imageRef = storage.refFromURL(imageUrl);
                await imageRef.delete();

                // Remove the image from the state
                setPhotos((prevPhotos) => prevPhotos.filter((url) => url !== imageUrl));
            } catch (error) {
                console.log("Error deleting image:", error);
            }
        };
        return (
            <div className="popup">
                <div className="popup-inner">
                    <button className="close-button" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="gallery">
                        {photos.map((url) => (
                            <div
                                key={url}
                                className="image-container"
                                onMouseEnter={() => handleImageHover(url)}
                                onMouseLeave={handleImageLeave}
                            >
                                <img src={url} alt="Photo" className="photo" />
                                {hoveredImage === url && (
                                    <button
                                        className="delete-button"
                                        onClick={(event) => deleteImage(url, event)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div>
            <Row>
                <Col lg={12}>
                    <Toast style={{ marginBottom: '20px', width: '100%', justifyContent: 'center' }} onClose={() => setShow(false)} show={show} delay={3000} autohide>
                        <Toast.Body style={{ backgroundColor: '#d3ffdf' }}>הפרויקט נשמר בהצלחה</Toast.Body>
                    </Toast>
                </Col>
            </Row>
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
                                            <FormControl disabled className='input' type="text" defaultValue={projectGet.CustomerName || ''} />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                                <Col lg={2}>
                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                        <Form.Label>תאריך הכנסה</Form.Label>
                                        <Form.Control disabled className='datePicker' type="date" defaultValue={InsertDate}/>
                                    </Form.Group>
                                </Col>
                                <Col lg={2}>
                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                        <Form.Label>תאריך הגשה</Form.Label>
                                        <Form.Control disabled={!isEditing} className='datePicker' type="date" defaultValue={Deadline} onChange={(e) => setdeadline(e.target.value)}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                                        <Form.Label>תיאור
                                        </Form.Label>
                                        <Form.Control disabled={!isEditing} as="textarea" rows={4} defaultValue={projectGet.Description} onChange={(e) => setprojectDescription(e.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button onClick={openPopup} color={buttonColor} className='btn-contract' type="button">קבצים</Button>
                                    <input
                                        type="file"
                                        ref={contractFileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleFileInputChange}
                                    />
                                    {isPopupOpen && <Popup photos={photos} onClose={closePopup} />}
                                </Col>
                                <Col style={{ display: 'flex', textalign: 'left', justifyContent: 'end' }}>
                                    <Button className="trash" onClick={() => { deleteProject(project.ProjectID) }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </Col>
                            </Row>
                            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button className='btn-gradient-purple' type="button" onClick={handleEditClick}>
                                    {isEditing ? "שמירה" : "עריכה"}
                                </Button>
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
                                    <Form.Group style={{ textAlign: 'right', textAlign: 'center' }}>
                                        <Form.Label >שם משימה</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={4} >
                                    <Form.Group style={{ textAlign: 'right', textAlign: 'center' }}>
                                        <Form.Label >שעות פעילות</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={4} >
                                    <Form.Group style={{ textAlign: 'right', textAlign: 'center' }}>
                                        <Form.Label >סה"כ שעות</Form.Label>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {activity
                                .map((act) => (
                                    <Row className="project-row" key={act.TaskName}>
                                        <Col lg={4} className="custname" style={{ textAlign: 'right' }}>
                                            {act.TaskName}
                                        </Col>
                                        <Col lg={4} className="custname" style={{ textAlign: 'center' }}>
                                            {new Date(act.StartDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}-
                                            {new Date(act.EndDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}                                    </Col>
                                        <Col lg={4} className="custname" style={{ textAlign: 'center' }}>
                                            {act.timeDiff}
                                        </Col>
                                    </Row>
                                ))}
                            <br />
                            <ProgressBar className='progBar' now={now} label={`${now}%`} bg='custom-shade' />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Form >
        </div>
    )
}
