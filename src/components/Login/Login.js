import React, { useState, useEffect, useReducer, useContext, useRef } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../store/auth-context";
import Input from "../input/Input";

const emailReducer = (state, action) => {
  if (action.type === "USER_EMAIL") {
    return {
      ...state,
      emailValue: action.paylaod,
    };
  }
  if (action.type === "EMAIL_BLUR") {
    return {
      ...state,
      emailIsValid: state.emailValue.includes("@"),
    };
  }
  return { ...state };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_PASSWORD") {
    return {
      ...state,
      passwordValue: action.payload,
    };
  }
  if (action.type === "PASSWORD_BLUR") {
    return {
      ...state,
      passwordIsValid: state.passwordValue.trim().length > 6,
    };
  }
  return { ...state };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [state, dispatch] = useReducer(emailReducer, {
    emailValue: "",
    emailIsValid: null,
  });

  const [PWstate, PWdispatch] = useReducer(passwordReducer, {
    passwordValue: "",
    passwordIsValid: null,
  });
  const authCtx = useContext(AuthContext);
  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  // useEffect(() => {
  //   console.log('EFFECT RUNNING');

  //   return () => {
  //     console.log('EFFECT CLEANUP');
  //   };
  // }, []);

  const { emailIsValid: emailValid } = state;
  const { passwordIsValid: passwordValid } = PWstate;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Checking form validity!");
      setFormIsValid(emailValid && passwordValid);
    }, 500);

    return () => {
      console.log("CLEANUP");
      clearTimeout(identifier);
    };
  }, [emailValid, passwordValid]);

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    dispatch({
      type: "USER_EMAIL",
      paylaod: event.target.value,
    });

    // setFormIsValid(
    //   // event.target.value.includes('@') && state.passwordValue.trim().length > 6
    //   event.target.value.includes('@') && PWstate.passwordIsValid
    // );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    PWdispatch({
      type: "USER_PASSWORD",
      payload: event.target.value,
    });

    // setFormIsValid(
    //   // state.emailValue.includes('@') && event.target.value.trim().length > 6
    //   state.emailIsValid && event.target.value.trim().length > 6
    // );
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(state.emailIsValid);
    dispatch({
      type: "EMAIL_BLUR",
    });
  };

  const validatePasswordHandler = () => {
    // setPasswordIsValid(PWstate.passwordValue.trim().length > 6);
    PWdispatch({
      type: "PASSWORD_BLUR",
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    
    if(formIsValid){
      authCtx.onLogin(state.emailValue, PWstate.passwordValue);
      
    }else if(!emailValid){
      emailInputRef.current.focus()
    }else{
      passwordInputRef.current.focus()
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
        ref={emailInputRef}
          id="email"
          label="E-mail"
          type="email"
          isValid={emailValid}
          value={state.emailValue}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
        ref ={passwordInputRef}
        id="password"
        label="Password"
        type='password'
        isValid={passwordValid}
        value={state.passwordValue}
        onChange={passwordChangeHandler}
        onBlur={validatePasswordHandler}
        />

        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
