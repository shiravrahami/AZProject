import React, { useState ,useEffect} from 'react';
import { Accordion, Button, InputGroup, FormControl, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Customers.css';
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



const PinkSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: pink[600],
        '&:hover': {
            backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: pink[600],
    },
}));

const label = { inputProps: { 'aria-label': 'Color switch demo' } };
export default function FCCustomers() {
const [customers, setCustomer] = useState([]);
useEffect(() => {
    fetchdata();
}, []);
async function fetchdata() {
    await fetch("https://194.90.158.74/cgroup95/prod/api/Listcustomers", {
        method: 'GET',
        headers: new Headers({
            'Accept': 'application/json; charset=UTF-8',
            'Content-type': 'application/json; charset=UTF-8'
        })
    })
        .then(res => {
            return res.json()
        })
        .then(
            (result) => {
                setCustomer(result)
                console.log(result);
            },
            (error) => {
                console.log("err get=", error);
            });
}

    return (
        <div className='custtable'>
            <Row>
                <Col className='imgLogo' style={{ display: 'flex', justifyContent: 'center' }}>
                    <img style={{ width: '20%' }} src={process.env.PUBLIC_URL + '/LogoWithoutDesc.jpg'} alt="Logo" /><br /><br />
                </Col>
                <Form className='projclass' style={{ borderRadius: '20px ', margin: '20px', padding: '20px' }}>
                    <Accordion defaultActiveKey={['0']} alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }} flush>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header style={{ backgroundColor: '#f7f7f7', alignItems: 'left', fontSize: '20px' }}>לקוחות</Accordion.Header>
                            <Accordion.Body style={{ backgroundColor: '#f7f7f7' }}>
                                <Row>
                                    <Col >
                                        <Button className='btn-filter'>סנן</Button>
                                    </Col>
                                    <Col className='switch'>
                                        <FormControlLabel
                                            value="end"
                                            control={<Switch {...label} defaultChecked color="secondary" />}
                                            label="הצג לקוחות בלי משימות פתוחות"
                                            labelPlacement="start"
                                            className='switch'
                                            style={{ fontFamily: 'Calibri, sans-serif' }}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form className="search-bar">
                                            <div className="input-group">
                                                <Form.Control type="text" placeholder="חיפוש לקוח" className='serachinput' style={{ backgroundColor: '#f7f7f7' }} />
                                                <div className="input-group-append" >
                                                    <span className="input-group-text" style={{ backgroundColor: '#f7f7f7' }}>
                                                        <FontAwesomeIcon icon={faSearch} />
                                                        <Button className='trash' >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                        <Button className="btn-link">
                                                            <FontAwesomeIcon icon={faEllipsisV} />
                                                        </Button>
                                                    </span>
                                                </div>
                                            </div>
                                        </Form>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Form>
            </Row>
            <Row>
                <Col>
                    בחר
                </Col>
                <Col>
                    שם הלקוח
                </Col>
                <Col>
                    משימות פתוחות
                </Col>
                <Col>
                    סה"כ משימות
                </Col>
            </Row>
            {customers.map((customer) => (
            <Row key={customer.id}>
                <Col className='check' style={{ textAlign: 'center' }}>
                    <InputGroup className="mb-3" style={{ textAlign: 'center' }}>
                        <InputGroup.Checkbox aria-label="Checkbox for following text input" />
                    </InputGroup>
                </Col>
                <Col className='col1'>
                {customer.name}
                </Col>
                <Col className='col2'>
                {customer.openTasks}
                </Col>
                <Col className='col3'> 
                {customer.totalTasks}
                </Col>
            </Row>
             ))}
        </div >
    )
}
