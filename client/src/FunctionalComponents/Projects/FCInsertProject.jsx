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
import '../../Styles/Task.css';
import { useUserContext } from '../UserContext';

export default function FCInsertProject() {    
  const { path } = useUserContext();    
  const [setcustomer] = useState(null);
  const [CustomerIDInput, setCustomerIDInput] = useState();
  const [CustomerNameInput, setCustomerNameInput] = useState();
  const [CustomerEmailInput, setCustomerEmailInput] = useState();
  const [CustomerAddressInput, setCustomerAddressInput] = useState();
  const [CustomerPhoneInput, setCustomerPhoneInput] = useState();
  const [CustomerTypeInput, setCustomerTypeInput] = useState("חודשי");
  const [isPotentialInput, setisPotentialInput] = useState();
  const [show, setShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const contractFileInputRef = useRef(null);
  const [buttonColor, setButtonColor] = useState('primary');

  const contractButton = () => {
    contractFileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setButtonColor('secondary');
    }
  };

  // useEffect(() => {
  //   if (isChecked == undefined) {
  //     setIsChecked = false;
  //   }
  //   else {
  //     setIsChecked = true;
  //   }
  // }, []);

  const InsertCustomer = async () => {
    console.log("starting func");
    console.log(isPotentialInput);
    const NewCustomer = {
      CustomerID: CustomerIDInput,
      CustomerName: CustomerNameInput,
      CustomerEmail: CustomerEmailInput,
      CustomerAdress: CustomerAddressInput,
      CustomerPhone: CustomerPhoneInput,
      CustomerType: CustomerTypeInput,
      isPotential: isPotentialInput
    };
    console.log(NewCustomer);

    try {
      const response = await fetch(`${path}InsertCustomer`, {
        method: "PUT",
        body: JSON.stringify(NewCustomer),
        headers: new Headers({
          'Accept': 'application/json; charset=UTF-8',
          'Content-type': 'application/json; charset=UTF-8'
        })
      });
      const json = await response.json();
      setcustomer(json);
    } catch (error) {
      console.log("error", error);
    }
    setShow(true);
  };

  const handleCheckboxChange = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    setisPotentialInput(newState);
  };

  return (
    <div>
      <Row>
        <Col lg={12}>
          <Toast style={{ marginBottom: '20px', width: '100%', justifyContent: 'center' }} onClose={() => setShow(false)} show={show} delay={3000} autohide>
            <Toast.Body style={{ backgroundColor: '#d3ffdf' }}>
              <FontAwesomeIcon icon={faCheck} />
              {"  "}הלקוח נוסף בהצלחה
            </Toast.Body>
          </Toast>
        </Col>
      </Row>
      <Form className='taskclass' style={{ borderRadius: '20px ', margin: '20px', padding: '20px', width: '95%' }}>
        <Accordion alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
          <Accordion.Item>
            <Accordion.Header style={{ alignItems: 'left', fontSize: '20px' }}>לקוח חדש </Accordion.Header>
            <Accordion.Body >
              <Row >
                <Form.Group style={{ textAlign: 'right' }}>
                  <Form.Label >שם לקוח</Form.Label>
                  <InputGroup>
                    <FormControl className='input' type="text" onChange={(e) => setCustomerNameInput(e.target.value)} />
                  </InputGroup>
                </Form.Group>
              </Row >
              <Row >
                <Form.Group style={{ textAlign: 'right' }}>
                  <Form.Label >ח"פ / ת"ז</Form.Label>
                  <InputGroup>
                    <FormControl className='input' type="text" onChange={(e) => setCustomerIDInput(e.target.value)} />
                  </InputGroup>
                </Form.Group>
              </Row >
              <Row >
                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicEmail">
                  <Form.Label >אימייל</Form.Label>
                  <InputGroup>
                    <FormControl style={{ textAlign: 'right' }} className='input' type="email" onChange={(e) => setCustomerEmailInput(e.target.value)} />
                  </InputGroup>
                </Form.Group>
              </Row >
              <Row >
                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                  <Form.Label>כתובת</Form.Label>
                  <Form.Control className='input' type="text" onChange={(e) => setCustomerAddressInput(e.target.value)} />
                </Form.Group>
              </Row >
              <Row >
                <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                  <Form.Label>מס' טלפון</Form.Label>
                  <Form.Control className='input' type="tel" onChange={(e) => setCustomerPhoneInput(e.target.value)} />
                </Form.Group>
              </Row >
              <Row>
                <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                  <Form.Label>סוג הלקוח</Form.Label>
                  <Form.Select style={{ fontSize: '20px', textAlign: 'right' }} onBlur={(e) => setCustomerTypeInput(e.target.value)}>
                    <option value="חודשי">חודשי</option>
                    <option value="שעתי">שעתי</option>
                  </Form.Select>
                </Form.Group>
              </Row >
              <Row style={{ paddingTop: "15px" }}>
                <Col lg={1} style={{ width: "50px" }}>
                  <Form.Check
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                </Col>
                <Col lg={10} style={{ padding: "0px" }}>
                  <Form.Label padding="0px">לקוח פוטנציאלי</Form.Label>
                </Col>
                <Col lg={1} style={{ textAlign:"left"}}>
                <Button onClick={contractButton} color={buttonColor} className='btn-contract' type="button">עותק חוזה</Button>
                  <input
                    type="file"
                    ref={contractFileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />
                </Col>
              </Row >
              <Row style={{ display: 'flex', justifyContent: 'center' }}>
                <Button className='btn-gradient-purple' type="button" onClick={InsertCustomer}>הוסף</Button>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Form >
    </div>
  )
}

