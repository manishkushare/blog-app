import React from "react";
import { USER_VERIFY_URL as USER_URL,USER_TOKEN_KEY } from "../utils/constants";
import { withRouter } from "react-router-dom";
import UserContext from "./UserContext";
class Settings extends React.Component {
  static contextType = UserContext;
  constructor(props) {
    super();
    this.state = {
      email : "",
      username: "",
      bio: "",
      image: "",
      password: "",
      errors: {
        email:"",
        error:""
      }
    }
  }
  async componentDidMount() {
    // const token = this.props.user.token;
    // const username = this.props.user.username;
    const userInfo = this.context;
    console.log(userInfo);
    try {
      let user = await fetch(USER_URL, {
        method: "GET",
        headers: {
          'Authorization' : `Token ${userInfo.user.token}`
        }
      });
      if (user.ok) {
        user = await user.json();
        let { email="", password="", username="", bio="", image="" } = user.user;
        
        this.setState({
          email,password,username,bio,image
        })
        
      } else {
        user = await user.json();
        user = await Promise.reject(user);
        return user;
      }
      
    } catch ({errors}) {
      this.setState((prevState) => {
        return {
          ...prevState,
          errors: {
            ...prevState.errors,
            error : "Something went wrong!!!"
          }
        }
      })
    }
    
  }
  handleChange = ({ target }) => {
    const { errors } = this.state;
    const name = target.name;
    const value = target.value;
    if (name === "email") {
      errors.email = this.validateEmail(value) ? "" : "email is not valid";
    }
    this.setState({
      errors,
      [name]: value
    })
  }
  validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    const token = this.context.user.token;
    let { email, password, bio, image, username } = this.state;
    let userObj = {};
    if (email) {
      userObj.email = email;
    }
    if (password) {
      userObj.password = password;
    }
    if (bio) {
      userObj.bio = bio;
    }
    if (image) {
      userObj.image = image;
    }
    if (username) {
      userObj.username = username;
    }
    // console.log(userObj);
    try {
      let user = await fetch(USER_URL, {
        method: "PUT",
        headers: {
          'Content-type': 'application/json',
          "Authorization" : `Token ${token}`
        },
        body: JSON.stringify({
          user: userObj
        })
      })
      if (user.ok) {
        user = await user.json();
        // console.log(user);
        this.context.persistUser(user.user);
        return this.props.history.push('/settings');

      } else {
        user = await user.json();
        user = await Promise.reject(user);
        return user;
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  handleLogOut = () => {
    this.context.logOutUser();
    return this.props.history.push('/');


  }
  render() {
    const { error, email: emailError } = this.state.errors;
    const { email , password, username, bio, image } = this.state;
    return (
      <section className="settings">
        <div className="container flex justify-center ">
          <form
            action={USER_URL}
            onSubmit={this.handleSubmit}
            className="flex flex-col w-80"
          >
            <legend>Your Settings</legend>
            {error ? <span>{error}</span> : null}
            <input
              type="text"
              name="image"
              value={image}
              onChange={this.handleChange}
            />
            <input type="text"
              placeholder="url of picture profile"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
            <input
              type="text"
              placeholder="username"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
            <textarea
              name="bio"
              id=""
              cols="30"
              rows="10"
              placeholder="Short bio about you"
              value={bio}
              onChange={this.handleChange}
            ></textarea>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={email}
              onChange={this.handleChange}
            />
            {
              emailError ? <span>{emailError}</span> : null
            }
            <input
              type="password" name=""
              placeholder="New Password"
              value={password ? password : ""}
              onChange={this.handleChange}
            />
            <div className="flex justify-end border-bottom padding-y-2rem">
              <button type="submit">Update Profile</button>
            </div>
            <div className="padding-y-2rem">
              <button onClick={this.handleLogOut}>Log Out</button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}
export default withRouter(Settings);
