import React, { useState, useEffect, useRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Accordion, Button, InputGroup, FormControl, Collapse } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import '../../Styles/FCInsertPriceQuote.css';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function PDFContent() {
    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate();
    const [CustomerNameInput, setCustomerNameInput] = useState();
    const contractFileInputRef = useRef(null);
    const [buttonColor, setButtonColor] = useState('primary');
    // Add more state variables for additional rows if needed
    const formRef = useRef(null);

    console.log("state", state);
    const handleDownloadPDF = () => {
        const formElement = formRef.current;

        // Custom CSS styles for PDF export
        const pdfStyles = `
    body {
      font-size: 12px; /* Adjust the font size as needed for the PDF */
      font-family: Arial, sans-serif; /* Specify the desired font family */
      /* Add other CSS styles here to adjust the content appearance in the PDF */
    }
    .accordionCust {
      /* Add any specific styles for the accordion elements in the PDF */
      margin-bottom: 10px; /* Example: Add some margin at the bottom of each accordion item */
      border: 1px solid #ccc; /* Example: Add a border around the accordion items */
      padding: 10px; /* Example: Add some padding inside the accordion items */
    }`;
        // Generate the PDF with custom styles
        html2pdf()
            .set({
                filename: `${CustomerNameInput} הצעת מחיר.pdf`,
                margin: 10,
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                // Add custom styles for the PDF
                // You can also load external CSS file if needed: css: ['/path/to/custom-styles.css'],
                css: pdfStyles,
            })
            .from(formElement)
            .save();
    };

    const handleFileInputChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setButtonColor('secondary');
        }
    };

    return (
        <div>
            <Form className='taskclass' style={{ borderRadius: '20px ', margin: '20px', padding: '20px', width: '95%' }} ref={formRef}>
                <Accordion alwaysOpen className="accordionCust" style={{ alignItems: 'left', direction: 'rtl' }}>
                    <Accordion.Item>
                        <Accordion.Header style={{ alignItems: 'left', fontSize: '20px' }}>הצעת מחיר</Accordion.Header>
                        <Accordion.Body >
                            <Row>
                                <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                    <Form.Label>לקוח: {state.selectedCustomerName}</Form.Label>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                    <Form.Label>פירוט הצעת מחיר: {state.taskDescription}</Form.Label>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                    <Form.Label>מחיר לפני מע"מ: {state.totalResult}</Form.Label>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group style={{ textAlign: 'right' }} controlId="CustType">
                                    <Form.Label>מחיר סופי: {state.totalPrice}</Form.Label>
                                </Form.Group>
                            </Row>

                            <Row style={{ paddingTop: "15px" }}>
                                <Col lg={1} style={{ textAlign: "left" }}>
                                    <Button color={buttonColor} onClick={handleDownloadPDF} className='btn-contract' type="button">ייצוא לPDF</Button>
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
            </Form >
        </div>
    )
}

