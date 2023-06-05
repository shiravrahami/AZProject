import React, { useState, useEffect, useContext } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Styles/Profile.css';
import Form from 'react-bootstrap/Form';
import { Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import UserContext from '../UserContext';
import { useUserContext } from '../UserContext';
import Toast from 'react-bootstrap/Toast';
import { storage } from '../../firebase';

export default function FCProfile() {

    const [isEditing, setIsEditing] = useState(false);
    const { user, updateUser } = useUserContext();

    const [employeeEmail, setemployeeEmail] = useState(user.EmployeeEmail);
    const [employeeName, setemployeeName] = useState(user.EmployeeName);
    const [employeeID, setemployeeID] = useState(user.EmployeeID);
    const [employeePhone, setemployeePhone] = useState(user.EmployeePhone);
    const [employeeTitle, setemployeeTitle] = useState(user.EmployeeTitle);
    const [employeePassword, setemployeePassword] = useState(user.EmployeePassword);
    const [employeePhoto, setemployeePhoto] = useState(user.EmployeePhoto);
    const [show, setShow] = useState(false);
    const [image, setImage] = useState(user.EmployeePhoto);
    const [progress, setProgress] = useState(0);
    const [user1, setUser1] = useState(null);


    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setemployeePhoto(e.target.files[0]);
        }
    };

    const handleEditClick = () => {
        console.log(employeePhoto);
        const updatedUser = {
            EmployeeEmail: employeeEmail,
            EmployeeName: employeeName,
            EmployeeID: employeeID,
            EmployeePhone: employeePhone,
            EmployeeTitle: employeeTitle,
            EmployeePassword: employeePassword,
            EmployeePhoto: image ? image.name : null
        };
        setIsEditing(!isEditing);
        console.log(user.EmployeePK + ' ' + updatedUser.EmployeePassword + ' ' + updatedUser.EmployeePhoto + ' ' + updatedUser.EmployeeTitle);

        if (isEditing) {
                console.log('77777777777'+user.EmployeePK + ' '+user.ID + ' ' + updatedUser.EmployeeName);
                try {
                  const response = fetch(`https://proj.ruppin.ac.il/cgroup95/prod/api/EmployeeUpdate/${user.EmployeePK}`, {
                    method: "PUT",
                    body: JSON.stringify(updatedUser),
                    headers: new Headers({
                      'Accept': 'application/json; charset=UTF-8',
                      'Content-type': 'application/json; charset=UTF-8'
                    })
                  });
                  const json = response.json();
                  setUser1(json);
                } catch (error) {
                  console.log("error", error);
                } 
                
              }

            setShow(true);
        
        handleUpload();
    };

    console.log('proflie: ' + user.EmployeeEmail + ' ' + user.EmployeeName + ' ' + user.EmployeePK + ' photo:' + user.EmployeePhoto + ' image:' + image.name);

    const handleUpload = () => {
        console.log("upload start");
        if (image) {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Get the upload progress
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    // Handle any upload errors
                    console.log(error);
                },
                () => {
                    // Handle successful upload
                    storage
                        .ref('images')
                        .child(image.name)
                        .getDownloadURL()
                        .then((url) => {
                            // Do something with the image URL
                            console.log(url);
                        })
                        .catch((error) => {
                            // Handle any download URL errors
                            console.log(error);
                        });
                }
            );
        }
    };
    return (
        <div className='container'>
            <Row>
                <Col lg={12}>
                    <Toast style={{ marginBottom: '20px', width: '100%', justifyContent: 'center' }} onClose={() => setShow(false)} show={show} delay={3000} autohide>
                        <Toast.Body style={{ backgroundColor: '#d3ffdf' }}>העובד נשמר בהצלחה</Toast.Body>
                    </Toast>
                </Col>
            </Row>
            <Row>
                <Col style={{ width: '95%', borderRadius: '30px ', margin: '20px', padding: '20px', backgroundColor: 'rgb(247, 247, 247)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                    <Form style={{ direction: 'rtl' }}>
                        <Form.Label className='profileTitle'>
                            פרופיל אישי
                        </Form.Label>
                        <Row className="div-ImageUpload">
                            <label htmlFor="upload-input" className="image-upload-label">
                                <div className="circle">
                                    {<img className="profileImage" src={image ? image : user.EmployeePhoto} />}
                                    {!image && <div className="placeholder"></div>}
                                </div>
                                <input
                                    disabled={!isEditing}
                                    id="upload-input"
                                    type="file"
                                    onChange={handleChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </Row>

                        <Form.Label className='labelemail' style={{ textAlign: 'right', display: 'flex' }}> שם עובד</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ textAlign: 'right', fontSize: 30 }}>
                            <InputGroup>
                                <FormControl className='input' type="text" placeholder={user.EmployeeName} defaultValue={user.EmployeeName} style={{ textAlign: 'right', fontSize: 20 }} onChange={(e) => setemployeeName(e.target.value)} disabled={!isEditing} />
                            </InputGroup>
                        </Form.Group>

                        <Form.Label className='labelemail' style={{ textAlign: 'right', display: 'flex' }}> אי-מייל</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ textAlign: 'right', fontSize: 30 }}>
                            <InputGroup>
                                <FormControl className='input' disabled={!isEditing} type="email" placeholder={user.EmployeeEmail} defaultValue={user.EmployeeEmail} style={{ textAlign: 'right', fontSize: 20 }} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" onChange={(e) => setemployeeEmail(e.target.value)} />
                            </InputGroup>
                        </Form.Group>

                        <Form.Label className='labelemail' style={{ textAlign: 'right', display: 'flex' }}> תעודת זהות</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ textAlign: 'right', fontSize: 30 }}>
                            <InputGroup>
                                <FormControl className='input' disabled={!isEditing} type="tel" placeholder={user.EmployeeID} defaultValue={user.EmployeeID} style={{ textAlign: 'right', fontSize: 20 }} onChange={(e) => setemployeeID(e.target.value)} />
                            </InputGroup>
                        </Form.Group>

                        <Form.Label className='labelemail' style={{ textAlign: 'right', display: 'flex' }}>מספר טלפון</Form.Label>
                        <Form.Group className="mb-3" controlId="formBasicEmail" style={{ textAlign: 'right', fontSize: 30 }}>
                            <InputGroup>
                                <FormControl className='input' disabled={!isEditing} type="tel" placeholder={user.EmployeePhone} defaultValue={user.EmployeePhone} style={{ textAlign: 'right', fontSize: 20 }} onChange={(e) => setemployeePhone(e.target.value)} />
                            </InputGroup>
                        </Form.Group>

                    </Form>
                </Col>
                {/* <Col style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src={process.env.PUBLIC_URL + '/ProfileDemo.png'}
                            alt='profile_picture'
                            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                        />
                        <label style={{ marginTop: '10px', fontSize: '30px' }}>Hello {user.EmployeeName}</label>
                    </div>
                </Col> */}
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Button className='btn-gradient-purple' type="button" onClick={handleEditClick}>
                    {isEditing ? "שמירה" : "עריכה"}
                </Button>
            </Row>
        </div>
    )
}