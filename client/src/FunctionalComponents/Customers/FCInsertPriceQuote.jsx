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
import '../../Styles/FCInsertPriceQuote.css';
import { useUserContext } from '../UserContext';

export default function FCInsertPriceQuote() {
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
  /////////////////////////////////////////////////////////////////////////////
  const [customersNames, setCustomersNames] = useState([]);
  const [newCustomerID, setNewCustomerID] = useState();
  const [taskTypes, setTaskTypes] = useState([]);
  const [addedRows, setAddedRows] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const [priceBeforeTax, setPriceBeforeTax] = useState(0);
  const [persentDiscount, setpersentDiscount] = useState();
  const [totalPrice, setotalPrice] = useState();
  const [mulPrice, setMulPrice] = useState(0);
  const secondColumnInputRef = useRef(null);
  const custTypeSelectRef = useRef(null);
  const [row1Visible, setRow1Visible] = useState(false);
  const [row2Visible, setRow2Visible] = useState(false);
  // Add more state variables for additional rows if needed
  const [CustomerTypeSelect, setCustomerTypeSelect] = useState(1);

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
    const fetchTaskTypes = async () => {
      try {
        const response = await fetch(`${path}TaskTypes`);
        const data = await response.json();
        setTaskTypes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCustomerNames();
    fetchTaskTypes();
  }, []);

  /////////////////////////////////////////////////////////////////////////////
  const handleFileInputChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setButtonColor('secondary');
    }
  };

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

  const contractButton = () => {
    const newRow = (
      <Row>
        <Col lg={10}>
          <Form.Group style={{ textAlign: 'right' }}>
            <Form.Label>פירוט משימה</Form.Label>
            <InputGroup>
              <FormControl className='input' type="text" />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col lg={1}>
          <Form.Group style={{ textAlign: 'right' }} className='hourOfWork'>
            <Form.Label>שעות עבודה</Form.Label>
            <InputGroup>
              <FormControl
                className='input'
                type="text"
                onChange={(e) => {
                  handleInputChange(addedRows.length, e.target.value);
                  calculateMul();
                }}
                defaultValue={"0"} />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col lg={1}>
          <Form.Group style={{ textAlign: 'right' }} controlId="TaskType">
            <Form.Label>סוג משימה</Form.Label>
            <Form.Select style={{ fontSize: '20px', textAlign: 'right' }} ref={custTypeSelectRef}
              onChange={calculateMul}>
              <option>בחר</option>
              {taskTypes.map(taskType => {
                let value = "";
                if (taskType.TaskTypeID === 1) { value = "100"; } // ניהול
                else if (taskType.TaskTypeID === 2) { value = "250"; } // עיצוב
                else if (taskType.TaskTypeID === 3) { value = "150"; } // פיתוח
                return (
                  <option key={taskType.TaskTypeID} value={value}>
                    {taskType.TaskKind}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    );
    setAddedRows(prevRows => [...prevRows, newRow]);
  };

  const handleInputChange = (index, value) => {
    setInputValues(prevValues => {
      const updatedValues = [...prevValues];
      updatedValues[index] = value;
      return updatedValues;
    });
  };

  const calculateTotalSum = () => {
    const sumOfInputValues = inputValues.reduce((sum, value) => sum + parseInt(value), 0);
    return sumOfInputValues;
  };

  const calculateMul = () => {
    const hours = parseFloat(inputValues[addedRows.length - 1] || 0);
    const selectedValue = parseFloat(custTypeSelectRef.current?.value || 0);
    const result = hours * selectedValue;
    console.log("result", result);
    setMulPrice(result);
  };

  useEffect(() => {
    calculateMul();
  }, [inputValues[addedRows.length - 1], custTypeSelectRef.current && custTypeSelectRef.current.value]);
  const handleCustomerTypeChange = (event) => {
    const selectedType = parseInt(event.target.value);
    setCustomerTypeSelect(selectedType);

    // Toggle the visibility of rows based on selectedType
    if (selectedType === 1) {
      setRow1Visible(true);
      setRow2Visible(true);
      // Set visibility for additional rows if needed
    } else {
      setRow1Visible(false);
      setRow2Visible(false);
      // Set visibility for additional rows if needed
    }
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
            <Accordion.Header style={{ alignItems: 'left', fontSize: '20px' }}>הצעת מחיר</Accordion.Header>
            <Accordion.Body >
              <Row>
                <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                  <Form.Label>לקוח</Form.Label>
                  <Form.Select style={{ fontSize: '20px', textAlign: 'right' }} onChange={handleCustomerTypeChange}>
                    <option>בחר לקוח</option>
                    <option value={1}>לקוח חדש+</option>
                    {customersNames.map((customerName) => (
                      <option key={customerName.ID} value={customerName.ID}>
                        {customerName.CustomerName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>

              {row1Visible && (
                <>
                  <Row >
                    <Col>
                      <Form.Group style={{ textAlign: 'right' }}>
                        <Form.Label >שם לקוח</Form.Label>
                        <InputGroup>
                          <FormControl className='input' type="text" onChange={(e) => setCustomerNameInput(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group style={{ textAlign: 'right' }}>
                        <Form.Label >ח"פ / ת"ז</Form.Label>
                        <InputGroup>
                          <FormControl className='input' type="text" onChange={(e) => setCustomerIDInput(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row >
                  <Row >
                    <Col>
                      <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicEmail">
                        <Form.Label >אימייל</Form.Label>
                        <InputGroup>
                          <FormControl style={{ textAlign: 'right' }} className='input' type="email" onChange={(e) => setCustomerEmailInput(e.target.value)} />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                        <Form.Label>מס' טלפון</Form.Label>
                        <Form.Control className='input' type="tel" onChange={(e) => setCustomerPhoneInput(e.target.value)} />
                      </Form.Group>
                    </Col>
                  </Row >
                  <Row >
                    <Form.Group style={{ textAlign: 'right' }} className="" controlId="formBasicPassword">
                      <Form.Label>כתובת</Form.Label>
                      <Form.Control className='input' type="text" onChange={(e) => setCustomerAddressInput(e.target.value)} />
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
                      // onChange={handleCheckboxChange}
                      />
                    </Col>
                    <Col lg={10} style={{ padding: "0px" }}>
                      <Form.Label padding="0px">לקוח פוטנציאלי</Form.Label>
                    </Col>
                  </Row >
                </>
              )
              }

              {/* <Row >
                <Col lg={10}>
                  <Form.Group style={{ textAlign: 'right' }}>
                    <Form.Label >פירוט משימה</Form.Label>
                    <InputGroup>
                      <FormControl className='input' type="text" />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col lg={1}>
                  <Form.Group style={{ textAlign: 'right' }}>
                    <Form.Label >שעות עבודה</Form.Label>
                    <InputGroup>
                      <FormControl className='input' type="text" onChange={(e) => setAnotherHour(e.target.value)} defaultValue={"0"} />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col lg={1}>
                  <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                    <Form.Label >סוג משימה</Form.Label>
                    <Form.Select onChange={(e) => settaskTypeRow(e.target.value)} style={{ fontSize: '20px', textAlign: 'right' }}>
                      <option>בחר</option>
                      {taskTypes.map(taskType => {
                        let value = "";
                        if (taskType.TaskTypeID === 1) { value = "100"; }// ניהול
                        else if (taskType.TaskTypeID === 2) { value = "250"; }// עיצוב
                        else if (taskType.TaskTypeID === 3) { value = "150"; }// פיתוח
                        return (
                          <option key={taskType.TaskTypeID} value={value}>
                            {taskType.TaskKind}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row > */}
              {addedRows.map((row, index) => (
                <React.Fragment key={index}>
                  {row}
                </React.Fragment>
              ))}
              <Row style={{ paddingTop: "15px" }}>
                <Col lg={1} style={{ textAlign: "left" }}>
                  <Button onClick={contractButton} color={buttonColor} className='btn-contract' type="button">הוסף משימה</Button>
                  <input
                    type="file"
                    ref={contractFileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />
                </Col>
              </Row >
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <br />
        <Accordion alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
          <Accordion.Item>
            <Accordion.Body >
              <Row>
                <Form.Label style={{ fontWeight: 'bold' }}>סיכום הצעת מחיר</Form.Label>
              </Row>
              <Row style={{ justifyContent: 'space-between' }}>
                <Col lg={2}>
                  <Form.Group style={{ textAlign: 'right' }}>
                    <Form.Label >סה"כ שעות עבודה</Form.Label>
                    <InputGroup>
                      <FormControl className='input' type="text" value={calculateTotalSum()} readOnly defaultValue={"0"} />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col lg={2}>
                  <Form.Group style={{ textAlign: 'right' }} className='priceBeforeTax'>
                    <Form.Label >מחיר לפני מע"מ</Form.Label>
                    <InputGroup>
                      <FormControl className='input' type="text" value={priceBeforeTax} readOnly />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col lg={2}>
                  <Form.Group style={{ textAlign: 'right' }}>
                    <Form.Label >הנחה באחוזים</Form.Label>
                    <InputGroup>
                      <FormControl className='input' type="text" onChange={(e) => setpersentDiscount(e.target.value)} defaultValue={"%"} />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col lg={2}>
                  <Form.Group style={{ textAlign: 'right', fontWeight: 'bold' }} controlId="CustType">
                    <Form.Label >מחיר סופי</Form.Label>
                    <InputGroup>
                      <FormControl className='input' type="text" value={totalPrice} defaultValue={"0"} readOnly />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row >
              <Row style={{ paddingTop: "15px" }}>
                <Col lg={1} style={{ textAlign: "left" }}>
                  <Button onClick={contractButton} color={buttonColor} className='btn-contract' type="button">ייצוא לPDF</Button>
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

        {/* <Accordion alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
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
        </Accordion> */}
      </Form >
    </div>
  )
}

