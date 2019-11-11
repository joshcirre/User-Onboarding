import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import styled from 'styled-components';

const Style = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  form {
    width: 400px;
    border: 1px solid black;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    input {
      width: 100%;
      margin: 0.5rem;
      padding: 12px;
      margin: 8px 0;
      display: inline-block;
      border: 1px solid #ccc;
      box-sizing: border-box;
      &[type='checkbox'] {
        width: 1rem;
      }
    }
    label {
      align-self: flex-end;
    }
    p {
      height: 0.5rem;
      font-size: 0.7rem;
      margin-top: 0;
      align-self: flex-end;
      color: red;
    }
    button {
      border: 1px solid black;
      width: 100%;
      padding: 0.5rem;
      background-color: white;
      &:active {
        background-color: gray;
      }
      &:hover {
        background-color: lightgray;
      }
    }
  }
`;
const UserList = styled.div`
  div {
    border: 1px solid black;
    border-radius: 5px;
    width: 430px;
    margin: 1rem;
    h2 {
      border-bottom: 1px solid black;
      padding: 0 1rem;
    }
    h4,
    p {
      margin: 0.5rem;
    }
  }
`;

function Signup({ status, errors, touched, isSubmitting }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status) setUsers(existingUsers => [...existingUsers, status]);
  }, [status]);

  return (
    <>
      <Form>
        <Field type='text' name='name' placeholder='Name' />
        {touched.name && errors.name && <span>{errors.name}</span>}
        <Field type='email' name='email' placeholder='Email' />
        {touched.email && errors.email && <span>{errors.email}</span>}
        <Field type='password' name='password' placeholder='Password' />
        {touched.password && errors.password && <span>{errors.password}</span>}
        <label>
          <Field type='checkbox' name='tos' /> Accept the Terms of Service
        </label>
        {touched.tos && errors.tos && <span>{errors.tos}</span>}
        <button type='submit' disabled={isSubmitting}>
          Submit!
        </button>
      </Form>
      {users.map(user => (
        <div key={user.id}>
          <h2>Name: {user.name}</h2>
          <h4>Email: {user.email}</h4>
          <p>Account created at {user.createdAt}</p>
        </div>
      ))}
    </>
  );
}

export default withFormik({
  mapPropsToValues({ name, password, email, tos }) {
    return {
      name: name || '',
      email: email || '',
      password: password || '',
      tos: tos || false
    };
  },
  validationSchema: yup.object().shape({
    name: yup.string().required('Please provide your name'),
    email: yup
      .string()
      .email('Please provide a valid email address')
      .required('Please provide your email'),
    password: yup
      .string()
      .min(6, 'Please set a password at least 6 characters long')
      .required('Please set a password at least 6 characters long'),
    tos: yup.bool().oneOf([true], 'You must accept the Terms of Service')
  }),
  handleSubmit(values, { setStatus, resetForm, setErrors, setSubmitting }) {
    if (values.email === 'waffle@syrup.com') {
      setErrors({ email: 'That email is already taken' });
    } else {
      axios
        .post('https://reqres.in/api/users', values)
        .then(res => {
          setStatus(res.data);
          resetForm();
          setSubmitting(false);
        })
        .catch(err => {
          console.log(err);
          setSubmitting(false);
        });
    }
  }
})(Signup);
