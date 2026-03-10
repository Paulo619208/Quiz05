import React from 'react'
import FormContainer from '../components/FormContainer'
import { Form } from 'react-bootstrap'
import { useState } from 'react'

function LoginScreen() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const submitHandler = (e) => {
        e.preventDefault()
        console.log('Form submitted')
    }

  return (
    <FormContainer>
        <div className='text-center mb-4'>
            <h1>Welcome Back!</h1>
            <p>Please Sign In to your account</p>
        </div>

        <Form onSubmit={submitHandler}>
            <Form.Group controlId='email' className='mb-3'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
            </Form.Group>
           
            <Form.Group controlId='password' className='mb-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>

            <button type='submit' className='btn btn-primary w-100'>Sign In</button>

        </Form>
    </FormContainer>
  )
}

export default LoginScreen