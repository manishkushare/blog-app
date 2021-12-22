import React from "react";
import { Link, Redirect } from "react-router-dom";
import { SIGN_IN } from "../utils/constants";
import {withRouter } from"react-router-dom"
class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {
        email: "",
        password: "",
        error: "",
      },
      redirect: null,
    };
  }
  validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  validatePassword = (password) => {
    if (
      password.length >= 6 &&
      password.match(/^(?=.{6,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/)
    ) {
      return true;
    } else return false;
  };
  validateDisable = () => {
    if (
      this.state.email &&
      this.state.password &&
      !this.state.errors.email.trim() &&
      !this.state.errors.password.trim()
    ) {
      console.log("true");
      return false;
    } else return true;
  };
  handleChange = ({ target }) => {
    const name = target.name;
    const value = target.value;
    const errors = this.state.errors;

    switch (name) {
      case "email":
        errors.email = this.validateEmail(value) ? "" : "Email is Invalid";
        break;
      case "password":
        errors.password = this.validatePassword(value)
          ? ""
          : "Password must contains atleast 6 characters, one small case and big case alphabets, one numeric value and one special character";
        break;
    }

    this.setState({
      errors,
      [name]: value,
    });
  };

  handleSubmit = async (event) => {
    const { email, password } = this.state;
    let errors = { ...this.state.errors };
    event.preventDefault();
    try {
      let user = await fetch(SIGN_IN, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          user: {
            password,
            email,
          },
        }),
      });
      if (!user.ok) {
        user = await user.json();
        user = await Promise.reject(user);
        return user;
      }
      user = await user.json();
      this.props.persistUser(user.user);
      this.setState({ email: "", password: "" });
      this.props.history.push('/');
    } catch (error) {
      console.log(error);
      this.setState(prevState => {
        return {
          ...prevState,
          errors: {
            ...prevState.errors,
            email : "Email or Password is Incorrect"
          }
          
        }
      });
      
    }
  };
  render() {
    const { email, password, error } = this.state.errors;
    
    return (
      <section className="sign-up">
        <div className="container flex justify-center">
          <form
            action={this.baseURL + "users/login"}
            onSubmit={this.handleSubmit}
            method="post"
            className="flex  flex-col w-40"
          >
            <div className="flex flex-col align-item-center">
              <h2>Log In</h2>
              <Link to="#">
                <h2>Don't have an account?</h2>
              </Link>
            </div>

            <label className="flex flex-col" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="email"
              name="email"
              id="email"
              onChange={this.handleChange}
              value={this.state.email}
              className={email ? "error" : ""}
            />
            <span>{email}</span>
            <label className="flex flex-col" htmlFor="">
              Password
            </label>
            <input
              type="password"
              placeholder="password"
              name="password"
              id="password"
              onChange={this.handleChange}
              value={this.state.password}
              className={password ? "error" : ""}
            />
            <span>{password}</span>
            <div className="flex justify-end">
              <button type="submit" disabled={this.validateDisable()}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}
export default withRouter(SignIn);
