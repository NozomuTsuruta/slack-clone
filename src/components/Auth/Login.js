import React, { useState } from 'react';
import md5 from 'md5';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
  FormSelect,
} from 'semantic-ui-react';
import firebase from '../../firebase';

import { Link } from 'react-router-dom';

const Login = () => {
  /* -------------------------------------------------------------------------- */
  /*                                    state                                   */
  /* -------------------------------------------------------------------------- */

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                function                                    */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ displayErrors ----------------------------- */

  let displayErrors = () =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  /* ------------------------------ handleChange ------------------------------ */

  const emailChange = (e) => {
    setEmail(e.target.value);
  };
  const passwordChange = (e) => {
    setPassword(e.target.value);
  };

  /* ------------------------------ handleSubmit ------------------------------ */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      setErrors([]);
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((signedInUser) => {
          console.log(signedInUser);
        })
        .catch((err) => {
          console.error(err);
          setErrors(errors.concat(err));
          setLoading(false);
        });
    }
  };

  /* ------------------------------- isFormValid ------------------------------ */
  const isFormValid = () => email && password;

  /* ---------------------------- handleInputError ---------------------------- */

  const handleInputError = (inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? 'error'
      : '';
  };

  /* -------------------------------------------------------------------------- */
  /*                                     JSX                                    */
  /* -------------------------------------------------------------------------- */

  return (
    <Grid textAlign='center' verticalAlign='middle' className='app'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' icon color='orange' textAlign='center'>
          <Icon name='code branch' color='violet' />
          Login to DevChat
        </Header>
        <Form onSubmit={handleSubmit} size='large'>
          <Segment stacked>
            <Form.Input
              fluid
              name='email'
              icon='mail'
              iconPosition='left'
              placeholder='Email Address'
              onChange={emailChange}
              value={email}
              className={handleInputError('email')}
              type='email'
            />
            <Form.Input
              fluid
              name='password'
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              onChange={passwordChange}
              value={password}
              className={handleInputError('password')}
              type='password'
            />

            <Button
              disabled={loading}
              className={loading ? 'loading' : ''}
              color='violet'
              fluid
              size='large'
            >
              Submit
            </Button>
          </Segment>
        </Form>
        {errors.length > 0 && (
          <Message error>
            <h3>Error</h3>
            {displayErrors()}
          </Message>
        )}
        <Message>
          Don't have an account?
          <Link to='/register'>Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
