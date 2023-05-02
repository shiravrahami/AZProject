import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';

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
    const [customers, setCustomers] = useState([]);
    const [customersDel, setCustomersDel] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const { custSet } = useUserContext();
    const navigate = useNavigate();


    const handleSearch = (event) => {
        setSearchValue(event.target.value);
    };
    
    useEffect(() => {
        async function fetchCustomers() {
            try {
                const response = await fetch("https://proj.ruppin.ac.il/cgroup95/prod/api/CustomerTasks/GetCustomerTasks", {
                    method: "GET",
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                });
                const json = await response.json();
                setCustomers(json || []); 
            } catch (error) {
                console.error(error);
            }
        }
        fetchCustomers();
    }, []);
    
    function deleteCustomers(customerPK) {
        try {
            const response = fetch(
                `https://proj.ruppin.ac.il/cgroup95/prod/api/ListCustomers/${customerPK}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            );
            const json = response.json();
            setCustomersDel(json);
        } catch (error) {
            console.log("error");
        }
    }
    const passCust = (customer) => {
        console.log(customer.CustomerPK);
        console.log(customer);
        navigate('/customer', { state: customer.CustomerPK }); 
    }

    return (
        <div className='custtable'>
            <Row>
                <Form className='projclass' style={{width:'95%', borderRadius: '20px ', margin: '20px', padding: '20px' }}>
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
                                        <div className="search-bar">
                                            <div className="input-group">
                                                <Form.Control type="text" placeholder="חיפוש לקוח" className='serachinput' style={{ backgroundColor: '#f7f7f7' }} onChange={handleSearch} />
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
                <Col lg={4}>
                    שם הלקוח
                </Col>
                <Col lg={4}>
                    משימות פתוחות
                </Col>
                <Col lg={3}>
                    סה"כ משימות
                </Col>
                <Col lg={1}></Col>
            </Row>
            <Row>
                {customers
                    .filter((customer) => customer.CustomerName.includes(searchValue))
                    .map((customer) => (
                        <Row className="customer-row" key={customer.CustomerName}>
                            <Col style={{testAlign:'right'}} lg={4} className="custname" onClick={() => passCust(customer)}>
                                {customer.CustomerName}
                            </Col>
                            <Col lg={4}>{customer.TotalopenCount}</Col>
                            <Col lg={3}>{customer.CountTasks}</Col>
                            <Col lg={1}>
                                <Button className="trash" onClick={() => {
                                    deleteCustomers(customer.CustomerPK);
                                    setCustomers(customers.filter((c) => c.CustomerPK !== customer.CustomerPK));
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
