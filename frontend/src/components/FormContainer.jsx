import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function FormContainer({ children }) {
return (
<div className='d-flex justify-content-center align-items-center min-vh-100' >
<Container>
    <Row className="justify-content-md-center">
        <Col xs={12} md={6} lg={4} style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', borderRadius: '8px', padding: '30px', backgroundColor: '#fff' }}>
            {children}
        </Col>
    </Row>
</Container>
</div>
)
}

export default FormContainer