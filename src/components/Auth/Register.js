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
} from 'semantic-ui-react';
import firebase from '../../firebase';

import { Link } from 'react-router-dom';

const Register = () => {
  /* -------------------------------------------------------------------------- */
  /*                                    state                                   */
  /* -------------------------------------------------------------------------- */

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRef] = useState(firebase.firestore().collection('users'));

  /* -------------------------------------------------------------------------- */
  /*                                function                                    */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ isFormCorrect ----------------------------- */

  const isFormValid = () => {
    let errors = [];
    let error;

    if (isFormEmpty()) {
      error = { message: 'Fill in all fields' };
      console.log(error);
      setErrors(errors.concat(error));
      return false;
    } else if (!isPasswordValid()) {
      error = { message: 'Password is invalid' };
      setErrors(errors.concat(error));
      return false;
    } else {
      return true;
    }
  };

  const isFormEmpty = () => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  const isPasswordValid = () => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  /* ------------------------------ displayErrors ----------------------------- */

  let displayErrors = () =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  /* ------------------------------ handleChange ------------------------------ */

  const usernameChange = (e) => {
    setUsername(e.target.value);
  };
  const emailChange = (e) => {
    setEmail(e.target.value);
  };
  const passwordChange = (e) => {
    setPassword(e.target.value);
  };
  const passwordConfirmationChange = (e) => {
    setPasswordConfirmation(e.target.value);
  };

  /* ------------------------------ handleSubmit ------------------------------ */

  const handleSubmit = (e) => {
    if (isFormValid()) {
      setErrors([]);
      setLoading(true);
      e.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((createdUser) => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              saveUser(createdUser).then(() => {
                console.log('user saved');
              });
            })
            .catch((err) => {
              console.error(err);
              setErrors(errors.concat(err));
              setLoading(false);
            });
        })
        .catch((err) => {
          console.error(err);
          setErrors(errors.concat(err));
          setLoading(false);
        });
    }
  };

  /* -------------------------------- saveUser -------------------------------- */

  const saveUser = (createdUser) => {
    return userRef.doc(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
      id: createdUser.user.uid,
    });
  };

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
          <Icon name='puzzle piece' color='orange' />
          Register for DevChat
        </Header>
        <Form onSubmit={handleSubmit} size='large'>
          <Segment stacked>
            <Form.Input
              fluid
              name='user'
              icon='user'
              iconPosition='left'
              placeholder='Username'
              onChange={usernameChange}
              value={username}
              type='text'
            />
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
            <Form.Input
              fluid
              name='passwordConfirmation'
              icon='repeat'
              iconPosition='left'
              placeholder='Password Confirmation'
              onChange={passwordConfirmationChange}
              value={passwordConfirmation}
              className={handleInputError('password')}
              type='password'
            />

            <Button
              disabled={loading}
              className={loading ? 'loading' : ''}
              color='orange'
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
          Already a user?
          <Link to='/login'>Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
