import React, {useEffect} from "react";
import { connect } from "react-redux";
import { authenticate } from "../store";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box } from "@mui/material";
import io from 'socket.io-client';

export const Container = styled.div``;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const InputDiv = styled.div`
  display: flex;
  justify-content: center;
`;

export const Input = styled.input`
  padding: 10px;
  width: 40%;
  border-radius: 8px;
  border: 1px solid #f5c7a9;
  color: #3fa796;

  ::placeholder {
    color: #3fa796;
    margin-left: 5px;
  }
`;

export const Button = styled.button`
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #f5c7a9;
  width: 50%;
  background-color: #3fa796;
  color: #f5c7a9;
  margin-right: auto;
  margin-left: auto;
  cursor: pointer;
`;

export const GitDiv = styled.div`
  display: flex;
  alignitems: center;
`;
export const Title = styled.span`
  font-size: 10px;
  text-align: center;
  color: #f5c7a9;
`;

export const URL = styled.a`
  display: flex;
  margin-left: auto;
  margin-right: auto;
  width: 25%;
  align-items: center;
  padding: 5px;
  min-height: 20px;
  background-color: #24292e;
  font-size: 14px;
  color: #f5c7a9;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const GitLogo = styled.svg`
  fill: #f5c7a9;
`;

export const PasswordDiv = styled.div`
  margin-top: 10px;
`;

let socket;

const AuthForm = (props) => {
  const { name, displayName, handleSubmit, error } = props;

  useEffect(() => {
    socket = io();

    return () => socket.emit("forceDisconnect");
  }, []);

  return (
    <Box>
      {displayName === "Login" ? (
        <Container>
          <Form onSubmit={handleSubmit} name={name}>
            <InputDiv>
              <Input placeholder="Enter Username" name="username" type="text" />
            </InputDiv>
            <InputDiv>
              <Input
                placeholder="Enter Password"
                name="password"
                type="password"
              />
            </InputDiv>
            {error && error.response && <div> {error.response.data} </div>}
            <GitDiv>
              <URL href="/auth/github">
                <GitLogo height="15" viewBox="0 0 16 16" width="40px">
                  <path
                    fillRule="evenodd"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
1.08.58 1.23.82.72 1.21 1.87.87
2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12
0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08
2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0
.21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                  />
                </GitLogo>
                <Title>GitHub</Title>
              </URL>
            </GitDiv>
            <Button>{displayName}</Button>
            <PasswordDiv>
              <Link to="/passwordResetRequest">
                <Title>Forgot password?</Title>
              </Link>
            </PasswordDiv>
          </Form>
        </Container>
      ) : (
        <Container>
          <Form onSubmit={handleSubmit} name={name}>
            <InputDiv>
              <Input placeholder="Enter Username" name="username" type="text" />
            </InputDiv>
            <InputDiv>
              <Input
                placeholder="Enter Password"
                name="password"
                type="password"
              />
            </InputDiv>
            {error && error.response && <div> {error.response.data} </div>}
            <Button style={{ marginTop: 10 }}>{displayName}</Button>
          </Form>
        </Container>
      )}
    </Box>
  );
};

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: "login",
    displayName: "Login",
    error: state.auth.error,
  };
};

const mapSignup = (state) => {
  return {
    name: "signup",
    displayName: "Sign Up",
    error: state.auth.error,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const username = evt.target.username.value;
      const password = evt.target.password.value;
      dispatch(authenticate(username, password, formName));
      socket.emit('createUser');
    },
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);
