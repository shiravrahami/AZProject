import React, { useState, useEffect, useRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Accordion, Button, InputGroup, FormControl, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Toast from 'react-bootstrap/Toast';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import '../../Styles/InsertProject.css';
import { useUserContext } from '../UserContext';
import firebase from 'firebase/compat/app';

export default function FCInsertProject() {
  const { path } = useUserContext();
  const [setProject] = useState(false);
  const [customersNames, setCustomersNames] = useState([]);
  const [newProjectName, setnewProjectName] = useState();
  const [newDescription, setnewDescription] = useState();
  const [newCustomerID, setNewCustomerID] = useState();
  const [newDeadline, setnewDeadline] = useState();
  const [show, setShow] = useState(false);
  const contractFileInputRef = useRef(null);
  const [buttonColor, setButtonColor] = useState('primary');
  const [folderName, setFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);


  const insertDate = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).split('/').reverse().join('-');

  const InsertProject = async () => {
    const NewProject = {
      ProjectName: newProjectName,
      CustomerPK: newCustomerID,
      Description: newDescription,
      InsertDate: new Date().toISOString(),
      Deadline: newDeadline,
    };
    console.log(NewProject);
    try {
      const response = await fetch(`${path}InsertProject`, {
        method: "POST",
        body: JSON.stringify(NewProject),
        headers: new Headers({
          'Accept': 'application/json; charset=UTF-8',
          'Content-type': 'application/json; charset=UTF-8'
        })
      });
      const json = await response.json();
      setProject(json);
      handleUpload();
    } catch (error) {
      console.log("error", error);
    }
    setShow(true);
  };

  useEffect(() => {
    async function fetchCustomerNames() {
      try {
        const response = await fetch(`${path}ListCustomers`, {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        const json = await response.json();
        setCustomersNames(json || []);
        console.log("customersNames", customersNames);
        console.log("customersNames", json);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCustomerNames();
  }, []);

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };
  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };
  const handleUpload = () => {
    const storageRef = firebase.storage().ref();
    const folderRef = storageRef.child(folderName);

    selectedFiles.forEach((file) => {
      const fileRef = folderRef.child(file.name);
      fileRef.put(file)
        .then(() => {
          console.log(`${file.name} uploaded successfully.`);
        })
        .catch((error) => {
          console.error(`Error uploading ${file.name}:`, error);
        });
    });
  };
  return (
    <div>
      <Row>
        <Col lg={12}>
          <Toast style={{ marginBottom: '20px', width: '100%', justifyContent: 'center' }} onClose={() => setShow(false)} show={show} delay={3000} autohide>
            <Toast.Body style={{ backgroundColor: '#d3ffdf' }}>
              <FontAwesomeIcon icon={faCheck} />
              {"  "}הפרויקט נוסף בהצלחה
            </Toast.Body>
          </Toast>
        </Col>
      </Row>
      <Form className='taskclass' style={{ borderRadius: '20px ', margin: '20px', padding: '20px', width: '95%' }}>
        <Accordion alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
          <Accordion.Item>
            <Accordion.Header style={{ alignItems: 'left', fontSize: '20px' }}>פרויקט חדש </Accordion.Header>
            <Accordion.Body >
              <Row >
                <Form.Group style={{ textAlign: 'right' }}>
                  <Form.Label >שם הפרויקט</Form.Label>
                  <InputGroup>
                    <FormControl defaultValue={folderName} onChange={(e) => setnewProjectName(e.target.value)} className='input' type="text" />
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row >
                <Col lg={8}>
                  <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                    <Form.Label>שם הלקוח</Form.Label>
                    <Form.Select style={{ fontSize: '20px', textAlign: 'right' }} onChange={(e) => setNewCustomerID(e.target.value)}>
                    <option>בחר לקוח</option>
                      {customersNames.map((customerName) => (
                        <option key={customerName.ID} value={customerName.ID}>
                          {customerName.CustomerName}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={2}>
                  <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                    <Form.Label>תאריך הכנסה</Form.Label>
                    <Form.Control disabled className='datePicker' type="date" defaultValue={insertDate} />
                  </Form.Group>
                </Col>
                <Col lg={2}>
                  <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                    <Form.Label>תאריך הגשה</Form.Label>
                    <Form.Control className='datePicker' type="date" onChange={(e) => setnewDeadline(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Row >
                <Form.Group style={{ textAlign: 'right' }}>
                  <Form.Label >תיאור</Form.Label>
                  <InputGroup>
                    <Form.Control as="textarea" rows={9} onChange={(e) => setnewDescription(e.target.value)} />
                  </InputGroup>
                </Form.Group>
              </Row >
              <Row style={{ paddingTop: "15px" }}>
                <Col lg={1} style={{ textAlign: "left" }}>
                  <input
                    type="file"
                    style={{ display: 'none' }}
                    multiple
                    onChange={handleFileSelection}
                    ref={contractFileInputRef} />
                  <Button
                    color={buttonColor}
                    className='btn-contract'
                    type="button"
                    onClick={() => contractFileInputRef.current.click()}>
                    הוספת קבצים
                  </Button>
                </Col>
              </Row >
              <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Button className='btn-gradient-purple' type="button" onClick={InsertProject}>הוסף</Button>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Form >
    </div >
  )
}

