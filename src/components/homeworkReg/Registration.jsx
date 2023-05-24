import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { signIn } from "../../store/userSlice";
import { getUsers } from "../../store/userSlice";

import defAvatar from "../../images/defAvatar.jpg";

import { useSnackbar } from "notistack";

import s from "./reg.module.scss";

import star from "./star.png";

const endpoint = "http://localhost:3001/";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      className={s.reg}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Registration = () => {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [value, setValue] = React.useState(0);
  const [checked, setChecked] = useState(false);

  const [register, setRegister] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const emailInputChangeHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordInputChangeHandler = (e) => {
    setPassword(e.target.value);
  };

  const registerInputChangeHandler = (e) => {
    const { value, name } = e.target;
    setRegister((data) => {
      return {
        ...data,
        [name]: value,
      };
    });
  };

  const submitSignUp = (e) => {
    e.preventDefault();
    if (email && password) {
      dispatch(
        signIn({
          email,
          password,
        })
      );
    }
  };

  const submitRegister = async () => {
    if (
      register.email &&
      register.password &&
      checked &&
      register.confirm &&
      register.password === register.confirm
    ) {
      fetch(endpoint + "users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: register.email,
          password: register.password,
          avatar: defAvatar,
          friends: [],
        }),
      });
      setRegister({
        email: "",
        password: "",
        confirm: "",
      });
      setChecked(!checked);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={s.tabs}>
      <img src={star} alt="star" className={s.star} />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }} className={s.reg}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="basic"
            indicatorColor="basic"
            aria-label="basic tabs example"
            sx={{ width: "100%" }}
          >
            <Tab label="Sign up" {...a11yProps(0)} sx={{ width: "50%" }} />
            <Tab label="Register" {...a11yProps(1)} sx={{ width: "50%" }} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <form className={s.form} name="login">
            <label>
              <div className={s.title}>Email address</div>
              <input
                type="text"
                name="email"
                value={email}
                onChange={emailInputChangeHandler}
                placeholder="Your email"
                className={s.inputs}
              />
            </label>
            <label>
              <div className={s.title}>Password</div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={passwordInputChangeHandler}
                placeholder="Password"
                className={s.inputs}
              />
            </label>
            <button
              className={s.submitButton}
              type="submit"
              onClick={submitSignUp}
            >
              Sign in
            </button>
          </form>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className={s.inpwrap}>
            <form className={s.form}>
              <label>
                <div className={s.title}>Email address</div>
                <input
                  type="email"
                  name="email"
                  value={register.email}
                  onChange={registerInputChangeHandler}
                  placeholder="Your email"
                  className={s.inputs}
                />
              </label>
              <label>
                <div className={s.title}>Password</div>
                <input
                  type="password"
                  name="password"
                  value={register.password}
                  onChange={registerInputChangeHandler}
                  placeholder="Password"
                  className={s.inputs}
                />
              </label>
              <label>
                <div className={s.title}>Confirm</div>
                <input
                  type="password"
                  name="confirm"
                  value={register.confirm}
                  onChange={registerInputChangeHandler}
                  placeholder="Confirm"
                  className={s.inputs}
                />
              </label>
              <label className={s.accept}>
              <div>
                <input
                  type="checkbox"
                  name="accept"
                  value={checked}
                  onChange={() => setChecked(!checked)}
                  className={s.accept}
                  checked={checked}
                />
                I accept the terms and privacy policy</div>
              </label>
              <button
                className={`${s.submitButton} ${s.register}`}
                type="submit"
                onClick={submitRegister}
              >
                Register
              </button>
            </form>
          </div>
        </TabPanel>
      </Box>
    </div>
  );
};

export default Registration;
